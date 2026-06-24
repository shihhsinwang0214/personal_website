# Design Spec — Experience & UI Polish (Increment 3)

Goal: make the site feel like a premium, modern website/app while keeping the
current academic-minimal identity. This is polish, not a rebrand.

Ambition (decided): keep the existing aesthetic and color palette; layer in depth,
motion, and interaction craft. References for the *feel*: Distill / Lilian Weng for
typographic calm and reading comfort; Linear / Stripe for interaction craft. Adapt,
do not copy (`WEBSITE_ROLE_MODELS.md`).

## Non-negotiable constraints

- Do not change content, copy, or note bodies. No new facts, no translations.
- Do not break URLs, demos, or the bilingual system. Keep `withBase()`.
- Keep the current identity and palette; extend tokens, don't replace them.
- Mobile-first: everything must feel great at ~380px.
- Ship minimal JS. Use small Astro/vanilla islands only where interaction needs it;
  do not pull in a heavy UI framework for this increment.
- All motion respects `prefers-reduced-motion: reduce` (disable transforms/animation).
- Accessibility is part of "premium": visible focus, AA contrast in both themes,
  semantic landmarks, full keyboard support. No layout shift (CLS ~0).

## 1. Visual foundations (extend `global.css` tokens)

Add a small, consistent system on top of the existing tokens.

- Type scale (rem): 0.78, 0.9, 1, 1.15, 1.3, 1.6, 2.1, 2.8. Body measure max ~68ch.
  Tighten heading letter-spacing; set comfortable line-heights (body ~1.65, headings ~1.15).
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96 → as `--space-*`. Apply for
  consistent vertical rhythm across all pages.
- Elevation: 3 shadow tokens (`--shadow-sm/-md/-lg`), soft and low-opacity; use sparingly
  for header-on-scroll, cards on hover, popovers/drawer.
- Radius: `--radius-sm/-md/-lg` (8 / 12 / 20).
- Motion tokens: `--dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;`
  `--ease-standard: cubic-bezier(.2,0,0,1); --ease-out: cubic-bezier(.16,1,.3,1);`
- Refactor colors into semantic tokens so dark mode is a variable swap:
  `--bg, --surface, --surface-2, --border, --text, --text-muted, --accent,
  --accent-hover, --focus-ring`. Keep light values = current palette.

## 2. Dark mode

- Theme on `<html data-theme="light|dark">`. Default to system
  (`prefers-color-scheme`); a header toggle overrides and persists in `localStorage`.
- No flash: an inline `<head>` script must set `data-theme` before first paint.
- Suggested dark palette (Codex to tune for AA): `--bg:#14181d; --surface:#1b2128;
  --surface-2:#222b34; --text:#e7ecf1; --text-muted:#9aa7b4; --border:#2a333d;
  --accent:#e0735c; --accent-hover:#ec8770;`. Keep the warm terracotta accent.
- KaTeX (inherits text color — verify formulas read well in dark) and **code blocks
  must theme too**: use Shiki dual themes (`themes: { light: 'github-light', dark:
  'github-dark' }`) so highlighting adapts via `data-theme`. Note: the config
  currently sets a custom `markdown.processor`; verify Shiki dual-theme highlighting
  is actually applied (adjust the processor/highlighter wiring if code blocks don't
  pick up the theme).
- Toggle is icon-based (sun/moon), keyboard-accessible, `aria-pressed`.

## 3. Navigation & header

- Sticky header. On scroll past ~8px, condense it (less padding) and add `--shadow-sm`,
  transitioned. Use `transition:persist` so it survives view transitions.
- Desktop nav: keep centered links; refine the active indicator (animated underline);
  add theme + language toggles to the header.
- Mobile (<720px): replace wrapping links with a hamburger button → accessible
  slide-in drawer/sheet containing nav links + language + theme toggles. Requirements:
  `aria-expanded`, focus moves into the drawer, focus-trap, `Esc` closes, background
  scroll locked, click-outside closes, animated open/close (respect reduced-motion).
- Add a visually-hidden "Skip to content" link as the first focusable element.

## 4. Motion & page transitions

- Enable Astro View Transitions (`<ClientRouter />` in the Base layout) for app-like
  instant navigation. Use a subtle cross-fade (and a small slide-up on main content);
  persist the header. Disable/transition-none under reduced-motion.
- Enable prefetch (config `prefetch: true` / `data-astro-prefetch` on nav and cards)
  so navigation feels instant.
- Micro-interactions: cards lift on hover (`translateY(-2px)` + `--shadow-md`),
  links/buttons have `--dur-fast` color/opacity transitions, `:focus-visible` shows a
  clear `--focus-ring`. Tap targets ≥44px on mobile.
- Optional, subtle: one-time scroll-reveal (fade/translate ~12px) for major sections,
  via IntersectionObserver, `once`, disabled under reduced-motion. Keep it understated.

## 5. Reading experience (note article pages)

- Sticky right-rail TOC with **scroll-spy**: highlight the section currently in view
  (IntersectionObserver island). On mobile, TOC collapses into a "Contents" disclosure.
- Reading progress bar pinned to the top of the article (thin, accent color).
- Reading time, computed at build: estimate by characters for zh (~330 chars/min) and
  by words for en (~220 wpm). Display localized: "X 分鐘閱讀" / "X min read".
- Back-to-top button that fades in after scrolling; smooth-scrolls to top.
- Heading anchors: on hover show a `#` affordance that copies the deep link; smooth
  scroll with offset for the sticky header (`scroll-margin-top`).
- Body typography pass: comfortable measure, spacing between blocks, styled
  blockquotes, code blocks, and a clean frame/caption treatment for demo iframes.

## 6. Components to refine

- Cards (note cards, pub items): unified hover/elevation/focus; whole card clickable
  with a real focusable link.
- Status badges, language/theme toggles: consistent pill styling with hover/active/focus.
- Footer: lightweight, aligned to the new spacing scale.
- 404 page: on-brand, with a link home and to /notes.
- Favicon + basic per-page `<title>`/description already exist; add a favicon and
  sensible defaults (full Open Graph/social cards are Increment 4).

## 7. Acceptance criteria (verify locally; no deploy)

- `npm run build` passes; no console errors in preview.
- Light AND dark themes both look correct on `/`, `/publications`, `/experience`,
  `/notes`, a zh note, and the EN missing page; no flash of wrong theme on load.
- Mobile (~380px): hamburger drawer works (open/close/Esc/focus-trap/scroll-lock);
  no horizontal overflow; tap targets ≥44px.
- View transitions animate between pages; header persists; prefetch makes nav instant.
- Note page: scroll-spy TOC highlights correctly, progress bar tracks scroll, reading
  time shows, back-to-top works, heading anchor copy works, demos still render/resize.
- `prefers-reduced-motion: reduce` disables transitions/animations.
- Keyboard-only pass: skip link, visible focus everywhere, drawer and toggles operable.
- All existing URLs (notes slugs, legacy `notes.html?...`, six demo URLs) still resolve.
- Capture before/after screenshots: each page in light + dark, desktop + ~380px mobile.

## 8. Out of scope (later increments)

- Open Graph / social-card images, sitemap, RSS, full-text search → Increment 4.
- Deployment / Pages cutover → Increment 5.
- New content, summaries, translations → content agent.
