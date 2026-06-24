/* Shared helpers for the Invariance and Equivariance standalone demos. */
(function (global) {
  'use strict';

  function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function sampleNoise(n, scale) {
    var pts = [], s = scale == null ? 1 : scale;
    for (var i = 0; i < n; i++) pts.push([randn() * s, randn() * s]);
    return pts;
  }

  function sampleTarget(shape, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = shape === 'ring' ? 1 + randn() * 0.05 : Math.sqrt(Math.random());
      pts.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    return pts;
  }

  function prefersReducedMotion() {
    try { return global.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function isDark() {
    try {
      var theme = global.parent.document.documentElement.dataset.theme;
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
    } catch (e) { /* standalone or cross-origin */ }
    try { return global.matchMedia('(prefers-color-scheme: dark)').matches; }
    catch (e) { return false; }
  }

  function palette() {
    return isDark()
      ? { dark: true, bg: '#15161a', panel: '#1f2126', ink: '#e9e6e1', muted: '#aaa79f',
          border: '#3a3b42', grid: 'rgba(255,255,255,.08)', accent: '#d8a44a',
          blue: '#79a8ff', red: '#ef8e75', green: '#72c79a', purple: '#c69cff' }
      : { dark: false, bg: '#f7f8fb', panel: '#fffdfb', ink: '#1f2733', muted: '#646c78',
          border: '#d8dce5', grid: 'rgba(31,39,51,.08)', accent: '#2a4ea3',
          blue: '#2a67c7', red: '#c6533c', green: '#23855a', purple: '#7b4cb7' };
  }

  function onThemeChange(cb) {
    try {
      var root = global.parent.document.documentElement;
      if (root && root.nodeType === 1) {
        var observer = new MutationObserver(cb);
        observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      }
    } catch (e) { /* standalone or cross-origin */ }
    try { global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', cb); }
    catch (e) { /* older browser */ }
  }

  function lerpColor(a, b, t) {
    var r = Math.round(a[0] + (b[0] - a[0]) * t);
    var g = Math.round(a[1] + (b[1] - a[1]) * t);
    var bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function hiDPICanvas(canvas) {
    var ctx = canvas.getContext('2d');
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = global.devicePixelRatio || 1;
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }
    return { ctx: ctx, resize: resize };
  }

  function roundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function arrow(ctx, x1, y1, x2, y2, color, width) {
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var head = 7;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.48), y2 - head * Math.sin(angle - 0.48));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.48), y2 - head * Math.sin(angle + 0.48));
    ctx.closePath();
    ctx.fill();
  }

  function applyTheme(draw) {
    var pal = palette();
    document.body.dataset.dark = pal.dark ? '1' : '0';
    // Call after the caller has assigned the returned palette.
    if (draw) Promise.resolve().then(draw);
    return pal;
  }

  var style = document.createElement('style');
  style.textContent = [
    ':root{color-scheme:light dark}*{box-sizing:border-box}',
    'body{margin:0;padding:14px;font-family:"Plus Jakarta Sans","Segoe UI",system-ui,sans-serif;background:transparent;color:#1f2733}',
    'body[data-dark="1"]{color:#e9e6e1}',
    '.card{max-width:760px;margin:0 auto;padding:16px;border:1px solid #d8dce5;border-radius:12px;background:#fffdfb}',
    'body[data-dark="1"] .card{background:#1f2126;border-color:#3a3b42}',
    '.goal,.observe{font-size:.88rem;line-height:1.55;margin:0 0 12px}',
    '.goal b,.observe b{color:#2a4ea3}body[data-dark="1"] .goal b,body[data-dark="1"] .observe b{color:#d8a44a}',
    '.observe{margin:12px 0 0;color:#646c78}body[data-dark="1"] .observe{color:#aaa79f}',
    'canvas{display:block;width:100%;height:auto;aspect-ratio:16/10;border-radius:9px;touch-action:none}',
    '.controls{display:grid;gap:10px;margin-top:12px}',
    '.row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 12px}',
    'label{font-size:.8rem;font-weight:700}',
    'input[type=range]{width:min(230px,58vw);accent-color:#2a4ea3}body[data-dark="1"] input[type=range]{accent-color:#d8a44a}',
    'select,button{font:inherit;border-radius:7px;padding:7px 10px;border:1px solid #c9ced8;background:#fff;color:inherit}',
    'body[data-dark="1"] select,body[data-dark="1"] button{background:#292b31;border-color:#4a4b53;color:#e9e6e1}',
    'button{cursor:pointer;font-weight:700}button:hover{border-color:#2a4ea3}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid #2a4ea3;outline-offset:2px}',
    'body[data-dark="1"] button:focus-visible,body[data-dark="1"] select:focus-visible,body[data-dark="1"] input:focus-visible{outline-color:#d8a44a}',
    '.readout{min-width:3.6em;font-variant-numeric:tabular-nums;font-weight:700;font-size:.82rem}',
    '.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:10px}',
    '.metric{padding:9px 10px;border:1px solid #d8dce5;border-radius:8px;font-size:.8rem;line-height:1.45}',
    'body[data-dark="1"] .metric{border-color:#3a3b42}',
    '.metric strong{display:block;font-size:.72rem;color:#646c78}body[data-dark="1"] .metric strong{color:#aaa79f}',
    '@media(max-width:480px){body{padding:8px}.card{padding:12px}canvas{aspect-ratio:4/3}.row{justify-content:flex-start}.metrics{grid-template-columns:1fr 1fr}}'
  ].join('');
  document.head.appendChild(style);

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
    roundRect: roundRect,
    arrow: arrow,
    applyTheme: applyTheme
  };
})(window);
