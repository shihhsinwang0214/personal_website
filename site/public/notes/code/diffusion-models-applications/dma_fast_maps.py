"""U5/U6: executable Gaussian laboratories. Requires Python 3.10+ and NumPy.

python dma_fast_maps.py --unit all --steps 4000 --seeds 0 1 2 --out results
The networks are trained; oracle formulas are used only where explicitly named.
"""
from __future__ import annotations
import argparse
import csv
import json
from pathlib import Path
import numpy as np


class MLP:
    """One hidden tanh layer; manual backprop and exact input JVP."""
    def __init__(self, inputs, hidden=32, seed=0):
        rng = np.random.default_rng(seed)
        self.p = [rng.normal(0, 1 / np.sqrt(inputs), (inputs, hidden)),
                  np.zeros(hidden), rng.normal(0, .05, (hidden, 1)), np.zeros(1)]
        self.m = [np.zeros_like(p) for p in self.p]
        self.v = [np.zeros_like(p) for p in self.p]
        self.k = 0

    def forward(self, features):
        h = np.tanh(features @ self.p[0] + self.p[1])
        return (h @ self.p[2] + self.p[3])[:, 0], h

    def jvp(self, features, direction):
        _, h = self.forward(features)
        return (((1 - h*h) * (direction @ self.p[0])) @ self.p[2])[:, 0]

    def update(self, features, h, dloss_doutput, lr=.0015):
        """dloss already includes the batch average. Targets are frozen numbers."""
        g = dloss_doutput[:, None]
        gh = (g @ self.p[2].T) * (1 - h*h)
        grads = [features.T @ gh, gh.sum(0), h.T @ g, g.sum(0)]
        norm = np.sqrt(sum(np.sum(a*a) for a in grads))
        grads = [a * min(1., 10. / (norm + 1e-12)) for a in grads]
        self.k += 1
        for i, grad in enumerate(grads):
            self.m[i] = .9*self.m[i] + .1*grad
            self.v[i] = .999*self.v[i] + .001*grad*grad
            mhat = self.m[i] / (1 - .9**self.k)
            vhat = self.v[i] / (1 - .999**self.k)
            self.p[i] -= lr*mhat / (np.sqrt(vhat) + 1e-8)


def ve_velocity(x, t):
    return t*x / (1 + t*t)


def ve_map(x, t):
    return x / np.sqrt(1 + t*t)


def cm_forward(net, x, t, T=2.):
    f = np.column_stack((x/np.sqrt(1+t*t), t/T))
    raw, hidden = net.forward(f)
    skip, out = 1/(1+t*t), t/np.sqrt(1+t*t)
    return skip*x + out*raw, (f, hidden, out)


def train_cm(mode, steps=4000, seed=0, batch=256, T=2., max_grid=32):
    rng = np.random.default_rng(seed)
    net = MLP(2, seed=seed)
    history = []
    for k in range(steps):
        N = min(max_grid, 4 * 2**int(3*k/max(steps, 1)))
        grid = np.linspace(0, T, N+1)
        i = rng.integers(0, N, batch)
        s, t = grid[i], grid[i+1]
        x0, eps = rng.normal(size=(2, batch))
        xt = x0 + t*eps
        lower = xt - (t-s)*ve_velocity(xt, t) if mode == 'CD' else x0+s*eps
        target, _ = cm_forward(net, lower, s, T)  # No gradient through this branch.
        pred, (features, hidden, out) = cm_forward(net, xt, t, T)
        weight = 1 / (t-s)
        residual = pred-target
        net.update(features, hidden, 2*weight*residual*out/batch)
        if k % max(1, steps//20) == 0:
            history.append([k, float(np.mean(weight*residual**2))])
    return net, history


def cm_sample(net, z, calls, rng, T=2., oracle=False):
    x = np.sqrt(1+T*T)*z  # Exact p_T, rather than approximate N(0,T^2).
    for k, t in enumerate(np.linspace(T, .15, calls)):
        if k:
            x = x+t*rng.normal(size=len(x))
        x = ve_map(x, t) if oracle else cm_forward(net, x, np.full(len(x), t), T)[0]
    return x


def fm_mean(t):
    return 2*t


def fm_var(t):
    return (1-t)**2 + .36*t*t


def fm_velocity(x, t):
    return 2 + (-2*(1-t)+.72*t)/(2*fm_var(t))*(x-fm_mean(t))


def flow_map(x, r, t):
    return fm_mean(r)+np.sqrt(fm_var(r)/fm_var(t))*(x-fm_mean(t))


def mean_velocity(x, r, t):
    """Stable exact mean velocity, including the r=t limit."""
    q_t, q_r = fm_var(t), fm_var(r)
    # (q(r)-q(t))/(r-t) = -2 + 1.36*(r+t)
    ratio = (-2+1.36*(r+t))/(np.sqrt(q_t)*(np.sqrt(q_r)+np.sqrt(q_t)))
    return 2+ratio*(x-fm_mean(t))


def meanflow_features(x, r, t):
    return np.column_stack((x/3, r, t))


def meanflow_target(net, x, r, t, velocity):
    f = meanflow_features(x, r, t)
    direction = np.column_stack((velocity/3, np.zeros_like(t), np.ones_like(t)))
    return velocity+(r-t)*net.jvp(f, direction)


def train_meanflow(mode='MeanFlow', steps=4000, seed=0, batch=256):
    rng = np.random.default_rng(seed)
    net = MLP(3, seed=seed)
    history = []
    for k in range(steps):
        a, b = rng.random((2, batch))
        t, r = np.minimum(a, b), np.maximum(a, b)
        r = np.where(rng.random(batch) < .25, t, r)
        x0 = rng.normal(size=batch)
        x1 = 2+.6*rng.normal(size=batch)
        x = (1-t)*x0+t*x1
        velocity = x1-x0
        features = meanflow_features(x, r, t)
        target = (meanflow_target(net, x, r, t, velocity)
                  if mode == 'MeanFlow' else velocity)
        pred, hidden = net.forward(features)
        net.update(features, hidden, 2*(pred-target)/batch)
        if k % max(1, steps//20) == 0:
            history.append([k, float(np.mean((pred-target)**2))])
    return net, history


def learned_map(net, x, r, t):
    x = np.asarray(x)
    r, t = np.broadcast_to(r, x.shape), np.broadcast_to(t, x.shape)
    return x+(r-t)*net.forward(meanflow_features(x, r, t))[0]


def fm_sample(net, z, calls, oracle=False):
    x = z.copy()
    grid = np.linspace(0, 1, calls+1)
    for t, r in zip(grid[:-1], grid[1:]):
        x = flow_map(x, r, t) if oracle else learned_map(net, x, r, t)
    return x


def empirical_w2(x, reference):
    return float(np.sqrt(np.mean((np.sort(x)-np.sort(reference))**2)))


def save_rows(out, filename, rows):
    with (out/filename).open('w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def unit5(out, steps, seeds):
    rows, histories = [], []
    # Check conditional means at a fixed x_t with a Gaussian posterior sample.
    rng = np.random.default_rng(123)
    x, t = .7, 1.5
    x0 = x/(1+t*t)+np.sqrt(t*t/(1+t*t))*rng.normal(size=100000)
    eps = (x-x0)/t
    local = []
    for h in (.2, .1, .05):
        ct = x0+(t-h)*eps
        euler = x-h*ve_velocity(x, t)
        exact = np.sqrt((1+(t-h)**2)/(1+t*t))*x
        local.append(dict(h=h, conditional_mean_error=float(abs(ct.mean()-euler)),
                          conditional_std=float(ct.std()), euler_error=float(abs(euler-exact))))
    save_rows(out, 'u5-local.csv', local)
    for seed in seeds:
        rng = np.random.default_rng(seed+100)
        z, reference = rng.normal(size=(2, 4096))
        for mode in ('CD', 'CT'):
            net, hist = train_cm(mode, steps, seed)
            histories += [dict(seed=seed, mode=mode, step=k, loss=v) for k,v in hist]
            for calls in (1, 2, 4, 8):
                result = cm_sample(net, z, calls, np.random.default_rng(seed+200))
                rows.append(dict(seed=seed, mode=mode, calls=calls,
                    empirical_w2=empirical_w2(result, reference),
                    mean=float(result.mean()), std=float(result.std()),
                    map_rmse=(float(np.sqrt(np.mean((result-z)**2))) if calls == 1 else '')))
        for calls in (1, 2, 4, 8):
            result = cm_sample(None, z, calls, np.random.default_rng(seed+200), oracle=True)
            rows.append(dict(seed=seed, mode='oracle', calls=calls,
                empirical_w2=empirical_w2(result, reference), mean=float(result.mean()),
                std=float(result.std()), map_rmse=0. if calls == 1 else ''))
    save_rows(out, 'u5-results.csv', rows)
    save_rows(out, 'u5-training.csv', histories)
    return rows


def unit6(out, steps, seeds):
    rows, histories = [], []
    for seed in seeds:
        rng = np.random.default_rng(seed+300)
        z = rng.normal(size=4096)
        reference = 2+.6*rng.normal(size=4096)
        exact = flow_map(z, 1., 0.)
        for mode in ('MeanFlow', 'no_correction'):
            net, hist = train_meanflow(mode, steps, seed)
            histories += [dict(seed=seed, mode=mode, step=k, loss=v) for k,v in hist]
            direct = learned_map(net, z, 1., 0.)
            split = learned_map(net, learned_map(net, z, .5, 0.), 1., .5)
            for calls in (1, 2, 4, 8):
                result = fm_sample(net, z, calls)
                rows.append(dict(seed=seed, mode=mode, calls=calls,
                    empirical_w2=empirical_w2(result, reference),
                    map_rmse=float(np.sqrt(np.mean((result-exact)**2))),
                    semigroup_rmse=float(np.sqrt(np.mean((split-direct)**2))),
                    mean=float(result.mean()), std=float(result.std())))
        for calls in (1, 2, 4, 8):
            result = fm_sample(None, z, calls, oracle=True)
            rows.append(dict(seed=seed, mode='oracle', calls=calls,
                empirical_w2=empirical_w2(result, reference),
                map_rmse=float(np.sqrt(np.mean((result-exact)**2))),
                semigroup_rmse=float(np.sqrt(np.mean((flow_map(flow_map(z,.5,0.),1.,.5)-exact)**2))),
                mean=float(result.mean()), std=float(result.std())))
    save_rows(out, 'u6-results.csv', rows)
    save_rows(out, 'u6-training.csv', histories)
    return rows


def verify_identities():
    rng = np.random.default_rng(912)
    net = MLP(3)
    features, direction = rng.normal(size=(2, 20, 3))
    h = 1e-5
    fd = (net.forward(features+h*direction)[0]-net.forward(features-h*direction)[0])/(2*h)
    assert np.max(abs(fd-net.jvp(features, direction))) < 1e-8
    x, t, r = .4, .2, .8
    velocity = fm_velocity(x, t)
    du = (mean_velocity(x+h*velocity, r, t+h)-mean_velocity(x-h*velocity, r, t-h))/(2*h)
    assert abs(mean_velocity(x,r,t)-velocity-(r-t)*du) < 1e-8
    assert abs(mean_velocity(x,t,t)-fm_velocity(x,t)) < 1e-12
    assert abs(flow_map(flow_map(x,.5,t),r,.5)-flow_map(x,r,t)) < 1e-12
    arbitrary = rng.normal(size=10)
    assert np.array_equal(cm_forward(MLP(2), arbitrary, np.zeros(10))[0], arbitrary)
    return 'boundary, analytic JVP, MeanFlow identity, diagonal and semigroup: pass'


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--unit', choices=['5','6','all'], default='all')
    p.add_argument('--steps', type=int, default=4000)
    p.add_argument('--seeds', type=int, nargs='+', default=[0,1,2])
    p.add_argument('--out', type=Path, default=Path('fast-map-results'))
    args = p.parse_args()
    if args.steps < 1:
        p.error('--steps must be positive')
    args.out.mkdir(parents=True, exist_ok=True)
    report = dict(checks=verify_identities(), steps=args.steps, seeds=args.seeds, results={})
    for unit, fn in [('5',unit5),('6',unit6)]:
        if args.unit in (unit,'all'):
            rows = fn(args.out,args.steps,args.seeds)
            report['results'][unit] = rows
    (args.out/'summary.json').write_text(json.dumps(report, indent=2)+'\n')
    print(report['checks'])
    for unit, rows in report['results'].items():
        for mode in sorted(set(r['mode'] for r in rows)):
            vals=[r['empirical_w2'] for r in rows if r['mode']==mode and r['calls']==1]
            print(f'U{unit} {mode}: one-call empirical W2 mean={np.mean(vals):.5f}; range=[{min(vals):.5f}, {max(vals):.5f}]')


if __name__ == '__main__':
    main()
