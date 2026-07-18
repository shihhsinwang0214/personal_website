# Lab Handbook — Design & Information Architecture

A documentation-style, bilingual (en + zh) section of the personal website that
documents the **culture, philosophy, and workflow** of the lab. It is a living
document for three audiences: prospective students, new members, and current
researchers (plus collaborators). Built on the same Astro + content-collection
stack as the notes, so it stays consistent and scalable.

Emphasis, by design: **research culture over rules; independent thinking over
task completion; curiosity, ownership, integrity, persistence; friendly but
professional.**

---

## 1. Information architecture (site map)

```
/handbook                         Landing (role-based entry points)
├── Joining the Lab
│   ├── /handbook/who-should-apply
│   ├── /handbook/what-i-look-for
│   ├── /handbook/application-process
│   └── /handbook/joining-faq
├── Getting Started
│   ├── /handbook/lab-philosophy
│   ├── /handbook/mentoring-philosophy
│   ├── /handbook/expectations
│   ├── /handbook/research-workflow
│   ├── /handbook/meeting-guide
│   ├── /handbook/ai-usage
│   └── /handbook/research-ethics
├── Research
│   ├── /handbook/reading-papers
│   ├── /handbook/finding-research-problems
│   ├── /handbook/running-experiments
│   ├── /handbook/writing-papers
│   ├── /handbook/giving-presentations
│   ├── /handbook/reviewing-papers
│   ├── /handbook/reproducibility
│   └── /handbook/open-source-and-code-quality
└── Policies & Collaboration
    ├── /handbook/authorship-policy
    ├── /handbook/communication
    ├── /handbook/feedback-culture
    ├── /handbook/collaboration-guidelines
    └── /handbook/data-management
```

Chinese mirror lives under `/zh/handbook/...` with identical slugs. Slugs are
flat (not nested under the section) so links stay short and never break when an
article moves between sections; the section grouping is metadata, not URL.

## 2. Landing page wireframe

```
┌──────────────────────────────────────────────────────────────┐
│  Lab Handbook                                    [EN | 中文]   │
│  A living guide to how we think, work, and grow together.      │
│  What this is · who it's for · how to use it (2–3 sentences)   │
├──────────────────────────────────────────────────────────────┤
│  "Start where you are" — 4 role cards (2×2 grid → 1 col mobile)│
│  ┌───────────────┐  ┌───────────────┐                         │
│  │ 🌱 Prospective │  │ 🎓 New Lab     │                        │
│  │    Student     │  │    Member      │                        │
│  │ Who should     │  │ Philosophy,    │                        │
│  │ apply, what I  │  │ expectations,  │                        │
│  │ look for →     │  │ workflow →     │                        │
│  └───────────────┘  └───────────────┘                         │
│  ┌───────────────┐  ┌───────────────┐                         │
│  │ 🔬 Current     │  │ 🤝 Collab &    │                        │
│  │    Researcher  │  │    Policies    │                        │
│  │ Reading, exp., │  │ Authorship,    │                        │
│  │ writing →      │  │ comms, data →  │                        │
│  └───────────────┘  └───────────────┘                         │
├──────────────────────────────────────────────────────────────┤
│  Browse everything — the four sections with their article list │
│  (collapsible; same tree as the sidebar)                       │
├──────────────────────────────────────────────────────────────┤
│  "A living document" note + last-updated + how to suggest edits│
└──────────────────────────────────────────────────────────────┘
```

Each role card links to the natural first article of its section (see §3).

## 3. Navigation structure

- **Top nav:** a new top-level item **Lab Handbook** (hidden behind a flag until
  you publish — see §6). It routes to `/handbook` (or `/zh/handbook`).
- **Docs shell (every handbook page):** a persistent **left sidebar** listing the
  four sections, each expandable to its articles, with the current page
  highlighted; a **right in-page TOC** (h2/h3) with scroll-spy (reused from the
  notes reader); **prev / next** across the whole ordered sequence; a language
  toggle; reading progress bar.
- **Role cards → sections:**
  - 🌱 Prospective Student → `who-should-apply`
  - 🎓 New Lab Member → `lab-philosophy`
  - 🔬 Current Researcher → `reading-papers`
  - 🤝 Collaboration & Policies → `authorship-policy`

## 4. Recommended page hierarchy (order within each section)

1. **Joining the Lab:** Who Should Apply → What I Look For → Application Process → FAQ
2. **Getting Started:** Lab Philosophy → Mentoring Philosophy → Expectations →
   Research Workflow → Meeting Guide → Using AI Tools → Research Ethics
3. **Research:** Reading Papers → Finding Research Problems → Running Experiments →
   Writing Papers → Giving Presentations → Reviewing Papers → Reproducibility →
   Open Source & Code Quality
4. **Policies & Collaboration:** Authorship Policy → Communication → Feedback
   Culture → Collaboration Guidelines → Data Management

Ordering is controlled by an `order` field in each article's frontmatter, so
resequencing is a one-line edit.

## 5. Reusable page template (frontmatter contract)

Every handbook article is a Markdown/MDX file at
`src/content/handbook/<section>/<slug>.<lang>.md` with:

```yaml
---
slug: "what-i-look-for"        # stable, shared across languages
lang: "en"                     # en | zh
title: "What I Look For"
section: "joining"             # joining | getting-started | research | policies
order: 2                       # position within the section
status: "available"            # available | draft  (draft shows a badge)
updated: 2026-07-05
summary: "One-line description for the sidebar, cards, and SEO."
---

> Short framing quote / what this page is about.

## First idea (h2 → appears in the TOC)
Prose. Culture over rules; principles, then concrete examples.

## Second idea
...

## In short
A 2–3 bullet takeaway.
```

The layout renders title, section/updated meta, status badge, the body, an
auto TOC, and prev/next — authors only write frontmatter + Markdown.

## 6. Future expansion (while staying consistent with the site)

- **Add an article:** drop one `.en.md` + `.zh.md` into the right section folder
  with `section`, `order`, `status`. It appears in the sidebar, landing tree,
  prev/next, search, and sitemap automatically — no code changes.
- **Publish toggle:** the whole handbook is built but hidden from the top nav via
  `handbookInNav` in `src/lib/handbook.ts`. Flip it to `true` to reveal the nav
  item. Per-article `status: draft` shows a "Draft" badge without hiding the page.
- **Reuse the note hide mechanism** pattern if you ever want to hide a whole
  section: add a `hiddenHandbookSections` set alongside the notes' `hiddenGroups`.
- **Bilingual parity** follows the same rule as notes: a page is complete when
  both `en` and `zh` exist; a missing side links to the available language.
- **Consistency:** same Base layout (header, footer, theme, fonts), same
  typography and CSS tokens, same TOC/scroll-spy and search (Pagefind indexes
  handbook pages too). It reads as one site, not a bolt-on.
- **Possible later additions:** onboarding checklist, per-project runbooks,
  compute/cluster how-tos, a "first two weeks" track, alumni page, and templates
  (paper/rebuttal/review checklists) — all as new handbook articles.
