"""Shared PyTorch starter for the DMA U1--U2 homework candidates.

The module intentionally supplies infrastructure, not a winning intervention.
Students edit one of the explicit hooks (`student_bend`, `student_pairing`,
`student_time_grid`, or the time-sampling/weighting config) and keep every
other controlled variable fixed.

The code has no dependency beyond PyTorch, NumPy, and Matplotlib.  It is small
enough for Colab CPU and deterministic under the published seeds.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import math
import time
from dataclasses import asdict, dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Callable, Dict, Iterable, Optional, Sequence, Tuple

import matplotlib.pyplot as plt
import numpy as np
import torch
from torch import Tensor, nn


TRAIN_SEED = 20260919
EVAL_SEED = 20260920
N_EVAL = 2048
MAIN_WIDTH = 128
MAIN_BATCH = 256


def _stable_int(text: str) -> int:
    return int.from_bytes(hashlib.sha256(text.encode("utf-8")).digest()[:8], "big")


@dataclass(frozen=True)
class CaseConfig:
    case_id: str
    family: str
    seed: int
    angle: float
    reflect: bool
    scale: float
    imbalance: float
    noise: float


FAMILIES = (
    "four_gaussians",
    "two_moons",
    "broken_ring",
    "pinwheel",
    "crossing_gaussians",
    "two_spirals",
)


def make_case(student_id: str) -> CaseConfig:
    """Map a student identifier to a stable, non-secret synthetic case."""
    if not str(student_id).strip():
        raise ValueError("student_id must be a non-empty string")
    digest = hashlib.sha256(str(student_id).strip().encode("utf-8")).digest()
    seed = int.from_bytes(digest[:8], "big") % (2**31 - 1)
    family = FAMILIES[digest[8] % len(FAMILIES)]
    angle = (int.from_bytes(digest[9:11], "big") / 65535.0) * 2.0 * math.pi
    reflect = bool(digest[11] & 1)
    scale = 0.85 + 0.30 * (digest[12] / 255.0)
    imbalance = 0.50 + 0.28 * (digest[13] / 255.0)
    noise = 0.045 + 0.055 * (digest[14] / 255.0)
    return CaseConfig(
        case_id=hashlib.sha256(str(student_id).strip().encode("utf-8")).hexdigest()[:10],
        family=family,
        seed=seed,
        angle=angle,
        reflect=reflect,
        scale=scale,
        imbalance=imbalance,
        noise=noise,
    )


def _generator(seed: int) -> torch.Generator:
    generator = torch.Generator(device="cpu")
    generator.manual_seed(int(seed) % (2**63 - 1))
    return generator


def _choice(weights: Tensor, n: int, generator: torch.Generator) -> Tensor:
    return torch.multinomial(weights.float(), n, replacement=True, generator=generator)


def _apply_case_transform(x: Tensor, case: CaseConfig) -> Tensor:
    if case.reflect:
        x = x * x.new_tensor([-1.0, 1.0])
    c, s = math.cos(case.angle), math.sin(case.angle)
    rotation = x.new_tensor([[c, -s], [s, c]])
    return case.scale * (x @ rotation.T)


def _sample_target_cpu(case: CaseConfig, n: int, generator: torch.Generator) -> Tensor:
    noise = case.noise

    if case.family == "four_gaussians":
        centers = torch.tensor([[-1.45, -0.85], [-1.10, 1.10], [1.20, -1.00], [1.50, 0.95]])
        heavy = case.imbalance
        weights = torch.tensor([heavy, (1 - heavy) / 3, (1 - heavy) / 3, (1 - heavy) / 3])
        labels = _choice(weights, n, generator)
        x = centers[labels] + (0.13 + noise) * torch.randn((n, 2), generator=generator)

    elif case.family == "two_moons":
        labels = _choice(torch.tensor([case.imbalance, 1 - case.imbalance]), n, generator)
        theta = math.pi * torch.rand(n, generator=generator)
        first = torch.stack([torch.cos(theta), torch.sin(theta)], dim=1)
        second = torch.stack([1.0 - torch.cos(theta), -torch.sin(theta) - 0.45], dim=1)
        x = torch.where(labels[:, None] == 0, first, second)
        first_mean = torch.tensor([0.0, 2.0 / math.pi])
        second_mean = torch.tensor([1.0, -2.0 / math.pi - 0.45])
        fixed_mean = case.imbalance * first_mean + (1.0 - case.imbalance) * second_mean
        x = 1.25 * (x - fixed_mean)
        x = x + noise * torch.randn((n, 2), generator=generator)

    elif case.family == "broken_ring":
        labels = _choice(torch.tensor([case.imbalance, 1 - case.imbalance]), n, generator)
        u = torch.rand(n, generator=generator)
        theta_left = (-0.15 + 0.95 * u) * math.pi
        theta_right = (0.95 + 0.90 * u) * math.pi
        theta = torch.where(labels == 0, theta_left, theta_right)
        radius = 1.55 + (0.07 + noise) * torch.randn(n, generator=generator)
        x = torch.stack([radius * torch.cos(theta), radius * torch.sin(theta)], dim=1)

    elif case.family == "pinwheel":
        k = 5
        base = torch.ones(k)
        base[0] = 1.0 + 2.0 * case.imbalance
        labels = _choice(base / base.sum(), n, generator)
        radial = 0.35 + 1.25 * torch.rand(n, generator=generator)
        theta = labels.float() * (2 * math.pi / k) + 1.15 * radial
        x = torch.stack([radial * torch.cos(theta), radial * torch.sin(theta)], dim=1)
        x = x + (0.045 + noise) * torch.randn((n, 2), generator=generator)

    elif case.family == "crossing_gaussians":
        centers = torch.tensor([[-1.1, -1.0], [-1.1, 1.0], [1.1, -1.0], [1.1, 1.0]])
        weights = torch.tensor([case.imbalance / 2, (1 - case.imbalance) / 2,
                                (1 - case.imbalance) / 2, case.imbalance / 2])
        labels = _choice(weights, n, generator)
        raw = torch.randn((n, 2), generator=generator)
        elongated = torch.stack([0.24 * raw[:, 0], (0.06 + noise) * raw[:, 1]], dim=1)
        signs = torch.where((labels == 0) | (labels == 3), 1.0, -1.0)
        angles = signs * 0.72
        c, s = torch.cos(angles), torch.sin(angles)
        dx = c * elongated[:, 0] - s * elongated[:, 1]
        dy = s * elongated[:, 0] + c * elongated[:, 1]
        x = centers[labels] + torch.stack([dx, dy], dim=1)

    elif case.family == "two_spirals":
        labels = _choice(torch.tensor([case.imbalance, 1 - case.imbalance]), n, generator)
        u = torch.rand(n, generator=generator)
        radius = 0.20 + 1.65 * u
        theta = 1.65 * math.pi * u + labels.float() * math.pi
        x = torch.stack([radius * torch.cos(theta), radius * torch.sin(theta)], dim=1)
        x = x + (0.035 + noise) * torch.randn((n, 2), generator=generator)

    else:
        raise ValueError(f"unknown family: {case.family}")

    return _apply_case_transform(x.float(), case)


def sample_data(case: CaseConfig, n: int, seed: int, device: str | torch.device = "cpu") -> Tensor:
    """Sample held-out or training target data with an explicit seed."""
    return _sample_target_cpu(case, int(n), _generator(seed)).to(device)


def sample_source(n: int, seed: int, device: str | torch.device = "cpu") -> Tensor:
    return torch.randn((int(n), 2), generator=_generator(seed)).to(device)


def describe_case(case: CaseConfig) -> str:
    return (
        f"case_id={case.case_id} family={case.family} "
        f"rotation={case.angle:.3f} reflect={case.reflect} scale={case.scale:.3f}"
    )


class PathSpec:
    name = "abstract"

    def interpolate(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        raise NotImplementedError

    def velocity(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        raise NotImplementedError


class LinearPath(PathSpec):
    name = "linear"

    def interpolate(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        return (1.0 - t) * x0 + t * x1

    def velocity(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        del t
        return x1 - x0


class VPPath(PathSpec):
    """Cosine VP path in FM time: t=0 noise, t=1 data."""

    name = "vp"

    @staticmethod
    def coefficients(t: Tensor) -> Tuple[Tensor, Tensor, Tensor, Tensor]:
        alpha = torch.sin(0.5 * math.pi * t)
        sigma = torch.cos(0.5 * math.pi * t)
        alpha_dot = 0.5 * math.pi * sigma
        sigma_dot = -0.5 * math.pi * alpha
        return alpha, sigma, alpha_dot, sigma_dot

    def interpolate(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        alpha, sigma, _, _ = self.coefficients(t)
        return sigma * x0 + alpha * x1

    def velocity(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        _, _, alpha_dot, sigma_dot = self.coefficients(t)
        return sigma_dot * x0 + alpha_dot * x1


def student_bend(x0: Tensor, x1: Tensor) -> Tensor:
    """Assignment B hook.  Keep zero for the baseline; replace for path design."""
    return torch.zeros_like(x0)


class StudentPath(PathSpec):
    name = "student"

    def __init__(self, bend_fn: Callable[[Tensor, Tensor], Tensor] = student_bend):
        self.bend_fn = bend_fn

    def interpolate(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        bend = self.bend_fn(x0, x1)
        return (1.0 - t) * x0 + t * x1 + t * (1.0 - t) * bend

    def velocity(self, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
        bend = self.bend_fn(x0, x1)
        return x1 - x0 + (1.0 - 2.0 * t) * bend


def pair_by_key(
    x0: Tensor,
    x1: Tensor,
    source_key: Callable[[Tensor], Tensor],
    target_key: Callable[[Tensor], Tensor],
) -> Tensor:
    """Allowed geometric primitive: rank-match two scalar keys without solving OT."""
    source_order = torch.argsort(source_key(x0).reshape(-1))
    target_order = torch.argsort(target_key(x1).reshape(-1))
    paired = torch.empty_like(x1)
    paired[source_order] = x1[target_order]
    return paired


def student_pairing(x0: Tensor, x1: Tensor) -> Tensor:
    """Assignment B hook.  The baseline pairing is the independent input order."""
    del x0
    return x1


class SinusoidalTimeEmbedding(nn.Module):
    def __init__(self, dim: int = 32):
        super().__init__()
        if dim % 2:
            raise ValueError("time embedding dimension must be even")
        frequencies = torch.exp(torch.linspace(math.log(1.0), math.log(1000.0), dim // 2))
        self.register_buffer("frequencies", frequencies)

    def forward(self, t: Tensor) -> Tensor:
        angles = t * self.frequencies[None, :]
        return torch.cat([torch.sin(angles), torch.cos(angles)], dim=1)


class TimeMLP(nn.Module):
    def __init__(self, width: int = MAIN_WIDTH, time_dim: int = 32, hidden_layers: int = 3):
        super().__init__()
        self.width = int(width)
        self.time_embed = SinusoidalTimeEmbedding(time_dim)
        layers: list[nn.Module] = [nn.Linear(2 + time_dim, width), nn.SiLU()]
        for _ in range(hidden_layers - 1):
            layers.extend([nn.Linear(width, width), nn.SiLU()])
        layers.append(nn.Linear(width, 2))
        self.net = nn.Sequential(*layers)

    def forward(self, x: Tensor, t: Tensor) -> Tensor:
        if t.ndim == 1:
            t = t[:, None]
        return self.net(torch.cat([x, self.time_embed(t)], dim=1))


@dataclass
class ExperimentConfig:
    assignment: str = "B"
    path: str = "linear"
    target_kind: str = "velocity"
    time_sampling: str = "uniform"
    weighting: str = "uniform"
    pairing: str = "independent"
    max_steps: int = 6000
    batch_size: int = MAIN_BATCH
    width: int = MAIN_WIDTH
    hidden_layers: int = 3
    learning_rate: float = 2e-3
    train_seed: int = TRAIN_SEED
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    checkpoint_steps: Tuple[int, ...] = (1500, 3000, 6000)
    log_every: int = 100
    micro_toy: bool = False

    def validate(self) -> None:
        assignment = self.assignment.upper()
        if assignment not in {"A", "B", "C"}:
            raise ValueError("assignment must be A, B, or C")
        step_cap = 1000 if self.micro_toy else (3000 if assignment == "C" else 6000)
        if self.max_steps > step_cap:
            raise ValueError(f"step budget exceeded: {self.max_steps} > {step_cap}")
        expected_width = 32 if self.micro_toy else MAIN_WIDTH
        if self.width != expected_width:
            raise ValueError(f"width must be {expected_width} for this run")
        if not self.micro_toy and self.batch_size != MAIN_BATCH:
            raise ValueError(f"main-run batch size must stay {MAIN_BATCH}")
        if self.hidden_layers != 3:
            raise ValueError("hidden_layers must stay 3")
        if assignment == "C" and self.path != "vp":
            raise ValueError("assignment C fixes path='vp'")
        if self.target_kind not in {"velocity", "eps", "x1", "v"}:
            raise ValueError("target_kind must be velocity, eps, x1, or v")
        if self.target_kind != "velocity" and self.path != "vp":
            raise ValueError("non-velocity targets are implemented only for the VP path")
        if any(step > self.max_steps for step in self.checkpoint_steps):
            raise ValueError("checkpoint_steps cannot exceed max_steps")


@dataclass
class BudgetLedger:
    optimizer_steps: int
    batch_size: int
    examples_seen: int
    parameter_count: int
    wall_seconds: float
    train_seed: int
    nfe: Optional[int] = None

    def summary(self) -> str:
        nfe = "n/a" if self.nfe is None else str(self.nfe)
        return (
            f"steps={self.optimizer_steps} batch={self.batch_size} examples={self.examples_seen} "
            f"params={self.parameter_count} wall={self.wall_seconds:.2f}s seed={self.train_seed} nfe={nfe}"
        )


@dataclass
class TrainingRun:
    model: TimeMLP
    checkpoints: Dict[int, Dict[str, Tensor]]
    history: Dict[str, list]
    ledger: BudgetLedger
    config: ExperimentConfig


def get_path(name: str, bend_fn: Callable[[Tensor, Tensor], Tensor] = student_bend) -> PathSpec:
    if name == "linear":
        return LinearPath()
    if name == "vp":
        return VPPath()
    if name == "student":
        return StudentPath(bend_fn)
    raise ValueError(f"unknown path: {name}")


def _sample_time(config: ExperimentConfig, n: int, generator: torch.Generator, device: str) -> Tensor:
    u = torch.rand((n, 1), generator=generator)
    if config.time_sampling == "uniform":
        t = u
    elif config.time_sampling == "middle":
        t = 0.5 * (u + torch.rand((n, 1), generator=generator))
    elif config.time_sampling == "ends":
        side = torch.randint(0, 2, (n, 1), generator=generator)
        edge = 0.5 * u.square()
        t = torch.where(side == 0, edge, 1.0 - edge)
    elif config.time_sampling == "early":
        t = u.square()
    elif config.time_sampling == "late":
        t = 1.0 - u.square()
    else:
        raise ValueError(f"unknown time_sampling: {config.time_sampling}")
    return t.clamp(0.02, 0.98).to(device)


def _loss_weight(config: ExperimentConfig, t: Tensor) -> Tensor:
    if config.weighting == "uniform":
        weight = torch.ones_like(t)
    elif config.weighting == "early":
        weight = 1.0 / (t + 0.10)
    elif config.weighting == "late":
        weight = 1.0 / (1.10 - t)
    elif config.weighting == "middle":
        weight = 0.25 + 4.0 * t * (1.0 - t)
    else:
        raise ValueError(f"unknown weighting: {config.weighting}")
    return weight / weight.mean().detach()


def _training_target(path: PathSpec, kind: str, x0: Tensor, x1: Tensor, t: Tensor) -> Tensor:
    if kind == "velocity":
        return path.velocity(x0, x1, t)
    if not isinstance(path, VPPath):
        raise ValueError("eps/x1/v targets require VPPath")
    if kind == "eps":
        return x0
    if kind == "x1":
        return x1
    if kind == "v":
        alpha, sigma, _, _ = path.coefficients(t)
        return alpha * x0 - sigma * x1
    raise ValueError(kind)


def prediction_to_velocity(prediction: Tensor, x: Tensor, t: Tensor, kind: str, path: PathSpec) -> Tensor:
    if kind == "velocity":
        return prediction
    if not isinstance(path, VPPath):
        raise ValueError("target conversion requires VPPath")
    alpha, sigma, alpha_dot, sigma_dot = path.coefficients(t)
    alpha_safe = alpha.clamp_min(1e-3)
    sigma_safe = sigma.clamp_min(1e-3)
    if kind == "eps":
        eps_hat = prediction
        x1_hat = (x - sigma * eps_hat) / alpha_safe
    elif kind == "x1":
        x1_hat = prediction
        eps_hat = (x - alpha * x1_hat) / sigma_safe
    elif kind == "v":
        x1_hat = alpha * x - sigma * prediction
        eps_hat = sigma * x + alpha * prediction
    else:
        raise ValueError(kind)
    return sigma_dot * eps_hat + alpha_dot * x1_hat


def prediction_to_endpoint(prediction: Tensor, x: Tensor, t: Tensor, kind: str, path: PathSpec) -> Tensor:
    if kind == "velocity":
        return x
    if not isinstance(path, VPPath):
        raise ValueError("endpoint conversion requires VPPath")
    alpha, sigma, _, _ = path.coefficients(t)
    if kind == "eps":
        return (x - sigma * prediction) / alpha.clamp_min(1e-3)
    if kind == "x1":
        return prediction
    if kind == "v":
        return alpha * x - sigma * prediction
    raise ValueError(kind)


def _pair(config: ExperimentConfig, x0: Tensor, x1: Tensor,
          pairing_fn: Callable[[Tensor, Tensor], Tensor]) -> Tensor:
    if config.pairing == "independent":
        return x1
    if config.pairing == "student":
        return pairing_fn(x0, x1)
    raise ValueError(f"unknown pairing: {config.pairing}")


def train(
    case: CaseConfig,
    config: ExperimentConfig,
    *,
    bend_fn: Callable[[Tensor, Tensor], Tensor] = student_bend,
    pairing_fn: Callable[[Tensor, Tensor], Tensor] = student_pairing,
) -> TrainingRun:
    """Train one controlled run and retain requested in-run checkpoints."""
    config.validate()
    device = torch.device(config.device)
    torch.manual_seed(config.train_seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(config.train_seed)
    generator = _generator(config.train_seed + case.seed)
    model = TimeMLP(config.width, hidden_layers=config.hidden_layers).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=config.learning_rate)
    path = get_path(config.path, bend_fn)
    history = {"step": [], "loss": []}
    checkpoints: Dict[int, Dict[str, Tensor]] = {}
    started = time.perf_counter()

    for step in range(1, config.max_steps + 1):
        x0 = torch.randn((config.batch_size, 2), generator=generator).to(device)
        x1 = _sample_target_cpu(case, config.batch_size, generator).to(device)
        x1 = _pair(config, x0, x1, pairing_fn)
        t = _sample_time(config, config.batch_size, generator, str(device))
        xt = path.interpolate(x0, x1, t)
        target = _training_target(path, config.target_kind, x0, x1, t)
        prediction = model(xt, t)
        per_example = (prediction - target).square().mean(dim=1, keepdim=True)
        loss = (_loss_weight(config, t) * per_example).mean()
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()

        if step == 1 or step % config.log_every == 0 or step == config.max_steps:
            history["step"].append(step)
            history["loss"].append(float(loss.detach().cpu()))
        if step in config.checkpoint_steps:
            checkpoints[step] = {key: value.detach().cpu().clone() for key, value in model.state_dict().items()}

    elapsed = time.perf_counter() - started
    ledger = BudgetLedger(
        optimizer_steps=config.max_steps,
        batch_size=config.batch_size,
        examples_seen=config.max_steps * config.batch_size,
        parameter_count=sum(parameter.numel() for parameter in model.parameters()),
        wall_seconds=elapsed,
        train_seed=config.train_seed,
    )
    return TrainingRun(model=model, checkpoints=checkpoints, history=history, ledger=ledger, config=copy.deepcopy(config))


def model_at_checkpoint(run: TrainingRun, step: int) -> TimeMLP:
    if step not in run.checkpoints:
        raise KeyError(f"checkpoint {step} not retained; available={sorted(run.checkpoints)}")
    model = TimeMLP(run.config.width, hidden_layers=run.config.hidden_layers).to(run.config.device)
    model.load_state_dict(run.checkpoints[step])
    model.eval()
    return model


def save_checkpoint(run: TrainingRun, case: CaseConfig, path: str | Path) -> None:
    payload = {
        "case": asdict(case),
        "config": asdict(run.config),
        "state_dict": {key: value.detach().cpu() for key, value in run.model.state_dict().items()},
        "ledger": asdict(run.ledger),
    }
    torch.save(payload, Path(path))


def load_baseline(case: CaseConfig, checkpoint_path: str | Path, device: Optional[str] = None) -> Tuple[TimeMLP, ExperimentConfig]:
    try:
        payload = torch.load(Path(checkpoint_path), map_location="cpu", weights_only=False)
    except TypeError:  # PyTorch versions before the weights_only argument
        payload = torch.load(Path(checkpoint_path), map_location="cpu")
    if payload["case"]["case_id"] != case.case_id:
        raise ValueError("checkpoint case_id does not match this student case")
    config = ExperimentConfig(**payload["config"])
    if device is not None:
        config.device = device
    model = TimeMLP(config.width, hidden_layers=config.hidden_layers).to(config.device)
    model.load_state_dict(payload["state_dict"])
    model.eval()
    return model, config


def student_time_grid(nfe: int, path: PathSpec, device: str | torch.device) -> Tensor:
    """Assignment A hook.  Replace the interior points, keeping monotone endpoints."""
    if isinstance(path, VPPath):
        return torch.linspace(0.02, 1.0, nfe + 1, device=device)
    return torch.linspace(0.0, 1.0, nfe + 1, device=device)


def _validate_grid(times: Tensor, nfe: int) -> None:
    if times.ndim != 1 or len(times) != nfe + 1:
        raise ValueError("time grid must contain nfe + 1 scalar points")
    if not bool(torch.all(times[1:] > times[:-1])):
        raise ValueError("time grid must be strictly increasing")
    if float(times[0]) < 0 or float(times[-1]) > 1:
        raise ValueError("time grid must remain inside [0, 1]")


@torch.no_grad()
def sample(
    model: TimeMLP,
    config: ExperimentConfig,
    nfe: int,
    *,
    n_samples: int = N_EVAL,
    seed: int = EVAL_SEED,
    bend_fn: Callable[[Tensor, Tensor], Tensor] = student_bend,
    times: Optional[Tensor] = None,
    track_count: int = 32,
    step_fn: Optional[Callable[[Tensor, Tensor, Tensor, Tensor], Tensor]] = None,
) -> Tuple[Tensor, Tensor, BudgetLedger]:
    """First-order ODE sampling.  A custom step_fn is the only sampler hook."""
    if nfe <= 0:
        raise ValueError("nfe must be positive")
    device = next(model.parameters()).device
    path = get_path(config.path, bend_fn)
    if times is None:
        times = student_time_grid(nfe, path, device)
    else:
        times = times.to(device)
    _validate_grid(times, nfe)
    x = sample_source(n_samples, seed, device)
    trajectory = [x[:track_count].detach().cpu()]
    started = time.perf_counter()
    model.eval()

    for index in range(nfe):
        t0, t1 = times[index], times[index + 1]
        dt = t1 - t0
        t_batch = torch.full((n_samples, 1), float(t0), device=device)
        prediction = model(x, t_batch)
        velocity = prediction_to_velocity(prediction, x, t_batch, config.target_kind, path)
        is_endpoint_step = (
            isinstance(path, VPPath)
            and config.target_kind != "velocity"
            and index == nfe - 1
            and abs(float(t1) - 1.0) < 1e-6
        )
        if is_endpoint_step:
            # Reuse this step's prediction: endpoint projection must not spend an
            # unreported (nfe + 1)-th network call.
            x = prediction_to_endpoint(prediction, x, t_batch, config.target_kind, path)
        else:
            x = x + dt * velocity if step_fn is None else step_fn(x, velocity, t0, t1)
        trajectory.append(x[:track_count].detach().cpu())

    elapsed = time.perf_counter() - started
    ledger = BudgetLedger(
        optimizer_steps=0,
        batch_size=n_samples,
        examples_seen=n_samples,
        parameter_count=sum(parameter.numel() for parameter in model.parameters()),
        wall_seconds=elapsed,
        train_seed=seed,
        nfe=nfe,
    )
    return x.detach().cpu(), torch.stack(trajectory), ledger


@torch.no_grad()
def ddim_sample(
    model: TimeMLP,
    config: ExperimentConfig,
    nfe: int,
    *,
    eta: float = 0.0,
    n_samples: int = N_EVAL,
    seed: int = EVAL_SEED,
    times: Optional[Tensor] = None,
    track_count: int = 32,
) -> Tuple[Tensor, Tensor, BudgetLedger]:
    """DDIM family for a VP model, with exactly `nfe` model calls.

    FM time runs from noise to data.  `eta=0` is deterministic DDIM; positive
    eta injects the standard DDIM noise while preserving the same published
    time grid.  This function is intentionally restricted to the setting in
    which the formula is valid.
    """
    if config.path != "vp" or config.target_kind not in {"eps", "x1", "v"}:
        raise ValueError("ddim_sample requires VP path with eps, x1, or v prediction")
    if not 0.0 <= eta <= 1.0:
        raise ValueError("eta must lie in [0, 1]")
    device = next(model.parameters()).device
    path = VPPath()
    if times is None:
        times = student_time_grid(nfe, path, device)
    else:
        times = times.to(device)
    _validate_grid(times, nfe)
    if abs(float(times[-1]) - 1.0) >= 1e-6:
        raise ValueError("DDIM time grid must end at data time t=1")
    x = sample_source(n_samples, seed, device)
    noise_generator = _generator(seed + 991)
    trajectory = [x[:track_count].detach().cpu()]
    started = time.perf_counter()
    model.eval()

    for index in range(nfe):
        t0, t1 = times[index], times[index + 1]
        t_batch = torch.full((n_samples, 1), float(t0), device=device)
        prediction = model(x, t_batch)
        alpha0, sigma0, _, _ = path.coefficients(t_batch)
        t1_batch = torch.full((n_samples, 1), float(t1), device=device)
        alpha1, sigma1, _, _ = path.coefficients(t1_batch)
        if config.target_kind == "eps":
            eps_hat = prediction
            x1_hat = (x - sigma0 * eps_hat) / alpha0.clamp_min(1e-3)
        elif config.target_kind == "x1":
            x1_hat = prediction
            eps_hat = (x - alpha0 * x1_hat) / sigma0.clamp_min(1e-3)
        else:  # v prediction
            x1_hat = alpha0 * x - sigma0 * prediction
            eps_hat = sigma0 * x + alpha0 * prediction

        ratio = (sigma1.square() / sigma0.square().clamp_min(1e-8))
        ratio = ratio * (1.0 - alpha0.square() / alpha1.square().clamp_min(1e-8))
        step_sigma = eta * ratio.clamp_min(0.0).sqrt()
        direction_scale = (sigma1.square() - step_sigma.square()).clamp_min(0.0).sqrt()
        if eta > 0 and index < nfe - 1:
            noise = torch.randn(x.shape, generator=noise_generator).to(device)
        else:
            noise = torch.zeros_like(x)
        x = alpha1 * x1_hat + direction_scale * eps_hat + step_sigma * noise
        trajectory.append(x[:track_count].detach().cpu())

    elapsed = time.perf_counter() - started
    ledger = BudgetLedger(
        optimizer_steps=0,
        batch_size=n_samples,
        examples_seen=n_samples,
        parameter_count=sum(parameter.numel() for parameter in model.parameters()),
        wall_seconds=elapsed,
        train_seed=seed,
        nfe=nfe,
    )
    return x.detach().cpu(), torch.stack(trajectory), ledger


def _nearest_distances(a: Tensor, b: Tensor, chunk: int = 512) -> Tensor:
    a = a.float().cpu()
    b = b.float().cpu()
    pieces = []
    for start in range(0, len(a), chunk):
        pieces.append(torch.cdist(a[start:start + chunk], b).min(dim=1).values)
    return torch.cat(pieces)


@dataclass(frozen=True)
class MetricResult:
    precision: float
    coverage: float
    radius: float
    precision_se: float
    coverage_se: float

    def summary(self) -> str:
        return (
            f"precision@r={self.precision:.3f}±{self.precision_se:.3f} "
            f"coverage@r={self.coverage:.3f}±{self.coverage_se:.3f} r={self.radius:.4f}"
        )


def _bernoulli_se(value: float, n: int) -> float:
    return math.sqrt(max(value * (1.0 - value), 0.0) / max(n, 1))


@lru_cache(maxsize=256)
def reference_metrics(case: CaseConfig, n: int = N_EVAL) -> MetricResult:
    real_a = sample_data(case, n, EVAL_SEED + 101)
    real_b = sample_data(case, n, EVAL_SEED + 202)
    a_to_b = _nearest_distances(real_a, real_b)
    radius = float(torch.quantile(a_to_b, 0.90))
    b_to_a = _nearest_distances(real_b, real_a)
    precision = float((a_to_b <= radius).float().mean())
    coverage = float((b_to_a <= radius).float().mean())
    return MetricResult(precision, coverage, radius,
                        _bernoulli_se(precision, n), _bernoulli_se(coverage, n))


def evaluate(samples: Tensor, case: CaseConfig, n_real: int = N_EVAL) -> MetricResult:
    reference = reference_metrics(case, n_real)
    real = sample_data(case, n_real, EVAL_SEED + 202)
    generated = samples.detach().float().cpu()
    gen_to_real = _nearest_distances(generated, real)
    real_to_gen = _nearest_distances(real, generated)
    precision = float((gen_to_real <= reference.radius).float().mean())
    coverage = float((real_to_gen <= reference.radius).float().mean())
    return MetricResult(precision, coverage, reference.radius,
                        _bernoulli_se(precision, len(generated)),
                        _bernoulli_se(coverage, len(real)))


def forty_percent_target(baseline: MetricResult, reference: MetricResult) -> Dict[str, float]:
    return {
        "precision": baseline.precision + 0.40 * (reference.precision - baseline.precision),
        "coverage": baseline.coverage + 0.40 * (reference.coverage - baseline.coverage),
    }


def gap_closed(result: MetricResult, baseline: MetricResult, reference: MetricResult) -> Dict[str, float]:
    def fraction(value: float, base: float, ref: float) -> float:
        denominator = ref - base
        if denominator < 0.03:
            return float("nan")
        return (value - base) / denominator
    return {
        "precision": fraction(result.precision, baseline.precision, reference.precision),
        "coverage": fraction(result.coverage, baseline.coverage, reference.coverage),
    }


@torch.no_grad()
def binned_prediction_error(
    model: TimeMLP,
    case: CaseConfig,
    config: ExperimentConfig,
    *,
    n: int = 8192,
    bins: int = 8,
    bend_fn: Callable[[Tensor, Tensor], Tensor] = student_bend,
    pairing_fn: Callable[[Tensor, Tensor], Tensor] = student_pairing,
) -> Dict[str, np.ndarray]:
    device = next(model.parameters()).device
    generator = _generator(EVAL_SEED + case.seed + 303)
    x0 = torch.randn((n, 2), generator=generator).to(device)
    x1 = _sample_target_cpu(case, n, generator).to(device)
    x1 = _pair(config, x0, x1, pairing_fn)
    t = (0.02 + 0.96 * torch.rand((n, 1), generator=generator)).to(device)
    path = get_path(config.path, bend_fn)
    xt = path.interpolate(x0, x1, t)
    target_velocity = path.velocity(x0, x1, t)
    prediction = model(xt, t)
    predicted_velocity = prediction_to_velocity(prediction, xt, t, config.target_kind, path)
    error = (predicted_velocity - target_velocity).square().mean(dim=1)
    edges = torch.linspace(0.02, 0.98, bins + 1, device=device)
    means = []
    for index in range(bins):
        mask = (t[:, 0] >= edges[index]) & (t[:, 0] < edges[index + 1])
        means.append(float(error[mask].mean().cpu()))
    centers = 0.5 * (edges[:-1] + edges[1:])
    return {"t": centers.cpu().numpy(), "mse": np.asarray(means)}


def conditional_paths(
    case: CaseConfig,
    path: PathSpec,
    *,
    n_pairs: int = 16,
    n_times: int = 40,
    pairing_fn: Callable[[Tensor, Tensor], Tensor] = student_pairing,
) -> Tensor:
    x0 = sample_source(n_pairs, EVAL_SEED + 404)
    x1 = sample_data(case, n_pairs, EVAL_SEED + 505)
    x1 = pairing_fn(x0, x1)
    rows = []
    for value in torch.linspace(0, 1, n_times):
        t = torch.full((n_pairs, 1), float(value))
        rows.append(path.interpolate(x0, x1, t))
    return torch.stack(rows)


def mean_path_length(trajectory: Tensor) -> float:
    return float((trajectory[1:] - trajectory[:-1]).norm(dim=-1).sum(dim=0).mean())


def mean_transport_cost(path_points: Tensor) -> float:
    return float((path_points[-1] - path_points[0]).square().sum(dim=-1).mean())


def plot_case(case: CaseConfig, n: int = 2048, ax=None):
    if ax is None:
        _, ax = plt.subplots(figsize=(4.5, 4.5))
    points = sample_data(case, n, EVAL_SEED + 606).numpy()
    ax.scatter(points[:, 0], points[:, 1], s=5, alpha=0.35)
    ax.set(title=describe_case(case), aspect="equal")
    return ax


def plot_samples(samples: Tensor, case: CaseConfig, title: str, ax=None):
    if ax is None:
        _, ax = plt.subplots(figsize=(4.5, 4.5))
    real = sample_data(case, min(len(samples), 2048), EVAL_SEED + 202).numpy()
    generated = samples.numpy()
    ax.scatter(real[:, 0], real[:, 1], s=5, alpha=0.18, label="held-out real")
    ax.scatter(generated[:, 0], generated[:, 1], s=5, alpha=0.35, label="generated")
    ax.set(title=title, aspect="equal")
    ax.legend(fontsize=8)
    return ax


def plot_trajectories(trajectory: Tensor, title: str, ax=None):
    if ax is None:
        _, ax = plt.subplots(figsize=(4.5, 4.5))
    values = trajectory.numpy()
    for index in range(values.shape[1]):
        ax.plot(values[:, index, 0], values[:, index, 1], alpha=0.55, linewidth=1)
    ax.scatter(values[-1, :, 0], values[-1, :, 1], s=12, color="black")
    ax.set(title=title, aspect="equal")
    return ax


def plot_time_error(diagnostics: Dict[str, np.ndarray], title: str, ax=None):
    if ax is None:
        _, ax = plt.subplots(figsize=(5.5, 3.5))
    ax.plot(diagnostics["t"], diagnostics["mse"], "o-")
    ax.set(xlabel="t", ylabel="common-coordinate velocity MSE", title=title)
    ax.grid(alpha=0.25)
    return ax


def print_case_report(case: CaseConfig) -> MetricResult:
    reference = reference_metrics(case)
    print(describe_case(case))
    print("real-vs-real:", reference.summary())
    return reference


def smoke_test() -> None:
    case = make_case("smoke-test-student")
    config = ExperimentConfig(
        assignment="B",
        path="linear",
        max_steps=20,
        checkpoint_steps=(10, 20),
        log_every=10,
        device="cpu",
    )
    print_case_report(case)
    run = train(case, config)
    samples, trajectory, sample_ledger = sample(run.model, config, nfe=4, n_samples=128, track_count=8)
    metric = evaluate(samples, case, n_real=128)
    diagnostic = binned_prediction_error(run.model, case, config, n=256, bins=4)
    assert samples.shape == (128, 2)
    assert trajectory.shape == (5, 8, 2)
    assert diagnostic["mse"].shape == (4,)
    assert 0 <= metric.precision <= 1 and 0 <= metric.coverage <= 1
    print("train:", run.ledger.summary())
    print("sample:", sample_ledger.summary())
    print("metric:", metric.summary())
    print("smoke test passed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke", action="store_true", help="run a short CPU integrity check")
    args = parser.parse_args()
    if args.smoke:
        smoke_test()
    else:
        parser.print_help()
