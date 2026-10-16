import { defaults, type SteeringMode, type SteeringSettings } from './dojoSteering.ts';

/** Each cell is a complete, editable implementation; no browser results are injected. */
export function steeringPython(mode: SteeringMode, s: SteeringSettings = defaults(mode)) {
  let header = `import math
import numpy as np
import matplotlib.pyplot as plt

# 1. SETTINGS -- change one, run again, and explain the plotted evidence.
strength = ${s.strength}
condition = ${s.condition}  # 0 = left, 1 = right
noise_time = ${s.time}
observed_x = ${s.point}
N = ${s.candidates}  # candidates per returned sample
M = ${s.particles}  # particles per population
estimator = "${s.estimator}"  # "posterior", "plugin", "misleading"
checkpoints = ${s.stages}
steps = ${s.steps}
reward_kind = "${s.reward}"  # "right" or "two"
proposal_step = ${s.proposal}
rng = np.random.default_rng(${s.seed})
sigma = 0.55
grid = np.linspace(-6, 6, 481)
dx = grid[1] - grid[0]

# 2. FIXED MODEL -- analytic functions, no network training in this cell.
def pdf(x, mu=0.0, var=1.0):
    return np.exp(-0.5 * (x-mu)**2 / var) / np.sqrt(2*np.pi*var)
def Phi(x):
    return 0.5 * (1 + np.vectorize(math.erf)(np.asarray(x) / np.sqrt(2)))
def R(x):
    return x if reward_kind == "right" else -(np.abs(x)-2.5)**2
def moments(t):
    a = np.exp(-8*t)
    return np.sqrt(a), a*sigma**2 + 1-a
def sample_base(size, t=0.0):
    signal, var = moments(t)
    mu = np.where(rng.random(size) < 0.5, -2.0, 2.0)
    return signal*mu + np.sqrt(var)*rng.normal(size=size)
def sigmoid(v):
    return np.exp(-np.logaddexp(0, -v))
def post_params(x, t):
    signal, var = moments(t)
    right = sigmoid(4*signal*x/var)
    gain = signal*sigma**2/var
    left_mu = -2 + gain*(x + 2*signal)
    right_mu = 2 + gain*(x - 2*signal)
    variance = sigma**2*(1-np.exp(-8*t))/var
    return right, left_mu, right_mu, variance
def posterior_mean(x, t):
    w, m0, m1, v = post_params(x, t)
    return (1-w)*m0+w*m1
def h(x, t):
    if t == 0:
        return np.exp(strength*R(x))
    w, m0, m1, v = post_params(x, t)
    if reward_kind == "right":
        return (1-w)*np.exp(strength*m0+0.5*strength**2*v)+w*np.exp(strength*m1+0.5*strength**2*v)
    d = 1+2*strength*v
    def component(mu):
        result = 0.0
        for side in [-1, 1]:
            center = (mu+2*strength*v*side*2.5)/d
            factor = np.exp(-strength*(mu-side*2.5)**2/d)/np.sqrt(d)
            result += factor*Phi(side*center/np.sqrt(v/d))
        return result
    return (1-w)*component(m0)+w*component(m1)
base = 0.5*pdf(grid, -2, sigma**2)+0.5*pdf(grid, 2, sigma**2)
target = base*np.exp(strength*R(grid))
target /= target.sum()*dx  # finite-grid quadrature reference
reference = target
reference_label = "Tilt reference (quadrature on [-6,6])"
extra_figure = None
`;
  // Keep each lesson's code within its own prerequisites: U7.1 must not expose
  // U7.2's posterior h implementation merely because both cells share a builder.
  const usedFunctions: Record<SteeringMode, string[]> = {
    classifier: ['pdf','moments','sample_base','sigmoid'],
    cfg: ['pdf','moments','sample_base','sigmoid'],
    tilt: ['pdf','R'], posterior: ['pdf','Phi','R','moments','sigmoid','post_params','posterior_mean','h'],
    best: ['pdf','R','moments','sample_base'], importance: ['pdf','R','moments','sample_base'],
    smc: ['pdf','Phi','R','moments','sample_base','sigmoid','post_params','posterior_mean','h'],
    source: ['pdf','R'], tempering: ['pdf','R'],
  };
  for (const name of ['pdf','Phi','R','moments','sample_base','sigmoid','post_params','posterior_mean','h']) {
    if (!usedFunctions[mode].includes(name)) header=header.replace(new RegExp(`^def ${name}\\([\\s\\S]*?(?=^def |^base =)`, 'm'), '');
  }
  const usedSettings: Record<SteeringMode, string[]> = {
    classifier: ['strength','condition','noise_time','observed_x','steps'],
    cfg: ['strength','condition','noise_time','observed_x','steps'],
    tilt: ['strength','reward_kind'], posterior: ['strength','noise_time','observed_x','reward_kind'],
    best: ['strength','N','reward_kind'], importance: ['strength','N','reward_kind'],
    smc: ['strength','M','estimator','checkpoints','reward_kind'],
    source: ['strength','steps','reward_kind','proposal_step'], tempering: ['strength','steps','reward_kind','proposal_step'],
  };
  for (const name of ['strength','condition','noise_time','observed_x','N','M','estimator','checkpoints','steps','reward_kind','proposal_step']) {
    if (!usedSettings[mode].includes(name)) header=header.replace(new RegExp(`^${name} = .*\\n`, 'm'), '');
  }
  if (mode==='classifier'||mode==='cfg') header=header.replace(/target = base[\s\S]*?reference_label = [^\n]+/, 'reference = base.copy()\nreference_label = "Conditional reference at w=1"');
  let body: string;
  if (mode === 'classifier' || mode === 'cfg') body = `
# 3. GENERATION -- reverse VP SDE, Euler-Maruyama; beta = 8.
def base_score(x, t):
    signal, var = moments(t)
    right = sigmoid(4*signal*x/var)
    return (2*signal*(2*right-1)-x)/var
def conditional_score(x, t):
    signal, var = moments(t)
    return ((2 if condition else -2)*signal-x)/var
def classifier_log_gradient(x, t):
    signal, var = moments(t)
    right = sigmoid(4*signal*x/var)
    return 4*signal/var*((1-right) if condition else -right)
def guided(x, t):
${mode === 'classifier' ? '    return base_score(x, t)+strength*classifier_log_gradient(x, t)' : '    sc, su = conditional_score(x, t), base_score(x, t)\n    return sc+(strength-1)*(sc-su)'}
samples = sample_base(1000, 1.0)
dt = 1/steps
for k in range(steps, 0, -1):
    t = k*dt
    samples += (4*samples+8*guided(samples, t))*dt + np.sqrt(8*dt)*rng.normal(size=samples.size)
reference = pdf(grid, 2 if condition else -2, sigma**2)
reference_label = "Conditional reference at w=1 (not an exact w>1 target)"
print("Fixed analytic scores; finite-time and Euler error remain.")
print("Reverse steps:", steps, "sampler updates:", 1000*steps)
print("Signals per update: ${mode === 'classifier' ? 'base score + classifier input gradient' : 'conditional prediction + unconditional prediction'}")
print("At x_t, base / conditional / classifier gradient:", base_score(observed_x, noise_time), conditional_score(observed_x, noise_time), classifier_log_gradient(observed_x, noise_time))
`;
  else if (mode === 'tilt') body = `
# 3. GENERATION -- directly invert the finite-grid target CDF.
# This is possible in one dimension; it does not solve high-dimensional sampling.
cdf = np.cumsum(target*dx)
indices = np.searchsorted(cdf, rng.random(1000)).clip(0, len(grid)-1)
samples = grid[indices]+rng.uniform(-dx/2, dx/2, 1000)
print("Reference mass:", target.sum()*dx)
print("Target mean reward:", np.sum(target*R(grid))*dx)
`;
  else if (mode === 'posterior') body = `
# 3. POSTERIOR -- sample possible clean sources of this fixed noisy observation.
w, m0, m1, v = post_params(observed_x, noise_time)
samples = np.where(rng.random(1000) < w, m1, m0)+np.sqrt(v)*rng.normal(size=1000)
reference = (1-w)*pdf(grid, m0, v)+w*pdf(grid, m1, v)
reference_label = "Base posterior p(x0 | xt)"
mean = posterior_mean(observed_x, noise_time)
exact = h(observed_x, noise_time)
plugin = np.exp(strength*R(mean))
print("Posterior mean:", mean, "h_t:", exact, "plug-in:", plugin)
extra_figure, ax = plt.subplots(figsize=(8, 3.2))
ax.plot(grid, h(grid, noise_time), label="h_t: average the reward MULTIPLIERS")
ax.plot(grid, np.exp(strength*R(posterior_mean(grid, noise_time))), label="plug-in: score the posterior MEAN")
ax.axvline(observed_x, color="gray", linestyle=":")
ax.set(xlabel="noisy observation x_t", ylabel="weight (not density)")
ax.legend(fontsize=8)
extra_figure.tight_layout()
`;
  else if (mode === 'best' || mode === 'importance') body = `
# 3. GENERATION -- 1000 independent batches; return ONE sample per batch.
batch = sample_base((1000, N))
rewards = R(batch)
${mode === 'best' ? 'selected = np.argmax(rewards, axis=1)' : `weights = np.exp(strength*(rewards-rewards.max(axis=1, keepdims=True)))
weights /= weights.sum(axis=1, keepdims=True)
selected = np.sum(rng.random((1000, 1)) > np.cumsum(weights, axis=1), axis=1).clip(0, N-1)`}
samples = batch[np.arange(1000), selected]
print("Generated candidates and reward calls:", 1000*N)
print("First batch:", batch[0], "selected index:", selected[0])
print("Finite N does not guarantee the reference tilt.")
`;
  else if (mode === 'smc') body = `
# 3. SMC -- exact reverse transitions of the known mixture; finite M resampling.
def reverse_base(x, current_t, next_t):
    sig0, var0 = moments(next_t)
    sig1, var1 = moments(current_t)
    r = np.exp(-4*(current_t-next_t))
    right = sigmoid(4*sig1*x/var1)
    mu = np.where(rng.random(x.shape) < right, 2.0, -2.0)
    gain = r*var0/var1
    return sig0*mu+gain*(x-sig1*mu)+np.sqrt(max(0, var0-gain*gain*var1))*rng.normal(size=x.shape)
def H(x, t):
    if t == 1:
        return np.ones_like(x)  # H_K = 1
    if t == 0:
        return np.exp(strength*R(x))  # actual terminal reward
    if estimator == "posterior":
        return np.maximum(1e-100, h(x, t))
    if estimator == "plugin":
        return np.maximum(1e-100, np.exp(strength*R(posterior_mean(x, t))))
    return np.exp(np.clip(4*strength*x, -100, 100))  # deliberately wrong intermediate estimate
runs = 300
x = sample_base((runs, M), 1.0)
ancestor = np.tile(np.arange(M), (runs, 1))
trace = [x[0].copy()]
lineage = [ancestor[0].copy()]
for k in range(checkpoints):
    t = 1-k/checkpoints
    next_t = 0 if k+1 == checkpoints else 1-(k+1)/checkpoints
    proposed = reverse_base(x, t, next_t)
    log_weights = np.log(H(proposed, next_t))-np.log(H(x, t))
    weights = np.exp(log_weights-log_weights.max(axis=1, keepdims=True))
    weights /= weights.sum(axis=1, keepdims=True)
    # Each proposed child is divided by its OWN parent's H before resampling.
    cdf = np.cumsum(weights, axis=1)
    parents = np.stack([np.searchsorted(cdf[i], rng.random(M)).clip(0, M-1) for i in range(runs)])
    x = np.take_along_axis(proposed, parents, axis=1)
    ancestor = np.take_along_axis(ancestor, parents, axis=1)
    trace.append(x[0].copy())
    lineage.append(ancestor[0].copy())
# ONE output from each independent population, not 300*M independent descendants.
samples = x[np.arange(runs), rng.integers(M, size=runs)]
print("Independent populations:", runs, "particles each:", M)
print("Reverse transitions:", runs*M*checkpoints, "H calls:", 2*runs*M*checkpoints)
print("Surviving ancestors in the first population:", len(np.unique(ancestor[0])))
extra_figure, ax = plt.subplots(figsize=(8, 3.2))
for i, (positions, origins) in enumerate(zip(trace, lineage)):
    ax.scatter(positions, np.full(M, i), c=origins, cmap="tab20", s=15, vmin=0, vmax=max(1,M-1))
ax.set(xlabel="noisy state x_t (last row is clean)", ylabel="checkpoint in generation order")
ax.invert_yaxis()
extra_figure.tight_layout()
`;
  else body = `
# 3. SOURCE SEARCH -- a fixed quantile generator G; standard-Normal source prior.
def G(z):
    p = min(1-1e-12, max(1e-12, 0.5*(1+math.erf(z/math.sqrt(2)))))
    lo, hi = -8.0, 8.0
    for _ in range(40):
        mid = (lo+hi)/2
        cdf = 0.25*(2+math.erf((mid+2)/(sigma*math.sqrt(2)))+math.erf((mid-2)/(sigma*math.sqrt(2))))
        if cdf < p:
            lo = mid
        else:
            hi = mid
    return (lo+hi)/2
lambdas = ${mode === 'source' ? '[strength]' : '[0.0, strength/2, strength]'}
proposal_steps = ${mode === 'source' ? '[proposal_step]' : '[1.4, 0.8, proposal_step]'}  # step size is a separate choice
states = []
for _ in lambdas:
    x = G(-0.8)
    states.append([-0.8, x, float(R(x))])
samples, trace = [], []
accepted = swaps = lower_accepted = 0
burn = 400
for k in range(steps+burn):
    for j, lam in enumerate(lambdas):
        z, x, old_reward = states[j]
        proposed_z = z+proposal_steps[j]*rng.normal()
        proposed_x = G(proposed_z)
        proposed_reward = float(R(proposed_x))
        log_ratio = -0.5*(proposed_z**2-z**2)+lam*(proposed_reward-old_reward)
        if math.log(max(1e-300, rng.random())) < min(0, log_ratio):
            accepted += 1
            lower_accepted += proposed_reward < old_reward
            states[j] = [proposed_z, proposed_x, proposed_reward]
    if len(states) > 1:
        j = k % 2
        log_ratio = (lambdas[j]-lambdas[j+1])*(states[j+1][2]-states[j][2])
        if math.log(max(1e-300, rng.random())) < min(0, log_ratio):
            states[j], states[j+1] = states[j+1], states[j]  # swap z, G(z), reward together
            swaps += 1
    if k >= burn:
        samples.append(states[-1][1])  # keep rejected/repeated states too
        trace.append([state[0] for state in states])
samples = np.asarray(samples)
print("G and reward evaluations:", len(lambdas)*(steps+burn+1))
print("Accepted:", accepted, "accepted lower rewards:", lower_accepted, "swaps:", swaps)
print("Histogram includes rejections; states are correlated. Burn-in does not certify convergence.")
extra_figure, ax = plt.subplots(figsize=(8, 3.2))
for j, lam in enumerate(lambdas):
    ax.plot(np.asarray(trace)[:,j], label=f"source chain, lambda={lam:g}", alpha=0.8)
ax.set(xlabel="retained iteration (rejections included)", ylabel="source z")
ax.legend(fontsize=8)
extra_figure.tight_layout()
`;
  return header + body + `
# 4. PLOT AND CHECK -- the histogram is from the samples above.
fig, ax = plt.subplots(figsize=(8, 3.6))
ax.plot(grid, base, "--", color="gray", label="Original base")
ax.plot(grid, reference, ":", color="black", label=reference_label)
ax.hist(samples, bins=np.linspace(-6,6,49), weights=np.ones(len(samples))/(len(samples)*0.25), alpha=0.5, label="Actual generated samples")
ax.set(xlabel="clean x0", ylabel="density", xlim=(-6,6))
ax.legend(fontsize=8)
fig.tight_layout()
print("Outputs:", len(samples), "mean:", np.mean(samples), "right share:", np.mean(samples > 0))
print("Outside the plotted window:", np.sum(np.abs(samples)>6))
plt.show()
`;
}
