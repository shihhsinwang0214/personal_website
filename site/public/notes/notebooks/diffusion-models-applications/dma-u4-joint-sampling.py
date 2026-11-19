import math
import random
from collections import Counter

n_runs = 4000
seed = 7
# 位置編號從 1 開始；同一個括號裡的格子共用舊 context。
schedules = [[(4, 5)], [(4,), (5,)], [(5,), (4,)]]
data = [("我", "今天", "想", "吃", "麥當勞"),
        ("我", "今天", "想", "打", "籃球")]
MASK = "[MASK]"
rng = random.Random(seed)


def generate(groups):
    x = ["我", "今天", "想", MASK, MASK]
    for group in groups:
        old = x.copy()
        compatible = [row for row in data
                      if all(a == MASK or a == b for a, b in zip(old, row))]
        assert compatible, "目前 context 沒有相容原句"
        for position in group:
            ell = position - 1
            # 每格的精確 conditional marginal；每格各自抽一個答案。
            x[ell] = rng.choice([row[ell] for row in compatible])
    return tuple(x)


for groups in schedules:
    counts = Counter(generate(groups) for _ in range(n_runs))
    valid = sum(n for row, n in counts.items() if row in data)
    print(f"\n分組 {groups}：符合資料搭配的比例 {valid/n_runs:.3f}")
    for row, n in sorted(counts.items()):
        print("／".join(row), f"{n/n_runs:.3f}")

# 這個 toy：真 joint 的兩種搭配各 1/2；獨立乘積給四種各 1/4。
fe = sum(0.5 * math.log(0.5 / 0.25) for _ in data)
print(f"\n同批填兩格的理論 factorization error：{fe:.4f} = log(2)")
