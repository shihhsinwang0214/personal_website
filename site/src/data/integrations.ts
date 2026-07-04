// ============================================================
// Third-party integration config. Everything here is OFF until
// the author fills in real IDs. No integration renders while its
// `enabled` flag is false, so committing this file changes nothing
// visible until you paste your own values and flip `enabled`.
// ============================================================

// Privacy-friendly analytics (GoatCounter). To enable:
//   1. Register a code at https://www.goatcounter.com (e.g. "shihhsinwang").
//   2. Set `code` below and `enabled: true`.
export const analytics = {
  enabled: false,
  // Your GoatCounter code — the "<code>" in https://<code>.goatcounter.com
  code: '',
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
