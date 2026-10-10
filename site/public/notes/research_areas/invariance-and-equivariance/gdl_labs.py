"""GDL G1–G6: reusable PyTorch models, synthetic data, and symmetry checks.

Python 3.10+, PyTorch 2.x. No dataset download or GPU is required.
python gdl_labs.py --unit all --steps 40
The examples check identities, not benchmark performance claims.
"""
from __future__ import annotations

import argparse
import json
from collections.abc import Callable

import torch
from torch import Tensor, nn
from torch.nn import functional as F


def mlp(in_dim: int, out_dim: int, hidden: int = 32) -> nn.Sequential:
    return nn.Sequential(nn.Linear(in_dim, hidden), nn.SiLU(),
                         nn.Linear(hidden, out_dim))


class Trainer:
    """The model and data source are supplied by the caller."""
    def __init__(self, model: nn.Module, loss: Callable[[Tensor, Tensor], Tensor],
                 lr: float = 0.003):
        self.model, self.loss = model, loss
        self.optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    def fit(self, batch_fn: Callable[[], tuple[tuple, Tensor]], steps: int) -> list[float]:
        history = []
        self.model.train()
        for _ in range(steps):
            args, target = batch_fn()
            self.optimizer.zero_grad(set_to_none=True)
            value = self.loss(self.model(*args), target)
            value.backward()
            self.optimizer.step()
            history.append(float(value.detach()))
        return history


class TranslationCNN(nn.Module):
    def __init__(self, in_channels=1, out_channels=1, hidden=16, padding="circular"):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv1d(in_channels, hidden, 3, padding=1, padding_mode=padding),
            nn.SiLU(), nn.Conv1d(hidden, out_channels, 3, padding=1, padding_mode=padding))

    def forward(self, x: Tensor) -> Tensor:
        return self.net(x)


class C4CNN(nn.Module):
    """Lifting + finite-C4 group mixing; output shape B,4,C,H,W.

The spatial features are rotated back to the original spatial frame.
Direction r therefore transforms as h'(u,r)=h(R_q^-1 u,r-q).
Group mixing uses relative orientation and 1x1 spatial kernels.
"""
    def __init__(self, in_channels=1, channels=8):
        super().__init__()
        self.base = nn.Conv2d(in_channels, channels, 3, padding=1)
        self.mix = nn.Parameter(torch.randn(4, channels, channels, 1, 1) * 0.1)
        self.bias = nn.Parameter(torch.zeros(channels))
        self.head = nn.Linear(channels, 1)

    def features(self, x: Tensor) -> Tensor:
        h = torch.stack([
            torch.rot90(self.base(torch.rot90(x, -r, (-2, -1))), r, (-2, -1))
            for r in range(4)], dim=1)
        b, g, c, height, width = h.shape
        out = torch.zeros_like(h)
        for offset in range(4):
            shifted = torch.roll(h, -offset, dims=1).reshape(b * g, c, height, width)
            out = out + F.conv2d(shifted, self.mix[offset]).reshape_as(h)
        return F.silu(out + self.bias[None, None, :, None, None])

    def forward(self, x: Tensor) -> Tensor:
        return self.head(self.features(x).mean((1, 3, 4)))


class SetModel(nn.Module):
    def __init__(self, in_dim=2, hidden=32, out_dim=1, pooling="sum"):
        super().__init__()
        if pooling not in {"sum", "mean", "max"}:
            raise ValueError("pooling must be sum, mean, or max")
        self.phi, self.head = mlp(in_dim, hidden, hidden), mlp(hidden, out_dim, hidden)
        self.pooling = pooling

    def forward(self, x: Tensor, mask: Tensor | None = None) -> Tensor:
        # x: B,N,D; mask: B,N, True for real elements.
        if mask is None:
            mask = torch.ones(x.shape[:2], device=x.device, dtype=torch.bool)
        if not bool(mask.any(dim=1).all()):
            raise ValueError("each example must have at least one valid point")
        h = self.phi(x)
        if self.pooling == "max":
            pooled = h.masked_fill(~mask[..., None], -torch.inf).amax(1)
        else:
            pooled = (h * mask[..., None]).sum(1)
            if self.pooling == "mean":
                pooled = pooled / mask.sum(1, keepdim=True)
        return self.head(pooled)


class SetAttention(nn.Module):
    def __init__(self, in_dim=2, hidden=16):
        super().__init__()
        self.q, self.k, self.v = (nn.Linear(in_dim, hidden) for _ in range(3))

    def forward(self, x: Tensor, mask: Tensor | None = None) -> Tensor:
        q, k, v = self.q(x), self.k(x), self.v(x)
        scores = q @ k.transpose(-1, -2) / q.shape[-1] ** 0.5
        if mask is not None:
            if not bool(mask.any(-1).all()):
                raise ValueError("attention needs at least one valid key")
            scores = scores.masked_fill(~mask[:, None, :], -torch.inf)
        out = scores.softmax(-1) @ v
        return out if mask is None else out * mask[..., None]


class TransformerBlock(nn.Module):
    """Post-norm block with shared row-wise FFN and explicit relation masks.

    valid: B,N, True for real tokens.
    relation_mask: N,N or B,N,N, True for forbidden query-key pairs.
    Each real query must have at least one real, visible key.
    """
    def __init__(self, hidden=24, heads=4):
        super().__init__()
        if hidden % heads:
            raise ValueError("hidden must be divisible by heads")
        self.heads = heads
        self.attention = nn.MultiheadAttention(hidden, heads, dropout=0,
                                                batch_first=True)
        self.norm1, self.norm2 = nn.LayerNorm(hidden), nn.LayerNorm(hidden)
        self.ffn = nn.Sequential(nn.Linear(hidden, 2 * hidden), nn.ReLU(),
                                 nn.Linear(2 * hidden, hidden))

    def forward(self, h: Tensor, valid: Tensor,
                relation_mask: Tensor | None = None) -> Tensor:
        b, n, _ = h.shape
        blocked = (~valid[:, None, :]).expand(b, n, n).clone()
        if relation_mask is not None:
            if relation_mask.dtype != torch.bool:
                raise ValueError("relation_mask uses boolean True = forbidden")
            if relation_mask.shape not in {(n, n), (b, n, n)}:
                raise ValueError("relation_mask must have shape N,N or B,N,N")
            blocked |= relation_mask
        if bool((blocked.all(-1) & valid).any()):
            raise ValueError("each valid query needs a visible valid key")
        # Invalid query rows do not matter, but must avoid all-masked softmax.
        blocked = torch.where(valid[:, :, None], blocked, ~valid[:, None, :])
        attn_mask = blocked.repeat_interleave(self.heads, dim=0)
        update, _ = self.attention(h, h, h, attn_mask=attn_mask,
                                  need_weights=False)
        h = self.norm1(h + update)
        h = self.norm2(h + self.ffn(h))
        return h.masked_fill(~valid[..., None], 0)


class TokenTransformer(nn.Module):
    """Per-token outputs; task readout/loss remains the caller's choice.

    x: B,N,in_dim; positions: B,N,hidden (added after input projection).
    No fixed positional encoding is inserted unless supplied by the caller.
    """
    def __init__(self, in_dim=2, hidden=24, out_dim=2, heads=4, depth=2):
        super().__init__()
        self.embed = nn.Linear(in_dim, hidden)
        self.blocks = nn.ModuleList(TransformerBlock(hidden, heads)
                                    for _ in range(depth))
        self.head = nn.Linear(hidden, out_dim)

    def forward(self, x: Tensor, mask: Tensor | None = None,
                positions: Tensor | None = None,
                relation_mask: Tensor | None = None) -> Tensor:
        if mask is None:
            mask = torch.ones(x.shape[:2], dtype=torch.bool, device=x.device)
        if mask.dtype != torch.bool or mask.shape != x.shape[:2]:
            raise ValueError("mask must be boolean B,N")
        if not bool(mask.any(-1).all()):
            raise ValueError("each example needs a valid token")
        h = self.embed(x.masked_fill(~mask[..., None], 0))
        if positions is not None:
            if positions.shape != h.shape:
                raise ValueError("positions must have shape B,N,hidden")
            h = h + positions
        h = h.masked_fill(~mask[..., None], 0)
        for block in self.blocks:
            h = block(h, mask, relation_mask)
        return self.head(h).masked_fill(~mask[..., None], 0)


class GCN(nn.Module):
    """Dense batched adjacency is convenient for small graphs.

Sparse edge-index aggregation can replace S@H without changing the action.
Padded nodes are masked before/after each layer and excluded from readout.
"""
    def __init__(self, in_dim=2, hidden=24, out_dim=1, layers=2):
        super().__init__()
        dims = [in_dim] + [hidden] * layers
        self.layers = nn.ModuleList(nn.Linear(a, b) for a, b in zip(dims, dims[1:]))
        self.head = mlp(hidden, out_dim)

    def features(self, x: Tensor, adjacency: Tensor, mask: Tensor | None = None) -> Tensor:
        b, n, _ = x.shape
        if mask is None:
            mask = torch.ones(b, n, device=x.device, dtype=torch.bool)
        valid_edges = mask[:, :, None] & mask[:, None, :]
        a = adjacency * valid_edges
        a = a + torch.diag_embed(mask.to(x.dtype))
        degree = a.sum(-1).clamp_min(1)
        s = a / (degree[:, :, None] * degree[:, None, :]).sqrt()
        h = x * mask[..., None]
        for layer in self.layers:
            h = F.silu(layer(s @ h)) * mask[..., None]
        return h

    def forward(self, x: Tensor, adjacency: Tensor, mask: Tensor | None = None) -> Tensor:
        return self.head(self.features(x, adjacency, mask).sum(1))


class EGNNLayer(nn.Module):
    """Scalar features + relative coordinates, with a fully connected graph."""
    def __init__(self, feature_dim: int, hidden=32):
        super().__init__()
        self.message = mlp(2 * feature_dim + 1, hidden, hidden)
        self.weight = mlp(hidden, 1, hidden)
        self.update = mlp(feature_dim + hidden, feature_dim, hidden)

    def forward(self, coordinates: Tensor, features: Tensor,
                mask: Tensor | None = None) -> tuple[Tensor, Tensor]:
        b, n, _ = coordinates.shape
        if mask is None:
            mask = torch.ones(b, n, device=coordinates.device, dtype=torch.bool)
        relative = coordinates[:, :, None, :] - coordinates[:, None, :, :]
        hi = features[:, :, None, :].expand(-1, -1, n, -1)
        hj = features[:, None, :, :].expand(-1, n, -1, -1)
        m = self.message(torch.cat((hi, hj, relative.square().sum(-1, keepdim=True)), -1))
        valid = mask[:, :, None] & mask[:, None, :]
        valid = valid & ~torch.eye(n, device=coordinates.device, dtype=torch.bool)[None]
        m = m * valid[..., None]
        coefficient = self.weight(m).tanh() * valid[..., None]
        count = valid.sum(-1, keepdim=True).clamp_min(1)
        displacement = (relative * coefficient).sum(2) / count
        new_x = coordinates + displacement * mask[..., None]
        new_h = features + self.update(torch.cat((features, m.sum(2)), -1))
        return new_x, new_h * mask[..., None]


class EGNN(nn.Module):
    def __init__(self, in_dim=2, hidden=24, layers=2):
        super().__init__()
        self.embed = nn.Linear(in_dim, hidden)
        self.layers = nn.ModuleList(EGNNLayer(hidden) for _ in range(layers))
        self.readout = mlp(hidden, 1)

    def encode(self, x: Tensor, h: Tensor, mask: Tensor | None = None) -> tuple[Tensor, Tensor]:
        h = self.embed(h)
        for layer in self.layers:
            x, h = layer(x, h, mask)
        return x, h

    def forward(self, x: Tensor, h: Tensor, mask: Tensor | None = None) -> Tensor:
        _, features = self.encode(x, h, mask)
        if mask is not None:
            features = features * mask[..., None]
        return self.readout(features.sum(1))

    def forces(self, x: Tensor, h: Tensor, create_graph=False) -> Tensor:
        # A caller may use this inside an outer no_grad evaluation context.
        with torch.enable_grad():
            if not x.requires_grad:
                x = x.detach().requires_grad_(True)
            energy = self(x, h)
            return -torch.autograd.grad(energy.sum(), x, create_graph=create_graph)[0]


def defect(actual: Tensor, expected: Tensor) -> float:
    """Absolute max defect; never normalize away a zero output."""
    return float((actual.detach() - expected.detach()).abs().amax())


def assert_small(value: float, tolerance=2e-5) -> None:
    if not value < tolerance:
        raise AssertionError(f"defect {value:.3g} >= {tolerance}")


def graph_pair() -> tuple[Tensor, Tensor]:
    cycle, triangles = torch.zeros(6, 6), torch.zeros(6, 6)
    for i in range(6):
        cycle[i, (i + 1) % 6] = cycle[(i + 1) % 6, i] = 1
    for start in (0, 3):
        for i in range(start, start + 3):
            for j in range(start, start + 3):
                if i != j:
                    triangles[i, j] = 1
    return cycle, triangles


def run_unit(unit: int, steps: int) -> dict:
    torch.manual_seed(200 + unit)
    if unit == 1:
        model, dense = TranslationCNN(), nn.Linear(32, 32)
        def batch():
            x = torch.randn(24, 1, 32)
            return (x,), (x + torch.roll(x, 1, -1)) / 2
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x,), _ = batch()
        model.eval()
        expected = torch.roll(model(x), 5, -1)
        value = defect(model(torch.roll(x, 5, -1)), expected)
        broken = defect(dense(torch.roll(x, 5, -1)), torch.roll(dense(x), 5, -1))
        assert_small(value)
        return {"unit": unit, "cnn_defect": value, "dense_defect": broken,
                "initial_loss": history[0], "last_loss": history[-1]}
    if unit == 2:
        model = C4CNN()
        def batch():
            x = torch.randn(16, 1, 9, 9)
            return (x,), x.square().mean((1, 2, 3))[:, None]
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x,), _ = batch()
        model.eval()
        base, scores, feature_errors = model.features(x), [], []
        for q in range(4):
            rotated = torch.rot90(x, q, (-2, -1))
            expected = torch.rot90(torch.roll(base, q, 1), q, (-2, -1))
            feature_errors.append(defect(model.features(rotated), expected))
            scores.append(defect(model(rotated), model(x)))
        for value in feature_errors + scores:
            assert_small(value)
        return {"unit": unit, "feature_defects": feature_errors, "readout_defects": scores,
                "initial_loss": history[0], "last_loss": history[-1]}
    if unit == 3:
        model, attention = SetModel(), SetAttention()
        def batch():
            x = torch.randn(24, 10, 2)
            lengths = torch.randint(3, 11, (24,))
            mask = torch.arange(10)[None, :] < lengths[:, None]
            target = (x.square().sum(-1) * mask).sum(-1, keepdim=True)
            return (x, mask), target
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x, mask), _ = batch()
        p = torch.randperm(10)
        values = [defect(model(x[:, p], mask[:, p]), model(x, mask)),
                  defect(attention(x[:, p], mask[:, p]), attention(x, mask)[:, p])]
        padded = torch.cat((x, torch.randn(24, 4, 2) * 100), 1)
        padded_mask = torch.cat((mask, torch.zeros(24, 4, dtype=torch.bool)), 1)
        values.append(defect(model(padded, padded_mask), model(x, mask)))
        for value in values:
            assert_small(value, 1e-4)
        return {"unit": unit, "set_attention_padding_defects": values,
                "initial_loss": history[0], "last_loss": history[-1]}
    if unit == 4:
        model = TokenTransformer()
        def batch():
            x = torch.randn(16, 8, 2)
            return (x,), x - x.mean(1, keepdim=True)
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x,), _ = batch()
        model.eval()
        p = torch.tensor([3, 0, 7, 2, 6, 1, 5, 4])
        no_position = defect(model(x[:, p]), model(x)[:, p])
        positions = torch.randn(16, 8, 24)
        y = model(x, positions=positions)
        fixed_position = defect(model(x[:, p], positions=positions), y[:, p])
        moved_position = defect(model(x[:, p], positions=positions[:, p]), y[:, p])
        blocked = torch.ones(8, 8, dtype=torch.bool).triu(1)
        y = model(x, relation_mask=blocked)
        moved_relation = defect(model(x[:, p], relation_mask=blocked[p][:, p]), y[:, p])
        mask = torch.ones(16, 8, dtype=torch.bool)
        padded = torch.cat((x, torch.randn(16, 3, 2) * 100), 1)
        padded_mask = torch.cat((mask, torch.zeros(16, 3, dtype=torch.bool)), 1)
        padding = defect(model(padded, padded_mask)[:, :8], model(x, mask))
        for value in (no_position, moved_position, moved_relation, padding):
            assert_small(value)
        if not fixed_position > 1e-3:
            raise AssertionError("fixed positions should distinguish content shuffle")
        # Changing future content cannot change earlier causal outputs.
        future_changed = x.clone()
        future_changed[:, 5:] += 10
        causal = defect(model(future_changed, relation_mask=blocked)[:, :5], y[:, :5])
        assert_small(causal)
        # Mixed valid lengths, jointly shuffled with their mask.
        valid = torch.arange(8)[None] < torch.randint(2, 9, (16,))[:, None]
        valid_shuffle = defect(model(x[:, p], valid[:, p]), model(x, valid)[:, p])
        assert_small(valid_shuffle)
        try:
            model(x, relation_mask=torch.ones(8, 8, dtype=torch.bool))
        except ValueError:
            pass
        else:
            raise AssertionError("all-blocked queries should be rejected")
        return {"unit": unit, "transformer_defect": no_position,
                "fixed_position_defect": fixed_position,
                "joint_position_defect": moved_position,
                "joint_relation_defect": moved_relation,
                "padding_defect": padding, "causal_future_defect": causal,
                "valid_shuffle_defect": valid_shuffle,
                "initial_loss": history[0], "last_loss": history[-1]}
    if unit == 5:
        model = GCN()
        def batch():
            x = torch.rand(24, 7, 2)
            a = (torch.rand(24, 7, 7) > 0.65).float()
            a = torch.maximum(a, a.transpose(-1, -2))
            a = a * (1 - torch.eye(7))
            return (x, a), x.sum((1, 2))[:, None]
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x, a), _ = batch()
        p = torch.randperm(7)
        value = defect(model(x[:, p], a[:, p][:, :, p]), model(x, a))
        node_value = defect(model.features(x[:, p], a[:, p][:, :, p]), model.features(x, a)[:, p])
        cycle, triangles = graph_pair()
        equal_features = torch.ones(1, 6, 2)
        indistinguishable = defect(model(equal_features, cycle[None]),
                                  model(equal_features, triangles[None]))
        for v in (value, node_value, indistinguishable):
            assert_small(v, 1e-4)
        return {"unit": unit, "graph_defect": value, "node_defect": node_value,
                "C6_vs_triangles_gap": indistinguishable,
                "initial_loss": history[0], "last_loss": history[-1]}
    if unit == 6:
        model = EGNN()
        def batch():
            x, h = torch.randn(12, 5, 3), torch.randn(12, 5, 2)
            r = x[:, :, None, :] - x[:, None, :, :]
            # Smooth invariant pair energy, counted once per unordered pair.
            target = r.square().sum(-1).sum((1, 2))[:, None] / 20
            return (x, h), target
        history = Trainer(model, F.mse_loss).fit(batch, steps)
        (x, h), _ = batch()
        q, _ = torch.linalg.qr(torch.randn(3, 3))
        if torch.linalg.det(q) < 0:
            q[:, 0] = -q[:, 0]
        p, shift = torch.randperm(5), torch.tensor([0.7, -0.4, 1.1])
        moved = x[:, p] @ q.T + shift
        encoded, _ = model.encode(x, h)
        moved_encoded, _ = model.encode(moved, h[:, p])
        energy_error = defect(model(moved, h[:, p]), model(x, h))
        position_error = defect(moved_encoded, encoded[:, p] @ q.T + shift)
        forces = model.forces(x, h)
        force_error = defect(model.forces(moved, h[:, p]), forces[:, p] @ q.T)
        total_force = float(forces.sum(1).abs().max())
        mirror = torch.diag(torch.tensor([-1., 1., 1.]))
        mirror_energy_error = defect(model(x @ mirror.T, h), model(x, h))
        for value in (energy_error, position_error, force_error, total_force, mirror_energy_error):
            assert_small(value, 2e-3)
        # Ordered, typed tetrahedron: distances agree; signed volume flips.
        tetra = torch.tensor([[0., 0., 0.], [1., 0., 0.], [0., 1., 0.], [0., 0., 1.]])
        signed = torch.linalg.det((tetra[1:] - tetra[0]).T)
        mirrored = tetra @ mirror.T
        signed_mirror = torch.linalg.det((mirrored[1:] - mirrored[0]).T)
        assert defect(torch.cdist(tetra, tetra), torch.cdist(mirrored, mirrored)) == 0
        assert float(signed) == -float(signed_mirror)
        return {"unit": unit, "energy_defect": energy_error, "position_defect": position_error,
                "force_defect": force_error, "total_force": total_force,
                "reflection_energy_defect": mirror_energy_error,
                "signed_volumes": [float(signed), float(signed_mirror)],
                "initial_loss": history[0], "last_loss": history[-1]}
    raise ValueError("unit must be 1..6")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--unit", choices=["all", "1", "2", "3", "4", "5", "6"], default="all")
    parser.add_argument("--steps", type=int, default=40)
    args = parser.parse_args()
    if args.steps < 1:
        parser.error("--steps must be positive")
    torch.set_num_threads(2)
    units = range(1, 7) if args.unit == "all" else [int(args.unit)]
    for unit in units:
        print(json.dumps(run_unit(unit, args.steps), indent=2))


if __name__ == "__main__":
    main()
