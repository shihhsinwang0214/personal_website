import { TOY, seededRandom, normalCDF, mixtureCDF, mixtureDensity } from './dojoDistributions.ts';

/** Analytic teaching models. No learned network or measured image reward is implied. */
export type SteeringMode = 'classifier' | 'cfg' | 'tilt' | 'posterior' | 'best' | 'importance' | 'smc' | 'source' | 'tempering';
export type Reward = 'right' | 'two';
export type Estimator = 'posterior' | 'plugin' | 'misleading';
export interface SteeringSettings {
  strength: number; condition: number; time: number; point: number; candidates: number;
  particles: number; estimator: Estimator; stages: number; steps: number;
  reward: Reward; seed: number; proposal: number;
}
export const GRID = Array.from({ length: 481 }, (_, i) => -6 + i / 40);
export const DX = GRID[1] - GRID[0];
export const BASE = GRID.map((x) => mixtureDensity(x));
export function defaults(mode: SteeringMode): SteeringSettings {
  return { strength: mode === 'classifier' ? 1 : mode === 'cfg' ? 3 : 2, condition: 1,
    time: .35, point: 0, candidates: 8, particles: 24, estimator: 'posterior', stages: 6,
    steps: mode === 'source' || mode === 'tempering' ? 1600 : 600,
    reward: ['smc', 'source', 'tempering', 'posterior'].includes(mode) ? 'two' : 'right', seed: 42, proposal: .35 };
}
export const reward = (x: number, kind: Reward) => kind === 'right' ? x : -((Math.abs(x) - 2.5) ** 2);
export const normal = (x: number, mean = 0, variance = 1) => Math.exp(-.5 * (x - mean) ** 2 / variance) / Math.sqrt(2 * Math.PI * variance);
export function standardNormal(random: () => number) {
  return Math.sqrt(-2 * Math.log(Math.max(1e-15, random()))) * Math.cos(2 * Math.PI * random());
}
export const alpha = (time: number) => Math.exp(-8 * time);
export function noisyMoments(time: number) {
  const a = alpha(time);
  return { signal: Math.sqrt(a), variance: a * TOY.sigma ** 2 + 1 - a };
}
function logistic(v: number) { return v >= 0 ? 1 / (1 + Math.exp(-v)) : Math.exp(v) / (1 + Math.exp(v)); }
export function scores(x: number, time: number, condition = 1) {
  const { signal, variance } = noisyMoments(time);
  const right = logistic(4 * signal * x / variance);
  const base = (2 * signal * (2 * right - 1) - x) / variance;
  const conditional = ((condition ? 2 : -2) * signal - x) / variance;
  // Different signal sources: derivative of the classifier log-probability vs two score calls.
  const classifierGradient = 4 * signal / variance * (condition ? 1 - right : -right);
  return { base, conditional, classifierGradient, probability: condition ? right : 1 - right };
}
export function guidedScore(x: number, time: number, condition: number, strength: number, mode: 'classifier' | 'cfg') {
  const s = scores(x, time, condition);
  return mode === 'classifier' ? s.base + strength * s.classifierGradient : s.conditional + (strength - 1) * (s.conditional - s.base);
}
export function sampleBase(random: () => number, time = 0) {
  const { signal, variance } = noisyMoments(time);
  return (random() < .5 ? -2 : 2) * signal + Math.sqrt(variance) * standardNormal(random);
}
/** Euler–Maruyama reverse VP SDE; finite T and step error remain visible. */
export function guidedSamples(mode: 'classifier' | 'cfg', s: SteeringSettings, count = 1000) {
  const random = seededRandom(s.seed), dt = 1 / s.steps;
  const samples = Array.from({ length: count }, () => sampleBase(random, 1));
  const trace = [samples.slice(0, 12)];
  for (let k = s.steps; k > 0; k--) {
    const t = k * dt;
    for (let i = 0; i < count; i++) samples[i] += (4 * samples[i] + 8 * guidedScore(samples[i], t, s.condition, s.strength, mode)) * dt + Math.sqrt(8 * dt) * standardNormal(random);
    if (k % Math.max(1, Math.floor(s.steps / 20)) === 0 || k === 1) trace.push(samples.slice(0, 12));
  }
  return { samples, trace, evaluations: count * s.steps, randomDraws: count * s.steps };
}
export function normalize(values: number[]) {
  const sum = values.reduce((a, b) => a + b, 0);
  if (!(sum > 0) || !Number.isFinite(sum)) throw new Error('Weights must have a finite positive sum');
  return values.map((v) => v / sum);
}
export function categorical(probabilities: number[], random: () => number) {
  const u = random(); let sum = 0;
  for (let i = 0; i < probabilities.length; i++) { sum += probabilities[i]; if (u < sum) return i; }
  return probabilities.length - 1;
}
export function tiltedDensity(strength: number, kind: Reward) {
  const weights = GRID.map((x, i) => BASE[i] * Math.exp(strength * reward(x, kind)));
  return normalize(weights).map((p) => p / DX);
}
/** Grid quadrature reference and CDF inversion on [-6,6]; not a high-dimensional sampler. */
export function sampleGrid(density: number[], count: number, random: () => number) {
  const p = normalize(density), cdf: number[] = []; let total = 0;
  for (const v of p) cdf.push(total += v);
  return Array.from({ length: count }, () => {
    const u = random(); let lo = 0, hi = cdf.length - 1;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (cdf[mid] < u) lo = mid + 1; else hi = mid; }
    return GRID[lo] + (random() - .5) * DX;
  });
}
export function posterior(x: number, time: number) {
  const { signal, variance } = noisyMoments(time), a = alpha(time);
  const right = logistic(4 * signal * x / variance);
  const gain = signal * TOY.sigma ** 2 / variance;
  const means = [-2, 2].map((mu) => mu + gain * (x - signal * mu));
  const v = TOY.sigma ** 2 * (1 - a) / variance;
  return { right, means, variance: v, mean: (1 - right) * means[0] + right * means[1] };
}
export function posteriorDensity(x: number, time: number) {
  const p = posterior(x, time);
  return GRID.map((z) => (1 - p.right) * normal(z, p.means[0], p.variance) + p.right * normal(z, p.means[1], p.variance));
}
export function posteriorWeight(x: number, time: number, strength: number, kind: Reward) {
  if (time < 1e-10) return Math.exp(strength * reward(x, kind));
  const p = posterior(x, time);
  if (kind === 'right') return (1 - p.right) * Math.exp(strength * p.means[0] + .5 * strength ** 2 * p.variance) + p.right * Math.exp(strength * p.means[1] + .5 * strength ** 2 * p.variance);
  // The even reward has a closed Gaussian half-line integral on each side of zero.
  function half(mu: number, side: number) {
    const v = p.variance, d = 1 + 2 * strength * v;
    const center = (mu + 2 * strength * v * side * 2.5) / d;
    const factor = Math.exp(-strength * (mu - side * 2.5) ** 2 / d) / Math.sqrt(d);
    const cdf = normalCDF(side * center / Math.sqrt(v / d) * TOY.sigma, 0);
    return factor * cdf;
  }
  return (1 - p.right) * (half(p.means[0], -1) + half(p.means[0], 1)) + p.right * (half(p.means[1], -1) + half(p.means[1], 1));
}
export function posteriorSamples(s: SteeringSettings, count = 1000) {
  const random = seededRandom(s.seed), p = posterior(s.point, s.time);
  return Array.from({ length: count }, () => p.means[random() < p.right ? 1 : 0] + Math.sqrt(p.variance) * standardNormal(random));
}
export function selectSamples(mode: 'best' | 'importance', s: SteeringSettings, count = 1000) {
  const random = seededRandom(s.seed), samples: number[] = [];
  let first: { values: number[]; weights: number[]; selected: number } | undefined;
  for (let k = 0; k < count; k++) {
    const values = Array.from({ length: s.candidates }, () => sampleBase(random));
    const rewards = values.map((x) => reward(x, s.reward));
    const max = Math.max(...rewards);
    const weights = normalize(rewards.map((r) => Math.exp(s.strength * (r - max))));
    const selected = mode === 'best' ? rewards.indexOf(max) : categorical(weights, random);
    samples.push(values[selected]); if (!first) first = { values, weights, selected };
  }
  return { samples, first: first!, evaluations: count * s.candidates };
}
/** Exact reverse transition of the known Gaussian-mixture VP Markov process. */
export function reverseBase(x: number, from: number, to: number, random: () => number) {
  const prev = noisyMoments(to), current = noisyMoments(from), r = Math.exp(-4 * (from - to));
  const right = logistic(4 * current.signal * x / current.variance);
  const mu = random() < right ? 2 : -2, gain = r * prev.variance / current.variance;
  const mean = prev.signal * mu + gain * (x - current.signal * mu);
  return mean + Math.sqrt(Math.max(0, prev.variance - gain * gain * current.variance)) * standardNormal(random);
}
export interface Particle { x: number; ancestor: number }
export interface ParticleFrame { time: number; particles: Particle[]; parents: number[]; ess: number }
export interface SMCState {
  settings: SteeringSettings; random: () => number; phase: 'propagate' | 'weight' | 'resample' | 'done';
  stage: number; particles: Particle[]; proposed: Particle[]; weights: number[]; history: ParticleFrame[];
  oldH: number[]; newH: number[]; evaluations: number;
}
function H(x: number, time: number, s: SteeringSettings) {
  if (time === 0) return Math.exp(s.strength * reward(x, s.reward));
  if (time === 1) return 1;
  if (s.estimator === 'posterior') return Math.max(1e-100, posteriorWeight(x, time, s.strength, s.reward));
  if (s.estimator === 'plugin') return Math.max(1e-100, Math.exp(s.strength * reward(posterior(x, time).mean, s.reward)));
  return Math.exp(Math.max(-100, Math.min(100, 4 * s.strength * x)));
}
export function initializeSMC(s: SteeringSettings): SMCState {
  const random = seededRandom(s.seed), particles = Array.from({ length: s.particles }, (_, ancestor) => ({ x: sampleBase(random, 1), ancestor }));
  return { settings: { ...s }, random, phase: 'propagate', stage: 0, particles, proposed: [], weights: [], oldH: [], newH: [], evaluations: 0,
    history: [{ time: 1, particles: particles.map((p) => ({ ...p })), parents: [], ess: s.particles }] };
}
export function stepSMC(state: SMCState) {
  if (state.phase === 'done') return;
  const s = state.settings, from = 1 - state.stage / s.stages, to = state.stage + 1 === s.stages ? 0 : 1 - (state.stage + 1) / s.stages;
  if (state.phase === 'propagate') {
    state.weights = []; state.oldH = []; state.newH = [];
    state.proposed = state.particles.map((p) => ({ x: reverseBase(p.x, from, to, state.random), ancestor: p.ancestor }));
    state.phase = 'weight'; return;
  }
  if (state.phase === 'weight') {
    state.oldH = state.particles.map((p) => H(p.x, from, s));
    state.newH = state.proposed.map((p) => H(p.x, to, s));
    const logWeights = state.newH.map((v, i) => Math.log(v) - Math.log(state.oldH[i]));
    const max = Math.max(...logWeights);
    state.weights = normalize(logWeights.map((v) => Math.exp(v - max)));
    // Count every H evaluation, including start/terminal calls; no hidden rollout cost.
    state.evaluations += 2 * s.particles; state.phase = 'resample'; return;
  }
  const parents = Array.from({ length: s.particles }, () => categorical(state.weights, state.random));
  state.particles = parents.map((i) => ({ ...state.proposed[i] }));
  state.history.push({ time: to, particles: state.particles.map((p) => ({ ...p })), parents,
    ess: 1 / state.weights.reduce((a, w) => a + w * w, 0) });
  state.stage++; state.phase = state.stage === s.stages ? 'done' : 'propagate';
}
export function runSMC(s: SteeringSettings, runs = 300) {
  const samples: number[] = []; let first: SMCState | undefined, evaluations = 0;
  for (let run = 0; run < runs; run++) {
    const state = initializeSMC({ ...s, seed: s.seed + run * 997 });
    while (state.phase !== 'done') stepSMC(state);
    // One returned draw per independent population. Do not call M related descendants independent.
    samples.push(state.particles[Math.floor(state.random() * s.particles)].x);
    evaluations += state.evaluations; if (!first) first = state;
  }
  return { samples, state: first!, evaluations, transitions: runs * s.particles * s.stages, runs };
}
/** Fixed deterministic generator: transform a standard Normal into the same base mixture. */
export function generator(z: number) {
  const p = Math.max(1e-12, Math.min(1 - 1e-12, normalCDF(z * TOY.sigma, 0)));
  let lo = -8, hi = 8;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (mixtureCDF(mid) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
export const logAcceptance = (oldZ: number, newZ: number, oldR: number, newR: number, strength: number) => Math.min(0, -.5 * (newZ * newZ - oldZ * oldZ) + strength * (newR - oldR));
export const logSwap = (lambdaA: number, lambdaB: number, rewardA: number, rewardB: number) => Math.min(0, (lambdaA - lambdaB) * (rewardB - rewardA));
export interface ChainEvent { kind: 'local' | 'swap'; iteration: number; chain: number; probability: number; accepted: boolean; from: number; to: number }
export function runChains(mode: 'source' | 'tempering', s: SteeringSettings) {
  const random = seededRandom(s.seed), strengths = mode === 'source' ? [s.strength] : [0, s.strength / 2, s.strength];
  const proposals = mode === 'source' ? [s.proposal] : [1.4, .8, s.proposal];
  const states = strengths.map(() => { const z = -.8, x = generator(z); return { z, x, r: reward(x, s.reward) }; });
  const samples: number[] = [], trace: number[][] = [], events: ChainEvent[] = [];
  const burn = 400; let accepted = 0, swaps = 0, swapAttempts = 0, lowerAccepted = 0, rejected = 0;
  for (let k = 0; k < s.steps + burn; k++) {
    for (let j = 0; j < states.length; j++) {
      const current = states[j], z = current.z + proposals[j] * standardNormal(random), x = generator(z), r = reward(x, s.reward);
      const probability = Math.exp(logAcceptance(current.z, z, current.r, r, strengths[j]));
      const accept = random() < probability;
      if (k >= s.steps + burn - 3) events.push({ kind: 'local', iteration: k - burn + 1, chain: j, probability, accepted: accept, from: current.z, to: z });
      if (accept) { accepted++; if (r < current.r) lowerAccepted++; states[j] = { z, x, r }; } else rejected++;
    }
    if (states.length > 1) {
      const j = k % 2, a = states[j], b = states[j + 1];
      const probability = Math.exp(logSwap(strengths[j], strengths[j + 1], a.r, b.r));
      const accept = random() < probability; swapAttempts++;
      if (k >= s.steps + burn - 3) events.push({ kind: 'swap', iteration: k - burn + 1, chain: j, probability, accepted: accept, from: a.z, to: b.z });
      if (accept) { [states[j], states[j + 1]] = [states[j + 1], states[j]]; swaps++; }
    }
    if (k >= burn) {
      samples.push(states.at(-1)!.x); // Rejections and repeated states are samples too.
      trace.push(states.map((state) => state.z));
    }
  }
  return { samples, trace, events, accepted, rejected, lowerAccepted, swaps, swapAttempts, strengths, proposals, burn,
    evaluations: states.length * (s.steps + burn + 1) };
}
export function densityHistogram(samples: number[], bins = 48) {
  const counts = new Array(bins).fill(0), width = 12 / bins;
  for (const x of samples) { const bin = Math.floor((x + 6) / width); if (bin >= 0 && bin < bins) counts[bin]++; }
  return counts.map((count, i) => ({ x: -6 + i * width, width, density: count / (Math.max(1, samples.length) * width) }));
}
export function summarize(samples: number[]) {
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  return { mean, right: samples.filter((x) => x > 0).length / samples.length,
    sd: Math.sqrt(samples.reduce((a, x) => a + (x - mean) ** 2, 0) / samples.length), outside: samples.filter((x) => Math.abs(x) > 6).length };
}
