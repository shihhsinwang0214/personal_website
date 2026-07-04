# Syllabus — Diffusion & Flow-Based Generative Models (graduate course)

Revised course plan, targeted at a Stanford/MIT CS-department graduate elective (think CS236 / 6.S9xx level). It supersedes the 6-unit draft: the six original units are **kept as the six Parts**, but each Part becomes a *cluster of short modular notes/lectures* (matching the site's one-idea-per-note pedagogy), the foundations are thickened, flow matching is treated as co-equal to diffusion, and the standard missing lectures (flow-matching theory, stochastic interpolants, evaluation, discrete diffusion, likelihood/convergence) are added.

---

## 1. Course identity

- **Title:** Diffusion & Flow-Based Generative Models — Theory, Algorithms, and Applications.
- **Why not "diffusion" only:** the modern field is one continuous-time picture (score-based SDE ↔ probability-flow ODE ↔ flow matching ↔ stochastic interpolants). Branding the course as "diffusion" demotes flow matching, which is both the current frontier and the spine the existing `from-noise-to-data` notes already build. The unifying SDE/ODE/interpolant framework is the **through-line of the whole course**.
- **Level:** primary target is graduate (advanced senior + MS/PhD). **But the course is designed to be followable by a motivated 大一/大二 student with no prior background**, via **Part 0 (Math Intuitions)** — a gentle prerequisite primer (see `docs/math-intuitions-series-plan.md`). Each later lecture lists which `math-` primer notes it depends on; students who lack a tool read that primer note first.
- **Prerequisites (formally none, with Part 0):** ideally probability, multivariable calculus, linear algebra, a first exposure to ODEs/SDEs, and ML/DL (CS229/CS230 level) + Python/PyTorch — but every one of these objects is (re)introduced intuition-first in Part 0, so a student can pick them up alongside the course.
- **Pace (binding).** Match the From Noise to Data gradualness: **one new object per note, problem-driven, picture-before-symbol**; a "lecture" is a *cluster of 3–5+ short notes*, not one dense pass. See the pacing rule in `docs/n2d-voice-and-quiz-style.md`. Math technical terms are written in **English** (bounded, smooth, time-dependent, …) per the same guide.
- **Learning outcomes.** By the end a student can: (i) derive the DDPM/score/flow objectives from first principles; (ii) move fluently between the ε / x₀ / v / score / velocity parameterizations and between SDE and ODE samplers; (iii) state and use the flow-matching / conditional-flow-matching theorem and the stochastic-interpolants unification; (iv) reason about sampler error and convergence (KL vs W₂); (v) implement and evaluate a diffusion/flow model; (vi) read a current paper and place it on the framework (path / target / sampler / guidance).
- **Format:** ~14 lectures, each backed by 2–4 short site notes (MDX + interactive demo + self-check quizzes), 4 problem sets (theory + code), and a final project.

## 2. Assessment

| Component | Weight | Notes |
|---|---:|---|
| 4 problem sets | 40% | Each = derivations + a small implementation. PS topics listed per Part below. |
| Midterm (take-home) | 15% | Foundations (Parts I–II): derive an objective, convert parameterizations, analyze a sampler. |
| Final project | 35% | Reproduce-and-extend a paper, *or* a novel small result. Proposal → milestone → report + demo. |
| Notes/demo contributions | 10% | Students submit one improved note or interactive demo (uses the site infra). |

Problem-set spine (one representative task each):
- **PS1 (Foundations I/II):** derive the DDPM training loss from the ELBO and show ε-, x₀-, v-prediction are linear reparameterizations; implement DDPM on 2-D toy data.
- **PS2 (Continuous time + flow matching):** derive the probability-flow ODE drift from the reverse SDE; prove the conditional-flow-matching gradient equals the marginal one; train CFM on the same toy data, compare to PS1.
- **PS3 (Samplers + guidance):** implement DDIM and a 2nd-order solver; measure quality vs NFE; implement classifier-free guidance and sweep the scale.
- **PS4 (Discrete or applied):** implement a masked/discrete diffusion sampler on text-like tokens, *or* an E(n)-equivariant denoiser on a small point cloud.

## 3. Notation & conventions (used throughout)

Time `t∈[0,1]` with `p₀=𝒩(0,I)` (noise) → `p₁≈p_data` (data) for the flow convention; we **flag** the diffusion convention (`t:0→T`, `t=0` data) at first use. Forward `x_t = α_t x₀ + σ_t ε`, SNR `= α_t²/σ_t²`. Objects: denoiser/ε-net `ε_θ`, score `s_θ≈∇log p_t`, velocity `v_θ≈v_t`. Key identities reused every lecture: `∇log p_t = −ε*/σ_t` (Tweedie) and PF-ODE drift `f − ½g²∇log p_t`.

## 4. Lecture sequence (14 lectures in 6 Parts)

Each lecture lists: **key results/derivations · primary readings · demo (feasibility) · maps to existing `n2d-` notes (depth delta)**. Site group/folder: `research-areas/diffusion-flow-course/`, slug prefix `dfc-`.

### Part 0 — Math Intuitions (prerequisite primer)  *(new; for 大一/大二, no background)*

A gentle, life-first math toolbox (~15 short notes) that introduces every object the course uses — `random variable` / `distribution` / `density`, `expectation` / `conditional expectation`, `Gaussian`, `vector` / `gradient` / `vector field` / `flow`, `ODE` / `Euler step`, `random walk` → `Brownian motion` / `SDE`, `change of variables` / `Jacobian`, `KL` / `Wasserstein`. One object per note, English terms, analytic 2-D demos. **Full plan: `docs/math-intuitions-series-plan.md`.** Folder `research-areas/math-intuitions/`, slug prefix `math-`. Each lecture below assumes the student has (or can read) the relevant `math-` note — list those as "prereqs" at the top of each lecture's first note.

### Part I — Principles & forward/reverse processes  *(orig. Unit 1)*

**L1 · `dfc-principles` — What diffusion/flow models are.**
Generative modeling as transport from a simple base to data; "corrupt then reverse" vs "flow along a field" as two views of one object; the train/sample/guidance/eval map of the course.
*Readings:* Sohl-Dickstein 2015; Ho 2020 (DDPM); Song 2021 (SDE).
*Demo:* global data↔noise↔data pipeline; 2-D forward/reverse animation (analytic — feasible).
*Maps:* compresses `n2d-what-models-learn`, `n2d-why-gaussian`, `n2d-probability-path` into a formal definition; delta = makes it a precise stochastic process, not just intuition.

**L2 · `dfc-forward-reverse-sde` — Forward and reverse processes.**
DDPM discrete forward; continuous SDE `dx=f dt+g dW`; **reverse-time SDE (Anderson)** derivation; Fokker–Planck; the SDE↔ODE↔FP triangle.
*Readings:* Anderson 1982; Song 2021; Särkkä & Solin (SDE background).
*Demo:* OU forward vs learned reverse on a 2-D mixture; show marginals match (analytic — feasible).
*Maps:* deepens `n2d-continuity-equation` (adds diffusion term → Fokker–Planck) and `n2d-samples-as-particles`.

### Part II — Training objectives & the score  *(orig. Unit 2, foundations half)*

**L3 · `dfc-ddpm-elbo` — The variational view & parameterizations.**
ELBO / variational bound for the reverse chain → the simplified `‖ε−ε_θ‖²` loss; ε- vs x₀- vs **v-prediction**; loss weighting & SNR; schedules (linear, cosine, EDM preconditioning).
*Readings:* Ho 2020; Nichol & Dhariwal 2021; Kingma 2021 (VDM); Salimans & Ho 2022 (v); Karras 2022 (EDM).
*Demo:* schedule explorer (α_t,σ_t, SNR curves) + loss-weight effect on a toy fit (feasible).
*Maps:* `n2d-denoising` → adds the full ELBO derivation and the parameterization algebra.

**L4 · `dfc-score-matching` — Score matching & Tweedie.**
Score `∇log p`; explicit / **denoising (DSM)** / **sliced** score matching; Tweedie `E[x₀|x_t]`; the `score = −ε/σ` equivalence in full; NCSN/annealed Langevin.
*Readings:* Hyvärinen 2005; Vincent 2011; Song 2020 (SSM); Song & Ermon 2019 (NCSN).
*Demo:* reuse/extend `score-field` (multi-noise-level score; Langevin walker) — feasible.
*Maps:* `n2d-score-function` → adds the estimator theory (which losses are tractable & why).

**L5 · `dfc-continuous-likelihood` — Probability-flow ODE & exact likelihood.**
PF-ODE drift from the reverse SDE; **instantaneous change of variables** → exact `log p` via the ODE; what a "score-based *model*" can and cannot compute; deterministic vs stochastic marginals.
*Readings:* Song 2021; Chen 2018 (Neural ODE); Grathwohl 2019 (FFJORD).
*Demo:* extend `n2d` PF-ODE: same marginals, ODE vs SDE trajectories; live `log p` on 2-D (feasible).
*Maps:* `n2d-probability-flow-ode` → adds likelihood/change-of-variables (currently absent).

### Part III — Flow matching & the unification  *(new; co-equal to diffusion)*

**L6 · `dfc-flow-matching` — Flow matching & conditional flow matching.**
Probability paths; the **CFM theorem** (conditional regression target's minimizer = marginal velocity; conditional & marginal losses share the θ-gradient); Gaussian paths vs OT paths; CFM ≡ DSM.
*Readings:* Lipman 2023 (FM); Tong 2023 (OT-CFM); Liu 2023 (rectified flow).
*Demo:* reuse `flow-matching` velocity demo; add the "conditional→marginal averaging" view (feasible).
*Maps:* `n2d-velocity-regression` + `n2d-conditional-to-marginal` → adds the proof, not just the picture.

**L7 · `dfc-stochastic-interpolants` — Stochastic interpolants: one framework.**
Interpolant `x_t=α_t x₀+β_t x₁(+γ_t z)`; the SDE↔ODE family with shared marginals; diffusion ↔ flow matching as one object; the noise level γ_t as a design variable; **convergence: KL (SDE/Girsanov) vs W₂ (ODE)**.
*Readings:* Albergo & Vanden-Eijnden 2023; Albergo, Boffi & Vanden-Eijnden 2023; Chen 2023 ("sampling is as easy as learning the score").
*Demo:* interpolant explorer (γ_t slider → SDE/ODE family, same marginals) — feasible.
*Maps:* `n2d-diffusion-fm-core`, `n2d-path-design`, and the KL/W₂ box in `n2d-probability-flow-ode` → made rigorous and central.

### Part IV — Algorithms: samplers, guidance, acceleration, discrete  *(orig. Units 2 sampler-half & 3)*

**L8 · `dfc-samplers` — Numerical samplers & error.**
Discretizing ODE/SDE; DDIM as an ODE solver; **DPM-Solver / higher-order**; ancestral; EDM stochastic "churn"; truncation error, NFE, and the quality–speed frontier; sampler-error theory.
*Readings:* Song 2021b (DDIM); Lu 2022 (DPM-Solver); Karras 2022 (EDM); Chen 2023.
*Demo:* **sampler playground** — Euler/DDIM/Heun/DPM on a 2-D target, steps vs error curve (feasible; toy only).
*Maps:* `n2d-sampling-as-integration` → adds solver families + convergence.

**L9 · `dfc-guidance` — Conditioning & guidance.**
Conditional models `p(x|c)`; **classifier guidance**; **classifier-free guidance** (derivation, the score-combination view); conditioning-injection mechanisms; guidance as score tilting and its biases.
*Readings:* Dhariwal & Nichol 2021; Ho & Salimans 2022.
*Demo:* guidance-scale slider on a 2-D conditional mixture (score tilting visualized) — feasible.
*Maps:* `n2d-conditional-to-marginal` → from training trick to inference-time control.

**L10 · `dfc-acceleration-distillation` — Few-step generation.**
Why few-step is hard (truncation); **rectified flow / reflow**; **consistency models**; progressive/▷ distillation; the path-design lever.
*Readings:* Liu 2023 (rectified flow); Song 2023 (consistency); Salimans & Ho 2022 (distillation).
*Demo:* curved-vs-straight path → steps-to-quality (extend `probability-path`) — feasible.
*Maps:* `n2d-rectified-flow` → adds consistency/distillation.

**L11 · `dfc-discrete-diffusion` — Discrete & masked diffusion.**
Why Gaussian/score don't transfer; D3PM (discrete state spaces); continuous-time Markov chains; **masked/absorbing diffusion**; ratio matching (SEDD); parallel denoising vs autoregression; "the fourth language."
*Readings:* Austin 2021 (D3PM); Campbell 2022 (CTMC); Lou, Meng & Ermon 2024 (SEDD).
*Demo:* token-grid masked-diffusion sampler on a tiny vocabulary (feasible; toy).
*Maps:* extends `n2d-three-languages` with a discrete language (new ground).

### Part V — Evaluation  *(new)*

**L12 · `dfc-evaluation` — Measuring generative models.**
Sample-quality metrics (FID, IS) and their pitfalls; likelihood/NLL & BPD; **precision/recall, density/coverage**; quality–diversity & mode coverage (ties back to the SDE/ODE coverage discussion); what to report and how to be fooled.
*Readings:* Heusel 2017 (FID); Salimans 2016 (IS); Kynkäänniemi 2019; Sajjadi 2018; Naeem 2020 (density/coverage).
*Demo:* 2-D toy where FID-analog looks great but a mode is dropped (recall catches it) — feasible.
*Maps:* gives a home to the "stochastic⟹covers more?" debate (now an evaluation question).

### Part VI — Applications  *(orig. Units 4–6, split)*

**L13 · `dfc-images-latent` — Diffusion for images.**
Pixel vs **latent diffusion**; text conditioning + CFG at scale; editing / inpainting / super-resolution as conditional generation; cost & resolution.
*Readings:* Rombach 2022 (LDM); Ramesh/Saharia (DALLE-2 / Imagen) — overview; Meng 2022 (SDEdit).
*Demo:* **pre-computed** denoising trajectories + pixel/latent toggle (NOTE: a live image model cannot run in-browser — use cached frames or a 2-D analog). Feasibility-limited; document it.
*Maps:* applies `n2d-score-function`/`vector-field`/`probability-flow-ode` to vision systems.

**L14 · `dfc-science-and-decision` — Physical systems, geometry, and decisions.** *(may split into two lectures)*
(a) **Scientific/physical:** states/trajectories/fields; physics & symmetry constraints; **E(n)/SE(3)-equivariant diffusion** (molecules, proteins); inverse problems. (b) **Decision & structured:** diffusion as policy (multimodal action generation), planning; structured/discrete outputs.
*Readings:* Hoogeboom 2022 (equivariant molecule diffusion); Watson 2023 (RFdiffusion); Janner 2022 (Diffuser); Chi 2023 (Diffusion Policy); De Bortoli 2021 (Schrödinger bridge).
*Demo:* rotate a 2-D point cloud → vectors co-rotate, distances invariant (equivariant denoiser, toy); diffusion-policy multimodal-action toy. Feasible (toy).
*Maps:* **cross-links the `invariance-and-equivariance` series** (E(n)/SE(3)); uses `n2d-continuity-equation`/`optimal-transport`/`path-design`; capstone ties to `n2d-three-languages`.

> **Pacing.** If a 13-lecture term is needed, merge L13+L14 into one applications lecture and move RFdiffusion/policy to readings. If you have 15–16 slots, split L14 into "Science & geometry" and "Decision & structured," and split L8 into "ODE samplers" / "SDE samplers + convergence."

## 5. Mapping back to your original 6 units

| Your unit | Becomes |
|---|---|
| 1 principles | Part I (L1–L2) |
| 2 training & sampling | Part II (L3–L5) **+** Part IV L8 |
| 3 conditioning & guidance | Part IV L9–L10 |
| 4 images | Part VI L13 |
| 5 physical systems | Part VI L14(a) + equivariance cross-links |
| 6 decision & structured | Part VI L14(b) **+** L11 (discrete gets its own lecture) |
| *(added)* | Part III L6–L7 (flow matching & interpolants), Part V L12 (evaluation), L5 (likelihood) |

## 6. Demo feasibility policy (important)

Browser demos must stay **analytic toys, 2-D analogs, or pre-computed/cached outputs** — a live latent-diffusion image model, a real PDE solver, or a protein model cannot run in the iframe sandbox. Reuse the `_demo-common.js` pattern (theme-aware, reduced-motion, responsive). For image/science lectures, ship cached denoising frame-sequences rather than promising a live model. Mark any "aspirational" demo as such.

## 7. Authoring conventions (so notes stay consistent)

Each lecture = 2–4 short MDX notes under `research-areas/diffusion-flow-course/`, group `"Diffusion & Flow Models"`. Follow `docs/n2d-voice-and-quiz-style.md`: scene opening, varied natural headings, intuition→formal math (KaTeX), `Quiz` components (varied correct index, every wrong option explained, plain-text options), standalone demos embedded via absolute `/personal_website/...` iframes, **inline cross-note links absolute** `(/personal_website/zh/notes/<slug>)`, bilingual frontmatter (zh + en `missing`), register slugs/order in `src/lib/notes.ts`. Never invent results; cite primary sources; verify every derivation; build must stay green.

## 8. Master reading list (primary sources)

*Foundations:* Sohl-Dickstein 2015; Ho, Jain & Abbeel 2020 (DDPM); Song & Ermon 2019 (NCSN); Song et al. 2021 (SDE); Anderson 1982; Vincent 2011; Hyvärinen 2005; Kingma et al. 2021 (VDM); Nichol & Dhariwal 2021.
*Flow / interpolants:* Lipman et al. 2023 (FM); Liu et al. 2023 (Rectified Flow); Albergo & Vanden-Eijnden 2023; Albergo, Boffi & Vanden-Eijnden 2023; Tong et al. 2023 (OT-CFM); Chen et al. 2018 (Neural ODE).
*Samplers / accel:* Song, Meng & Ermon 2021 (DDIM); Lu et al. 2022 (DPM-Solver); Karras et al. 2022 (EDM); Song et al. 2023 (Consistency); Salimans & Ho 2022; Chen et al. 2023 (convergence).
*Guidance:* Dhariwal & Nichol 2021; Ho & Salimans 2022.
*Discrete:* Austin et al. 2021 (D3PM); Campbell et al. 2022; Lou, Meng & Ermon 2024 (SEDD).
*Evaluation:* Heusel et al. 2017 (FID); Salimans et al. 2016 (IS); Kynkäänniemi et al. 2019; Naeem et al. 2020.
*Applications:* Rombach et al. 2022 (LDM); Meng et al. 2022 (SDEdit); Hoogeboom et al. 2022; Satorras et al. 2021 (EGNN); Watson et al. 2023 (RFdiffusion); Janner et al. 2022 (Diffuser); Chi et al. 2023 (Diffusion Policy); De Bortoli et al. 2021 (Schrödinger Bridge); Chen & Lipman 2023 (Riemannian FM).

> Verify each citation's exact title/venue/year against the source before publishing a note (per the ground-truth policy). This list is the planning set, not a substitute for checking.
