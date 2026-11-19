import random, math, statistics, json

seed = 7
training_steps = 1800  # 可改成 300、3600
hidden = 16
batch_size = 32
learning_rate = 0.015
sampling_steps = 100

rng = random.Random(seed)
# 真正的 2-input / tanh hidden / 1-output MLP；所有權重均更新。
w = [[rng.gauss(0,0.5),rng.gauss(0,0.5),0.0] for _ in range(hidden)]
a = [rng.gauss(0,0.15) for _ in range(hidden)]
b = 0.0
def forward(x,t):
    h = [math.tanh(row[0]*x+row[1]*(2*t-1)+row[2]) for row in w]
    return b+sum(ai*hi for ai,hi in zip(a,h)),h
def exact(x,t):
    return 2+(2*t-1)*(x-2*t)/((1-t)**2+t*t)

curve = []
for step in range(training_steps):
    gw = [[0.0]*3 for _ in range(hidden)]
    ga = [0.0]*hidden
    gb = loss = 0.0
    for _ in range(batch_size):
        x0,x1,t = rng.gauss(0,1),rng.gauss(2,1),rng.random()
        x = (1-t)*x0+t*x1
        label = x1-x0
        pred,h = forward(x,t)
        loss += (pred-label)**2/batch_size
        d = 2*(pred-label)/batch_size
        gb += d
        for j in range(hidden):
            ga[j] += d*h[j]
            dh = d*a[j]*(1-h[j]*h[j])
            gw[j][0] += dh*x
            gw[j][1] += dh*(2*t-1)
            gw[j][2] += dh
    b -= learning_rate*gb
    for j in range(hidden):
        a[j] -= learning_rate*ga[j]
        w[j] = [v-learning_rate*g for v,g in zip(w[j],gw[j])]
    if step % max(1,training_steps//30) == 0 or step == training_steps-1:
        curve.append([step+1,loss])

validation = random.Random(seed+100)
label_mse = field_mse = variance = 0.0
for _ in range(3000):
    x0,x1,t = validation.gauss(0,1),validation.gauss(2,1),validation.random()
    x = (1-t)*x0+t*x1
    pred,_ = forward(x,t)
    label_mse += (pred-(x1-x0))**2/3000
    field_mse += (pred-exact(x,t))**2/3000
    variance += (2-(2*t-1)**2/((1-t)**2+t*t))/3000
print(f'MLP：2 → {hidden} tanh → 1；training steps = {training_steps}')
print(f'Held-out label MSE = {label_mse:.5f}')
print(f'Held-out field MSE = {field_mse:.5f}')
print(f'同一 validation 時間的 conditional variance 平均 = {variance:.5f}')
print(f'field MSE + variance = {field_mse+variance:.5f}（樣本交叉項會造成差異）')
initial = [validation.gauss(0,1) for _ in range(800)]
y = initial[:]
for k in range(sampling_steps):
    y = [x+forward(x,k/sampling_steps)[0]/sampling_steps for x in y]
print(f'Learned ODE 的 {sampling_steps} 步 Euler 終點：')
print(f'  mean = {statistics.mean(y):.4f}, std = {statistics.pstdev(y):.4f}')
print('目標 Gaussian：mean = 2, std = 1')
print('Exact field 只用於 validation；沒有拿它當 training label。')
print('__PLOT__'+json.dumps({'title':'當次 training mini-batch label MSE（有抽樣波動）','points':curve}))
