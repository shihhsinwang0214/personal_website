import random
from collections import Counter

t = 0.3
h = 0.1
extra_flow = 0.2  # 改成 0：只往 MASK；正值：增加一組相反 flow。
n_samples = 10000
seed = 7

assert 0 < t < t + h < 1
assert extra_flow >= 0
tokens = ["想", "要", "[MASK]"]
p = [0.7 * (1 - t), 0.3 * (1 - t), t]
R = [
    [0, 0, (0.7 + extra_flow) / p[0]],
    [0, 0, 0.3 / p[1]],
    [extra_flow / p[2], 0, 0],
]
for i in range(3):
    R[i][i] = -sum(R[i])
Q = [[float(i == j) + h * R[i][j] for j in range(3)] for i in range(3)]
assert all(v >= 0 for row in Q for v in row), "h 太大，請縮小步長"


def transpose_times(matrix, vector):
    return [sum(vector[i] * matrix[i][j] for i in range(3)) for j in range(3)]


print("state 順序：", tokens)
print("目前的 PMF：", [round(v, 4) for v in p])
print("R 的每列：")
for row in R:
    print([round(v, 4) for v in row])
print("R^T p（PMF 的速度）：", [round(v, 4) for v in transpose_times(R, p)])
target = transpose_times(Q, p)
print("Q^T p（這一步之後）：", [round(v, 4) for v in target])

rng = random.Random(seed)
counts = Counter()
examples = []
for _ in range(n_samples):
    before = rng.choices(range(3), weights=p)[0]
    after = rng.choices(range(3), weights=Q[before])[0]
    counts[after] += 1
    if len(examples) < 8:
        examples.append(tokens[before] + " → " + tokens[after])
print("幾個樣本的轉換：", "；".join(examples))
print("樣本轉換後的比例：", [round(counts[i] / n_samples, 4) for i in range(3)])
print("線性 PMF path 的目標：", [round(v, 4) for v in [0.7 * (1 - t - h), 0.3 * (1 - t - h), t + h]])
