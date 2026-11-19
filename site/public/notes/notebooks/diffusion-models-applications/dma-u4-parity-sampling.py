import random
from collections import Counter
from itertools import product

length = 8
masked_count = 3
n_runs = 800
seed = 7

assert isinstance(length, int) and 2 <= length <= 10
assert isinstance(masked_count, int) and 1 <= masked_count <= length
assert isinstance(n_runs, int) and n_runs > 0
MASK = -1
data = [x for x in product((0, 1), repeat=length) if sum(x) % 2 == 0]
rng = random.Random(seed)


def compatible(x):
    # x is the whole current sequence; no clean answer enters this function.
    return [z for z in data if all(a == MASK or a == b for a, b in zip(x, z))]


def posterior(x):
    states = compatible(x)
    assert states, "The oracle is undefined outside the data's support."
    return [sum(z[ell] for z in states) / len(states) for ell in range(length)]


def complete(x, method):
    y = list(x)
    if method == "joint":
        return rng.choice(compatible(x))
    probabilities = posterior(x)
    for ell in range(length):
        if y[ell] == MASK:
            if method == "sequential":
                probabilities = posterior(y)  # use the newly filled context
            y[ell] = int(rng.random() < probabilities[ell])
    return tuple(y)


counts = {name: Counter() for name in ("joint", "parallel", "sequential")}
for run in range(n_runs):
    clean = rng.choice(data)
    x = list(clean)
    positions = rng.sample(range(length), masked_count)
    for ell in positions:
        x[ell] = MASK
    if run == 0:
        print("First snapshot:", " ".join("M" if a == MASK else str(a) for a in x))
        probabilities = posterior(x)
        for ell in sorted(positions):
            print(f"Position {ell + 1}: P(0)={1-probabilities[ell]:.3f}, P(1)={probabilities[ell]:.3f}")
        print()
    # All three methods receive exactly this same snapshot.
    for name in counts:
        counts[name][complete(x, name)] += 1

print(f"length={length}, MASK count={masked_count}, runs={n_runs}")
for name, distribution in counts.items():
    legal = sum(count for x, count in distribution.items() if sum(x) % 2 == 0)
    assert sum(distribution.values()) == n_runs
    assert all(MASK not in x for x in distribution)
    target = 0.5 if name == "parallel" and masked_count >= 2 else 1.0
    print(f"{name:10s}  even parity={legal/n_runs:.3f}  theoretical target={target:.3f}")

print("\nThe oracle probabilities are exact; finite sample frequencies still fluctuate.")
