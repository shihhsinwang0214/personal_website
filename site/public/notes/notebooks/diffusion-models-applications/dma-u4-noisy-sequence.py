import random
from collections import Counter

# 可以修改這些條件，再按一次執行。
mode = "mask"  # 改成 "uniform"，比較隨機換字。
seed = 7  # 換一個 seed，就會得到另一組抽樣結果。
times = [0, 0.25, 0.5, 0.75, 1]
samples_per_time = 3
probe_t = 0.3
repeats = 2000

x0 = ["我", "今天", "想", "吃", "麥當勞"]
vocab = x0 + ["要", "打", "籃球", "晚餐", "天空"]
MASK = "[MASK]"
assert mode in ("mask", "uniform"), 'mode 請填 "mask" 或 "uniform"'
noise_tokens = [MASK] if mode == "mask" else vocab
rng = random.Random(seed)


def noisy_state(t):
    assert 0 <= t <= 1, "時間 t 必須在 0 到 1 之間"
    alpha_t = 1 - t
    # 每個位置獨立決定：保留原字，或從 nu 重抽。
    return [
        token if rng.random() < alpha_t else rng.choice(noise_tokens)
        for token in x0
    ]


print("原句：" + "／".join(x0))
print(f"方法：{mode}，seed = {seed}")
for t in times:
    print(f"\nt = {t:.2f}，alpha_t = {1 - t:.2f}")
    for _ in range(samples_per_time):
        print("  " + "／".join(noisy_state(t)))

# 固定同一個時間，重複抽樣，觀察第三格的分布。
counts = Counter(noisy_state(probe_t)[2] for _ in range(repeats))
expected = 1 - probe_t
if mode == "uniform":
    expected += probe_t / len(vocab)  # 重抽也可能抽回原字。
print(f"\n固定 t = {probe_t}，重複抽 {repeats} 次，第三格的次數：")
print(dict(counts))
print(f"第三格是「想」的比例：{counts['想'] / repeats:.3f}")
print(f"PMF 給出的機率：{expected:.3f}")
