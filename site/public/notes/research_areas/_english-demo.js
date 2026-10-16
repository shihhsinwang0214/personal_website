/* English embeds grow with their translated controls and explanatory text. */
(() => {
  function fitFrame() {
    try {
      const frame = window.frameElement;
      if (!frame || frame.tagName !== 'IFRAME' || !document.body) return;
      const height = Math.max(320, Math.ceil(document.body.getBoundingClientRect().height + 2));
      if (Math.abs(frame.getBoundingClientRect().height - height) > 2) frame.style.height = `${height}px`;
    } catch { /* Standalone or cross-origin embeds retain their normal scrolling. */ }
  }
  function bind() {
    fitFrame();
    new ResizeObserver(fitFrame).observe(document.body);
    window.addEventListener('resize', fitFrame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
