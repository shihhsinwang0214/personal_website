# Plan — Restructure "From Noise to Data" as the intuition-only tier

Decided with the author (2026-06-27). Repositions the `from-noise-to-data` (n2d) series
as the **pure-intuition tier** for all general readers, and pushes every derivation up to
the `diffusion-flow-course` (dfc) deep tier. Chosen scope: **Core + taster**. Chosen
home for "why Gaussian": **move to dfc** (near interpolants/EDM).

This is a planning doc. Each note rewrite still needs the author's per-note go-ahead
(CONTENT_AGENT.md: don't rewrite existing notes without explicit request). Routing /
slug / order changes go to the maintenance agent (AGENT.md) via `docs/codex_handoff.md`.

---

## 0. Current state (so we plan against reality)

- **math-intuitions** (primer, lowest tier): 3 of ~15 notes written. Teaches the raw math
  objects (distribution, density, expectation, …).
- **from-noise-to-data** (n2d): 18 notes, zh complete, en all `missing`.
- **diffusion-flow-course** (dfc, deep tier): only the Part I principles cluster exists
  (`dfc-principles-transport-map`, `-corrupt-and-reverse`, `-course-map`); the other ~14
  lectures from `docs/syllabus-diffusion-flow-course.md` are unwritten. The syllabus
  already plans each dfc lecture to "add the derivation" for the matching n2d note.

Implication: most "move to dfc" actions are, for now, **"leave an intuition + a
forward-link in n2d; write the derivation in dfc later"** — not literally moving text into
notes that don't exist yet.

## 1. Three-tier contract (paste into CONTENT_AGENT.md / syllabus)

- **math-intuitions** — *what a math object is* (distribution, gradient, ODE…).
- **n2d** — *the core ideas and pictures of generative models.* Picture only; the shortest
  path everyone can finish; on hitting a derivation, forward-link out — never prove here.
- **dfc** — *the full math of the same thing* (ELBO, Tweedie, CFM theorem, KL/W₂,
  interpolants), for readers willing to invest.

Rule of thumb: if an n2d note contains something a reader "must see derived to believe,"
the derivation belongs in dfc; n2d keeps the result + intuition + a pointer.

## 2. Fix the opening

Current order starts: what-models-learn → **why-gaussian** → samples-as-particles. The
why-gaussian note interrupts the distribution→particle on-ramp before the reader has any
reason to care about Gaussian.

**(a) Add an intro note** — slug `n2d-overview`, first in the series. Its only job is the
bridge the author flagged as hard for general readers: **data ↔ distribution ↔ particle ↔
generation**.

1. data = the finite samples you have;
2. distribution = the unseen "rule / shape of a cloud of points" behind them;
3. particle = one sample seen as a movable point in space (a whole image = one
   high-dimensional point);
4. generation = move a cloud of easy-to-make points until its shape matches the data's —
   moving particles *is* reshaping the distribution;
5. close with the two lenses (transport vs corrupt/denoise), the series map, and the exits
   up (dfc) and down (math-intuitions).

This absorbs the bridging currently scattered in the openings of #1 / #3; afterward
what-models-learn focuses on "learn a distribution, not memorize," and samples-as-particles
focuses on the particle view.

**(b) Pull why-gaussian out of position 2.** Leave one line at the start of the series:
"we start from an easy Gaussian cloud — treat it as a convenient choice for now; we justify
it once you've seen the whole machinery." All later notes that assume `p₀ = N(0, I)` still
hold.

## 3. Where why-gaussian goes

Its real justification (isotropic, closed-form, the endpoint of noising, SNR) lives with
stochastic interpolants / EDM — dfc territory (syllabus L1/L3/L7). **Move the body to dfc.**
Two-phase, because the dfc home isn't written yet:

- **Phase 1 (now):** drop the front-of-series one-liner (§2b); re-order `n2d-why-gaussian`
  to the end of n2d, relabeled as optional/deeper. Nothing breaks.
- **Phase 2 (when dfc L3/L7 exist):** migrate the content into the dfc note, add a redirect
  `n2d-why-gaussian` → the dfc slug (maintenance agent). Don't reuse/rename the slug.

## 4. Per-note audit (Core + taster)

Keep every topic, but each n2d note is trimmed to its intuition layer; heavy derivations
become forward-links to dfc.

| n2d note | action | derivation destination |
|---|---|---|
| (new) overview | write | — |
| what-models-learn | keep, trim overlap into overview | — |
| why-gaussian | move out of opening → end (Phase 1), then dfc (Phase 2) | dfc L1/L3/L7 |
| samples-as-particles | keep (core picture) | — |
| vector-field | keep (core picture) | — |
| probability-path | keep | — |
| continuity-equation | trim to "mass conserved; points don't appear/vanish" | PDE + Fokker–Planck → dfc L2 |
| denoising | keep (already has the cat/dog intuition) | ELBO → dfc L3 |
| score-function | trim to "direction toward higher density" | Tweedie algebra → dfc L4 |
| velocity-regression | keep (core picture) | — |
| conditional-to-marginal | trim to intuition ("regress an easy per-pair target, still recover the right average field") | CFM proof → dfc L6 (**most technical; highest-priority trim**) |
| diffusion-fm-core | trim to "three signals are one thing" (option: fold into three-languages) | reparameterization algebra → dfc L3/L7 |
| probability-flow-ode | trim to "same marginals; deterministic vs stochastic" | KL/W₂ + reductio → dfc L5/L7 |
| sampling-as-integration | trim to "take small steps along the field" | solver / NFE → dfc L8 |
| path-design | shorten to taster | dfc L7/L10 |
| rectified-flow | shorten to taster | dfc L10 |
| optimal-transport | shorten to taster | dfc L16 |
| three-languages | keep as the synthesis/closer | — |
| review | keep; adjust quizzes to the trimmed scope | — |

## 5. Proposed new n2d order

overview → what-models-learn → samples-as-particles → vector-field → probability-path →
continuity-equation → denoising → score-function → velocity-regression →
conditional-to-marginal → diffusion-fm-core → probability-flow-ode →
sampling-as-integration → path-design → rectified-flow → optimal-transport →
three-languages → review → *(why-gaussian parked at the very end as optional until it
migrates to dfc)*.

## 6. Execution batches

**Batch 1 — opening (low risk).**
- Draft `n2d-overview` (zh; en `missing`). → maintenance: register slug at the front of
  `noteSlugList`.
- Add the front one-liner about starting from Gaussian.
- Re-order `n2d-why-gaussian` to the end + relabel optional. → maintenance: `noteSlugList`
  order.

**Batch 2 — trims (content-only; per-note author approval each).**
- Highest priority: conditional-to-marginal, probability-flow-ode, continuity-equation,
  score-function (these carry the most non-intuition weight).
- Then: diffusion-fm-core, sampling-as-integration.
- Then tasters: path-design, rectified-flow, optimal-transport.
- Each trim = cut the derivation, keep the picture, add `→ derived in [dfc …] (coming)`.

**Batch 3 — cross-series (needs dfc written + maintenance).**
- As each dfc lecture lands, move the derivation there; add redirects for any n2d slug that
  fully migrates (why-gaussian first).

## 7. Constraints

- Reorder = edit `src/lib/notes.ts` `noteSlugList` only (maintenance agent).
- Slugs are stable: never reuse or rename; a moved note gets a new `dfc-` slug + a redirect
  from the old `n2d-` slug (precedent exists: `flow-matching-*` → `n2d-*`).
- Trims are content-only but each needs the author's go-ahead.
- Bilingual: new/edited notes ship zh first, en `missing` (tracked) — unchanged from today.
- Don't touch the standalone demos or their URLs.
