import random, statistics

seed = 7
samples = 2000
speed = 2.0  # 改成 0 或 -1，再比較終點
steps = 20

rng = random.Random(seed)
source = [rng.uniform(-1, 1) for _ in range(samples)]
x = source[:]
for k in range(steps):
    x = [value + speed / steps for value in x]
print('指定的目標：Uniform[1, 3]，平均 = 2')
print(f'實際 field：v = {speed:g}；Euler steps = {steps}')
print(f'樣本起點平均：{statistics.mean(source):.4f}')
print(f'樣本終點平均：{statistics.mean(x):.4f}')
print(f'樣本終點範圍：[{min(x):.4f}, {max(x):.4f}]')
print(f'相對指定平均的差：{statistics.mean(x)-2:+.4f}')
print('這是指定 exact field 的移動；尚未訓練網路。')
