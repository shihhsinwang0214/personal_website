export type NavigationIconKind = 'learn' | 'practice' | 'research' | 'lab';
export const navigationIconOrder: NavigationIconKind[] = ['learn', 'practice', 'research', 'lab'];

/** The book uses source-image coordinates so its page and spine share the bitmap's aspect ratio. */
export function navigationIconMotion(kind: NavigationIconKind, imageViewBox: string): string {
  if (kind === 'learn') return `<span class="nav-illustration__page"><svg viewBox="${imageViewBox}" focusable="false"><g transform="translate(263 242) rotate(-9.3)"><g class="icon-book-leaf"><path class="icon-page-paper" d="M0 0Q78-35 182-6L195 284Q86 243 0 282Z"/><path class="icon-page-ink" d="M35 124Q94 110 154 117M35 174Q94 161 154 168"/></g></g></svg></span>`;
  if (kind === 'practice') return `<svg class="nav-illustration__effect" viewBox="0 0 100 100" focusable="false"><circle class="icon-answer-pulse" cx="24" cy="54" r="8"/></svg>`;
  if (kind === 'lab') return `<svg class="nav-illustration__effect" viewBox="0 0 100 100" focusable="false"><path class="icon-screen-ping" d="m51 34 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></svg>`;
  return '';
}
