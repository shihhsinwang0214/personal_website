const base = import.meta.env.BASE_URL; // e.g. "/personal_website/"

/** Prefix a site-relative path with the configured base. External and mailto links pass through. */
export function withBase(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
