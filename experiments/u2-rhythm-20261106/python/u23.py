import math

time = 0.4  # 取內部時間，避開 α = 0 或 σ = 0
position = 1.0
target_mean = 2.0
target_std = 1.0

def coefficients(t, path):
    if path == 'VP':
        angle = math.pi*t/2
        return math.sin(angle), math.cos(angle), math.pi/2*math.cos(angle), -math.pi/2*math.sin(angle)
    return t, 1-t, 1.0, -1.0

def posterior_noise(x, a, s):
    q = a*a*target_std**2+s*s
    return s*(x-a*target_mean)/q

a,s,da,ds = coefficients(time, 'VP')
eps = posterior_noise(position,a,s)
q = a*a*target_std**2+s*s
data_mean = target_mean+a*target_std**2*(position-a*target_mean)/q
direct = da*data_mean+ds*eps
converted = da/a*position+(ds-da*s/a)*eps
la,ls,lda,lds = coefficients(time, 'linear')
wrong = lda/la*position+(lds-lda*ls/la)*eps
correct_linear = lda/la*position+(lds-lda*ls/la)*posterior_noise(position,la,ls)
print(f't = {time}, x = {position}')
print(f'同一 VP path，直接平均 velocity：{direct:.8f}')
print(f'同一 VP path，用 noise mean 換算：{converted:.8f}')
print(f'兩種表示的差：{abs(direct-converted):.3g}')
print(f'Linear path 的正確 velocity：{correct_linear:.8f}')
print(f'誤用 VP posterior 的 linear velocity：{wrong:.8f}')
print('此處是 exact Gaussian posterior，沒有載入 neural model。')
