# Astro Notes Migration

Status: Increment 2 local migration scaffold.

This document records the infrastructure choices for rendering the existing notes
inside the Astro app in `site/`. It is not an editorial plan and does not introduce
new note topics, translations, citations, or research directions.

## Source Strategy

The canonical legacy note sources remain at the repository root under `notes/`.
For Astro rendering, the current note bodies were copied unchanged into
`site/src/content/notes/` and wrapped with typed frontmatter matching the
`CONTENT_AGENT.md` handoff contract. The Astro copies are organized by
category/group so note families can grow without a flat content directory:

* `site/src/content/notes/research-areas/flow-matching/`
* `site/src/content/notes/research-areas/from-noise-to-data/`
* `site/src/content/notes/academic-skills/paper-writing/`

This copy-based strategy keeps the Astro app self-contained for static builds while
preserving the root `notes/` directory and the carried legacy portal in
`site/public/`. Future maintenance automation can resync body content from the root
sources, but content edits, translations, citations, and note-body changes remain
content-agent work.

Existing notes stay as `.md`. The content collection accepts both `.md` and `.mdx`
with `**/*.{md,mdx}`, but `.mdx` is reserved for future interactive notes. The
glob is recursive from `site/src/content/notes/`; public URLs continue to come
from frontmatter `slug` values, not the source file path. The current notes
contain raw HTML iframe embeds; renaming them to `.mdx` now would add unnecessary
risk.

## Stable Slugs

| Slug | Language status | Source body |
| --- | --- | --- |
| `flow-matching-flow-ode` | zh available, en missing | `notes/research_areas/flow-matching/story-zh.md`; EN uses `notes/coming-soon-en.md` |
| `flow-matching-training` | zh available, en missing | `notes/research_areas/flow-matching/training-zh.md`; EN uses `notes/coming-soon-en.md` |
| `writing-compelling-introduction` | en available, zh available | `notes/academic_skills/write-intro-en.md`, `notes/academic_skills/write-intro-zh.md` |

The English flow-matching pages are intentionally marked `missing`. No translation
was generated.

## Metadata Notes

The legacy notes portal records the visible update month as Apr 2026. The Astro
frontmatter uses `updated: 2026-04-01` as a normalized date so the collection can
use a typed date schema while still displaying month-level dates.

The `references` metadata arrays are currently empty because no structured
reference list was handed off. Existing reference sections inside note bodies are
preserved unchanged. If structured references are needed for SEO/search/RSS later,
the content agent should provide that metadata.

## URL Preservation

The new Astro routes are:

* `/notes`
* `/notes/<slug>`
* `/zh/notes`
* `/zh/notes/<slug>`

Under GitHub Pages these resolve below the configured base path
`/personal_website`.

The carried legacy portal remains available in `site/public/notes.html`. Its home
URL `notes.html?home=true` remains a fallback portal. The following compatibility
redirects were added for known legacy deep links:

| Legacy query | New slug |
| --- | --- |
| `?cat=themes&id=0` | `flow-matching-flow-ode` |
| `?cat=themes&id=1` | `flow-matching-training` |
| `?cat=skills&id=0` | `writing-compelling-introduction` |

During the transition, some static servers may prefer `notes.html` over
`notes/index.html` for the extensionless `/notes` request. The legacy file therefore
redirects only that extensionless `/notes` case to `/notes/`. Explicit
`notes.html?home=true` and unmatched legacy states continue to load the legacy
portal.

Standalone demo HTML files remain under
`site/public/notes/research_areas/flow-matching/` so existing demo URLs continue
to resolve.
