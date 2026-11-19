import random, statistics, math

seed = 7
samples = 1600
steps = 160
gamma_scale = 0.5  # 改 construction：中間 p_t 會改
epsilon = 0.3      # 改補償後 sampling noise：exact marginals 不改

def moments(t):
    g = gamma_scale*math.sin(math.pi*t)
    dg = gamma_scale*math.pi*math.cos(math.pi*t)
    return 2*t, (1-t)**2+t*t+g*g, 4*t-2+2*g*dg

def velocity(x,t):
    m,q,dq = moments(t)
    return 2+dq/(2*q)*(x-m)

def score(x,t):
    m,q,_ = moments(t)
    return -(x-m)/q

rng = random.Random(seed)
initial = [rng.gauss(0,1) for _ in range(samples)]
ode, sde, uncorrected = initial[:], initial[:], initial[:]
h = 1/steps
for k in range(steps):
    t = k*h
    for j in range(samples):
        noise = math.sqrt(2*epsilon*h)*rng.gauss(0,1)
        ode[j] += h*velocity(ode[j],t)
        sde[j] += h*(velocity(sde[j],t)+epsilon*score(sde[j],t))+noise
        uncorrected[j] += h*velocity(uncorrected[j],t)+noise
print(f'γ scale = {gamma_scale}；ε = {epsilon}；steps = {steps}')
print(f'reference 在 t=0.5 的理論 variance = {moments(.5)[1]:.4f}')
print('終點理論：mean = 2, variance = 1')
for name,values in [('ODE',ode), ('SDE + score 補償',sde), ('只加 noise',uncorrected)]:
    print(f'{name:18} mean={statistics.mean(values):.4f}, var={statistics.pvariance(values):.4f}')
print('SDE 是 Euler–Maruyama 近似；樣本統計不是 exact law。')
