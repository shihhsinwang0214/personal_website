import random
from collections import Counter

steps = 8
n_runs = 2000
seed = 7

assert isinstance(steps, int) and steps >= 1
data = [("我", "今天", "想", "吃", "麥當勞"),
        ("我", "今天", "要", "吃", "麥當勞")]
data_weights = [0.7, 0.3]
MASK = "[MASK]"
rng = random.Random(seed)


def denoiser(x, t):
    # 用有限資料的精確 posterior 查表，代替 neural network。
    # x 是目前整句；每個 output 才是一格的 PMF。
    # 這個 MASK toy 的 posterior 不隨 t 改變；保留 t 以對齊 f_theta(x,t)。
    compatible = [w if all(a == MASK or a == b for a, b in zip(x, row)) else 0
                  for row, w in zip(data, data_weights)]
    assert sum(compatible) > 0, "目前 context 不在這個 toy 的 support 裡"
    predictions = []
    for ell in range(len(x)):
        pmf = Counter()
        for row, w in zip(data, compatible):
            pmf[row[ell]] += w / sum(compatible)
        predictions.append(pmf)
    return predictions


def generate(trace=False):
    x = [MASK] * 5  # 有限步 sampler 的一次實現 x_hat_1。
    if trace:
        print("t=1.00：" + "／".join(x))
    for k in range(steps, 0, -1):
        t, s = k / steps, (k - 1) / steps
        w = (t - s) / t  # alpha_t = 1-t 的精確翻開機率。
        old = x.copy()  # 本段已抽出的完整 sequence x_hat_t。
        prediction = denoiser(old, t)  # 每格預測都讀取同一份完整 context。
        for ell, token in enumerate(old):
            if token == MASK and rng.random() < w:
                pmf = prediction[ell]
                x[ell] = rng.choices(list(pmf), weights=list(pmf.values()))[0]
        if trace:
            print(f"t={s:.2f}，w={w:.3f}：" + "／".join(x))
    return tuple(x)


generate(trace=True)
counts = Counter(generate() for _ in range(n_runs))
print(f"\n完整生成 {n_runs} 趟後：")
for row, target in zip(data, data_weights):
    print("／".join(row), f"比例 {counts[row]/n_runs:.3f}；資料目標 {target:.3f}")
print("仍含 MASK 的句數：", sum(n for row, n in counts.items() if MASK in row))
