# Notes coverage map — Diffusion / Flow Matching (for planning deeper content)

Snapshot for the content agent. Covers what the current notes already teach (so we don't repeat) and where the natural "go deeper" branches are. Depth legend: **B** = intuition→bridge (picture + core formula + research framing, stops before heavy derivation), **M** = mid (has the key derivation), **S** = shallow/stub.

## Series A — "From Noise to Data" (`research-areas/from-noise-to-data/`, 18 notes, zh `.mdx`, en `missing`)

| # | slug | covers | depth |
|---|---|---|---|
| 1 | n2d-what-models-learn | generative = learn a distribution & sample (not memorize); discriminative vs generative; p(x), p(x\|c); 3 questions to ask of any paper (represent/train/sample) | B |
| 2 | n2d-why-gaussian | base distribution; why Gaussian (samplable, isotropic, closed-form, endpoint of noising); push-forward T#p₀ | B |
| 3 | n2d-samples-as-particles | Lagrangian view; dx/dt=v_t(x); micro trajectory vs macro p_t | B |
| 4 | n2d-vector-field | Eulerian view; v_t as the learnable field; flow map φ_t; field > trajectory | B |
| 5 | n2d-probability-path | {p_t} as a path of distributions; designed not observed; straight-line & noising paths | B |
| 6 | n2d-continuity-equation | ∂_t p + ∇·(p v)=0 as mass conservation; Fokker–Planck pointer | B/M |
| 7 | n2d-denoising | x_t=α_t x₀+σ_t ε; ε-prediction L2 loss; **diffusion time-direction convention** flagged | B |
| 8 | n2d-score-function | score=∇log p; 1-D example; **Tweedie / ∇log p_t = −ε*/σ_t** (denoising≡score) | B/M |
| 9 | n2d-velocity-regression | straight-line FM; u_t=x₁−x₀; L2 velocity regression; solve ODE to sample | B |
| 10 | n2d-conditional-to-marginal | **CFM trick**: regress conditional target, L2 minimizer = conditional mean = marginal field; = DSM | M |
| 11 | n2d-diffusion-fm-core | same path, 3 reparameterizations (ε / score / velocity) inter-convertible; "FM replaces diffusion" debunked | B/M |
| 12 | n2d-probability-flow-ode | PF-ODE dx/dt=f−½g²∇log p; same marginals; **"stochastic⟹covers more" reductio**; **KL (SDE/Girsanov) vs W₂ (ODE) under imperfect fields** | B/M |
| 13 | n2d-sampling-as-integration | sampling = integrate ODE/SDE; Euler, truncation error O(Δt), NFE; solver vs few-step branches | B |
| 14 | n2d-path-design | path as a design variable; stiffness/steps/stability; noise level γ_t as design (stochastic interpolants pointer) | B |
| 15 | n2d-rectified-flow | reflow straightens marginal trajectories; crossing pairs; few/one-step (InstaFlow) | B |
| 16 | n2d-optimal-transport | Monge/Kantorovich; W₂; Benamou–Brenier dynamic form → continuity eq.; "not all FM = OT" | B |
| 17 | n2d-three-languages | synthesis: noise/score/velocity = one dynamic in 3 coordinates; conversion; 3 research branches | B |
| 18 | n2d-review | 10 cross-cutting review quizzes (no new content) | — |

**Demos already built** (`public/notes/research_areas/noise-to-data/`): `noise-to-data`, `vector-field`, `probability-path`, `score-field`, `flow-matching` (+ reuse `flow-matching/story-truncation-error`). Shared `_demo-common.js`.

## Series B — "Flow Matching" (`research-areas/flow-matching/`, 2 notes, older)
- `flow-matching-flow-ode` — sand-pile→sandcastle; Flow ODE intuition; Euler discretization; truncation error (has demos).
- `flow-matching-training` — training objective; "move with the crowd" velocity; stochastic-interpolants flavour (has demos).
*(Overlaps Series A notes 3–4, 9–10, 13; consider merging or cross-linking rather than re-covering.)*

---

## What is already solid (don't re-teach, just reference)
The **conceptual spine and unification**: noise→data, particle/field, probability path, continuity equation, the three signals (ε/score/velocity) and their equivalence, CFM trick, PF-ODE, sampling-as-integration, path design, rectified flow, OT framing, and the SDE-vs-ODE coverage / KL-vs-W₂ nuance. All at intuition→bridge depth with demos and self-check quizzes.

## Where to go deeper (the open branches)

**Diffusion (mostly absent beyond the bridge):**
- Forward processes in full: VP / VE / sub-VP SDEs; DDPM discrete ↔ continuous; reverse-time SDE (Anderson) derivation.
- Training objectives: ELBO / variational bound; ε- vs x₀- vs **v-prediction**; SNR weighting / loss weighting; noise schedules (linear / cosine / **EDM**).
- Guidance & conditioning: classifier guidance, **classifier-free guidance**, conditioning mechanisms; latent diffusion.
- Samplers in depth: DDIM, **DPM-Solver(++)**, ancestral, EDM stochastic "churn"; error analysis vs NFE.
- Few-step / distillation: **consistency models**, progressive/▷ distillation, adversarial distillation.
- Variants: discrete / masked diffusion; diffusion on manifolds; blurring/cold diffusion.

**Flow Matching (deepen from the bridge):**
- Full **CFM theorem** with proof (marginal = conditional-gradient equivalence); Gaussian probability paths vs **OT paths**.
- **Stochastic Interpolants** as the unifying framework (γ_t, SDE↔ODE family); diffusion ↔ FM equivalence in full.
- **Rectified flow / reflow** theory; **mean flow**; **OT-CFM** (minibatch OT coupling); **Schrödinger bridge** / diffusion bridges.
- **Riemannian / manifold FM**; simulation-free training; guidance for FM; FM for discrete data.

**Shared theory (touched, not derived):**
- Convergence: KL/TV bounds for SDE samplers (Girsanov; "sampling is as easy as learning the score"); W₂ bounds for ODE; sampler discretization error.
- Score-matching estimators: explicit / denoising / sliced score matching.
- Likelihood via PF-ODE (instantaneous change-of-variables); exact ELBO links.

## Conventions any deeper note must follow
MDX with the `Quiz` component (varied correct-answer index, multiple per note, every wrong option explained, plain-text options); scene-opening + varied natural headings + warm low-pressure voice; intuition→formal math (KaTeX), distinguishing intuition / fact / research-use / simplification; standalone HTML demos (theme-aware, reduced-motion, responsive) embedded via absolute `/personal_website/...` iframe; **inline cross-note links absolute** `(/personal_website/zh/notes/<slug>)`; bilingual frontmatter (zh + en `missing`); never invent results, cite primary sources. See `docs/n2d-voice-and-quiz-style.md`.
