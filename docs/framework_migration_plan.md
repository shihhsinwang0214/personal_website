# Framework Migration Plan

Status: approved direction (Astro, mobile-first, backup-first incremental migration).
This plan is executed by the maintenance agent under `AGENT.md`. It does not author note
content; note authorship belongs to the content agent (`CONTENT_AGENT.md`).

## Decision

* **Framework:** Astro. Static output, mobile-first responsive HTML, typed content
  collections (the metadata contract from `CONTENT_AGENT.md`), real per-page URLs,
  built-in i18n, and interactive demos as components instead of iframes.
* **Hosting:** GitHub Pages project site `shihhsinwang0214/personal_website`
  → served at `https://shihhsinwang0214.github.io/personal_website/`.
  Base path stays `/personal_website`. Deploy switches from "branch root" to a
  GitHub Actions build **only at cutover**.
* **Safety model:** old site is preserved; the new site is built alongside it;
  nothing is deleted and deployment is not switched until explicit approval.
* **Direction:** long-term target and reference sites are in `WEBSITE_ROLE_MODELS.md`
  — Lilian Weng (deep notes) + Andrej Karpathy (research engineering) + Andrew Ng
  (educational accessibility), with Distill / Jay Alammar / Christopher Olah informing
  figures and interactive notes (Increments 2–3). Adapt strengths; do not copy any site.

## Repository Layout During Migration

```
/ (repo root)              -- current LIVE site, untouched until cutover
  index.html, notes.html, notes.css, notes.js, notes/, assets/, images/
  legacy/                  -- verbatim backup of the old shell (index/notes html/css/js)
  site/                    -- NEW Astro app (builds to site/dist/)
  docs/                    -- plans
  AGENT.md, CONTENT_AGENT.md
```

The live GitHub Pages deploy keeps serving the root files. `site/dist/` is the
cutover candidate, reviewed before it ever goes live.

## Target Information Architecture

Collapse the two app shells (`index.html` tabs + `notes.html` SPA) into one site
with real, deep-linkable pages:

```
/                     Home: profile + research directions + news + latest notes
/publications         real page (was a hidden tab)
/experience           real page (was a hidden tab)
/notes                notes index (Weng-style list, filter/search later)
/notes/<slug>         each note = its own permalink page (TOC, prev/next, demos inline)
/zh/...               bilingual routes via Astro i18n (real URLs, not localStorage)
sitemap.xml, rss.xml  generated
```

URL preservation:

* Legacy `notes.html?cat=...&id=...`, `?home=true`, and direct demo URLs under
  `notes/research_areas/flow-matching/*.html` must keep working. During transition
  the legacy notes portal is carried in `site/public/` unchanged; redirects/compat
  are added when notes move into Astro collections.
* Absolute `/personal_website/...` demo paths keep resolving because `base` is
  unchanged.

## Migration Increments (each gated by approval)

1. **Scaffold + Home/Publications/Experience** (this increment)
   * Astro project in `site/`, mobile-first layout, design tokens from the current
     palette, content extracted verbatim into a typed data layer.
   * Legacy notes portal + assets carried in `public/` so the build is a complete,
     clickable cutover candidate with no broken links.
   * Verify `npm run build`.
2. **Notes system in Astro**
   * Move notes into content collections with typed frontmatter (slug, language,
     title, category, status, updated, demos, references) — the `CONTENT_AGENT.md`
     contract. KaTeX math, code highlighting, per-note TOC, prev/next.
   * Demos become embedded components; keep legacy demo URLs as redirects.
   * Preserve `?cat=&id=` via compat handling.
3. **Experience & UI polish** (see `docs/design_spec.md`)
   * Premium feel while keeping the current identity: token system, dark mode,
     Astro View Transitions + prefetch, sticky/condensing header + accessible mobile
     drawer, note reading experience (scroll-spy TOC, progress, reading time,
     back-to-top, anchor copy), micro-interactions, accessibility, reduced-motion.
   * No content or URL changes; visual polish only.
4. **Discoverability + search**
   * `@astrojs/sitemap`, RSS for notes and news, Pagefind static search,
     Open Graph / social cards. (English-first reach is a content-agent priority.)
5. **Cutover**
   * Add GitHub Actions workflow to build `site/` and deploy to Pages.
   * Switch Pages source from branch-root to Actions.
   * Verify all preserved URLs in production.
6. **Cleanup (only after approval)**
   * Remove the old root shell files and `legacy/` backup once the new site is
     confirmed live and correct.

## Non-Negotiables (from AGENT.md / CONTENT_AGENT.md)

* No invented facts. Homepage/publication/experience content is copied verbatim from
  the existing site; the two empty 2026 publication links stay link-less until an
  authoritative URL exists.
* Bilingual notes system is preserved. The maintenance agent does not translate the
  homepage or notes; missing translations (e.g. a zh homepage, the English
  flow-matching notes) are left as content-agent tasks, not auto-generated.
* No deletion of live content without explicit approval (Increment 5).
* Visual output stays close to the current design unless a redesign is approved.

## Verify At Each Increment

* `npm run build` succeeds.
* Generated pages contain the expected content (no silent drops).
* Mobile layout: single-column, readable at ~380px width.
* All preserved URLs resolve.
* No broken internal links or missing assets.
