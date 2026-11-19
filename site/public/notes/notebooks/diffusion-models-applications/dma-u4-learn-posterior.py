import math
import random

seed = 7
n_pairs = 1000
training_steps = 300
learning_rate = 0.5
query_t = 0.5

# 同一個 context，收集到 70 句「想」、30 句「要」。
data = [["我", "今天", token, "吃", "麥當勞"]
        for token in ["想"] * 70 + ["要"] * 30]
rng = random.Random(seed)
labels = []
example = None
for _ in range(n_pairs):
    x0 = rng.choice(data)
    t = rng.random()
    x = x0.copy()  # 一次抽出的 reference sequence I_t = x。
    if rng.random() < t:  # alpha_t = 1-t；這個實驗只遮第三格。
        x[2] = "[MASK]"
        labels.append(int(x0[2] == "想"))
        example = (x, x0[2])

assert labels, "這次沒有抽到 MASK，請增加 n_pairs"
# 一個參數的分類模型：f(想)=sigmoid(theta)，f(要)=1-f(想)。
# 只有一種 masked context；此 MASK toy 的 posterior 不隨 t 改變。
theta = 0.0
observed = sum(labels) / len(labels)


def probability():
    return 1 / (1 + math.exp(-theta))


def cross_entropy(p):
    p = min(max(p, 1e-12), 1 - 1e-12)
    return -sum(y * math.log(p) + (1 - y) * math.log(1 - p)
                for y in labels) / len(labels)


initial_loss = cross_entropy(probability())
for _ in range(training_steps):
    gradient = probability() - observed  # 平均 CE 對 theta 的導數。
    theta -= learning_rate * gradient

p = probability()
print("一筆 training pair：", "／".join(example[0]), "→ label:", example[1])
print(f"MASK labels 共 {len(labels)} 筆，其中「想」占 {observed:.3f}")
print(f"CE：{initial_loss:.4f} → {cross_entropy(p):.4f}")
print(f"學到的 PMF：想 {p:.3f}、要 {1-p:.3f}")
assert 0 < query_t <= 1
rate = 1 / query_t
print(f"t={query_t} ，第三格的總 reveal rate：{rate:.3f}")
print(f"模型給的 rates：MASK→想 {rate*p:.3f}、MASK→要 {rate*(1-p):.3f}")
