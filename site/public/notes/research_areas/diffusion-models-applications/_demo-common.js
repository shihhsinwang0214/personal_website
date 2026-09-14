/* ============================================================
   _demo-common.js — shared helpers for the "From Noise to Data"
   interactive demos. Loaded by each standalone demo HTML via
   <script src="./_demo-common.js"></script>. Keep the API small
   and stable so multiple notes can reuse it.
   ============================================================ */
(function (global) {
  'use strict';

  // --- standard normal via Box–Muller ---
  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // --- sample a gaussian "noise" point cloud (normalized world coords) ---
  function sampleNoise(n, scale) {
    const s = scale == null ? 1 : scale;
    const pts = [];
    for (let i = 0; i < n; i++) pts.push([randn() * s, randn() * s]);
    return pts;
  }

  // --- sample a target shape; returns n points in normalized world coords ---
  function sampleTarget(shape, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0;
      if (shape === 'two_moons') {
        const top = Math.random() > 0.5;
        const a = Math.random() * Math.PI;
        if (top) { x = Math.cos(a) - 0.5; y = -Math.sin(a) + 0.25; }
        else { x = 1 - Math.cos(a) - 0.5; y = Math.sin(a) - 0.25; }
        x = (x + randn() * 0.05) * 1.5;
        y = (y + randn() * 0.05) * 1.5;
      } else if (shape === 'two_gaussians') {
        const right = Math.random() > 0.5;
        x = (right ? 1.1 : -1.1) + randn() * 0.18;
        y = randn() * 0.45;
      } else if (shape === 'ring') {
        const a = Math.random() * Math.PI * 2;
        const r = 1.2 + randn() * 0.08;
        x = r * Math.cos(a); y = r * Math.sin(a);
      } else if (shape === 'swiss_roll') {
        const t = 1.5 + Math.random() * (3.5 * Math.PI - 1.5);
        x = t * Math.cos(t) * 0.11 + randn() * 0.04;
        y = t * Math.sin(t) * 0.11 + randn() * 0.04;
      } else if (shape === 'spiral_grid' || shape === 'grid') {
        const gx = Math.floor(Math.random() * 3) - 1;
        const gy = Math.floor(Math.random() * 3) - 1;
        x = gx * 0.9 + randn() * 0.07;
        y = gy * 0.9 + randn() * 0.07;
      } else { // fallback: single gaussian blob shifted
        x = 1.0 + randn() * 0.3; y = randn() * 0.3;
      }
      pts.push([x, y]);
    }
    return pts;
  }

  // --- reduced-motion preference ---
  function prefersReducedMotion() {
    try { return global.matchMedia('(prefers-color-scheme: dark)') && global.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  // --- theme: read parent site's data-theme (same-origin) then fall back ---
  function isDark() {
    try {
      const t = global.parent && global.parent.document &&
        global.parent.document.documentElement.dataset.theme;
      if (t === 'dark') return true;
      if (t === 'light') return false;
    } catch (e) { /* cross-origin or no parent */ }
    try { return global.matchMedia('(prefers-color-scheme: dark)').matches; }
    catch (e) { return false; }
  }

  function palette() {
    const dark = isDark();
    return dark
      ? { dark: true, bg: '#15161a', panel: '#1f2126', ink: '#e9e6e1', muted: '#9a988f',
          grid: 'rgba(255,255,255,0.07)', arrow: 'rgba(216,164,74,0.85)', accent: '#d8a44a',
          noise: [120, 170, 255], data: [240, 150, 70] }
      : { dark: false, bg: '#0f1117', panel: '#ffffff', ink: '#1f2733', muted: '#646c78',
          grid: 'rgba(0,0,0,0.06)', arrow: 'rgba(42,78,163,0.8)', accent: '#2a4ea3',
          noise: [70, 150, 255], data: [255, 120, 50] };
  }

  // re-render hook when the site theme toggles
  function onThemeChange(cb) {
    try {
      const root = global.parent.document.documentElement;
      const mo = new MutationObserver(cb);
      mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (e) { /* ignore */ }
    try { global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', cb); }
    catch (e) { /* ignore */ }
  }

  function lerpColor(a, b, t) {
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  // hi-DPI square-ish canvas that tracks its CSS size; returns {ctx, css()}
  function hiDPICanvas(canvas) {
    const ctx = canvas.getContext('2d');
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = global.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }
    return { ctx: ctx, resize: resize };
  }

  global.NDFlow = {
    randn: randn,
    sampleNoise: sampleNoise,
    sampleTarget: sampleTarget,
    prefersReducedMotion: prefersReducedMotion,
    isDark: isDark,
    palette: palette,
    onThemeChange: onThemeChange,
    lerpColor: lerpColor,
    hiDPICanvas: hiDPICanvas,
  };
})(window);
