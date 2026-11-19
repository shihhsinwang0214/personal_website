import random, statistics, math

seed = 7
samples = 3000
steps = 40  # 改成 4、200，觀察 Euler 的有限步偏差
time = 0.75

def velocity(x, t):
    q = (1-t)**2 + t*t
    return 2 + (2*t-1)*(x-2*t)/q

rng = random.Random(seed)
x0 = [rng.gauss(0, 1) for _ in range(samples)]
x1 = [rng.gauss(2, 1) for _ in range(samples)]
reference = [(1-time)*a+time*b for a,b in zip(x0, x1)]
y = x0[:]
h = time / steps
for k in range(steps):
    y = [x+h*velocity(x, k*h) for x in y]
q = (1-time)**2+time*time
exact_ode = [2*time+math.sqrt(q)*a for a in x0]
print(f't = {time}；samples = {samples}；Euler steps = {steps}')
print('                 mean       variance')
print(f'理論快照        {2*time:8.4f}   {q:8.4f}')
for name, values in [('reference 抽樣',reference), ('exact ODE 抽樣',exact_ode), ('Euler 抽樣',y)]:
    print(f'{name:15} {statistics.mean(values):8.4f}   {statistics.pvariance(values):8.4f}')
print(f'同一起點的 Euler／exact endpoint RMSE = {math.sqrt(statistics.mean((a-b)**2 for a,b in zip(y,exact_ode))):.6f}')
print('exact field 由公式給定；有限樣本與有限步誤差分開看。')
