/* Exact finite toy computations; shared by the browser and Node smoke tests. */
(function (root) {
  "use strict";
  const sum = a => a.reduce((s, x) => s + x, 0);
  const norm = a => Math.sqrt(sum(a.map(x => x * x)));
  const error = (a, b) => Math.max(0, ...a.map((x, i) => Math.abs(x - b[i])));
  const mod = (a, n) => ((a % n) + n) % n;
  function shift(x, q) { return x.map((_, i) => x[mod(i - q, x.length)]); }
  function correlation(x, kernel, circular) {
    return x.map((_, i) => sum(kernel.map((k, j) => {
      const v = i + j - Math.floor(kernel.length / 2);
      return k * (circular ? x[mod(v, x.length)] : (x[v] || 0));
    })));
  }
  function translation(q, stride, boundary) {
    const x = Array.from({length: 32}, (_, i) =>
      Math.exp(-(((i - 7) / 2.2) ** 2)) + 0.65 * Math.exp(-(((i - 23) / 3) ** 2)));
    const kernel = [-0.5, 0, 0.5];
    const base = correlation(x, kernel, boundary === "circular");
    const moved = correlation(shift(x, q), kernel, boundary === "circular");
    const sample = a => a.filter((_, i) => i % stride === 0);
    const actual = sample(moved), expected = shift(sample(base), Math.round(q / stride));
    return {x, movedX: shift(x, q), base: sample(base), actual, expected,
      compatible: q % stride === 0, defect: error(actual, expected),
      pools: [base, moved].map(a => sum(a.map(v => Math.max(v, 0))) / a.length)};
  }
  function rotate(image, n, q) {
    let out = image.slice();
    for (let r = 0; r < mod(q, 4); r++) {
      const prev = out; out = Array(n * n);
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
        out[(n - 1 - x) * n + y] = prev[y * n + x];
    }
    return out;
  }
  function conv2(image, kernel, n) {
    const side = Math.sqrt(kernel.length), half = Math.floor(side / 2);
    return image.map((_, i) => {
      const y = Math.floor(i / n), x = i % n; let value = 0;
      for (let j = 0; j < side; j++) for (let k = 0; k < side; k++) {
        const yy = y + j - half, xx = x + k - half;
        if (yy >= 0 && yy < n && xx >= 0 && xx < n)
          value += kernel[j * side + k] * image[yy * n + xx];
      }
      return value;
    });
  }
  function rotation(q) {
    const n = 9, x = Array(n * n).fill(0);
    for (let y = 2; y <= 6; y++) x[y * n + 3] = 1;
    for (let xx = 3; xx <= 6; xx++) x[6 * n + xx] = 0.7;
    const kernel = [0, -1, 0, 0, 0, 0, 0, 1, 0];
    const lift = image => Array.from({length: 4}, (_, r) => conv2(image, rotate(kernel, 3, r), n));
    const mix = h => h.map((_, r) => h[r].map((v, i) =>
      Math.tanh(v + 0.3 * h[mod(r + 1, 4)][i] - 0.2 * h[mod(r + 2, 4)][i])));
    const moved = rotate(x, n, q), base = lift(x), actual = lift(moved);
    const expected = base.map((_, r) => rotate(base[mod(r - q, 4)], n, q));
    const grouped = mix(actual), groupExpected = mix(base).map((_, r) => rotate(mix(base)[mod(r - q, 4)], n, q));
    const strength = h => h.map(a => sum(a.map(v => v * v)));
    return {n, x, moved, base, actual, expected, grouped,
      liftDefect: error(actual.flat(), expected.flat()),
      groupDefect: error(grouped.flat(), groupExpected.flat()),
      ordinaryDefect: error(actual[0], rotate(base[0], n, q)),
      strength: strength(actual)};
  }
  function reluVector(q) {
    let v = [1, -1];
    const rot = a => q === 0 ? a : q === 1 ? [-a[1], a[0]] :
      q === 2 ? [-a[0], -a[1]] : [a[1], -a[0]];
    const relu = a => a.map(x => Math.max(x, 0));
    const gate = a => a.map(x => x * Math.tanh(norm(a)));
    return {v, rv: rot(v), actual: relu(rot(v)), expected: rot(relu(v)),
      reluDefect: error(relu(rot(v)), rot(relu(v))),
      gateDefect: error(gate(rot(v)), rot(gate(v)))};
  }
  function setOutput(points, mode) {
    const features = points.map(p => [1, p[0], p[1], p[0] ** 2 + p[1] ** 2]);
    if (mode === "max") return features[0].map((_, j) => Math.max(...features.map(p => p[j])));
    const total = features[0].map((_, j) => sum(features.map(p => p[j])));
    return mode === "mean" ? total.map(x => x / points.length) : total;
  }
  function attention(points) {
    return points.map(query => {
      const s = points.map(key => sum(query.map((v, i) => v * key[i])) / Math.sqrt(2));
      const max = Math.max(...s), weights = s.map(v => Math.exp(v - max)), total = sum(weights);
      return query.map((_, i) => sum(points.map((p, j) => p[i] * weights[j])) / total);
    });
  }
  function graph(kind) {
    if (kind === "road") return {points: [[-0.8,0],[-0.2,-0.7],[0,0.6],[0.8,0]],
      edges: [[0,1],[0,2],[1,2],[1,3],[2,3]], values: [0.8,0.2,0.6,0.4]};
    const points = Array.from({length: 6}, (_, i) => [Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3)]);
    const edges = kind === "cycle" ? Array.from({length:6}, (_,i)=>[i,(i+1)%6]) :
      [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]];
    return {points, edges, values: Array(6).fill(1)};
  }
  function adjacency(g) {
    const a = g.points.map(() => g.points.map(() => 0));
    for (const [i,j] of g.edges) a[i][j] = a[j][i] = 1;
    return a;
  }
  function messages(a, x, rounds, mode) {
    let h = x.slice();
    for (let r = 0; r < rounds; r++) {
      const degree = a.map((row, i) => sum(row) + (mode === "gcn" ? 1 : 0));
      h = a.map((row,i) => {
        let value = 0;
        if (mode === "gcn") value = sum(row.map((v,j) =>
          (v + (i === j ? 1 : 0)) * h[j] / Math.sqrt(degree[i]*degree[j])));
        else value = sum(row.map((v,j)=>v*h[j])) / (mode === "mean" ? Math.max(1, degree[i]) : 1);
        return Math.tanh(0.6 * h[i] + 0.4 * value);
      });
    }
    return h;
  }
  function geometry(points, angle, translation, mirror) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const apply = (p, position) => {
      const x = (mirror ? -1 : 1) * p[0];
      return [c*x-s*p[1]+(position?translation:0),s*x+c*p[1],p[2]||0];
    };
    const moved = points.map(p=>apply(p,true));
    function compute(x) {
      const forces = x.map(()=>[0,0,0]); let energy=0; const distances=[];
      for(let i=0;i<x.length;i++)for(let j=i+1;j<x.length;j++){
        const r=x[i].map((v,k)=>v-x[j][k]); energy+=0.5*sum(r.map(v=>v*v));
        distances.push(norm(r));
        r.forEach((v,k)=>{forces[i][k]-=v;forces[j][k]+=v;});
      }
      const a=x[1].map((v,k)=>v-x[0][k]),b=x[2].map((v,k)=>v-x[0][k]),d=x[3].map((v,k)=>v-x[0][k]);
      const volume=a[0]*(b[1]*d[2]-b[2]*d[1])-a[1]*(b[0]*d[2]-b[2]*d[0])+a[2]*(b[0]*d[1]-b[1]*d[0]);
      return {energy, forces, distances, volume};
    }
    const base=compute(points), actual=compute(moved), expected=base.forces.map(p=>apply(p,false));
    return {moved,base,actual,expected,
      distanceDefect:error(base.distances,actual.distances),
      energyDefect:Math.abs(base.energy-actual.energy),
      forceDefect:error(actual.forces.flat(),expected.flat())};
  }
  const api={sum,norm,error,shift,correlation,translation,rotate,conv2,rotation,reluVector,
    setOutput,attention,graph,adjacency,messages,geometry};
  if(typeof module !== "undefined" && module.exports)module.exports=api;
  root.GDLSymmetry=api;
})(typeof window !== "undefined" ? window : globalThis);
