// ============================================================
// Third-party integration config. Each integration renders only
// when enabled and supplied with its real site/account identifiers.
// ============================================================

// GoatCounter site supplied by the author on 2026-11-10.
export const analytics = {
  enabled: true,
  // Your GoatCounter code — the "<code>" in https://<code>.goatcounter.com
  code: 'shwang',
  // Enable "Allow adding visitor counts on your website" in GoatCounter's settings.
  showCounts: true,
};

// Comments (giscus, backed by GitHub Discussions). To enable:
//   1. In the GitHub repo: Settings → General → Features → enable Discussions.
//   2. Install the giscus app: https://github.com/apps/giscus
//   3. Go to https://giscus.app, enter the repo, pick the "Announcements"
//      category, and copy the repo / repoId / category / categoryId it shows.
//   4. Paste them below and set `enabled: true`.
export const comments = {
  enabled: false,
  repo: '', // e.g. "shihhsinwang0214/personal_website"
  repoId: '', // from giscus.app
  category: 'Announcements',
  categoryId: '', // from giscus.app
  mapping: 'pathname' as const,
  reactionsEnabled: '1' as const,
};
