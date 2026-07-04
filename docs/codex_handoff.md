# Codex Handoff

Roles: Codex is the **implementer** (the maintenance agent governed by `AGENT.md`).
The reviewer/planner writes these prompts and reviews results; Codex does the building.

Working mode: the repo is already cloned locally into this project. For now we work
**local-only** — build and verify on the local copy; do not push and do not set up
deployment yet.

Eventual deployment target: free GitHub Pages, project site
`https://shihhsinwang0214.github.io/personal_website/` (base path `/personal_website`,
already configured). Once everything is verified locally and approved, we add the
GitHub Actions workflow and push (see "Deployment — later" below). The published site
must keep working until that owner-approved cutover.

Long-term direction and reference sites: see `WEBSITE_ROLE_MODELS.md` (adapt strengths,
don't copy). Increment 1 below is infrastructure only; role-model work lands in
Increments 2–3 (notes, figures, interactive presentation).

---

## Increment 1 — Stand up the Astro site locally (no deploy, no push)

Paste the prompt below to Codex.

```
You are working in a LOCAL clone of github.com/shihhsinwang0214/personal_website,
a personal academic website that will eventually be published on free GitHub Pages
(project site → https://shihhsinwang0214.github.io/personal_website/, base path
/personal_website). For now, work on the local copy ONLY: do not push, and do not set
up any deployment. Follow AGENT.md and docs/framework_migration_plan.md. Hard rules:
do not invent content; preserve all existing URLs; keep the bilingual (zh+en) notes
system; do not touch note bodies; do not delete any root files or the legacy/ backup;
the existing root site must keep working.

A new Astro app already exists in site/ (homepage + /publications + /experience,
content extracted verbatim, mobile-first, base=/personal_website, with the legacy
notes portal and assets carried in site/public/). Treat it as a starting point to
verify and finish — not as final. It has not been built yet.

Do this (all local):
1. In site/: run `npm install`, then `npm run build`. Fix any build or TypeScript
   errors. Generate package-lock.json. Report the resolved Astro version and every
   change you made. You may commit locally, but DO NOT push.
2. Run `npm run dev` (or `npm run preview`) and confirm `/`, `/publications`, and
   `/experience` render the migrated content correctly, that internal links/assets
   resolve under the /personal_website base, and that the carried-over legacy notes
   portal still works (open notes.html?home=true and each flow-matching demo URL).
   Verify the layout is usable on mobile (~380px width): single column, no overflow.
   Capture screenshots.
3. Report back: build status, the local preview URL, the screenshots from step 2, and
   anything that looked off versus the current site. Do NOT deploy or push.

Constraints recap: no invented facts; the two empty 2026 publication links stay
link-less until an authoritative URL exists; keep the withBase() helper for all
internal links and assets; English homepage stays English (a zh homepage is a
content-agent task, not yours).
```

Increment 1 status: COMPLETE and reviewed — build passed (Astro 6.4.8); `/`,
`/publications`, `/experience` render verbatim content; the three link-less 2026
papers stay plain text; legacy notes portal and all six demo URLs return 200; mobile
is single-column with no overflow. One cosmetic polish is noted below.

---

## Increment 2 — Migrate the notes system into Astro

Paste the prompt below to Codex.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md and CONTENT_AGENT.md. Increment 1
(Astro home/publications/experience in site/) is done and approved. Now migrate the
NOTES system into Astro.

Hard rules (unchanged): do not invent content; do not write, rewrite, or translate
note bodies; preserve all existing URLs; keep the bilingual (zh+en) system; mark
missing translations explicitly and never auto-generate them; do not delete root
files, legacy/, or the legacy notes portal carried in site/public/.

Current note sources (source of truth — copy, do not rewrite the bodies):
- notes/research_areas/flow-matching/story-zh.md      (zh available; EN missing)
- notes/research_areas/flow-matching/training-zh.md   (zh available; EN missing)
- notes/academic_skills/write-intro-en.md + write-intro-zh.md (en + zh available)
- Flow-matching demos are standalone HTML in notes/research_areas/flow-matching/*.html
  (also copied in site/public/notes/...). They must keep working at their current URLs.

Build this in site/:
1. Install `@astrojs/mdx` and add `mdx()` to astro.config integrations (additive; does
   not change the existing home/publications/experience pages). Then add a `notes`
   content collection with a glob loader whose pattern accepts BOTH formats:
   `**/*.{md,mdx}`. Give it a TYPED (Zod) frontmatter schema matching the
   CONTENT_AGENT.md handoff contract: slug (stable), lang ('en'|'zh'), title, category
   ('research-areas'|'academic-skills'), group, status
   ('available'|'draft'|'missing'|'coming-soon'), updated (date), summary,
   demos (string[]), references (array). Source the existing markdown (either keep the
   .md under notes/ via the loader base, or copy into src/content/notes/ — pick one and
   document it). Do NOT edit the bodies. Keep the existing notes as `.md`; `.mdx` is
   reserved for future interactive notes (raw-HTML iframes in today's .md would break
   if renamed to .mdx).
2. Render each note at /notes/<slug> (under the /personal_website base), per language
   (en + zh). Configure remark-math + rehype-katex in the Astro `markdown` config (add
   the katex CSS); MDX inherits this via extendMarkdownConfig, so math works in both
   .md and .mdx. Use Astro's built-in Shiki for code. Add a per-note table of contents
   from the headings and prev/next within the same group. Mobile-first; reuse
   site/src/styles/global.css tokens.
3. The two missing English flow-matching notes: do NOT translate. Mark status 'missing'
   and show a graceful coming-soon view (reuse notes/coming-soon-en.md). zh renders normally.
4. Build a /notes index page (Weng-style): notes grouped by category/group with a
   language toggle, linking to /notes/<slug>. This becomes the new notes home.
5. Keep the demos working: embed each demo where its note currently references it.
   Acceptable: keep the standalone demo HTML in public/ and embed via iframe (as today),
   or introduce a small <Demo> component — your choice, but the standalone demo URLs
   under /personal_website/notes/research_areas/flow-matching/*.html MUST still resolve,
   and iframes must size correctly on desktop and ~380px mobile.
6. Preserve legacy URLs: the legacy portal (notes.html?home=true, ?cat=&id=) must keep
   working (it is in public/). ADD compatibility redirects from the legacy index URLs to
   the new slugs:
     ?cat=themes&id=0 -> flow-matching story note
     ?cat=themes&id=1 -> flow-matching training note
     ?cat=skills&id=0 -> write-intro note
   (a thin client-side redirect page is fine; keep the legacy portal as a fallback.)
7. Suggested stable slugs (keep stable and document them): flow-matching-flow-ode,
   flow-matching-training, writing-compelling-introduction.

Verify (local, like Increment 1): `npm run build` passes; /notes, each /notes/<slug>
(zh), the coming-soon for the two missing EN notes, math rendering, code highlighting,
TOC, prev/next; demos render and resize on desktop and ~380px mobile; legacy notes.html
and all six demo URLs still 200; the legacy->slug redirects work. Capture screenshots
and report build status, the final slug list, and anything off. Do NOT push or deploy.

Constraints recap: no invented facts or citations; the English flow-matching notes stay
'missing' (a content-agent task later); keep withBase() for all links/assets; only touch
home/publications/experience as needed to link to /notes.
```

### Optional polish (safe to bundle with Increment 2)

On mobile the homepage H1 wraps inside the Chinese name — "(王士欣)" splits across a
line. In `site/src/layouts/Base.astro`, wrap the Chinese name in a `white-space: nowrap`
span (or equivalent) so the parenthetical never breaks mid-character. Cosmetic only.

---

Increment 2 status: COMPLETE and reviewed — build passes (11 pages); note bodies are
byte-identical to the root sources; schema matches the CONTENT_AGENT.md contract; KaTeX
+ TOC + prev/next work; the two EN flow-matching notes are `missing` (no translation
invented); legacy `?cat=&id=` redirects and all six demo URLs resolve.

Two follow-ups noted for later: the English `/notes` index currently shows the two
flagship notes as "Missing translation" (consider surfacing "Available in 中文" + link
to the zh version — folded into Increment 3); real one-line card summaries are a
content-agent task.

---

## Increment 3 — Experience & UI polish

Full spec: `docs/design_spec.md`. Decided ambition: keep the current academic-minimal
identity and palette; add premium depth, motion, and interaction. Paste the prompt below
to Codex.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md and docs/design_spec.md (the full
spec for this increment). Increments 1-2 are done and approved. This is an EXPERIENCE &
UI POLISH pass: make the site feel like a premium modern website/app while KEEPING the
current academic-minimal identity. Polish, not a redesign.

Hard rules: do not change content, copy, or note bodies; no new facts or translations;
do not break any URLs, the bilingual system, or the demos; keep withBase(); keep the
current palette/identity (extend tokens, don't replace them); mobile-first; ship minimal
JS (small islands only, no heavy UI framework); every animation respects
prefers-reduced-motion; accessibility (visible focus, AA contrast in BOTH themes,
keyboard support) is required; no layout shift.

Implement everything in docs/design_spec.md:
1. Visual foundations: extend global.css with a type scale, spacing scale, elevation,
   radius, and motion tokens, and refactor colors into semantic tokens so dark mode is
   a variable swap.
2. Dark mode: data-theme on <html>, default to system, header toggle persisted in
   localStorage, no-flash inline <head> script. Code (Shiki dual themes) and KaTeX must
   read correctly in dark.
3. Navigation: sticky header that condenses on scroll; desktop nav with theme + language
   toggles; accessible mobile hamburger drawer (aria-expanded, focus-trap, Esc,
   scroll-lock, click-outside); skip-to-content link.
4. Motion: Astro View Transitions (ClientRouter, persist header) + prefetch for instant
   navigation; tasteful micro-interactions (card lift, focus-visible rings, >=44px tap
   targets); optional subtle one-time scroll-reveal. All gated by reduced-motion.
5. Reading experience on note pages: scroll-spy TOC (mobile = "Contents" disclosure),
   reading progress bar, build-time reading time (zh by characters, en by words),
   back-to-top, copy-link heading anchors with sticky-header offset, body typography pass.
6. Refine components (cards, badges, toggles, footer); add an on-brand 404 page and a
   favicon. Also fold in: on the English /notes index, show the two flow-matching notes
   as "Available in 中文" linking to the zh version instead of a dead-end "missing".

Verify locally (no deploy) against the acceptance criteria in docs/design_spec.md:
build passes; light AND dark correct on /, /publications, /experience, /notes, a zh
note, and the EN missing page, with no theme flash; mobile (~380px) drawer works
(open/close/Esc/focus-trap/scroll-lock) and no horizontal overflow; view transitions +
prefetch; note-page scroll-spy / progress bar / reading time / back-to-top / anchor copy;
prefers-reduced-motion disables animation; keyboard-only pass; all existing URLs (note
slugs, legacy notes.html?..., six demo URLs) still resolve. Capture before/after
screenshots of each page in light + dark, desktop + ~380px mobile. Report build status,
the JS islands you added (and their sizes), and anything off. Do NOT push or deploy.
```

---

Increment 3 status: COMPLETE — implemented directly by the reviewer and confirmed by the
owner. Beyond the original spec it included a content-first restructure decided with the
owner: a slim top nav (brand + avatar, links, theme toggle, accessible mobile drawer);
the profile moved off every page to a new `/about`; a writing-first homepage (hero with
kicker, accent rule, corner contour motif; Writing / Research / Recent / Selected
publications sections with larger labels); full-width publications/experience; a
royal-blue-on-warm-neutral light palette with a warm brass accent in dark; tidied About
(aligned icon contacts + blockquote); and a View-Transitions theme-flash fix (re-apply
theme in `astro:after-swap`). Files: `Base.astro`, `global.css`, `index.astro`,
`publications.astro`, `experience.astro`, new `about.astro`, `NoteArticle.astro`,
`NotesIndex.astro`, new `404.astro`, `public/favicon.svg`, `astro.config.mjs`.

---

## Increment 4 — Cleanup + discoverability

Paste the prompt below to Codex.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md and CONTENT_AGENT.md. Increments 1-3
are done and approved — the site now has a content-first top-nav layout, a royal-blue /
warm-brass theme, an /about page, and a notes system with View Transitions. Hard rules:
do not change content, copy, or note bodies; no new facts or translations; do not break
any URLs, the bilingual system, or the demos; keep withBase(); keep the current identity
and palette tokens; mobile-first; ship minimal JS; respect prefers-reduced-motion; AA
contrast in both themes; no theme flash on navigation.

Part A — cleanup (do first):
1. Give every page exactly one <h1>. Today only the homepage has an h1; publications,
   experience, about, /notes, and note pages lead with <h2>. Promote each page's main
   heading to <h1> and style it to match the current look, without changing wording.
2. Remove dead code from earlier iterations: the now-unused src/components/Sidebar.astro,
   and the superseded centered-header CSS in global.css that the top-nav rules override
   (old `header.site-header` centered block, `.site-header-inner`, `.header-tools`,
   `.brand a` sizing, and the first mobile-drawer block). Verify nothing references them
   before deleting; keep the visual result identical.
3. Confirm View-Transitions theme persistence (no dark->light flash on navigation) still
   works after cleanup.

Part B — discoverability:
4. Add @astrojs/sitemap → sitemap at build.
5. Add RSS: /rss.xml for notes (from the content collection); a news feed from
   src/data/content.ts if practical. Link feeds in <head>.
6. Add Pagefind static full-text search over the built site: index at build, add an
   accessible, mobile-friendly search UI (on /notes and/or the header).
7. Add Open Graph / Twitter meta per page (title, description, url, site_name) + a default
   OG image. Use the existing Base description prop; do not invent biography text.

Verify locally (no deploy): npm run build passes; sitemap.xml and rss.xml generate;
search returns results for "flow matching"; OG tags present in page source; every page has
exactly one h1; light + dark correct with no theme flash on navigation; all existing URLs
(note slugs, legacy notes.html?..., six demo URLs) still resolve; mobile ~380px clean.
Capture screenshots and report build status + what you added. Do NOT push or deploy.
```

---

## Pre-deploy tweak — collapsible note listings

A small presentation fix requested before deploy: make the note listings collapse by
category/group and expand on click. Paste the prompt below to Codex.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md and CONTENT_AGENT.md. Hard rules: do
not change content, copy, or note bodies; no new facts/translations; do not break URLs,
the bilingual system, demos, Pagefind search, or View-Transitions theme persistence; keep
withBase(); keep the current royal-blue / warm-brass palette and tokens; mobile-first;
accessible; respect prefers-reduced-motion.

Goal: make the note listings collapsible — grouped and compact by default, expanding on
click — in two places.

1. Home (src/pages/index.astro), the "Writing" section. Today it lists every note as a
   row. Change it to group by CATEGORY (Research Areas / Academic Skills). Render each
   category as a native <details> (collapsed by default). The <summary> shows the category
   label plus a meta line: "{N} notes · Updated {most-recent `updated` date in that
   category}". When expanded, show the existing writing-row entries for that category,
   unchanged (keep the missing-EN → link-to-中文 behavior, dates, and badges). Keep the
   "Writing" section header and its "All writing →" link.

2. Writing page (src/components/NotesIndex.astro, used by /notes and /zh/notes). Keep the
   category headings (Research Areas / Academic Skills), but make each GROUP (e.g. Flow
   Matching, Paper Writing) a native <details> collapsed by default. The <summary> shows
   the group name plus "{N} · Updated {latest}". When expanded, show the existing note
   cards unchanged (including the "Available in 中文" missing-language handling). Keep the
   Pagefind search box above the list.

Implementation:
- Use native <details>/<summary> (accessible, keyboard-operable, no-JS, View-Transitions
  safe). Do NOT build a custom JS accordion.
- Style <summary>: remove the default disclosure triangle; add a custom chevron (inline
  SVG) that rotates 90deg when open, in the accent color; cursor pointer; hover state;
  visible :focus-visible ring. Collapsed by default on both pages.
- Subtle reveal animation on open (fade + small translate on the inner content), disabled
  under prefers-reduced-motion; degrade to instant if the browser can't animate <details>.
- Compute "latest updated" per category/group from the notes' `updated` field, formatted
  with the existing formatNoteDate; add a small helper in src/lib/notes.ts if useful.
- Theme-aware via existing CSS tokens (add styles to global.css). Do not change note
  slugs, routes, the search index, or any other page.

Verify locally (no deploy): npm run build passes; Home shows collapsed category rows with
correct counts + latest dates, expanding reveals the notes; /notes and /zh/notes groups
collapse/expand and search still works; keyboard (Tab + Enter/Space) toggles the
disclosures; reduced-motion disables animation; light + dark both correct with no theme
flash; all existing URLs/demos still resolve. Capture before/after screenshots (Home +
/notes, light + dark, desktop + ~380px mobile). Do NOT push or deploy.
```

---

## Increment 5 — Deployment (approved)

Paste the prompt below to Codex. This is the cutover: Codex IS authorized to push for
this task. A custom workflow is used (not withastro/action) so the full `npm run build`
runs — including the Pagefind index and sitemap alias.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website. This
task DEPLOYS the site to GitHub Pages — you ARE authorized to commit and push to `main`
for THIS task only. Follow AGENT.md. Do not change site content, copy, note bodies, the
palette, URLs, or behavior — this is deploy plumbing only.

Context: the Astro app lives in the site/ subfolder. Its build script is `npm run build`,
which runs `astro build`, then scripts/write-sitemap-alias.mjs, then Pagefind (so the
search index is generated). It is a GitHub Pages PROJECT site served at
https://shihhsinwang0214.github.io/personal_website/ with base path /personal_website
(already set in astro.config.mjs).

Do this:
1. Ensure everything needed is committed: the whole site/ folder (src/, public/, scripts/,
   package.json, package-lock.json, astro.config.mjs) and docs/. Confirm site/package-lock.json
   is committed and in sync so `npm ci` works.
2. Create .github/workflows/deploy.yml at the REPO ROOT with exactly this content:

name: Deploy site to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: site
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: site/package-lock.json
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4

3. Run `cd site && npm ci && npm run build` once more to confirm a clean build produces
   site/dist with index.html, the note pages, sitemap.xml, rss.xml, news.xml, and a
   dist/pagefind/ folder.
4. Commit and PUSH to main.
5. Report: confirm the push, the Actions run status (link if possible), and the manual
   owner step below. Do NOT change repo settings yourself.

Owner manual step (report to the owner; do not do it yourself): GitHub > Settings > Pages
> Build and deployment > Source = "GitHub Actions". That switch is the cutover. The first
successful run then publishes site/dist to the URL above. If the deploy step fails because
Pages isn't set to GitHub Actions yet, re-run the workflow after the owner flips it.

After it is live, verify and report: home, /publications, /experience, /about, /notes
(with search), a zh note page, the legacy notes.html?cat=themes&id=0 redirect, the six
flow-matching demo URLs, /sitemap.xml and /rss.xml all load under the /personal_website
base; dark mode works with no theme flash on navigation. Do NOT delete the old root files
yet — that is the separate Increment 6 cleanup once the owner confirms the new site is
live and correct.
```

## Increment 6 — Cleanup (later; only after cutover is confirmed)

Remove the old root shell files and the `legacy/` backup once the new site is confirmed
live and correct.

---

## Maintenance task — Pagefind: flow-matching notes are missing from site search

Filed by the content agent (2026-06-27). Infrastructure / search-indexing issue — owned
by the maintenance agent per AGENT.md. The note bodies are correct; do NOT touch content.

Symptom: the latest build's Pagefind log reads `Found 99 files ... Indexed 71 pages` —
28 rendered HTML pages carry no `data-pagefind-body` and are silently excluded from
search. Two of them are real, published zh articles, so those notes are unsearchable.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy (the owner approves deploys separately). Follow
AGENT.md. Hard rules: do not change content, copy, or note bodies; no new facts or
translations; do not break any URLs, the bilingual (zh+en) system, the demos,
View-Transitions theme persistence, or existing Pagefind behaviour; keep withBase();
mobile-first; AA contrast in both themes.

Bug: Pagefind indexes fewer pages than the build renders — "Found 99 files ...
Indexed 71 pages". 28 HTML pages lack `data-pagefind-body` and are excluded.

Diagnosis already done by the content agent (trust, but verify):
- 24 of the 28 are EXPECTED exclusions and must stay excluded: the standalone
  interactive demo HTML pages under notes/research_areas/{noise-to-data,flow-matching,
  invariance-and-equivariance,math-intuitions,diffusion-flow-course}/*.html, plus the
  notes.html listing page.
- The other 4 are real Astro-rendered NOTE routes that should be searchable but are not:
    dist/zh/notes/flow-matching-flow-ode/index.html   (zh, status available — real content; BUG)
    dist/zh/notes/flow-matching-training/index.html   (zh, status available — real content; BUG)
    dist/notes/flow-matching-flow-ode/index.html       (en, status missing — coming-soon)
    dist/notes/flow-matching-training/index.html       (en, status missing — coming-soon)
- Key comparison: the From-Noise-to-Data notes ARE indexed (e.g.
  dist/zh/notes/n2d-denoising/index.html), and even the n2d EN "Content Coming Soon"
  stubs are indexed. So the n2d render path emits `data-pagefind-body` and the
  flow-matching render path does not.

Likely root cause (confirm, don't assume): the Series B flow-matching notes
(slugs flow-matching-flow-ode, flow-matching-training; sources
notes/research_areas/flow-matching/story-zh.md and training-zh.md) are `.md` and were
migrated in Increment 2, before the n2d `.mdx` notes existed. They may render through a
different layout/wrapper, or `data-pagefind-body` may be applied conditionally
(e.g. only on .mdx, or only for certain groups/status).

Do this:
1. Find where `data-pagefind-body` is emitted (search src/ — likely the note article
   template / NoteArticle.astro) and trace exactly why the flow-matching note route
   omits it while the n2d route includes it. Report the root cause.
2. Fix so every real ARTICLE body carries `data-pagefind-body` regardless of .md vs
   .mdx, group, or language. The two zh flow-matching notes MUST become searchable.
   Apply the same rule the n2d notes already follow; do not special-case individual slugs.
3. Handle the en coming-soon (missing-translation) pages consistently with how the n2d
   EN coming-soon pages are already treated (currently indexed) — match that behaviour;
   note in your report what you chose.
4. Leave the standalone demo HTML pages and notes.html excluded as today.

Verify (local, no deploy): `npm run build`; the Pagefind "Indexed N pages" count rises
to include the two zh flow-matching notes; `grep -rl data-pagefind-body dist
--include='*.html'` now lists dist/zh/notes/flow-matching-flow-ode/index.html and
dist/zh/notes/flow-matching-training/index.html; a search for "flow matching" and for a
zh-only term from those notes returns them; all existing URLs, the six demo URLs, the
legacy notes.html?cat=&id= redirects, both themes, and View-Transitions theme
persistence still work. Capture the before/after Pagefind "Indexed N pages" line and
report root cause + the fix. Do NOT push or deploy.
```

---

## Maintenance task — n2d restructure Batch 1: register `n2d-overview`, re-order `n2d-why-gaussian`

Filed by the content agent (2026-06-27). Content is done (new intro note written; why-gaussian
relabelled as advanced/optional). This task is the ordering/registration half, which is
routing and belongs to the maintenance agent. Plan context: `docs/n2d-restructure-plan.md`
(Batch 1). Do NOT edit note bodies.

New/changed content files (already in the repo):
- `from-noise-to-data/n2d-overview.zh.mdx` (status available) + `n2d-overview.en.md` (status missing) — a new intro note.
- `from-noise-to-data/n2d-why-gaussian.zh.mdx` — body unchanged in substance; reframed as advanced/optional reading.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy (owner approves deploys separately). Follow AGENT.md.
Hard rules: do not change note bodies, copy, facts, or translations; do not break URLs,
the bilingual (zh+en) system, demos, Pagefind, or View-Transitions theme persistence;
keep withBase(); slugs are stable (never reuse/rename).

Goal: update only the note ordering/registration in src/lib/notes.ts so the new From
Noise to Data intro renders first and the "why Gaussian" note moves to the end of the
series.

Do this:
1. In src/lib/notes.ts `noteSlugList`, register the new slug `n2d-overview` as the FIRST
   From-Noise-to-Data entry (before `n2d-what-models-learn`).
2. Move `n2d-why-gaussian` from its current 2nd position to the END of the From-Noise-to-
   Data block — immediately after `n2d-three-languages` and before `n2d-review` (or after
   `n2d-review` if you prefer the review to stay strictly last; pick one and note it). It is
   now advanced/optional reading.
3. Resulting From-Noise-to-Data order:
   n2d-overview, n2d-what-models-learn, n2d-samples-as-particles, n2d-vector-field,
   n2d-probability-path, n2d-continuity-equation, n2d-denoising, n2d-score-function,
   n2d-velocity-regression, n2d-conditional-to-marginal, n2d-diffusion-fm-core,
   n2d-probability-flow-ode, n2d-sampling-as-integration, n2d-path-design,
   n2d-rectified-flow, n2d-optimal-transport, n2d-three-languages, n2d-why-gaussian,
   n2d-review.
4. Confirm prev/next links, the /notes index, and the home "Writing" listing pick up the
   new order, and that `n2d-overview` (zh) renders with its embedded demo iframe.

NOT in scope (a later phase, do not do now): migrating why-gaussian's content into a dfc
note and adding a redirect `n2d-why-gaussian` → the dfc slug. That waits until the dfc
interpolant/EDM note exists.

Verify (local, no deploy): `npm run build` passes; /zh/notes/n2d-overview renders (intro +
demo + two quizzes); the series order above is reflected on /notes, /zh/notes, the home
Writing section, and in prev/next; why-gaussian now sits at the end; all existing URLs and
the six demo URLs still resolve. Report build status and the final order. Do NOT push or
deploy.
```

---

## Task — n2d-overview: reorder the bridge (Data → Euclidean space → particle → distribution) + add a density figure

Filed by the content agent (2026-06-27), per the author's review of the new intro note.
Touches ONE file's body plus ONE new figure asset. The Chinese prose below is **final,
authored by the content agent — place it verbatim; do not reword, summarize, or translate**.
Do not invent any claim. The cat / noise pictures in the figure are **illustrative
placeholders, not model output** — label them as such.

Two changes to `site/src/content/notes/research-areas/from-noise-to-data/n2d-overview.zh.mdx`:
(1) re-order the conceptual on-ramp so the reader goes Data → "put it in a Euclidean space"
(a sample is a point = a particle) → distribution explained via density; (2) add a new
conceptual figure that *shows* the density idea (dense = looks like a cat, empty = not).
Plus a one-line reframe of the existing demo (the 2-D target shape is deliberately chosen).

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy (owner approves deploys separately). Follow AGENT.md and
CONTENT_AGENT.md. Hard rules: do NOT reword/translate the Chinese prose given below (place
it verbatim); do NOT invent facts; do not touch any other note, the en stub, the iframe
URL, the bilingual system, or the demos; keep withBase(); mobile-first; AA contrast in BOTH
light and dark themes; respect prefers-reduced-motion (this figure is static, no motion).

PART 1 — Reorder the prose.
In site/src/content/notes/research-areas/from-noise-to-data/n2d-overview.zh.mdx, replace the
entire block that currently starts at the heading `## 先換個角度：你手上其實只有一堆點`
and ends at the demo <iframe ...></iframe> line, with EXACTLY this (verbatim):

--- BEGIN REPLACEMENT ---
## 先換個角度：你手上其實只有一堆資料

一張圖、一段聲音、一個分子，攤平之後都只是**一長串數字**。一張 28×28 的灰階圖就是 784 個數字；一張彩色照片是「寬 × 高 × 3」個數字。先記住這件事：手上的每一筆 data，都能寫成一長串數字。

## 把資料放進一個空間

把那一長串數字的每一個，當成一根座標軸上的值，這筆資料就成了一組座標——也就是一個 **Euclidean space**（我們日常熟悉、有「遠近」和「距離」概念的那種空間）$\mathbb{R}^n$ 裡的**一個點**，其中 $n$ 就是數字的個數。

這個空間的「距離」是有意義的：兩張很像的貓照片會落在附近，貓和卡車則離得很遠。既然每一筆資料都是空間裡的一個點，我們之後乾脆把它當成一顆可以**移動**的點——一顆 **particle**。一整張圖＝一顆 particle（一個高維點），一群圖＝一團 particle 雲。用 2D 來畫只是為了看得見，真實維度高得多。

## 看不見的那一層：哪裡密、哪裡稀

把一大堆真實資料的點都丟進這個空間，它們不會均勻散開，而是**擠成幾團**。「像貓」的地方點很密，「不像貓」的地方幾乎沒有點。這個「哪裡密、哪裡稀」的規律，就是那個你看不見、卻真實存在的 **distribution**，記成 $p_{\text{data}}$。

![示意圖：一個 multimodal 的資料分布，密集處的點對應到清楚的貓、空白處對應到不像任何東西的雜訊。](./n2d-overview-density.svg)

**圖：哪裡密、哪裡稀。** 點擠成幾團（modes）的地方密度高，對應到「像真實資料」的樣本（清楚的貓）；團與團之間幾乎沒有點的空白處，對應到「不像任何真實資料」的東西（一團雜訊）。這張圖是**示意圖**，貓與雜訊都是手繪示意，不是模型實際輸出。

> 一句話：data 是你看得到的幾顆點，distribution 是這些點背後那一整團雲的**密度**——哪裡濃、哪裡淡。

生成模型真正想學的，不是把那幾顆點背起來，而是學會這團雲哪裡濃、哪裡淡——這樣它才能在「濃」的地方，產生**新的、沒看過、但合理**的點。（想分清「density」和「機率」？可以看 [機率密度是什麼](/personal_website/zh/notes/math-density-vs-probability)。）

## 把三個詞接成一句話

data（你有的點）、空間裡的 particle（把點當成會動的東西）、distribution（整團點的密度）——接起來就是整個系列的核心圖像：

> **生成 = 拿一團「容易做出來的點」，把它們慢慢搬動，直到整團的密度和 data 一樣。** 搬動 particle，就是在改變 distribution 的形狀。

那團「容易做出來的點」，慣例上用一團 **Gaussian noise**——你可以先把它當成「一團毫無結構、好製造的圓形點雲」。（為什麼起點偏偏挑 Gaussian？先當它是個方便的選擇就好；真正的理由牽涉到比較深的數學，留到願意深入時再談。）

下面的 demo 就是這張圖在動：拖時間 $t$，看一團圓形點雲被搬成不同的目標形狀。**但要提醒一件事**：這裡的目標形狀（月牙、螺旋那種）是我們**特意挑來、方便你看的**——真實資料活在好幾萬維的空間裡，分布的形狀根本沒辦法這樣畫出來，也不會長得這麼乾淨。這個 2D 例子唯一的目的，是讓「搬動一團點、改變整團密度」這件事**看得見**。

<iframe src="/personal_website/notes/research_areas/noise-to-data/noise-to-data.html" class="demo-frame" title="Noise to Data 互動 demo" style="height: 760px; width: 100%; border: none;"></iframe>
--- END REPLACEMENT ---

Leave everything before that block (frontmatter, import, title, intro paragraph) and
everything after it (## 同一件事，兩副鏡頭, the two <Quiz> blocks, ## 這條路會怎麼走,
## 下一步) UNCHANGED. Bump frontmatter `updated` to the date you do this.

PART 2 — Build the figure `n2d-overview-density.svg`.
Create site/src/content/notes/research-areas/from-noise-to-data/n2d-overview-density.svg,
referenced by the ![](./n2d-overview-density.svg) line above. It is a single static,
conceptual diagram (Olah/Distill style, minimal). Requirements:
- A 2-D panel showing a MULTIMODAL distribution: 2–3 soft "blobs"/modes drawn as filled
  density contours (denser fill = higher density), using the site accent color at low
  opacity. Transparent background.
- Scatter ~30–50 small dots: concentrated inside the modes, almost none in the gaps.
- Three callouts with thin leader lines to small framed thumbnails:
    (a) deep inside a mode → a clean, recognizable cat (simple SVG line-art cat face);
        label 「密集處：像貓」.
    (b) at a mode's low-density edge → a rougher / half-formed cat; label 「邊緣：勉強像」.
    (c) in an empty gap between modes → a scrambled-noise swatch (small grid of random
        grey squares) or a nonsense blob; label 「空白處：不像任何真實資料」.
- The cat drawings and the noise swatch are hand-drawn ILLUSTRATIONS, not generated images
  (the caption already says 示意圖 — keep it honest).
- Accessibility: include <title> and <desc>; the alt text is already in the markdown.
- Responsive: viewBox + width:100%, height auto; legible down to ~360px wide.
- THEME: an SVG referenced via ![]/<img> is isolated, so the site's data-theme toggle will
  NOT reach it. Make the figure self-contained and readable in BOTH light and dark — use a
  transparent background and mid-tone colours + the brand accents (royal-blue / warm-brass),
  avoid pure-white or pure-black fills/strokes and avoid relying on the page text colour. If
  you prefer true theme reactivity, you MAY instead inline the <svg> directly in the .mdx
  (then page CSS variables apply) and drop the external file + ![] line — your call; if you
  inline it, keep the same caption paragraph.

Verify (local, no deploy): `npm run build` passes; /zh/notes/n2d-overview renders with the
new section order (Data → 空間/particle → 密度 distribution), the figure visible between the
density heading and the "一句話" blockquote, the demo caption about the deliberately-chosen
shape present, and the two quizzes + later sections unchanged; the figure is legible in BOTH
light and dark and down to ~360px; all existing URLs and the six demo URLs still resolve.
Report build status and attach light+dark screenshots of the figure. Do NOT push or deploy.
```

---

## Task — n2d rebuild Batch B: relocate 8 deep notes to the dfc course (regroup + reorder)

Filed by the content agent (2026-06-27), per the author's decision. Plan: `docs/n2d-rebuild-blueprint.md`.
n2d is being rebuilt as an 11-note beginner course; 8 deeper notes move OUT of it into the
dfc course as **draft seeds** (to be deepened later). Approach chosen by the author:
**regroup + set status draft — do NOT delete, do NOT rename slugs, no redirects.**

This SUPERSEDES the earlier instruction (in the "n2d-overview: reorder the bridge" task /
the Batch 1 reorder) to keep `n2d-why-gaussian` at the end of the n2d block — why-gaussian
now leaves n2d entirely and joins the dfc draft block.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md. Hard rules: do NOT delete files; do NOT
rename or reuse slugs (so no redirects are needed); do not change note BODIES (prose stays
as-is for now — a later content pass cleans cross-links); keep withBase(); bilingual system
intact; build must stay green; Pagefind must still index the moved notes.

These 8 notes move from the "From Noise to Data" course to the "Diffusion & Flow Models"
(dfc) course as drafts:
  n2d-continuity-equation, n2d-conditional-to-marginal, n2d-diffusion-fm-core,
  n2d-probability-flow-ode, n2d-path-design, n2d-rectified-flow, n2d-optimal-transport,
  n2d-why-gaussian.

Do this:
1. Frontmatter (both languages of each of the 8 notes):
   - set `group: "Diffusion & Flow Models"` (currently "From Noise to Data");
   - on the zh file set `status: "draft"` (currently "available"); leave the en stub
     `status: "missing"`;
   - bump `updated` to today.
   Keep slug, title, summary, demos, references unchanged.
2. In src/lib/notes.ts `noteSlugList`, the From-Noise-to-Data block becomes EXACTLY this
   11-note order (and nothing else):
     n2d-overview, n2d-what-models-learn, n2d-samples-as-particles, n2d-vector-field,
     n2d-probability-path, n2d-denoising, n2d-score-function, n2d-velocity-regression,
     n2d-sampling-as-integration, n2d-three-languages, n2d-review.
   Move the 8 relocated slugs into the dfc block (after the existing dfc-principles-* notes).
   Suggested dfc draft order (adjust if the index reads better): n2d-continuity-equation,
   n2d-probability-flow-ode, n2d-conditional-to-marginal, n2d-diffusion-fm-core,
   n2d-path-design, n2d-rectified-flow, n2d-optimal-transport, n2d-why-gaussian.
3. Confirm the home "Writing" listing, the /notes and /zh/notes index, and prev/next now
   show an 11-note From Noise to Data course and a Diffusion & Flow Models group that
   includes the 8 drafts.

Notes / caveats:
- The 8 relocated bodies still contain n2d-style framing ("系列第 N 篇", prev/next prose,
  cross-links between them). That cleanup is a later CONTENT pass — not your job here; just
  don't break the links (slugs are unchanged, so they still resolve).
- If `status: "draft"` hides a page from the live build, that's acceptable (these are
  seeds); confirm the files remain in the repo and report how draft pages are rendered
  (hidden vs shown-with-badge) so the content agent can plan the deepening pass.

Verify (local, no deploy): `npm run build` passes; From Noise to Data shows exactly the 11
core notes in the order above; the 8 notes appear under Diffusion & Flow Models (as drafts);
no slug 404s; Pagefind still indexes the moved notes (or, if draft hides them, note that);
all six demo URLs and the legacy redirects still resolve. Report build status, how draft
renders, and the final noteSlugList. Do NOT push or deploy.
```

---

## Task — n2d core sweep: drop hard "第 N 篇" numbers + fix links that point at relocated notes

Filed by the content agent (2026-06-27). After Batch B, the 11 surviving core notes still
carry pre-move artifacts: hard chapter numbers that are now wrong, and forward/cross-links
that point at the 8 notes which moved to the dfc course. This is a mechanical sweep —
numbering + link targets + minimal connective wording only. **Do not rewrite substance, do
not touch the math, the quizzes, or the demos.** (The content agent has already fixed the
links/intuition inside `n2d-velocity-regression`, `n2d-three-languages`, and `n2d-review`;
this sweep still needs to remove their stale chapter numbers and clean the other 8 notes.)

Canonical From-Noise-to-Data order (use this to compute the correct "next"):
1 n2d-overview · 2 n2d-what-models-learn · 3 n2d-samples-as-particles · 4 n2d-vector-field ·
5 n2d-probability-path · 6 n2d-denoising · 7 n2d-score-function · 8 n2d-velocity-regression ·
9 n2d-sampling-as-integration · 10 n2d-three-languages · 11 n2d-review.

Relocated to the dfc course (a link to any of these from a core note is "dangling"):
n2d-continuity-equation, n2d-conditional-to-marginal, n2d-diffusion-fm-core,
n2d-probability-flow-ode, n2d-path-design, n2d-rectified-flow, n2d-optimal-transport,
n2d-why-gaussian.

```
You are working in the LOCAL clone of github.com/shihhsinwang0214/personal_website.
Local-only: do not push or deploy. Follow AGENT.md and CONTENT_AGENT.md. Hard rules: do not
change the meaning of any sentence, any math, any <Quiz>, any demo, or any frontmatter
except `updated`. Only adjust chapter-number wording and link targets as specified. Keep
slugs stable. Build must stay green.

Scope: the 11 core .mdx files listed above (zh), in
site/src/content/notes/research-areas/from-noise-to-data/.

RULE 1 — remove hard chapter numbers.
Find phrases like 「系列第 N 篇」/「第 N 篇」 (e.g. 第 1、第 4、第 5、第 7、第 8、第 9、第 13、
第 17 篇) in the opening blockquotes and inline.
- In an opening blockquote, drop the ordinal but KEEP any role word: e.g.
  「『From Noise to Data』系列第 17 篇，也是收尾。」 → 「『From Noise to Data』系列的收尾。」;
  「系列第 1 篇。…」 → 「系列的開場。…」 (keep the rest of the sentence).
- For an INLINE reference to another note by number (e.g. velocity 的「第 3、4 篇」、「第 4 篇的向量場」),
  replace the number with that note's name/link instead, e.g. 「[向量場](/personal_website/zh/notes/n2d-vector-field)」.
Do not invent new numbers; once removed, the course reads by prev/next, not ordinals.

RULE 2 — fix links that point at relocated notes.
In each core note, find every markdown link whose target slug is in the relocated list
above. For each:
- If it is the note's "下一步 / 下一篇" pointer, REPOINT it to the correct NEXT core note
  per the canonical order. Known cases to fix:
    * n2d-what-models-learn 下一步 currently → n2d-why-gaussian; change to
      [跟著一顆粒子走](/personal_website/zh/notes/n2d-samples-as-particles).
    * n2d-probability-path 下一步 currently → n2d-continuity-equation; change to
      [Denoising](/personal_website/zh/notes/n2d-denoising).
    * n2d-sampling-as-integration 下一步 currently → n2d-path-design; change to
      [三種語言](/personal_website/zh/notes/n2d-three-languages).
    * n2d-vector-field 下一步 should point to
      [Probability Path](/personal_website/zh/notes/n2d-probability-path) — verify/fix.
  Reword the surrounding sentence only as much as needed so it reads naturally (the next
  topic changed).
- If it is an in-body "deeper / further reading" mention (NOT the main next-step), repoint
  it to the dfc course [Diffusion & Flow Models 課程](/personal_website/zh/notes/dfc-principles-course-map)
  and change wording like 「下一篇…那篇」 → 「更深入時（在 dfc 課程）」. Known cases:
    * n2d-samples-as-particles: 「精確關係留到 continuity equation 那篇」.
    * n2d-probability-path: the 「Path Design / Rectified Flow … 門把」 sentence.
    * n2d-vector-field: any rectified-flow / CNF cross-link in 「這怎麼接到論文」.
Then bump each edited file's frontmatter `updated` to today.

Also grep to be safe: `grep -rn "n2d-\(continuity-equation\|conditional-to-marginal\|diffusion-fm-core\|probability-flow-ode\|path-design\|rectified-flow\|optimal-transport\|why-gaussian\)" ` over the 11 core files — every hit is a link to triage by the rules above.

Verify (local, no deploy): `npm run build` passes; no core note contains 「第 N 篇」 hard
numbers; every core note's 下一步 lands on another note INSIDE the 11-note core (no core
note sends the reader into a dfc draft as its "next"); remaining links to relocated topics
go to the dfc course page, not to a dead "下一篇"; no 404s; demos unchanged. Report which
files changed and paste each note's final 下一步 target. Do NOT push or deploy.
```

