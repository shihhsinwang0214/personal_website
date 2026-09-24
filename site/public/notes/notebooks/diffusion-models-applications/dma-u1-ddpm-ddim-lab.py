# %% [markdown]
# # U1 Lab — 從 forward diffusion 到 DDPM / DDIM 生成
#
# 這份 lab 用**同一套 diffusion 核心程式**完成三種資料：
#
# - `toy`：2D two moons，幾分鐘內看清楚分布與 sampling trajectory。
# - `mnist`：最小的灰階影像實驗。
# - `cifar10`：最簡單、最常見的 32×32 RGB benchmark。
#
# 我們會依序實作：
#
# 1. forward process $q(x_t\mid x_0)$；
# 2. noise-prediction objective $\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2$；
# 3. 完整 ancestral DDPM sampling；
# 4. 用**同一個訓練好的模型**做 DDIM，改變 steps 與 $\eta$；
# 5. 固定同一個 $x_T$，比較 sampler 改變了什麼。
#
# > 建議順序：先跑 `toy`，確定所有 cell 都能執行；再切到 `mnist`；有 GPU 再跑 `cifar10`。

# %% [markdown]
# ## 0. 執行環境
#
# Colab 通常已經有 PyTorch。若本機缺套件，取消下一格 `%pip` 的註解後執行一次。

# %%
# %pip install -q torch torchvision matplotlib tqdm

import copy
import math
import os
import random
from dataclasses import dataclass, replace
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from tqdm.auto import tqdm

torch.set_float32_matmul_precision("high")


def seed_everything(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)


seed_everything(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("device:", device)

# %% [markdown]
# ## 1. 只改一行，切換資料集
#
# `FAST_DEV_RUN=True` 只用來檢查程式能否完整跑通，不期待生成品質。
# 真正訓練時請設成 `False`。下方步數是教學用起點，不是最佳 benchmark 設定。

# %%
DATASET = "toy"          # "toy" | "mnist" | "cifar10"
FAST_DEV_RUN = False      # 第一次可設 True 做 smoke test
TRAIN_STEPS_OVERRIDE = None
DATA_ROOT = Path("./data")
CHECKPOINT_ROOT = Path("./checkpoints/u1_ddpm_ddim")
CHECKPOINT_ROOT.mkdir(parents=True, exist_ok=True)


@dataclass
class Config:
    name: str
    image: bool
    channels: int
    size: int
    T: int
    batch_size: int
    train_steps: int
    lr: float
    base_channels: int
    sample_count: int
    num_workers: int = 0


PRESETS = {
    "toy": Config("toy", False, 0, 0, T=100, batch_size=512,
                  train_steps=4_000, lr=2e-3, base_channels=128, sample_count=2_000),
    "mnist": Config("mnist", True, 1, 32, T=200, batch_size=128,
                    train_steps=8_000, lr=2e-4, base_channels=32, sample_count=64),
    "cifar10": Config("cifar10", True, 3, 32, T=400, batch_size=128,
                      train_steps=20_000, lr=2e-4, base_channels=64, sample_count=64),
}

assert DATASET in PRESETS
cfg = PRESETS[DATASET]
if FAST_DEV_RUN:
    cfg = replace(cfg, train_steps=50, sample_count=min(cfg.sample_count, 16))
if TRAIN_STEPS_OVERRIDE is not None:
    cfg = replace(cfg, train_steps=int(TRAIN_STEPS_OVERRIDE))

print(cfg)

# %% [markdown]
# ## 2. Dataset 與視覺化
#
# 所有影像都轉到 $[-1,1]$。toy 則標準化到每一維約為零均值、單位變異數。

# %%
def make_two_moons(n=20_000, noise=0.06):
    """不依賴 sklearn 的 two-moons generator。每一列就是一筆 2D 資料。"""
    n1 = n // 2
    n2 = n - n1
    a1 = torch.rand(n1) * math.pi
    a2 = torch.rand(n2) * math.pi
    moon1 = torch.stack([torch.cos(a1), torch.sin(a1)], dim=1)
    moon2 = torch.stack([1.0 - torch.cos(a2), 0.5 - torch.sin(a2)], dim=1)
    x = torch.cat([moon1, moon2], dim=0)
    x = x + noise * torch.randn_like(x)
    x = (x - x.mean(0)) / x.std(0)
    return x[torch.randperm(n)]


def build_dataloader(cfg):
    if cfg.name == "toy":
        dataset = TensorDataset(make_two_moons())
    else:
        from torchvision import datasets, transforms
        tfm = transforms.Compose([
            transforms.Resize((cfg.size, cfg.size)),
            transforms.ToTensor(),
            transforms.Normalize([0.5] * cfg.channels, [0.5] * cfg.channels),
        ])
        if cfg.name == "mnist":
            dataset = datasets.MNIST(DATA_ROOT, train=True, download=True, transform=tfm)
        else:
            dataset = datasets.CIFAR10(DATA_ROOT, train=True, download=True, transform=tfm)
    loader = DataLoader(
        dataset, batch_size=cfg.batch_size, shuffle=True, drop_last=True,
        num_workers=cfg.num_workers, pin_memory=torch.cuda.is_available(),
    )
    return dataset, loader


dataset, loader = build_dataloader(cfg)


def show_batch(x, title="data", n=64):
    x = x.detach().cpu()
    if not cfg.image:
        plt.figure(figsize=(5, 5))
        plt.scatter(x[:n, 0], x[:n, 1], s=8, alpha=0.65)
        plt.axis("equal"); plt.grid(alpha=0.2); plt.title(title)
    else:
        from torchvision.utils import make_grid
        grid = make_grid(((x[:n] + 1) / 2).clamp(0, 1), nrow=int(math.sqrt(n)))
        plt.figure(figsize=(7, 7))
        plt.imshow(grid.permute(1, 2, 0).squeeze(), cmap="gray" if cfg.channels == 1 else None)
        plt.axis("off"); plt.title(title)
    plt.show()


batch = next(iter(loader))[0]
show_batch(batch, f"{DATASET}: clean samples", min(64, len(batch)))

# %% [markdown]
# ## 3. Noise schedule 與 forward process
#
# 定義 $\alpha_t=1-\beta_t$、$\bar\alpha_t=\prod_{s=1}^t\alpha_s$，即可直接抽任意時刻：
#
# $$x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon,
# \qquad \epsilon\sim\mathcal N(0,I).$$

# %%
def extract(v, t, x):
    """從長度 T 的 schedule 取出 batch 對應值，reshape 以便 broadcast。"""
    return v.gather(0, t).reshape(t.shape[0], *((1,) * (x.ndim - 1)))


def make_schedule(T, device):
    # Linear beta schedule；教學上最容易和 U1 公式逐項對照。
    scale = 1000 / T
    betas = torch.linspace(scale * 1e-4, min(scale * 2e-2, 0.999), T, device=device)
    alphas = 1.0 - betas
    alpha_bar = torch.cumprod(alphas, dim=0)
    alpha_bar_prev = F.pad(alpha_bar[:-1], (1, 0), value=1.0)
    posterior_variance = betas * (1.0 - alpha_bar_prev) / (1.0 - alpha_bar)
    posterior_mean_coef1 = betas * alpha_bar_prev.sqrt() / (1.0 - alpha_bar)
    posterior_mean_coef2 = (1.0 - alpha_bar_prev) * alphas.sqrt() / (1.0 - alpha_bar)
    return {
        "betas": betas,
        "alphas": alphas,
        "alpha_bar": alpha_bar,
        "alpha_bar_prev": alpha_bar_prev,
        "posterior_variance": posterior_variance.clamp(min=1e-20),
        "posterior_mean_coef1": posterior_mean_coef1,
        "posterior_mean_coef2": posterior_mean_coef2,
    }


schedule = make_schedule(cfg.T, device)


def q_sample(x0, t, eps=None):
    if eps is None:
        eps = torch.randn_like(x0)
    ab = extract(schedule["alpha_bar"], t, x0)
    return ab.sqrt() * x0 + (1.0 - ab).sqrt() * eps, eps


@torch.no_grad()
def show_forward_process(x0, fractions=(0.0, 0.1, 0.3, 0.6, 0.99)):
    x0 = x0[:64].to(device)
    eps = torch.randn_like(x0)  # 固定同一個 eps，才看得出同一筆資料逐步被破壞
    fig, axes = plt.subplots(1, len(fractions), figsize=(3 * len(fractions), 3))
    for ax, frac in zip(axes, fractions):
        t_value = min(round(frac * (cfg.T - 1)), cfg.T - 1)
        t = torch.full((len(x0),), t_value, device=device, dtype=torch.long)
        xt, _ = q_sample(x0, t, eps)
        if not cfg.image:
            ax.scatter(xt[:, 0].cpu(), xt[:, 1].cpu(), s=8, alpha=0.65)
            ax.set_aspect("equal"); ax.grid(alpha=0.2)
        else:
            from torchvision.utils import make_grid
            grid = make_grid(((xt.cpu() + 1) / 2).clamp(0, 1), nrow=8)
            ax.imshow(grid.permute(1, 2, 0).squeeze(), cmap="gray" if cfg.channels == 1 else None)
            ax.axis("off")
        ax.set_title(f"t={t_value}")
    plt.suptitle("Forward process: same x₀, same ε")
    plt.tight_layout(); plt.show()


show_forward_process(batch)

# %% [markdown]
# ## 4. Denoiser：toy 用 MLP，影像用 tiny U-Net
#
# 兩個模型輸出都和輸入同 shape，代表 $\epsilon_\theta(x_t,t)$。

# %%
class SinusoidalTimeEmbedding(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.dim = dim

    def forward(self, t):
        half = self.dim // 2
        freq = torch.exp(
            -math.log(10_000) * torch.arange(half, device=t.device) / max(half - 1, 1)
        )
        angle = t.float()[:, None] * freq[None]
        return torch.cat([angle.sin(), angle.cos()], dim=1)


class ToyDenoiser(nn.Module):
    def __init__(self, width=128, time_dim=64):
        super().__init__()
        self.time = nn.Sequential(
            SinusoidalTimeEmbedding(time_dim),
            nn.Linear(time_dim, width), nn.SiLU(), nn.Linear(width, width),
        )
        self.net = nn.Sequential(
            nn.Linear(2 + width, width), nn.SiLU(),
            nn.Linear(width, width), nn.SiLU(),
            nn.Linear(width, width), nn.SiLU(),
            nn.Linear(width, 2),
        )

    def forward(self, x, t):
        return self.net(torch.cat([x, self.time(t)], dim=1))


class ResBlock(nn.Module):
    def __init__(self, in_ch, out_ch, time_dim):
        super().__init__()
        self.norm1 = nn.GroupNorm(min(8, in_ch), in_ch)
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, padding=1)
        self.time = nn.Linear(time_dim, out_ch)
        self.norm2 = nn.GroupNorm(min(8, out_ch), out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, padding=1)
        self.skip = nn.Conv2d(in_ch, out_ch, 1) if in_ch != out_ch else nn.Identity()

    def forward(self, x, temb):
        h = self.conv1(F.silu(self.norm1(x)))
        h = h + self.time(F.silu(temb))[:, :, None, None]
        h = self.conv2(F.silu(self.norm2(h)))
        return h + self.skip(x)


class TinyUNet(nn.Module):
    def __init__(self, channels=1, base=32, time_dim=128):
        super().__init__()
        self.time = nn.Sequential(
            SinusoidalTimeEmbedding(time_dim),
            nn.Linear(time_dim, time_dim * 4), nn.SiLU(), nn.Linear(time_dim * 4, time_dim),
        )
        self.in_conv = nn.Conv2d(channels, base, 3, padding=1)
        self.d1 = ResBlock(base, base, time_dim)
        self.down1 = nn.Conv2d(base, 2 * base, 4, stride=2, padding=1)
        self.d2 = ResBlock(2 * base, 2 * base, time_dim)
        self.down2 = nn.Conv2d(2 * base, 4 * base, 4, stride=2, padding=1)
        self.mid1 = ResBlock(4 * base, 4 * base, time_dim)
        self.mid2 = ResBlock(4 * base, 4 * base, time_dim)
        self.up2 = nn.ConvTranspose2d(4 * base, 2 * base, 4, stride=2, padding=1)
        self.u2 = ResBlock(4 * base, 2 * base, time_dim)
        self.up1 = nn.ConvTranspose2d(2 * base, base, 4, stride=2, padding=1)
        self.u1 = ResBlock(2 * base, base, time_dim)
        self.out_norm = nn.GroupNorm(min(8, base), base)
        self.out_conv = nn.Conv2d(base, channels, 3, padding=1)

    def forward(self, x, t):
        temb = self.time(t)
        x = self.in_conv(x)
        h1 = self.d1(x, temb)
        h2 = self.d2(self.down1(h1), temb)
        h = self.mid2(self.mid1(self.down2(h2), temb), temb)
        h = self.u2(torch.cat([self.up2(h), h2], dim=1), temb)
        h = self.u1(torch.cat([self.up1(h), h1], dim=1), temb)
        return self.out_conv(F.silu(self.out_norm(h)))


def build_model(cfg):
    if cfg.image:
        return TinyUNet(cfg.channels, cfg.base_channels).to(device)
    return ToyDenoiser(cfg.base_channels).to(device)


model = build_model(cfg)
test_x = batch[:4].to(device)
test_t = torch.randint(0, cfg.T, (len(test_x),), device=device)
assert model(test_x, test_t).shape == test_x.shape
print(f"parameters: {sum(p.numel() for p in model.parameters()):,}")

# %% [markdown]
# ## 5. 訓練 DDPM 的 $\epsilon$-prediction objective
#
# 每次 iteration：抽 $x_0$、抽 $t$、抽 $\epsilon$、組成 $x_t$，最後做 MSE。
# EMA 只平滑模型權重，不改變訓練目標；取樣時通常比最後一步權重穩定。

# %%
class EMA:
    def __init__(self, model, decay=0.999):
        self.decay = decay
        self.model = copy.deepcopy(model).eval()
        self.model.requires_grad_(False)

    @torch.no_grad()
    def update(self, model):
        for ema_p, p in zip(self.model.parameters(), model.parameters()):
            ema_p.lerp_(p, 1.0 - self.decay)
        for ema_b, b in zip(self.model.buffers(), model.buffers()):
            ema_b.copy_(b)


def infinite_loader(loader):
    while True:
        yield from loader


def train(model, loader, steps, lr):
    model.train()
    ema = EMA(model)
    opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    losses = []
    stream = infinite_loader(loader)
    pbar = tqdm(range(1, steps + 1))
    for step in pbar:
        x0 = next(stream)[0].to(device, non_blocking=True)
        t = torch.randint(0, cfg.T, (len(x0),), device=device)
        xt, eps = q_sample(x0, t)
        pred = model(xt, t)
        loss = F.mse_loss(pred, eps)
        opt.zero_grad(set_to_none=True)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        ema.update(model)
        losses.append(loss.item())
        if step == 1 or step % 100 == 0:
            pbar.set_postfix(loss=f"{np.mean(losses[-100:]):.4f}")
    return ema.model, losses


checkpoint_path = CHECKPOINT_ROOT / f"{cfg.name}_eps_model.pt"
RUN_TRAINING = True

if RUN_TRAINING:
    sample_model, losses = train(model, loader, cfg.train_steps, cfg.lr)
    torch.save({"model": model.state_dict(), "ema": sample_model.state_dict(),
                "config": vars(cfg)}, checkpoint_path)
    plt.figure(figsize=(7, 3))
    plt.plot(losses, alpha=0.35)
    if len(losses) >= 100:
        smooth = np.convolve(losses, np.ones(100) / 100, mode="valid")
        plt.plot(np.arange(99, len(losses)), smooth, lw=2)
    plt.xlabel("training step"); plt.ylabel("epsilon MSE"); plt.grid(alpha=0.2)
    plt.show()
else:
    ckpt = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(ckpt["model"])
    sample_model = build_model(cfg)
    sample_model.load_state_dict(ckpt["ema"])

sample_model.eval()
print("checkpoint:", checkpoint_path)

# %% [markdown]
# ## 6. 從 $\epsilon_\theta$ 取得 $\hat x_0$ 與 score
#
# 同一個 network output 可以換算成 U1 的三種觀點：
#
# $$\hat x_0=\frac{x_t-\sqrt{1-\bar\alpha_t}\epsilon_\theta}{\sqrt{\bar\alpha_t}},
# \qquad s_\theta(x_t,t)=-\frac{\epsilon_\theta(x_t,t)}{\sqrt{1-\bar\alpha_t}}.$$

# %%
def predict_x0(model, xt, t, clip=False):
    eps = model(xt, t)
    ab = extract(schedule["alpha_bar"], t, xt)
    x0 = (xt - (1.0 - ab).sqrt() * eps) / ab.sqrt()
    if clip:
        x0 = x0.clamp(-1, 1)
    return x0, eps


@torch.no_grad()
def inspect_prediction(model, x0):
    x0 = x0[:64].to(device)
    t_value = int(0.6 * (cfg.T - 1))
    t = torch.full((len(x0),), t_value, device=device, dtype=torch.long)
    xt, _ = q_sample(x0, t)
    x0_hat, _ = predict_x0(model, xt, t, clip=cfg.image)
    show_batch(xt, f"x_t at t={t_value}", len(xt))
    show_batch(x0_hat, "network prediction x₀-hat", len(x0_hat))


inspect_prediction(sample_model, batch)

# %% [markdown]
# ## 7. DDPM：完整 ancestral sampling
#
# DDPM 每一步都使用 learned mean，並在 $t>0$ 時加入 posterior variance。
# 這個實作走完所有 $T$ 步，是本 lab 的 DDPM baseline。

# %%
def sample_shape(cfg, n):
    return (n, cfg.channels, cfg.size, cfg.size) if cfg.image else (n, 2)


@torch.no_grad()
def sample_ddpm(model, n, x_T=None, keep_trajectory=False):
    x = torch.randn(sample_shape(cfg, n), device=device) if x_T is None else x_T.clone().to(device)
    trajectory = [x.detach().cpu()]
    stride = max(cfg.T // 8, 1)
    for t_value in tqdm(range(cfg.T - 1, -1, -1), desc="DDPM"):
        t = torch.full((n,), t_value, device=device, dtype=torch.long)
        x0_hat, _ = predict_x0(model, x, t, clip=cfg.image)
        c1 = extract(schedule["posterior_mean_coef1"], t, x)
        c2 = extract(schedule["posterior_mean_coef2"], t, x)
        mean = c1 * x0_hat + c2 * x
        if t_value > 0:
            var = extract(schedule["posterior_variance"], t, x)
            x = mean + var.sqrt() * torch.randn_like(x)
        else:
            x = mean
        if keep_trajectory and (t_value % stride == 0 or t_value == 0):
            trajectory.append(x.detach().cpu())
    return x.detach().cpu(), trajectory


n = cfg.sample_count
fixed_xT = torch.randn(sample_shape(cfg, n), device=device)
ddpm_samples, ddpm_traj = sample_ddpm(sample_model, n, fixed_xT, keep_trajectory=True)
show_batch(ddpm_samples, f"{DATASET}: DDPM ({cfg.T} ancestral steps)", n)

# %% [markdown]
# ## 8. DDIM：同一模型，不同 steps 與 $\eta$
#
# DDIM 不重新訓練。它只改 reverse transition：
#
# - $\eta=0$：deterministic DDIM；固定 $x_T$ 就固定輸出。
# - $\eta>0$：逐步加入 stochasticity。
# - 減少 `steps`：跳過 timestep，加快生成但增加離散化誤差。
#
# 注意：`eta=1` 且跳步時屬於 stochastic DDIM family；只有完整 ancestral update 才是上格的 DDPM baseline。

# %%
def ddim_timesteps(T, steps):
    steps = min(int(steps), T)
    return torch.linspace(T - 1, 0, steps).round().long().unique_consecutive().tolist()


@torch.no_grad()
def sample_ddim(model, n, steps=50, eta=0.0, x_T=None, keep_trajectory=False):
    x = torch.randn(sample_shape(cfg, n), device=device) if x_T is None else x_T.clone().to(device)
    times = ddim_timesteps(cfg.T, steps)
    trajectory = [x.detach().cpu()]
    stride = max(len(times) // 8, 1)
    for i, t_value in enumerate(tqdm(times, desc=f"DDIM steps={len(times)}, eta={eta}")):
        prev_value = times[i + 1] if i + 1 < len(times) else -1
        t = torch.full((n,), t_value, device=device, dtype=torch.long)
        x0_hat, eps = predict_x0(model, x, t, clip=cfg.image)
        ab_t = schedule["alpha_bar"][t_value]
        ab_prev = torch.tensor(1.0, device=device) if prev_value < 0 else schedule["alpha_bar"][prev_value]
        sigma = eta * torch.sqrt(((1 - ab_prev) / (1 - ab_t) * (1 - ab_t / ab_prev)).clamp(min=0))
        direction = torch.sqrt((1 - ab_prev - sigma.square()).clamp(min=0)) * eps
        noise = torch.randn_like(x) if prev_value >= 0 else torch.zeros_like(x)
        x = ab_prev.sqrt() * x0_hat + direction + sigma * noise
        if keep_trajectory and (i % stride == 0 or prev_value < 0):
            trajectory.append(x.detach().cpu())
    return x.detach().cpu(), trajectory


ddim50, ddim50_traj = sample_ddim(sample_model, n, steps=min(50, cfg.T), eta=0.0,
                                  x_T=fixed_xT, keep_trajectory=True)
ddim20, _ = sample_ddim(sample_model, n, steps=min(20, cfg.T), eta=0.0, x_T=fixed_xT)
ddim_stochastic, _ = sample_ddim(sample_model, n, steps=min(50, cfg.T), eta=0.5, x_T=fixed_xT)

show_batch(ddim50, "DDIM: eta=0, 50 steps", n)
show_batch(ddim20, "DDIM: eta=0, 20 steps", n)
show_batch(ddim_stochastic, "DDIM family: eta=0.5, 50 steps", n)

# %% [markdown]
# ## 9. 公平比較：固定相同的 $x_T$
#
# 若每個 sampler 都重新抽初始 noise，就無法判斷差異來自起點還是 dynamics。
# 下圖的四組結果全部使用 `fixed_xT`。

# %%
def comparison_figure(results, max_n=64):
    if not cfg.image:
        fig, axes = plt.subplots(1, len(results), figsize=(4 * len(results), 4), sharex=True, sharey=True)
        for ax, (name, x) in zip(axes, results.items()):
            x = x.numpy()
            ax.scatter(x[:, 0], x[:, 1], s=7, alpha=0.55)
            ax.set_title(name); ax.set_aspect("equal"); ax.grid(alpha=0.2)
    else:
        from torchvision.utils import make_grid
        fig, axes = plt.subplots(1, len(results), figsize=(4 * len(results), 4))
        for ax, (name, x) in zip(axes, results.items()):
            grid = make_grid(((x[:max_n] + 1) / 2).clamp(0, 1), nrow=8)
            ax.imshow(grid.permute(1, 2, 0).squeeze(), cmap="gray" if cfg.channels == 1 else None)
            ax.set_title(name); ax.axis("off")
    plt.suptitle("Same trained model, same x_T; only sampler changes")
    plt.tight_layout(); plt.show()


comparison_figure({
    f"DDPM {cfg.T}": ddpm_samples,
    "DDIM 50, eta=0": ddim50,
    "DDIM 20, eta=0": ddim20,
    "DDIM 50, eta=0.5": ddim_stochastic,
})

# %% [markdown]
# ## 10. Toy 專用：把 reverse trajectory 畫出來
#
# 影像只看到終點時，很容易把 DDPM 與 DDIM 誤認為「兩個模型」。
# 在 2D toy 上把路徑畫出來，會清楚看見：network 相同，但 stochastic / deterministic dynamics 不同。

# %%
def plot_toy_trajectories(ddpm_traj, ddim_traj, n_paths=24):
    if cfg.image:
        print("這格只在 DATASET='toy' 時繪圖。")
        return
    fig, axes = plt.subplots(1, 2, figsize=(11, 5), sharex=True, sharey=True)
    for ax, traj, title in zip(axes, [ddpm_traj, ddim_traj], ["DDPM", "DDIM (eta=0)"]):
        path = torch.stack(traj)[:, :n_paths]
        for i in range(n_paths):
            ax.plot(path[:, i, 0], path[:, i, 1], alpha=0.45, lw=1)
            ax.scatter(path[-1, i, 0], path[-1, i, 1], s=10)
        ax.set_title(title); ax.set_aspect("equal"); ax.grid(alpha=0.2)
    plt.suptitle("Same x_T, different reverse dynamics")
    plt.show()


plot_toy_trajectories(ddpm_traj, ddim50_traj)

# %% [markdown]
# ## 11. 建議實驗
#
# 1. **速度–品質曲線**：固定 `eta=0`，測 `steps = [5, 10, 20, 50, 100]`。
# 2. **隨機性**：固定同一個 `x_T` 重跑三次。`eta=0` 應完全相同；`eta>0` 會不同。
# 3. **起點 vs sampler**：先固定 `x_T` 比 sampler，再固定 sampler 改 `x_T`。不要把兩種變因混在一起。
# 4. **MNIST → CIFAR-10**：保持所有 diffusion 函數不變，只換 `DATASET`；觀察 RGB 任務需要更大模型與更多 steps。
# 5. **Score 連結**：在 toy 上畫 $s_\theta(x_t,t)=-\epsilon_\theta/\sqrt{1-\bar\alpha_t}$ 的向量場。
#
# 思考題：
#
# - 為什麼 DDIM 可以跳步，而訓練時不需要看過這條 trajectory？
# - `eta=0` 的 deterministic 是指「給定 $x_T$ 後」，還是指每次生成都相同？
# - 20-step DDIM 的問題主要是 network error、Gaussian approximation error，還是 numerical discretization error？如何設計實驗分開它們？

# %% [markdown]
# ## 12. Lab 小結
#
# - 訓練階段只學一個 denoiser / score network。
# - DDPM 與 DDIM 不需要兩套權重；它們是不同 reverse dynamics / solver。
# - 公平比較 sampler 時，必須固定相同的 initial noise $x_T$。
# - `steps` 控制計算量與離散誤差，$\eta$ 控制每一步重新加入多少隨機性。
# - toy、MNIST、CIFAR-10 共用的不是模型外觀，而是完整的 diffusion 數學流程。
