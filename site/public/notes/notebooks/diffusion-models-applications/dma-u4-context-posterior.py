"""同一組句子：固定 input 與讀取部分句子的分類訓練。

固定前三格，只對第四、第五格製造遮罩。兩種模型都從相同的
training pairs 用 CE 更新 logits；conditional 模型多讀另一格的內容。
這是小型查表分類器的參數學習，不是已知 posterior 的 oracle。
"""
import math
import random

seed = 7
n_pairs = 4000
training_steps = 800
learning_rate = 0.6
n_runs = 4000
MASK = "[MASK]"
DATA = [("吃", "麥當勞"), ("打", "籃球")]
rng = random.Random(seed)

# 每個位置的兩個候選。其他位置固定，不在這份小實驗裡訓練。
WORDS = [("吃", "打"), ("麥當勞", "籃球")]

def context_key(partial, position):
    # 另一格未知 / 出現第一種搭配 / 出現第二種搭配。
    other = 1 - position
    token = partial[other]
    return 0 if token == MASK else 1 + WORDS[other].index(token)

# counts[position][context] = [label 總數, 第一個候選的次數]
counts = [[[0, 0] for _ in range(3)] for _ in range(2)]
example = None
for _ in range(n_pairs):
    clean = DATA[rng.randrange(2)]
    t = rng.random()
    partial = tuple(MASK if rng.random() < t else a for a in clean)
    if example is None and MASK in partial:
        example = (partial, clean)
    for position in range(2):
        if partial[position] != MASK:
            continue
        key = context_key(partial, position)
        counts[position][key][0] += 1
        counts[position][key][1] += int(clean[position] == WORDS[position][0])

# 固定 input 的模型只各有一個 logit；conditional 模型每個 context 有一個。
fixed_counts = [[sum(row[0] for row in head), sum(row[1] for row in head)]
                for head in counts]
fixed_logits = [0.0, 0.0]
context_logits = [[0.0] * 3 for _ in range(2)]

def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-max(-40.0, min(40.0, z))))

def mean_ce(logits, groups):
    total_loss = 0.0
    total_labels = 0
    for z, (n, positive) in zip(logits, groups):
        if n:
            p = min(1 - 1e-12, max(1e-12, sigmoid(z)))
            total_loss -= positive * math.log(p) + (n - positive) * math.log(1 - p)
            total_labels += n
    return total_loss / max(1, total_labels)

initial_ce = mean_ce([0.0] * 6, [row for head in counts for row in head])
for _ in range(training_steps):
    for position in range(2):
        n, positive = fixed_counts[position]
        if n:
            fixed_logits[position] -= learning_rate * (sigmoid(fixed_logits[position]) - positive / n)
        for key in range(3):
            n, positive = counts[position][key]
            if n:
                # 每個 context 的平均 CE，對它的 logit 的 gradient。
                context_logits[position][key] -= learning_rate * (
                    sigmoid(context_logits[position][key]) - positive / n)

fixed_ce = mean_ce(fixed_logits, fixed_counts)
conditional_ce = mean_ce([z for head in context_logits for z in head],
                         [row for head in counts for row in head])
print("一筆 training pair：", "我／今天／想／" + "／".join(example[0]),
      "→ 完整 label：", "我／今天／想／" + "／".join(example[1]))
print("只在 MASK 位置計算 CE；模型不會讀到被遮住的 label。")
print(f"平均 CE：初始化 {initial_ce:.4f}；固定 input {fixed_ce:.4f}；讀取 context {conditional_ce:.4f}")

def pmf(partial, position, conditional=True):
    if partial[position] != MASK:
        # 組回答案時直接照抄可見字。
        return float(partial[position] == WORDS[position][0])
    z = context_logits[position][context_key(partial, position)] if conditional else fixed_logits[position]
    return sigmoid(z)

for partial in [(MASK, MASK), ("吃", MASK), (MASK, "籃球")]:
    print("\n目前 input：我／今天／想／" + "／".join(partial))
    for conditional, name in [(False, "固定 input"), (True, "讀取 context")]:
        parts = []
        for position in range(2):
            if partial[position] != MASK:
                parts.append(f"第 {position + 4} 格照抄「{partial[position]}」")
            else:
                p = pmf(partial, position, conditional)
                parts.append(f"第 {position + 4} 格：{WORDS[position][0]} {p:.3f}、{WORDS[position][1]} {1-p:.3f}")
        print(name + "：" + "；".join(parts))

def complete(partial, conditional=True, order=(0, 1)):
    result = list(partial)
    for position in order:
        if result[position] == MASK:
            p = pmf(result, position, conditional)
            result[position] = WORDS[position][0 if rng.random() < p else 1]
    return tuple(result)

print("\n從兩格 MASK 出發；先翻第四格，再用新 context 預測第五格：")
for conditional, name in [(False, "固定 input"), (True, "讀取 context")]:
    valid = sum(complete((MASK, MASK), conditional) in DATA for _ in range(n_runs))
    print(f"{name}：符合資料搭配的比例 {valid / n_runs:.3f}")
print("保留已見字的一次完成：吃／[MASK] → " + "／".join(complete(("吃", MASK))))
print("有限 training pairs 與有限訓練都會有誤差；增加抽樣次數只會量得更清楚。")
