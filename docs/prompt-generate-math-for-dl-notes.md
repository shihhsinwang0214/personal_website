# Prompt — Generate the "All the Math You Need for Deep Learning" course notes

> Paste everything below the line into Codex. It is written for an agent working inside this repo. The job is to **author new teaching notes** from the syllabus, incrementally, at the standard of the existing `math-intuitions` and `from-noise-to-data` notes — but every note now **opens with a practical, plain-language question** and then introduces the math tool that answers it.

---

## Goal

Generate the notes specified in `docs/syllabus-math-for-deep-learning-course.md` (10 lectures, ~44 short notes, folder `research-areas/math-intuitions/`, slug prefix `math-`). Each note is one idea, three tiers (intuition → lightweight derivation → optional `深一層` box), bilingual (zh authored, en `missing` stub), with a playable analytic 2-D demo where cheap and 1–3 self-check quizzes. Work **one lecture at a time, in order, building green after each**. Math must be correct; never invent results or citations.

**The one structural change that defines this course (do not skip):**
> **Every note opens with a 起手問題 — a real, practical, plain-language problem a beginner instantly understands and would actually want solved — stated with _no math and no jargon_. Only after the reader feels the problem do we introduce the math object as the tool that answers it.** This is how the course teaches its core skill: *translate plain language ↔ math, see why we need the math, and see how to use it.* Every later section ties back to that opening question, and the note ends by explicitly answering it.

**Three rules that override the temptation to go fast (read the style guide for detail):**
- **Pace — one new object per note, problem-driven, picture-before-symbol.** A "lecture" is a *cluster of 3–6 short notes*, not one dense pass. If a note introduces 3+ first-seen terms/formulas in a few paragraphs, it is too fast — split it.
- **Math terms in English.** Write technical terms in English embedded in Chinese prose — "兩個 vector 的 inner product", **not**「向量的內積」. First use of a term gets one plain-language gloss, then English thereafter. (Glossary in the style guide.)
- **Audience floor = 大一/大二.** The main line (intuition + lightweight derivation) must be followable with high-school algebra. Harder material goes in a `深一層` box that can be skipped with no loss of continuity.

## Read these first (do not skip)

1. **The syllabus you are implementing:** `docs/syllabus-math-for-deep-learning-course.md`. The **§7 lecture sequence** and the **Appendix note-level stubs** are the source of truth for *what* each note covers — each stub already lists the object, the life-hook, the **lightweight derivation**, a **quiz idea + the trap it targets**, the **`深一層`** box content, the **demo**, and the **forward-link**. §6 defines the three-tier contract. §5 is the notation to reuse verbatim. §8 is the demo-feasibility policy.
2. **The writing standard — the binding minimum bar: `docs/notes-standard.md`.** This is *how* to write: voice, the problem-first **logical beats (which are beats, NOT headings)**, heading discipline, the three-tier / lightweight-derivation model, the English-term rule, quiz + demo conventions, the **common-mistakes anti-patterns**, and a **Definition of done** you must self-check against before handoff. It **supersedes** the brief style notes in this prompt — meet every checklist item. (It builds on `docs/n2d-voice-and-quiz-style.md`, which holds the heading bank + English-term glossary.)
3. **Living gold examples — imitate their *shape*, not a template:** the four Lecture-1 notes in `site/src/content/notes/research-areas/math-intuitions/` — `math-points-as-vectors`, `math-norms-and-distance`, `math-inner-product-and-similarity`, `math-matrix-as-data-and-map`. They realize the full target structure (problem opened as prose → tool → picture → demo → minimal math → lightweight derivation → translate → quiz → optional `深一層` → loop-close), with varied headings and a spread of quiz-answer positions. For more voice depth, skim `from-noise-to-data/n2d-why-gaussian.zh.mdx`. The three older probability notes (`math-randomness-and-distribution`, `math-density-vs-probability`, `math-expectation-and-averages`) predate this structure — match their frontmatter/demo/quiz mechanics, but when you reach **L6** retro-fit them to open with a 起手問題 and carry a lightweight-derivation line (preserve their slugs/demos).
4. **Quiz component:** imported in every `.mdx` as `import Quiz from '../../components/Quiz.astro';` (resolves to `site/src/content/notes/components/Quiz.astro`). Reuse it; do not reinvent.
5. **Demo templates:** copy the structure of the existing math-intuitions demos in `site/public/notes/research_areas/math-intuitions/` (`histogram-density.html`, `randomness-distribution.html`, `running-average.html`) and the shared `_demo-common.js` pattern in `site/public/notes/research_areas/noise-to-data/_demo-common.js` (theme-aware, reduced-motion-safe, responsive hi-DPI canvas).
6. **Ground rules:** `CONTENT_AGENT.md`, `AGENT.md`. Math must be correct; never invent papers/theorems/results; cite primary sources; mark unknowns as `<!-- TODO: verify -->`.

## Where everything goes (path conventions — note the hyphen vs underscore)

- **Notes (content):** `site/src/content/notes/research-areas/math-intuitions/` — **hyphen** `research-areas`. One `.zh.mdx` + one `.en.md` per slug.
- **Demos (public assets):** `site/public/notes/research_areas/math-intuitions/<demo>.html` — **underscore** `research_areas`. Embed via absolute iframe `/personal_website/notes/research_areas/math-intuitions/<demo>.html` and list the relative path `notes/research_areas/math-intuitions/<demo>.html` in frontmatter `demos`.
- **Category / group (frontmatter):** `category: "courses"`; **`group` is the note's lecture**, e.g. `"Lecture 2 · Eigen, SVD & PCA"` — all notes in a lecture share one group label (this is what makes the index show one collapsible "Lecture N · …" section). Add each new lecture's label to `groupOrder` in `site/src/lib/notes.ts` so lectures sort numerically. Files still live in the `research-areas/math-intuitions/` folder — folder ≠ category; the loader keys on frontmatter.
- **Slugs:** exactly the `math-` slugs in the syllabus (e.g. `math-points-as-vectors`, `math-inner-product-and-similarity`, …). Stable, never reused.
- **Ordering:** register every new slug in `site/src/lib/notes.ts` `noteSlugList`, in syllabus order, after the three existing `math-` slugs (`math-randomness-and-distribution`, `math-density-vs-probability`, `math-expectation-and-averages`).

## The note's structure & the starting question

The full structure — the logical beats, **heading discipline (open the problem as prose; vary headings; ≤6 H2 per note; never ship `## 起手問題` / `## 回到開頭的問題` / `## 動手推一步` as fixed headings across notes)**, the three-tier model, and the quiz/demo/frontmatter rules — lives in **`docs/notes-standard.md`**. Follow it; this prompt does not re-specify it.

The one course-defining emphasis: **every note opens with a 起手問題** — a concrete, plain-language problem from daily life (Spotify/YouTube, photo storage, predicting a price, "is B really better than A?"), with no symbols and no English technical terms, **written as the opening prose, not under a heading**. The note then names the math object as the answer, and at the end returns to that question and answers it. A good starting question needs *exactly* this note's one object, so the object feels earned, not announced.

**Starting-question seeds for Lecture 1** (already realized in the shipped notes — reuse the pattern when you derive later lectures' questions from the syllabus stubs' life-hooks):
- `math-points-as-vectors` — 一萬張照片，電腦沒有眼睛，一張照片要先存成什麼才算得動？
- `math-norms-and-distance` — 推薦系統說兩個使用者「很像」，只憑兩串數字，怎麼量有多接近？
- `math-inner-product-and-similarity` — Spotify 只憑每首歌一串數字，怎麼知道兩首歌「真的很像」？
- `math-matrix-as-data-and-map` — 想一次找出整個曲庫裡最像的前 10 首，能不能用一個運算算完？

## Frontmatter + English stub (every note)

`.zh.mdx` frontmatter must satisfy `site/src/content.config.ts`:
```yaml
---
slug: "math-inner-product-and-similarity"
lang: "zh"
title: "Inner Product：兩個東西有多『同方向』"
category: "courses"
group: "Lecture 1 · Vectors & Similarity"
status: "available"        # "draft" if not yet at the bar
updated: 2026-06-28
summary: "<one warm, concrete sentence — the intuition only; no derivation / 深一層 content>"
demos:
  - "notes/research_areas/math-intuitions/inner-product-similarity.html"   # omit if none
references: []
---
import Quiz from '../../components/Quiz.astro';
```
Also create the matching **`*.en.md` stub** (same slug, `lang:"en"`, `status:"missing"`, `summary:"English translation in progress; content-agent task."`, empty `demos`/`references`, body = the repo's existing "Content Coming Soon" stub). Copy the format of `math-density-vs-probability.en.md` verbatim.

The first `#` H1 in the body is stripped by the remark pipeline, so start the body with an H1 that repeats the title, then the 起手問題.

## Quizzes, three-tier, and demos

All three are specified in **`docs/notes-standard.md`** (§6 quizzes · §4 three-tier / lightweight derivation · §8 demos) — follow it. The reminders that bite in practice: the **lightweight derivation is mandatory and in the main line** (≤5 lines, only prior objects, both telling cases when cheap); **quiz option `text` is plain text only** (no `$…$`; Unicode like ε, σ, ∇log p, ‖·‖, ⊥) with the **correct-answer index varied across the series**; demos are **analytic 2-D toys** with a "拖這個 → 看那個" line, and the L3 image-compression demo ships **cached frames**, not a live decoder.

## Working process (do this, in order)
1. **Write Lecture 1 in full** — its 4 notes (`math-points-as-vectors`, `math-norms-and-distance`, `math-inner-product-and-similarity`, `math-matrix-as-data-and-map`) with their `深一層` boxes, analytic 2-D demos, en stubs; register slugs in `noteSlugList`; then `cd site && npm run build` until green.
2. Run the **verification checklist**, post a short report, and **pause for the author to review the template** (starting question → tool → intuition → demo → lightweight derivation → translate → quiz → Deeper → loop-close) before continuing.
3. After sign-off: do the course **one lecture per increment** in syllabus order (L1 → L10), each lecture = its cluster of notes, building green and self-checking after each. **Do not dump multiple lectures at once.** When you reach **L6**, retro-fit the three existing notes (`math-randomness-and-distribution`, `math-density-vs-probability`, `math-expectation-and-averages`) to open with a 起手問題 and carry a lightweight-derivation line, preserving their existing demos/quizzes/slugs.

## Verification checklist (after each lecture)
1. `cd site && npm run build` is **green**; content collection syncs (frontmatter passes the zod schema).
2. Every note opens with a 起手問題 (plain language, no math) and **ends by answering it**; the main line contains a ≤5-line lightweight derivation; any `深一層` box is skippable.
3. KaTeX renders with no warnings (watch `→`/Unicode inside `\text{}`, and `{` inside `$…$` — the MDX pipeline is strict).
4. Quizzes render; correct-answer index is varied across the series; each wrong option has an `explain`; option `text` is plain (no `$…$`).
5. Demos embed, assets land in `dist/`; theme-aware, reduced-motion-safe, responsive (check a narrow viewport).
6. All cross-note links are absolute `/personal_website/zh/notes/<slug>` and point to slugs that exist; the en `missing` stub exists for every note.
7. Every derivation re-checked; every citation verified or marked TODO.

## Constraints
- Do not change the build config, the schema, or the `Quiz` component API; do not rewrite site architecture. Keep diffs scoped to `research-areas/math-intuitions/`, the matching `public/.../math-intuitions/` demos, and the `noteSlugList` registration.
- One consistent warm, teacherly voice; intuition first, then the honest one-step derivation; never invent facts/results; bilingual parity (zh authored, en `missing`).

---

## Appendix — the gold example lives in the repo, not here

Don't imitate a pasted snippet — **open the four shipped Lecture-1 notes** (`site/src/content/notes/research-areas/math-intuitions/math-inner-product-and-similarity.zh.mdx` and its three siblings) and match their shape. They are the canonical realization of everything above and in `docs/notes-standard.md`: a **headerless 起手問題 opening**, the tool named as the answer, a playable demo with a "drag X → watch Y" line, a **≤5-line lightweight derivation that checks both telling cases**, an optional skippable `深一層` box, **varied headings (≤6 H2)**, a loop-closing ending, and quizzes with plain-text options and a varied correct-answer index. When in doubt, read those files and `docs/notes-standard.md`'s *Definition of done*.
