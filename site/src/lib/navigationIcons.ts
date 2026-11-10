export type NavigationIconKind = 'learn' | 'practice' | 'research' | 'lab';
export const navigationIconOrder: NavigationIconKind[] = ['learn', 'practice', 'research', 'lab'];

/** Decorative motion layers in the icon's normalized 100 × 100 viewport. */
export function navigationIconMotion(kind: NavigationIconKind): string {
  if (kind === 'learn') return `<span class="nav-illustration__page"><svg viewBox="0 0 100 100" focusable="false"><path class="icon-page-paper" d="M51 30Q67 18 88 18L95 71Q73 70 54 82Z"/><path class="icon-page-ink" d="m59 37 22-6m-21 15 22-6m-20 15 21-5"/></svg></span>`;
  if (kind === 'practice') return `<svg class="nav-illustration__effect" viewBox="0 0 100 100" focusable="false"><circle class="icon-answer-pulse" cx="24" cy="54" r="8"/></svg>`;
  if (kind === 'lab') return `<svg class="nav-illustration__effect" viewBox="0 0 100 100" focusable="false"><path class="icon-screen-ping" d="m51 34 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></svg>`;
  return '';
}
