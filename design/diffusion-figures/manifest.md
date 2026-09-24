# Diffusion figure redraw manifest

This file records the source-of-truth and acceptance contract for the 27 Week 3–7 raster figures. The original specification for every row is the `type="static"` `<VizPlan>` block in the corresponding MDX file at Git `HEAD`. Retrieve it with:

```powershell
git -c safe.directory=C:/Users/vespe/Documents/Codex/personal_website show HEAD:site/src/content/notes/research-areas/diffusion-models-and-their-applications/<week>/<note>.zh.mdx
```

## Shared contract

- Canvas width is 1920 px. Heights are 720 (16:6), 840 (16:7), 960 (16:8), 1080 (16:9), 1200 (16:10), or 1440 (16:12 / 4:3).
- `#fffdfb` background; thin rounded panels; no drop shadow, 3D gloss, or oversized poster headline.
- `#4a90e2` = noise / Gaussian, `#f0803c` = data / forward, `#2a4ea3` = main inference / arrow.
- Text, equations, axes, matrices, tables, ticks, and arrows are deterministic SVG layers. Image generation is limited to animal/data thumbnails and subtle texture.
- Every figure must expose at least one exact mathematical anchor and one visible reasoning relation without depending on its caption.
- A dog may represent a sample, endpoint, candidate, or small corner guide. It may not replace a variable, proof step, plot, table, or matrix.

## Per-figure contract

`A` means structural rebuild. `B` means the valid geometric idea may be retained, but typography and mathematical evidence still need rebuilding.

| Output | Source note | Class | Ratio | Required reasoning / mathematical evidence | Dog role |
|---|---|---:|---:|---|---|
| `w-3-3-2.png` | `week-3/dma-w3-3-tweedie-and-score` | A | 16:7 | Three time regimes; candidate-line thickness = posterior weight; `E[x₀\|x_t]−x_t`; score/density direction and Tweedie equivalence | None |
| `w4-0-1.png` | `week-4/dma-w4-0-why-not-diffusion` | B | 16:9* | Two non-Gaussian endpoint tasks; manifold vs Gaussian-noise limitation; tied-knob conclusion | Endpoint samples only |
| `w4-1-1.png` | `week-4/dma-w4-1-flows-and-continuity` | B | 16:9* | `u_t`, trajectories at `t=0,.25,.5,.75,1`, `ψ_t/ψ_1`; network learns the field, not stored paths | None |
| `w4-2-1.png` | `week-4/dma-w4-2-conditional-flow-matching` | B | 16:6 | `z=(x₀,x₁)` → conditional velocity → posterior-weighted `u_t(x)`; L2-regression conclusion | Endpoint samples only |
| `w4-3-1.png` | `week-4/dma-w4-3-linear-path` | A | 16:8 | Crossing conditional lines but non-crossing marginal ODE curves; `(2,2),(-2,2)→(0,2)`; curvature and four-step error | None |
| `w4-4-1.png` | `week-4/dma-w4-4-fm-vs-diffusion` | A | 16:7 | Both exact parameterizations, affine transform, same underlying object, Gaussian-path-only caveat | None |
| `w4-5-1.png` | `week-4/dma-w4-5-lab` | A | 16:7 | log step-count axis with slopes −1/−2; distinguish slope from vertical error level | Optional corner guide |
| `w5-0-1.png` | `week-5/dma-w5-0-unified-equation` | A | 16:10 | Unified equation; coupling `π`; coefficient schedules; `γ₀=γ₁=0`; four-method special-case table | `x₁` data endpoint |
| `w5-1-1.png` | `week-5/dma-w5-1-sampler-family` | A | 16:12 | Same time-space marginals; deterministic/noisy paths; forced perturbation `ε=0` biased vs `ε>0` recovery with ≈.70/.01 | Endpoint samples only |
| `w5-2-1.png` | `week-5/dma-w5-2-error-theory` | A | 16:6 | `∂_t u_t` and convective term; uniform-field zero acceleration; `C_L h∫‖ẍ_t‖dt` | None |
| `w5-3-1.png` | `week-5/dma-w5-3-rectified-flow` | A | 16:10 | Rectification loop; preserves marginals; non-increasing cost; non-crossing paths; metrics by round | Data endpoints only |
| `w5-4-1.png` | `week-5/dma-w5-4-minibatch-ot` | A | 16:10 | Four labeled points; both squared-cost sums; `2(a−b)ᵀ(A−B)`; monotonicity chain; batch-size/crossing plot | None |
| `w5-5-1.png` | `week-5/dma-w5-5-shared-techniques` | A | 16:10 | Map each technique to `C_L`, `h`, or `∫‖ẍ_t‖dt`; mark SDE/time weighting outside this deterministic bound | Optional corner guide |
| `w5-6-1.png` | `week-5/dma-w5-6-lab` | A | 16:9 | Denoising → Tweedie/score → velocity → curvature/Euler chain; pairing, sampler, and training-distribution branches | Optional corner guide |
| `w6-0-1.png` | `week-6/dma-w6-0-discrete-data` | B | 16:9 | Uniform vs absorbing chains; shared `ᾱ_t` curve; 12-token time ticks; can a corrupted token return? | None |
| `w6-1-1.png` | `week-6/dma-w6-1-d3pm` | A | 16:8 | Masked sequence `x_t` → per-position K logits → closed-form `q(x_{t−1}\|x_t,x̃₀)`; k-step jump and continuous/discrete analogy | None |
| `w6-2-1.png` | `week-6/dma-w6-2-masked-diffusion` | A | 16:9 | `L₀/ΣL_{t−1}/L_T`; posterior/model cancellation; unmasked KL = 0; masked CE; weighted final sum | None |
| `w6-3-1.png` | `week-6/dma-w6-3-factorization-error` | B | 16:8 | Curved path vs Euler chord with `∫‖ẍ‖dt`; true joint 2×2 vs product 2×2 with `KL(joint‖product)`; zero conditions | None |
| `w6-4-1.png` | `week-6/dma-w6-4-absorbing-vs-uniform` | B | 16:9 | Time-axis evidence: wrong absorbing reveal persists; uniform hidden noise can later correct; model cannot identify plausible corrupt tokens | None |
| `w6-5-1.png` | `week-6/dma-w6-5-lab` | A | 16:8 | Parity: k=1 100%, k≥2 50%; Markov gradual error 0.50→0.10; same transition .9 and switching .1 | None |
| `w7-0-1.png` | `week-7/dma-w7-0-why-continuous-time` | A | 16:9 | 3×3 matrix with γ edit vs state-rate graph with σ arcs; closed-form breakage vs local-rate flexibility | None |
| `w7-1-1.png` | `week-7/dma-w7-1-ctmc` | B | 16:8 | Highlight state b; explicit weighted inflow/outflow sums; conservation; continuous flux/divergence correspondence | None |
| `w7-2-1.png` | `week-7/dma-w7-2-concrete-score` | B | 16:8 | Gradient/ratio/limit; sequence neighbors with concrete ratios; `drift = known + g² score` vs `rate = known × ratio` | None |
| `w7-3-1.png` | `week-7/dma-w7-3-remasking` | B | 16:8 | Two-pipe calculation: rates differ but rate×source proportion agrees; base `u_t`; continuous `ε_t` noise/score cancellation | None |
| `w7-4-1.png` | `week-7/dma-w7-4-discrete-flow-matching` | A | 4:3 | Conditional velocities → marginal velocity; conditional jump times/rates → marginal rate; linear continuity/forward equations | None |
| `w7-5-1.png` | `week-7/dma-w7-5-applications` | A | 16:9 | Four rows: LLaDA, EvoDiff, Multiflow, DiGress; explicit path/target/sampler distinctions | Semantic modality samples only |
| `w7-6-1.png` | `week-7/dma-w7-6-lab` | B | 16:7 | Four sequence states / three operations; exact Bernoulli rates; `u′_t=u_t+σ_tα_t/(1−α_t)`; K bars; three error sources | None |

`*` The original VizPlan does not prescribe an aspect ratio; 16:9 is the project default for these two figures.
