/* ============================================================
   _demo-common.js — shared helpers for the "Machine Learning
   Foundations" (L0–L5) interactive demos. Loaded by each
   standalone demo HTML via <script src="./_demo-common.js">.
   Namespace: MLF. Keep the API small and stable.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- seeded RNG (mulberry32) + gaussian ---------- */
  function rng(seed) {
    var a = (seed >>> 0) || 1;
    function u() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    u.normal = function () {
      var x = 0, y = 0;
      while (x === 0) x = u();
      while (y === 0) y = u();
      return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);
    };
    u.int = function (n) { return Math.floor(u() * n); };
    u.pick = function (arr) { return arr[u.int(arr.length)]; };
    return u;
  }
  function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* ---------- the series' shared 1-D toy ----------
     y = sin(2*pi*x) + eps,  eps ~ N(0, NOISE^2),  NOISE = 0.15
     irreducible error = NOISE^2 = 0.0225 exactly.            */
  var NOISE = 0.15;
  function truth(x) { return Math.sin(2 * Math.PI * x); }
  function toy1d(n, noise, seed) {
    if (noise == null) noise = NOISE;
    var r = rng(seed == null ? 0 : seed), xs = [], ys = [], i;
    for (i = 0; i < n; i++) xs.push(r());
    xs.sort(function (a, b) { return a - b; });
    for (i = 0; i < n; i++) ys.push(truth(xs[i]) + noise * r.normal());
    return { x: xs, y: ys };
  }
  function grid(m, lo, hi) {
    if (lo == null) lo = 0; if (hi == null) hi = 1;
    var g = [], i;
    for (i = 0; i < m; i++) g.push(lo + (hi - lo) * i / (m - 1));
    return g;
  }

  /* ---------- polynomial least squares (standardised columns) ----------
     Fits y ~ sum_j c_j * x^j for j = 0..deg with optional ridge lambda.
     Columns are centred/scaled before solving, which is what every
     experiment in the series does, so the numbers line up.        */
  function design(xs, deg) {
    var n = xs.length, p = deg + 1, A = [], i, j;
    for (i = 0; i < n; i++) { A.push([]); for (j = 0; j < p; j++) A[i].push(Math.pow(xs[i], j)); }
    var mu = [], sd = [];
    for (j = 0; j < p; j++) {
      var m = 0; for (i = 0; i < n; i++) m += A[i][j]; m /= n;
      var v = 0; for (i = 0; i < n; i++) v += (A[i][j] - m) * (A[i][j] - m); v = Math.sqrt(v / n);
      if (j === 0 || v < 1e-12) { m = 0; v = 1; }
      mu.push(m); sd.push(v);
      for (i = 0; i < n; i++) A[i][j] = (A[i][j] - m) / v;
    }
    return { A: A, mu: mu, sd: sd, p: p };
  }
  function solveSym(M, b) {           // Gaussian elimination with partial pivoting
    var p = b.length, i, j, k, aug = [];
    for (i = 0; i < p; i++) { aug.push(M[i].slice()); aug[i].push(b[i]); }
    for (k = 0; k < p; k++) {
      var piv = k;
      for (i = k + 1; i < p; i++) if (Math.abs(aug[i][k]) > Math.abs(aug[piv][k])) piv = i;
      var t = aug[k]; aug[k] = aug[piv]; aug[piv] = t;
      if (Math.abs(aug[k][k]) < 1e-14) aug[k][k] = 1e-14;
      for (i = k + 1; i < p; i++) {
        var f = aug[i][k] / aug[k][k];
        for (j = k; j <= p; j++) aug[i][j] -= f * aug[k][j];
      }
    }
    var x = new Array(p);
    for (i = p - 1; i >= 0; i--) {
      var s = aug[i][p];
      for (j = i + 1; j < p; j++) s -= aug[i][j] * x[j];
      x[i] = s / aug[i][i];
    }
    return x;
  }
  function polyfit(xs, ys, deg, lambda) {
    var d = design(xs, deg), n = xs.length, p = d.p, i, j, k;
    var M = [], b = [];
    for (j = 0; j < p; j++) {
      M.push(new Array(p).fill(0)); b.push(0);
      for (i = 0; i < n; i++) b[j] += d.A[i][j] * ys[i];
    }
    for (j = 0; j < p; j++) for (k = 0; k < p; k++) {
      var s = 0; for (i = 0; i < n; i++) s += d.A[i][j] * d.A[i][k];
      M[j][k] = s + (j === k && j > 0 ? (lambda || 0) * n : 0) + (j === k ? 1e-9 : 0);
    }
    var c = solveSym(M, b);
    return { c: c, mu: d.mu, sd: d.sd, deg: deg };
  }
  /** weighted least squares on the same standardised polynomial basis */
  function polyfitW(xs, ys, deg, w) {
    var d = design(xs, deg), n = xs.length, p = d.p, i, j, k;
    var M = [], b = [];
    for (j = 0; j < p; j++) { M.push(new Array(p).fill(0)); b.push(0); }
    for (j = 0; j < p; j++) {
      for (i = 0; i < n; i++) b[j] += w[i] * d.A[i][j] * ys[i];
      for (k = 0; k < p; k++) {
        var s = 0;
        for (i = 0; i < n; i++) s += w[i] * d.A[i][j] * d.A[i][k];
        M[j][k] = s + (j === k ? 1e-8 : 0);
      }
    }
    return { c: solveSym(M, b), mu: d.mu, sd: d.sd, deg: deg };
  }
  /** IRLS for L1 ('abs') or Huber ('huber', delta) on a polynomial basis */
  function robustfit(xs, ys, deg, kind, delta) {
    var n = xs.length, w = new Array(n).fill(1), fit = polyfitW(xs, ys, deg, w), it, i;
    for (it = 0; it < 40; it++) {
      for (i = 0; i < n; i++) {
        var r = Math.abs(polyval(fit, xs[i]) - ys[i]);
        if (kind === 'abs') w[i] = 1 / Math.max(r, 1e-3);
        else w[i] = r <= delta ? 1 : delta / Math.max(r, 1e-9);
      }
      fit = polyfitW(xs, ys, deg, w);
    }
    return fit;
  }

  function polyval(fit, x) {
    var s = 0, j;
    for (j = 0; j <= fit.deg; j++) s += fit.c[j] * ((Math.pow(x, j) - fit.mu[j]) / fit.sd[j]);
    return s;
  }
  function mse(fit, xs, ys) {
    var s = 0, i;
    for (i = 0; i < xs.length; i++) { var e = polyval(fit, xs[i]) - ys[i]; s += e * e; }
    return s / xs.length;
  }
  /** true risk = E_x[(f(x)-sin 2pi x)^2] + NOISE^2, on a dense grid */
  function risk(fit, noise) {
    var g = grid(400), s = 0, i;
    for (i = 0; i < g.length; i++) { var e = polyval(fit, g[i]) - truth(g[i]); s += e * e; }
    return s / g.length + (noise == null ? NOISE : noise) * (noise == null ? NOISE : noise);
  }

  /* ---------- small statistics ---------- */
  function mean(a) { var s = 0, i; for (i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
  function std(a) { var m = mean(a), s = 0, i; for (i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / a.length); }
  function quantile(a, q) {
    var b = a.slice().sort(function (x, y) { return x - y; });
    var i = (b.length - 1) * q, lo = Math.floor(i), hi = Math.ceil(i);
    return b[lo] + (b[hi] - b[lo]) * (i - lo);
  }
  function median(a) { return quantile(a, 0.5); }

  /* ---------- 2-D quadratic bowl (shared by the optimisation demos) ----------
     Builds L(w) = mean_i (w . phi_i - y_i)^2 from the 1-D toy with two
     features [x, x^2], optionally scaled per column.  Everything below is
     exact: eigenvalues, the optimum, the gradient.                        */
  function quad(o) {
    o = o || {};
    var t = toy1d(o.n || 60, o.noise == null ? NOISE : o.noise, o.seed == null ? 3 : o.seed);
    var n = t.x.length, sx = o.sx == null ? 1 : o.sx, sy = o.sy == null ? 1 : o.sy, i, j;
    var P = [], off = o.offset || 0;
    for (i = 0; i < n; i++) {
      var xx = t.x[i] + off;
      P.push([xx * sx, xx * xx * sy]);
    }
    if (o.standardize) {
      for (j = 0; j < 2; j++) {
        var m = 0, v = 0;
        for (i = 0; i < n; i++) m += P[i][j]; m /= n;
        for (i = 0; i < n; i++) v += (P[i][j] - m) * (P[i][j] - m);
        v = Math.sqrt(v / n) || 1;
        for (i = 0; i < n; i++) P[i][j] = (P[i][j] - m) / v;
      }
    }
    if (o.kappa) {
      // orthogonalise column 2 against column 1, then rescale so that the
      // Hessian is diagonal with an EXACT condition number of o.kappa.
      var d11 = 0, d12 = 0;
      for (i = 0; i < n; i++) { d11 += P[i][0] * P[i][0]; d12 += P[i][0] * P[i][1]; }
      var pr = d12 / Math.max(d11, 1e-12);
      for (i = 0; i < n; i++) P[i][1] -= pr * P[i][0];
      var d22 = 0;
      for (i = 0; i < n; i++) d22 += P[i][1] * P[i][1];
      var f = Math.sqrt(d11 / Math.max(d22, 1e-12) / o.kappa);
      for (i = 0; i < n; i++) P[i][1] *= f;
    }
    if (o.postScale) for (i = 0; i < n; i++) P[i][1] *= o.postScale;
    var H = [[0, 0], [0, 0]], b = [0, 0], c0 = 0;
    for (i = 0; i < n; i++) {
      H[0][0] += 2 * P[i][0] * P[i][0] / n;
      H[0][1] += 2 * P[i][0] * P[i][1] / n;
      H[1][1] += 2 * P[i][1] * P[i][1] / n;
      b[0] += 2 * P[i][0] * t.y[i] / n;
      b[1] += 2 * P[i][1] * t.y[i] / n;
      c0 += t.y[i] * t.y[i] / n;
    }
    H[1][0] = H[0][1];
    var tr = H[0][0] + H[1][1];
    var disc = Math.sqrt(Math.max(0, (H[0][0] - H[1][1]) * (H[0][0] - H[1][1]) / 4 + H[0][1] * H[0][1]));
    var lmax = tr / 2 + disc, lmin = Math.max(tr / 2 - disc, 1e-14);
    var w = solveSym([H[0].slice(), H[1].slice()], b.slice());
    var Q = {
      P: P, y: t.y, n: n, H: H, b: b, w: w, c0: c0,
      lmax: lmax, lmin: lmin, kappa: lmax / lmin, eta: 2 / lmax,
      theta: 0.5 * Math.atan2(2 * H[0][1], H[0][0] - H[1][1]),
      l1: lmax, l2: lmin
    };
    Q.L = function (v) {
      return 0.5 * (H[0][0] * v[0] * v[0] + 2 * H[0][1] * v[0] * v[1] + H[1][1] * v[1] * v[1])
        - (b[0] * v[0] + b[1] * v[1]) + c0;
    };
    Q.Lmin = Q.L(w);
    Q.grad = function (v) {
      return [H[0][0] * v[0] + H[0][1] * v[1] - b[0], H[1][0] * v[0] + H[1][1] * v[1] - b[1]];
    };
    /** minibatch gradient over `idx` (array of row indices) */
    Q.gradB = function (v, idx) {
      var g0 = 0, g1 = 0, k;
      for (k = 0; k < idx.length; k++) {
        var r = idx[k], p = P[r][0] * v[0] + P[r][1] * v[1] - t.y[r];
        g0 += 2 * p * P[r][0]; g1 += 2 * p * P[r][1];
      }
      return [g0 / idx.length, g1 / idx.length];
    };
    return Q;
  }
  /** elliptical contours of a quad Q, clipped to the plot box */
  function contours(ctx, ax, Q, R, pal, levels) {
    pal = pal || palette(); levels = levels || 9;
    var kx = ax.box.w / (2 * R), ky = ax.box.h / (2 * R);
    var cx = ax.X(Q.w[0]), cy = ax.Y(Q.w[1]), Lref = 0.5 * Q.l1 * R * R, i;
    ctx.save();
    ctx.beginPath(); ctx.rect(ax.box.l, ax.box.t, ax.box.w, ax.box.h); ctx.clip();
    for (i = levels; i >= 1; i--) {
      var c = Lref * Math.pow(i / levels, 2);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Q.theta);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.sqrt(2 * c / Q.l1) * kx, Math.sqrt(2 * c / Q.l2) * ky, 0, 0, 6.2832);
      ctx.fillStyle = lerpColor(pal.dark ? [30, 32, 40] : [255, 253, 251], pal.a,
        0.09 + 0.05 * (levels - i));
      ctx.fill();
      ctx.strokeStyle = rgb(pal.a, 0.3); ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    ctx.strokeStyle = pal.axis; ctx.lineWidth = 1;
    ctx.strokeRect(ax.box.l, ax.box.t, ax.box.w, ax.box.h);
  }
  function cross(ctx, ax, x, y, color, r) {
    r = r || 5;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.7;
    var px = ax.X(x), py = ax.Y(y);
    ctx.beginPath(); ctx.moveTo(px - r, py - r); ctx.lineTo(px + r, py + r);
    ctx.moveTo(px + r, py - r); ctx.lineTo(px - r, py + r); ctx.stroke(); ctx.restore();
  }

  /* ---------- tiny MLP (1 -> h -> ... -> 1, tanh), hand-written backward ----------
     sizes e.g. [1,16,16,1]; gain scales the init; opt = Adam state.       */
  function mlpInit(sizes, gain, seed) {
    var r = rng(seed), P = [], k, i, j;
    for (k = 0; k + 1 < sizes.length; k++) {
      var W = [], a = sizes[k], b = sizes[k + 1];
      for (i = 0; i < a; i++) { W.push([]); for (j = 0; j < b; j++) W[i].push(r.normal() * gain / Math.sqrt(a)); }
      P.push({ W: W, b: new Array(b).fill(0), mW: null, vW: null, mb: null, vb: null, t: 0 });
    }
    return P;
  }
  function mlpFwd(P, x, skip) {
    var h = [x], hs = [h.slice()], zs = [], k, j, i;
    for (k = 0; k < P.length; k++) {
      var W = P[k].W, bb = P[k].b, out = [];
      for (j = 0; j < bb.length; j++) {
        var s = bb[j];
        for (i = 0; i < h.length; i++) s += h[i] * W[i][j];
        out.push(s);
      }
      zs.push(out.slice());
      if (k < P.length - 1) {
        for (j = 0; j < out.length; j++) out[j] = Math.tanh(out[j]);
        if (skip && h.length === out.length) for (j = 0; j < out.length; j++) out[j] += h[j];
      }
      h = out; hs.push(h.slice());
    }
    return { y: h[0], hs: hs, zs: zs };
  }
  /** accumulate gradients of mean (f(x)-y)^2 over a batch; returns loss */
  function mlpGrads(P, xs, ys, skip) {
    var G = P.map(function (L) {
      return { W: L.W.map(function (row) { return new Array(row.length).fill(0); }),
               b: new Array(L.b.length).fill(0) };
    });
    var n = xs.length, loss = 0, m, k, i, j;
    for (m = 0; m < n; m++) {
      var F = mlpFwd(P, xs[m], skip), e = F.y - ys[m];
      loss += e * e;
      var d = [2 * e / n];
      for (k = P.length - 1; k >= 0; k--) {
        var h = F.hs[k], W = P[k].W;
        for (i = 0; i < h.length; i++) for (j = 0; j < d.length; j++) G[k].W[i][j] += h[i] * d[j];
        for (j = 0; j < d.length; j++) G[k].b[j] += d[j];
        if (k > 0) {
          var nd = new Array(h.length).fill(0);
          for (i = 0; i < h.length; i++) for (j = 0; j < d.length; j++) nd[i] += d[j] * W[i][j];
          var z = F.zs[k - 1];
          for (i = 0; i < nd.length; i++) {
            var th = Math.tanh(z[i]);
            nd[i] = nd[i] * (1 - th * th) + (skip && F.hs[k - 1].length === h.length ? d[i] || 0 : 0);
          }
          d = nd;
        }
      }
    }
    return { G: G, loss: loss / n };
  }
  function mlpAdam(P, G, eta) {
    var k, i, j;
    for (k = 0; k < P.length; k++) {
      var L = P[k];
      if (!L.mW) {
        L.mW = L.W.map(function (r) { return new Array(r.length).fill(0); });
        L.vW = L.W.map(function (r) { return new Array(r.length).fill(0); });
        L.mb = new Array(L.b.length).fill(0); L.vb = new Array(L.b.length).fill(0);
      }
      L.t++;
      var c1 = 1 - Math.pow(0.9, L.t), c2 = 1 - Math.pow(0.999, L.t);
      for (i = 0; i < L.W.length; i++) for (j = 0; j < L.W[i].length; j++) {
        var g = G[k].W[i][j];
        L.mW[i][j] = 0.9 * L.mW[i][j] + 0.1 * g;
        L.vW[i][j] = 0.999 * L.vW[i][j] + 0.001 * g * g;
        L.W[i][j] -= eta * (L.mW[i][j] / c1) / (Math.sqrt(L.vW[i][j] / c2) + 1e-8);
      }
      for (j = 0; j < L.b.length; j++) {
        var gb = G[k].b[j];
        L.mb[j] = 0.9 * L.mb[j] + 0.1 * gb;
        L.vb[j] = 0.999 * L.vb[j] + 0.001 * gb * gb;
        L.b[j] -= eta * (L.mb[j] / c1) / (Math.sqrt(L.vb[j] / c2) + 1e-8);
      }
    }
  }

  /* ---------- theme & palette ---------- */
  function isDark() {
    try {
      var t = global.parent && global.parent.document &&
        global.parent.document.documentElement.dataset.theme;
      if (t === 'dark') return true;
      if (t === 'light') return false;
    } catch (e) { /* cross-origin */ }
    try { return global.matchMedia('(prefers-color-scheme: dark)').matches; }
    catch (e) { return false; }
  }
  function palette() {
    var dark = isDark();
    return dark
      ? { dark: true, bg: '#15161a', panel: '#1f2126', ink: '#e9e6e1', muted: '#9a988f',
          grid: 'rgba(255,255,255,0.09)', axis: 'rgba(255,255,255,0.28)', accent: '#d8a44a',
          a: [216, 164, 74], b: [120, 170, 255], c: [96, 186, 130], d: [226, 122, 122],
          e: [176, 140, 220] }
      : { dark: false, bg: '#fffdfb', panel: '#ffffff', ink: '#1f2733', muted: '#646c78',
          grid: 'rgba(0,0,0,0.07)', axis: 'rgba(0,0,0,0.28)', accent: '#2a4ea3',
          a: [42, 78, 163], b: [70, 150, 255], c: [46, 150, 92], d: [200, 60, 60],
          e: [130, 80, 190] };
  }
  function rgb(t, alpha) {
    return alpha == null ? 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')'
      : 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',' + alpha + ')';
  }
  function lerpColor(a, b, t) {
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
      Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
      Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function onThemeChange(cb) {
    try {
      var root = global.parent.document.documentElement;
      new MutationObserver(cb).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    } catch (e) { /* ignore */ }
    try { global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', cb); }
    catch (e) { /* ignore */ }
  }

  /* ---------- hi-DPI canvas ---------- */
  function hiDPICanvas(canvas) {
    var ctx = canvas.getContext('2d');
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = global.devicePixelRatio || 1;
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }
    return { ctx: ctx, resize: resize };
  }

  /* ---------- axes helper ----------
     opts: {x:[lo,hi], y:[lo,hi], pad:{l,r,t,b} (fractions of w/h),
            xticks:[v...], yticks:[v...], fmtx, fmty, xlab, ylab,
            logx:bool, logy:bool, pal}
     returns {X, Y, box:{l,r,t,b,w,h}}                          */
  function axes(ctx, s, o) {
    var pal = o.pal || palette();
    var pd = o.pad || {};
    var L = (pd.l == null ? 0.13 : pd.l) * s.w, R = (pd.r == null ? 0.03 : pd.r) * s.w;
    var T = (pd.t == null ? 0.07 : pd.t) * s.h, B = (pd.b == null ? 0.16 : pd.b) * s.h;
    var box = { l: L, r: s.w - R, t: T, b: s.h - B };
    box.w = box.r - box.l; box.h = box.b - box.t;
    var lx = o.logx, ly = o.logy;
    function fx(v) { return lx ? Math.log(Math.max(v, 1e-300)) : v; }
    function fy(v) { return ly ? Math.log(Math.max(v, 1e-300)) : v; }
    var x0 = fx(o.x[0]), x1 = fx(o.x[1]), y0 = fy(o.y[0]), y1 = fy(o.y[1]);
    function X(v) { return box.l + (fx(v) - x0) / (x1 - x0 || 1) * box.w; }
    function Y(v) { return box.b - (fy(v) - y0) / (y1 - y0 || 1) * box.h; }

    ctx.save();
    ctx.strokeStyle = pal.grid; ctx.lineWidth = 1;
    ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = pal.muted;
    var i, v;
    if (o.yticks) for (i = 0; i < o.yticks.length; i++) {
      v = o.yticks[i];
      ctx.beginPath(); ctx.moveTo(box.l, Y(v)); ctx.lineTo(box.r, Y(v)); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(o.fmty ? o.fmty(v) : String(v), box.l - 5, Y(v));
    }
    if (o.xticks) for (i = 0; i < o.xticks.length; i++) {
      v = o.xticks[i];
      ctx.beginPath(); ctx.moveTo(X(v), box.t); ctx.lineTo(X(v), box.b); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(o.fmtx ? o.fmtx(v) : String(v), X(v), box.b + 4);
    }
    ctx.strokeStyle = pal.axis;
    ctx.beginPath(); ctx.moveTo(box.l, box.t); ctx.lineTo(box.l, box.b); ctx.lineTo(box.r, box.b); ctx.stroke();
    if (o.xlab) { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillStyle = pal.muted; ctx.fillText(o.xlab, (box.l + box.r) / 2, s.h - 1); }
    if (o.ylab) {
      ctx.save(); ctx.translate(9, (box.t + box.b) / 2); ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = pal.muted;
      ctx.fillText(o.ylab, 0, 0); ctx.restore();
    }
    ctx.restore();
    return { X: X, Y: Y, box: box };
  }

  function clear(ctx, s, pal) {
    ctx.clearRect(0, 0, s.w, s.h);
    ctx.fillStyle = (pal || palette()).bg;
    ctx.fillRect(0, 0, s.w, s.h);
  }
  /** polyline through [[x,y],...] in data coords */
  function line(ctx, ax, pts, color, width, dash) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width == null ? 2 : width;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var px = ax.X(pts[i][0]), py = ax.Y(pts[i][1]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.restore();
  }
  function dot(ctx, ax, x, y, color, r) {
    ctx.fillStyle = color; ctx.beginPath();
    ctx.arc(ax.X(x), ax.Y(y), r == null ? 2.6 : r, 0, 6.2832); ctx.fill();
  }
  function label(ctx, x, y, text, color, align, size) {
    ctx.save();
    ctx.font = (size || 10) + 'px system-ui, sans-serif';
    ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y); ctx.restore();
  }
  /** legend panel inside the plot box. items = [{t, c}]; corner: 'tr'|'tl'|'br'|'bl' */
  function legend(ctx, ax, items, corner, pal) {
    pal = pal || palette();
    ctx.save();
    ctx.font = '10px system-ui, sans-serif';
    var w = 0, i;
    for (i = 0; i < items.length; i++) w = Math.max(w, ctx.measureText(items[i].t).width);
    w += 20; var h = items.length * 13 + 8;
    corner = corner || 'tr';
    var x = corner[1] === 'l' ? ax.box.l + 4 : ax.box.r - w - 4;
    var y = corner[0] === 't' ? ax.box.t + 4 : ax.box.b - h - 4;
    ctx.fillStyle = pal.dark ? 'rgba(21,22,26,0.78)' : 'rgba(255,253,251,0.82)';
    ctx.strokeStyle = pal.grid; ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 5); else ctx.rect(x, y, w, h);
    ctx.fill(); ctx.stroke();
    for (i = 0; i < items.length; i++) {
      var cy = y + 10 + i * 13;
      ctx.fillStyle = items[i].c;
      ctx.fillRect(x + 6, cy - 2, 9, 3);
      ctx.fillStyle = pal.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(items[i].t, x + 19, cy);
    }
    ctx.restore();
  }

  /** vertical/horizontal reference line with a caption */
  function ref(ctx, ax, opt) {
    ctx.save();
    ctx.strokeStyle = opt.color; ctx.lineWidth = opt.width || 1.3;
    ctx.setLineDash(opt.dash || [4, 4]);
    ctx.beginPath();
    if (opt.x != null) { ctx.moveTo(ax.X(opt.x), ax.box.t); ctx.lineTo(ax.X(opt.x), ax.box.b); }
    else { ctx.moveTo(ax.box.l, ax.Y(opt.y)); ctx.lineTo(ax.box.r, ax.Y(opt.y)); }
    ctx.stroke(); ctx.restore();
    if (opt.text) {
      if (opt.x != null) label(ctx, ax.X(opt.x) + 3, ax.box.t + 7, opt.text, opt.color);
      else label(ctx, ax.box.r - 3, ax.Y(opt.y) - 7, opt.text, opt.color, 'right');
    }
  }
  /** grouped bar chart. groups=[{label, vals:[...]}], series=[{name,color}] */
  function bars(ctx, s, pal, groups, series, o) {
    o = o || {};
    var maxv = o.max != null ? o.max : 0;
    if (!o.max) groups.forEach(function (g) { g.vals.forEach(function (v) { if (v > maxv) maxv = v; }); });
    maxv = maxv || 1;
    var ax = axes(ctx, s, { x: [0, groups.length], y: [0, maxv * 1.12], pad: o.pad,
      yticks: o.yticks || [0, maxv / 2, maxv], fmty: o.fmty, pal: pal, ylab: o.ylab });
    var gw = ax.box.w / groups.length, bw = gw * 0.72 / series.length;
    groups.forEach(function (g, gi) {
      var x0 = ax.box.l + gi * gw + gw * 0.14;
      g.vals.forEach(function (v, si) {
        var h = (v / (maxv * 1.12)) * ax.box.h;
        ctx.fillStyle = rgb(series[si].color, 0.85);
        ctx.fillRect(x0 + si * bw, ax.box.b - h, bw - 2, h);
        if (o.showVal) label(ctx, x0 + si * bw + (bw - 2) / 2, ax.box.b - h - 7,
          o.fmtv ? o.fmtv(v) : v.toFixed(3), pal.ink, 'center', 9);
      });
      label(ctx, ax.box.l + gi * gw + gw / 2, ax.box.b + 11, g.label, pal.muted, 'center');
    });
    return ax;
  }
  /** histogram of values into nb bins over [lo,hi] */
  function hist(vals, lo, hi, nb) {
    var h = new Array(nb).fill(0), i, k;
    for (i = 0; i < vals.length; i++) {
      k = Math.floor((vals[i] - lo) / (hi - lo) * nb);
      if (k < 0) k = 0; if (k >= nb) k = nb - 1;
      h[k]++;
    }
    return h;
  }

  global.MLF = {
    rng: rng, randn: randn, NOISE: NOISE, truth: truth, toy1d: toy1d, grid: grid,
    polyfit: polyfit, polyfitW: polyfitW, robustfit: robustfit, polyval: polyval, mse: mse, risk: risk, solveSym: solveSym,
    quad: quad, contours: contours, cross: cross,
    mlpInit: mlpInit, mlpFwd: mlpFwd, mlpGrads: mlpGrads, mlpAdam: mlpAdam,
    mean: mean, std: std, median: median, quantile: quantile,
    isDark: isDark, palette: palette, rgb: rgb, lerpColor: lerpColor, onThemeChange: onThemeChange,
    hiDPICanvas: hiDPICanvas, axes: axes, clear: clear, line: line, dot: dot,
    label: label, legend: legend, ref: ref, bars: bars, hist: hist
  };
})(window);
