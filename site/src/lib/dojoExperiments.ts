/** Small, explicit probability models used by the in-page experiments. */
export type ReturnRule = 'base' | 'best' | 'tilt';
export type ExperimentMode = 'candidates' | 'proportions';

export function experimentPython(mode: ExperimentMode, p = mode === 'candidates' ? 0.01 : 0.5, n = 10, strength = Math.log(3), rule: ReturnRule = 'tilt') {
  if (mode === 'candidates') return `import random

p = ${p}
N = ${n}
trials = 1000
rng = random.Random(42)

hits = 0
for _ in range(trials):
    batch = [rng.random() < p for _ in range(N)]
    hits += any(batch)

print(f"At least one hit: {hits / trials:.1%}")
print(f"Theory: {1 - (1 - p) ** N:.1%}")
print(f"Complete candidates generated: {N * trials}")`;
  return `import math
import random

base_b = ${p}
strength = ${strength}
rule = "${rule}"  # "base", "best", or "tilt"
trials = 1000
rng = random.Random(42)

# Reward(A) = 0; Reward(B) = 1.
weights = [1 - base_b, base_b * math.exp(strength)]
target_b = weights[1] / sum(weights)
if rule == "base":
    return_b = base_b
elif rule == "best":
    return_b = float(base_b > 0)
else:
    return_b = target_b

samples = rng.choices(["A", "B"], weights=[1 - return_b, return_b], k=trials)
print(f"Target B: {target_b:.1%}")
print(f"Rule B: {return_b:.1%}")
print(f"Observed B: {samples.count('B') / trials:.1%}")`;
}

function probability(p: number) {
  if (!Number.isFinite(p) || p < 0 || p > 1) throw new RangeError('Probability must be between 0 and 1.');
}

function count(n: number) {
  if (!Number.isSafeInteger(n) || n < 1) throw new RangeError('Count must be a positive integer.');
}

export function atLeastOne(p: number, candidates: number): number {
  probability(p); count(candidates);
  if (candidates === 1) return p;
  return p === 1 ? 1 : -Math.expm1(candidates * Math.log1p(-p));
}

export function simulateCandidates(p: number, candidates: number, trials: number, random = Math.random) {
  probability(p); count(candidates); count(trials);
  let hits = 0;
  const preview: boolean[] = [];
  for (let i = 0; i < trials; i++) {
    let hit = false;
    // Every batch pays for N complete candidates, including after its first hit.
    for (let j = 0; j < candidates; j++) if (random() < p) hit = true;
    if (hit) hits++;
    if (preview.length < 40) preview.push(hit);
  }
  return { hits, trials, preview, generated: candidates * trials, expected: atLeastOne(p, candidates) };
}

/** A has reward 0; B has reward 1. Strength is lambda >= 0. */
export function tiltedB(baseB: number, strength: number): number {
  probability(baseB);
  if (!Number.isFinite(strength) || strength < 0) throw new RangeError('Strength must be finite and nonnegative.');
  if (baseB === 0 || baseB === 1) return baseB;
  const logOdds = Math.log(baseB) - Math.log1p(-baseB) + strength;
  return logOdds >= 0 ? 1 / (1 + Math.exp(-logOdds)) : Math.exp(logOdds) / (1 + Math.exp(logOdds));
}

export function ruleProbability(baseB: number, strength: number, rule: ReturnRule): number {
  const target = tiltedB(baseB, strength);
  if (rule === 'base') return baseB;
  // Choose the highest-reward result in the support; this is not Best-of-N.
  if (rule === 'best') return baseB > 0 ? 1 : 0;
  if (rule === 'tilt') return target;
  throw new RangeError('Unknown return rule.');
}

export function simulateRule(baseB: number, strength: number, rule: ReturnRule, trials: number, random = Math.random) {
  count(trials);
  const actual = ruleProbability(baseB, strength, rule);
  let hits = 0;
  const preview: boolean[] = [];
  for (let i = 0; i < trials; i++) {
    const b = random() < actual;
    if (b) hits++;
    if (preview.length < 40) preview.push(b);
  }
  return { hits, trials, preview, expected: actual, target: tiltedB(baseB, strength) };
}
