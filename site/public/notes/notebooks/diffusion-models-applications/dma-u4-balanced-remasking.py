import random
from collections import Counter

t = 0.2  # 固定 diffusion 時間；這個實驗只檢查新增的修改轉移。
sigma = 0.5
correction_time = 2.0  # 在這個固定 t 執行多久的修改。
n_samples = 4000
seed = 7

assert 0 < t < 1 and sigma >= 0 and correction_time >= 0
alpha = 1 - t
tokens = ["想", "要", "[MASK]"]
posterior = [0.7, 0.3]
p = [alpha * 0.7, alpha * 0.3, 1 - alpha]


def added_generator(balance):
    reveal = sigma * alpha / (1 - alpha) if balance else sigma
    return [[-sigma, 0, sigma],
            [0, -sigma, sigma],
            [reveal * 0.7, reveal * 0.3, -reveal]]


def simulate(state, C, rng, trace=False):
    # 固定 t 的 rates 是常數，用 exponential waiting time 精確抽跳躍。
    elapsed = 0.0
    history = [tokens[state]]
    while True:
        rate = -C[state][state]
        if rate == 0:
            break
        elapsed += rng.expovariate(rate)
        if elapsed > correction_time:
            break
        destinations = [j for j in range(3) if j != state]
        state = rng.choices(destinations, weights=[C[state][j] for j in destinations])[0]
        history.append(tokens[state])
    if trace:
        print("一個樣本的修改過程：", " → ".join(history))
    return state


print("state 順序：", tokens)
print("原本 PMF：", [round(v, 3) for v in p])
for balance in (False, True):
    C = added_generator(balance)
    net = [sum(p[i] * C[i][j] for i in range(3)) for j in range(3)]
    rng = random.Random(seed)
    counts = Counter(simulate(rng.choices(range(3), weights=p)[0], C, rng)
                     for _ in range(n_samples))
    print("\n" + ("配平 flow" if balance else "只讓兩群的總 rate 相等"))
    print("新增的 PMF 速度 C^T p：", [round(v, 6) for v in net])
    print("修改後的抽樣比例：", [round(counts[i]/n_samples, 3) for i in range(3)])

simulate(1, added_generator(True), random.Random(seed), trace=True)
