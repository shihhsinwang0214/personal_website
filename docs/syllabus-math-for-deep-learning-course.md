# Syllabus — All the Math You Need for Deep Learning

A standalone, intuition-first math course that gives a motivated learner every mathematical *object* modern deep learning runs on — and the literacy to **read an equation, do the short derivation a paper actually needs, translate it to/from plain language and code, and explain it back**. Targeted at the level of a Stanford/MIT introductory math-for-ML course (think **MIT 18.065** *Matrix Methods in Data Analysis, Signal Processing, and Machine Learning* and the **Stanford CS229** math-review track), but written so a 大一/大二 student with little background can follow the main line.

> **This document completely replaces `docs/math-intuitions-series-plan.md`.** It keeps the same site infrastructure (folder `research-areas/math-intuitions/`, `math-` slug prefix, the three already-written probability notes) but re-organizes everything around **question-driven lectures**, adds the linear-algebra / spectral / regression / optimization / information-theory spine the old plan lacked, and adopts a **three-tier** note design (intuition → *lightweight derivation* → `深一層` rigor box). The diffusion/flow course's "Part 0" pointer now resolves here.

---

## 1. Course identity

- **Title:** All the Math You Need for Deep Learning.
- **One-line thesis:** Deep learning reuses a *small* set of mathematical objects — vectors, linear maps, eigen/SVD, gradients, distributions, likelihoods, flows — over and over; learn each one life-first, learn to *read its notation and push it a few honest steps*, and the field stops looking like magic.
- **The distinctive skill (the spine):** beyond "knowing the math," every note trains four transferable abilities, in this order:
  1. **Read and interpret notation** — decode an unfamiliar symbol/equation into what it *does*.
  2. **Derive, lightly** — carry out the short manipulation a paper expects you to be able to reproduce (expand a norm, set a gradient to zero, take a `log`, complete the square). This is a first-class skill, because reading notation alone is not enough to write or check a paper.
  3. **Translate both directions** — practical method ↔ precise math formulation ↔ a few lines of code.
  4. **Communicate the insight** — say in one plain sentence what an object buys you.
  Every note carries a *"把白話翻成數學 / 把數學翻回白話"* beat **and** a short *lightweight derivation* that practices (1)–(4) on that note's object.
- **Level & three-tier design (binding).** See §6 for the exact contract. In one line: the **main line** is gentle (大一/大二, picture-before-symbol) *and also contains a ≤5-line derivation*; the **`深一層` (Deeper) box** holds the harder/full derivation or proof. A student can read only the main line — derivation included — and still finish every lecture; a stronger student gets a real proof in the box.
- **Prerequisites:** none formally. High-school algebra and a willingness to look at a picture, then a symbol, then a three-line manipulation.
- **Relationship to the rest of the site.** This is the **foundations layer** under the two research-area series. L7 (probability → objectives) and L8 (dynamics & flows) are the explicit bridges into **From Noise to Data / Diffusion & Flow Models**; L1/L3/L5 objects (inner product, spectral methods, gradients) feed the **Invariance & Equivariance** series.
- **Learning outcomes.** A student who finishes can: (i) represent data as vectors/matrices and compare them with norms and inner products; (ii) read and compute an eigendecomposition / SVD and explain PCA, compression, and spectral clustering as one idea; (iii) set up and **solve least squares by hand** and state the optimal-predictor view; (iv) compute gradients/Jacobians, **differentiate matrix expressions**, apply the chain rule, and run gradient descent; (v) reason about randomness, expectation, variance, the Gaussian, Bayes' rule, and whether a measured improvement is real; (vi) **derive standard losses from maximum likelihood** (MSE from a Gaussian, cross-entropy from a categorical), read entropy / KL / the ELBO, and take a Monte-Carlo gradient through randomness; (vii) read an ODE/flow and explain how a learned vector field transports a simple distribution to data; (viii) **open a current paper, name each object in an equation, reproduce its short derivation, and translate it to plain language and code.**
- **Format:** **10 lectures**, each backed by **3–6 short site notes** (one idea per note, MDX + KaTeX + an interactive demo where cheap + self-check `Quiz`), **5 three-tier problem sets** (proof + derive-from-scratch + implement-and-verify; see §4), and a **live-anchored, AI-resilient assessment** (in-person read-&-derive checkpoints + an oral paper viva + peer-teaching) designed to scale to a large cohort. Lecture 10 is review + viva defenses. Full design (and the source plans it is assembled from) in §4.

## 2. Course design principles

These rules bind every note and lecture:

- **One object per note.** Each note introduces exactly one new mathematical object, problem-driven — the reader first feels *why* they need it — and picture before symbol.
- **Three tiers per note** (full contract in §6): **intuition** main line → a **lightweight derivation** (a ≤5-line, by-hand manipulation a paper expects you to reproduce) → an optional **`深一層` (Deeper) box** with the harder/full derivation or proof. A 大一/大二 student reads only the main line — derivation included — and still finishes; a stronger student gets a real proof in the box. **Load-bearing facts never live only in a box.**
- **Read · derive · translate · communicate.** Every note rehearses the four spine skills (§1), including a *"把白話翻成數學 / 把數學翻回白話"* beat and the lightweight derivation.
- **English technical terms in Chinese prose** (per `docs/n2d-voice-and-quiz-style.md`): glossed once in plain language on first use, then reused in English.
- **Bilingual, zh-first.** Each note ships zh first; the en side ships as a `missing` stub and is a tracked TODO. Never auto-translate.
- **Ground truth.** Never invent results or citations; verify every derivation — both tiers — before publish.

## 3. Scope & depth — core, deeper, and 課外讀物

The syllabus is scoped against MIT 18.065 (Strang), *Mathematics for Machine Learning* (Deisenroth/Faisal/Ong), Goodfellow Part I, and the CS229 math track. Material sits in one of three depth bands.

**Core — taught in the lecture notes (main line + lightweight derivation).** The spine runs: vectors & similarity (L1) → spectral methods (L2–L3) → regression & optimization, including matrix calculus (L4–L5) → probability & Bayes (L6) → **probability → trainable objectives** (L7) → dynamics & flows (L8) → synthesis & reading papers (L9). **Lecture 7 is the keystone**: the bridge from a probability model to a loss you can train — maximum likelihood and "loss = −log-likelihood," classification (logistic/softmax), information theory (entropy / cross-entropy / KL), Jensen's inequality and the ELBO, and stochastic gradients (Monte-Carlo, the score-function and reparameterization tricks). It is the spine of modern training and the on-ramp to the diffusion/flow course. Bayes' rule (L6) and the matrix-calculus toolkit (L5) live in the core too.

**Deeper — `深一層` boxes (optional rigor, carried inside the relevant notes).**
- **Taylor expansion, the Hessian, curvature, Newton's method** — `math-gradient-descent`.
- **Quadratic forms & positive-(semi)definiteness** — why covariance / Gram / Hessian are PSD — `math-eigenvectors-and-eigenvalues`.
- **Lagrange multipliers** — PCA's Rayleigh quotient, softmax as max-entropy — used where they appear.
- **Determinant / trace / log-det** — the log-det Jacobian in flow likelihoods — `math-change-of-variables`.
- **Matrix & spectral norms, Lipschitz constants** — stability, spectral normalization, ODE existence — `math-norms-and-distance`.
- Plus the per-note Deeper boxes in the appendix (Eckart–Young, the spectral theorem, backprop as reverse-mode autodiff, `D_KL ≥ 0` via Jensen, the score-function vs reparameterization variance comparison, …).

**課外讀物 — optional further reading for interested students (developed later).** Outside the core path, but each is named with a one-line hook and a forward-link in `math-where-the-math-shows-up` (L9), and will grow into standalone optional notes as time allows:
- **Fourier & the convolution theorem** — positional encodings, convolutions, spectral views of signals.
- **MCMC & Langevin dynamics** — sampling beyond ODE flows; the SDE / score-based on-ramp.
- **Natural gradient & information geometry** — the geometry of distributions; why the Fisher metric.
- **Kernels & RKHS** — the feature-map view; kernels as inner products in disguise (ties back to L1).
- **Tensors, einsum & broadcasting** — the index-bookkeeping reality of implementing the math.

> Deliberately **out of scope** (these belong to the research-area series, not a foundations course): measure theory, full real analysis, manifold / Riemannian geometry. The course stays "all the math you *need*," not "all the math."

## 4. Assessment

Assessment is modeled on how real Stanford/MIT math-for-ML courses actually grade — harder than a single derivation plus a short script, in three specific ways: **(a) problem sets are proof-bearing**, not plug-and-chug — at EE364A "the homework problems all started as final-exam problems"; **(b) there is a genuine timed or take-home exam under an honor code with no AI** — EE364A runs a 75-minute midterm *and* a **24-hour take-home final**; **(c) the project is large and staged** — MIT 18.065 is **50% homework + 50% project with no exams at all**, and CS236's 40% project is gated through proposal → progress → poster → report. Reference weightings: **CS229** ≈ 45% psets / 15–20% midterm / 40% project; **CS236** = 45% homeworks / 15% midterm / 40% staged project; **EE364A** = hard homework / 15% midterm / ~65% on a 24-hour take-home final; **MIT 18.065** = 50% homework / 50% project.

### 4.1 What "harder" means here (applies to every plan below)

- **Three-tier problem sets.** Every pset carries all three tiers, graded for *rigor and exposition*, not just the final number:
  1. **Proof tier** — a real theorem, fully argued. Bank (one per block): prove **Eckart–Young** (truncated SVD is the optimal rank-k approximation); prove the **L2-optimal predictor is `E[Y|X]`**; derive **backprop** for a 2-layer net as reverse-mode autodiff; prove **`D_KL ≥ 0`** via Jensen and that minimizing cross-entropy = minimizing `D_KL(data‖model)`; prove the **score-function estimator is unbiased** and derive the **ELBO** with its `D_KL` gap.
  2. **Derive-from-scratch tier** — reproduce a paper's core equation from first principles (e.g. the **DDPM/flow-matching loss**, the **softmax cross-entropy gradient**, the **PCA = SVD-of-centered-data** identity) with every step justified.
  3. **Implement-and-verify tier** — code it *and numerically confirm the derivation*: a finite-difference **gradient check** against your hand-derived gradient; verify PCA ≡ SVD; show the Monte-Carlo error scales like `1/√N`; confirm reparameterization and score-function estimators have the same mean but different variance.
- **A no-AI, honor-code exam** in every plan that has one, with a mandatory signature item: **read an *unseen* paper equation cold → name each object → reproduce its short derivation → translate to plain language and code.** This operationalizes the course's spine skill under exam conditions.
- **Starred hard problem** on each pset (optional-but-counts, EE364A-style — a former exam problem) so strong students are stretched and grading can curve.
- **Rubric-and-curve grading** with no preset letter thresholds (per EE364A), rewarding correct *and* well-explained derivations.
- **The graded signal is synchronous; the prep is not.** In the AI era a take-home artifact proves little, so every *graded* moment is **live and interactive** (in-person checkpoints, a short oral defense, peer-teaching). Students may use anything — including AI — to *prepare*; they alone perform live. Any polished artifact (report, slides, recording) is treated as allowed-AI prep that is **anchored by an unscripted live moment**, and the **Q&A / defense is weighted above the polished talk** — a script can be AI-written, the follow-up cannot.

### 4.2 Canonical plan — "Explain It Live" (live-anchored, AI-resilient, scales to >30)

Built from the author's steer: the course's real goal is **clear conveyance of a math idea**; the graded signal must resist AI and student hacks; and the cohort is **large (>30)**, so a long individual oral for everyone is infeasible. The fix is to put the integrity-bearing signal in **in-person, no-device moments that batch** (whole-cohort simultaneous checkpoints) plus a **short live defense that anchors a recorded explainer**. Viva and checkpoints are co-weighted, per the author's preference.

| Component | Weight | Format at scale (>30) | Why it's AI-resistant & on-goal |
|---|---:|---|---|
| **Live read-&-derive checkpoints** | 30% | 3–4 **in-class, whole-cohort, no-device** sessions (~30 min, paper/whiteboard). Handed a (possibly unseen) equation/framework: (a) name every object, (b) reproduce the short derivation, (c) write a **3-sentence plain-language explanation**. Rubric-graded, TA-shareable. | synchronous + no devices ⇒ AI-proof; tests derive-on-sight **and** plain-language conveyance. The site gateway `Quiz`es become *practice*, not the graded check. |
| **Oral paper viva** — recorded explainer + short live defense | 30% | Assigned a **candidate paper** (curated, rotated bank) ~2 weeks ahead; AI allowed to prepare. Submit a **5-min recorded plain-language explainer** for a stated audience (scales). Then a **≤8-min scheduled live defense** in TA-run sections (two graders or recorded for moderation): unscripted Q&A, **derive a skipped step on the board**, one curveball ("what breaks if we change this assumption?"). **Defense weighted 2:1 over the recording.** | the recording tests breadth of communication; the short live defense is the AI-resistant anchor; the board derivation is the lightweight-derivation tier, live. |
| **Peer-teaching with comprehension transfer** | 20% | In-class simultaneous rounds (any N): A teaches a concept to B; **B then takes a 3-question comprehension check**; A first submits a **confusion-prediction** (the 3 spots B will struggle). TA audits a sample. | the *listener's* understanding is the metric — the only direct measure of "did you convey it"; live ⇒ AI-resistant. |
| **Problem sets** (proof + derive + verify) | 20% | the 5 three-tier psets of §4.4, but **low-stakes prep**: light credit for completion + correctness, and **spot-anchored** — each checkpoint draws an item from a pset-adjacent derivation. | AI-completing a pset doesn't buy the grade; the real test is the in-person checkpoint. |

This is communication-centered (viva + peer-teaching + the checkpoints' plain-language item ≈ 65% turns on *conveying* the idea), every graded moment is live or live-anchored, and "read & derive on sight" is the 30% checkpoint pillar — balanced with the viva as requested. **Honor-code, no-AI on the in-person checkpoints and the live defense** (enforceable because in-person); AI is **explicitly allowed** in pset and viva preparation.

**Two challenges to the author's framing, folded in.** (1) A *polished talk* is now AI-fakeable (script + slides + rehearsal), so weight is moved onto the **unscripted defense**, not the presentation gloss. (2) "Presentation skill" is really **unscripted explanation under questioning** — handling "why?", re-deriving a skipped step, surviving a changed assumption — which is also the most AI-resistant thing to grade.

**Scaling & fairness knobs (>30 cohort).** Checkpoints run as one batched in-class sitting (any N, like an in-person quiz) — this is what makes the plan scale. For the viva, schedule defenses in TA sections, **time-box ≤8 min**, use a shared rubric, and **record for moderation/appeals**; rotate the paper bank to limit sharing. For peer-teaching, randomize and rotate pairs each round, grade the teacher mainly on **calibration + clarity** and use the learner's score lightly. Keep the checkpoints as a **written backstop** so no grade rests on a single oral.

### 4.3 Source plans (kept for reference; "Explain It Live" is assembled from these)

The canonical plan combines the read-&-derive rigor of **C**, the live-defense integrity of an oral exam, and the proof-bearing psets of **A/B**. If you ever want to swap emphasis (e.g. a small-cohort offering), these are the building blocks:

**Plan A — Proof & Exam** *(model: CS229 + EE364A; most exam-rigorous)*: 5 three-tier psets 30% · take-home midterm 15% · **24-hour take-home final 35%** (integrative + one unseen-paper derivation, no AI) · project 20%.

**Plan B — Mastery & Project** *(model: MIT 18.065 + CS236; no exams)*: 5–6 biweekly proof-bearing psets 45% · lecture mastery gateway `Quiz`es 5% · **staged project 40%** (proposal → milestone → implementation+ablation → report) · teaching contribution 10%. *(Note: in the AI era the take-home staged project is the weakest signal — the author's reason for moving to live-anchored grading.)*

**Plan C — Oral & Portfolio** *(model: qualifying-exam / Cambridge Part-III; small/seminar cohort)*: psets 30% · **derivation portfolio** (~12 results by hand) 25% · **oral exam at the board** 20% · capstone 25%.

### 4.4 Problem-set spine (proof-bearing; low-stakes prep, anchored live)

These five psets feed the live checkpoints — students may use AI to prepare, but a checkpoint item is drawn from each block's derivation, so understanding is verified in person.

- **PS1 (L1–L3, linear algebra & spectral):** *proof* — Eckart–Young; *derive* — PCA ≡ SVD of centered data; *verify* — image SVD with reconstruction-error-vs-rank curve and a numerical check that the top eigenvectors of the covariance equal the right singular vectors. **Starred:** bound the rank-k error by `σ_{k+1}`.
- **PS2 (L3, spectral methods):** *proof* — `xᵀLx = ½Σ A_{ij}(x_i−x_j)² ⇒ L ⪰ 0` and the smallest eigenvector is constant; *derive* — the normalized-cut relaxation; *verify* — Fiedler-vector clustering on two blobs vs k-means.
- **PS3 (L4–L5, regression & optimization):** *proof* — derive the normal equations by setting `∇_w‖Xw−y‖²=0` and show the solution is the orthogonal projection; *derive* — backprop for a 2-layer net; *verify* — solve least squares two ways (normal equations vs GD) and **finite-difference gradient-check** your backprop. **Starred:** show GD on a convex quadratic converges for `η < 2/λ_max`.
- **PS4 (L6–L7, probability → objectives):** *proof* — `E[Y|X]` is L2-optimal; `D_KL ≥ 0` via Jensen; the score-function estimator is unbiased; *derive* — MSE from a Gaussian MLE **and** cross-entropy from a categorical MLE; the ELBO and its `D_KL` gap; *verify* — logistic regression on a 2-D toy; Monte-Carlo error ∝ `1/√N`; reparameterization vs score-function variance.
- **PS5 (L8, dynamics):** *proof* — local truncation error of Euler is `O(h²)` from Taylor; *derive* — the 1-D change-of-variables density factor; *verify* — Euler error-vs-step-size curve and flow a Gaussian blob along a hand-built field to a target. **Starred:** the instantaneous change-of-variables (continuity) identity in 1-D.

**Viva / explainer rubric.** Graded on, in priority order: (1) **clarity of conveyance** — could the stated audience actually follow it? (the primary axis, per the course goal); (2) correctness of the **live derivation**, including the skipped step; (3) **defense** — handling unscripted "why?" and assumption-change questions; (4) honesty about the limits of what they understand. The recorded explainer alone cannot earn top marks without the live defense. No fabricated results (Ground Truth).

## 5. Notation & conventions (used throughout)

Fix one convention and reuse it in every note (define each symbol on first use per `CONTENT_AGENT.md`).

- **Data.** A data point / feature vector `x ∈ ℝⁿ`; a dataset is a matrix `X ∈ ℝ^{m×n}` with **`m` samples in rows, `n` features in columns** (flag this the first time a matrix appears — many texts transpose it).
- **Compare.** Inner product `⟨x, y⟩ = xᵀy`; Euclidean norm `‖x‖₂ = √⟨x,x⟩`; cosine similarity `cos θ = ⟨x,y⟩/(‖x‖‖y‖)`.
- **Maps & spectra.** Matrix `A`; eigenpair `Av = λv`; SVD `A = UΣVᵀ`, singular values `σ₁ ≥ σ₂ ≥ …`; covariance `Σ = (1/m) X_cᵀ X_c` on centered data `X_c`; quadratic form `xᵀAx`; PSD `A ⪰ 0`.
- **Predict.** Linear model `ŷ = wᵀx + b`; least squares `min_w ‖Xw − y‖₂²`; normal equations `XᵀX w = Xᵀy`.
- **Change.** Derivative `f'(x)`; gradient `∇f` (a vector, steepest-uphill); Jacobian `J_f`; Hessian `H_f = ∇²f`; chain rule `J_{g∘f} = J_g · J_f`; gradient descent `x ← x − η∇f`, learning rate `η`.
- **Randomness.** Random variable `X`; density `p(x)`; expectation `E[X]`; variance `Var[X]`; Gaussian `𝒩(μ, Σ)`; conditional expectation `E[Y|X]`; Bayes `p(y|x) = p(x|y)p(y)/p(x)`.
- **Objectives.** Likelihood `ℒ(θ)`; log-likelihood `ℓ(θ)`; sigmoid `σ(z)=1/(1+e^{−z})`; softmax; entropy `H(p)`; cross-entropy `H(p,q)`; KL divergence `D_KL(p‖q)`; ELBO.
- **Dynamics.** Vector field `v(x,t)`; ODE `dx/dt = v(x,t)`; Euler `x_{k+1} = x_k + h·v(x_k,t_k)`; change of variables with Jacobian determinant `|det J|`; (optional) `KL`, `Wasserstein`.
- **Tier markers.** A *Lightweight derivation* beat lives in the main line (see §6). A blockquote opening with **`深一層`** is a Deeper box; main-line reading may skip it.
- **English technical terms in Chinese prose** (per `docs/n2d-voice-and-quiz-style.md`): write "假設這個 vector field 是 smooth 的", gloss the English term in one plain sentence on first use, then reuse it. The style-guide glossary applies unchanged.

## 6. The three tiers: how every note is built

Each note is layered so the same page serves a nervous beginner and a paper-writing senior.

1. **Intuition (main line).** Real-life scene → one-sentence picture → the English term + plain gloss. Picture before symbol.
2. **Lightweight derivation (main line).** A **≤5-line, by-hand manipulation** using *only objects already introduced*, the kind a paper writes as "it is easy to show…". Examples: expand `‖Xw−y‖²`; set `∇=0` to read off the normal equations' *form*; take `log` to turn a product into a sum; plug the Gaussian density into `−log p` to get squared error; one step of Jensen. **Rule of thumb:** if it needs a new theorem, more than ~5 lines, or an ε–δ argument, it is *not* lightweight — it belongs in the box. The point is reproducibility by hand, not rigor.
3. **`深一層` (Deeper) box.** The heavier/full derivation, a proof sketch, the general theorem stated precisely, or a higher-dimensional subtlety. **Self-contained and optional.** Examples: the full Eckart–Young proof, backprop as reverse-mode autodiff, `KL ≥ 0` via Jensen, the n-D change-of-variables determinant, the score-function vs reparameterization variance comparison.

**Contracts.** (a) Never put a load-bearing fact only in a box — boxes deepen, never gate. (b) The lightweight derivation must stand without the box. (c) Frontmatter `summary` describes the intuition only, so the index stays beginner-legible. (d) Every derivation (both tiers) is verified before publish (Ground Truth).

## 7. Lecture sequence (10 lectures, ~44 notes)

Folder: `research-areas/math-intuitions/` · slug prefix `math-` · **category `courses`** · **group = the note's lecture** (e.g. `Lecture 1 · Vectors & Similarity`), so the index shows one collapsible section per lecture (see §10). Each lecture lists its notes as **`slug` — objects · life-hook · demo (feasibility)**. Tags: **(exists)** already written, reframe only · **(深一層)** carries a Deeper box · **(optional)** deferrable. Most notes also carry a *lightweight derivation* (detailed in the appendix).

### Lecture 1 — How can we represent and compare data numerically?
*Objects:* vector, norm, distance, inner product, matrix-as-data/map. *Payoff:* embeddings & similarity search.
1. `math-points-as-vectors` — vector, ℝⁿ, dimension, feature vector / embedding.
2. `math-norms-and-distance` **(深一層)** — norm, L1 vs L2, unit vector; (深一層: matrix/spectral norm & Lipschitz, named).
3. `math-inner-product-and-similarity` — inner product, cosine similarity (the similarity-search payoff).
4. `math-matrix-as-data-and-map` **(深一層)** — matrix as data table vs linear map; `Ax` = batched inner products.

### Lecture 2 — How can we simplify and visualize high-dimensional data?
*Objects:* linear-map geometry, eigen, SVD, PCA, low-rank, (quadratic forms / PSD).
1. `math-linear-map-geometry` — linear map as rotate/stretch; columns = where basis vectors land.
2. `math-eigenvectors-and-eigenvalues` **(深一層)** — eigenvector/eigenvalue; (深一層: spectral theorem + **quadratic forms & positive-definiteness**).
3. `math-svd` **(深一層)** — `A = UΣVᵀ`; rotate→stretch→rotate; singular values = importance.
4. `math-pca` **(深一層)** — PCA = top eigenvectors of covariance = top singular vectors of centered `X`; (深一層: Rayleigh quotient via a Lagrange multiplier).
5. `math-low-rank-approximation` — truncated SVD; Eckart–Young (stated).

### Lecture 3 — How can spectral methods solve practical problems?
*Objects:* image compression, similarity graph, graph Laplacian, spectral clustering.
1. `math-image-compression-svd` **(深一層)** — image as matrix; truncated-SVD compression; energy in `σ`'s; (深一層: Eckart–Young proof).
2. `math-similarity-graphs-and-laplacian` — similarity graph, adjacency, `L = D − A`.
3. `math-spectral-clustering` **(深一層)** — Fiedler vector; embed-then-cluster; (深一層: min-cut relaxation).
4. `math-spectral-recap` **(optional)** — compression, PCA, clustering are one eigen/SVD idea.

### Lecture 4 — How can we predict outcomes from features?
*Objects:* linear predictor, squared-error loss, normal equations, optimal predictor.
1. `math-linear-model-and-prediction` — `ŷ = wᵀx + b`; weights, bias, hyperplane.
2. `math-least-squares-objective` — squared-error loss; the `min_w ‖Xw−y‖²` problem.
3. `math-normal-equations` **(深一層)** — normal equations; projection onto the column space; pseudoinverse.
4. `math-optimal-linear-predictor` **(深一層)** — best predictor in squared error = `E[Y|X]`; the seed of denoising / CFM.

### Lecture 5 — How do small changes in inputs affect outputs (and how do we improve)?
*Objects:* derivative, gradient, **matrix calculus**, Jacobian + chain rule, gradient descent.
1. `math-derivative-as-sensitivity` — derivative = sensitivity/slope.
2. `math-gradient-steepest-ascent` — gradient = steepest-uphill; level sets ⟂ gradient; (the flow course's `score = ∇log p`).
3. `math-matrix-calculus` **(深一層)** — gradients of `wᵀx`, `‖Xw−y‖²`, `xᵀAx`; layout conventions; the paper-derivation toolkit.
4. `math-jacobian-and-chain-rule` **(深一層)** — chain rule = multiplying Jacobians; (深一層: backprop = reverse-mode autodiff).
5. `math-gradient-descent` **(深一層)** — `x ← x − η∇f`; learning rate; (深一層: convexity, **Taylor + Hessian + Newton**, one-line convergence).

### Lecture 6 — How do we describe randomness and say a model is better?
*Objects:* random variable, density, expectation, variance, Gaussian, joint/marginal/conditional, **Bayes**, estimation. *Absorbs the three existing notes.*
1. `math-randomness-and-distribution` **(exists)** — random variable, distribution, sample.
2. `math-density-vs-probability` **(exists)** — density vs probability; `∫p=1`.
3. `math-expectation-and-averages` **(exists)** — expectation, mean, Monte-Carlo estimate.
4. `math-variance-and-spread` — variance, standard deviation.
5. `math-gaussian` **(深一層)** — Gaussian, mean & covariance, isotropic; (深一層: covariance ellipse = eigen-axes; whitening).
6. `math-joint-marginal-conditional` **(深一層)** — joint/marginal/conditional, `E[Y|X]`.
7. `math-bayes-rule` **(深一層)** — prior/likelihood/posterior; (深一層: Bayes behind the diffusion reverse process & classifier guidance).
8. `math-estimation-and-uncertainty` **(深一層)** — estimator, standard error, confidence interval; "is the difference real?".
9. `math-high-dimensional-geometry` **(optional, 深一層)** — concentration; the Gaussian shell.

### Lecture 7 — How do we turn a probability model into a loss we can train?
*Objects:* maximum likelihood, loss-as-NLL, classification (logistic/softmax), entropy/cross-entropy/KL, Jensen & ELBO, stochastic gradients. *The probability→objective bridge; the spine of modern training and the diffusion/flow course.*
1. `math-maximum-likelihood` **(深一層)** — likelihood, log-likelihood, MLE; "pick θ that makes the data least surprising".
2. `math-mse-as-gaussian-mle` **(深一層)** — Gaussian noise ⇒ squared error *is* the negative log-likelihood (ties L4 to probability).
3. `math-classification-logistic-softmax` **(深一層)** — sigmoid/softmax turn scores into probabilities; logistic regression; decision boundary.
4. `math-cross-entropy-and-kl` **(深一層)** — entropy, cross-entropy, KL; cross-entropy loss = categorical NLL; `D_KL ≥ 0`.
5. `math-jensen-and-elbo` **(深一層)** — Jensen's inequality → the evidence lower bound; the VAE/diffusion bridge.
6. `math-stochastic-gradients` **(深一層)** — Monte-Carlo gradients; the score-function (log-derivative) trick vs the reparameterization trick.

### Lecture 8 — How can we model dynamics and generate data?
*Objects:* vector field & flow, ODE & Euler, change of variables, flow-to-generative bridge.
1. `math-vector-fields-and-flow` — vector field, flow, integral curve.
2. `math-odes-and-euler` **(深一層)** — ODE, Euler step, truncation error.
3. `math-change-of-variables` **(深一層)** — change of variables, Jacobian determinant, push-forward; (深一層: det/trace/**log-det**).
4. `math-flow-to-generative-model` — transport `𝒩(0,I)` to data along a learned field; intuition-only bridge.
5. `math-random-walk-and-brownian` **(optional, 深一層)** — random walk → Brownian motion, `dW`.

### Lecture 9 — How do these ideas inform modern deep learning frameworks?
*Theme:* synthesis, notation literacy, the read-and-derive capstone.
1. `math-objects-recap-map` — the whole toolbox on one page.
2. `math-where-the-math-shows-up` — attention = inner product, normalization = whitening, backprop, softmax/cross-entropy, diffusion/flow, GNN spectral; (課外讀物 pointers: Fourier, MCMC/Langevin, kernels, natural gradient).
3. `math-reading-a-paper` — **capstone**: decode one real equation, **reproduce its derivation**, translate to plain language *and* code, both directions.
4. `math-open-questions` **(optional)** — hedged pointers to where the math is still open (no invented claims).

### Lecture 10 — Review, final discussion, and project presentations
1. `math-course-recap` — self-test + notation checklist (symbols you can now read and derive on sight).
2. **Viva defenses & explainer showcase** (no note) — students defend their assigned-paper explainer live (§4.2); the strongest explainers become site notes/demos.

## 8. Demo feasibility policy (important)

Browser demos stay **analytic toys, 2-D analogs, or precomputed/cached frames** — no live model in the iframe. Reuse the `_demo-common.js` pattern (theme-aware, reduced-motion, responsive) and the path convention `notes/research_areas/math-intuitions/<demo>.html` embedded via an absolute `/personal_website/...` iframe (see the existing `histogram-density.html`). The image-compression demo (L3) ships **cached frames**, not a live decoder; mark it feasibility-limited. New L7 demos are all feasible 2-D toys (a likelihood-vs-θ slider, a logistic decision boundary, a KL-between-two-blobs dial, a reparameterization-trick animation).

## 9. Authoring conventions

Each lecture = 3–6 short MDX notes under `research-areas/math-intuitions/`, group `"Math Intuitions"`. Follow `docs/n2d-voice-and-quiz-style.md`: scene opening, varied natural section headings (no fixed template), intuition → **lightweight derivation** → minimal math (KaTeX), the **"translate both ways"** beat, `Quiz` components (every wrong option has an `explain`; vary the correct index across the series; plain-text options), `深一層` boxes per §6, standalone demos via absolute iframes, **inline cross-note links absolute** `(/personal_website/zh/notes/<slug>)`, **bilingual frontmatter** (zh-first; en ships as a `missing`-status stub, a tracked TODO). One new object per note; problem-driven; picture-before-symbol; English technical terms in Chinese prose. **Never invent results; cite primary sources; verify every derivation; the build must stay green** (`astro build` + Pagefind index check).

**Per-note skeleton (titles must vary):** 場景 → 一句話直覺 → English term + 白話 → **lightweight derivation (≤5 lines)** → translate-both-ways → `Quiz` → `深一層` box (if any) → forward-link.

**Frontmatter template (per note):**
```yaml
---
slug: "math-<...>"
lang: "zh"
title: "<English term>：<一句白話>"
category: "courses"
group: "Lecture N · <lecture title>"
status: "available"          # en stub ships as status: "missing"
updated: 2026-06-28
summary: "<intuition in one sentence; no derivation / 深一層 content>"
demos:
  - "notes/research_areas/math-intuitions/<demo>.html"   # if any
references: []                # real sources only; see §11
---
```

## 10. Metadata handoff to the maintenance agent (AGENT.md)

- **Slug registration.** Add every `math-` slug to `noteSlugList` in `site/src/lib/notes.ts`, in lecture order; within a lecture, slug order sets the card order.
- **Category & grouping (decided & implemented).** The course has its own top-level **`category: "courses"`** (label "Courses" / "課程", added to `categoryOrder` + `categoryLabels` in `notes.ts`; enum added in `content.config.ts`). Each note's **`group` is its lecture** (e.g. `"Lecture 1 · Vectors & Similarity"`), and every lecture label is listed in `groupOrder` in `notes.ts` so the index renders one collapsible "Lecture N · …" section per lecture, in numeric order. Files stay in the `research-areas/math-intuitions/` folder (folder ≠ category).
- **Bilingual parity.** Every note zh + en; en starts `missing`. No auto-translation.

## 11. Reading list (real, verified — the planning set, not a substitute for per-note checking)

- **Gilbert Strang, *Linear Algebra and Learning from Data*, Wellesley-Cambridge, 2019** — companion to **MIT 18.065**. Model for L1–L5. <https://math.mit.edu/~gs/learningfromdata/>
- **MIT 18.06 *Linear Algebra* (Strang)**, OCW — L1–L3. <https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/>
- **Deisenroth, Faisal & Ong, *Mathematics for Machine Learning*, Cambridge, 2020** — free PDF; linear algebra, vector calculus, optimization, probability, and (Part II) linear regression, PCA, density estimation, SVM. Spans L1–L7. <https://mml-book.com/>
- **Stanford CS229 section notes** — *Linear Algebra Review* (Kolter/Do) and *Probability Review* (Maleki/Do); CS229 main notes cover MLE, logistic regression, softmax, exponential-family losses. Model for L1, L5, L6, L7. <https://cs229.stanford.edu/>
- **Christopher Bishop, *Pattern Recognition and Machine Learning*, Springer, 2006** — canonical for MLE, logistic/softmax, cross-entropy, Bayes, and the ELBO (Ch. 1, 4, 9–10). Primary reference for **L6–L7**.
- **Boyd & Vandenberghe, *Convex Optimization*, Cambridge, 2004** (Stanford EE364A) — `深一層` source for L5 (convexity, gradients, Lagrange duality); free PDF. <https://stanford.edu/~boyd/cvxbook/>
- **Goodfellow, Bengio & Courville, *Deep Learning*, MIT Press, 2016 — Part I** (Applied Math, incl. the Information Theory section) — L5–L7, L9 framing. <https://www.deeplearningbook.org/>
- **3Blue1Brown, *Essence of Linear Algebra* / *Essence of Calculus*** — visual intuition for L1, L2, L5. <https://www.3blue1brown.com/>
- **L7 ELBO / reparameterization & L8 flows:** bridge to the site's **From Noise to Data / Diffusion & Flow** course and its reading list (Kingma & Welling 2014 for the VAE/reparameterization; Lipman et al. 2023 for flow matching) rather than re-citing here.

> Ground-Truth policy: verify each citation's exact title / venue / year before a note ships. Confirmed during planning: Strang 18.065 / *Linear Algebra and Learning from Data*; *Mathematics for Machine Learning*. Bishop PRML and the VAE paper are well-established but should be re-confirmed at write time.

## 12. Mapping back to your original 9-lecture outline

| Your lecture | Becomes | Net change |
|---|---|---|
| L1 represent & compare | **Lecture 1** (4 notes) | + cosine-similarity / embedding payoff; + lightweight derivations |
| L2 simplify & visualize | **Lecture 2** (5 notes) | splits eigen → SVD → PCA → low-rank; + quadratic-forms/PSD box |
| L3 spectral methods | **Lecture 3** (3–4 notes) | + graph Laplacian + spectral clustering |
| L4 predict outcomes | **Lecture 4** (4 notes) | + optimal-predictor / `E[Y|X]` bridge |
| L5 gradients & GD | **Lecture 5** (5 notes) | + **matrix-calculus** note; + Taylor/Hessian/Newton box |
| L6 statistics / "is it better?" | **Lecture 6** (8 + 1 notes) | absorbs the 3 existing notes; + variance, Gaussian, joint/cond, **Bayes**, estimation |
| *(added)* | **Lecture 7** (6 notes) | MLE, classification, entropy/cross-entropy/KL, ELBO, stochastic gradients |
| L7 dynamics & flows | **Lecture 8** (4 + 1 notes) | + change-of-variables + generative bridge |
| L8 inform modern DL | **Lecture 9** (3–4 notes) | becomes the read-**and-derive**-a-paper capstone |
| L9 review & projects | **Lecture 10** (1 note + presentations) | + self-test / notation checklist |

---

## Appendix — note-level outline stubs (all 10 lectures)

Each stub gives the **scope line**, the **hidden skeleton** (beat order; section *titles* must vary), the **key formula(s)**, the **lightweight derivation** (main-line, ≤5 lines), one **quiz idea** (with the trap), the **`深一層`** box if any, the **demo**, and the **forward-link**. Skeletons, not drafts.

> Legend: **(exists)** reframe only · **(深一層)** has a Deeper box · **(optional)** deferrable · *Lightweight derivation* = the by-hand step the main line now includes.

### Lecture 1 stubs

**`math-points-as-vectors`**
- *Scope:* see a data point as a point in ℝⁿ; the picture + the word, not a linear-algebra course.
- *Skeleton:* 開場(一張灰階圖 = 一格一個數字) → 直覺(資料 = 高維空間一個點) → **vector / ℝⁿ / dimension** + 白話 → translate(「這張圖」↔ `x∈ℝ^{784}`) → quiz → forward.
- *Key:* `x=(x₁,…,xₙ)∈ℝⁿ`.
- *Lightweight derivation:* none needed (definitional); instead, *count* the dimension of a 28×28 image (=784) and of an RGB image (=3·H·W) by hand.
- *Quiz idea:* "把 28×28 攤平成 784 維丟掉什麼?" trap: thinking pixels are lost (the *spatial-adjacency prior* is, not the data).
- *Demo:* 2-D feature scatter. *Forward:* → `math-norms-and-distance`.

**`math-norms-and-distance` (深一層)**
- *Scope:* "多遠" + "只留方向"; define norm/distance; no inner product yet.
- *Skeleton:* 開場(兩個 embedding 多像?) → 直覺(距離) → **norm / L1 / L2 / unit vector** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `‖x‖₂=√Σxᵢ²`, `d(x,y)=‖x−y‖`, unit `x/‖x‖`.
- *Lightweight derivation:* show `‖x/‖x‖‖=1` in two lines (pull the scalar out of the norm) — "normalization really gives length 1."
- *Quiz idea:* L1 vs L2 "哪個對離群值更敏感?" trap: assuming they rank distances identically.
- *深一層:* matrix/spectral norm & Lipschitz constant, named (used later for sampler stability / spectral norm).
- *Demo:* drag two points, L1 vs L2. *Forward:* → `math-inner-product-and-similarity`.

**`math-inner-product-and-similarity`**
- *Scope:* the "對齊程度" object and why search/recommenders use it.
- *Skeleton:* 開場(推薦系統怎麼說兩首歌像) → 直覺(對齊) → **inner product / cosine similarity** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `⟨x,y⟩=xᵀy=‖x‖‖y‖cosθ`.
- *Lightweight derivation:* from `xᵀy=‖x‖‖y‖cosθ`, solve for `cosθ` to get the cosine-similarity formula; check `x=y ⇒ cosθ=1`.
- *Quiz idea:* "cosine=1 代表兩向量相等?" trap: same-direction ≠ same-vector.
- *Demo:* rotate a vector, live cosine dial. *Forward:* → `math-matrix-as-data-and-map`.

**`math-matrix-as-data-and-map` (深一層)**
- *Scope:* two readings of a matrix; bridge into L2.
- *Skeleton:* 開場(同一方陣「是資料」又「是動作」?) → 直覺(兩種讀法) → **matrix / matrix–vector product** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `X∈ℝ^{m×n}`; `(Ax)_i=⟨row_i,x⟩`.
- *Lightweight derivation:* write `Ax` out as a stack of inner products `(Ax)_i=Σ_j A_{ij}x_j`; read off "one query against every row at once."
- *Quiz idea:* "`Ax` 第 i 分量是什麼?" trap: row-vs-column confusion.
- *深一層:* row space vs column space — the two readings reconciled.
- *Demo:* `Xq` lighting up nearest rows. *Forward:* → `math-linear-map-geometry`.

### Lecture 2 stubs

**`math-linear-map-geometry`**
- *Scope:* the rotate/stretch picture; no eigen yet.
- *Skeleton:* 開場(把方格紙拉一下) → 直覺(直線還是直線、原點不動) → **linear map** + 白話 → lightweight derivation → quiz → forward.
- *Key:* columns of `A` = images of basis vectors; `A(αx+βy)=αAx+βAy`.
- *Lightweight derivation:* compute `Aê₁, Aê₂` and show they are exactly the columns of `A` (two lines).
- *Quiz idea:* "平移算 linear map 嗎?" trap: feels yes; no (origin must stay fixed → affine).
- *Demo:* 2×2 grid-transform. *Forward:* → `math-eigenvectors-and-eigenvalues`.

**`math-eigenvectors-and-eigenvalues` (深一層)**
- *Scope:* "只縮放不轉向" directions; recognition.
- *Skeleton:* 開場(拉伸時哪些方向沒被轉走?) → 直覺 → **eigenvector / eigenvalue** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `Av=λv`.
- *Lightweight derivation:* verify a given `v` is an eigenvector by computing `Av` and reading off `λ` (one line); note `Av=λv ⇔ (A−λI)v=0`.
- *Quiz idea:* "每個矩陣都有實 eigenvector?" trap: rotation has none (real).
- *深一層:* spectral theorem (symmetric ⇒ real λ, orthogonal eigenvectors) **and quadratic forms & positive-(semi)definiteness** (`xᵀAx≥0`; why covariance/Gram/Hessian are PSD).
- *Demo:* highlight non-rotating directions. *Forward:* → `math-svd`.

**`math-svd` (深一層)**
- *Scope:* every matrix = rotate→stretch→rotate.
- *Skeleton:* 開場(eigen 只對方陣，長方形資料?) → 直覺(三段式) → **SVD / singular value** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `A=UΣVᵀ`, `σ₁≥σ₂≥…≥0`.
- *Lightweight derivation:* from `A=UΣVᵀ` compute `AᵀA=VΣ²Vᵀ` (two lines) ⇒ `V` are eigenvectors of `AᵀA`, `σᵢ=√λᵢ`.
- *Quiz idea:* "σ 大代表什麼?" trap: σ as count/frequency vs energy along a direction.
- *深一層:* existence for any real matrix; full eigendecomposition-of-`AᵀA` route.
- *Demo:* unit circle → ellipse in three stages. *Forward:* → `math-pca`.

**`math-pca` (深一層)**
- *Scope:* directions of max variance; one object tied to SVD.
- *Skeleton:* 開場(100 維畫到紙上) → 直覺(最展開的方向) → **PCA / principal component / covariance** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* top eigenvectors of `Σ=(1/m)X_cᵀX_c`.
- *Lightweight derivation:* write the projected variance `Var(X_c w)=wᵀΣw` (two lines) — so "max variance" = "maximize `wᵀΣw` over unit `w`."
- *Quiz idea:* "PCA 前為何置中?" trap: thinking it's optional (else PC1 chases the mean).
- *深一層:* maximize `wᵀΣw` s.t. `‖w‖=1` via a **Lagrange multiplier** → `Σw=λw` (Rayleigh quotient); PCA ≡ SVD of centered data.
- *Demo:* 2-D→1-D projection, variance retained. *Forward:* → `math-low-rank-approximation`.

**`math-low-rank-approximation`**
- *Scope:* "keep top-k directions, rebuild"; sets up compression.
- *Skeleton:* 開場(只留前 k 個 σ) → 直覺(少數方向重建) → **truncated SVD / rank-k** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `A_k=Σ_{i≤k}σᵢuᵢvᵢᵀ`.
- *Lightweight derivation:* expand `A=Σσᵢuᵢvᵢᵀ` and drop terms `i>k`; the dropped energy is `Σ_{i>k}σᵢ²`.
- *Quiz idea:* "丟最小 σ 為何幾乎無影響?" trap: assuming all directions matter equally.
- *Demo:* k-slider on a small matrix. *Forward:* → `math-image-compression-svd`.

### Lecture 3 stubs

**`math-image-compression-svd` (深一層)**
- *Scope:* spectral idea on images; why-optimal in the box.
- *Skeleton:* 開場(照片就是矩陣) → 直覺(丟小 σ 肉眼無差) → **energy in singular values** → lightweight derivation → quiz → 深一層 → forward.
- *Key:* error `‖A−A_k‖_F²=Σ_{i>k}σᵢ²`; storage `k(m+n+1)` vs `mn`.
- *Lightweight derivation:* compute the storage ratio and the retained-energy fraction `Σ_{i≤k}σᵢ²/Σσᵢ²` for a toy by hand.
- *Quiz idea:* "rank-20 幾乎一樣 ⇒ 照片只有 20 維資訊?" trap: rank as intrinsic dimension.
- *深一層:* **Eckart–Young** — truncated SVD is the optimal rank-k approximation (statement + intuition).
- *Demo:* precomputed rank-slider + error curve (feasibility-limited). *Forward:* → `math-similarity-graphs-and-laplacian`.

**`math-similarity-graphs-and-laplacian`**
- *Scope:* turn "who is similar" into a matrix; the Laplacian object.
- *Skeleton:* 開場(相似度畫成連連看) → 直覺 → **graph / adjacency / degree / Laplacian** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `L=D−A`.
- *Lightweight derivation:* show `Lx`'s i-th entry is `Σ_j A_{ij}(x_i−x_j)` (two lines) — the Laplacian measures disagreement with neighbors.
- *Quiz idea:* "`L·𝟙`=?" trap: not seeing `L𝟙=0` (trivial eigenvector).
- *Demo:* toggle edges; watch `A,D,L`. *Forward:* → `math-spectral-clustering`.

**`math-spectral-clustering` (深一層)**
- *Scope:* eigenvectors of `L` split data; recognition.
- *Skeleton:* 開場(讓資料自己分群) → 直覺(振動模態) → **Fiedler vector / spectral embedding** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* second-smallest eigenvector of `L`.
- *Lightweight derivation:* show `xᵀLx=½Σ_{ij}A_{ij}(x_i−x_j)²≥0` (so `L⪰0`, smallest eigenvalue 0) — three lines.
- *Quiz idea:* "為何用第二小 eigenvector?" trap: forgetting the smallest is the constant `𝟙`.
- *深一層:* min-cut relaxation.
- *Demo:* two blobs → embedding → split. *Forward:* → `math-spectral-recap`.

**`math-spectral-recap` (optional)**
- *Scope:* synthesis; no new object.
- *Skeleton:* 開場(這三件事長一樣) → 三個用途並排 → 一句收束 → quiz → forward.
- *Quiz idea:* "PCA 與 spectral clustering 的共同點?" trap: seeing them as unrelated tricks.
- *Forward:* → `math-linear-model-and-prediction`.

### Lecture 4 stubs

**`math-linear-model-and-prediction`**
- *Scope:* the predictor object; reuse L1 inner product.
- *Skeleton:* 開場(用面積猜房價) → 直覺(一條線/超平面) → **linear model / weights / bias** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `ŷ=wᵀx+b`.
- *Lightweight derivation:* absorb `b` by appending a 1 to `x` (`x̃=[x;1]`) so `ŷ=w̃ᵀx̃` — the bias trick, two lines.
- *Quiz idea:* "`w` 某分量為負代表?" trap: reading magnitude, ignoring sign.
- *Demo:* drag a line. *Forward:* → `math-least-squares-objective`.

**`math-least-squares-objective`**
- *Scope:* turn "fits well" into a number; motivate squared error.
- *Skeleton:* 開場(怎說一條線比較好?) → 直覺(誤差加起來) → **residual / squared-error loss** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `L(w)=‖Xw−y‖²`.
- *Lightweight derivation:* expand `‖Xw−y‖²=wᵀXᵀXw−2wᵀXᵀy+yᵀy` (the expansion every regression paper uses).
- *Quiz idea:* "為何平方不取絕對值?" trap: thinking it's arbitrary (smooth, single minimum; L1 is a real alternative).
- *Demo:* move the line; summed squared residual. *Forward:* → `math-normal-equations`.

**`math-normal-equations` (深一層)**
- *Scope:* closed-form solve + projection picture.
- *Skeleton:* 開場(一步算出最佳線?) → 直覺(投影到 column space) → **normal equations / projection / pseudoinverse** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `XᵀXw=Xᵀy`, `ŵ=X⁺y`.
- *Lightweight derivation:* take `∇_w` of the expanded loss → `2XᵀXw−2Xᵀy`, set `=0` → the normal equations (this *is* the lightweight derivation; uses L5 `math-matrix-calculus`).
- *Quiz idea:* "最佳擬合時 residual 與資料行的關係?" trap: not seeing orthogonality is optimality.
- *深一層:* SVD solution `X⁺=VΣ⁺Uᵀ`; conditioning; why not invert `XᵀX` numerically.
- *Demo:* residual → ⟂ to column space. *Forward:* → `math-optimal-linear-predictor`.

**`math-optimal-linear-predictor` (深一層)**
- *Scope:* population view + the `E[Y|X]` seed.
- *Skeleton:* 開場(看到「全部」資料，最佳猜測?) → 直覺(每個 x 取對應 y 的平均) → **best predictor / `E[Y|X]`** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `argmin_g E[(Y−g(X))²]=E[Y|X]`.
- *Lightweight derivation:* for fixed `x`, minimize `E[(Y−c)²|X=x]` over the constant `c` → `c=E[Y|X=x]` (set derivative to 0; two lines).
- *Quiz idea:* "squared error 下最佳預測函數?" trap: answering "a line" (best overall is the conditional mean).
- *深一層:* full functional proof (add-subtract `E[Y|X]`, cross-term vanishes).
- *Forward:* → `math-joint-marginal-conditional`; the seed of denoising / CFM — link the Diffusion & Flow course.

### Lecture 5 stubs

**`math-derivative-as-sensitivity`**
- *Scope:* derivative = sensitivity/slope in 1-D.
- *Skeleton:* 開場(輸入動一點,輸出動多少?) → 直覺(放大成直線) → **derivative / slope** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `f'(x)≈Δf/Δx`.
- *Lightweight derivation:* first-order approx `f(x+Δ)≈f(x)+f'(x)Δ` from the slope picture (one line) — the seed of every "to first order…".
- *Quiz idea:* "`f'(x)=0` 一定是最小值?" trap: stationary ≠ minimum.
- *Demo:* zoom a curve to a line. *Forward:* → `math-gradient-steepest-ascent`.

**`math-gradient-steepest-ascent`**
- *Scope:* gradient = steepest-uphill vector; the multivariable jump.
- *Skeleton:* 開場(山坡往哪最陡?) → 直覺 → **gradient ∇f / level set** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `∇f=(∂f/∂x₁,…)`.
- *Lightweight derivation:* directional derivative `D_uf=⟨∇f,u⟩=‖∇f‖cosθ` is maximized at `u∝∇f` (two lines) — *why* the gradient is steepest-ascent.
- *Quiz idea:* "gradient 指向變大還變小?" trap: sign confusion (ascent; GD subtracts).
- *Demo:* contour map; gradient arrow. *Forward:* → `math-matrix-calculus`; note `score=∇log p` in the flow course.

**`math-matrix-calculus` (深一層)**
- *Scope:* the paper-derivation toolkit — gradients of the vector/matrix expressions you meet constantly.
- *Skeleton:* 開場(論文裡 `∂/∂W ‖Wx−y‖²` 怎麼來?) → 直覺(一條一條偏微分,排成同形狀) → **gradient identities / layout** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `∇_x(aᵀx)=a`; `∇_x(xᵀAx)=(A+Aᵀ)x`; `∇_w‖Xw−y‖²=2Xᵀ(Xw−y)`.
- *Lightweight derivation:* derive `∇_x(xᵀAx)=(A+Aᵀ)x` from the scalar sum `Σ_{ij}x_iA_{ij}x_j` (three lines); specialize symmetric `A` → `2Ax`.
- *Quiz idea:* "`∇_w‖Xw−y‖²` 的形狀?" trap: dropping the `Xᵀ` / transpose-layout slip.
- *深一層:* numerator vs denominator layout; the Jacobian/gradient bookkeeping that trips people in papers.
- *Demo:* none (worked-example note) — or a small "check the gradient numerically" snippet. *Forward:* → `math-jacobian-and-chain-rule`; feeds `math-normal-equations`.

**`math-jacobian-and-chain-rule` (深一層)**
- *Scope:* vector→vector derivative + chain rule = multiplying Jacobians.
- *Skeleton:* 開場(一層輸出是下一層輸入,影響怎麼傳?) → 直覺(一層層相乘) → **Jacobian / chain rule** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `J_{g∘f}=J_g·J_f`.
- *Lightweight derivation:* a 2-layer scalar example `y=g(f(x))`, `dy/dx=g'(f(x))·f'(x)` extended to vectors as a Jacobian product (three lines).
- *Quiz idea:* "兩層網路對輸入的敏感度?" trap: adding instead of multiplying per-layer sensitivities.
- *深一層:* **backprop = reverse-mode autodiff** — multiply right-to-left to carry vectors not matrices; worked 2-layer example.
- *Demo:* perturb input, watch output move by the product. *Forward:* → `math-gradient-descent`.

**`math-gradient-descent` (深一層)**
- *Scope:* the GD update + learning-rate behavior.
- *Skeleton:* 開場(知道坡度怎到谷底?) → 直覺(順坡一步步) → **gradient descent / learning rate** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `x←x−η∇f`.
- *Lightweight derivation:* plug the GD step into the first-order approx → `f(x−η∇f)≈f(x)−η‖∇f‖²` (decreases for small `η>0`) — three lines, "why downhill."
- *Quiz idea:* "learning rate 設超大會?" trap: bigger = faster (it overshoots/diverges).
- *深一層:* convex vs non-convex; **Taylor to 2nd order + the Hessian + Newton's method**; one-line convergence on a convex bowl; momentum/Adam named.
- *Demo:* GD path on a bowl, `η` slider, divergence. *Forward:* → drives L4; → L6.

### Lecture 6 stubs

**`math-randomness-and-distribution` (exists)**
- *Reframe only:* keep as written; mark as L6's first object; forward-link → `math-variance-and-spread`. Object: random variable / distribution / sample.

**`math-density-vs-probability` (exists)**
- *Reframe only:* keep as written (histogram→density, area-not-height, `∫p=1`, existing demo + quiz). Repoint forward-link within L6.

**`math-expectation-and-averages` (exists)**
- *Reframe only:* keep as written. Object: expectation / mean / Monte-Carlo. Forward → `math-variance-and-spread`. (Its Monte-Carlo idea is reused hard in L7 `math-stochastic-gradients`.)

**`math-variance-and-spread`**
- *Scope:* spread as first-class; mean alone is not enough.
- *Skeleton:* 開場(平均一樣但忽高忽低) → 直覺(胖瘦鐘形) → **variance / standard deviation** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `Var[X]=E[(X−μ)²]`.
- *Lightweight derivation:* expand to the computational form `Var[X]=E[X²]−(E[X])²` (two lines).
- *Quiz idea:* "平均都 80 能說一樣好?" trap: ignoring spread.
- *Demo:* two bells, same mean, draggable spread. *Forward:* → `math-gaussian`.

**`math-gaussian` (深一層)**
- *Scope:* the workhorse distribution; covariance shape.
- *Skeleton:* 開場(為何到處鐘形?) → 直覺(對稱雲) → **Gaussian / mean / covariance / isotropic** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `𝒩(μ,Σ)`, density `∝exp(−½(x−μ)ᵀΣ⁻¹(x−μ))`.
- *Lightweight derivation:* read the 1-D exponent `−(x−μ)²/2σ²` and identify peak at `μ`, width set by `σ` (two lines) — connect the formula to the picture.
- *Quiz idea:* "covariance 非對角 0 代表?" trap: zero covariance ⇒ independence in general (true for Gaussian only).
- *深一層:* covariance ellipse = eigen-axes of `Σ` (ties to L2); whitening `Σ^{-1/2}`.
- *Demo:* 2-D Gaussian cloud, mean/cov sliders. *Forward:* → `math-joint-marginal-conditional`; `𝒩(0,I)` is the L7/L8 base.

**`math-joint-marginal-conditional` (深一層)**
- *Scope:* the trio + `E[Y|X]`; probability home of L4's predictor.
- *Skeleton:* 開場(身高體重散點,固定身高那條) → 直覺(切片/壓扁) → **joint / marginal / conditional / conditional expectation** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `p(y|x)=p(x,y)/p(x)`, `p(x)=∫p(x,y)dy`.
- *Lightweight derivation:* obtain the conditional from joint/marginal and check it integrates to 1 (two lines).
- *Quiz idea:* "marginal 怎麼處理另一個變數?" trap: marginal (integrate out) vs conditional (fix).
- *深一層:* restate "best L2 predictor = `E[Y|X]`" (links L4); denoising as conditional-mean regression.
- *Forward:* → `math-bayes-rule`.

**`math-bayes-rule` (深一層)**
- *Scope:* update beliefs from evidence; prior/likelihood/posterior.
- *Skeleton:* 開場(快篩陽性,真的中了嗎?) → 直覺(把先驗和證據相乘再正規化) → **Bayes / prior / likelihood / posterior** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `p(y|x)=p(x|y)p(y)/p(x)`.
- *Lightweight derivation:* derive Bayes in one line from `p(x,y)=p(x|y)p(y)=p(y|x)p(x)`; do the medical-test number by hand.
- *Quiz idea:* "快篩很準但陽性卻常是假的?" trap: base-rate neglect (ignoring the prior `p(y)`).
- *深一層:* Bayes behind the diffusion reverse process and classifier guidance (forward-link, no heavy math).
- *Demo:* prior/likelihood sliders → posterior bar. *Forward:* → `math-estimation-and-uncertainty`; reused in L7.

**`math-estimation-and-uncertainty` (深一層)**
- *Scope:* "is the difference real?"; estimators, error bars; no hypothesis-test machinery.
- *Skeleton:* 開場(A 比 B 高 0.3 分,真進步?) → 直覺(再抽一批會翻盤嗎) → **estimator / standard error / confidence interval** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* SE `≈σ/√N`; CI `≈ mean±2·SE`.
- *Lightweight derivation:* from `Var[mean]=σ²/N` get `SE=σ/√N` (two lines) — why error shrinks like `1/√N`.
- *Quiz idea:* "error bar 重疊代表?" trap: declaring a winner inside the noise.
- *深一層:* the bootstrap; what a p-value does and doesn't say.
- *Demo:* bootstrap a CI; overlap → "can't tell yet." *Forward:* → L7 `math-maximum-likelihood`.

**`math-high-dimensional-geometry` (optional, 深一層)**
- *Scope:* why high-dim breaks intuition; skippable.
- *Skeleton:* 開場(高維高斯,樣本在哪?) → 直覺(薄殼) → **concentration / Gaussian shell** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `x∼𝒩(0,I_n) ⇒ ‖x‖≈√n`.
- *Lightweight derivation:* `E[‖x‖²]=ΣE[xᵢ²]=n` (two lines) ⇒ typical length `√n`, not 0.
- *Quiz idea:* "高維高斯樣本最常落在原點附近?" trap: low-dim intuition (it's the shell).
- *Demo:* histogram of `‖x‖` vs `n`. *Forward:* → L7 / why DL lives in high dimensions.

### Lecture 7 stubs
**`math-maximum-likelihood` (深一層)**
- *Scope:* the idea behind almost every DL loss; one object (MLE).
- *Skeleton:* 開場(資料已經發生,哪組參數最不意外?) → 直覺(讓觀測機率最大) → **likelihood / log-likelihood / MLE** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `θ̂=argmax_θ Πᵢp(xᵢ|θ)=argmin_θ −Σᵢlog p(xᵢ|θ)`.
- *Lightweight derivation:* `log` turns the product into a sum and the max into a min of the **negative log-likelihood** (three lines) — "loss = −log-likelihood."
- *Quiz idea:* "為何最大化 log-likelihood 而非 likelihood?" trap: thinking `log` changes the argmax (it doesn't — monotone).
- *深一層:* MLE for a Gaussian mean = sample mean (set derivative to 0); a word on consistency.
- *Demo:* likelihood-vs-θ slider on 1-D data; the peak. *Forward:* → `math-mse-as-gaussian-mle`.

**`math-mse-as-gaussian-mle` (深一層)**
- *Scope:* *why* squared error — it's a Gaussian MLE; ties L4 to probability.
- *Skeleton:* 開場(L4 用了平方誤差,憑什麼?) → 直覺(假設雜訊是 Gaussian) → **noise model / NLL** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `y=ŷ+ε`, `ε∼𝒩(0,σ²) ⇒ −log p(y|x)=‖y−ŷ‖²/2σ²+const`.
- *Lightweight derivation:* plug the Gaussian density into `−log p`, drop constants → squared error (three lines).
- *Quiz idea:* "平方誤差隱含什麼假設?" trap: not seeing it assumes Gaussian (constant-variance) noise.
- *深一層:* heteroscedastic / weighted least squares = non-constant `σ(x)`; Laplace noise → L1 loss.
- *Demo:* none (derivation note) or noise-σ slider. *Forward:* → `math-classification-logistic-softmax`.

**`math-classification-logistic-softmax` (深一層)**
- *Scope:* turning scores into probabilities; logistic regression.
- *Skeleton:* 開場(輸出要是「機率」,怎麼把實數壓到 0–1?) → 直覺(sigmoid/softmax) → **sigmoid / softmax / logistic regression / decision boundary** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `σ(z)=1/(1+e^{−z})`; `softmax(z)_k=e^{z_k}/Σ_je^{z_j}`.
- *Lightweight derivation:* show softmax normalizes (`Σ_k softmax(z)_k=1`) and that 2-class softmax reduces to the sigmoid (three lines).
- *Quiz idea:* "softmax 加一個常數到所有 logits 會變嗎?" trap: not seeing shift-invariance (it cancels).
- *深一層:* the softmax Jacobian `∂softmax/∂z`; temperature; logits vs probabilities.
- *Demo:* 2-D logistic decision boundary, draggable weights. *Forward:* → `math-cross-entropy-and-kl`.

**`math-cross-entropy-and-kl` (深一層)**
- *Scope:* the classification loss and the distance-between-distributions object.
- *Skeleton:* 開場(分類為何用 cross-entropy?) → 直覺(對驚訝程度的編碼成本) → **entropy / cross-entropy / KL divergence** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `H(p,q)=−Σp log q`; `D_KL(p‖q)=Σp log(p/q)`; `H(p,q)=H(p)+D_KL(p‖q)`.
- *Lightweight derivation:* cross-entropy of a one-hot label vs softmax = `−log q_{correct}` = the categorical NLL (three lines) — so minimizing cross-entropy = MLE = minimizing `D_KL(data‖model)`.
- *Quiz idea:* "cross-entropy 和 KL 差在哪?" trap: conflating them (they differ by the label's own entropy `H(p)`, constant in θ).
- *深一層:* `D_KL≥0` via Jensen (Gibbs' inequality); asymmetry `D_KL(p‖q)≠D_KL(q‖p)` and which direction training uses.
- *Demo:* KL between two movable 1-D blobs. *Forward:* → `math-jensen-and-elbo`.

**`math-jensen-and-elbo` (深一層)**
- *Scope:* the variational lower bound; the VAE/diffusion bridge.
- *Skeleton:* 開場(有 latent 變數時 log-likelihood 算不動) → 直覺(用 Jensen 換一個算得動的下界) → **Jensen's inequality / ELBO** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `log p(x)=log∫p(x,z)dz ≥ E_q[log p(x,z)−log q(z)]` (ELBO).
- *Lightweight derivation:* multiply-and-divide by `q(z)`, then apply Jensen (`log E≥E log`) → the ELBO in three lines.
- *Quiz idea:* "ELBO 是上界還下界?" trap: sign/direction of Jensen for concave `log`.
- *深一層:* the exact gap `log p(x)−ELBO=D_KL(q‖posterior)≥0`; tightness when `q`=posterior; the VAE objective.
- *Demo:* bound-vs-true-log-likelihood as `q` moves. *Forward:* → `math-stochastic-gradients`; → the Diffusion & Flow course's ELBO.

**`math-stochastic-gradients` (深一層)**
- *Scope:* differentiating *through* randomness — the engine of VAE/diffusion/RL training.
- *Skeleton:* 開場(loss 是一個期望,怎麼對它做 gradient?) → 直覺(抽樣估計,但有兩種接法) → **Monte-Carlo gradient / score-function trick / reparameterization trick** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* score-function `∇_θE_{p_θ}[f]=E[f·∇_θlog p_θ]`; reparameterization `x=μ_θ+σ_θε`, `ε∼𝒩(0,I)` ⇒ `∇_θE[f(x)]=E_ε[∇_θf(x)]`.
- *Lightweight derivation:* derive the score-function estimator from `∇_θ∫p_θf=∫f∇_θp_θ` and the **log-derivative identity** `∇_θp_θ=p_θ∇_θlog p_θ` (three lines).
- *Quiz idea:* "reparameterization 為何常比 score-function 好訓練?" trap: not knowing it usually has lower variance.
- *深一層:* variance comparison; pathwise vs score-function; where each is forced (discrete → score-function).
- *Demo:* reparameterization animation: sample `ε`, push through `μ+σε`, gradient flows. *Forward:* → L8 `math-flow-to-generative-model`; → diffusion training / policy gradients.

### Lecture 8 stubs

**`math-vector-fields-and-flow`**
- *Scope:* arrows + a point riding them; gentle prequel to `n2d-vector-field`.
- *Skeleton:* 開場(滿屏箭頭) → 直覺(風場,放葉子) → **vector field / flow / integral curve** + 白話 → lightweight derivation → quiz → forward.
- *Key:* `v(x,t)` → integral curve.
- *Lightweight derivation:* one Euler-free step of "follow the arrow": `x(t+Δ)≈x(t)+Δ·v(x(t),t)` from the velocity picture (one line) — seeds the next note.
- *Quiz idea:* "同一 field,不同起點走一樣的路?" trap: field = one path vs a rule for all starts.
- *Demo:* drop a particle, trace it. *Forward:* → `math-odes-and-euler`; → `n2d-vector-field`.

**`math-odes-and-euler` (深一層)**
- *Scope:* continuous motion vs step-by-step; discretization/error.
- *Skeleton:* 開場(連續移動怎麼用電腦算?) → 直覺(一步步逼近) → **ODE / Euler step / truncation error** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `x_{k+1}=x_k+h·v(x_k,t_k)`.
- *Lightweight derivation:* get the Euler step from the first-order Taylor of `x(t+h)` and identify the dropped `O(h²)` as the local error (three lines).
- *Quiz idea:* "step 減半,誤差約變多少?" trap: wrong scaling vs the method's order.
- *深一層:* local vs global truncation error; why higher-order solvers exist (→ flow-course samplers).
- *Demo:* Euler `h`-slider, true vs approx + error. *Forward:* → `math-change-of-variables`; → `n2d-sampling-as-integration`.

**`math-change-of-variables` (深一層)**
- *Scope:* how a density transforms under stretching; the flow-likelihood object.
- *Skeleton:* 開場(拉伸印著密度的橡皮膜) → 直覺(擠壓處變濃) → **change of variables / Jacobian determinant / push-forward** + 白話 → lightweight derivation → quiz → 深一層 → forward.
- *Key:* `p_Y(y)=p_X(x)/|det J|`; 1-D `p_X(x)/|dy/dx|`.
- *Lightweight derivation:* in 1-D, conserve mass `p_Y(y)|dy|=p_X(x)|dx|` → divide (two lines).
- *Quiz idea:* "把空間拉長,密度變高還低?" trap: direction of the `|det J|` factor.
- *深一層:* the n-D determinant version; **det/trace and the log-det** that appears in flow likelihoods.
- *Demo:* stretch a 1-D density, watch it renormalize. *Forward:* → `math-flow-to-generative-model`; → `n2d-probability-flow-ode`.

**`math-flow-to-generative-model`**
- *Scope:* assemble L8 into "what a flow-based generative model is"; intuition only.
- *Skeleton:* 開場(noise 怎麼變一張臉?) → 直覺(沿學到的 field 開車) → tie field+ODE+change-of-vars → translate(「生成」↔ flow `𝒩(0,I)`→data) → quiz → forward.
- *Key:* sample `x₀∼𝒩(0,I)`, integrate `dx/dt=v_θ(x,t)` to `x₁∼p_data`.
- *Lightweight derivation:* none new — *assemble* the three prior objects and state the generation loop in pseudocode.
- *Quiz idea:* "生成時模型在做什麼?" trap: thinking it looks up data vs transports noise.
- *Scope line:* intuition only; objective/score/CFM live in the Diffusion & Flow course. *Forward:* → `n2d-overview`, `dfc-principles-*`.

**`math-random-walk-and-brownian` (optional, 深一層)**
- *Scope:* the stochastic on-ramp to SDE/diffusion; optional.
- *Skeleton:* 開場(醉漢走路) → 直覺(每步加隨機) → **random walk / Brownian motion / dW** + 白話 → lightweight derivation → quiz → forward.
- *Key:* sum of small random steps → Brownian motion.
- *Lightweight derivation:* variance of a sum of `N` i.i.d. steps adds → spread `∝√N` (two lines).
- *Quiz idea:* "走 N 步離原點多遠?" trap: linear-in-N vs `√N`.
- *Demo:* random walk → Brownian limit. *Forward:* → the SDE side of the Diffusion & Flow course.

### Lecture 9 stubs

**`math-objects-recap-map`**
- *Scope:* the whole toolbox on one page; synthesis.
- *Skeleton:* 開場(你其實只學了少數幾種東西) → 對照表(L1 vectors → … → L8 flows) → 一句:DL = 它們的組合 → quiz → forward.
- *Quiz idea:* "attention 的『相似度』來自哪個物件?" trap: not recognizing L1's inner product.
- *Forward:* → `math-where-the-math-shows-up`.

**`math-where-the-math-shows-up`**
- *Scope:* concrete sightings inside real DL; recognition.
- *Skeleton:* 開場(認出老朋友) → 短例(attention=inner product, normalization=whitening, backprop, softmax/cross-entropy, KL in VAE/diffusion, GNN spectral) → translate each → 課外讀物 pointers (Fourier/convolution, MCMC/Langevin, kernels, natural gradient — named only) → quiz → forward.
- *Quiz idea:* "batch/layer norm 最接近哪一課?" trap: missing the L2 whitening connection.
- *Forward:* cross-link Invariance & Equivariance and Flow series; → `math-reading-a-paper`.

**`math-reading-a-paper`** *(capstone)*
- *Scope:* the signature skill — decode an equation, **reproduce its derivation**, translate to language *and* code, both directions.
- *Skeleton:* 開場(拿到沒看過的公式) → checklist(每個符號是什麼物件?) → one fully worked real equation, including a short re-derivation → 反向:把白話+程式碼還原成公式 → quiz → forward.
- *Worked example:* an equation the site already cites (e.g. the flow-matching velocity-regression loss, or cross-entropy) — name symbols, redo the short derivation. No new claims.
- *Quiz idea:* "下標 `θ` 代表什麼?" trap: reading a learnable parameter as a fixed constant.
- *Forward:* → `math-open-questions` / the paper viva (§4.2).

**`math-open-questions` (optional)**
- *Scope:* hedged pointers to open problems; survey-level only.
- *Skeleton:* 開場(這些地方數學還沒講完) → 短段(optimization landscapes, generalization, geometry of representations) → 每段一句「為何未解」→ forward.
- *Guardrail:* no invented results (Ground Truth); cite survey-level or hedge; TODO anything uncertain.
- *Forward:* → L10 recap.

### Lecture 10 stubs

**`math-course-recap`**
- *Scope:* self-test + notation checklist; gap-finder.
- *Skeleton:* 開場(看符號、說人話、會推一步) → table: symbol → one-sentence translation → the one-line derivation it unlocks → owning lecture → "read & derive this cold" self-tests → forward.
- *Quiz idea:* a mixed "name that object + do the one-line derivation" round over L1–L8.
- *Forward:* → From Noise to Data / Diffusion & Flow, and Invariance & Equivariance.

**Viva defenses & explainer showcase** *(no note)* — students defend their assigned-paper explainer live (§4.2); strongest explainers become site notes/demos.
