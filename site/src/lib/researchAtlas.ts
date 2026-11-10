/** Autoplay is enhancement only: the first illustration works without JS. */
export function initResearchAtlas(root: HTMLElement) {
  if (root.dataset.atlasReady) return;
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-atlas-slide]'));
  const controls = root.querySelector<HTMLElement>('.atlas-controls');
  const rotation = root.querySelector<HTMLButtonElement>('[data-atlas-rotation]');
  const caption = root.querySelector<HTMLElement>('[data-atlas-caption]');
  const count = root.querySelector<HTMLElement>('[data-atlas-count]');
  const announcement = root.querySelector<HTMLElement>('[data-atlas-announcement]');
  if (slides.length < 2 || !controls || !rotation || !caption || !count || !announcement) return;
  const zh = root.dataset.lang === 'zh';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = false;
  let pointerInside = false;
  let onScreen = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let rotationPauseIntent: boolean | undefined;

  function schedule() {
    clearTimeout(timer);
    timer = undefined;
    const running = !paused && !reduced.matches;
    root.dataset.atlasPlaying = String(running && !pointerInside && onScreen && !document.hidden);
    root.dataset.atlasPaused = String(!running);
    rotation!.disabled = reduced.matches;
    const label = reduced.matches
      ? (zh ? '已依減少動態效果設定停止自動切換' : 'Automatic rotation disabled by reduced motion preference')
      : running ? (zh ? '暫停自動切換' : 'Pause automatic rotation') : (zh ? '開始自動切換' : 'Start automatic rotation');
    rotation!.setAttribute('aria-label', label);
    rotation!.title = label;
    if (!running || pointerInside || !onScreen || document.hidden) return;
    timer = setTimeout(() => { show(current + 1); schedule(); }, 8000);
  }

  function show(index: number, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    const title = slides[current].dataset.title!;
    caption!.textContent = title;
    count!.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    root.dataset.atlasIndex = String(current);
    if (manual) {
      paused = true;
      announcement!.textContent = `${title} (${current + 1} / ${slides.length})`;
      schedule();
    }
  }

  root.querySelector('[data-atlas-prev]')?.addEventListener('click', () => show(current - 1, true));
  root.querySelector('[data-atlas-next]')?.addEventListener('click', () => show(current + 1, true));
  // Pointer focus enters before click; preserve the action shown before focus paused it.
  rotation.addEventListener('pointerdown', () => { rotationPauseIntent = !paused; });
  rotation.addEventListener('pointercancel', () => { rotationPauseIntent = undefined; });
  rotation.addEventListener('blur', () => { rotationPauseIntent = undefined; });
  rotation.addEventListener('click', () => {
    paused = rotationPauseIntent ?? !paused;
    rotationPauseIntent = undefined;
    schedule();
  });
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointerInside = true;
    schedule();
  });
  root.addEventListener('pointerleave', () => { pointerInside = false; schedule(); });
  // Keyboard entry stops rotation until the visitor explicitly starts it again.
  root.addEventListener('focusin', (event) => {
    if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
    paused = true;
    schedule();
  });
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; schedule(); }).observe(root);
  }
  root.dataset.atlasReady = 'true';
  controls.hidden = false;
  show(0);
  schedule();
}
