/**
 * What this browser has read in the notes, and where it stopped.
 *
 * Same contract as `visited.ts` (the handbook): localStorage only, never sent anywhere,
 * always clearable. The notes add one thing the handbook deliberately avoids — a
 * "continue where you left off" pointer — because a course is read in order.
 *
 * Client-side only: import from a component <script>, never from frontmatter.
 */
const READ_KEY = 'slam:notes-read';
const LAST_KEY = 'slam:notes-last';
const VIEW_KEY = 'slam:notes-view';

export interface LastRead {
  slug: string;
  lang: 'en' | 'zh';
  /** Display title with its position code, e.g. "W5.2 把「彎」寫成…". */
  title: string;
  courseKey?: string;
  group?: string;
  ts: number;
}

export function readSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((s): s is string => typeof s === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function markRead(slug: string): void {
  if (!slug) return;
  try {
    const seen = readSlugs();
    if (!seen.has(slug)) {
      seen.add(slug);
      localStorage.setItem(READ_KEY, JSON.stringify([...seen]));
    }
  } catch {
    /* ignore */
  }
}

export function readLast(): LastRead | undefined {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw);
    return v && typeof v.slug === 'string' ? (v as LastRead) : undefined;
  } catch {
    return undefined;
  }
}

export function setLast(last: Omit<LastRead, 'ts'>): void {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ ...last, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function clearReading(): void {
  try {
    localStorage.removeItem(READ_KEY);
    localStorage.removeItem(LAST_KEY);
  } catch {
    /* ignore */
  }
}

export type NotesView = 'sky' | 'list';

export function readView(): NotesView | undefined {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return v === 'sky' || v === 'list' ? v : undefined;
  } catch {
    return undefined;
  }
}

export function setView(view: NotesView): void {
  try {
    localStorage.setItem(VIEW_KEY, view);
  } catch {
    /* ignore */
  }
}

/**
 * Paint read state onto any element carrying `data-read-slug`: adds `is-read`, and for
 * containers with `data-read-count` fills "read / total" from their descendants.
 */
export function paintReadState(root: ParentNode = document): Set<string> {
  const seen = readSlugs();
  root.querySelectorAll<HTMLElement>('[data-read-slug]').forEach((el) => {
    const slug = el.dataset.readSlug ?? '';
    el.classList.toggle('is-read', seen.has(slug));
  });
  root.querySelectorAll<HTMLElement>('[data-read-count]').forEach((box) => {
    const items = box.querySelectorAll<HTMLElement>('[data-read-slug]');
    let n = 0;
    items.forEach((el) => {
      if (seen.has(el.dataset.readSlug ?? '')) n++;
    });
    box.dataset.readDone = String(n);
    box.dataset.readTotal = String(items.length);
    box.classList.toggle('is-complete', items.length > 0 && n === items.length);
    box.classList.toggle('is-started', n > 0);
    const out = box.querySelector<HTMLElement>('[data-read-count-out]');
    if (out) out.textContent = `${n} / ${items.length}`;
    const bar = box.querySelector<HTMLElement>('[data-read-bar]');
    if (bar) bar.style.width = items.length ? `${(100 * n) / items.length}%` : '0%';
  });
  return seen;
}
