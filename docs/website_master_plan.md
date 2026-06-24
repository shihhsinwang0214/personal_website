# Website Master Plan

## Current Architecture Overview

This repository is a static personal academic website with no build system, package manager, framework, or generated content pipeline. The current public surface is made from a small set of root files:

- `index.html`: the main academic profile site, including homepage, publications, experience, navigation, inline CSS, and inline JavaScript tab switching.
- `notes.html`: the notes portal shell.
- `notes.css`: shared styling for the notes portal and rendered markdown.
- `notes.js`: client-side note registry, language switching, note navigation, markdown fetching, markdown rendering, math rendering setup, and fallback handling.
- `notes/`: markdown note content plus standalone interactive HTML demos.
- `assets/`: CV and presentation/poster PDFs.
- `images/`: profile and background images.
- `AGENT.md`: repository operating policy and content integrity rules.

The website currently runs as plain static files. The browser loads `index.html` directly for the main page and `notes.html` for the notes system. The notes system then fetches markdown files at runtime and renders them in the browser using CDN-loaded libraries: Marked, marked-katex-extension, KaTeX, Prism, and, inside some demos, MathJax.

There is no separate data layer. Most structured content is embedded directly in HTML or JavaScript:

- Profile, biography, research directions, news, publications, experience, service, links, and visual styling are embedded in `index.html`.
- Notes metadata, category labels, bilingual titles, note paths, dashboard text, recent note updates, and fallback behavior are embedded in `notes.js` and `notes.html`.
- Interactive demo behavior, styling, canvas drawing logic, and explanatory text are embedded in standalone HTML files under `notes/research_areas/flow-matching/`.

The repository is currently best understood as a static content repository with a hand-built presentation layer.

## Current Content Inventory

Homepage content:

- Academic profile and contact information.
- Short biography.
- Research directions: geometric deep learning, generative models, and AI for Science.
- News and updates from March 2025 through May 2026.
- Publications grouped into machine learning, algebraic geometry, and other fields.
- Experience, invited talks, presentations, and academic service.

Notes content:

- `notes/academic_skills/write-intro-en.md`
- `notes/academic_skills/write-intro-zh.md`
- `notes/research_areas/flow-matching/story-zh.md`
- `notes/research_areas/flow-matching/training-zh.md`
- `notes/coming-soon-en.md`
- `notes/coming-soon-zh.md`

Interactive note demos:

- `notes/research_areas/flow-matching/story-sim-zh.html`
- `notes/research_areas/flow-matching/story-velocity-zh.html`
- `notes/research_areas/flow-matching/story-truncation-error-zh.html`
- `notes/research_areas/flow-matching/training-setting-zh.html`
- `notes/research_areas/flow-matching/training-stochastic-interpolants-zh.html`
- `notes/research_areas/flow-matching/training-follow-zh.html`

Binary assets:

- `assets/Shih-Hsin Wang's CV.pdf`
- `assets/ICLR25/ICLR_2025_oral_slides.pdf`
- `assets/ICLR25/ICLR_2025_oral_poster.pdf`
- `images/bg.jpg`
- `images/personal_photo.jpeg`
- `images/snowboard.jpg`

## Strengths Of The Current Design

The current design has several useful properties that should be preserved during modernization:

- It is simple to deploy. A static host can serve the repository without a build step.
- Content is readable in the repository. Markdown notes, PDFs, images, and standalone demos are easy to inspect.
- The main website has a compact information architecture: profile, publications, experience, notes, and CV.
- The notes system already supports bilingual note entries, categories, recent updates, math rendering, syntax highlighting, and interactive demos.
- The note policy in `AGENT.md` is compatible with a scalable knowledge base: notes are intentionally flexible and should not be forced into one rigid schema.
- Interactive demos are self-contained. This makes them portable and preserves educational value even before a more formal component system exists.
- URLs for assets and demos are mostly stable static file paths.

## Weaknesses Of The Current Design

The main weakness is not the static approach itself; it is the lack of separation between content, metadata, routing, and presentation.

Homepage issues:

- `index.html` mixes content, layout, styling, and tab behavior in one file.
- Publications are hand-authored HTML blocks with repeated structure.
- News entries are hand-authored HTML blocks rather than event records.
- Profile, contact, research directions, experience, talks, service, and footer metadata are all embedded directly in presentation markup.
- Empty publication links exist for two 2026 items via `href=""`. These should remain as factual placeholders unless authoritative URLs are added, but they should be represented explicitly as missing links in data instead of empty anchors.
- Inline styles appear throughout the homepage, making consistent visual changes harder.
- Tab navigation hides sections instead of creating direct section/page URLs. This makes deep-linking and search indexing weaker.

Notes system issues:

- `notes.js` is both the note database and the note application.
- Note ordering and direct links depend on array indexes, for example `notes.html?cat=themes&id=0`. These links become unstable if notes are reordered.
- English flow-matching note paths are registered in `notes.js` but the files are not present: `story-en.md` and `training-en.md`. The current fallback hides this from users by showing coming-soon content, but the repository has no explicit metadata state for missing translations.
- Fallback behavior mutates in-memory note titles by appending "Coming Soon!", which is a presentation side effect leaking into content state.
- Language labels, category labels, note titles, dashboard copy, and recent update text are all embedded in JavaScript.
- The notes homepage recent updates are manually duplicated content rather than generated from note metadata.
- Markdown files include absolute `/personal_website/...` iframe and full-screen links. This couples note content to one deployment base path.
- Interactive demos repeat CSS, JavaScript patterns, canvas helpers, MathJax loading, and layout conventions.
- CDN dependencies are loaded directly in `notes.html` and demo files, with no version governance beyond fixed URLs and no offline/local fallback.

Content organization issues:

- Content type boundaries are implicit. Publications, news, talks, service, profile data, notes, demos, and assets do not have separate metadata files.
- There is no canonical publication data source inside the repository beyond homepage markup.
- There is no canonical news/event data source beyond homepage markup.
- Notes have no frontmatter or sidecar metadata. This is compatible with flexible notes, but the site still needs minimal metadata for navigation, language, title, slug, category, status, and related demos.
- The repository has no generated indexes, search data, sitemap, RSS feed, or link manifest.
- There is no automated validation for missing files, empty links, broken links, duplicate note IDs, invalid dates, or deployment-base path assumptions.

## Notes System Analysis

The current notes system is a client-rendered single page application built from `notes.html`, `notes.css`, and `notes.js`.

Runtime flow:

1. `notes.html` loads CSS and external libraries.
2. `notes.js` configures Marked with KaTeX support.
3. `notes.js` reads the preferred language from `localStorage`.
4. `notesData` defines note categories, groups, bilingual titles, and markdown file paths.
5. The home dashboard tree is generated from `notesData`.
6. Category selection creates a sidebar list from `notesData`.
7. Note selection calls `fetch(filePath)`, parses markdown in the browser, injects HTML into the page, then runs Prism highlighting.
8. The URL is updated with query parameters using category and array index.
9. Missing markdown files fall back to `notes/coming-soon-{lang}.md`.

This architecture is effective for a small number of notes, but it will become fragile as the corpus grows.

Important current behavior to preserve:

- Notes may remain structurally flexible.
- Markdown rendering should continue to support math.
- Existing Chinese flow-matching notes and demos must remain accessible.
- Existing root entry point `notes.html` should remain.
- Existing query URLs should keep working whenever possible.
- Direct demo URLs under `notes/research_areas/flow-matching/` should remain valid.
- Missing translations should continue to produce a graceful coming-soon view.

Important future changes:

- Move note metadata out of `notes.js` into a data file or generated manifest.
- Use stable slugs in addition to legacy indexes.
- Add explicit translation status: `available`, `missing`, `draft`, or `coming-soon`.
- Keep flexible note bodies, but require minimal metadata for navigation and validation.
- Move base-path handling out of note markdown.
- Generate the home tree, sidebar, recent updates, and search index from the same manifest.
- Treat embedded demos as first-class assets with metadata, not ad hoc iframe strings.

## Content Organization Analysis

The repository currently organizes content by delivery mechanism rather than by content model.

Current model:

- Homepage content lives inside `index.html`.
- Note content lives in `notes/`.
- Note metadata lives inside `notes.js`.
- Notes styling lives in `notes.css`.
- Demo content, style, and behavior live inside standalone HTML files.
- PDFs and images live in `assets/` and `images/`.

Proposed model:

- Keep all existing content files.
- Add a structured content layer for records that are currently duplicated or embedded in markup.
- Use generated presentation files or build-time templates to render the same facts consistently.

Suggested future content organization:

```text
content/
  profile.json
  research-directions.json
  publications.json
  news.json
  experience.json
  talks.json
  service.json
  notes-manifest.json

notes/
  academic_skills/
  research_areas/

assets/
images/
scripts/
docs/
```

This is a target architecture, not a migration already performed. The first migration should preserve all current files and generate new outputs only after validation proves parity.

## Homepage Structure Analysis

The homepage is a single HTML page with three tabbed sections:

- `home`: biography, philosophy box, research directions, news.
- `publications`: publication list grouped by field.
- `experience`: recent experience, invited talks, presentations, and academic service.

The page also includes a sticky sidebar with profile photo, subtitle, contact links, and a quote.

The current homepage is clear for a compact academic profile, but the structure limits maintainability:

- Publications are repeated HTML blocks rather than records.
- News entries cannot be reused for RSS, archive pages, or structured metadata.
- The active tab state is not represented in the URL.
- Search engines and users cannot link directly to a specific publication or experience section.
- Styling is scoped only by convention because all homepage CSS is inline.
- There is no page-level metadata beyond title, charset, viewport, and external fonts.

The modernization should preserve the current visual and content hierarchy first, then extract data and routing incrementally.

## Maintainability Issues

High-priority maintainability issues:

- Hard-coded content in `index.html`.
- Hard-coded note metadata in `notes.js`.
- Missing registered note files for English flow-matching entries.
- Empty anchors for publications without authoritative URLs.
- Repeated inline styles.
- Query URLs based on array indexes.
- Deployment base path embedded in markdown.
- Repeated demo implementation patterns.
- No automated link checking.
- No build or validation command.
- No schema for minimal metadata integrity.
- No distinction between missing data, intentionally absent data, and coming-soon content.

Medium-priority maintainability issues:

- CDN dependency management is manual.
- Footer "Last Modified" depends on served file metadata, not content update metadata.
- The notes dashboard recent updates are hand-authored and can drift from actual note changes.
- Language switch state and note state are split across `localStorage` and `sessionStorage`.
- Notes and demos can use inconsistent layout, sizing, and responsive behavior.
- There is no central place to define colors, typography, spacing, or reusable UI patterns across homepage and notes.

## Long-Term Scalability Issues

The current architecture will scale poorly in these areas:

- More publications will make homepage editing error-prone.
- More notes will make `notesData` harder to maintain manually.
- More languages will make the current `{ en, zh }` structure too narrow.
- More demos will increase duplicated JavaScript, CSS, and CDN usage.
- More content sections will make a single `index.html` harder to review.
- More deployment targets will make hard-coded `/personal_website/` paths fragile.
- More pages will require generated navigation, sitemap, search, RSS, and link validation.
- More collaborators or automated agents will need schemas and validation to prevent accidental factual drift.

Scalability should be addressed with metadata extraction and validation before any visual redesign.

## Areas Where Content And Presentation Are Tightly Coupled

Current tight coupling:

- Homepage biography, publication records, news, experience, layout, styles, and tab behavior are all in `index.html`.
- Publication metadata is encoded as visual markup rather than structured records.
- News is encoded as visual timeline markup rather than event data.
- Notes category structure and note metadata are encoded in `notes.js`.
- Note home dashboard copy and recent updates are encoded in `notes.html` and `notes.js`.
- Note markdown contains deployment-specific iframe paths.
- Demo pages combine article-specific text, visual styling, drawing logic, and dependency loading.
- Inline event handlers such as `onclick` couple HTML structure to JavaScript function names.
- Inline styles in generated note tree items and fallback states couple UI details to application logic.
- Footer last-modified display is coupled to the browser's view of file metadata, not explicit content metadata.

Future separation:

- Content records should live in data files.
- Markdown should contain article content and only minimal embed declarations.
- Presentation components/templates should render structured data.
- Routing should use stable slugs.
- Validation should enforce metadata integrity without rewriting note bodies.
- Demo pages should either remain standalone with shared helper assets or be converted into reusable demo components after parity is verified.

## Modernization Opportunities

Near-term opportunities:

- Add a validation script that checks registered note paths, asset paths, empty links, duplicate IDs, invalid dates, and absolute `/personal_website/` assumptions.
- Create a `notes-manifest` data file and generate `notesData` from it.
- Add stable note slugs while preserving current `?cat=...&id=...` URLs.
- Add explicit missing-translation metadata for English flow-matching notes.
- Extract homepage data into structured JSON files without changing rendered content.
- Move homepage CSS from inline `<style>` into a dedicated stylesheet after visual parity is documented.
- Replace empty publication links with explicit `links: []` records in data, while rendering no link until an authoritative URL exists.
- Generate recent note updates from note metadata.
- Add a repository-wide link checker.
- Add sitemap and search-data generation.

Medium-term opportunities:

- Introduce a static site generator or a minimal custom build step.
- Generate homepage sections from content records.
- Generate note navigation, note home tree, search data, and RSS from the same source.
- Add structured metadata for publications, news, and notes.
- Add compatibility redirects or compatibility parsing for existing query URLs.
- Create shared demo styling and helper utilities.
- Add local vendored dependencies or controlled dependency pinning for markdown/math rendering.
- Add visual regression snapshots for homepage and notes.

Long-term opportunities:

- Create dedicated pages for publications, news archive, notes, and selected note slugs while keeping `index.html` and `notes.html` compatible.
- Add full-text note search.
- Add RSS feeds for notes and news.
- Add publication import/update tooling from authoritative sources, following the repository publication policy.
- Add CI checks for metadata integrity, link validity, build success, and route preservation.
- Add an asset manifest for PDFs, images, demos, and downloadable files.

## Proposed Future Architecture

The future architecture should keep the site static, content-first, and easy to deploy. A static site generator is appropriate, but the exact tool can be chosen later. The target should be a generated static website, not a server-rendered application.

Recommended architecture:

```text
Repository content
  Markdown notes
  Standalone demos
  Publication/news/profile JSON
  Images and PDFs

Validation layer
  Metadata schema checks
  Link checks
  Route preservation checks
  Missing translation checks
  Asset existence checks

Build layer
  Generate homepage HTML
  Generate notes manifest
  Generate search data
  Generate sitemap/RSS
  Copy static assets and demos

Presentation layer
  Templates/components
  Shared CSS tokens
  Homepage views
  Notes views
  Demo wrappers

Static output
  index.html
  notes.html
  preserved assets
  preserved demo URLs
  optional generated note pages
```

Content data should become the source for repeated presentation blocks:

- `profile`: name, display name, current factual status, contact links, CV path, images.
- `research-directions`: existing research direction labels and descriptions.
- `publications`: title, authors, venue/status, year, category, links, assets, notes.
- `news`: date, title/body, related publication or asset links.
- `experience`: roles, dates, organization, description.
- `talks`: event, date/year, title, location if already present.
- `service`: reviewer roles and venues.
- `notes`: category, group, title, language, slug, source path, status, updated date, related demos.

The notes system should move from index-based navigation to slug-based navigation while keeping compatibility:

- New preferred URL: `notes.html?note=flow-matching-story&lang=zh`
- Existing supported URL: `notes.html?cat=themes&id=0`
- Existing home URL: `notes.html?home=true`
- Existing direct demo URLs: unchanged.

The homepage can remain `index.html` to preserve the root URL. If future dedicated pages are added, they should be additive:

- `publications.html`
- `news.html`
- `notes.html`
- Optional generated note pages under stable paths.

No future architecture should require inventing new research directions, projects, affiliations, publications, awards, students, collaborators, or future plans.

## Migration Roadmap

The migration should be incremental and parity-driven.

### Phase 0: Baseline And Inventory

- Record all current public URLs.
- Record all current note registry entries.
- Record all assets and direct demo paths.
- Record current homepage sections and content blocks.
- Add a validation checklist but do not change rendering.
- Establish expected behavior for missing translations and empty publication links.

Exit criteria:

- A route inventory exists.
- A content inventory exists.
- Known gaps are documented as gaps, not silently rewritten.

### Phase 1: Validation Without Rendering Changes

- Add scripts to validate note paths, asset paths, empty links, duplicate route IDs, date formats, and absolute base-path assumptions.
- Validate that `notes.js` registered paths exist or are explicitly marked missing.
- Validate local demo paths referenced from markdown.
- Add a link checker for internal links.
- Add a build-free smoke check for syntax where practical.

Exit criteria:

- Validation can run locally.
- Existing missing English flow-matching files are reported as known missing translations.
- Existing empty publication links are reported as known missing authoritative URLs.

### Phase 2: Extract Metadata Without Changing URLs

- Extract homepage data into structured files.
- Extract note metadata into a manifest.
- Keep `index.html`, `notes.html`, and `notes.js` rendering behavior unchanged until generated output matches current output.
- Add explicit status fields for missing URLs and translations.
- Add stable slugs to notes and publications.

Exit criteria:

- Structured data can reproduce the current homepage and notes registry.
- No content is deleted.
- Existing URLs continue to work.

### Phase 3: Generate Navigation And Indexes

- Generate `notesData` from the notes manifest.
- Generate note tree/sidebar/recent updates from metadata.
- Generate search data for notes.
- Generate sitemap.
- Optionally generate RSS feeds for notes and news.

Exit criteria:

- Current notes navigation works.
- Legacy index query URLs work.
- Slug query URLs work.
- Search/index outputs are generated from the same source data.

### Phase 4: Separate Presentation From Content

- Move homepage CSS into a dedicated stylesheet.
- Replace repeated homepage HTML blocks with templates/components.
- Move inline event handlers into JavaScript modules or unobtrusive event listeners.
- Centralize design tokens shared by homepage and notes.
- Keep visual output intentionally close to the current design unless a separate redesign is approved.

Exit criteria:

- Homepage and notes render with the same content and same public URLs.
- Styling is centralized enough to support consistent future changes.
- There is no content loss.

### Phase 5: Static Build System

- Introduce a minimal static build pipeline.
- Generate `index.html` and `notes.html` from templates.
- Copy existing assets and demos unchanged.
- Preserve root-level output names.
- Add CI or local commands for validation and build.

Exit criteria:

- Static output can be deployed the same way as the current site.
- Existing asset and demo paths remain valid.
- Validation runs before build completion.

### Phase 6: Optional Enhancements

- Add dedicated publication and news archive pages.
- Add generated note pages with stable paths.
- Add full-text search.
- Add visual regression tests.
- Add publication metadata refresh tooling using only authoritative sources.
- Add RSS feeds and richer SEO metadata.

Exit criteria:

- Enhancements are additive.
- Existing homepage and notes URLs remain compatible.
- Any new factual content comes only from repository records, authoritative sources allowed by policy, or explicit user input.

## Risks And Tradeoffs

Preserving URLs vs improving routes:

- Existing note URLs use array indexes. Preserving them is important, but indexes are not stable long term.
- The safest path is to support both legacy index URLs and new slug URLs.

Static simplicity vs build pipeline:

- The current site is easy to deploy because there is no build step.
- A build pipeline improves maintainability and automation but adds tooling and failure modes.
- The build should remain minimal and produce plain static files.

Flexible notes vs metadata integrity:

- `AGENT.md` correctly says notes should not be forced into a fixed structure.
- The solution is minimal metadata, not rigid note templates.
- Validate navigation, rendering, links, references, and status; do not rewrite note bodies.

Standalone demos vs reusable components:

- Standalone demos preserve direct links and are easy to move.
- Shared components reduce duplication but risk breaking educational demos.
- Keep direct demo URLs stable and migrate internals only after visual and behavioral parity checks.

External CDNs vs local assets:

- CDNs are simple and reduce repository size.
- They introduce network dependency, version drift risk, and privacy/performance tradeoffs.
- A future build can pin, vendor, or bundle critical libraries if desired.

Authoritative publication metadata vs convenience:

- Structured publication data improves rendering and automation.
- Updates must still follow the publication policy in `AGENT.md`.
- Missing links should remain explicit missing data until authoritative URLs exist.

Visual modernization vs factual preservation:

- Redesign work can accidentally rewrite or omit content.
- Any visual modernization should start from extracted content parity and route preservation.

## Automation Opportunities

Validation automation:

- Internal link checker.
- External link checker with retry and allowlist behavior.
- Note manifest path checker.
- Asset existence checker.
- Empty anchor checker.
- Duplicate slug checker.
- Date format checker.
- Missing translation report.
- Absolute base-path report for `/personal_website/`.
- Markdown render smoke test.
- Demo iframe path checker.

Content generation automation:

- Generate note navigation from a manifest.
- Generate homepage publication sections from publication data.
- Generate news timeline from event data.
- Generate recent note updates from note metadata.
- Generate sitemap.
- Generate RSS feeds for notes and news.
- Generate search index for notes and publications.

Quality automation:

- HTML validation.
- Accessibility checks for generated pages.
- Visual regression snapshots for homepage and notes.
- JavaScript syntax checks.
- Broken image/PDF checks.
- Route preservation tests against the baseline URL inventory.

Publication automation:

- Add optional tooling to compare repository publication records against authoritative sources.
- Never auto-add publications or metadata without review.
- Report discrepancies as review items.

## Implementation Phases

Recommended execution order:

1. Create route and content inventory.
2. Add validation scripts that report current issues without changing content.
3. Extract notes metadata into a manifest while keeping `notes.js` behavior compatible.
4. Add stable note slugs and legacy URL compatibility.
5. Extract homepage content into structured data.
6. Generate homepage and notes navigation from structured data.
7. Add sitemap, search data, and optional RSS.
8. Move styles and event behavior out of inline HTML.
9. Introduce a static build pipeline only after data extraction is stable.
10. Add optional dedicated pages and visual improvements.

Do not start with a redesign. The first implementation work should be validation and metadata extraction because those reduce risk while preserving all current content and URLs.

## Non-Goals For The Modernization

- Do not invent new research directions.
- Do not invent new future affiliations.
- Do not invent new future projects.
- Do not invent publications, awards, students, collaborators, or future plans.
- Do not delete existing content without explicit approval.
- Do not rewrite note bodies unless specifically requested.
- Do not replace the notes system with a rigid note template.
- Do not break existing static asset or demo URLs.
- Do not perform a large migration without approval after review of the migration plan.

## Recommended First Approved Work After This Plan

If modernization is approved, the first concrete change should be a non-invasive validation layer:

- Add a script that reads `notes.js` or a temporary extracted manifest and reports missing note files.
- Report the two currently registered missing English flow-matching files.
- Report empty publication anchors.
- Report absolute `/personal_website/` paths.
- Report missing assets and broken internal links.
- Produce a route inventory file.

This gives the repository a safety net before any content extraction, redesign, or framework decision.
