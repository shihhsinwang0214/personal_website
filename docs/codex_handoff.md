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
