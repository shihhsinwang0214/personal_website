import random
from collections import Counter

t = 0.3
h = 0.1
p_think = 0.7  # 資料中第三格是「想」的比例，其餘是「要」。
n_samples = 10000
seed = 1

assert 0 <= t < t + h <= 1
assert 0 <= p_think <= 1
assert n_samples > 0
MASK = "[MASK]"
rng = random.Random(seed)
rate = 1 / (1 - t)
change_probability = h * rate


def advance(current):
    # 所有位置使用更新前的同一份序列。
    old = list(current)
    following = old.copy()
    for ell, token in enumerate(old):
        if token != MASK:
            # 已是 MASK 就留下；可見字依同一張二選一 PMF 抽樣。
            if rng.random() < change_probability:
                following[ell] = MASK
    return following


current = ["我", "今天", MASK, "吃", MASK]
print(f"加噪方向：t={t:g} → {t + h:g}")
print(f"每個可見字的 rate：{rate:.4f}")
print(f"每個可見字這一步被遮住的機率：{change_probability:.4f}")
print("目前序列：", "／".join(current))
print("各格這一步的 PMF：")
for ell, token in enumerate(current, start=1):
    pmf = {MASK: 1.0} if token == MASK else {
        token: round(1 - change_probability, 4),
        MASK: round(change_probability, 4),
    }
    print(f"  第 {ell} 格：{pmf}")
print("抽出的下一句：", "／".join(advance(current)))

before_counts = Counter()
after_counts = Counter()
mask_counts = [0] * len(current)
full_sentences = Counter()
for _ in range(n_samples):
    # 先依 U4.0 的做法，製造一筆時刻 t 的 snapshot。
    original = ["我", "今天", "想" if rng.random() < p_think else "要", "吃", "麥當勞"]
    before = [MASK if rng.random() < t else token for token in original]
    # 再只讀取 before，用各格的轉移機率走到 t+h。
    after = advance(before)
    before_counts[before[2]] += 1
    after_counts[after[2]] += 1
    full_sentences[tuple(after)] += 1
    for ell, token in enumerate(after):
        mask_counts[ell] += token == MASK

order = ["想", "要", MASK]
following_time = t + h
print("\n重複", n_samples, "個獨立樣本；第三格順序：", order)
print("更新前比例：", [round(before_counts[a] / n_samples, 4) for a in order])
print("更新後比例：", [round(after_counts[a] / n_samples, 4) for a in order])
print("指定 path 的比例：", [round(p_think * (1 - following_time), 4),
      round((1 - p_think) * (1 - following_time), 4), round(following_time, 4)])
print("更新後各格 MASK 比例：", [round(n / n_samples, 4) for n in mask_counts])
print("每格指定的 MASK 比例：", round(following_time, 4))

whole = ("我", "今天", "想", "吃", "麥當勞")
print("整句完全未遮、且第三格為『想』的比例：", round(full_sentences[whole] / n_samples, 4))
print("這個整句事件的理論機率：", round(p_think * (1 - following_time) ** len(whole), 4))
print("\n這是已知加噪規則的實驗，沒有使用學好的 denoiser。")
