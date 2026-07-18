# Publication Overview Figure Agent Workflow

Purpose: create repeatable standalone overview figures for publications on this
website. These are not full posters. Each publication overview must produce:

1. A website-ready overview figure.
2. Optional one-slide figure canvas for presentations or review.
3. Short captions and alt text that support the figure.

Poster figures are the primary visual target and source reference. Do not create
a full poster, a mini-poster, or a whole-poster screenshot. Do not replace
poster-derived figures with stock or generic AI imagery when useful poster
figures exist.

## Source Of Truth

- Publication metadata: `site/src/data/content.ts`
- Website page: `site/src/pages/publications.astro`
- Existing poster asset: `site/public/assets/ICLR25/ICLR_2025_oral_poster.pdf`
- User-provided poster sources currently reviewed:
  - `C:/Users/vespe/Downloads/NeurIPS_2025___poster.pdf`
  - `C:/Users/vespe/Downloads/ICLR_2025_oral_poster.pdf`
  - `C:/Users/vespe/Downloads/ICML_2026_Poster (2).pdf`

Never invent paper claims, metrics, venues, links, or captions. If a claim cannot
be verified from the poster, paper, slides, repository records, or explicit user
input, write `TODO(user): ...` and stop before publishing.

## Current Poster Style Baseline

The inspected posters share a strong visual pattern:

- Landscape poster with white side columns and a deep blue-gray center canvas.
- Large central takeaway text, with bold emphasis on the method name or core
  claim.
- Main visual sits in the center panel and is more important than dense tables.
- Figures use clean node-link diagrams, simple process arrows, dashed grouping
  boxes, and a small number of accent colors.
- Side columns hold motivation, method details, and selected results. These are
  source material for captions, not material to cram into the overview figure.
- Dense result tables and QR codes should usually be removed from website
  overview figures unless the user asks to retain them.

Baseline visual tokens for rebuilt figures:

- Dark canvas: `#34454d` to `#384850`
- Main text on dark canvas: `#f7f8f5`
- Muted text on dark canvas: `#cdd7da`
- Light surface: `#ffffff` or `#f7f7f4`
- Line color: `#dce3e5`
- Molecular / graph accent: `#6c5ce7`
- Warm process accent: `#f4b21f`
- Hot / cold chain accents: `#e95b4f`, `#4a9bea`
- Success / biological accent: `#bfe8c8`

## Agent Roles

Run these roles as separate agents only when the user explicitly asks for
parallel/subagent execution. Otherwise, the main agent follows the same role
sequence locally.

### 1. Inventory Agent

Inputs:

- `site/src/data/content.ts`
- Poster paths, paper URLs, slides URLs, code URLs, and user-provided files.

Tasks:

- Build one manifest entry per target publication.
- Match each poster to the publication title in `content.ts`.
- Mark missing posters or missing authoritative sources.
- Preserve existing publication metadata exactly.

Output: `output/publication-overviews/<slug>/manifest.json`

### 2. Poster Mining Agent

Inputs:

- Manifest entry.
- Poster PDF.

Tasks:

- Render the poster to PNG using Poppler or an equivalent renderer.
- Inspect the full poster visually.
- Identify the core figure, central claim, method name, visual motifs, and any
  result numbers used on the poster.
- Create crop candidates only as references. The final website figure should be
  rebuilt or cleanly exported, not a blurry poster crop, unless a high-resolution
  crop is already visually sufficient.

Output:

- `output/publication-overviews/<slug>/source-audit.txt`
- Optional crop candidates under `output/publication-overviews/<slug>/crops/`

### 3. Narrative Agent

Inputs:

- Manifest entry.
- Poster audit.
- Paper or poster text.

Tasks:

- Write the communication job in one sentence:
  `By the end, the viewer should understand X because Y.`
- Select one central claim for the figure.
- Decide the figure story: input -> method idea -> output or problem ->
  mechanism -> result.
- Keep claims grounded in sources. Do not add broader research claims.

Output: `output/publication-overviews/<slug>/narrative.txt`

### 4. Figure Synthesis Agent

Inputs:

- Poster audit.
- Narrative.
- Crop candidates or source figures.

Tasks:

- Produce one standalone 16:9 overview figure.
- Optionally place the same figure on a single-slide canvas for review or talk
  use. The slide is a figure container, not a poster layout.
- Use the poster's central-panel style when appropriate: dark canvas, large
  takeaway, central method diagram, sparse labels.
- Keep text minimal and embedded labels sufficient for the figure to stand
  alone.
- Avoid side columns, dense tables, QR codes, long equations, and whole-poster
  screenshots in overview figures.

Preferred outputs:

- `site/public/assets/publications/<slug>/overview.png`
- `site/public/assets/publications/<slug>/overview@2x.png`
- `site/public/assets/publications/<slug>/overview.svg` when the figure is
  vector-native and legible.
- `output/publication-overviews/<slug>/<slug>-figure-slide.pptx` only if a
  slide artifact is requested.
- `output/publication-overviews/<slug>/<slug>-figure-slide.png` only if a
  slide artifact is requested.

For PowerPoint output, use the presentations workflow and `@oai/artifact-tool`.
Render the final slide and inspect it before delivery. The figure remains the
source of truth.

### 5. Caption Agent

Inputs:

- Narrative.
- Final figure preview.
- Source audit.

Tasks:

- Write captions that assist the figure, not captions that compensate for an
  unclear figure.
- Keep the short caption concise enough for the publication page.
- Add alt text that describes the visual structure and core meaning.
- Include unresolved source gaps as TODOs instead of guessing.

Caption schema:

```json
{
  "slug": "<publication-slug>",
  "title": "<exact publication title from content.ts>",
  "shortCaption": "<= 35 words",
  "longCaption": "<= 90 words, 1-2 sentences",
  "altText": "<visual description plus central claim",
  "sourcePoster": "<path or URL>",
  "sourcePaper": "<path or URL>",
  "status": "draft | ready-for-author-review | ready-for-website"
}
```

Output: `output/publication-overviews/<slug>/captions.json`

### 6. Website Handoff Agent

Inputs:

- Final website figure.
- Captions JSON.
- Existing publications page and data.

Tasks:

- Add website assets under `site/public/assets/publications/<slug>/`.
- Add only the minimal metadata needed by the publications page.
- Preserve `withBase()` for site-relative links.
- Do not rewrite publication titles, authors, venues, or bibtex.
- Verify the Astro build.
- Verify `/publications/` in desktop and mobile screenshots if the page changes.

Possible future data shape:

```ts
overview?: {
  image: string;
  alt: string;
  shortCaption: string;
  longCaption?: string;
  slide?: string;
}
```

## Manifest Template

Use this for each publication before producing visuals:

```json
{
  "slug": "iclr-2025-schull",
  "title": "A Theoretically-Principled Sparse, Connected, and Rigid Graph Representation of Molecules",
  "venue": "ICLR 2025 [Oral Presentation]",
  "paperUrl": "https://openreview.net/forum?id=OIvg3MqWX2",
  "posterPath": "site/public/assets/ICLR25/ICLR_2025_oral_poster.pdf",
  "slidesPath": "site/public/assets/ICLR25/ICLR_2025_oral_slides.pdf",
  "codeUrl": "https://github.com/shihhsinwang0214/SCHull",
  "methodName": "SCHull",
  "visualTarget": "central dark-panel molecular graph construction",
  "status": "source-audit-needed"
}
```

Known starter entries:

```json
[
  {
    "slug": "iclr-2025-schull",
    "title": "A Theoretically-Principled Sparse, Connected, and Rigid Graph Representation of Molecules",
    "posterPath": "site/public/assets/ICLR25/ICLR_2025_oral_poster.pdf",
    "methodName": "SCHull"
  },
  {
    "slug": "neurips-2025-sshg",
    "title": "Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs",
    "posterPath": "C:/Users/vespe/Downloads/NeurIPS_2025___poster.pdf",
    "methodName": "SSHG"
  },
  {
    "slug": "icml-2026-source-parallel-tempering",
    "title": "Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions",
    "posterPath": "C:/Users/vespe/Downloads/ICML_2026_Poster (2).pdf",
    "methodName": "Source Parallel Tempering"
  }
]
```

## Visual Composition Rules

- One idea per overview.
- Website visitor first, figure mechanics second, slide never first.
- The figure must explain itself when embedded alone on the website.
- Use labels inside the figure for the method's actors and transformations.
- Use captions for context, not for essential missing labels.
- Prefer simplified recreations of poster figures over full poster screenshots.
- Preserve the author's visual language: restrained typography, dark central
  panel, clean arrows, sparse accent colors, technical clarity.
- Do not add decorative gradients, stock backgrounds, generic icons, or unrelated
  visual metaphors.
- Title copy must be plain-language and contribution-led. It should answer
  "what problem does this solve?" or "what did this add?" before introducing
  method jargon.
- Put technical names in secondary labels, not as the first thing a new visitor
  must parse.
- Avoid formulas and internal notation in the main figure unless they are the
  central visual object. If a formula is useful, pair it with a one-line plain
  translation.
- Every figure needs a visible "why it works" or "why it matters" sentence in
  ordinary language.
- Pass the first-time visitor test: a strong ML reader outside the subfield
  should understand the core idea in under 10 seconds.
- Keep website figure dimensions stable. Recommended exports:
  - `overview.png`: 1600 x 900
  - `overview@2x.png`: 2400 x 1350 or 3200 x 1800
- Verify text legibility at a 380 px mobile viewport.
- A single-slide export, when requested, should contain the overview figure as
  the primary object. It should not add poster-style side columns.

## Workflow Checklist

1. Read `AGENT.md`, `CONTENT_AGENT.md`, and this workflow.
2. Read `site/src/data/content.ts` and identify target publication records.
3. Create the publication manifest.
4. Render poster previews.
5. Audit visual style and claims from the poster.
6. Write the communication job and central claim.
7. Design the standalone overview figure.
8. Export website figure variants.
9. Write captions and alt text.
10. Inspect the figure visually. If a slide artifact is requested, render the
    slide and inspect it too.
11. If website integration changes code or data, run `npm run build` in `site/`.
12. If the publications page changes, screenshot desktop and mobile.
13. Mark status as `ready-for-author-review`, not published, unless the user
    explicitly approves the content and visual.

## Review Gates

Block publishing if any of the following is true:

- A claim or metric is not traceable to a source.
- The figure depends on caption text to be understandable.
- Text overlaps, wraps awkwardly, or is illegible on mobile.
- The overview uses a generic visual instead of the poster-derived target.
- The output includes the whole poster or poster side columns when the overview
  should isolate the method figure.
- The website page fails to build.
- The publication metadata was changed without explicit user instruction.

## Final Handoff Format

For each completed publication, report:

- Publication slug and title.
- Source poster and source paper.
- Website figure path.
- Optional slide path, if requested.
- Captions JSON path.
- QA performed.
- TODOs requiring author review.
