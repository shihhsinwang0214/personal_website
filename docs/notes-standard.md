# Notes Writing Standard — Math for Deep Learning course

**This file is the binding minimum bar for authoring every `math-` note.** Read it before you write, and self-check against the *Definition of done* at the bottom before handoff. It consolidates the voice guide, the three-tier model, the problem-first structure, and the mistakes caught in review. Where a one-off prompt and this file disagree on *style*, **this file wins**.

Companion references: `docs/n2d-voice-and-quiz-style.md` (voice + quiz + English-term glossary), `CONTENT_AGENT.md` / `AGENT.md` (ground truth), `docs/syllabus-math-for-deep-learning-course.md` (what each note covers). The four Lecture-1 notes in `site/src/content/notes/research-areas/math-intuitions/` (`math-points-as-vectors`, `math-norms-and-distance`, `math-inner-product-and-similarity`, `math-matrix-as-data-and-map`) are the **living gold examples** — imitate their *shape*, not a template.

---

## 1. Voice & tone
Warm, teacherly, low-pressure; invite, don't diagnose ("我們換個角度看", not "你卡住了"). Cut every removable word. Don't show off terminology. One main idea per note. State scope honestly (what this note does and doesn't do). **Math must be correct** — if unsure, mark `<!-- TODO: verify -->`, never paper over a gap with plausible-sounding prose.

## 2. The note's logical spine — these are BEATS, not headings
A note moves through this order of *ideas*. **Do not turn these into section titles** (see §3).

0. **A practical question** — a real, plain-language problem a beginner instantly gets and would want solved. No math, no English technical terms. This *opens* the note.
1. **Name the tool** — introduce the object as the thing that answers the question: English term + one plain-language gloss. This is the explicit plain-language → math moment.
2. **One-sentence intuition** + a life-like or geometric picture.
3. **Minimal example + playable demo**, with a "drag X → watch Y" instruction tied to the question.
4. **Minimal math** (KaTeX), every symbol unpacked, using the syllabus §5 notation.
5. **Lightweight derivation** — a ≤5-line, by-hand manipulation (main line, mandatory; see §4).
6. **Translate both ways** (白話 ↔ 符號), anchored on the opening question.
7. **1–3 quizzes** on the real misconception.
8. *(optional)* a **`深一層` box** with the harder proof.
9. **Close the loop** — answer the opening question in a sentence or two.
10. **Forward-link** to the next note + **references**.

## 3. Heading discipline — the #1 thing reviewers catch
- **Never turn the beats in §2 into fixed headings.** A series where every note repeats `## 起手問題`, `## 動手推一步`, `## 把白話翻成數學，再翻回來`, `## 回到開頭的問題` is a visible template and violates the voice guide ("每篇的段落標題要不一樣").
- **Open with the problem as prose — no header.** Like `math-density-vs-probability`, the note's first lines are the scene/question itself, not a heading.
- **Vary heading wording across notes** (and within the series). Two notes should not share the same structural heading text.
- **Keep it to ≈6 H2 per note.** Merge beats into flowing prose instead of chopping into many labeled sections. The close-the-loop beat is usually one or two sentences ending a section, not its own heading.
- The **`深一層` box is a blockquote** beginning `> **\`深一層\`：…**`, never an H2.
- Heading-bank seeds (mix, adapt, invent — never ship verbatim across notes): opening picture → 先抓住這個畫面 / 先記一句話 / 最重要的圖像; tool → 我們需要一把尺 / 電腦需要的是一串數字; demo → 玩一下 / 拖拖看 / 轉一轉就看見; math → 寫成數學 / 把畫面翻成式子; derivation → 動手算一行 / 親手推一次 / 順手驗一下; quiz → 一個容易掉的坑 / 停下來想一下; close/next → 接下來 / 下一步 / 你之後會在哪遇到它.

## 4. Three tiers (per note)
Intuition (main line) → **lightweight derivation (main line)** → optional **`深一層` box**.
- The lightweight derivation is **mandatory and in the main line**: ≤ ~5 lines, uses only objects already introduced, reproducible by hand (e.g. solve `cosθ` from `xᵀy=‖x‖‖y‖cosθ`; set `∇=0`; take a `log`; expand a sum). If a step needs a new theorem or an ε–δ argument, it is **not** lightweight — move it to the box.
- When it's cheap, the derivation should check **both** telling cases (e.g. `x=y ⇒ cos=1` *and* `x⊥y ⇒ cos=0`), not just one.
- The **`深一層` box** is the only place for the heavier proof / general theorem; it is self-contained, **skippable**, and **never holds a load-bearing fact**. Omit it entirely when the object is purely definitional — not every note needs one.
- Verify **both** derivations on paper before publishing (Ground Truth).

## 5. English technical terms in Chinese prose
Write the math term in **English** embedded in Chinese — "兩個 vector 的 inner product", not「向量的內積」. On a term's **first appearance in the note**, give one plain-language gloss (not a Chinese-jargon translation), then use the English term thereafter. Everyday descriptions ("往哪走", "越來越密") stay Chinese. Glossary: `docs/n2d-voice-and-quiz-style.md`.

## 6. Quizzes
- Use the `<Quiz>` component (`import Quiz from '../../components/Quiz.astro';`). Multiple per note allowed.
- **Vary the correct-answer index across the whole series** — track it; never let several notes in a row put the answer in the same slot. (Across a 4-note lecture, cover {0,1,2}.)
- **Every option, including wrong ones, has an `explain`** that names *why* the misconception is tempting and where it goes wrong — that's the teaching value.
- **Plain text only in option `text`** — no `$…$`; use Unicode (ε, σ, ∇log p, ‖·‖, →, λ, ⊥).
- The question = a real misconception a learner would actually have, not a trivia/recall check. Options are plausible traps, cleanly worded (no clunky "…這個提示" phrasings).

## 7. Translate-both-ways beat
Keep it — it's the course's signature — but **vary its form** across notes (sometimes 2–3 bullets 白話↔符號, sometimes a short prose paragraph, sometimes only the 符號→白話 direction). Always anchor the examples to *this note's* opening question. Do not ship the identical "三個 bullet + 反過來，看到 X…" shape every time.

## 8. Demos
Analytic 2-D toy only (no live models; cached frames where a model can't run). Each demo: one clear learning goal, adjustable params, a visible change, and an explicit "拖這個 → 看那個" line tied to the question. Theme-aware (parent `data-theme` + `prefers-color-scheme`), reduced-motion-safe (slider/Play-driven, no auto-loop), responsive hi-DPI canvas. Files live in `site/public/notes/research_areas/math-intuitions/` (**underscore** `research_areas`); embed via absolute iframe `/personal_website/notes/research_areas/math-intuitions/<demo>.html`; list the relative path in frontmatter `demos`.

## 9. Frontmatter, bilingual, links
- Frontmatter must satisfy `site/src/content.config.ts`: `slug, lang:"zh", title, category:"courses", group:"Lecture N · <title>", status, updated, summary, demos[], references[]`. **The math course uses `category: "courses"`; each note's `group` is its lecture** (e.g. `"Lecture 2 · Eigen, SVD & PCA"`) — all notes in a lecture share one group label, which renders as one collapsible "Lecture N · …" section in the index. Each lecture label must also be listed in `groupOrder` in `site/src/lib/notes.ts` so lectures sort numerically (Lecture 10 after Lecture 2). Files stay under the `research-areas/math-intuitions/` folder (folder ≠ category).
- `summary` = the intuition in one warm sentence; **no derivation / 深一層 content** (the index must stay beginner-legible).
- Each note ships **zh authored + a `*.en.md` `missing` stub** (copy the existing stub format). Never auto-translate.
- Cross-note links are **absolute**: `[文字](/personal_website/zh/notes/<slug>)`. Register every slug in `site/src/lib/notes.ts` `noteSlugList`, in syllabus order.
- The body's first `#` H1 (repeating the title) is stripped by the remark pipeline; start the prose right after it with the opening problem.

## 10. Common mistakes — anti-patterns to avoid (from review)
- ❌ **Identical structural headings across notes** (template feel). → ✅ open headerless; vary heading wording; ≤6 H2.
- ❌ **Over-sectioning** (~10 H2 for a ~120-line note). → ✅ merge beats into prose; the gold note `math-density-vs-probability` uses ~5.
- ❌ **The translate beat frozen as "3 bullets + 反過來，看到 X…" every time.** → ✅ vary the form (§7).
- ❌ **Correct-answer index clustering** (several notes with the answer in slot 0). → ✅ spread across {0,1,2,3}.
- ❌ **Lightweight derivation that checks only one extreme.** → ✅ check both telling cases when cheap.
- ❌ **Clunky quiz-option wording** ("丟掉了…這個提示"). → ✅ clean, plausible misconception text.
- ❌ **Forcing a `深一層` box onto a purely definitional object.** → ✅ omit it; judgment over ritual.
- ❌ **Jargon/symbols before the picture.** → ✅ picture first, then the symbol, each symbol unpacked.
- ❌ **A Chinese-jargon translation of a term** ("光滑的時間相依向量場"). → ✅ English term + one plain gloss.

## Definition of done (self-check before handoff)
The note…
- [ ] opens with a **plain-language practical question** — no header, no math, no English technical term;
- [ ] **names the tool as the answer** to that question (English term + one gloss);
- [ ] puts a **life-like / geometric picture before any symbol**;
- [ ] embeds a **working demo** with a "drag X → watch Y" instruction tied to the question;
- [ ] carries a **≤5-line lightweight derivation in the main line** (both telling cases when cheap);
- [ ] has at most an **optional, skippable `深一層` box** (omitted if the object is definitional);
- [ ] **varies its headings** (≤6 H2; none identical to sibling notes' structural headings; problem opens headerless);
- [ ] **closes the loop** — answers the opening question in a sentence or two;
- [ ] quizzes: **correct index varied** across the series, **every option explained**, **plain-text options**, real misconceptions;
- [ ] **English terms glossed once**, then reused; everyday words stay Chinese;
- [ ] **frontmatter valid**, `summary` intuition-only, **en `missing` stub present**, **cross-links absolute**, slug registered;
- [ ] every derivation **re-checked on paper**; citations real or `TODO`; **build green**.
