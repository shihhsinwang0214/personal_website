import random

seed = 7
right_weight = 0.5  # 改成 0.8：在相同 input，往右的來路較常出現
training_steps = 240
learning_rate = 0.08
batch_size = 64

rng = random.Random(seed)
v = [0.0, 0.0]  # 固定 input 上，一支真正會更新的速度向量
for step in range(training_steps):
    labels = [(2.0 if rng.random() < right_weight else -2.0, 2.0)
              for _ in range(batch_size)]
    gradient = [2 * sum(v[j]-u[j] for u in labels)/batch_size
                for j in range(2)]
    v = [v[j]-learning_rate*gradient[j] for j in range(2)]

ideal = [4*right_weight-2, 2.0]
def objective(answer):
    return (right_weight*((answer[0]-2)**2+(answer[1]-2)**2)
            +(1-right_weight)*((answer[0]+2)**2+(answer[1]-2)**2))

print(f'右／左 conditional weights：{right_weight:.2f} / {1-right_weight:.2f}')
print('初始化速度：[0, 0]；真的以 sampled labels 做 SGD。')
print('學到的速度：', [round(a, 4) for a in v])
print('理想條件平均：', [round(a, 4) for a in ideal])
print(f'目前 population label MSE：{objective(v):.5f}')
print(f'最小 label MSE（conditional variance）：{objective(ideal):.5f}')
print('最佳 loss 非零，仍可以已經學到最佳單一答案。')
