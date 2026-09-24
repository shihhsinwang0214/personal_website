(function (global) {
  'use strict';

  var M = global.MLF;
  if (!M) throw new Error('MLF helper must be loaded before _advanced-demo.js');

  function syncTheme() { document.body.classList.toggle('dark', M.isDark()); }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function fmt(x, d) {
    if (!isFinite(x)) return '∞';
    if (Math.abs(x) >= 1000) return x.toExponential(2);
    return x.toFixed(d == null ? 3 : d);
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function softmax(a) {
    var m = Math.max.apply(null, a), e = a.map(function (x) { return Math.exp(x - m); });
    var z = e.reduce(function (s, x) { return s + x; }, 0);
    return e.map(function (x) { return x / z; });
  }
  function gaussian(x, mu, sd) {
    return Math.exp(-0.5 * Math.pow((x - mu) / sd, 2)) / (Math.sqrt(2 * Math.PI) * sd);
  }
  function box(w, h, x, y, bw, bh) {
    return { l: x * w, t: y * h, w: bw * w, h: bh * h, r: (x + bw) * w, b: (y + bh) * h };
  }
  function px(B, x, xmin, xmax) { return B.l + (x - xmin) / (xmax - xmin) * B.w; }
  function py(B, y, ymin, ymax) { return B.b - (y - ymin) / (ymax - ymin) * B.h; }
  function text(ctx, s, x, y, str, color, align, weight) {
    ctx.save();
    ctx.fillStyle = color; ctx.font = (weight || 500) + ' ' + s + 'px system-ui, sans-serif';
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(str, x, y); ctx.restore();
  }
  function panel(ctx, B, pal) {
    ctx.save(); ctx.fillStyle = pal.panel; ctx.strokeStyle = pal.grid; ctx.lineWidth = 1;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(B.l, B.t, B.w, B.h, 10); else ctx.rect(B.l, B.t, B.w, B.h);
    ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function arrow(ctx, x1, y1, x2, y2, color, width) {
    var a = Math.atan2(y2 - y1, x2 - x1), r = 7;
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width || 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - r * Math.cos(a - .45), y2 - r * Math.sin(a - .45));
    ctx.lineTo(x2 - r * Math.cos(a + .45), y2 - r * Math.sin(a + .45)); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function path(ctx, pts, color, width, dash) {
    if (!pts.length) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.setLineDash(dash || []); ctx.beginPath();
    pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.stroke(); ctx.restore();
  }
  function axes(ctx, B, pal, xlab, ylab) {
    ctx.save(); ctx.strokeStyle = pal.axis; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(B.l, B.t); ctx.lineTo(B.l, B.b); ctx.lineTo(B.r, B.b); ctx.stroke(); ctx.restore();
    if (xlab) text(ctx, 10, (B.l + B.r) / 2, B.b + 13, xlab, pal.muted, 'center');
    if (ylab) text(ctx, 10, B.l + 5, B.t + 10, ylab, pal.muted);
  }
  function dot(ctx, x, y, r, color, stroke) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); } ctx.restore();
  }

  function addRange(host, label, min, max, step, value, formatter, oninput) {
    var wrap = el('div', 'control');
    var row = el('div', 'control-row'), lab = el('label', '', label), val = el('span', 'value');
    var input = el('input'); input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = value;
    row.append(lab, val); wrap.append(row, input); host.append(wrap);
    function update(trigger) { val.textContent = formatter ? formatter(+input.value) : input.value; if (trigger) oninput(+input.value); }
    input.addEventListener('input', function () { update(true); }); update(false); return input;
  }
  function addSelect(host, label, options, value, onchange) {
    var wrap = el('div', 'control'), lab = el('label', '', label), select = el('select');
    options.forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; select.append(op); });
    select.value = value; select.addEventListener('change', function () { onchange(select.value); }); wrap.append(lab, select); host.append(wrap); return select;
  }
  function addToggle(host, label, checked, onchange) {
    var wrap = el('label', 'toggle'), input = el('input'); input.type = 'checkbox'; input.checked = checked;
    wrap.append(input, document.createTextNode(label)); input.addEventListener('change', function () { onchange(input.checked); }); host.append(wrap); return input;
  }
  function addButtons(host, defs) {
    var wrap = el('div', 'buttons wide');
    defs.forEach(function (d) { var b = el('button', '', d[0]); b.type = 'button'; b.addEventListener('click', d[1]); wrap.append(b); });
    host.append(wrap); return wrap;
  }
  function makeStats(host, labels) {
    var grid = el('div', 'stats wide'), refs = {};
    Object.keys(labels).forEach(function (k) { var card = el('div', 'stat'), b = el('b', '', labels[k]), span = el('span', '', '—'); card.append(b, span); grid.append(card); refs[k] = span; });
    host.append(grid); return function (values) { Object.keys(values).forEach(function (k) { if (refs[k]) refs[k].textContent = values[k]; }); };
  }
  function addNote(host, value) { var p = el('p', 'micro wide', value); host.append(p); }

  function makeShell() {
    var body = document.body, shell = el('div', 'shell'), head = el('header', 'demo-head');
    var titleWrap = el('div'), eyebrow = el('p', 'eyebrow', body.dataset.kicker || 'Mathematical Foundations');
    var h1 = el('h1', '', body.dataset.title || '互動示範'), lede = el('p', 'lede', body.dataset.lede || '拖動控制項，比較變因如何改變圖形與數值。');
    titleWrap.append(eyebrow, h1); head.append(titleWrap, lede);
    var grid = el('div', 'demo-grid'), canvasCard = el('section', 'card canvas-card'), canvas = el('canvas');
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', body.dataset.title || '互動圖'); canvasCard.append(canvas);
    var controls = el('aside', 'card controls'); grid.append(canvasCard, controls);
    var obs = el('p', 'observation'); obs.innerHTML = '<strong>觀察：</strong>' + (body.dataset.observation || '改變控制項，觀察圖形與數字一起變化。');
    shell.append(head, grid, obs); body.append(shell); return { canvas: canvas, controls: controls };
  }

  function setupJensen(canvas, host, invalidate) {
    var st = { k: .8, spread: .4, logn: 0 };
    var setStats = makeStats(host, { gap: 'Jensen gap', variance: 'Var(X)', premium: '理性溢價', shape: '曲線' });
    addRange(host, '彎度 κ', -.8, 1.5, .01, st.k, function (x) { return x.toFixed(2); }, function (x) { st.k = x; invalidate(); });
    addRange(host, '散佈', 0, .46, .005, st.spread, function (x) { return x.toFixed(2); }, function (x) { st.spread = x; invalidate(); });
    addRange(host, '保單池大小 n（log₁₀）', 0, 5, .01, st.logn, function (x) { return '10^' + x.toFixed(1); }, function (x) { st.logn = x; invalidate(); });
    addNote(host, 'φ(x)=x+κ(x−0.5)²；兩點分佈的平均固定在 0.5。n 增大時，平均損失的 variance 以 1/n 縮小。');
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var B = box(s.w, s.h, .06, .09, .58, .72), G = box(s.w, s.h, .69, .18, .26, .52); panel(ctx, B, pal); panel(ctx, G, pal);
      var n = Math.pow(10, st.logn), d = st.spread / Math.sqrt(n), x1 = .5 - d, x2 = .5 + d;
      function phi(x) { return x + st.k * Math.pow(x - .5, 2); }
      var ys = []; for (var i = 0; i <= 120; i++) ys.push(phi(i / 120)); var ymin = Math.min.apply(null, ys) - .08, ymax = Math.max.apply(null, ys) + .08;
      axes(ctx, B, pal, '損失 x', '痛苦 φ(x)');
      var pts = []; for (i = 0; i <= 120; i++) { var x = i / 120; pts.push([px(B, x, 0, 1), py(B, phi(x), ymin, ymax)]); } path(ctx, pts, M.rgb(pal.b), 3);
      var y1 = phi(x1), y2 = phi(x2), ephi = (y1 + y2) / 2, phimean = phi(.5), gap = ephi - phimean;
      path(ctx, [[px(B, x1, 0, 1), py(B, y1, ymin, ymax)], [px(B, x2, 0, 1), py(B, y2, ymin, ymax)]], M.rgb(pal.d), 2);
      ctx.save(); ctx.strokeStyle = pal.axis; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px(B, .5, 0, 1), B.t); ctx.lineTo(px(B, .5, 0, 1), B.b); ctx.stroke(); ctx.restore();
      var gx = px(B, .5, 0, 1), gy1 = py(B, phimean, ymin, ymax), gy2 = py(B, ephi, ymin, ymax);
      path(ctx, [[gx, gy1], [gx, gy2]], M.rgb(pal.d), 5); dot(ctx, gx, gy1, 5, M.rgb(pal.b)); dot(ctx, gx, gy2, 6, pal.panel, M.rgb(pal.d));
      text(ctx, 11, gx + 8, gy1 + 11, 'φ(E[X])', M.rgb(pal.b)); text(ctx, 11, gx + 8, gy2 - 10, 'E[φ(X)]', M.rgb(pal.d));
      [x1, x2].forEach(function (x) { var bx = px(B, x, 0, 1); ctx.fillStyle = M.rgb(pal.a, .72); ctx.fillRect(bx - 9, B.b - 25, 18, 25); });
      text(ctx, 12, G.l + 14, G.t + 18, '理性溢價', pal.ink, 'left', 700);
      var gaugeL = G.l + 20, gaugeR = G.r - 20, gaugeY = G.t + G.h * .58;
      ctx.strokeStyle = pal.axis; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(gaugeL, gaugeY); ctx.lineTo(gaugeR, gaugeY); ctx.stroke();
      var extra = clamp(Math.abs(gap) * 2.5, 0, .45), baseX = mix(gaugeL, gaugeR, .5), premX = mix(gaugeL, gaugeR, .5 + (gap >= 0 ? extra : -extra));
      ctx.strokeStyle = gap >= 0 ? M.rgb(pal.c, .5) : M.rgb(pal.d, .5); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(baseX, gaugeY); ctx.lineTo(premX, gaugeY); ctx.stroke();
      dot(ctx, baseX, gaugeY, 5, pal.ink); dot(ctx, premX, gaugeY, 6, M.rgb(gap >= 0 ? pal.c : pal.d));
      text(ctx, 10, baseX, gaugeY + 22, 'E[X]', pal.muted, 'center'); text(ctx, 10, premX, gaugeY - 19, gap >= 0 ? '最高保費' : '偏好風險', pal.ink, 'center');
      text(ctx, 11, G.l + 14, G.b - 23, st.k > .01 ? 'convex：不等式向上' : st.k < -.01 ? 'concave：不等式反向' : 'linear：兩者相等', pal.muted);
      setStats({ gap: fmt(gap, 4), variance: fmt(d * d, 4), premium: (gap >= 0 ? '+' : '') + fmt(gap, 4), shape: st.k > .01 ? 'convex' : st.k < -.01 ? 'concave' : 'linear' });
    };
  }

  function setupKL(canvas, host, invalidate) {
    var st = { p: [.5, .3, .2], raw: [.6, .1, .3], decomp: true, seed: 9 };
    var setStats = makeStats(host, { klpq: 'KL(p‖q)', klqp: 'KL(q‖p)', hp: 'H(p)', cross: 'H(p,q)' });
    ['A', 'B', 'C'].forEach(function (name, i) {
      addRange(host, 'q(' + name + ') 權重', .003, 1, .001, st.raw[i], function (x) { return x.toFixed(3); }, function (x) { st.raw[i] = x; invalidate(); });
    });
    addToggle(host, '顯示 cross-entropy 分解', st.decomp, function (x) { st.decomp = x; invalidate(); });
    addButtons(host, [['交換 p、q', function () { var q = normalize(st.raw); st.raw = st.p.slice(); st.p = q; invalidate(); }], ['換一串天氣', function () { st.seed++; invalidate(); }]]);
    function normalize(a) { var z = a.reduce(function (s, x) { return s + x; }, 0); return a.map(function (x) { return x / z; }); }
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var L = box(s.w, s.h, .05, .08, .4, .76), R = box(s.w, s.h, .51, .08, .44, .76); panel(ctx, L, pal); panel(ctx, R, pal);
      var p = st.p, q = normalize(st.raw), terms = p.map(function (x, i) { return x * Math.log(x / Math.max(q[i], 1e-9)); });
      var klpq = terms.reduce(function (a, b) { return a + b; }, 0), klqp = q.reduce(function (a, x, i) { return a + x * Math.log(x / p[i]); }, 0);
      var hp = -p.reduce(function (a, x) { return a + x * Math.log(x); }, 0), cross = -p.reduce(function (a, x, i) { return a + x * Math.log(Math.max(q[i], 1e-9)); }, 0);
      text(ctx, 12, L.l + 14, L.t + 18, '逐格代價 p(x) log[p(x)/q(x)]', pal.ink, 'left', 700);
      var base = L.t + L.h * .62, maxA = Math.max(.12, Math.max.apply(null, terms.map(Math.abs)));
      ['A', 'B', 'C'].forEach(function (name, i) {
        var cx = L.l + L.w * (.2 + .3 * i), hh = terms[i] / maxA * L.h * .28;
        ctx.fillStyle = M.rgb(terms[i] >= 0 ? pal.d : pal.c, .78); ctx.fillRect(cx - 24, base - Math.max(0, hh), 48, Math.abs(hh));
        text(ctx, 11, cx, base + 17, name, pal.muted, 'center'); text(ctx, 10, cx, base - hh - (hh >= 0 ? 9 : -10), fmt(terms[i], 3), pal.ink, 'center');
        text(ctx, 10, cx, L.t + 52, 'p ' + p[i].toFixed(2), M.rgb(pal.b), 'center'); text(ctx, 10, cx, L.t + 68, 'q ' + q[i].toFixed(2), M.rgb(pal.a), 'center');
      });
      ctx.strokeStyle = pal.axis; ctx.beginPath(); ctx.moveTo(L.l + 18, base); ctx.lineTo(L.r - 18, base); ctx.stroke();
      text(ctx, 12, R.l + 14, R.t + 18, '同一串天氣下的 log 財富', pal.ink, 'left', 700);
      var rng = M.rng(st.seed), wp = 0, wq = 0, P = [], Q = [], gapPts = [];
      for (var t = 0; t <= 365; t++) {
        if (t) { var u = rng(), k = u < p[0] ? 0 : u < p[0] + p[1] ? 1 : 2; wp += Math.log(p[k]); wq += Math.log(Math.max(q[k], 1e-9)); }
        var xx = R.l + 18 + t / 365 * (R.w - 36), scale = .5;
        P.push([xx, R.t + R.h * .34 - wp * scale]); Q.push([xx, R.t + R.h * .34 - wq * scale]); gapPts.push(wp - wq);
      }
      var all = P.concat(Q), minY = Math.min.apply(null, all.map(function (a) { return a[1]; })), maxY = Math.max.apply(null, all.map(function (a) { return a[1]; }));
      function remap(arr) { return arr.map(function (a) { return [a[0], mix(R.t + 54, R.b - 35, (a[1] - minY) / Math.max(1, maxY - minY))]; }); }
      P = remap(P); Q = remap(Q); path(ctx, P, M.rgb(pal.b), 2.2); path(ctx, Q, M.rgb(pal.d), 2.2);
      text(ctx, 10, R.r - 20, P[P.length - 1][1] - 9, '照 p', M.rgb(pal.b), 'right'); text(ctx, 10, R.r - 20, Q[Q.length - 1][1] + 10, '照 q', M.rgb(pal.d), 'right');
      if (st.decomp) { text(ctx, 10, R.l + 18, R.b - 17, '不可避免 H(p) ＋ 用錯表多付 KL', pal.muted); }
      setStats({ klpq: fmt(klpq), klqp: fmt(klqp), hp: fmt(hp), cross: fmt(cross) });
    };
  }

  function setupEMA(canvas, host, invalidate) {
    var st = { beta: .9, speed: .55, sigma: .34, turn: false, bias: true };
    var setStats = makeStats(host, { lag: '理論滯後', noise: 'EMA 雜訊 σ', memory: '有效記憶', optimum: '誤差最小 β' });
    addRange(host, 'β', 0, .995, .001, st.beta, function (x) { return x.toFixed(3); }, function (x) { st.beta = x; invalidate(); });
    addRange(host, '狗速 v', .05, 1.2, .01, st.speed, function (x) { return x.toFixed(2); }, function (x) { st.speed = x; invalidate(); });
    addRange(host, '讀數雜訊 σ', .02, 1, .01, st.sigma, function (x) { return x.toFixed(2); }, function (x) { st.sigma = x; invalidate(); });
    addToggle(host, 'Adam 式 bias correction', st.bias, function (x) { st.bias = x; invalidate(); });
    addButtons(host, [['切換急轉彎', function () { st.turn = !st.turn; invalidate(); }], ['β 歸零', function () { st.beta = 0; location.reload(); }]]);
    addNote(host, '圖中亂數固定，改 β 時只改濾波器，不偷換一組比較容易的噪聲。');
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var T = box(s.w, s.h, .06, .07, .89, .48), E = box(s.w, s.h, .06, .62, .54, .28), S = box(s.w, s.h, .65, .62, .3, .28); panel(ctx, T, pal); panel(ctx, E, pal); panel(ctx, S, pal);
      var r = M.rng(42), truth = [], noisy = [], ema = [], m = 0;
      for (var i = 0; i < 180; i++) {
        var tt = i / 179, sign = st.turn && i > 95 ? -1 : 1, y = st.speed * (st.turn && i > 95 ? 190 - i : i) / 36 + .35 * Math.sin(i / 13);
        var z = y + st.sigma * r.normal(); m = st.beta * m + (1 - st.beta) * z;
        var mh = st.bias ? m / Math.max(1e-8, 1 - Math.pow(st.beta, i + 1)) : m;
        truth.push(y); noisy.push(z); ema.push(mh);
      }
      var lo = Math.min.apply(null, noisy.concat(truth)) - .3, hi = Math.max.apply(null, noisy.concat(truth)) + .3;
      function P(arr) { return arr.map(function (y, i) { return [px(T, i, 0, 179), py(T, y, lo, hi)]; }); }
      path(ctx, P(noisy), M.rgb(pal.a, .35), 1); path(ctx, P(truth), M.rgb(pal.b), 2); path(ctx, P(ema), M.rgb(pal.c), 3);
      text(ctx, 10, T.l + 12, T.t + 16, '真實軌跡', M.rgb(pal.b)); text(ctx, 10, T.l + 82, T.t + 16, '帶噪讀數', M.rgb(pal.a)); text(ctx, 10, T.l + 158, T.t + 16, 'EMA', M.rgb(pal.c));
      axes(ctx, E, pal, 'β', '總誤差'); var curve = [], bestB = 0, best = Infinity;
      for (i = 0; i <= 100; i++) { var b = i * .0099, lag = st.speed * b / Math.max(.01, 1 - b), ns = st.sigma * Math.sqrt((1 - b) / (1 + b)), err = lag * lag + ns * ns; if (err < best) { best = err; bestB = b; } curve.push([px(E, b, 0, .99), py(E, Math.min(err, 8), 0, 8)]); }
      path(ctx, curve, M.rgb(pal.d), 2.4); var lagNow = st.speed * st.beta / Math.max(.005, 1 - st.beta), noiseNow = st.sigma * Math.sqrt((1 - st.beta) / (1 + st.beta));
      dot(ctx, px(E, st.beta, 0, .99), py(E, Math.min(8, lagNow * lagNow + noiseNow * noiseNow), 0, 8), 5, M.rgb(pal.a));
      text(ctx, 11, S.l + 12, S.t + 16, '追自己的影子', pal.ink, 'left', 700);
      var ys1 = [], ys2 = [], ys3 = [], a = 1.1, b2 = 1.1, target = 0, e3 = 1.1;
      for (i = 0; i < 42; i++) { ys1.push(a); b2 += .25 * ((i % 2 ? -1 : 1) - b2); ys2.push(b2); target = st.beta * target + (1 - st.beta) * Math.sin(i / 7); e3 += .18 * (target - e3); ys3.push(e3); }
      function mini(arr, color) { path(ctx, arr.map(function (v, k) { return [S.l + 12 + k / 41 * (S.w - 24), S.t + S.h * .63 - v * S.h * .16]; }), color, 1.8); }
      mini(ys1, M.rgb(pal.a)); mini(ys2, M.rgb(pal.d)); mini(ys3, M.rgb(pal.c));
      text(ctx, 9, S.l + 12, S.b - 13, '平凡解 · 震盪 · stop-grad + EMA', pal.muted);
      setStats({ lag: fmt(lagNow, 2), noise: fmt(noiseNow, 3), memory: fmt(1 / Math.max(.005, 1 - st.beta), 1) + ' 步', optimum: bestB.toFixed(2) });
    };
  }

  function setupGenerator(canvas, host, invalidate) {
    var st = { theta: -1, machine: 'shift', spec: 'closed', n: 64, keepB: false, hA: [], hB: [] };
    var setStats = makeStats(host, { kl: 'KL', truth: '真梯度', estimate: '估計梯度 (A)', jitter: '末段抖動' });
    addRange(host, 'θ 初值／目前值', -3, 7, .01, st.theta, function (x) { return x.toFixed(2); }, function (x) { st.theta = x; st.hA = []; st.hB = []; invalidate(); });
    addSelect(host, '機器 Gθ(z)', [['shift', 'θ + z'], ['half', 'θ + 0.5z'], ['scale', 'θ + (0.4+0.12θ)z'], ['abs', 'θ + |z|']], st.machine, function (x) { st.machine = x; st.hA = []; st.hB = []; invalidate(); });
    addSelect(host, '規格 p*', [['closed', 'N(5,1) closed form'], ['samples', '只有 n 個樣本']], st.spec, function (x) { st.spec = x; invalidate(); });
    addRange(host, '規格樣本 n', 8, 256, 1, st.n, function (x) { return String(Math.round(x)); }, function (x) { st.n = x; invalidate(); });
    addToggle(host, '保留 (B)：有限樣本抖動', st.keepB, function (x) { st.keepB = x; invalidate(); });
    function params(theta) {
      if (st.machine === 'half') return { mu: theta, sd: .5, sens: 1 };
      if (st.machine === 'scale') return { mu: theta, sd: Math.max(.18, .4 + .12 * theta), sens: 1 };
      if (st.machine === 'abs') return { mu: theta + .798, sd: .603, sens: 1 };
      return { mu: theta, sd: 1, sens: 1 };
    }
    function grad(theta, noisy) { var p = params(theta), g = p.mu - 5; if (st.machine === 'scale') g += .12 * (p.sd - 1) / Math.max(.15, p.sd); if (noisy) g += Math.sin((st.hB.length + 1) * 2.17) * 3 / Math.sqrt(st.n); return g; }
    function step(count) {
      for (var i = 0; i < count; i++) { var g = grad(st.theta, false); st.theta -= .08 * g; st.hA.push(st.theta); var prev = st.hB.length ? st.hB[st.hB.length - 1] : st.theta; prev -= .08 * grad(prev, st.keepB || st.spec === 'samples'); st.hB.push(prev); }
      invalidate();
    }
    addButtons(host, [['走一步', function () { step(1); }], ['走 50 步', function () { step(50); }]]);
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var D = box(s.w, s.h, .06, .07, .89, .48), H = box(s.w, s.h, .06, .62, .89, .28); panel(ctx, D, pal); panel(ctx, H, pal);
      var pp = params(st.theta), xmin = -4, xmax = 9, maxd = 1.1, p1 = [], p2 = [], land = [];
      for (var i = 0; i <= 180; i++) { var x = mix(xmin, xmax, i / 180), a = gaussian(x, pp.mu, pp.sd), b = gaussian(x, 5, 1); p1.push([px(D, x, xmin, xmax), py(D, a, 0, maxd)]); p2.push([px(D, x, xmin, xmax), py(D, b, 0, maxd)]); land.push([px(D, x, xmin, xmax), D.b - 36 - clamp(Math.log(a + .01) - Math.log(b + .01), -3, 3) * 8]); }
      axes(ctx, D, pal, '產品 x', 'density'); path(ctx, p1, M.rgb(pal.b), 2.5); path(ctx, p2, M.rgb(pal.a), 2.2, [5, 4]); path(ctx, land, M.rgb(pal.d, .8), 1.8);
      text(ctx, 10, D.l + 14, D.t + 17, '機器 pθ', M.rgb(pal.b)); text(ctx, 10, D.l + 78, D.t + 17, '規格 p*', M.rgb(pal.a)); text(ctx, 10, D.l + 136, D.t + 17, 'log 比地形', M.rgb(pal.d));
      var rr = M.rng(13); for (i = 0; i < 28; i++) { var z = rr.normal(), sample = pp.mu + pp.sd * z, sx = px(D, sample, xmin, xmax), sy = D.b - 36; dot(ctx, sx, sy, 2.2, M.rgb(pal.b, .65)); var slope = sample - 5; arrow(ctx, sx, sy, sx - clamp(slope * 3, -18, 18), sy - 10, M.rgb(pal.c, .72), 1); }
      axes(ctx, H, pal, '更新步', 'θ');
      var maxN = Math.max(50, st.hA.length, st.hB.length); function hp(arr, color) { if (!arr.length) return; path(ctx, arr.map(function (v, k) { return [px(H, k, 0, maxN), py(H, v, -3, 7)]; }), color, 2); }
      hp(st.hA, M.rgb(pal.b)); hp(st.hB, M.rgb(pal.d)); ctx.strokeStyle = M.rgb(pal.a, .6); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(H.l, py(H, 5, -3, 7)); ctx.lineTo(H.r, py(H, 5, -3, 7)); ctx.stroke(); ctx.setLineDash([]);
      var kl = Math.log(1 / pp.sd) + (pp.sd * pp.sd + Math.pow(pp.mu - 5, 2)) / 2 - .5, g0 = grad(st.theta, false), ge = grad(st.theta, st.spec === 'samples');
      var tail = st.hB.slice(-20), jitter = tail.length > 1 ? M.std(tail) : 0;
      setStats({ kl: fmt(kl), truth: fmt(g0), estimate: fmt(ge), jitter: fmt(jitter) });
    };
  }

  function minCostFlow(supply, demand, cost) {
    var N = 8, src = 0, sink = 7, g = Array.from({ length: N }, function () { return []; }), refs = [];
    function edge(u, v, cap, c) { var a = { to: v, rev: g[v].length, cap: cap, cost: c, flow: 0 }, b = { to: u, rev: g[u].length, cap: 0, cost: -c, flow: 0 }; g[u].push(a); g[v].push(b); return a; }
    supply.forEach(function (x, i) { edge(src, 1 + i, x, 0); }); demand.forEach(function (x, j) { edge(4 + j, sink, x, 0); });
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) refs.push({ i: i, j: j, e: edge(1 + i, 4 + j, 1e9, cost[i][j]) });
    var total = supply.reduce(function (a, b) { return a + b; }, 0), sent = 0;
    while (sent < total - 1e-7) {
      var dist = new Array(N).fill(Infinity), prevN = new Array(N), prevE = new Array(N); dist[src] = 0;
      for (var it = 0; it < N - 1; it++) for (var u = 0; u < N; u++) if (isFinite(dist[u])) g[u].forEach(function (e, ei) { if (e.cap > 1e-9 && dist[e.to] > dist[u] + e.cost) { dist[e.to] = dist[u] + e.cost; prevN[e.to] = u; prevE[e.to] = ei; } });
      if (!isFinite(dist[sink])) break; var f = total - sent;
      for (var v = sink; v !== src; v = prevN[v]) f = Math.min(f, g[prevN[v]][prevE[v]].cap);
      for (v = sink; v !== src; v = prevN[v]) { var ee = g[prevN[v]][prevE[v]]; ee.cap -= f; g[v][ee.rev].cap += f; ee.flow += f; g[v][ee.rev].flow -= f; }
      sent += f;
    }
    var plan = Array.from({ length: 3 }, function () { return [0, 0, 0]; }); refs.forEach(function (r) { plan[r.i][r.j] = Math.max(0, r.e.flow); }); return plan;
  }

  function setupWarehouse(canvas, host, invalidate) {
    var st = { a: [10, 20, 30], b: [25, 15, 20], c: [[3, 8, 6], [4, 2, 5], [7, 3, 2]], independent: false, plan: null };
    var setStats = makeStats(host, { cost: '總油錢', routes: '非零路線', balance: '供需總量', monge: 'Monge 可行？' });
    function norm(a) { var z = a.reduce(function (x, y) { return x + y; }, 0); return a.map(function (x) { return x * 60 / z; }); }
    ['倉庫 1', '倉庫 2', '倉庫 3'].forEach(function (name, i) { addRange(host, name + ' 供給', 2, 40, 1, st.a[i], Math.round, function (x) { st.a[i] = x; st.plan = null; invalidate(); }); });
    ['店 1', '店 2', '店 3'].forEach(function (name, i) { addRange(host, name + ' 需求', 2, 40, 1, st.b[i], Math.round, function (x) { st.b[i] = x; st.plan = null; invalidate(); }); });
    var title = el('div', 'control-title wide', '每箱油錢 cᵢⱼ（可改）'), grid = el('div', 'cost-grid wide'); host.append(title, grid);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) (function (ii, jj) { var inp = el('input'); inp.type = 'number'; inp.min = 0; inp.max = 20; inp.step = .5; inp.value = st.c[ii][jj]; inp.setAttribute('aria-label', '倉庫 ' + (ii + 1) + ' 到店 ' + (jj + 1) + ' 的油錢'); inp.addEventListener('input', function () { st.c[ii][jj] = +inp.value; st.plan = null; invalidate(); }); grid.append(inp); })(i, j);
    addToggle(host, '改看獨立 coupling', st.independent, function (x) { st.independent = x; invalidate(); });
    addButtons(host, [['求最佳解', function () { st.independent = false; st.plan = minCostFlow(norm(st.a), norm(st.b), st.c); invalidate(); }], ['重設成本', function () { st.c = [[3, 8, 6], [4, 2, 5], [7, 3, 2]]; st.plan = null; location.reload(); }]]);
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var Map = box(s.w, s.h, .04, .08, .47, .78), Tab = box(s.w, s.h, .56, .08, .4, .78); panel(ctx, Map, pal); panel(ctx, Tab, pal);
      var a = norm(st.a), b = norm(st.b), plan = st.plan || minCostFlow(a, b, st.c); if (st.independent) plan = a.map(function (x) { return b.map(function (y) { return x * y / 60; }); });
      var wx = Map.l + Map.w * .2, sx = Map.l + Map.w * .8, ys = [Map.t + Map.h * .2, Map.t + Map.h * .5, Map.t + Map.h * .8];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) if (plan[i][j] > .05) { ctx.strokeStyle = M.rgb(pal.b, .55); ctx.lineWidth = .6 + plan[i][j] / 5; ctx.beginPath(); ctx.moveTo(wx, ys[i]); ctx.lineTo(sx, ys[j]); ctx.stroke(); }
      for (i = 0; i < 3; i++) { dot(ctx, wx, ys[i], 10 + a[i] / 5, M.rgb(pal.a), pal.panel); text(ctx, 10, wx - 26, ys[i], 'W' + (i + 1) + ' ' + a[i].toFixed(0), pal.ink, 'right'); ctx.fillStyle = M.rgb(pal.c); ctx.fillRect(sx - 10 - b[i] / 8, ys[i] - 10 - b[i] / 8, 20 + b[i] / 4, 20 + b[i] / 4); text(ctx, 10, sx + 27, ys[i], 'S' + (i + 1) + ' ' + b[i].toFixed(0), pal.ink); }
      text(ctx, 11, Map.l + 13, Map.t + 16, st.independent ? '獨立 coupling' : '最小成本 coupling', pal.ink, 'left', 700);
      var cell = Math.min(Tab.w * .2, Tab.h * .18), x0 = Tab.l + 35, y0 = Tab.t + 46, maxP = Math.max.apply(null, plan.flat());
      text(ctx, 11, Tab.l + 13, Tab.t + 17, '運輸表 πᵢⱼ', pal.ink, 'left', 700);
      var cost = 0, routes = 0;
      for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) { var v = plan[i][j]; cost += v * st.c[i][j]; if (v > 1e-5) routes++; ctx.fillStyle = M.rgb(pal.b, .08 + .72 * v / Math.max(1, maxP)); ctx.fillRect(x0 + j * cell, y0 + i * cell, cell - 3, cell - 3); text(ctx, 12, x0 + j * cell + cell / 2, y0 + i * cell + cell / 2, v.toFixed(1), pal.ink, 'center', 700); text(ctx, 8, x0 + j * cell + cell - 7, y0 + i * cell + 9, '×' + st.c[i][j], pal.muted, 'right'); }
      for (i = 0; i < 3; i++) { text(ctx, 9, x0 - 8, y0 + i * cell + cell / 2, 'a' + (i + 1), pal.muted, 'right'); text(ctx, 9, x0 + i * cell + cell / 2, y0 - 10, 'b' + (i + 1), pal.muted, 'center'); }
      text(ctx, 10, Tab.l + 14, Tab.b - 30, '列和＝供給；欄和＝需求', M.rgb(pal.c));
      var monge = a.every(function (x) { return b.some(function (y) { return Math.abs(x - y) < 1e-6; }); }) ? '有可能' : '通常沒有';
      setStats({ cost: fmt(cost, 1), routes: routes + ' / 上限 5', balance: '60 = 60', monge: monge });
    };
  }

  function setupW2(canvas, host, invalidate) {
    var st = { m: 3, sigma: 1, coupling: 'optimal', uniform: false };
    var setStats = makeStats(host, { w2: 'W₂', kl: 'KL(μ‖ν)', tv: 'Total variation', cost: '目前搬法 RMS' });
    addRange(host, 'ν 的均值 m', -10, 10, .05, st.m, function (x) { return x.toFixed(2); }, function (x) { st.m = x; invalidate(); });
    addRange(host, 'ν 的標準差 σ', .2, 4, .01, st.sigma, function (x) { return x.toFixed(2); }, function (x) { st.sigma = x; invalidate(); });
    addSelect(host, 'coupling', [['optimal', '最佳：quantile 對 quantile'], ['independent', '獨立：隨機配'], ['reverse', '反向：故意配反']], st.coupling, function (x) { st.coupling = x; invalidate(); });
    addToggle(host, '改成有界支撐 uniform', st.uniform, function (x) { st.uniform = x; invalidate(); });
    function tvGaussian(m, sd) { var dx = .02, sum = 0; for (var x = -14; x <= 14; x += dx) sum += .5 * Math.abs(gaussian(x, 0, 1) - gaussian(x, m, sd)) * dx; return sum; }
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var T = box(s.w, s.h, .06, .06, .89, .52), C = box(s.w, s.h, .06, .66, .89, .25); panel(ctx, T, pal); panel(ctx, C, pal);
      var xmin = -12, xmax = 12, curveA = [], curveB = [], root3 = Math.sqrt(3), maxD = st.uniform ? .4 : .8;
      function dens(x, mu, sd) { if (!st.uniform) return gaussian(x, mu, sd); return Math.abs(x - mu) <= root3 * sd ? 1 / (2 * root3 * sd) : 0; }
      for (var i = 0; i <= 240; i++) { var x = mix(xmin, xmax, i / 240); curveA.push([px(T, x, xmin, xmax), py(T, dens(x, 0, 1), 0, maxD)]); curveB.push([px(T, x, xmin, xmax), py(T, dens(x, st.m, st.sigma), 0, maxD)]); }
      axes(ctx, T, pal, 'x', 'density'); path(ctx, curveA, M.rgb(pal.b), 2.5); path(ctx, curveB, M.rgb(pal.d), 2.5);
      for (i = 1; i < 40; i++) { var u = (i - .5) / 40, z = Math.sqrt(2) * erfinv(2 * u - 1), xa = st.uniform ? (2 * u - 1) * root3 : z, yq;
        if (st.coupling === 'reverse') yq = st.m + st.sigma * (st.uniform ? -(2 * u - 1) * root3 : -z);
        else if (st.coupling === 'independent') { var u2 = ((i * 17) % 40 + .5) / 40, z2 = Math.sqrt(2) * erfinv(2 * u2 - 1); yq = st.m + st.sigma * (st.uniform ? (2 * u2 - 1) * root3 : z2); }
        else yq = st.m + st.sigma * xa;
        ctx.strokeStyle = M.rgb(pal.a, .22); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px(T, xa, xmin, xmax), T.b - 4); ctx.lineTo(px(T, yq, xmin, xmax), T.b - 28); ctx.stroke();
      }
      axes(ctx, C, pal, 'm', 'distance'); var wcurve = [], klcurve = [], tvcurve = [];
      for (i = 0; i <= 120; i++) { var mm = mix(-10, 10, i / 120), w = Math.sqrt(mm * mm + Math.pow(st.sigma - 1, 2)); wcurve.push([px(C, mm, -10, 10), py(C, Math.min(w, 12), 0, 12)]); if (!st.uniform) klcurve.push([px(C, mm, -10, 10), py(C, Math.min(12, Math.log(st.sigma) + (1 + mm * mm) / (2 * st.sigma * st.sigma) - .5), 0, 12)]); tvcurve.push([px(C, mm, -10, 10), py(C, st.uniform ? Math.min(1, Math.abs(mm) / (2 * root3)) * 12 : tvGaussian(mm, st.sigma) * 12, 0, 12)]); }
      path(ctx, wcurve, M.rgb(pal.b), 2); if (!st.uniform) path(ctx, klcurve, M.rgb(pal.d), 1.7); path(ctx, tvcurve, M.rgb(pal.c), 1.7);
      text(ctx, 9, C.l + 10, C.t + 12, 'W₂', M.rgb(pal.b)); text(ctx, 9, C.l + 42, C.t + 12, 'KL', M.rgb(pal.d)); text(ctx, 9, C.l + 68, C.t + 12, 'TV×12', M.rgb(pal.c));
      var w2 = Math.sqrt(st.m * st.m + Math.pow(st.sigma - 1, 2)), kl;
      if (!st.uniform) kl = Math.log(st.sigma) + (1 + st.m * st.m) / (2 * st.sigma * st.sigma) - .5;
      else { var contains = st.m - root3 * st.sigma <= -root3 && st.m + root3 * st.sigma >= root3; kl = contains ? Math.log(st.sigma) : Infinity; }
      var tv = st.uniform ? clamp(Math.abs(st.m) / (2 * root3), 0, 1) : tvGaussian(st.m, st.sigma), c2 = st.coupling === 'optimal' ? w2 * w2 : st.coupling === 'independent' ? 1 + st.sigma * st.sigma + st.m * st.m : Math.pow(1 + st.sigma, 2) + st.m * st.m;
      setStats({ w2: fmt(w2), kl: fmt(kl), tv: fmt(tv), cost: fmt(Math.sqrt(c2)) });
    };
  }

  function erfinv(x) {
    var a = .147, ln = Math.log(1 - x * x), p = 2 / (Math.PI * a) + ln / 2;
    return Math.sign(x) * Math.sqrt(Math.sqrt(p * p - ln / a) - p);
  }
  function permutations(n) {
    var out = [], a = Array.from({ length: n }, function (_, i) { return i; });
    function rec(k) { if (k === n) return out.push(a.slice()); for (var i = k; i < n; i++) { var t = a[k]; a[k] = a[i]; a[i] = t; rec(k + 1); t = a[k]; a[k] = a[i]; a[i] = t; } } rec(0); return out;
  }

  function setupMonotone(canvas, host, invalidate) {
    var perms = permutations(5), st = { p: 2, x: [-.88, -.5, -.12, .37, .78], y: [-.72, -.3, .08, .5, .9], showRandom: false, perm: [2, 4, 0, 3, 1], drag: null };
    var setStats = makeStats(host, { cost: '目前成本', optimum: '最佳成本', crossings: '交叉數', regime: '成本區域' });
    addRange(host, '成本次方 p', .3, 3, .01, st.p, function (x) { return x.toFixed(2); }, function (x) { st.p = x; st.showRandom = false; invalidate(); });
    addButtons(host, [['隨機打亂配法', function () { st.perm = st.perm.slice().sort(function () { return Math.random() - .5; }); st.showRandom = true; invalidate(); }], ['交換一個交叉', function () { uncross(); invalidate(); }], ['重抽端點', function () { var r = M.rng(Date.now()); st.x = st.x.map(function (_, i) { return -1 + (i + .35 + .3 * r()) * .4; }); st.y = st.y.map(function (_, i) { return -1 + (i + .35 + .3 * r()) * .4; }); st.showRandom = false; invalidate(); }]]);
    addNote(host, '可直接拖動上、下兩排的點。p>1 是 convex 搬運成本；p=1 可能多解；p<1 對長途有折扣。');
    function cost(perm) { return perm.reduce(function (sum, j, i) { return sum + Math.pow(Math.abs(st.x[i] - st.y[j]), st.p); }, 0); }
    function optimum() { var best = perms[0], v = cost(best); perms.forEach(function (p) { var c = cost(p); if (c < v - 1e-9) { v = c; best = p; } }); return { p: best.slice(), c: v }; }
    function crossings(p) { var n = 0; for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) if ((st.x[i] - st.x[j]) * (st.y[p[i]] - st.y[p[j]]) < 0) n++; return n; }
    function uncross() { for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) if ((st.x[i] - st.x[j]) * (st.y[st.perm[i]] - st.y[st.perm[j]]) < 0) { var t = st.perm[i]; st.perm[i] = st.perm[j]; st.perm[j] = t; return; } st.showRandom = false; }
    function hit(ev) { var r = canvas.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height; var row = y < .38 ? 'x' : y < .62 ? 'y' : null; if (!row) return null; var arr = st[row], best = 1, bi = -1; arr.forEach(function (v, i) { var d = Math.abs((v + 1) / 2 - x); if (d < best) { best = d; bi = i; } }); return best < .08 ? { row: row, i: bi } : null; }
    canvas.addEventListener('pointerdown', function (e) { st.drag = hit(e); if (st.drag) canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) { if (!st.drag) return; var r = canvas.getBoundingClientRect(), v = clamp((e.clientX - r.left) / r.width * 2 - 1, -.96, .96); st[st.drag.row][st.drag.i] = v; st.showRandom = false; invalidate(); });
    canvas.addEventListener('pointerup', function () { st.drag = null; });
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var Street = box(s.w, s.h, .05, .05, .9, .56), Curve = box(s.w, s.h, .08, .69, .84, .23); panel(ctx, Street, pal); panel(ctx, Curve, pal);
      var opt = optimum(), perm = st.showRandom ? st.perm : opt.p, yTop = Street.t + Street.h * .25, yBot = Street.t + Street.h * .74;
      for (var i = 0; i < 5; i++) { var x1 = px(Street, st.x[i], -1, 1), x2 = px(Street, st.y[perm[i]], -1, 1); ctx.strokeStyle = crossings(perm) ? M.rgb(pal.d, .65) : M.rgb(pal.c, .65); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, yTop); ctx.lineTo(x2, yBot); ctx.stroke(); text(ctx, 9, (x1 + x2) / 2, (yTop + yBot) / 2, Math.abs(st.x[i] - st.y[perm[i]]).toFixed(2), pal.muted, 'center'); }
      st.x.forEach(function (v, i) { dot(ctx, px(Street, v, -1, 1), yTop, 9, M.rgb(pal.b), pal.panel); text(ctx, 9, px(Street, v, -1, 1), yTop - 16, 'x' + (i + 1), pal.ink, 'center'); });
      st.y.forEach(function (v, i) { dot(ctx, px(Street, v, -1, 1), yBot, 9, M.rgb(pal.a), pal.panel); text(ctx, 9, px(Street, v, -1, 1), yBot + 17, 'y' + (i + 1), pal.ink, 'center'); });
      text(ctx, 11, Street.l + 12, Street.t + 16, st.showRandom ? '目前：手動配法' : '目前：枚舉 120 種後的最佳配法', pal.ink, 'left', 700);
      axes(ctx, Curve, pal, '距離 d', 'c(d)'); var cp = []; for (i = 0; i <= 100; i++) { var d = i / 100 * 2; cp.push([px(Curve, d, 0, 2), py(Curve, Math.pow(d, st.p), 0, Math.pow(2, 3))]); } path(ctx, cp, M.rgb(pal.b), 2.2);
      var nCross = crossings(perm); setStats({ cost: fmt(cost(perm)), optimum: fmt(opt.c), crossings: String(nCross), regime: st.p > 1.01 ? 'convex' : st.p < .99 ? 'concave' : 'linear' });
    };
  }

  function setupApprox(canvas, host, invalidate) {
    var st = { mode: 'sinkhorn', loge: -1, B: 16, iter: 0, seed: 4, same: false, divergence: true };
    var setStats = makeStats(host, { cost: '近似成本', exact: '精確 OT 基線', entropy: 'coupling entropy', violation: '邊際違反量' });
    addSelect(host, '近似模式', [['sinkhorn', 'Sinkhorn／entropic'], ['minibatch', 'Minibatch OT']], st.mode, function (x) { st.mode = x; st.iter = 0; invalidate(); });
    addRange(host, 'log₁₀ ε', -2, 1, .01, st.loge, function (x) { return x.toFixed(2); }, function (x) { st.loge = x; st.iter = 0; invalidate(); });
    addRange(host, 'minibatch B', 2, 120, 1, st.B, function (x) { return String(Math.round(x)); }, function (x) { st.B = x; invalidate(); });
    addToggle(host, 'μ＝ν（兩組獨立樣本）', st.same, function (x) { st.same = x; invalidate(); });
    addToggle(host, '顯示 Sinkhorn divergence 修正', st.divergence, function (x) { st.divergence = x; invalidate(); });
    addButtons(host, [['單步正規化', function () { st.iter++; invalidate(); }], ['再抽一組', function () { st.seed++; invalidate(); }]]);
    addNote(host, '為保持手機流暢，畫面用 60 點解析 surrogate；偏差方向與精確演算法相同，但不是效能 benchmark。');
    return function (ctx, s) {
      var pal = M.palette(); M.clear(ctx, s, pal); var P = box(s.w, s.h, .04, .07, .52, .79), Charts = box(s.w, s.h, .61, .07, .35, .79); panel(ctx, P, pal); panel(ctx, Charts, pal);
      var r = M.rng(st.seed), A = [], B = [], shift = st.same ? 0 : 1.15;
      for (var i = 0; i < 60; i++) { var a = [r.normal() * .42 - .55, r.normal() * .35], b = [r.normal() * .42 + shift - .55, r.normal() * .35 + (st.same ? 0 : .18)]; A.push(a); B.push(b); }
      function X(v) { return px(P, v, -1.8, 2.1); } function Y(v) { return py(P, v, -1.25, 1.25); }
      var eps = Math.pow(10, st.loge), count = st.mode === 'minibatch' ? Math.min(st.B, 28) : 28, fan = st.mode === 'sinkhorn' ? Math.max(1, Math.min(5, Math.round(1 + eps))) : 1;
      for (i = 0; i < count; i++) for (var f = 0; f < fan; f++) { var j = st.mode === 'minibatch' ? (i * 17 + st.seed) % 60 : (i + f) % 60; ctx.strokeStyle = M.rgb(pal.a, .1 + .25 / fan); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(A[i][0]), Y(A[i][1])); ctx.lineTo(X(B[j][0]), Y(B[j][1])); ctx.stroke(); }
      A.forEach(function (p) { dot(ctx, X(p[0]), Y(p[1]), 2.5, M.rgb(pal.b, .7)); }); B.forEach(function (p) { dot(ctx, X(p[0]), Y(p[1]), 2.5, M.rgb(pal.d, .7)); });
      text(ctx, 11, P.l + 12, P.t + 16, st.mode === 'sinkhorn' ? 'ε 增大：一點連成一把扇' : 'B 變小：組內被迫配出長線', pal.ink, 'left', 700);
      var exact = st.same ? .03 : 1.35, approx = st.mode === 'sinkhorn' ? exact + .22 * eps : exact + 7 / st.B;
      if (st.same && st.divergence && st.mode === 'sinkhorn') approx = Math.max(.015, approx - .22 * eps);
      var entropy = st.mode === 'sinkhorn' ? Math.log(1 + eps * 8) : Math.log(Math.max(2, st.B)) / 5, violation = st.mode === 'sinkhorn' ? Math.exp(-st.iter / 3) : 0;
      var Top = { l: Charts.l + 20, r: Charts.r - 14, t: Charts.t + 45, b: Charts.t + Charts.h * .47 }; Top.w = Top.r - Top.l; Top.h = Top.b - Top.t;
      axes(ctx, Top, pal, 'log ε', '成本'); var ce = []; for (i = 0; i <= 80; i++) { var le = mix(-2, 1, i / 80), e = Math.pow(10, le), v = exact + .22 * e; if (st.same && st.divergence) v = exact; ce.push([px(Top, le, -2, 1), py(Top, Math.min(4, v), 0, 4)]); } path(ctx, ce, M.rgb(pal.b), 2);
      ctx.strokeStyle = M.rgb(pal.c, .7); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(Top.l, py(Top, exact, 0, 4)); ctx.lineTo(Top.r, py(Top, exact, 0, 4)); ctx.stroke(); ctx.setLineDash([]);
      var Bot = { l: Charts.l + 20, r: Charts.r - 14, t: Charts.t + Charts.h * .59, b: Charts.b - 26 }; Bot.w = Bot.r - Bot.l; Bot.h = Bot.b - Bot.t;
      axes(ctx, Bot, pal, 'B', '成本'); var cb = []; for (i = 2; i <= 120; i += 2) cb.push([px(Bot, i, 2, 120), py(Bot, Math.min(4, exact + 7 / i), 0, 4)]); path(ctx, cb, M.rgb(pal.d), 2);
      text(ctx, 10, Charts.l + 13, Charts.t + 17, '兩個參數都在精確 OT 與隨機配對之間插值', pal.muted);
      setStats({ cost: fmt(approx), exact: fmt(exact), entropy: fmt(entropy), violation: fmt(violation) + (st.iter % 2 ? '（欄）' : '（列）') });
    };
  }

  var setups = { jensen: setupJensen, kl: setupKL, ema: setupEMA, generator: setupGenerator, warehouse: setupWarehouse, w2: setupW2, monotone: setupMonotone, approx: setupApprox };

  function mount() {
    syncTheme(); var ui = makeShell(), hi = M.hiDPICanvas(ui.canvas), redraw = function () {};
    var setup = setups[document.body.dataset.demo]; if (!setup) throw new Error('Unknown demo: ' + document.body.dataset.demo);
    var draw = setup(ui.canvas, ui.controls, function () { redraw(); });
    redraw = function () { syncTheme(); var size = hi.resize(); draw(hi.ctx, size); };
    new ResizeObserver(redraw).observe(ui.canvas); M.onThemeChange(redraw); redraw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(window);
