/**
 * molecules.ts — geometry for the Geometric Deep Learning map (MoleculeMap.astro).
 *
 * Every unit is drawn as a different molecular motif, and each motif is chosen because its
 * own symmetry IS the unit's topic — so the picture teaches the same thing the notes do:
 *
 *   chain     G1 Translation     a zig-zag polymer: shift one repeat unit and it maps onto itself;
 *                                the chain ends are the "boundaries" the unit worries about
 *   ring      G2 Rotation        an aromatic ring with C_n symmetry; arrows on the atoms are a
 *                                vector-type feature that turns with the ring (feature types)
 *   star      G3 Sets            identical ligands on one centre (BF3-like): swapping any two
 *                                leaves the molecule unchanged — permutation invariance
 *   clique    G4 Attention       a cluster where every atom bonds to every other, with bond
 *                                strengths that vary (attention weights) and a few absent (masks)
 *   tree      G5 Graphs          a branched molecule; messages flow along bonds toward the centre,
 *                                and the dashed rings are the 1-hop / 2-hop receptive fields
 *   chiral    G6 Euclidean       a stereocentre in wedge/dash notation beside its mirror image —
 *                                rotation keeps it, reflection does not: chirality
 *   orbital   G7 Tensor features a d-orbital: spherical harmonics are what tensor features are built on
 *   fused     G8 Spectral        naphthalene with the ±± pattern of its highest graph eigenmode
 *                                (Hückel theory is literally spectral graph theory)
 *   bowl      G9 Surfaces        corannulene, the bowl-shaped carbon, with two local frames on its rim
 *   distorted G10 Approx. symm.  a Jahn–Teller-distorted ring over its ideal shape, plus a canonical axis
 *   cloud     G11 Generation     scattered noise flowing into a ring: noise → structure
 *
 * Every generator takes the number of atoms (= notes in the unit) and works for any count,
 * so writing or merging a note grows or shrinks the motif instead of breaking it.
 * Pure functions, no Astro imports — testable with plain Node.
 */

export type MoleculeMotif =
  | 'chain' | 'ring' | 'star' | 'clique' | 'tree' | 'chiral'
  | 'orbital' | 'fused' | 'bowl' | 'distorted' | 'cloud';

export const MOTIFS: MoleculeMotif[] = [
  'chain', 'ring', 'star', 'clique', 'tree', 'chiral', 'orbital', 'fused', 'bowl', 'distorted', 'cloud',
];

export interface Pt { x: number; y: number }
export type BondKind = 'single' | 'wedge' | 'hash' | 'weighted' | 'message' | 'skeleton';
/** `ia` / `ib` are atom indices (a negative index is a phantom atom), so demos can address a bond. */
export interface Bond { a: Pt; b: Pt; kind: BondKind; w?: number; ia?: number; ib?: number }
export type Deco =
  | { kind: 'path'; d: string; cls: string }
  | { kind: 'circle'; cx: number; cy: number; r: number; cls: string }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rot: number; cls: string }
  | { kind: 'text'; x: number; y: number; s: string; cls: string };
export interface Motif {
  atoms: Pt[];
  bonds: Bond[];
  deco: Deco[];
  /** Chain only: atoms just left of the chain (hidden at rest) that slide in during the translation demo. */
  phantoms?: Pt[];
  phantomBonds?: Bond[];
  /** Chain only: one repeat unit, the distance the translation demo shifts by. */
  shift?: number;
}

const f = (n: number) => Number(n.toFixed(1));
const P = (x: number, y: number): Pt => ({ x: f(x), y: f(y) });
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) =>
  P(cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg)));
const line = (a: Pt, b: Pt) => `M${a.x},${a.y} L${b.x},${b.y}`;
const EMPTY: Motif = { atoms: [], bonds: [], deco: [] };

/** Deterministic 0..1 noise so every build draws the same picture. */
export function hash01(i: number, j: number, seed: number): number {
  const s = Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

/** A small filled triangle whose tip is at `tip`, pointing along (dx, dy). */
export function arrowHead(tip: Pt, dx: number, dy: number, size = 4.5): string {
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L;
  const bx = tip.x - ux * size, by = tip.y - uy * size;
  const px = -uy * size * 0.6, py = ux * size * 0.6;
  return `M${f(tip.x)},${f(tip.y)} L${f(bx + px)},${f(by + py)} L${f(bx - px)},${f(by - py)} Z`;
}

/** Regular polygon edges between consecutive atoms (closed when there are 3+). */
function ringBonds(atoms: Pt[], kind: BondKind = 'single'): Bond[] {
  const n = atoms.length;
  if (n < 2) return [];
  if (n === 2) return [{ a: atoms[0], b: atoms[1], kind }];
  return atoms.map((p, i) => ({ a: p, b: atoms[(i + 1) % n], kind }));
}

// ── G1 · translation ─────────────────────────────────────────────────────────
function chain(cx: number, cy: number, R: number, n: number): Motif {
  if (n === 0) return EMPTY;
  const s = n > 1 ? Math.min(24, (2 * R * 0.82) / (n - 1)) : 24;
  const a = 9;
  const x0 = cx - ((n - 1) * s) / 2;
  const yAt = (i: number) => cy + (((i % 2) + 2) % 2 === 0 ? a : -a);
  const atoms = Array.from({ length: n }, (_, i) => P(x0 + i * s, yAt(i)));
  const bonds: Bond[] = atoms.slice(1).map((p, i) => ({ a: atoms[i], b: p, kind: 'single', ia: i, ib: i + 1 }));
  // One repeat unit (two atoms) to the left, for the translation demo: shifting the chain right by
  // one repeat brings these in from the left while the last two atoms leave on the right.
  const phantoms = [P(x0 - 2 * s, yAt(-2)), P(x0 - s, yAt(-1))];
  const phantomBonds: Bond[] = [
    { a: phantoms[0], b: phantoms[1], kind: 'single', ia: -2, ib: -1 },
    { a: phantoms[1], b: atoms[0], kind: 'single', ia: -1, ib: 0 },
  ];
  const deco: Deco[] = [];
  // The pattern continues past both ends — the ends are boundaries, not the edge of the world.
  const before = P(x0 - s * 0.7, cy + (yAt(-1) - cy) * 0.7 + (yAt(0) - cy) * 0.3);
  const after = P(x0 + (n - 1) * s + s * 0.7, cy + (yAt(n) - cy) * 0.7 + (yAt(n - 1) - cy) * 0.3);
  deco.push({ kind: 'path', d: line(atoms[0], before), cls: 'mol-stub' });
  deco.push({ kind: 'path', d: line(atoms[n - 1], after), cls: 'mol-stub' });
  // Polymer brackets around one repeat unit, and the shift that maps the chain onto itself.
  if (n >= 4) {
    const m = Math.max(1, Math.floor(n / 2) - 1);
    const xl = (atoms[m - 1].x + atoms[m].x) / 2;
    const xr = m + 2 < n ? (atoms[m + 1].x + atoms[m + 2].x) / 2 : atoms[m + 1].x + s / 2;
    const top = cy - a - 11, bot = cy + a + 11;
    deco.push({ kind: 'path', d: `M${f(xl + 4)},${f(top)} L${f(xl)},${f(top)} L${f(xl)},${f(bot)} L${f(xl + 4)},${f(bot)}`, cls: 'mol-bracket' });
    deco.push({ kind: 'path', d: `M${f(xr - 4)},${f(top)} L${f(xr)},${f(top)} L${f(xr)},${f(bot)} L${f(xr - 4)},${f(bot)}`, cls: 'mol-bracket' });
    deco.push({ kind: 'text', x: f(xr + 3), y: f(bot + 2), s: 'n', cls: 'mol-sub' });
    const y = bot + 13;
    const from = P(atoms[m].x, y), to = P(atoms[m].x + 2 * s, y);
    deco.push({ kind: 'path', d: line(from, to), cls: 'mol-shift' });
    deco.push({ kind: 'path', d: arrowHead(to, 1, 0, 4), cls: 'mol-shift-head' });
  }
  return { atoms, bonds, deco, phantoms, phantomBonds, shift: f(2 * s) };
}

// ── G2 · rotation and feature types ──────────────────────────────────────────
function ring(cx: number, cy: number, R: number, n: number): Motif {
  if (n === 0) return EMPTY;
  const rr = R * 0.58;
  const step = 360 / n;
  const atoms = Array.from({ length: n }, (_, i) => polar(cx, cy, rr, -90 + i * step));
  const deco: Deco[] = [];
  if (n >= 3) deco.push({ kind: 'circle', cx: f(cx), cy: f(cy), r: f(rr * 0.55), cls: 'mol-aromatic' });
  // A vector field on the ring: each arrow is tangent, so rotating the ring rotates the arrows.
  for (let i = 0; i < n; i++) {
    const th = rad(-90 + i * step);
    const base = polar(cx, cy, rr + 13, -90 + i * step);
    const tx = Math.sin(th), ty = -Math.cos(th); // counter-clockwise on screen
    const p0 = P(base.x - tx * 6, base.y - ty * 6), p1 = P(base.x + tx * 6, base.y + ty * 6);
    deco.push({ kind: 'path', d: line(p0, p1), cls: 'mol-vec' });
    deco.push({ kind: 'path', d: arrowHead(p1, tx, ty, 3.6), cls: 'mol-vec-head' });
  }
  return { atoms, bonds: ringBonds(atoms), deco };
}

// ── G3 · sets and permutations ───────────────────────────────────────────────
function star(cx: number, cy: number, R: number, n: number): Motif {
  if (n === 0) return EMPTY;
  const hub = P(cx, cy);
  const k = n - 1;
  const lr = R * 0.58;
  const leaves = Array.from({ length: k }, (_, i) => polar(cx, cy, lr, -90 + (i * 360) / Math.max(k, 1)));
  const atoms = [hub, ...leaves];
  const bonds: Bond[] = leaves.map((p, i) => ({ a: hub, b: p, kind: 'single', ia: 0, ib: i + 1 }));
  const deco: Deco[] = [];
  // Swap two identical ligands: same molecule. That is all permutation invariance says.
  if (k >= 2) {
    const r = R * 0.88;
    const t1 = -90 + 14, t2 = -90 + 360 / k - 14;
    const p1 = polar(cx, cy, r, t1), p2 = polar(cx, cy, r, t2);
    const large = t2 - t1 > 180 ? 1 : 0;
    deco.push({ kind: 'path', d: `M${p1.x},${p1.y} A${f(r)},${f(r)} 0 ${large} 1 ${p2.x},${p2.y}`, cls: 'mol-swap' });
    deco.push({ kind: 'path', d: arrowHead(p1, Math.sin(rad(t1)), -Math.cos(rad(t1)), 4), cls: 'mol-swap-head' });
    deco.push({ kind: 'path', d: arrowHead(p2, -Math.sin(rad(t2)), Math.cos(rad(t2)), 4), cls: 'mol-swap-head' });
  }
  return { atoms, bonds, deco };
}

// ── G4 · attention ───────────────────────────────────────────────────────────
function clique(cx: number, cy: number, R: number, n: number, seed = 3): Motif {
  if (n === 0) return EMPTY;
  const rr = R * 0.6;
  const atoms = Array.from({ length: n }, (_, i) => polar(cx, cy, rr, -90 + 180 / n + (i * 360) / n));
  const bonds: Bond[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // A mask removes a few pairs entirely; the rest carry a learned-looking weight.
      if (n >= 4 && hash01(j, i, seed + 1) < 0.14) continue;
      bonds.push({ a: atoms[i], b: atoms[j], kind: 'weighted', w: f(0.15 + 0.6 * hash01(i, j, seed)), ia: i, ib: j });
    }
  }
  return { atoms, bonds, deco: [] };
}

// ── G5 · graphs and message passing ──────────────────────────────────────────
function tree(cx: number, cy: number, R: number, n: number): Motif {
  if (n === 0) return EMPTY;
  const k = Math.min(3, n - 1);
  const r1 = R * 0.36, r2 = R * 0.76;
  const atoms: Pt[] = [P(cx, cy)];
  const parent: number[] = [-1];
  const angle: number[] = [0];
  for (let i = 0; i < k; i++) {
    const ang = -90 + i * 120;
    atoms.push(polar(cx, cy, r1, ang)); parent.push(0); angle.push(ang);
  }
  const offsets = [24, -24, 50, -50];
  for (let idx = k + 1; idx < n; idx++) {
    const j = idx - (k + 1);
    const p = 1 + (j % k);
    const ang = angle[p] + offsets[Math.floor(j / k) % offsets.length];
    atoms.push(polar(cx, cy, r2, ang)); parent.push(p); angle.push(ang);
  }
  // Each bond carries a message toward the centre: aggregation, one hop per layer.
  const bonds: Bond[] = atoms.slice(1).map((p, i) => ({ a: atoms[parent[i + 1]], b: p, kind: 'message', ia: parent[i + 1], ib: i + 1 }));
  const deco: Deco[] = [
    { kind: 'circle', cx: f(cx), cy: f(cy), r: f(r1), cls: 'mol-hop' },
  ];
  if (n > k + 1) deco.push({ kind: 'circle', cx: f(cx), cy: f(cy), r: f(r2), cls: 'mol-hop' });
  return { atoms, bonds, deco };
}

// ── G6 · Euclidean geometry and chirality ────────────────────────────────────
function chiral(cx: number, cy: number, R: number, n: number): Motif {
  if (n === 0) return EMPTY;
  const lx = cx - R * 0.62;
  const bl = R * 0.42;
  // Standard stereo drawing: two bonds in the page, one toward you (wedge), one away (hash).
  const subs: { ang: number; kind: BondKind }[] = [
    { ang: -90, kind: 'single' },
    { ang: 150, kind: 'single' },
    { ang: -30, kind: 'wedge' },
    { ang: 45, kind: 'hash' },
  ];
  const atoms: Pt[] = [P(lx, cy)];
  const bonds: Bond[] = [];
  const sk = Math.min(4, n - 1);
  for (let i = 0; i < sk; i++) {
    const p = polar(lx, cy, bl, subs[i].ang);
    atoms.push(p);
    bonds.push({ a: atoms[0], b: p, kind: subs[i].kind });
  }
  // Extra atoms grow the two in-plane substituents (away from the mirror).
  for (let idx = 1 + sk, j = 0; idx < n; idx++, j++) {
    const which = j % 2; // substituent 0 (up) or 1 (lower left)
    const base = atoms[1 + which];
    const ang = subs[which].ang + (Math.floor(j / 2) % 2 === 0 ? -32 : 32);
    const p = polar(base.x, base.y, R * 0.3, ang);
    atoms.push(p);
    bonds.push({ a: base, b: p, kind: 'single' });
  }
  const deco: Deco[] = [];
  const top = P(cx, cy - R * 0.74), bot = P(cx, cy + R * 0.74);
  deco.push({ kind: 'path', d: line(top, bot), cls: 'mol-mirror' });
  // The enantiomer: every atom reflected through the mirror plane. Not superimposable by rotation.
  const m = (p: Pt) => P(2 * cx - p.x, p.y);
  for (const b of bonds) deco.push({ kind: 'path', d: bondPath({ a: m(b.a), b: m(b.b), kind: b.kind }), cls: 'mol-ghost-bond' });
  for (const p of atoms) {
    const q = m(p);
    deco.push({ kind: 'circle', cx: q.x, cy: q.y, r: 5.5, cls: 'mol-ghost-atom' });
  }
  return { atoms, bonds, deco };
}

// ── G7 · tensor features ─────────────────────────────────────────────────────
function orbital(cx: number, cy: number, R: number, n: number): Motif {
  const sr = R * 0.64;
  const deco: Deco[] = [{ kind: 'circle', cx: f(cx), cy: f(cy), r: f(sr), cls: 'mol-sphere' }];
  // A d_xy orbital: four lobes, opposite phases on alternate lobes.
  [45, 135, 225, 315].forEach((deg, i) => {
    const c = polar(cx, cy, R * 0.3, deg);
    deco.push({ kind: 'ellipse', cx: c.x, cy: c.y, rx: f(R * 0.29), ry: f(R * 0.13), rot: deg, cls: i % 2 ? 'mol-lobe mol-lobe--neg' : 'mol-lobe' });
  });
  deco.push({ kind: 'circle', cx: f(cx), cy: f(cy), r: 2.2, cls: 'mol-nucleus' });
  const atoms = Array.from({ length: n }, (_, i) => polar(cx, cy, sr, -90 + (i * 360) / Math.max(n, 1)));
  return { atoms, bonds: [], deco };
}

/** Atoms fill fixed `sites` in order; extra atoms sit just outside, as substituents. */
function onSites(sites: Pt[], n: number, cx: number, cy: number, push: number): Pt[] {
  const atoms = sites.slice(0, n);
  for (let i = sites.length; i < n; i++) {
    const s = sites[(i - sites.length) % sites.length];
    const dx = s.x - cx, dy = s.y - cy;
    const L = Math.hypot(dx, dy) || 1;
    atoms.push(P(s.x + (dx / L) * push, s.y + (dy / L) * push));
  }
  return atoms;
}
function skeletonBonds(sites: Pt[], pairs: [number, number][], n: number): Bond[] {
  return pairs.map(([i, j]) => ({ a: sites[i], b: sites[j], kind: (i < n && j < n ? 'single' : 'skeleton') as BondKind }));
}

// ── G8 · graph structure and spectral methods ────────────────────────────────
function fused(cx: number, cy: number, R: number, n: number): Motif {
  const a = R * 0.36;
  const dx = (a * Math.sqrt(3)) / 2;
  const v = (hx: number, deg: number) => polar(hx, cy, a, deg);
  const L = cx - dx, Rx = cx + dx;
  const sites = [v(L, -90), v(L, -30), v(Rx, -90), v(Rx, -30), v(Rx, 30), v(Rx, 90), v(L, 30), v(L, 90), v(L, 150), v(L, 210)];
  const pairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 6]];
  const deco: Deco[] = [];
  // Naphthalene is bipartite, so its highest-frequency eigenvector alternates sign site by site.
  sites.forEach((s, i) => {
    const up = i % 2 === 0;
    const y0 = s.y + (up ? -8 : 8), y1 = s.y + (up ? -15 : 15);
    deco.push({ kind: 'path', d: `M${s.x},${f(y0)} L${s.x},${f(y1)}`, cls: 'mol-mode' });
  });
  return { atoms: onSites(sites, n, cx, cy, R * 0.24), bonds: skeletonBonds(sites, pairs, n), deco };
}

// ── G9 · surfaces and local frames ───────────────────────────────────────────
function bowl(cx: number, cy: number, R: number, n: number): Motif {
  const r0 = R * 0.3, r1 = R * 0.55, r2 = R * 0.82;
  const sites: Pt[] = [];
  for (let k = 0; k < 5; k++) sites.push(polar(cx, cy, r0, -90 + k * 72));
  for (let k = 0; k < 5; k++) sites.push(polar(cx, cy, r1, -90 + k * 72));
  for (let k = 0; k < 5; k++) {
    sites.push(polar(cx, cy, r2, -90 + k * 72 - 18));
    sites.push(polar(cx, cy, r2, -90 + k * 72 + 18));
  }
  const pairs: [number, number][] = [];
  for (let k = 0; k < 5; k++) {
    pairs.push([k, (k + 1) % 5]);            // hub pentagon
    pairs.push([k, 5 + k]);                  // spokes
    pairs.push([5 + k, 10 + 2 * k]);         // spoke to rim
    pairs.push([5 + k, 11 + 2 * k]);
    pairs.push([11 + 2 * k, 10 + 2 * ((k + 1) % 5)]); // rim closes each hexagon
  }
  const atoms = onSites(sites, n, cx, cy, R * 0.2);
  const deco: Deco[] = [];
  // Two local frames on the outermost atoms that exist: on a curved surface every point has its
  // own axes (tangent and normal). Placed on real atoms so they never float on empty skeleton.
  const byRadius = atoms
    .map((p, i) => ({ p, i, r: Math.hypot(p.x - cx, p.y - cy), a: Math.atan2(p.y - cy, p.x - cx) }))
    .filter((o) => o.r > 1)
    .sort((u, v) => v.r - u.r || u.i - v.i);
  const picked: typeof byRadius = [];
  for (const o of byRadius) {
    if (picked.length === 2) break;
    if (picked.every((q) => Math.abs(Math.atan2(Math.sin(o.a - q.a), Math.cos(o.a - q.a))) > Math.PI / 2)) picked.push(o);
  }
  for (const { p, r } of picked) {
    const nx = (p.x - cx) / r, ny = (p.y - cy) / r;
    const s0 = P(p.x + nx * 8, p.y + ny * 8); // start just outside the atom
    const e1 = P(s0.x - ny * 9, s0.y + nx * 9), e2 = P(s0.x + nx * 9, s0.y + ny * 9);
    deco.push({ kind: 'path', d: `${line(s0, e1)} ${line(s0, e2)}`, cls: 'mol-frame' });
  }
  return { atoms, bonds: skeletonBonds(sites, pairs, n), deco };
}

// ── G10 · approximate symmetry and canonicalization ──────────────────────────
function distorted(cx: number, cy: number, R: number, n: number): Motif {
  const k = n >= 3 ? n : 6; // the ideal n-gon; with too few atoms, show a hexagon's skeleton
  const rr = R * 0.58;
  const ideal = Array.from({ length: k }, (_, i) => polar(cx, cy, rr, -90 + (i * 360) / k));
  // Jahn–Teller: the symmetric shape is unstable, so the ring stretches one way.
  const bent = ideal.map((p) => P(cx + (p.x - cx) * 1.16, cy + (p.y - cy) * 0.84));
  const deco: Deco[] = [
    { kind: 'path', d: ideal.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ') + ' Z', cls: 'mol-ideal' },
  ];
  const tip = P(cx + rr * 1.16 * 0.62, cy);
  deco.push({ kind: 'path', d: line(P(cx, cy), tip), cls: 'mol-canon' });
  deco.push({ kind: 'path', d: arrowHead(tip, 1, 0, 4), cls: 'mol-canon-head' });
  const atoms = bent.slice(0, n);
  return { atoms, bonds: ringBonds(atoms), deco };
}

// ── G11 · geometric generative models ────────────────────────────────────────
function cloud(cx: number, cy: number, R: number, n: number): Motif {
  const deco: Deco[] = [];
  for (let i = 0; i < 16; i++) {
    const x = cx - R + hash01(i, 1, 11) * R * 0.8;
    const y = cy - R * 0.6 + hash01(i, 2, 11) * R * 1.2;
    deco.push({ kind: 'circle', cx: f(x), cy: f(y), r: f(1.1 + hash01(i, 3, 11) * 1.2), cls: 'mol-noise' });
  }
  const mx = cx + R * 0.42, rr = R * 0.34;
  [-0.35, 0, 0.35].forEach((t) => {
    const y0 = cy + t * R * 1.1;
    deco.push({ kind: 'path', d: `M${f(cx - R * 0.55)},${f(y0)} C${f(cx - R * 0.1)},${f(y0)} ${f(cx)},${f(cy + t * R * 0.3)} ${f(mx - rr - 4)},${f(cy + t * rr)}`, cls: 'mol-flow' });
  });
  const atoms = Array.from({ length: n }, (_, i) => polar(mx, cy, rr, -90 + (i * 360) / Math.max(n, 1)));
  return { atoms, bonds: ringBonds(atoms), deco };
}

const GENERATORS: Record<MoleculeMotif, (cx: number, cy: number, R: number, n: number) => Motif> = {
  chain, ring, star, clique, tree, chiral, orbital, fused, bowl, distorted, cloud,
};

export function buildMotif(motif: MoleculeMotif, cx: number, cy: number, R: number, n: number): Motif {
  return GENERATORS[motif](cx, cy, R, Math.max(0, Math.floor(n)));
}

/** SVG path for one bond (lines, a wedge triangle, or the rungs of a hashed bond). */
export function bondPath(b: { a: Pt; b: Pt; kind: BondKind }): string {
  const dx = b.b.x - b.a.x, dy = b.b.y - b.a.y;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  if (b.kind === 'wedge') {
    const w = 4;
    return `M${b.a.x},${b.a.y} L${f(b.b.x + nx * w)},${f(b.b.y + ny * w)} L${f(b.b.x - nx * w)},${f(b.b.y - ny * w)} Z`;
  }
  if (b.kind === 'hash') {
    const parts: string[] = [];
    const rungs = 5;
    for (let i = 1; i <= rungs; i++) {
      const t = i / (rungs + 0.4);
      const px = b.a.x + dx * t, py = b.a.y + dy * t;
      const w = 0.8 + 3.4 * t;
      parts.push(`M${f(px + nx * w)},${f(py + ny * w)} L${f(px - nx * w)},${f(py - ny * w)}`);
    }
    return parts.join(' ');
  }
  return line(b.a, b.b);
}

/** Arrowhead at the middle of a message bond, pointing from b (sender) toward a (receiver). */
export function messageHead(b: Bond): string {
  const mx = (b.a.x + b.b.x) / 2, my = (b.a.y + b.b.y) / 2;
  return arrowHead(P(mx, my), b.a.x - b.b.x, b.a.y - b.b.y, 4.2);
}

// ── Procedural backdrop: one faint pattern per unit, echoing what the unit is about. ──
// Replaced wholesale by a painted panorama when one exists (see the art brief).
export function backdrop(motif: MoleculeMotif, x: number, y: number, w: number, h: number, seed: number): Deco[] {
  const out: Deco[] = [];
  const cx = x + w / 2, cy = y + h / 2;
  const p = (d: string) => out.push({ kind: 'path', d, cls: 'mol-bd' });
  switch (motif) {
    case 'chain': // a frieze: one tile repeated along a line
      for (let xx = x + 6; xx < x + w; xx += 12) p(`M${f(xx)},${f(cy - 34)} L${f(xx)},${f(cy - 26)} M${f(xx)},${f(cy + 26)} L${f(xx)},${f(cy + 34)}`);
      p(`M${f(x)},${f(cy - 30)} L${f(x + w)},${f(cy - 30)} M${f(x)},${f(cy + 30)} L${f(x + w)},${f(cy + 30)}`);
      break;
    case 'ring': // a goniometer: concentric circles and spokes
      for (const r of [24, 46, 68, 90]) out.push({ kind: 'circle', cx: f(cx), cy: f(cy), r, cls: 'mol-bd' });
      for (let k = 0; k < 12; k++) { const a = polar(cx, cy, 20, k * 30), b = polar(cx, cy, 92, k * 30); p(line(a, b)); }
      break;
    case 'star': // a handful of identical points, in no order
      for (let i = 0; i < 30; i++) out.push({ kind: 'circle', cx: f(x + hash01(i, 5, seed) * w), cy: f(y + hash01(i, 6, seed) * h), r: 1.6, cls: 'mol-bd-dot' });
      break;
    case 'clique': // threads on a loom, crossing everywhere
      for (let t = -h; t < w + h; t += 14) { p(`M${f(x + t)},${f(y)} L${f(x + t + h * 0.7)},${f(y + h)}`); p(`M${f(x + t + h * 0.7)},${f(y)} L${f(x + t)},${f(y + h)}`); }
      break;
    case 'tree': { // an old street map: junctions and roads (the notes' running example)
      let xx = x + 8; let i = 0;
      while (xx < x + w) { p(`M${f(xx)},${f(y + hash01(i, 7, seed) * 30)} L${f(xx)},${f(y + h - hash01(i, 8, seed) * 30)}`); xx += 22 + hash01(i, 9, seed) * 18; i++; }
      let yy = y + 10; i = 0;
      while (yy < y + h) { p(`M${f(x + hash01(i, 10, seed) * 30)},${f(yy)} L${f(x + w - hash01(i, 11, seed) * 30)},${f(yy)}`); yy += 20 + hash01(i, 12, seed) * 16; i++; }
      break;
    }
    case 'chiral': { // 3D space: a floor in perspective, and the mirror plane
      const vx = cx, vy = y + 8;
      for (let k = -5; k <= 5; k++) p(`M${f(vx)},${f(vy)} L${f(cx + k * 34)},${f(y + h)}`);
      for (const t of [0.55, 0.68, 0.8, 0.9, 1]) { const yy = vy + (y + h - vy) * t; p(`M${f(x)},${f(yy)} L${f(x + w)},${f(yy)}`); }
      break;
    }
    case 'orbital': // a wireframe sphere
      for (const k of [0.25, 0.5, 0.75]) out.push({ kind: 'ellipse', cx: f(cx), cy: f(cy), rx: 70, ry: f(70 * k), rot: 0, cls: 'mol-bd' });
      for (const k of [0.3, 0.65]) out.push({ kind: 'ellipse', cx: f(cx), cy: f(cy), rx: f(70 * k), ry: 70, rot: 0, cls: 'mol-bd' });
      out.push({ kind: 'circle', cx: f(cx), cy: f(cy), r: 70, cls: 'mol-bd' });
      break;
    case 'fused': // standing waves, like sand on a vibrating plate
      for (let r = 0; r < 5; r++) {
        const yy = y + 18 + r * ((h - 36) / 4);
        let d = `M${f(x)},${f(yy)}`;
        for (let xx = x; xx <= x + w; xx += 6) d += ` L${f(xx)},${f(yy + 7 * Math.sin(((xx - x) / w) * Math.PI * (2 + r)))}`;
        p(d);
      }
      break;
    case 'bowl': // a curved mesh seen from above
      for (const r of [22, 42, 62, 82]) out.push({ kind: 'ellipse', cx: f(cx), cy: f(cy + 6), rx: r, ry: f(r * 0.78), rot: 0, cls: 'mol-bd' });
      for (let k = 0; k < 10; k++) { const a = polar(cx, cy + 6, 22, k * 36), b = polar(cx, cy + 6, 82, k * 36 + 14); p(`M${a.x},${a.y} Q${f((a.x + b.x) / 2 + 6)},${f((a.y + b.y) / 2)} ${b.x},${b.y}`); }
      break;
    case 'distorted': // a grid that is almost, but not quite, square
      for (let i = 0; i <= 8; i++) { const xx = x + (i * w) / 8; p(`M${f(xx)},${f(y)} L${f(xx + 12)},${f(y + h)}`); }
      for (let i = 0; i <= 8; i++) { const yy = y + (i * h) / 8; p(`M${f(x)},${f(yy)} L${f(x + w)},${f(yy + 5)}`); }
      break;
    case 'cloud': // a noise field, thinning toward the structure
      for (let i = 0; i < 44; i++) {
        const t = hash01(i, 13, seed);
        out.push({ kind: 'circle', cx: f(x + t * t * w * 0.85), cy: f(y + hash01(i, 14, seed) * h), r: f(0.8 + (1 - t) * 1.4), cls: 'mol-bd-dot' });
      }
      break;
  }
  return out;
}

// ── Hover demos: how each unit performs its symmetry ──────────────────────────────────────
// Pure planning (which atoms fade, which ligands swap, where messages travel); MoleculeMap.astro
// turns the plan into data-* attributes and its script animates them. Shared with tests/previews.
/**
 *   rigid      the whole molecule takes `data-op` (a ring turns one step, a chiral pair reflects …)
 *   translate  the chain slides one repeat unit under fixed brackets; new atoms enter on the left
 *   swap       two identical ligands exchange places — a transposition, not a rotation
 *   message    two rounds of message passing: pulses travel inward along the bonds
 *   attention  one query atom at a time lights up its attention row
 */
export type Demo = 'rigid' | 'translate' | 'swap' | 'message' | 'attention' | 'none';
export type Attrs = Record<string, string>;
export interface Pulse { x: number; y: number; dx: number; dy: number }
export interface DemoPlan {
  demo: Demo;
  unitAttrs: Attrs;
  /** One entry per atom of the motif (same order as `motif.atoms`). */
  atomAttrs: Attrs[];
  /** One entry per bond of the motif (same order as `motif.bonds`). */
  bondAttrs: Attrs[];
  /** Extra atoms and bonds drawn only for the demo (hidden at rest), placed before the real ones. */
  phantoms: Pt[];
  phantomBonds: Bond[];
  pulses: Pulse[];
}

export function demoPlan(motif: MoleculeMotif, g: Motif, cx: number, cy: number): DemoPlan {
  const n = g.atoms.length;
  const plan: DemoPlan = {
    demo: 'none', unitAttrs: {}, atomAttrs: g.atoms.map(() => ({})), bondAttrs: g.bonds.map(() => ({})),
    phantoms: [], phantomBonds: [], pulses: [],
  };
  const rigid: Partial<Record<MoleculeMotif, string>> = {
    ring: `rotate(${f(360 / Math.max(n, 1))}deg)`,          // C_n: one step lands the ring on itself
    chiral: 'scaleX(-1)',                                   // reflection: the molecule becomes its mirror image
    orbital: 'rotate(90deg)',                               // the d-orbital's lobes swap phase
    fused: 'scaleX(-1)',                                    // naphthalene's mirror plane
    bowl: 'rotate(72deg)',                                  // corannulene's five-fold axis
    distorted: `rotate(${f(360 / (n >= 3 ? n : 6))}deg)`,   // the ideal shape lands on itself, the distorted one does not
  };
  if (rigid[motif]) { plan.demo = 'rigid'; plan.unitAttrs['data-op'] = rigid[motif]!; }

  if (motif === 'chain' && g.phantoms && g.phantomBonds && g.shift) {
    // Shift one repeat unit right under fixed brackets: the two right-most atoms fade out, two
    // phantoms slide in from the left, and what sits inside the brackets is unchanged.
    plan.demo = 'translate';
    plan.unitAttrs['data-shift'] = String(g.shift);
    g.atoms.forEach((_, k) => { if (k >= n - 2) plan.atomAttrs[k]['data-fade'] = 'out'; });
    g.bonds.forEach((b, i) => { if ((b.ia ?? i) >= n - 3) plan.bondAttrs[i]['data-fade'] = 'out'; });
    plan.phantoms = g.phantoms;
    plan.phantomBonds = g.phantomBonds;
  }
  if (motif === 'star' && n >= 3) {
    // A transposition: leaves 1 and 2 trade places along different paths (one passes in front,
    // one behind) while every other ligand stays put. The same molecule afterwards — that is the point.
    plan.demo = 'swap';
    const step = f(360 / (n - 1));
    const origin = `transform-origin:${cx}px ${cy}px`;
    const tag = (idx: number, role: string, angle: number) => {
      const a = { 'data-swap': role, 'data-angle': String(angle), style: origin };
      plan.atomAttrs[idx] = { ...a };
      g.bonds.forEach((b, i) => { if (b.ib === idx) plan.bondAttrs[i] = { ...a }; });
    };
    tag(1, 'back', step);
    tag(2, 'front', -step);
  }
  if (motif === 'tree' && n >= 2) {
    // Message passing: every bond carries a message from child to parent, in two synchronous rounds.
    plan.demo = 'message';
    const k = Math.min(3, n - 1);
    g.atoms.forEach((_, idx) => { plan.atomAttrs[idx]['data-depth'] = String(idx === 0 ? 0 : idx <= k ? 1 : 2); });
    plan.pulses = g.bonds.map((b) => ({ x: b.b.x, y: b.b.y, dx: f(b.a.x - b.b.x), dy: f(b.a.y - b.b.y) }));
  }
  if (motif === 'clique' && n >= 2) {
    // Attention: one query at a time; its bonds light up in proportion to their weights.
    plan.demo = 'attention';
    g.atoms.forEach((_, idx) => { plan.atomAttrs[idx]['data-k'] = String(idx); });
    g.bonds.forEach((b, i) => { plan.bondAttrs[i]['data-i'] = String(b.ia); plan.bondAttrs[i]['data-j'] = String(b.ib); });
  }
  return plan;
}
