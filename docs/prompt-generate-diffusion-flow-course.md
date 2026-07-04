# Prompt — Generate the "Diffusion & Flow-Based Generative Models" course content

> Paste everything below the line into Codex. It is written for an agent working inside this repo. The job is to **author new graduate-course teaching notes** from the syllabus, incrementally, at the standard of the existing `from-noise-to-data` series.

---

## Goal

Generate the course notes specified in `docs/syllabus-diffusion-flow-course.md`, as short modular MDX notes with interactive demos and self-check quizzes, matching the voice/structure/quality of the `from-noise-to-data` series. This includes **Part 0 — a "Math Intuitions" prerequisite primer** (`docs/math-intuitions-series-plan.md`) so a 大一/大二 student with no background can follow. Work **one lecture at a time, in order, building green after each**. Math must be correct; never invent results or citations.

**Three rules that override the temptation to go fast (read the style guide for detail):**
- **Pace — one new object per note, problem-driven, picture-before-symbol.** A "lecture" is a *cluster of 3–5+ short notes*, not one dense pass. If a note introduces 3+ first-seen terms/formulas in a few paragraphs, it is too fast — split it. Every object grows out of a concrete stuck situation, then gets a life-like/geometric picture, then the symbols (each unpacked), then a line tying it back to the opening problem.
- **Math terms in English.** Write technical terms in English embedded in Chinese prose — "假設 $v_t$ 是 smooth、time-dependent 的 vector field", **not** 「光滑的時間相依向量場」. First use of a term gets one plain-language gloss, then English thereafter. (Glossary in the style guide.)
- **Audience floor = 大一/大二.** Each lecture's first note lists the `math-` primer notes it depends on; assume the reader may need to read those first.

## Read these first (do not skip)

1. **The syllabus you are implementing:** `docs/syllabus-diffusion-flow-course.md` — Part 0 + the 14-lecture sequence (Parts I–VI), per-lecture content/derivations/readings/demos, the notation section, the demo-feasibility policy, and the authoring conventions. Source of truth for *what* to write.
2. **The Part 0 math primer plan:** `docs/math-intuitions-series-plan.md` — the ~15 prerequisite `math-` notes (objects, life-like hooks, which lecture needs each). Build these as the foundation.
3. **The voice + quiz guide:** `docs/n2d-voice-and-quiz-style.md` — binding for *how* to write; now includes the **English-math-terminology** rule (+ glossary) and the **one-object-per-note pacing** rule. Follow both.
3. **Gold-standard notes to imitate:** `site/src/content/notes/research-areas/from-noise-to-data/` — read `n2d-why-gaussian.zh.mdx`, `n2d-continuity-equation.zh.mdx`, `n2d-conditional-to-marginal.zh.mdx`, `n2d-probability-flow-ode.zh.mdx` (note its KL-vs-W₂ box), and `n2d-review.zh.mdx`.
4. **Quiz component:** imported in notes as `import Quiz from '../../components/Quiz.astro';` (resolves to `site/src/content/notes/components/Quiz.astro`). Reuse it; do not reinvent.
5. **Demo templates:** `site/public/notes/research_areas/noise-to-data/` — `_demo-common.js`, `vector-field.html`, `score-field.html`. Copy this structure.
6. **Ground rules:** `CONTENT_AGENT.md`, `AGENT.md`. Math must be correct; never invent papers/theorems/results; cite primary sources; mark unknowns as TODO.

## Where everything goes

- **Part 0 (math primer):** folder `site/src/content/notes/research-areas/math-intuitions/`, `group: "Math Intuitions"`, slug prefix `math-` (slugs in `docs/math-intuitions-series-plan.md`).
- **Course folder:** `site/src/content/notes/research-areas/diffusion-flow-course/`.
- **Group (frontmatter):** `group: "Diffusion & Flow Models"`, `category: "research-areas"`.
- **Slugs:** prefix `dfc-`. Each *lecture* becomes **3–5+ short notes — one object each** (per the pacing rule; err toward more, smaller notes); name them `<lecture-slug>-<concept>`, e.g. for L3 `dfc-ddpm-elbo`: `dfc-ddpm-elbo-variational-bound`, `dfc-ddpm-elbo-simplified-loss`, `dfc-ddpm-elbo-parameterizations`. Slugs are stable and never reused.
- **Ordering:** register every new slug in `site/src/lib/notes.ts` `noteSlugList`, in syllabus order, after the `from-noise-to-data` block.
- **Demos:** new standalone HTML in `site/public/notes/research_areas/diffusion-flow-course/`; reuse or sibling-copy `_demo-common.js`.

## What each note must contain

Follow the hidden 7-part structure with **varied, natural headings** (use the style-guide heading bank — do not repeat an identical template across notes):
1. **Scene-based opening** (what the reader is looking at / a natural question).
2. **One-line intuition.**
3. **A minimal concrete example**, with an embedded **interactive demo** when the syllabus lists one for that lecture.
4. **Formal math** in KaTeX (`$…$`, `$$…$$`): the actual definition / derivation / theorem at graduate depth — do not stop at the metaphor. Use the syllabus **notation** consistently; define each symbol on first use; keep the unified SDE/ODE/interpolant framing as the through-line.
5. **"幾個容易想歪的地方"** with **1–3 `<Quiz>`** components.
6. **"這怎麼接到研究？"** — connect to the primary readings; what the paper actually contributes.
7. **"下一步"** linking to the next note, then **"參考文獻"**.

Plus, for every note:
- **Frontmatter** satisfying `site/src/content.config.ts`: `slug, lang:"zh", title, category:"research-areas", group:"Diffusion & Flow Models", status, updated, summary, demos[], references[]`. The `summary` is the card subtitle: one warm, concrete sentence. `status:"available"` once it meets the bar, else `"draft"`.
- An **English `missing` stub** `*.en.md` (same slug) in the same folder, in the repo's existing en-stub format.
- **Inline cross-note links absolute:** `[文字](/personal_website/zh/notes/<slug>)`. Never a bare relative slug.

## Quizzes (per the style guide)
Multiple per note allowed; **vary the correct-answer index across the whole course** (never always first); **every option, including wrong ones, has an `explain`**; **plain text only in option `text`** (no `$…$`; use Unicode like ε, σ, ∇log p, ‖·‖, →). Questions = the real misconceptions for that topic (e.g. "ε-prediction 和 x₀-prediction 哪裡不同？", "DDIM 為什麼能少步又確定？", "guidance scale 拉大一定更好嗎？", "discrete diffusion 為什麼不能直接用 score？").

## Math & citation rigor (this is a graduate course)
- Derive carefully and **state assumptions** (e.g. Gaussian transition, affine schedule, Lipschitz score). Show the steps a student needs; do not hand-wave the hard step.
- **Never state a result you cannot attribute.** The syllabus reading list is a *planning* set: before citing, verify author/title/venue/year; if you cannot confirm a source, write the claim conservatively and mark `<!-- TODO: verify citation -->` rather than inventing a reference.
- Keep a `## 參考文獻` section with primary sources (arXiv/DOI/venue).
- Empirical / SOTA claims must be cited or explicitly hedged.

## Demos (feasibility policy — important)
Browser demos stay **analytic toys, 2-D analogs, or pre-computed/cached outputs**. A live latent-diffusion image model, a real PDE solver, or a protein model **cannot** run in the iframe — for image/science lectures use cached denoising frame-sequences or a 2-D analog and say so. Every demo: clear learning goal, adjustable params, visible change, an explicit "觀察這個不變量 / tradeoff" line; theme-aware (parent `data-theme` + `prefers-color-scheme`), reduced-motion-safe (no auto-loop; slider-driven; optional single-pass Play), responsive hi-DPI canvas. Embed via absolute iframe and list in frontmatter `demos`.

## Working process (do this, in order)

1. **Start with Part 0 (math primer) — it sets the pace/terminology template.** Write the first 2–3 `math-` notes in full (e.g. `math-randomness-and-distribution`, `math-density-vs-probability`, `math-expectation-and-averages`) with their analytic 2-D demos + en stubs, register slugs, and **build** `cd site && npm run build` until green.
2. Run the **verification checklist** (below) and post a short report; **pause for the author to review** the template (pace = one object per note, English terms, demo, quiz) before continuing.
3. After sign-off: finish the rest of Part 0, then do the course **one lecture per increment** in syllabus order (L1 → L14) — each lecture = its cluster of 3–5+ short notes — building green and self-checking after each. **Do not dump multiple lectures at once.** Each lecture's first note lists its `math-` prereqs at the top.

## Verification checklist (after each lecture)
1. `npm run build` is **green**.
2. Content collection syncs (frontmatter passes the zod schema).
3. KaTeX renders with no warnings (watch `→`/other Unicode inside `\text{}`, and `{` inside `$…$` — the MDX pipeline is strict).
4. Quizzes render; correct-answer index is varied; each wrong option shows its explanation.
5. Demos embed and their assets land in `dist/`; theme-aware, reduced-motion-safe, responsive (check a narrow viewport).
6. No bare relative note links remain.
7. Every derivation re-checked; every citation verified or marked TODO.

## Constraints
- Do not add empty top-level site sections, do not rewrite the architecture, do not change the build config or the `Quiz` component API.
- Reuse existing infra (`Quiz`, `_demo-common.js`, the schema). Keep diffs scoped to the new course folder + the `noteSlugList` registration.
- Honor `AGENT.md` / `CONTENT_AGENT.md`: one consistent warm, teacherly voice; intuition first, then the hard step in full; never invent facts or results; bilingual parity (zh authored, en `missing`).
