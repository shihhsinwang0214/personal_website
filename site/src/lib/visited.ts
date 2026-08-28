/**
 * Which handbook pages this browser has opened.
 *
 * Deliberate constraints (see docs/lab-interaction-plan.md):
 *   - localStorage only. Never sent anywhere. The PI cannot see it.
 *   - Coverage of the *content*, not a score for the person. So: no percentage,
 *     no "N/M complete", no total. Only "this node has been walked".
 *   - Always resettable.
 *
 * Client-side only — import this from a component <script>, not frontmatter.
 */
const KEY = 'slam:visited';

export function readVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((s): s is string => typeof s === 'string')) : new Set();
  } catch {
    // Private mode, disabled storage, corrupted value — all fine, just forget.
    return new Set();
  }
}

export function markVisited(slug: string): void {
  if (!slug) return;
  try {
    const seen = readVisited();
    if (seen.has(slug)) return;
    seen.add(slug);
    localStorage.setItem(KEY, JSON.stringify([...seen]));
  } catch {
    /* ignore */
  }
}

export function clearVisited(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
