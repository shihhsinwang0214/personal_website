# Prompt — Raise the "Invariance and Equivariance" notes to the "From Noise to Data" standard

> Paste everything below the line into Codex. It is written for an agent working inside this repo.

---

## Goal

Bring the 7 notes in `site/src/content/notes/research-areas/invariance-and-equivariance/` up to the exact standard of the **From Noise to Data** series, in voice, structure, subtitle/tone, visual demos, math content, and math explanation. Do not invent results; keep the build green.

## Read these first (the canonical standard — do not skip)

1. **Gold-standard notes** (study the voice, headings, scene-openings, quizzes, math depth):
   `site/src/content/notes/research-areas/from-noise-to-data/` — especially `n2d-why-gaussian.zh.mdx`, `n2d-vector-field.zh.mdx`, `n2d-continuity-equation.zh.mdx`, `n2d-conditional-to-marginal.zh.mdx`, `n2d-probability-flow-ode.zh.mdx`, and `n2d-review.zh.mdx`.
2. **Style + quiz guide:** `docs/n2d-voice-and-quiz-style.md` (voice rules, heading-variant bank, quiz conventions, notation). Treat it as binding.
3. **Quiz component** (reuse, do NOT reinvent): imported in notes as `import Quiz from '../../components/Quiz.astro';` (resolves to `site/src/content/notes/components/Quiz.astro`).
4. **Demo templates:** `site/public/notes/research_areas/noise-to-data/` — read `_demo-common.js`, `vector-field.html`, and `score-field.html`. Copy their structure (shared helpers, theme-awareness, reduced-motion, responsive hi-DPI canvas).
5. **Ground rules:** `CONTENT_AGENT.md` and `AGENT.md`. Math must be correct; never invent papers, theorems, or results; cite primary sources; mark unknowns as TODO.

## Files in scope

The 7 `*.zh.mdx` in `research-areas/invariance-and-equivariance/`:
`map-view-invariance-equivariance` (intro) → `cnn-translation-equivariance-from-map-views` → `sets-and-point-clouds-permutation-invariance` → `gnn-permutation-equivariance-road-networks` → `rotation-and-group-equivariant-cnns` → `euclidean-equivariant-gnns-point-clouds` → `frontiers-of-equivariant-learning`. Keep that learning order; keep all slugs stable.

---

## What to change

### 1. Voice, tone, and subtitle
- **Invitational, not diagnostic.** Avoid "卡點"-style "you're stuck" framing; open each section as "let's look at this from another angle / a natural question is…". Low-pressure, clear, direct — you can usually delete words and keep the meaning.
- **Scene-based opening.** Every note opens with what the reader is *looking at* (the running 台北地圖/手機視角 example is good — keep and reuse it as the series' mother-example, but give each note its own concrete entry scene).
- **Vary the section headings across the 7 notes.** Keep the internal logic but do NOT reuse an identical template of titles in every note. Use the heading-variant bank in the style guide (openers, one-line-intuition, minimal-example, formalize, misconceptions, research, next-step).
- **Encouragement without cheese.** Add 1–2 lines like "如果你已經能說出『label 不變、座標要跟著轉』，你其實已經抓到 equivariance 一半的直覺了。" — tied to content, never empty.
- **Subtitle = frontmatter `summary`.** Rewrite each `summary` so it is concrete, warm, and one sentence; it is the card subtitle. The `title` should stay descriptive/evocative (the 台大/手機視角 style is right).
- **Honest scope + one idea per note.** State what each note does and does not cover; define every symbol on first use.

### 2. Hidden structure (logic fixed, headings varied)
scene opening → a curiosity question (not "what's the blocker") → one-line intuition → a minimal concrete example (usually with a demo) → formalize into math → "幾個容易想歪的地方" with quiz(es) → "這怎麼接到研究？" → "下一步" (link to next note) → "參考文獻".

### 3. Quizzes (MDX `<Quiz>` — see style guide)
- Reuse the existing component: `import Quiz from '../../components/Quiz.astro';`.
- **Multiple quizzes per note are encouraged**; place them in the misconceptions section and/or after a hard idea.
- **Vary the correct-answer index across the whole series** — never always the first option. Cycle through positions 0/1/2(/3).
- **Every option, including wrong ones, needs an `explain`** that says why that intuition goes off (this is the teaching value).
- **Plain text only in option `text`** (the component renders it literally — no `$...$`; use Unicode like ρ(g), ∇, ·, ‖x−y‖, →).
- Questions should be the misconceptions a real learner has (e.g. "equivariance 一定比 invariance 好嗎？", "把方向輸出做成 invariant 會怎樣？", "DeepSets 的 sum 能不能換成 concat？").

### 4. Math content and explanation (raise the level; stay intuition-first and correct)
Each note must move from picture → **formal definition/theorem** in KaTeX (`$…$`, `$$…$$`), not stop at metaphor. Explicitly separate **intuition / formal fact / how research uses it / simplifying assumption**. Per note, make sure at least the following is present and correct (cite primary sources; never state a result you can't cite — hedge instead):

- **Intro (`map-view…`):** invariance `f(g·x)=f(x)`; equivariance `F(g·x)=ρ(g)F(x)`; group action `g·x`; representation `ρ` as a homomorphism `ρ(gh)=ρ(g)ρ(h)`; the input/output-space table. Add one line on why `ρ` on the output ≠ `g` on the input.
- **CNN translation equivariance:** define (cross-)convolution; show/derive that convolution commutes with translation `T_v`, i.e. `(T_v x) ⋆ ψ = T_v (x ⋆ ψ)`; show global pooling turns translation-equivariance into translation-**invariance**; note honest caveats (boundaries, str/subsampling, finite support). Cite Cohen & Welling (2016).
- **Sets / point clouds:** permutation invariance; state the **DeepSets** characterization `f(X)=ρ(Σ_i φ(x_i))` for permutation-invariant functions, and permutation-**equivariant** linear layers; cite Zaheer et al. (2017), Qi et al. PointNet (2017).
- **GNN permutation equivariance:** message passing `h_i' = γ(h_i, ⊕_{j∈N(i)} ψ(h_i,h_j,e_ij))` with a permutation-invariant aggregator `⊕`; node outputs are permutation-**equivariant**, graph-level readout is **invariant**; mention the 1-WL expressivity ceiling honestly. Cite Gilmer et al. (2017), Xu et al. GIN (2019).
- **Rotation / group-equivariant CNN:** group convolution `(f ⋆ ψ)(g) = Σ_h f(h) ψ(g⁻¹h)`; G-CNN on p4/p4m; steerable CNNs. Cite Cohen & Welling G-CNN (2016) and Steerable CNNs (2017).
- **E(n)-equivariant GNN / point clouds:** distinguish E(n) vs SE(3); invariant messages from `‖x_i−x_j‖`; equivariant coordinate update `x_i ← x_i + Σ_j (x_i−x_j) φ(…)`; keep invariant scalar features separate from equivariant vector features; mention Tensor Field Networks / irreps at a pointer level. Cite Satorras et al. EGNN (2021), Thomas et al. TFN (2018).
- **Frontiers:** equivariance ↔ expressivity tradeoffs, approximate/soft/relaxed equivariance, frame averaging, when hard-coded symmetry hurts. Cite specific papers; clearly mark anything speculative.

### 5. Visual demos (the biggest gap — all 7 currently have `demos: []`)
Build standalone, self-contained HTML demos and embed them. Mirror the existing convention exactly:
- **Location:** `site/public/notes/research_areas/invariance-and-equivariance/` (note the underscore in `research_areas`). Reuse `../noise-to-data/_demo-common.js` or add a sibling `_demo-common.js` with the same API (Box–Muller, palette/theme via parent `data-theme` + `prefers-color-scheme`, `prefersReducedMotion`, hi-DPI `setupCanvas`).
- **Embed in the note** with raw HTML and an **absolute base-prefixed src**:
  `<iframe src="/personal_website/notes/research_areas/invariance-and-equivariance/<name>.html" class="demo-frame" title="…" style="height: 720px; width: 100%; border: none;"></iframe>`
  and add it to frontmatter `demos: ["notes/research_areas/invariance-and-equivariance/<name>.html"]`.
- **Every demo needs:** a one-line learning goal, adjustable parameters, a visible change, and an explicit "觀察這個不變量 / tradeoff" line. **Theme-aware**, **respect reduced-motion** (no auto-looping; slider-driven; optional single-pass Play), **responsive** (no overlap of text/controls/canvas on mobile).
- **Concrete demo per note (build at least these):**
  - *Intro:* a map crop with **translate + rotate** sliders and an output-type toggle (label / coordinate / mask / vector / node-order); show which outputs stay fixed (invariant) vs co-transform (equivariant). Invariant to observe: the semantic label, while coordinates co-transform.
  - *CNN:* shift the input; show the feature map / detected edges shift by the same vector (equivariance); add a "global pool" toggle that makes the output constant (invariance).
  - *Sets/point clouds:* a set of points with a **shuffle** button; a sum-pooled (DeepSets) readout stays put while an order-sensitive MLP readout changes. Observe: permutation invariance.
  - *GNN:* a small graph; **relabel nodes**; node predictions permute with them (equivariance); the graph-level readout stays fixed (invariance).
  - *Group-CNN:* rotate input in 90° steps (p4); a vanilla-CNN feature changes vs a group-conv feature that co-rotates consistently.
  - *E(n) GNN / point cloud:* rotate/translate a 2D/3D point cloud; predicted vectors (force/velocity) co-rotate (equivariant) while pairwise distances / energy stay invariant.
  - *Frontiers (optional):* a "soft/approximate equivariance" slider showing the strict-equivariance ↔ expressivity/error tradeoff.

### 6. Bilingual, metadata, links
- Set `status: "available"` for each note that meets the bar (keep `draft` only if genuinely unfinished).
- Create `*.en.md` **`missing`** stubs for all 7 (bilingual parity), copying the existing en-stub format used in `from-noise-to-data/` (the "Content Coming Soon" body, `status: "missing"`, same slug).
- Frontmatter must satisfy the zod schema in `site/src/content.config.ts`: `slug, lang, title, category: "research-areas", group: "Invariance and Equivariance", status, updated, summary, demos[], references[]`.
- If note ordering is controlled by a list (check `site/src/lib/notes.ts` `noteSlugList`), register the 7 slugs in the intended order.
- **Remove the leftover `{/* Metadata Handoff … */}` comment blocks** from note bodies; fold any real metadata into frontmatter. Don't render authoring scaffolding to readers.
- **Inline cross-note links must be absolute and base-prefixed:** `[文字](/personal_website/zh/notes/<slug>)`. A bare `[文字](<slug>)` renders as a broken relative URL.

---

## Verify before finishing
1. `cd site && npm run build` (or `npx astro build`) is **green**; fix until it is.
2. Content collection syncs (all frontmatter passes the zod schema).
3. Every note's **KaTeX renders** with no warnings (watch the `→`-inside-`\text{}` and `{`-inside-`$…$` traps; the MDX pipeline is strict).
4. **Quizzes render** with the correct-answer index varied across the series; each wrong option shows its explanation.
5. **Demos embed and their assets land in `dist/`**; they are theme-aware, reduced-motion-safe, and responsive (check a narrow viewport).
6. **No bare relative note links** remain (`grep -rE '\]\((?!/|https?:)' on note bodies`).
7. **Math correctness:** re-derive each formula; every non-obvious claim has a citation or an explicit hedge.

## Constraints
- Do not add empty top-level site sections, do not rewrite the site architecture, and do not change the build config or the `Quiz` component API unless strictly necessary.
- Preserve all existing slugs and routes. Keep diffs minimal but substantive.
- Honor `AGENT.md` / `CONTENT_AGENT.md`: never invent facts, papers, or results; one consistent, warm, teacherly voice; intuition first, then the hard step in full.
