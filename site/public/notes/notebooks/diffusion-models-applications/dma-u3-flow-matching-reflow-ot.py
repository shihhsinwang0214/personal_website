"""U3.5: reusable Flow Matching, Reflow, minibatch OT, Euler, and Heun.

Install:
    pip install torch numpy scipy matplotlib

Run the 2D example:
    python dma-u3-flow-matching-reflow-ot.py

The FlowMatching class does not assume 2D data. To reuse it, provide:
1. a model with forward(x, t) -> velocity shaped like x;
2. source_sampler(batch_size, device);
3. target_sampler(batch_size, device);
4. optionally, another path function or pairer.
"""

from __future__ import annotations

import argparse
from collections.abc import Callable
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from torch import Tensor, nn
from torch.nn import functional as F


Sampler = Callable[[int, torch.device], Tensor]
Pairer = Callable[[Tensor, Tensor], tuple[Tensor, Tensor]]
PathFn = Callable[[Tensor, Tensor, Tensor], tuple[Tensor, Tensor]]


def _broadcast_time(t: Tensor, x: Tensor) -> Tensor:
    """Turn t.shape == [batch] into a shape broadcastable to x."""
    return t.reshape(t.shape[0], *([1] * (x.ndim - 1)))


def linear_path(x0: Tensor, x1: Tensor, t: Tensor) -> tuple[Tensor, Tensor]:
    """Return I_t and dI_t/dt for I_t=(1-t)x0+t x1."""
    tau = _broadcast_time(t, x0)
    xt = (1.0 - tau) * x0 + tau * x1
    reference_velocity = x1 - x0
    return xt, reference_velocity


class FlowMatching:
    """Conditional Flow Matching with replaceable model, data, path, and pairing.

    The only model contract is:
        model(x, t) -> tensor with the same shape as x,
    where t has shape [batch]. The class therefore also works with an image
    model such as a U-Net; only the toy VelocityMLP below assumes 2D vectors.
    """

    def __init__(
        self,
        model: nn.Module,
        source_sampler: Sampler,
        target_sampler: Sampler,
        *,
        path: PathFn = linear_path,
        optimizer_factory: Callable[[object], torch.optim.Optimizer] | None = None,
        device: str | torch.device | None = None,
    ) -> None:
        self.device = torch.device(
            device or ("cuda" if torch.cuda.is_available() else "cpu")
        )
        self.model = model.to(self.device)
        self.source_sampler = source_sampler
        self.target_sampler = target_sampler
        self.path = path
        if optimizer_factory is None:
            optimizer_factory = lambda params: torch.optim.Adam(params, lr=2e-3)
        self.optimizer = optimizer_factory(self.model.parameters())

    def _draw_pairs(
        self,
        batch_size: int,
        *,
        pairer: Pairer | None,
        pair_dataset: tuple[Tensor, Tensor] | None,
    ) -> tuple[Tensor, Tensor]:
        if pair_dataset is None:
            x0 = self.source_sampler(batch_size, self.device)
            x1 = self.target_sampler(batch_size, self.device)
        else:
            stored_x0, stored_x1 = pair_dataset
            ids = torch.randint(
                0,
                stored_x0.shape[0],
                (batch_size,),
                device=stored_x0.device,
            )
            x0 = stored_x0[ids].to(self.device)
            x1 = stored_x1[ids].to(self.device)
        if pairer is not None:
            x0, x1 = pairer(x0, x1)
        return x0, x1

    def fit(
        self,
        *,
        steps: int,
        batch_size: int,
        pairer: Pairer | None = None,
        pair_dataset: tuple[Tensor, Tensor] | None = None,
        log_every: int = 500,
    ) -> list[float]:
        """Train with independent, minibatch-OT, or fixed Reflow pairs."""
        self.model.train()
        losses: list[float] = []
        for step in range(1, steps + 1):
            x0, x1 = self._draw_pairs(
                batch_size, pairer=pairer, pair_dataset=pair_dataset
            )
            t = torch.rand(batch_size, device=self.device)
            xt, reference_velocity = self.path(x0, x1, t)
            prediction = self.model(xt, t)
            loss = F.mse_loss(prediction, reference_velocity)

            self.optimizer.zero_grad(set_to_none=True)
            loss.backward()
            self.optimizer.step()
            losses.append(float(loss.detach()))
            if log_every and (step == 1 or step % log_every == 0):
                print(f"step {step:5d}/{steps}: loss={losses[-1]:.6f}")
        return losses

    @torch.no_grad()
    def integrate(
        self,
        x0: Tensor,
        *,
        n_steps: int,
        solver: str = "euler",
        return_trajectory: bool = False,
    ) -> Tensor:
        """Integrate dx/dt=v_theta(x,t) from t=0 to t=1."""
        if solver not in {"euler", "heun"}:
            raise ValueError("solver must be 'euler' or 'heun'")
        was_training = self.model.training
        self.model.eval()
        x = x0.to(self.device)
        h = 1.0 / n_steps
        trajectory = [x.detach().cpu()] if return_trajectory else None

        for k in range(n_steps):
            t0 = torch.full((x.shape[0],), k * h, device=self.device)
            v0 = self.model(x, t0)
            if solver == "euler":
                x = x + h * v0
            else:
                predicted = x + h * v0
                t1 = torch.full((x.shape[0],), (k + 1) * h, device=self.device)
                v1 = self.model(predicted, t1)
                x = x + 0.5 * h * (v0 + v1)
            if trajectory is not None:
                trajectory.append(x.detach().cpu())

        self.model.train(was_training)
        if trajectory is not None:
            return torch.stack(trajectory)
        return x

    @torch.no_grad()
    def sample(
        self,
        n: int,
        *,
        n_steps: int,
        solver: str = "euler",
        return_trajectory: bool = False,
    ) -> Tensor:
        x0 = self.source_sampler(n, self.device)
        return self.integrate(
            x0,
            n_steps=n_steps,
            solver=solver,
            return_trajectory=return_trajectory,
        )

    @torch.no_grad()
    def make_reflow_dataset(
        self,
        n_samples: int,
        *,
        batch_size: int = 1024,
        n_steps: int = 100,
        solver: str = "heun",
    ) -> tuple[Tensor, Tensor]:
        """Pair each source sample with the endpoint of its current ODE path."""
        starts, ends = [], []
        for first in range(0, n_samples, batch_size):
            count = min(batch_size, n_samples - first)
            x0 = self.source_sampler(count, self.device)
            x1 = self.integrate(x0, n_steps=n_steps, solver=solver)
            starts.append(x0.detach().cpu())
            ends.append(x1.detach().cpu())
        return torch.cat(starts), torch.cat(ends)


def minibatch_ot_pair(x0: Tensor, x1: Tensor) -> tuple[Tensor, Tensor]:
    """Solve quadratic OT between two equally weighted empirical minibatches."""
    try:
        from scipy.optimize import linear_sum_assignment
    except ImportError as exc:
        raise ImportError(
            "minibatch_ot_pair requires scipy; run `pip install scipy`."
        ) from exc

    flat_x0 = x0.detach().flatten(1)
    flat_x1 = x1.detach().flatten(1)
    cost = torch.cdist(flat_x0, flat_x1).square().cpu().numpy()
    rows, cols = linear_sum_assignment(cost)
    rows = torch.as_tensor(rows, device=x0.device)
    cols = torch.as_tensor(cols, device=x1.device)
    return x0[rows], x1[cols]


class VelocityMLP(nn.Module):
    """A small model for the 2D example; replace it for other data."""

    def __init__(self, data_dim: int = 2, hidden_dim: int = 128) -> None:
        super().__init__()
        self.data_dim = data_dim
        self.net = nn.Sequential(
            nn.Linear(data_dim + 1, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, data_dim),
        )

    def forward(self, x: Tensor, t: Tensor) -> Tensor:
        flat = x.flatten(1)
        velocity = self.net(torch.cat([flat, t[:, None]], dim=1))
        return velocity.reshape_as(x)


def sample_gaussian(n: int, device: torch.device) -> Tensor:
    return torch.randn(n, 2, device=device)


def sample_two_moons(n: int, device: torch.device) -> Tensor:
    """Two moons without a scikit-learn dependency."""
    upper = torch.rand(n, device=device) < 0.5
    angle = torch.rand(n, device=device) * torch.pi
    x = torch.empty(n, 2, device=device)
    x[upper, 0] = torch.cos(angle[upper]) - 0.5
    x[upper, 1] = torch.sin(angle[upper]) - 0.25
    x[~upper, 0] = 0.5 - torch.cos(angle[~upper])
    x[~upper, 1] = 0.25 - torch.sin(angle[~upper])
    return 1.45 * x + 0.06 * torch.randn_like(x)


def build_flow(seed: int, device: str | torch.device) -> FlowMatching:
    """The model is created outside FlowMatching and passed into it."""
    torch.manual_seed(seed)
    model = VelocityMLP(data_dim=2, hidden_dim=128)
    return FlowMatching(
        model=model,
        source_sampler=sample_gaussian,
        target_sampler=sample_two_moons,
        device=device,
    )


@torch.no_grad()
def plot_comparison(
    baseline: FlowMatching,
    reflow: FlowMatching,
    batch_ot: FlowMatching,
    *,
    n_samples: int,
    nfe: int,
    output: Path,
) -> None:
    device = baseline.device
    x0 = sample_gaussian(n_samples, device)
    target = sample_two_moons(n_samples, device).cpu()
    panels = [
        ("Target samples", target),
        (f"Independent + Euler\n{nfe} NFE", baseline.integrate(x0, n_steps=nfe, solver="euler").cpu()),
        (f"Independent + Heun\n{nfe} NFE", baseline.integrate(x0, n_steps=nfe // 2, solver="heun").cpu()),
        (f"Reflow + Euler\n{nfe} NFE", reflow.integrate(x0, n_steps=nfe, solver="euler").cpu()),
        (f"Minibatch OT + Euler\n{nfe} NFE", batch_ot.integrate(x0, n_steps=nfe, solver="euler").cpu()),
    ]

    fig, axes = plt.subplots(1, len(panels), figsize=(15, 3.2), constrained_layout=True)
    for axis, (title, samples) in zip(axes, panels):
        points = samples.numpy()
        axis.scatter(points[:, 0], points[:, 1], s=5, alpha=0.45)
        axis.set_title(title, fontsize=10)
        axis.set_xlim(-3, 3)
        axis.set_ylim(-3, 3)
        axis.set_aspect("equal")
        axis.axis("off")
    output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output, dpi=180)
    plt.close(fig)
    print(f"saved comparison to {output}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--steps", type=int, default=2500, help="training steps per model")
    parser.add_argument("--batch-size", type=int, default=256)
    parser.add_argument("--ot-batch-size", type=int, default=128)
    parser.add_argument("--reflow-pairs", type=int, default=20000)
    parser.add_argument("--reflow-solver-steps", type=int, default=50)
    parser.add_argument("--eval-samples", type=int, default=2000)
    parser.add_argument("--eval-nfe", type=int, default=20)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--device", default="cuda" if torch.cuda.is_available() else "cpu")
    parser.add_argument("--output", type=Path, default=Path("u3_5_results.png"))
    args = parser.parse_args()
    if args.eval_nfe % 2:
        raise ValueError("--eval-nfe must be even for a same-NFE Euler/Heun comparison")

    print("\n[1/5] train independent Flow Matching")
    baseline = build_flow(args.seed, args.device)
    baseline.fit(steps=args.steps, batch_size=args.batch_size)

    print("\n[2/5] use the first ODE to create deterministic Reflow pairs")
    reflow_pairs = baseline.make_reflow_dataset(
        args.reflow_pairs,
        batch_size=args.batch_size,
        n_steps=args.reflow_solver_steps,
        solver="heun",
    )

    print("\n[3/5] train a fresh model on the fixed Reflow pairs")
    reflow = build_flow(args.seed + 1, args.device)
    reflow.fit(
        steps=args.steps,
        batch_size=args.batch_size,
        pair_dataset=reflow_pairs,
    )

    print("\n[4/5] train with a new quadratic-OT assignment in every minibatch")
    batch_ot = build_flow(args.seed + 2, args.device)
    batch_ot.fit(
        steps=args.steps,
        batch_size=args.ot_batch_size,
        pairer=minibatch_ot_pair,
    )

    print("\n[5/5] compare couplings and solvers")
    plot_comparison(
        baseline,
        reflow,
        batch_ot,
        n_samples=args.eval_samples,
        nfe=args.eval_nfe,
        output=args.output,
    )


if __name__ == "__main__":
    main()
