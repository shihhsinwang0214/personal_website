# U8 · Test-Time Steering 單元規劃

日期：2026-09-20　狀態：**規劃，尚未動筆**
主要參考書：the principles of diffusion models **Ch.8「Guidance and Controllable Generation」**（書頁 246–277；PDF 頁 = 書頁 + 5）
書沒有涵蓋的部分（best-of-K、SMC / FK steering、parallel tempering）另列文獻。

---

## 一、這個單元要補的缺口，以及課裡已經埋好的三個扣

U1–U7 全部在回答同一個問題：**怎麼把 $p_{\text{data}}$ 學好、然後快速取樣它。**
使用者要的常常不是 $p_{\text{data}}$，而是它的一個**傾斜版本**——偏好高獎勵、符合 prompt、滿足某個物理約束：

$$p^\star(x)\ \propto\ p_{\text{data}}(x)\,\exp\big(\lambda\,r(x)\big).$$

重訓是一條路（書 §8.5 的 RLHF / DPO）。這個單元走另一條：**模型不動，只在取樣時做事。**

課裡已經埋了三個扣，這個單元剛好是它們的收束處：

| 扣 | 埋在哪 | 原句大意 |
|---|---|---|
| MCMC 是「老方法」 | <Ref to="dma-what-are-we-learning"/> | 「不需要先從某個地方出發、再一步一步跑到正確的分布——那才是 MCMC 在做的事」 |
| score 可以繞過 normalizing constant | <Ref to="dma-tweedie-and-score"/> | 「即使不知道完整 density 仍可用 score 做 sampling，例如 MCMC；但 normalizing constant 只是被繞過，沒有被算出來」 |
| guidance 生成的不是它瞄準的分布 | <Ref to="dma-shared-techniques"/>（2026-09-19 才改成論證） | 「$w>1$ 跑出來的終點，既不是 $p_1(\cdot\mid c)$、也不是那個銳化的分布」 |

第三個扣是這個單元存在的直接理由：**那到底是什麼？** 書 §8.4.2 有完整答案，課裡目前沒有。

---

## 二、一條主線與一個貫穿全單元的判準

**主線**：能動的只有兩個旋鈕——**改動力學**（在 drift 上加東西）與**改選樣**（生成很多條、挑或重採樣）。
這個單元把常見方法全部放進這兩個旋鈕的組合裡，再加上第三個：**沿著一道階梯慢慢逼近**。

**判準（每一篇都要回答一次）**：

> **這個方法真的在取樣 $p^\star$ 嗎？還是只是「往那個方向偏」？**

這個判準有一個可以算的版本，而且課裡已經有工具：
<Ref to="dma-sampler-family"/> 證過「一族速度場生成同一條 $\{p_t\}$」靠的是 Fokker–Planck。
所以「$\{\tilde p_t\}$ 是不是某條動力學的邊際路徑」也是一條 Fokker–Planck 的檢查——這是 U8.3 的全部內容。

---

## 三、七篇

編號 U8.0–U8.6，與其他單元一致（U5、U7 也是七篇，最後一篇是 lab）。

### U8.0 · 想要的不是模型學到的那個分布　`dma-steering-gap`

- **缺口**：七個單元把 $p_{\text{data}}$ 學好了，但要的是 $p^\star\propto p_{\text{data}}\,e^{\lambda r}$。
- **兩個旋鈕**立在這裡：改動力學 / 改選樣。整個單元是這張 2×2 的填空。
- **Q1（最笨的做法）**：生成 $K$ 個、挑 $r$ 最高的那個。它取樣的是哪個分布？
  - 答案算得出來：令 $F$ 是 $r(X)$ 在 $X\sim p_{\text{data}}$ 下的 CDF，勝出者的密度是
    $$p_K(x)\ \propto\ p_{\text{data}}(x)\,F\big(r(x)\big)^{K-1}.$$
    它確實是一個 tilt，但傾斜函數是 $F(r)^{K-1}$，**不是** $e^{\lambda r}$——而且它依賴 $r$ 在 $p_{\text{data}}$ 下的分布，
    換一個 reward 的單調變換（$r\mapsto 2r$）結果完全不變，$e^{\lambda r}$ 則會變。
    兩者只在極限上碰頭：$K\to\infty$ 與 $\lambda\to\infty$ 都收縮到 $r$ 的最大值處。
  - 這一問把整個單元的判準立起來：**「往好的方向偏」與「取樣某個特定分布」是兩件事。**
- **不做的事**：重訓（RLHF / DPO，書 §8.5）只用一段交代，當成對照組，不展開。
- **Bridge**：要問「取樣得對不對」，得先有一個「對」的定義——而這件事有一套老方法。

### U8.1 · 老問題：只知道 unnormalized 密度，怎麼取樣？　`dma-mcmc-and-mixing`

- 從 <Ref to="math-langevin"/>（M3.3）接：$dx=-\nabla V\,dt+\sqrt2\,dW$ 的 stationary 是 $e^{-V}$，已經用 Fokker–Planck 證過。
  令 $V=-\log p_{\text{data}}-\lambda r$，**Langevin 直接就是 $p^\star$ 的取樣器**，而且只需要 score（$\nabla\log p_{\text{data}}$）與 $\nabla r$——normalizing constant 不需要。這正是 U1.3 那句話兌現。
- 補上兩件 M3.3 沒有的：
  - **Metropolis–Hastings 的接受／拒絕**：M3.3 已經量過「步長太大會把答案偏掉多少」，MH 正是把那個 bias 換成拒絕率。判準是 detailed balance（<Ref to="math-time-reversal"/> M4.3 已經寫過）。
  - **混合時間**：多 mode 的分布上，鏈要跨過低密度區才能換 mode，時間隨能量障礙指數成長。
- **Q1**：既然 Langevin 就能取樣 $p^\star$，為什麼還需要這個單元剩下的五篇？
  - 答案：混合時間。而 diffusion 之所以是個突破，正是它**不用混合**——從一個好抽的分布出發、沿一條已知路徑走完（<Ref to="dma-what-are-we-learning"/>）。
    但那條已知路徑是為 $p_{\text{data}}$ 造的，不是為 $p^\star$ 造的。**老問題就是這樣回來的。**
- **Bridge**：那就別另外跑一條鏈，直接把 $\nabla r$ 加進 diffusion 自己的 drift 裡——這是最多人做的事。

### U8.2 · 在 drift 上加一項　`dma-guidance-family`

- **一條恆等式**（書 8.1.1）統領全篇：
  $$\nabla_{x_t}\log p_t(x_t\mid c)=\underbrace{\nabla_{x_t}\log p_t(x_t)}_{\text{無條件方向}}+\underbrace{\nabla_{x_t}\log p_t(c\mid x_t)}_{\text{guidance 方向}}$$
  三種方法的差別只在**怎麼估右邊那一項**：
  | | 怎麼估 | 要付什麼 |
  |---|---|---|
  | Classifier guidance | 訓一個吃 $x_t$ 的 noisy classifier，取輸入梯度 | 要為每個 $t$ 訓一個 classifier |
  | Classifier-free guidance | 同一個網路學條件與無條件，取兩者之差 | 要在訓練時就決定條件是什麼 |
  | Training-free guidance | 把 reward 套在 $\hat x_0(x_t)$ 上反傳 | 什麼都不用訓，但 $\hat x_0$ 在中段很糊 |
- **CFG 不重教**。<Ref to="dma-shared-techniques"/> 已經講完形式與代價，這裡只是**把它放回家族裡**，並指出它其實是「$h_t$ 取 $p_t(c\mid x_t)$、$w_t$ 取 $w$」的一個特例。
- **Tweedie 在這裡又派上一個用場**：$\hat x_0(x_t)=\mathbb E[x_0\mid x_t]$ 讓任何定義在**乾淨資料**上的 reward 都能變成 $x_t$ 上的梯度。
  （不要寫成「第三次出場」——序數計數在 U2–U7 已經清掉了，見 `claude/dma-w6-w9-restructure.md` P1。）
- **資料空間 vs 噪聲空間**（書 §8.4.1）：改 $\hat x_0$（MPGD、UGD）還是改 score（DPS、FreeDoM）。同一個 DDIM 更新式的兩個位置。
- **Q1**：$\hat x_0(x_t)$ 在 $t$ 大的時候是一張模糊的平均臉。那時候用它算出來的 reward 梯度，在指什麼方向？
- **Bridge**：這些方法實務上有效，而且到處在用。但「有效」和「在取樣 $p^\star$」是兩件事。

### U8.3 · 那到底生成了哪一個分布？　`dma-tilted-path`

**這是整個單元的理論核心，對應書 §8.4.2。**

- 固定一個 $t$，加了 guidance 的場是
  $$\nabla_x\log p_t(x)+w_t\nabla_x\log h_t(x)=\nabla_x\log\tilde p_t,\qquad \tilde p_t\propto p_t\,h_t^{w_t}.$$
  所以**每一個 $t$** 都有一個乾淨的答案：那個場是傾斜密度 $\tilde p_t$ 的 score。
- 陷阱在**跨時間**：一族 $\{\tilde p_t\}$ 要能當某條動力學的邊際路徑，必須滿足 Fokker–Planck。
  把 $\tilde p_t=p_th_t^{w_t}/Z_t$ 代進去、用 $p_t$ 自己滿足同一條方程，剩下一個括號：
  $$\partial_t\log h^{w}+f x\cdot\nabla\log h^{w}-g^2\nabla\log p_t\cdot\nabla\log h^{w}-\tfrac12 g^2\big(\Delta\log h^{w}+\|\nabla\log h^{w}\|^2\big)-\tfrac{Z_t'}{Z_t}$$
  **它為零，這族傾斜密度才是合法路徑。** 一般的 reward 與一般的 $w_t$ 沒有理由讓它為零。
- 兩個 sanity check（書也是這樣做的）：
  - $w_t\equiv0$：tilt 消失，回到 $p_t$。✓
  - exact classifier、$h_t=p_t(c\mid x)$、$w\equiv1$：Bayes 給 $\tilde p_t=p_t(\cdot\mid c)$，**剛好合法**。
    這解釋了 <Ref to="dma-shared-techniques"/> 那句「$w=1$ 已經是正確答案了」——它不是實驗觀察，是這條相容性條件的一個解。
- **Q1**：誤差是離散化造成的嗎？多走幾步會不會就對了？
  - 答案：**不會。** 這個 mismatch 在 exact score、exact 積分之下依然存在——它來自動力學本身，不是數值。
    這與 <Ref to="dma-error-theory"/> 的 Euler 誤差是完全不同的一類錯誤，是這一篇最該記住的一句。
- CFG 的另一個讀法：Bradley & Nakkiran 證明 CFG 等價於一個 predictor–corrector，而且它**不**取樣 $\gamma$ 次方分布。與這裡的結論是同一件事的兩種說法。
- **Bridge**：要正確，就不能只改 drift。換一個旋鈕。

### U8.4 · 改成用很多顆粒子　`dma-particles-and-smc`

一條線走完：**best-of-K → importance sampling → 中途重採樣（SMC）→ FK steering**。

- **importance sampling**：抽 $K$ 個 $x^{(i)}\sim p_{\text{data}}$，權重 $\propto e^{\lambda r(x^{(i)})}$，按權重抽一個。
  **這個分布就是 $p^\star$**（$K\to\infty$）。第一個有正確性保證的方法。
  機器整套來自 <Ref to="math-importance-sampling"/>（見第七節），這裡只做一件事：**指出 $q=p_{\text{data}}$、$p=p^\star$，於是權重就是 $e^{\lambda r}$**。
  代價也是現成的：$\lambda$ 一大，$p^\star$ 與 $p_{\text{data}}$ 差越遠，ESS 塌成 1——退化成 best-of-K。
- **為什麼要中途重採樣**：全部跑完才加權，等於把預算花在一開始就沒救的粒子上。
  中途就用「這顆粒子看起來會不會走到高 reward」的估計來汰換——那個估計叫 **potential** $h_t$。
- **FK steering**（Singhal et al. 2025）：目標 $p(x_0)\propto p_\theta(x_0)e^{\lambda r(x_0)}$，
  每步用 potential 打分、重採樣。potential 的三種選法（max / add / difference）——**寫的時候要回原文核對定義，本規劃只記有這三種。**
  它對 reward 不要求可微，所以離散狀態空間（U4、U5）也能用——這是它相對 U8.2 的關鍵優勢。
- **與 U8.2 的關係**：不是取代。FK steering 的 proposal 可以就是 guided 的動力學；重採樣負責把 U8.3 那個 mismatch 修回來。
  **Feynman–Kac correctors**（Skreta et al. 2025，書 §8.4.2 有引）明確做這件事。
- **Q1**：重採樣把權重清成 1，看起來像是「忘掉了」歷史。為什麼這樣還會收斂到對的分布？
- 文獻另外兩支：TDS（Wu et al. 2023，twisted SMC，asymptotically exact）、DAS（ICLR 2025 spotlight）。
- **Bridge**：粒子法把「正確」買回來了，價錢是 ESS。而 ESS 之所以崩，是因為 $p^\star$ 和 $p_{\text{data}}$ 差太遠。那就別一步跨過去。

### U8.5 · 一道階梯：從 $p_{\text{data}}$ 慢慢走到 $p^\star$　`dma-annealing-ladder`

- **想法**：不要一次上 $\lambda$，走一道階梯 $0=\lambda_0<\lambda_1<\cdots<\lambda_K=\lambda$，
  每一階的相鄰兩個分布夠接近，權重就不會崩（annealed importance sampling）。
- **Parallel tempering / replica exchange**：同時跑 $K$ 條鏈、每條在一個 $\lambda_k$ 上，
  相鄰兩條以 Metropolis 判準交換狀態。低 $\lambda$ 的鏈負責跨 mode，高 $\lambda$ 的鏈負責精細——**交換讓兩者互相借力**。
  在 diffusion 上的近作：CREPE（replica exchange）、progressive tempering。
- **收尾的那句話，但要說得準確**：diffusion 自己就是一道階梯——$t$ 大的時候好混合、$t$ 小的時候尖。
  **但它是「抹平（convolution）」的階梯，不是「降溫（取次方）」的階梯**，兩者不一樣：
  - 對單一 Gaussian，兩者只差一個參數換算；
  - 對混合分布就分家了：$p^\beta$ 會把各 mode 的**權重拉平**（$\beta\to0$ 時全部等重），
    卷積則**保留混合權重**，只是把每個 mode 撐寬。
  - 這個差別正是 parallel tempering 之所以能跨 mode 的原因，也是為什麼「diffusion 的 $t$ 已經是 tempering 了」這句話**不對**。
- **一張表收尾整個單元**（兩個旋鈕 × 正確性）：

  | 方法 | 動了哪個旋鈕 | 取樣到 $p^\star$ 嗎 | 代價 |
  |---|---|---|---|
  | Langevin / MH on $p^\star$ | 自己一條鏈 | 漸近對 | 混合時間 |
  | best-of-K | 選樣 | 否（極值分布） | $K$ 倍前向 |
  | classifier / CFG / training-free guidance | 動力學 | 只有 $w=1$ + exact classifier | 便宜、到處能用 |
  | importance sampling | 選樣 | 對（$K\to\infty$） | ESS |
  | SMC / FK steering | 動力學 ＋ 選樣 | 對（漸近） | $K$ 倍、粒子退化 |
  | annealed IS / parallel tempering | 階梯 | 對（漸近） | $K$ 條鏈 × 階數 |

- **Q1**：表上最後三列都寫「漸近對」。在真的只能跑 8 顆粒子的時候，這個「漸近」還值多少？

### U8.6 · Lab　`dma-lab-steering`

Toy：沿用課裡的 8-mode 圓周高斯（<Ref to="dma-lab-consistency"/> 用過），reward 取「離某一個 mode 近」。
好處是 **$p^\star$ 可以解析算出來**，所以「有沒有取樣到 $p^\star$」不是猜的。

1. 訓一個小 FM／diffusion，確認無條件樣本對。
2. best-of-K：畫 $K=1,4,16,64$ 的終點分布，和解析 $p^\star$ 比。
3. gradient guidance：掃 $w$，畫「和 $p^\star$ 的距離」對 $w$ 的曲線——**預期它有一個最小值，而且不在 $w$ 最大處**。
4. **直接量 U8.3 的 mismatch**：把 exact score 與極小步長都給足，看距離會不會趨近 0。（預期：不會。）
5. FK steering：同樣的 NFE 預算下和 2、3 比；畫 ESS 隨 $t$ 的曲線。
6. 階梯：把 $\lambda$ 拆成 4 階，看 ESS 與最終距離怎麼變。
- 距離一律用 **energy distance**，不用 $W_2$——理由見 style guide §7（$n=1000$ 時 $W_2$ 的有限樣本地板會蓋掉訊號）。

---

## 四、前置知識：有的與缺的

**已經有的**（U8 只需要 `<Ref>`，不重講）：

| 需要什麼 | 在哪 |
|---|---|
| Langevin、stationary $e^{-V}$、混合時間、步長 bias | M3.3 |
| Fokker–Planck | M3.2、<Ref to="dma-sampler-family"/> |
| detailed balance、時間反轉 | M4.3 |
| stationary distribution、Markov chain | M4.0 |
| KL、Jensen | M5.0、M5.1 |
| Tweedie、$\hat x_0=\mathbb E[x_0\mid x_t]$ | M1.4、U1.3 |
| 取樣噪聲 $\varepsilon_t$ 這個旋鈕、Fokker–Planck 保邊際的證明 | <Ref to="dma-sampler-family"/> |
| CFG 的形式與代價 | <Ref to="dma-shared-techniques"/> |
| importance sampling、self-normalized IS、ESS | **M1.5（要新寫，見第七節）** |

**缺的四樣**，安排見第七節（作者已定案）：importance sampling／ESS（→ 新的 M1.5）、
Metropolis–Hastings（→ U8.1）、重採樣與 SMC（→ U8.4）、annealed IS／parallel tempering（→ U8.5）。

---

## 五、符號預算（§10-H）

新單元要引進的字母，和已經被佔走的位置逐一對過：

| U8 要用 | 課裡已經是什麼 | 決定 |
|---|---|---|
| reward $r(x)$ | U7 的 $u(z,r,t)$ 裡 $r$ 是**時刻** | 保留 $r(x)$（領域標準），U8.0 加一個符號 Remark：**帶 $x$ 的是 reward，當下標／時間參數的是時刻**——沿用 <Ref to="dma-flow-map"/> 分辨 $u$ 的同一招 |
| tilt 強度 $\lambda$ | U6 的 $\lambda(t_n)$ 是 CM 的**時間權重** | 保留 $\lambda$；U6 那個只活在 U6，Remark 裡一句話帶過 |
| guidance 強度 $w_t$ | U3.5 的 $w$ 是 CFG 強度、$w(t)$ 是訓練加權 | 沿用書的 $w_t$，並在 U8.2 明說這兩個 $w$ 在 U3.5 就已經同名——**順手把 U3.5 的訓練加權改記成 $\omega(t)$** |
| potential $h_t(x)$ | U3.2／U3.5 的 $h$ 是 Euler **步長** | 有衝突。傾向保留書的 $h_t(x)$（吃參數、帶下標 $t$），Remark 分辨；**若作者不接受，改用 $\phi_t(x)$** |
| guidance 方向 $G_t$（書的寫法） | **U7 的 $G_\theta$ 是 CTM 的 flow map** | **不用 $G$。** 直接寫 $\nabla\log h_t$，不另給字母 |
| 粒子數 $K$ | U4／U5 的 $K$ 是字典大小 | 用 $K$（作者原話就是 best-of-K）；不同單元，風險低，Remark 記一筆 |
| 溫度 $\beta$ 或 $T$ | $\beta_t$ 是 DDPM schedule／U3 的插值係數；$T$ 是終點時刻 | **完全不引進「溫度」這個符號。** 階梯直接寫成 $\lambda_0<\cdots<\lambda_K$——反正 $\lambda$ 就是反溫度，少一層翻譯 |

---

## 六、要先加的掛鉤（U8 還沒寫就可以做）

依 `plannedNotes` 機制，label 先登錄，現有筆記就可以指過去（渲染成灰色「規劃中」chip）：

| 在哪 | 加什麼 |
|---|---|
| <Ref to="dma-what-are-we-learning"/> 的 MCMC 那句 | → `dma-mcmc-and-mixing` |
| <Ref to="dma-tweedie-and-score"/> 的「normalizing constant 只是被繞過」 | → `dma-mcmc-and-mixing` |
| <Ref to="dma-shared-techniques"/> 的「既不是…也不是…」 | → `dma-tilted-path`（**這是最該加的一個**） |
| <Ref to="dma-sampler-family"/> 新增的〈「一樣」有四種意思〉第四層 | → `dma-tilted-path`（同一條 Fokker–Planck 檢查的第二次使用） |
| U5 的離散取樣 | FK steering 對離散也適用 → `dma-particles-and-smc` |

---

## 七、前置知識的安排（作者定案 2026-09-20：折衷）

**importance sampling／ESS 開一篇新的 foundations 筆記；Metropolis–Hastings 與 tempering 留在 U8 內講。**

### 新增 `math-importance-sampling`（M1.5，接在 M1.4 Tweedie 之後）

放 `mathematical-foundations/m1-probability/`。編號由 `noteSlugList` 順序算出，附加在 M1 末尾不會動到 M1.0–M1.4。

照 foundations 體例：**完全不提 diffusion、reward、guidance 這些下游詞**，13 段結構。

| 段 | 內容 |
|---|---|
| 起點問題 | 想估一個**只在尾巴才有值**的量的期望——例如「一個城市裡，身高超過 195 公分的人，平均年收入是多少」。隨機抽 1000 個人，可能一個都抽不到，估計值是 0 除以 0。 |
| 翻成數學 Q1 | 「那就故意多抽高個子，再把結果打折扣」——**折扣該打多少？** 請自己先寫出一個估計式，並回答它是不是無偏的。 |
| 直覺圖 | 兩條密度並排：真正想要的 $p$，和實際去抽的 $q$。每個樣本頭上標一個權重 $p/q$——抽得太多的那一區，權重小；抽得太少的那一區，權重大。 |
| 數學化 | $\mathbb E_p[f]=\mathbb E_q[f\,\tfrac pq]$ 兩行推完（換測度）。接著 **self-normalized** 版本：只知道 $p$ 到一個常數時，用 $\sum w_if_i/\sum w_i$；它有偏但 consistent，而「只知道到一個常數」正是最常見的處境。 |
| 回到情境（理論） | **ESS** $=(\sum w_i)^2/\sum w_i^2$：$n$ 個加權樣本實際上抵得上幾個等權樣本。推出它的兩個極端（權重全等 ⇒ $n$；一個權重獨大 ⇒ 1），以及 $\mathrm{Var}$ 與 $\chi^2$ 散度的關係——**$p$ 與 $q$ 差越遠，ESS 掉得越快，而且是指數級的。** |
| 回到情境（實作，刻意違反假設） | 跑三個 $q$：太窄（尾巴沒覆蓋到，估計偏得離譜且 ESS 假高）、剛好、太寬（無偏但 ESS 低）。**「$q$ 的支撐沒有蓋住 $p$」是唯一會讓估計悄悄錯掉而 ESS 看不出來的情形**，這一段要專門演一次。 |
| quiz | ESS 高是不是就代表估得準？（不是——上一段那個反例） |
| Bridge | 下一步：$p$ 與 $q$ 差太遠的時候怎麼辦。（不點名 diffusion。） |

M1 的其他篇不動。`<UsedBy>` 會自動反向索引到 U8。

### 留在 U8 裡講的

- **Metropolis–Hastings**（U8.1）：detailed balance 在 <Ref to="math-time-reversal"/> 已經寫過，這裡只加 accept/reject 與「它把步長 bias 換成拒絕率」這一句。放在 U8 是因為它在這門課只有這一個用處。
- **重採樣與 SMC**（U8.4）：直接接 M1.5 的 ESS——「ESS 掉下來就重採樣」是一句話的動機，不需要另開一篇。
- **annealed IS／parallel tempering**（U8.5）：同理，階梯的動機就是 M1.5 那條「$p$ 與 $q$ 差越遠 ESS 掉越快」。

### 順序

M1.5 要在 U8.4 之前寫好（U8.4 整篇建在 ESS 上）。U8.0–U8.3 不依賴它，可以先寫。

---

## 八、文獻清單（寫的時候逐條核對，標 ★ 的是主要依據）

**書**：Ch.8 §8.1 Prologue（Bayes 分解）、§8.2 CG、§8.3 CFG、★§8.4.1 training-free 的 data/noise space 兩個位置、★§8.4.2 What Distribution Does Guided Sampling Produce、§8.5 RLHF→DPO（只當對照組）。

- Dhariwal & Nichol, *Diffusion Models Beat GANs*, NeurIPS 2021（classifier guidance）
- Ho & Salimans, *Classifier-Free Diffusion Guidance*, 2022（U3.5 已引）
- ★ Bradley & Nakkiran, *Classifier-Free Guidance is a Predictor-Corrector*, arXiv 2408.09000
- Chung et al., *Diffusion Posterior Sampling*（DPS）, ICLR 2023
- Yu et al., *FreeDoM*；He et al., *MPGD*；Bansal et al., *UGD*（書 §8.4.1 引的三支）
- ★ Singhal et al., *A General Framework for Inference-time Scaling and Steering of Diffusion Models*, arXiv 2501.06848, ICML 2025（FK steering）
- Skreta et al., *Feynman–Kac Correctors*, 2025（書 §8.4.2 引）
- Wu et al., *Practical and Asymptotically Exact Conditional Sampling in Diffusion Models*（TDS）, NeurIPS 2023
- *Diffusion Alignment as Sampling*（DAS）, ICLR 2025 spotlight
- Ma et al., *Inference-Time Scaling for Diffusion Models beyond Scaling Denoising Steps*, arXiv 2501.09732, CVPR 2025（verifier × algorithm 兩軸）
- CREPE: *Controlling diffusion with REPlica Exchange*, arXiv 2509.23265
- Neal, *Annealed Importance Sampling*, 2001；Geyer 1991 / Swendsen & Wang 1986（parallel tempering 出處，寫時核對）

---

## 九、沒有要做的事

- **不重教 CFG**。U3.5 已經寫完，U8.2 只把它放回家族並補上「$h_t=p_t(c\mid x)$、$w_t=w$」這個對照。
- **不展開 RLHF / DPO**。書 §8.5 是訓練時對齊，和這個單元的前提（模型不動）相反，只當對照組寫一段。
- **不展開 inverse problems**（書 §8.4.3）。它是 training-free guidance 最大的應用場，但自成一個題目，留給之後的應用單元。
