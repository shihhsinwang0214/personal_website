# Blueprint — Rebuild "From Noise to Data" as one beginner course

Decided with the author (2026-06-27). Supersedes the "Core + taster" scope in
`docs/n2d-restructure-plan.md`. Goal: n2d becomes **one self-contained course that any
beginner can finish** — the common core of flow-based generative models, pure intuition.
Everything research-oriented or derivation-heavy is **relocated to dfc** (the deep,
research course). Nothing is deleted; relocated notes are preserved as dfc draft seeds.

Why now: the new `n2d-overview` already establishes data → Euclidean space → particle →
distribution (density) → the two lenses → the Gaussian one-liner → the roadmap. That makes
several existing notes partly redundant, and exposes how much current n2d content is above
the beginner bar.

---

## 1. New n2d — the beginner core (11 notes)

| # | slug | role in the core | change |
|---|---|---|---|
| 1 | n2d-overview | data / space / particle / distribution / two lenses / map | done |
| 2 | n2d-what-models-learn | learn a distribution, not memorize; the 3 questions (represent / train / sample) | trim overlap with overview |
| 3 | n2d-samples-as-particles | **Lagrangian**: follow ONE particle's trajectory over time | drop the "what is a particle" intro (overview owns it); refocus on trajectory |
| 4 | n2d-vector-field | **Eulerian**: the field is what we learn | light trim |
| 5 | n2d-probability-path | the in-between "film" pₜ; mention "you can pick a better film" as a one-liner | light trim |
| 6 | n2d-denoising | generation as gradual repair (the cat/dog intuition) | keep |
| 7 | n2d-score-function | direction toward higher density; state denoising ≡ score | keep intuition; Tweedie derivation → dfc |
| 8 | n2d-velocity-regression | learn "which way to flow"; uₜ = x₁−x₀; L2 | keep; conditional-vs-marginal subtlety stays a one-liner |
| 9 | n2d-sampling-as-integration | sampling = follow the field in small steps (Euler) | **kept in core**; solver families / NFE / truncation error → dfc |
| 10 | n2d-three-languages | noise / score / velocity = one thing (absorb the ε↔score↔velocity intuition) | keep as closer |
| 11 | n2d-review | cross-cutting self-check | adjust quizzes to the new, smaller scope |

This is a finishable arc: *what generation is → two ways to see the motion (particle / field)
→ the path between → what the model learns at each step (denoise / score / velocity) → it's
all one thing.*

## 2. Relocated to dfc (preserved, not deleted)

These leave the beginner course. They are real, good content — they become **dfc draft
seeds**, to be deepened (full derivations) when the matching dfc lecture is authored.

| current n2d slug | why it leaves the core | dfc home (syllabus) |
|---|---|---|
| n2d-continuity-equation | the PDE / mass-conservation formalism is above the beginner bar | dfc L2 |
| n2d-conditional-to-marginal | the CFM trick + conditional-mean proof is mid-depth | dfc L6 |
| n2d-diffusion-fm-core | full ε/score/velocity reparameterization algebra (intuition kept in three-languages) | dfc L3/L7 |
| n2d-probability-flow-ode | PF-ODE + KL/W₂ nuance is research-level | dfc L5/L7 |
| n2d-path-design | "path as a design variable" is a research idea | dfc L7/L10 |
| n2d-rectified-flow | a specific method | dfc L10 |
| n2d-optimal-transport | Monge/Kantorovich/Benamou–Brenier formalism | dfc L16 |
| n2d-why-gaussian | already demoted; full reason sits with interpolants/EDM | dfc L1/L3/L7 |

## 3. How to "archive" (recommended: regroup, don't delete)

**Recommendation:** change each relocated note's frontmatter `group` from
`"From Noise to Data"` to `"Diffusion & Flow Models"` and `status` to `draft`, and move it
from the n2d block of `noteSlugList` into the dfc block. Consequences:

- **Slugs stay** (e.g. `n2d-continuity-equation` keeps its URL) → no redirects, no 404,
  no broken inbound links.
- The notes **drop out of the beginner course** (nav, prev/next, the home Writing core)
  and **show up under the dfc course as draft** seeds.
- **No content is lost**; later, polished `dfc-` notes can supersede each draft.

Frontmatter `group`/`status` are content-agent edits; the `noteSlugList` re-ordering is the
maintenance agent's. (Alternatives considered: hard-archive to an `_archive/` folder + 
redirects — cleaner separation but removes access and needs redirect plumbing; or just
unlist from nav — simplest but leaves them half-in. Regroup-to-draft is the best balance.)

## 4. dfc side

Keep `docs/syllabus-diffusion-flow-course.md` as the dfc master. The relocated notes (§2)
become the draft bodies behind the syllabus lectures. The 3 existing dfc principles notes
(`dfc-principles-transport-map`, `-corrupt-and-reverse`, `-course-map`) now overlap with
`n2d-overview`'s "two lenses / what is this" framing — review them for overlap and
re-pitch them as the *deeper* Part I (don't duplicate overview). This is a follow-up, not
part of the n2d-core rebuild.

## 5. Execution batches

**Batch A — content trims that follow directly from overview (content agent; per-note verify).**
1. `n2d-samples-as-particles`: drop the particle re-introduction, point to overview, refocus
   on the Lagrangian trajectory. *(started)*
2. `n2d-what-models-learn`: trim the distribution/sample overlap now in overview.
3. `n2d-vector-field`: light trim.
4. `n2d-three-languages`: absorb the ε↔score↔velocity intuition from diffusion-fm-core.
5. `n2d-score-function`, `n2d-velocity-regression`, `n2d-probability-path`,
   `n2d-sampling-as-integration`: light trims + forward-links to dfc for the derivations
   (sampling keeps the "small steps" intuition, drops solver/NFE detail).
6. `n2d-review`: re-scope quizzes.

**Batch B — relocate the 9 deep notes (content sets group/status; maintenance reorders).**
- Content: set `group: "Diffusion & Flow Models"`, `status: "draft"` on each relocated note.
- Maintenance (handoff): move those 9 slugs from the n2d block to the dfc block of
  `noteSlugList`; confirm the home/index/prev-next reflect a 10-note n2d core and a dfc
  draft group; confirm no URL 404s and Pagefind still indexes them.

**Batch C — dfc follow-up (later).** Deepen each draft into a proper `dfc-` lecture per the
syllabus; review the 3 principles notes vs overview.

## 6. Constraints

- Slugs are stable: regroup, don't rename/reuse. No redirects needed under §3.
- Each content rewrite needs the author's per-note go-ahead; the author verifies.
- Bilingual: edits ship zh first, en `missing` (tracked) — unchanged.
- Don't touch the standalone demos or their URLs.
- Use the file Read tool (not the shell) as source of truth right after edits.
