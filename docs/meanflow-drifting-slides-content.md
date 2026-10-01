# MeanFlow 與 Drifting Models

這份稿把每個 `##` 當成一頁投影片。正文是實際講述的順序，不是製作規格；`> 圖` 只標記該頁需要的主要視覺。

全篇沿用 DMA 的 Flow Matching 慣例：$t=0$ 是 noise，$t=1$ 是 data。Flow map 寫成 $\psi_{t\to r}$，從目前時間 $t$ 走到目的時間 $r$；邊際速度寫成 $v(z,t)$；MeanFlow 的平均速度寫成 $u(z,r,t)$。

## 1. 很多步，到底搬去了哪裡？

Diffusion 與 Flow Matching 已經很會回答一個問題：**站在現在這個位置，下一小步往哪裡走？** 給它足夠多步，noise 會慢慢變成一張圖。

MeanFlow 與 Drifting Models 問的是另一件事：如果 inference 只准跑一次 network，原本那一串小步要放到哪裡？

兩篇主論文的答案不一樣。MeanFlow 把一整段 trajectory 寫進一個 flow map；Drifting Models 則讓 generator 的輸出分布在 training iterations 之間移動。最後都只跑一次 network，但省掉步數的方法不是同一種。最後一頁再看一篇 follow-up，如何從 Drifting Models 留下的理論問題出發，重新設計 drift。

> 圖：同一個 noise 與同一張生成圖，中間分成上下兩條路。上面是一條 trajectory 被壓成 $\psi_{0\to1}$；下面是一串 training distributions $q_0,q_1,\ldots$，最後留下單次 $f_\theta$。

**One-step 不代表 iteration 消失了。真正的問題是：iteration 被搬到哪裡？**

## 2. 把 100 步改成 1 步，哪裡會壞？

先看速度場這條路。Flow Matching 學一個 $v(z,t)$，取樣器每次看目前的位置，往眼前的速度走一小步：

$$
z_{t+h}\approx z_t+h\,v(z_t,t).
$$

如果路是彎的，走完一步之後要重新看方向。把 $h$ 取得小，短線段會貼著曲線；把 $h$ 直接放大到 $1$，只是把起點的切線拉長，通常不會落在終點。

這就像導航每十公尺更新一次方向。把第一個「往右前方」放大一百倍，不會自動替你處理後面的彎道。多步 sampling 買到的正是這些重新看方向的機會。

但我們真正想算的不是第一支長箭頭，而是

$$
z_1=\psi_{0\to1}(z_0).
$$

$\psi_{0\to1}$ 直接回答「從這個 noise 出發，沿著同一條 trajectory，最後會到哪裡」。

> 圖：左邊是一條彎曲 trajectory，許多短 Euler arrows 貼著它走；右邊把第一支箭頭拉長後偏離。另用一條弦連接真正的起點與終點，標成 $\psi_{0\to1}$。

**速度場告訴我們怎麼走小步；一步生成需要的是整段 map。**

## 3. 每個路口都問，還是整段只問一次？

Flow Matching 學的是 instantaneous velocity：

$$
v(z_t,t).
$$

它回答「站在這裡，現在下一步往哪裡走？」generation 時，取樣器沿路反覆問同一個問題：

$$
z_t\to z_{t+\Delta t}\to z_{t+2\Delta t}\to\cdots
$$

就像導航每到一個路口才告訴你下一個方向。每一支箭頭都只是局部的；把它們接起來，才走出整條路。

把 ODE 從 $t$ 積到 $r$，這串小步最後算的是

$$
\psi_{t\to r}(z_t)
=z_t+\int_t^r v(z_\tau,\tau)\,d\tau.
$$

所以 MeanFlow 改問：**如果我不想每個路口都問一次，能不能直接學起來那個積分？**

> 圖：左邊沿彎曲道路排出許多局部導航箭頭；右邊只保留一支從目前位置直達目的位置的 displacement arrow。兩邊下方用積分式連起來。

**Flow Matching 給每個路口的方向；one-step model 想直接拿到整段位移。**

## 4. 整段位移，可以換成平均速度

先不管 network 怎麼訓。若真的知道整條 trajectory 上的 $v$，那一段總位移就是速度的積分。取一段 $r<t$，站在終點 $z_t$ 往回看：

$$
u(z_t,r,t)
=\frac{1}{t-r}\int_r^t v(z_\tau,\tau)\,d\tau.
$$

這就是從 $r$ 到 $t$ 的平均速度。它與 flow map 的關係很直接：

$$
\boxed{
\psi_{t\to r}(z_t)
=z_t-(t-r)u(z_t,r,t)
}.
$$

知道平均速度與開了多久，就知道整段 displacement；不必再把沿途每一秒的速度重新加一遍。

這個畫面也不依賴取樣方向。全篇採用 $t=0$ noise、$t=1$ data；實際生成時，把一般式寫成

$$
\psi_{t\to r}(z_t)=z_t+(r-t)u(z_t,r,t)
$$

就能從較早的 noise time 跳到較晚的 data time。這一頁取 $r<t$，只是因為「從出發到現在的 running average」最容易想。

> 圖：一條行車時間軸，從 $r$ 開到現在 $t$。上方保留沿途速度，下面只顯示「總時間 $t-r$ × 平均速度 $u$ = 總位移」。

**MeanFlow 想學的不是每一秒多快，而是這一整段平均來說怎麼走。**

## 5. 最後一小段，會把平均往哪裡拉？

直覺上，如果現在的速度比過去平均快，最後加入的這一小段會把平均往上拉；現在比較慢，平均就會往下掉。這個方向很容易猜，但 identity 的推導不能停在這個類比。

固定起始時間 $r$。令 $z_\tau$ 是速度場 $v$ 的一條 trajectory：

$$
\frac{d z_\tau}{d\tau}=v(z_\tau,\tau).
$$

把沿這條 trajectory 的 average velocity 寫成一個單變數函數：

$$
U(t):=u(z_t,r,t)
=\frac{1}{t-r}\int_r^t v(z_\tau,\tau)\,d\tau,
\qquad t>r.
$$

假設 $v$ 連續，而且 $u$ 沿 trajectory 可微。定義式兩邊乘上 $t-r$：

$$
(t-r)U(t)=\int_r^t v(z_\tau,\tau)\,d\tau.
$$

現在對 $t$ 微分。左邊使用 product rule；右邊由微積分基本定理，等於積分上限處的 integrand：

$$
\begin{aligned}
\frac{d}{dt}\big[(t-r)U(t)\big]
&=U(t)+(t-r)U'(t),\\
\frac{d}{dt}\int_r^t v(z_\tau,\tau)\,d\tau
&=v(z_t,t).
\end{aligned}
$$

因此

$$
U(t)+(t-r)U'(t)=v(z_t,t).
$$

$U'(t)$ 是 composite function $u(z_t,r,t)$ 的導數。因為 $z_t$ 也沿 trajectory 移動，chain rule 給出

$$
\begin{aligned}
U'(t)
&=\frac{d}{dt}u(z_t,r,t)\\
&=\partial_tu(z_t,r,t)
+\big(\partial_z u(z_t,r,t)\big)\frac{d z_t}{dt}\\
&=\partial_tu(z_t,r,t)
+\big(\partial_z u(z_t,r,t)\big)v(z_t,t).
\end{aligned}
$$

代回並移項：

$$
\boxed{
u(z_t,r,t)
=v(z_t,t)
-(t-r)\frac{d}{dt}u(z_t,r,t)
}.
$$

這就是 MeanFlow identity。整個推導只用了 average velocity 的定義、product rule、微積分基本定理與 chain rule。

> 圖：左半畫 running average 的直覺，最後一支較長或較短的 $v$ 拉動過去平均；右半只保留四行正式推導，並用顏色對齊 product rule 與積分上限兩側。

## 6. 這次考試，會把學期平均拉多少？

先看一個完全離散、可以直接驗算的版本。

前四次考試平均 $80$ 分，第五次考了 $95$ 分：

$$
\underbrace{A_4}_{80}
\quad\xrightarrow{\;x_5=95\;}\quad
\underbrace{A_5}_{(4\times80+95)/5=83}.
$$

最新成績比新平均高 $12$ 分，而平均只上升 $3$ 分。前面累積的四次考試，剛好補上這個差距：

$$
\boxed{
83=95-4\times(83-80)
}.
$$

一般來說，令 $A_n$ 是考完第 $n$ 次後的平均，$x_n$ 是第 $n$ 次成績。由平均的定義：

$$
nA_n=(n-1)A_{n-1}+x_n
\quad\Longrightarrow\quad
\boxed{
A_n=x_n-(n-1)(A_n-A_{n-1})
}.
$$

把一次考試視為一個 time step。到了連續時間，$n-1$ 對應累積的區間長度 $t-r$，而 $A_n-A_{n-1}$ 對應平均的變化率 $du/dt$：

$$
\boxed{
\underbrace{u}_{\text{整段平均}}
=
\underbrace{v}_{\text{現在的值}}
-
\underbrace{(t-r)\frac{du}{dt}}_{\text{現在對平均造成的拉動}}
}.
$$

上一頁負責證明，這一頁只負責解釋公式怎麼讀。

> 圖：上半部畫成績從 $80$ 被最新的 $95$ 拉到 $83$。下半部並排放離散式與 MeanFlow identity，用同一組顏色標示「平均」、「最新值」、「累積歷史」與「平均的變化」。

**知道現在的表現，也知道它把平均拉動多少，就能反推出整段平均。**

## 7. 現在速度由 Flow Matching 給，平均的變化由 JVP 算

identity 把原本需要整條 trajectory 的 global integral，改寫成兩個 local quantities。它們都有可實作的來源。

先看 $v(z_t,t)$。抽一組 $(x_0,x_1)$，取線性 reference path：

$$
z_t=(1-t)x_0+t x_1,
\qquad
w=x_1-x_0.
$$

單一路徑的 $w$ 不等於邊際速度；固定 $z_t$，把所有可能經過這裡的條件路徑平均起來，才有

$$
\mathbb E[w\mid z_t]=v(z_t,t).
$$

再看 $du_\theta/dt$。它是 $u_\theta$ 對輸入 $(z,r,t)$ 的 Jacobian，乘上粒子沿 trajectory 的方向 $(w,0,1)$。JVP 可以直接算這個乘積，不需要建立完整 Jacobian。

這裡算的是 $u_\theta(z_t,r,t)$ 沿 trajectory 的 total derivative，不是 acceleration，也不是 $dv/dt$。

因此 training target 是

$$
u_{\mathrm{tgt}}
=w-(t-r)
\Big[\partial_tu_\theta+(\partial_zu_\theta)w\Big],
$$

再做 squared regression：

$$
\mathcal L_{\mathrm{MF}}
=\left\|u_\theta(z_t,r,t)
-\operatorname{sg}(u_{\mathrm{tgt}})\right\|^2.
$$

conditional velocity 能代替 marginal velocity，靠的是 target 對 $w$ 是線性的：

$$
\mathbb E[u_{\mathrm{tgt}}(w)\mid z_t]
=u_{\mathrm{tgt}}\!\left(\mathbb E[w\mid z_t]\right)
=u_{\mathrm{tgt}}(v).
$$

target 裡含有 $u_\theta$ 自己，所以這仍是一個 bootstrapping objective；stop-gradient 把右邊凍住。當 $r=t$ 時修正項消失，$u=v$，那批樣本就是普通 Flow Matching，也成為 training 的錨。

> 圖：左邊多條 conditional paths 在 $z_t$ 平均成 $v$；右邊 network 的輸入方向 $(w,0,1)$ 經 JVP 得到 $du_\theta/dt$；兩者在中央合成 $u_{\mathrm{tgt}}$。

**Flow Matching 提供現在怎麼走；JVP 提供整段平均正在怎麼變。**

## 8. 取樣只剩一行

學到 $u_\theta$ 之後，取樣只是把 average velocity 的定義反過來用。從 Gaussian noise 出發：

$$
z_0\sim\mathcal N(0,I),
\qquad
z_1
=\psi_{0\to1}(z_0)
=z_0+u_\theta(z_0,1,0).
$$

沒有 ODE solver，也沒有一串 denoising steps。一次 network evaluation 給出整段平均速度，再用一次加法抵達終點。

如果一步的 network approximation 還不夠準，同一個 $u_\theta$ 也能走

$$
0\to\tfrac12\to1.
$$

這不是回資料端後重新加 noise，而是把同一個 flow map 沿同一條 trajectory 分段使用。

原始 MeanFlow 在 ImageNet $256\times256$、from scratch、1-NFE 的設定報告 FID 3.43。後續 improved MeanFlow 把 1-NFE FID 推進到 1.72，並重新處理 self-dependent target 與 guidance 的彈性。這兩個數字不是今天的數學主線，但它們回答一個實際問題：長距離 flow map 不只定義得出來，也真的能訓練到有競爭力。

| 方法 | NFE | ImageNet 256² FID ↓ |
|---|---:|---:|
| MeanFlow | 1 | 3.43 |
| improved MeanFlow | 1 | 1.72 |

> 圖：上半部只留 noise、一次 $u_\theta$、image。下半部用較細的線畫合法的兩步 $0\to\frac12\to1$。

**MeanFlow 把 trajectory 的積分，換成一次 flow-map evaluation。**

## 9. 如果連路都不先畫呢？

MeanFlow 已經不要 teacher、不要 inference-time integration，但它仍從一條 continuous flow 出發。先有 $v$ 定義的 trajectory，再用 $u$ 表示其中一段的 map。

Drifting Models 把問題再往前推一步：**生成模型一定要先指定一條 noise-to-data trajectory 嗎？**

想像兩種搬家方法。第一種先替每件家具畫好搬運路線，再學會從路線中途直接跳到終點；這是 MeanFlow。第二種不替單件家具指定路線，只看整間房目前的配置與目標配置差在哪裡，每整理一輪就更新一次擺法；這比較接近 Drifting。

這個差別可以寫成兩行：

$$
\text{MeanFlow: learn }\psi_{t\to r}\text{ along a prescribed flow},
$$

$$
\text{Drifting: evolve }q_\theta\text{ directly during training}.
$$

> 圖：左邊是一條已存在的 trajectory，標出 $v,u,\psi$；右邊沒有時間路徑，只有一串點雲 $q_0,q_1,q_2$ 逐輪接近 $p$。

**MeanFlow 壓縮一條路；Drifting 直接移動一個分布。**

## 10. 每次更新 generator，都在移動一個分布

取一個普通 generator：

$$
\epsilon\sim p_\epsilon,
\qquad
x=f_\theta(\epsilon).
$$

它把 noise distribution 推到輸出空間，得到

$$
q_\theta=f_{\theta\#}p_\epsilon.
$$

inference 本來就是一步。抽一個 $\epsilon$，跑一次 $f_\theta$，得到一個 $x$。難的從來不是 forward pass；難的是怎麼讓整個 $q_\theta$ 變成 $p_{\mathrm{data}}$。

SGD 已經會反覆改變 $f_\theta$。因此 training 不只產生一串參數，還產生一串 pushforward distributions：

$$
f_{\theta_0},f_{\theta_1},\ldots
\quad\Longrightarrow\quad
q_0,q_1,\ldots
$$

固定同一批 noise 再看一次會更直觀。同一個 $\epsilon$ 經過更新前後的 generator，會落在不同位置；所有 $\epsilon$ 都稍微移動，整個 $q$ 就跟著改變。Drifting Models 要設計的不是 inference-time update，而是**每一輪 training 應該把這些輸出往哪裡推**。

> 圖：固定一排 noise particles，依序通過 $f_{\theta_0},f_{\theta_1},f_{\theta_2}$。輸出點雲從錯誤位置逐輪靠近固定的 data point cloud。

**一次 forward 產生 sample；反覆 optimization 演化 distribution。**

## 11. Drifting field 先定規則，不先定公式

Drifting Models 最重要的提案，不是某一個特定 kernel。它先定義一個介面：給定 data distribution $p$ 與目前的 model distribution $q_i$，drifting field 告訴每個 generated sample 下一輪往哪裡移。

$$
q_i=f_{\theta_i\#}p_\epsilon,
\qquad
x_{i+1}=x_i+V_{p,q_i}(x_i).
$$

$V_{p,q}$ 可以有很多種設計，但至少要在任務完成時停下來：

$$
\boxed{
q=p
\quad\Longrightarrow\quad
V_{p,q}(x)=0,
\qquad\forall x
}.
$$

一個簡單的充分條件是 anti-symmetry：

$$
V_{p,q}(x)=-V_{q,p}(x).
$$

交換 data 與 model，方向就反過來。令 $p=q$，同一支向量必須等於自己的負號，所以只能是零。

這裡要看清楚箭頭的方向。Anti-symmetry 保證「分布一樣，drift 一定為零」；它還沒有保證「drift 為零，分布就一定一樣」。後者需要更完整的設計與理論。

> 圖：先畫一個空白的 $V_{p,q}$ 方框，輸入是兩群點雲 $p,q$，輸出是每個 $x$ 的移動箭頭。下面只放 $p=q\Rightarrow V=0$，反方向先留一個問號。

**Drifting Models 先提出一個 generative framework；drift 的公式本身仍是一個研究問題。**

## 12. 把下一步凍住

現在每個 generated sample 都有一支 drift vector。最直覺的更新是

$$
x_{i+1}=x_i+V_{p,q_i}(x_i).
$$

但 $x$ 不是可以單獨保存與更新的粒子；它是 $f_\theta(\epsilon)$ 的輸出。Drifting Models 因此把右邊當成下一輪 generator 應該模仿的 target：

$$
x=f_\theta(\epsilon),
\qquad
x_{\mathrm{target}}
=\operatorname{sg}\!\left(x+V_{p,q_\theta}(x)\right),
$$

$$
\boxed{
\mathcal L_{\mathrm{drift}}
=\mathbb E_\epsilon
\left\|f_\theta(\epsilon)-x_{\mathrm{target}}\right\|^2
}.
$$

stop-gradient 在這裡不是小技巧。$V$ 依賴目前整個 generated distribution；若直接穿過 $V$ backpropagate，就得處理「network 改一點，整個 $q_\theta$ 如何改」的問題。論文採取的是 fixed-point update：先用目前的 $q_\theta$ 算一個 frozen target，再讓 network 往那裡走。

更新完 $\theta$，同一個 noise 會得到稍微不同的輸出；下一個 mini-batch 重新估 drift，再走下一輪。很多輪 training iteration 就這樣承擔了原本可能放在 inference 的 distribution evolution。

> 圖：四個連續動作，$\epsilon\to x$、由 real/fake batch 算 $V$、凍結 $x+V$、回歸後得到新的 $f_{\theta'}$。箭頭只連相鄰步驟。

**Drifting 把 distribution update 變成一連串 frozen-target regression。**

## 13. 原始實作：kernel 決定誰重要，$y-x$ 決定往哪裡

有了 framework，下一個問題才是：$V_{p,q}$ 到底怎麼設計？原始 Drifting Models 採用 mean-shift 式的 kernel-weighted displacement。對任意分布 $\pi$，定義

$$
M_\pi(x)
=\frac{\mathbb E_{y\sim\pi}
\left[k(x,y)(y-x)\right]}
{\mathbb E_{y\sim\pi}[k(x,y)]}.
$$

再讓 data attraction 減掉 model self-interaction：

$$
\boxed{
V^{\mathrm{disp}}_{p,q}(x)=M_p(x)-M_q(x)
}.
$$

這個式子裡其實有兩個獨立的設計選擇：

- $k(x,y)$ 決定哪些鄰居影響比較大；
- Euclidean displacement $y-x$ 決定真正的移動方向。

兩項使用相同形式，所以交換 $p,q$ 會翻轉符號，anti-symmetry 自動成立。直覺上，data samples 提供 attraction，generated samples 提供 self-repulsion，避免所有輸出縮成一點。

影像實作還會把 $x,y$ 換成 $\phi(x),\phi(y)$，在 learned feature space 計算 kernel 權重與 displacement。原論文在 ImageNet $256\times256$ 報告 1-NFE FID 1.54（latent）與 1.61（pixel），但實驗成功與理論完整是兩件不同的事。

> 圖：中央一個 generated sample。上方用 kernel 深淺表示鄰居權重，下方用 $y-x$ 畫出方向；右側把兩者標成「誰重要」與「往哪裡」。

**原始方法用 kernel 選鄰居，但移動方向仍由 Euclidean displacement 決定。**

## 14. Gaussian kernel 很剛好，一般 kernel 就未必

如果 kernel 是 Gaussian：

$$
k_\tau(x,y)
=\exp\!\left(-\frac{\|x-y\|^2}{2\tau^2}\right),
$$

那麼

$$
\boxed{
\nabla_x k_\tau(x,y)
=\frac{1}{\tau^2}k_\tau(x,y)(y-x)
}.
$$

這時候原始 Drifting 使用的 $k(x,y)(y-x)$，剛好就是 kernel 上升最快的方向，只差一個常數。因此 Gaussian case 可以連到 kernel-smoothed score，也能得到乾淨的 identifiability 解釋。

換成一般 kernel，這個巧合可能消失。Kernel 用自己的幾何判斷誰相似，更新卻仍沿著 ambient Euclidean 的 $y-x$ 走，於是留下三個問題：

- $V=0$ 是否真的能推出 $p=q$？
- 這個 field 是否在下降某個明確的 distributional objective？
- 球面、流形或 categorical data 上，$y-x$ 應該代表什麼？

這正是後續研究的入口。原始工作先證明一個新 framework 在實驗上可行；follow-up 再追問，哪一種 drift design 能把 equilibrium、objective 與 geometry 一起說清楚。

> 圖：左邊 Gaussian kernel 的等高線，$y-x$ 與 $\nabla_xk$ 平行；右邊一般 kernel 的等高線，兩支箭頭分開。下方接出三個理論問題。

**理論缺口不是否定原方法，而是指出下一個該改哪個設計選擇。**

## 15. Kernel-Gradient Drifting：讓方向也由 kernel 決定

Kernel-Gradient Drifting Models 改動一個地方：不再固定使用 $y-x$，而是直接使用 kernel 對 $x$ 的 gradient。在可微 kernel 的設定下，令 kernel-smoothed density 為

$$
\widehat\pi_k(x)=\mathbb E_{y\sim\pi}[k(x,y)].
$$

新的單邊 field 是

$$
G_\pi(x)
=\frac{\mathbb E_{y\sim\pi}[\nabla_xk(x,y)]}
{\mathbb E_{y\sim\pi}[k(x,y)]}
=\nabla_x\log\widehat\pi_k(x).
$$

因此整個 drift 直接變成兩個 smoothed scores 的差：

$$
\boxed{
V^\nabla_{p,q}(x)
=G_p(x)-G_q(x)
=\nabla_x\log\widehat p_k(x)
-\nabla_x\log\widehat q_k(x)
}.
$$

這個小改動補上三件事。Gaussian kernel 時，它退化回原始 drift，只差尺度；characteristic kernel 讓 $V^\nabla=0\Rightarrow p=q$，因此 equilibrium 可識別；整個 dynamics 也有 smoothed KL descent 的解釋。因為 kernel gradient 是幾何本身的 tangent direction，同一框架還能延伸到 Riemannian manifolds 與 discrete probability simplex。

> 圖：用一條水平研究時間線收束全篇。Drifting framework 提出問題，原始 displacement drift 證明可行，Gaussian 特例揭露 score 結構，Kernel-Gradient Drifting 把這個結構推廣成可識別的設計。中央只突出 $k(y-x)\rightarrow\nabla_xk$ 這一個改動。

**研究的演變常常不是換掉整個 framework，而是找出哪個設計選擇只在特例中成立，再把它改成可以一般化、也可以證明的版本。**

## 參考資料

### 網站內部符號與敘事銜接

- [DMA：不走了，直接學那一步](../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-8/dma-w8-0-learn-the-map.zh.mdx)
- [DMA：Flow map](../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-9/dma-w9-0-flow-map.zh.mdx)
- [DMA：Flow Map Matching](../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-9/dma-w9-1-flow-map-matching.zh.mdx)
- [DMA：MeanFlow](../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-9/dma-w9-2-meanflow.zh.mdx)
- [DMA：另一條路，分佈匹配](../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-9/dma-w9-4-distribution-matching.zh.mdx)

### 論文

1. Zhengyang Geng, Mingyang Deng, Xingjian Bai, J. Zico Kolter, Kaiming He. [*Mean Flows for One-step Generative Modeling*](https://arxiv.org/abs/2505.13447), 2025.
2. Zhengyang Geng, Yiyang Lu, Zongze Wu, Eli Shechtman, J. Zico Kolter, Kaiming He. [*Improved Mean Flows: On the Challenges of Fastforward Generative Models*](https://arxiv.org/abs/2512.02012), 2025.
3. Mingyang Deng, He Li, Tianhong Li, Yilun Du, Kaiming He. [*Generative Modeling via Drifting*](https://arxiv.org/abs/2602.04770), 2026. [Project page](https://lambertae.github.io/projects/drifting/).
4. Maria Esteban-Casadevall, Jorge Carrasco-Pollo, Max Welling, Jan-Willem van de Meent, Erik J. Bekkers, Floor Eijkelboom. [*Kernel-Gradient Drifting Models*](https://arxiv.org/abs/2605.10727), 2026.
5. Nicholas M. Boffi, Michael S. Albergo, Eric Vanden-Eijnden. [*Flow Map Matching*](https://arxiv.org/abs/2406.07507), 2024.

