import random
from collections import Counter

# 已知原句的 reference 實驗；沒有使用模型或未知原字的預測。
original = ["我", "今天", "想", "吃", "麥當勞"]
t = 0.5
h = 0.1
n_samples = 10000
seed = 4

assert 0 < t <= 1 and 0 < h <= t, "需要 0 < h <= t <= 1"
assert n_samples > 0
MASK = "[MASK]"
rng = random.Random(seed)

# 本實驗固定 alpha(t) = 1 - t。
# r = -alpha'(t) / (1-alpha(t)) = 1/t。
# 這個線性 schedule 的精確翻開機率，剛好也等於 h*r。
rate = 1 / t
reveal_probability = h * rate


def advance(current):
    following = list(current)
    for ell, token in enumerate(current):
        if token == MASK and rng.random() < reveal_probability:
            # 這一步特別需要原句；真正生成時不知道 original。
            following[ell] = original[ell]
    return following


current = ["我", "今天", MASK, "吃", MASK]
assert len(original) == len(current)
assert MASK not in original
assert all(a == MASK or a == b for a, b in zip(current, original))
print("已知原句：", "／".join(original))
print(f"填回方向：t={t:g} → {t-h:g}")
print(f"目前 MASK 比例 t={t:g}，每單位時間要補回的質量是 1")
print(f"每個 MASK 的 rate：1/t = {rate:.4f}")
print(f"這一步翻開的機率：h/t = {reveal_probability:.4f}")
print("目前序列：", "／".join(current))
print("各格下一刻的 PMF：")
for ell, token in enumerate(current):
    pmf = {token: 1.0} if token != MASK else {
        original[ell]: round(reveal_probability, 4),
        MASK: round(1 - reveal_probability, 4),
    }
    print(f"  第 {ell+1} 格：{pmf}")
print("抽出的下一句：", "／".join(advance(current)))

# 固定同一份兩格 MASK 的 context，檢查它的下一步 joint transition。
fixed_counts = Counter(tuple(advance(current)) for _ in range(n_samples))
print("\n固定目前這句話，重複抽下一步：")
for flip_third, flip_fifth in ((False, False), (True, False),
                               (False, True), (True, True)):
    following = current.copy()
    if flip_third:
        following[2] = original[2]
    if flip_fifth:
        following[4] = original[4]
    theory = ((reveal_probability if flip_third else 1 - reveal_probability)
              * (reveal_probability if flip_fifth else 1 - reveal_probability))
    print("／".join(following),
          f"頻率 {fixed_counts[tuple(following)] / n_samples:.4f}；理論 {theory:.4f}")

before_counts = Counter()
after_counts = Counter()
mask_counts = [0] * len(original)
initial_masks = 0
revealed = 0
whole_original = 0
for _ in range(n_samples):
    # U4.0：同一筆原句，各格按 reference PMF 製造時刻 t 的 snapshot。
    before = [MASK if rng.random() < t else token for token in original]
    after = advance(before)
    before_counts[before[2]] += 1
    after_counts[after[2]] += 1
    for ell, (a, b) in enumerate(zip(before, after)):
        mask_counts[ell] += b == MASK
        initial_masks += a == MASK
        revealed += a == MASK and b != MASK
    whole_original += after == original

print("\n獨立重複", n_samples, "份 reference samples")
print("第三格順序：", [original[2], MASK])
print("更新前比例：", [round(before_counts[a] / n_samples, 4)
                       for a in [original[2], MASK]])
print("更新後比例：", [round(after_counts[a] / n_samples, 4)
                       for a in [original[2], MASK]])
print("指定 path：", [round(1 - t + h, 4), round(t - h, 4)])
print("更新後各格 MASK 比例：", [round(n / n_samples, 4) for n in mask_counts])
print("每格 MASK 的目標比例：", round(t - h, 4))
print("原本是 MASK 的格子，這一步翻開的比例：",
      round(revealed / initial_masks, 4) if initial_masks else "本次沒有 MASK")
print("條件翻開機率的理論值：", round(reveal_probability, 4))
print("整句填回原文的比例：", round(whole_original / n_samples, 5))
print("整句事件的理論機率：", round((1 - t + h) ** len(original), 5))
print("\n這裡知道每個原字，所以翻開就填回它；下一篇才學未知原字的 PMF。")
