import random, math, statistics, json

seed = 7
samples = 400
budgets = [4, 8, 16, 32, 64]  # 偶數；相同 field evaluations

def velocity(x,t):
    return 2+(2*t-1)*(x-2*t)/((1-t)**2+t*t)
def solve(x,n,heun=False):
    h=1/n
    for k in range(n):
        t=k*h
        k1=velocity(x,t)
        if heun:
            k2=velocity(x+h*k1,t+h)
            x+=h*(k1+k2)/2
        else:
            x+=h*k1
    return x

rng=random.Random(seed)
initial=[rng.gauss(0,1) for _ in range(samples)]
print('相同起點，exact 終點 = x0 + 2；此處使用 exact field。')
print('calls    Euler steps / RMSE      Heun steps / RMSE')
curve=[]
for budget in budgets:
    if budget<2 or budget%2:
        raise ValueError('每個 budget 請用 >= 2 的偶數。')
    e=math.sqrt(statistics.mean((solve(x,budget)-x-2)**2 for x in initial))
    he=math.sqrt(statistics.mean((solve(x,budget//2,True)-x-2)**2 for x in initial))
    print(f'{budget:5}       {budget:3} / {e:.7f}         {budget//2:3} / {he:.7f}')
    curve.append([budget,e,he])
print('同一 toy 的觀察；不是所有 field、所有大步長都保證 Heun 較準。')
print('__PLOT__'+json.dumps({'title':'相同 field evaluations 下的 endpoint RMSE','points':curve,'labels':['Euler','Heun']}))
