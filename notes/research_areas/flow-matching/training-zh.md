# 訓練 Flow Matching：一個「隨群體而動」的視角

## 本章將會介紹
- **Flow Matching** 的目標函數如何定義
- **Flow Matching** 如何設計 Loss Function 來逼近這個目標函數

---

## 引言

到目前為止，我們已經知道：

👉 Flow Matching 的目標，是學習一個「隨時間移動的速度場（velocity field）」，記作 $v(x,t)$，  
隨著它決定的方向，我們能夠讓噪聲逐步被搬運成真實數據的位置。

具體來說，是透過上一篇講的 Flow ODE: 

$$
\frac{dx}{dt} = v(x,t).
$$

但問題是：

👉 這個「移動方向 $v(x,t)$ 」應該怎麼學？

---

## 一個直覺情境：從人潮到捷運站

先不要急著看數學，我們先想一個具體場景。

假設我們有兩個資料分布：

* **起點（Source）**：跨年煙火結束後，擠在信義區的人潮（集中在一團）
* **終點（Target）**：分散在附近的三個捷運站（形成三個群）

👉 我們的目標是：
把跨年人潮疏散到三個捷運站。

<div class="demo-wrapper">
  <iframe src="/personal_website/notes/research_areas/flow-matching/training-setting-zh.html" class="demo-frame"></iframe>

  
</div>

> [👉 全螢幕](/personal_website/notes/research_areas/flow-matching/training-setting-zh.html)

---

## 最直覺的做法：兩點之間走直線

如果我們知道：

* 隨機抽選一個跨年人潮裡的人
* 再隨機抽選他應該去的終點位置

那最自然送他去捷運站的方式是什麼？

👉 **直接走直線**

也就是：

> 把起點和終點「用一條線連起來」，然後沿著這條線移動

👇 動手探索：

請先觀察畫面上的藍點（起點）與橘點（終點）。接著，請打開「顯示隨機配對連線」的開關。
你會發現畫面變成了一團混亂的毛線球！你可以多按幾次「重新隨機配對」，並試著拖曳「搬運進度 $t$ 」滑桿，觀察粒子在這團混亂的軌跡中是如何移動的。

<div class="demo-wrapper">
  <iframe src="/personal_website/notes/research_areas/flow-matching/training-stochastic-interpolants-zh.html" class="demo-frame"></iframe>
</div>

> [👉 全螢幕](/personal_website/notes/research_areas/flow-matching/training-stochastic-interpolants-zh.html)


---

## 數學描述這件事

這件事可以用一個非常簡單的公式表示：

$$
X_t = (1 - t) X_0 + t X_1
$$

這條式子的意思是：

* $t = 0$：在起點 $X_0$
* $t = 1$：在終點 $X_1$
* 中間：沿著兩點之間的直線移動

👉 本質上就是：**兩點之間的線性插值（linear interpolation）**

具體來說：

👉 從起點分布隨機抽一個起點 $X_0$  
👉 從終點分布隨機抽一個終點 $X_1$  
👉 把它們配在一起  

然後對每一對 $(X_0, X_1)$：

👉 都用剛剛的直線來連接

$$
X_t = (1 - t) X_0 + t X_1
$$

---

💡 數學補充：
* $X_0 \sim p_{\text{source}}$ 是一個隨機變數
* $X_1 \sim p_{\text{target}}$ 也是一個隨機變數

因此：

* $X_t = (1 - t)X_0 + tX_1$ 也是隨機變數

👉 換句話說， $X_t$ 描述的是一個**隨時間演化的隨機過程（stochastic process）**

且上述隨機配對 $(X_0, X_1)$ 的方法在數學上稱為 **獨立耦合（independent coupling）**，也就是從兩個分布「各自獨立抽樣」來形成配對。

---

## 但現實情況是：我們不一定知道起點與終點

然而在真正的生成問題中：

👉 我們並不知道每一個點最後會去哪裡 ── 不知道最終生成的資料長什麼樣子

甚至對我們要學的 $v(x,t)$ 來說：

- 它只知道當下的位置 $x$
- 以及現在的時間 $t$
- 但不知道起點是誰
- 也不知道終點在哪裡  

---

## 情境類比

這就像：

👉 一個人站在跨年煙火結束後的街頭，  人很多，方向很多，但你不知道捷運站在哪裡  

### 這時候你會怎麼做？

---

你其實沒有辦法知道「正確路徑」，
但你可以做一件很直覺的事情：

👉 觀察周圍知道如何走的人的移動方向

👉 然後估計一個「大致的平均方向」


---

## 定義目標 $v(x, t)$ 的直覺想法：隨人潮而動

這其實就是 Flow Matching 的核心直覺：

👉 我們不依賴單一確定的搬運路徑  

👉 而是考慮所有可能的「起點–終點配對」 $(X_0, X_1)$ 所決定的搬運方式 $X_t$ 

每一組 $(X_0, X_1)$ 都會定義一條線性插值軌跡：

$$
X_t = (1 - t)X_0 + tX_1
$$

---

### 在給定的 $(x,t)$ 下我們在看什麼？

當我們固定時間 $t$ 並觀察位置 $x$ 時，本質上是在做條件化：

$$
X_t = x
$$

也就是說：

👉 我們只關心所有「在時間 $t$ 會經過位置 $x$ 」的搬運過程

---

在這些可能的搬運過程中：

- 可能來自不同的 $(X_0, X_1)$ 配對  
- 每一組配對都會在該時刻產生不同的瞬時速度  

---


由於我們定義的是線性插值軌跡：

$$
X_t = (1 - t)X_0 + tX_1
$$

對時間 $t$ 微分可得：

$$
\dot{X}_t = \frac{dX_t}{dt} = X_1 - X_0
$$

---

因此，在固定 $(x,t)$ 下：

👉 我們觀察到的是一個「速度的分佈」  

👉 這個分佈由所有滿足 $X_t = x$ 的 $(X_0, X_1)$ 配對所定義的速度 $\dot{X}_t = X_1 - X_0$ 所組成

---

## 目標速度場：

Flow Matching 的核心就是：

👉 定一個速度場 $v(x, t)$ 去代表這個「條件下的平均速度」

👉 然後用神經網路 $v_\theta(x, t)$ 去逼近它 

這個目標函數 $v(x, t)$ 在數學上定義為：

$$
v(x, t) = \mathbb{E}_{X_0, X_1}[\dot{X}_t \mid X_t = x]
$$

意思是：

- 給定時間 $t$ 與位置 $x$
- 考慮所有 $(X_0, X_1)$ 配對
- 篩選出那些在時間 $t$ 滿足 $X_t = x$ 的搬運過程
- 取這些過程在該時刻的瞬時速度 $\dot{X}_t$ 的平均值

在我們考慮的 $X_t = (1 - t)X_0 + tX_1$，$v(x, t)$ 同時可以被寫成：

$$
v(x, t) = \mathbb{E}_{X_0, X_1}[X_1-X_0 \mid X_t = x]
$$

---

👇 **動手探索：**

點擊「🎲 隨機抽取起點」或者直接在畫布中「自由拖曳起點」來模擬迷茫不知道方向的人，觀察用 1000 步 Euler Discretization 算出的平滑曲線！

<div class="demo-wrapper">
  <iframe src="/personal_website/notes/research_areas/flow-matching/training-flow-zh.html" class="demo-frame"></iframe>
</div>

<p style="text-align: right; font-size: 0.85rem; margin-top: 6px;">
  <a href="/personal_website/notes/research_areas/flow-matching/training-flow-zh.html" target="_blank">↗ 全螢幕開啟</a>
</p>

---

## 如何學這個 velocity field？

由於 $v(x,t)$ 本質上是條件期望：

$$
v(x,t) = \mathbb{E}[\dot{X}_t \mid X_t = x]
$$

在實際情況中，這個條件分佈是難以直接計算的（intractable），
因此我們無法直接求得 $v(x,t)$。

---

### 解法：用模型逼近

我們用一個可學習的模型 $v_\theta(x,t)$ 來近似真實的 $v(x,t)$：

$$
v_\theta(x,t) \approx v(x,t)
$$

---

### 訓練目標（Flow Matching objective）

我們可以用以下 L2 regression 目標來學習：

$$
\mathcal{L} = \mathbb{E}_{X_0, X_1 ,t} \left[ \| v_\theta(X_t,t) - \dot{X}_t  \|^2 \right]
$$

---

### 💡 數學補充：為什麼 L2 loss 會給出 optimal velocity field？

我們想學的是：

$$
v(x,t) = \mathbb{E}[\dot{X}_t \mid X_t = x]
$$

但實際訓練時，我們無法直接使用 conditional expectation，
因此考慮以下 L2 regression 問題：

$$
\min_{v_\theta} \mathbb{E}\left[ \| v_\theta(X_t,t) - \dot{X}_t \|^2 \right]
$$

---

### Step 1： 引入目標項並展開平方

為了證明，我們在平方項內刻意的加一項再減一項 $v(X_t, t)$：

$$
\begin{aligned}
\mathbb{E}\left[ \| v_\theta(X_t,t) - \dot{X}_t \|^2 \right]
&= \mathbb{E}\left[ \| (v_\theta(X_t,t) - v(X_t, t)) + (v(X_t, t) - \dot{X}_t) \|^2 \right] \\
&= \mathbb{E}\left[ \| v_\theta(X_t,t) - v(X_t, t) \|^2 \right] + \mathbb{E}\left[ \| v(X_t, t) - \dot{X}_t \|^2 \right] \\
&\ \ \ \  + 2\mathbb{E}\left[ \langle v_\theta(X_t,t) - v(X_t, t), v(X_t, t) - \dot{X}_t \rangle \right]
\end{aligned}
$$

這會產生三個部分：
1. **模型誤差項**：模型預測值與目標函數之間的差距。
2. **與逼近無關的變化**：目標函數與參考軌跡給的方向的變異。
3. **交叉項**。

---

### Step 2： 證明交叉項為零

我們利用Law of Total Expectation，先對 $X_t$ 取條件期望來處理交叉項：

$$
\begin{aligned}
\mathbb{E}\left[ \langle v_\theta(X_t,t) - v(X_t, t), v(X_t, t) - \dot{X}_t \rangle \right]
&= \mathbb{E}_{X_t} \left[ \mathbb{E} \left[ \langle v_\theta(X_t,t) - v(X_t, t), v(X_t, t) - \dot{X}_t \rangle \mid X_t \right] \right]
\end{aligned}
$$

在給定 $X_t$ 的情況下， $v_\theta(X_t,t), v(X_t, t)$ 都變成了常數向量，可以提出內積的期望值之外：

$$
\begin{aligned}
&= \mathbb{E}_{X_t} \left[ \langle v_\theta(X_t,t) - v(X_t, t), \mathbb{E}[ v(X_t, t) - \dot{X}_t \mid X_t ] \rangle \right]
\end{aligned}
$$

這時，我們觀察內積後方的項 $\mathbb{E}[ v(X_t, t) - \dot{X}_t \mid X_t ]$。
因為我們最初的定義就是 $v(X_t, t) = \mathbb{E}[\dot{X}_t \mid X_t]$，所以：

$$
\mathbb{E}[ v(X_t, t) - \dot{X}_t \mid X_t ] = v(X_t, t) - \mathbb{E}[\dot{X}_t \mid X_t] = v(X_t, t) - v(X_t, t) = 0
$$

因此，整個交叉項完美消去為 $0$。

---

### Step 3： 結論

回到我們一開始展開的等式，現在只剩下兩項：

$$
\mathbb{E}\left[ \| v_\theta(X_t,t) - \dot{X}_t \|^2 \right] = \mathbb{E}\left[ \| v_\theta(X_t,t) - v(X_t, t) \|^2 \right] + \mathbb{E}\left[ \| v(X_t, t) - \dot{X}_t \|^2 \right]
$$

👉 **關鍵洞察：**
等式右邊的第二項 $\mathbb{E}[ \| v(X_t, t) - \dot{X}_t \|^2 ]$ 只與資料分佈和參考路徑有關，與我們的模型參數 $\theta$ **完全無關**（它是一個常數）。

因此，當我們訓練神經網路去最小化左邊的 Loss 時：

$$
\min_\theta \mathbb{E}\left[ \| v_\theta(X_t,t) - \dot{X}_t \|^2 \right] \iff \min_\theta \mathbb{E}\left[ \| v_\theta(X_t,t) - v(X_t, t) \|^2 \right]
$$

這在數學上嚴格保證了：**當我們用 L2 Loss 去逼近所有參考軌跡的速度 $\dot{X}_t$ 時，神經網路最終學到的最佳解 $v_\theta$，就是所有可能軌跡在該點的「平均移動方向（條件期望值）」 $v(x,t)$。**


## 最終直覺

Flow Matching 的訓練可以理解為：

👉 在每一個時間 $t$ 與位置 $x$  

👉 我們參考許多可能的「搬運方式」（由 $(X_0, X_1)$ 決定）

👉 每一種方式都會給出一個瞬時移動方向 $\dot{X}_t$

👉 把這些不同的方向「整合起來」

---

## 預告

下一篇我們會進一步問一個更本質的問題：

我們目前使用的是「線性插值」來構造參考路徑，  
但這是唯一的選擇嗎？

還是說：

👉 不同的「搬運方式」會不會導致不同的學習結果？  
👉 如果改變參考路徑的設計，Flow Matching 會發生什麼變化？

---

這些問題會引導我們進一步理解：

👉 stochastic interpolants (參考路徑的專業名稱)  
👉 以及不同 path design 對 learned velocity field 的影響

---

## 參考文獻 (References)

1. Lipman, Yaron, Ricky TQ Chen, Heli Ben-Hamu, Maximilian Nickel, and Matt Le. "Flow Matching for Generative Modeling." ICLR 2023.

2. Liu, Xingchao, and Chengyue Gong. "Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow." ICLR 2023.

3. Albergo, Michael Samuel, and Eric Vanden-Eijnden. "Building Normalizing Flows with Stochastic Interpolants." ICLR 2023.
