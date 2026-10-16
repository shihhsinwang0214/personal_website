/** The same two Gaussian components support all three U7.0 implementations. */
export type ToyMethod = 'conditional' | 'finetune' | 'steering';
export const TOY = { left: -2, right: 2, sigma: 0.55, min: -5, max: 5 };
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export function seededRandom(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function gaussian(mean: number, random: () => number) {
  return mean + TOY.sigma * Math.sqrt(-2 * Math.log(Math.max(Number.MIN_VALUE, random()))) * Math.cos(2 * Math.PI * random());
}

export function normalDensity(x: number, mean: number) {
  return Math.exp(-0.5 * ((x - mean) / TOY.sigma) ** 2) / (TOY.sigma * Math.sqrt(2 * Math.PI));
}

// Numerical normal CDF (absolute approximation error below 1e-7).
export function normalCDF(x: number, mean: number) {
  const z = (x - mean) / TOY.sigma;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const tail = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - tail : tail;
}

export const mixtureDensity = (x: number, right = 0.5) => (1 - right) * normalDensity(x, TOY.left) + right * normalDensity(x, TOY.right);
export const mixtureCDF = (x: number) => 0.5 * normalCDF(x, TOY.left) + 0.5 * normalCDF(x, TOY.right);

export function mixtureSamples(n: number, right: number, random: () => number): number[] {
  return Array.from({ length: n }, () => gaussian(random() < right ? TOY.right : TOY.left, random));
}

export function conditionalData() {
  const random = seededRandom(20261016);
  return [TOY.left, TOY.right].map((mean) => Array.from({ length: 256 }, () => gaussian(mean, random)));
}

export function conditionalLoss(means: number[], data: number[][]) {
  return data.reduce((total, xs, c) => total + xs.reduce((s, x) => s + 0.5 * (means[c] - x) ** 2, 0), 0) / data.flat().length;
}

/** Full-batch gradient descent on the labelled Gaussian means, not a preset interpolation. */
export function trainConditional(means: number[], data: number[][], steps: number) {
  const next = means.slice();
  const targets = data.map((xs) => xs.reduce((a, b) => a + b, 0) / xs.length);
  for (let k = 0; k < steps; k++) for (let c = 0; c < 2; c++) next[c] -= 0.15 * 0.5 * (next[c] - targets[c]);
  return { means: next, loss: conditionalLoss(next, data) };
}

export function mixtureNLL(logit: number, data: number[]) {
  const right = sigmoid(logit);
  return -data.reduce((s, x) => s + Math.log(Math.max(1e-300, mixtureDensity(x, right))), 0) / data.length;
}

export function mixtureGradient(logit: number, data: number[]) {
  const right = sigmoid(logit);
  const responsibility = data.reduce((s, x) => s + right * normalDensity(x, TOY.right) / Math.max(1e-300, mixtureDensity(x, right)), 0) / data.length;
  return right - responsibility;
}

/** Fine-tune the original mixture's logit on new preferred data by its likelihood. */
export function trainMixture(logit: number, data: number[], steps: number) {
  for (let k = 0; k < steps; k++) logit -= 0.3 * mixtureGradient(logit, data);
  return { logit, right: sigmoid(logit), loss: mixtureNLL(logit, data) };
}

export function selectedDensity(x: number, candidates: number, direction: number) {
  if (candidates === 1) return mixtureDensity(x);
  const f = mixtureCDF(x);
  return candidates * mixtureDensity(x) * (direction > 0 ? f : 1 - f) ** (candidates - 1);
}

export function selectedSamples(n: number, candidates: number, direction: number, random: () => number) {
  return Array.from({ length: n }, () => {
    const batch = mixtureSamples(candidates, 0.5, random);
    return direction > 0 ? Math.max(...batch) : Math.min(...batch);
  });
}

export interface DistributionObservation {
  means: number[];
  logit: number;
  choice: number;
  preferred: number;
  candidates: number;
  updates: number;
  samples: number[];
  loss?: number;
}

export function observationDensity(method: ToyMethod, observation: DistributionObservation, x: number) {
  if (method === 'conditional') return normalDensity(x, observation.means[observation.choice > 0 ? 1 : 0]);
  if (method === 'finetune') return mixtureDensity(x, sigmoid(observation.logit));
  return selectedDensity(x, observation.candidates, observation.choice);
}

/** Two controlled observations. The second operation never updates parameters. */
export function distributionComparison(method: ToyMethod): [DistributionObservation, DistributionObservation] {
  const initial = { means: method === 'conditional' ? [0, 0] : [TOY.left, TOY.right], logit: 0, choice: 1, preferred: 0.9, candidates: 1, updates: 0, samples: [] as number[] };
  const random = seededRandom(20261017);
  if (method === 'conditional') {
    const learned = trainConditional(initial.means, conditionalData(), 60);
    const first = { ...initial, means: learned.means, updates: 60, loss: learned.loss, samples: Array.from({ length: 1000 }, () => gaussian(learned.means[1], random)) };
    const second = { ...first, means: first.means.slice(), choice: -1, samples: Array.from({ length: 1000 }, () => gaussian(learned.means[0], random)) };
    return [first, second];
  }
  if (method === 'finetune') {
    const data = mixtureSamples(512, 0.9, seededRandom(61));
    const learned = trainMixture(0, data, 60);
    const first = { ...initial, logit: learned.logit, updates: 60, loss: learned.loss, samples: mixtureSamples(1000, learned.right, random) };
    const second = { ...first, preferred: 0.1, loss: mixtureNLL(learned.logit, mixtureSamples(512, 0.1, seededRandom(61))), samples: mixtureSamples(1000, learned.right, random) };
    return [first, second];
  }
  return [
    { ...initial, samples: selectedSamples(1000, 1, 1, random) },
    { ...initial, means: initial.means.slice(), candidates: 32, samples: selectedSamples(1000, 32, 1, random) },
  ];
}

export function histogram(samples: number[], bins = 40) {
  const width = (TOY.max - TOY.min) / bins;
  const counts = new Array<number>(bins).fill(0);
  samples.forEach((x) => {
    const index = Math.floor((x - TOY.min) / width);
    if (index >= 0 && index < bins) counts[index]++;
  });
  return counts.map((n, i) => ({ x: TOY.min + i * width, width, density: n / (Math.max(1, samples.length) * width) }));
}

export function densityPath(values: number[], height: number, ymax: number) {
  return values.map((y, i) => `${i ? 'L' : 'M'}${(52 + i / (values.length - 1) * 640).toFixed(2)},${(height - y / ymax * (height - 22)).toFixed(2)}`).join(' ');
}

export function distributionPython(method: ToyMethod, choice = 1, steps = 60, preferred = 0.9, candidates = 8) {
  const controls = method === 'conditional' ? `c = ${choice > 0 ? 1 : 0}  # EDIT: 0 = left, 1 = right
steps = ${steps}` : method === 'finetune' ? `preferred_right = ${preferred}  # EDIT: share in the new DATA
steps = ${steps}` : `N = ${candidates}
direction = ${choice > 0 ? 1 : -1}  # EDIT: R(x0) = direction * x0`;
  const prelude = `import math
import numpy as np
import matplotlib.pyplot as plt

# 1. DATA AND SETTINGS -- edit one setting above the model code.
${controls}
rng = np.random.default_rng(42)
sigma = 0.55
grid = np.linspace(-5, 5, 500)
def pdf(x, mu):
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))
def sample_mixture(n, right=0.5):
    mu = np.where(rng.random(n) < right, 2.0, -2.0)
    return rng.normal(mu, sigma)
base = 0.5 * pdf(grid, -2) + 0.5 * pdf(grid, 2)
`;
  let body: string;
  if (method === 'conditional') body = `
data = [rng.normal(mu, sigma, 256) for mu in [-2.0, 2.0]]

# 2. TRAINING -- each full Run starts from these initial means.
means = np.zeros(2)
for _ in range(steps):
    gradient = 0.5 * np.array([means[label] - data[label].mean() for label in [0, 1]])
    means -= 0.15 * gradient

# 3. GENERATION -- both inputs below use the SAME trained means.
for label in [0, 1]:
    print("same trained parameters, c =", label, "uses mean", means[label])
samples = rng.normal(means[c], sigma, 1000)
target = pdf(grid, [-2.0, 2.0][c])
after = pdf(grid, means[c])
print("Trained means:", means)
`;
  else if (method === 'finetune') body = `
data = sample_mixture(512, preferred_right)

# 2. TRAINING -- update the original model on the preferred DATA.
logit = 0.0
for _ in range(steps):
    right = 1 / (1 + np.exp(-logit))
    density = (1 - right) * pdf(data, -2) + right * pdf(data, 2)
    responsibility = right * pdf(data, 2) / density
    gradient = right - responsibility.mean()
    logit -= 0.3 * gradient

# 3. GENERATION -- retain the learned weight; no new update here.
right = 1 / (1 + np.exp(-logit))
samples = sample_mixture(1000, right)
target = (1 - preferred_right) * pdf(grid, -2) + preferred_right * pdf(grid, 2)
after = (1 - right) * pdf(grid, -2) + right * pdf(grid, 2)
print("Updated logit:", logit, "right-mode probability:", right)
`;
  else body = `
# 2. FIXED MODEL -- no training or parameter update.
# 3. GENERATION AND SELECTION -- create actual candidates, then compare rewards.
batch = sample_mixture(1000 * N).reshape(1000, N)
indices = np.argmax(direction * batch, axis=1)
samples = batch[np.arange(1000), indices]
def cdf(x, mu):
    return np.array([0.5 * (1 + math.erf((v - mu) / (sigma * np.sqrt(2)))) for v in x])
F = 0.5 * cdf(grid, -2) + 0.5 * cdf(grid, 2)
after = N * base * (F if direction > 0 else 1 - F) ** (N - 1)
print("Base right-mode probability is still 0.5; complete generations:", 1000 * N)
`;
  return prelude + body + `
# 4. PLOTTING -- density curves and the actual returned samples.
plt.figure(figsize=(7, 3.8))
plt.plot(grid, base, color="gray", linestyle="--", label="original base")
${method !== 'steering' ? 'plt.plot(grid, target, color="teal", linestyle=":", label="training-data target")\n' : ''}plt.plot(grid, after, color="darkorange", label="model / returned density")
plt.hist(samples, bins=np.linspace(-5, 5, 41), density=True, alpha=0.25, color="darkorange", label="1000 generated outputs")
plt.xlabel("x0")
plt.ylabel("density")
plt.xlim(-5, 5)
plt.legend(fontsize=8)
plt.tight_layout()
plt.show()`;
}
