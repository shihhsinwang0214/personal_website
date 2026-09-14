# Prompt — 為 W3.0「生成到底在學什麼？」補視覺化（v2，對應改寫後的正文）

> 貼給負責做圖的 agent。正文已定稿（`dma-w3-0-what-are-we-learning.zh.mdx`），這份規格對應**現在的段落結構**：生成是什麼（樣本 → distribution → mode）→ Q1（訓練 vs 取樣）→ 學映射 $G$（pushforward）→ 第一個框架 normalizing flow（結構 vs 模擬的交換）→ Q2（太多 $G$ vs 自己定路徑）。圖 1 作者已完成，本次要做 **圖 2–6 共五張**（圖 2 是新增的「樣本 → distribution → mode」）。每張圖同時要能直接拿去做投影片。

---

## 共同規範（每張圖都適用）

**Repo 位置**
- 筆記本體：`site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/dma-w3-0-what-are-we-learning.zh.mdx`（每週一個資料夾 `week-N/`，各自有 `imgs/`）
- 互動 demo 放：`site/public/notes/research_areas/diffusion-models-and-their-applications/week-3/`（新資料夾，同樣按週分）。把 `site/public/notes/research_areas/noise-to-data/_demo-common.js` **複製一份**到這個資料夾旁用（提供 `randn`、`sampleTarget('two_moons')`、`isDark`、`palette`、`onThemeChange`、`hiDPICanvas`、`prefersReducedMotion`），不要改原檔。
- 靜態圖（SVG / PNG）放在 `week-3/imgs/`，**檔名規則 `w3-0-N.svg`**（N = 該篇第幾張圖，圖 1 已是 `w3-0-1.png`），用 `![alt](./imgs/w3-0-N.svg)` 嵌入，圖下方一行粗體圖說（格式已示範在 .mdx 第 57–59 行的圖 1）。
- 互動 demo 用絕對路徑 iframe 嵌入，並登錄在 frontmatter `demos:`：
  ```html
  <iframe loading="lazy" src="/personal_website/notes/research_areas/diffusion-models-and-their-applications/week-3/w3-0-N.html" class="demo-frame" title="…" style="height: 560px; width: 100%; border: none;"></iframe>
  ```
  現成範例：`site/public/notes/research_areas/diffusion-flow-course/principles-pipeline.html`、`noise-to-data/vector-field.html`。

**視覺與行為**
- Theme-aware（父頁面 `data-theme` + `prefers-color-scheme`，用 `palette()` / `onThemeChange()`）；深淺色都要好看。
- Reduced-motion safe：**不自動循環動畫**，一切由滑桿／按鈕驅動，最多一個單趟 Play。
- Hi-DPI canvas、RWD（360px 寬不能壞）。
- 每個 demo 底部固定一行「**觀察：…**」。
- **可做投影片**：靜態 SVG 直接 16:9；互動 demo 加「匯出 PNG」按鈕（`canvas.toBlob`，2×，含當前狀態、去掉控制列）。圖中文字少、用 label 不用段落，正文 ≥ 14px 於 1000px 寬。
- 術語一律英文（loss、density、normalizing constant、score、mixing、pushforward、coupling layer、log-det、simulation…），中文只做動詞和連接。符號與筆記一致：$p_{\text{data}}$、$p_\theta$、$E_\theta$、$Z_\theta$、$\nabla\log p_\theta$、$G$、$v_\theta$、$z\sim\mathcal N(0,I)$。
- 資料一律 2D toy（`two_moons`），圖說講明「真實資料在 $\mathbb R^{3072}$，畫 2D 是為了看得見」。
- **正文與圖裡都不出現 GAN**（.mdx 最後那段「補充」引言除外）。
- 所有圖的點雲配色、two_moons 位置、$\mathcal N(0,I)$ 位置必須**完全一致**（圖 2、4、6 都畫同一對點雲；圖 6 之後 W4.3 還會沿用）。先定一組共用常數（點雲中心、半徑、顏色）寫在 `week-3/` 裡的 `w3-0-shared.js`，SVG 手繪時也照這組座標。

**完成後**
- 圖 2 替換 `<VizPlan id="w3-0-modes">`、圖 6 替換 `<VizPlan id="w3-0-many-maps">`；圖 3–5 是新增，插在下面各自指定的位置。
- 元件 import 路徑在 week 資料夾裡是 `../../../components/…`（已改好，不要動）。
- `cd site && npm run check && npm run build:astro` 綠燈；深色模式看一次；360px 寬看一次。
- 回報：檔名、嵌在 .mdx 第幾行、匯出 PNG 是否正常。每張做完就回報，不要四張一起交。

---

## 圖 1 ｜「五萬張 32×32 的圖，生一張新的」— ✅ 已完成並嵌入（`week-3/imgs/w3-0-1.png`，.mdx 第 57–59 行）

不用動。它的配色（灰 / 淡藍 / 淡黃三格、深藍曲線）就是這篇其餘圖的基準色，圖 2–6 請沿用。

---

## 圖 2 ｜「從樣本到 distribution：點 → 密度 → 一座地形」— 互動 demo（新，兩格連動）

**位置**：替換「## 先說清楚：「生成」到底是在做什麼」一節裡的 `<VizPlan id="w3-0-modes">` 區塊。
**檔名**：`week-3/w3-0-2.html`（demo）。

這張圖要一次講清楚三個概念，而且要讓讀者看到它們是**同一個東西的三種看法**：
1. **particle**：每張圖是空間裡的一個點（樣本）。
2. **density**：點多的地方密、點少的地方稀——這是一個定義在整個平面上的**函數** $p_{	ext{data}}(x)$，不只是幾個點。
3. **density 是一座地形**：把函數值當高度畫出來，平面上的密度就變成一片 3D 地形，山峰是 mode，山谷 ≈ 0。生成＝在山峰上落一顆新的點。

所以版面是**左右兩格連動**：左格是「從上面看」（平面），右格是「從側面看」（同一片密度立成 3D 地形）。同一個 hover / 同一顆新點，兩格同時亮。

**左格「俯視：點與密度」**
- 2D toy 點雲，三到四團（`two_moons` 兩團 + 一兩團小 Gaussian；座標寫進 `w3-0-shared.js`），每一團代表「同一種動物、細節略有差異」的照片。
- Hover 任一顆點，畫布下方顯示一張程序化假縮圖（與圖 1 同一套規則）。同一團內的縮圖由該點在團內的相對位置決定「耳朵長短、嘴巴大小、色調」三個連續參數，只差一點點；跨團則形狀類別明顯不同——讀者滑過去就感受到「距離近＝長得像」。
- 滑桿「從點到密度」$\lambda\in[0,1]$：$\lambda=0$ 只有點；往右拉，點逐漸淡出、KDE 的 heatmap 逐漸浮現；$\lambda=1$ 只剩 heatmap 與等高線。標「點是樣本，顏色是 $p_{	ext{data}}(x)$——每個位置都有值，不只樣本所在處」。
- 滑桿「樣本數」：50 → 500 → 50,000（對數）。點越多，heatmap 越接近右格的真實地形——暗示樣本只是地形的觀察。

**右格「側視：密度是一座地形」**
- 把左格同一個 $p_{	ext{data}}(x)$ 畫成 3D surface（$z$ 軸 = 密度值）。用 canvas 手寫一個簡單的等角／透視投影即可，**不要**引入 three.js 這類外部函式庫；網格 60×60 足夠。
- 可拖曳旋轉方位角、一個滑桿調仰角；預設仰角約 35°。有 reduced-motion 時不做慣性動畫。
- 山峰上標 **mode**；兩峰之間的谷底標 **≈ 0**。左格的等高線與右格地形的等高線同色，讓讀者對得上。
- 左格 hover 的點，在右格地形上同步亮一顆小球（落在對應高度的表面上）。

**兩格共用的按鈕**
- 「抽一個新的點」：從混合高斯**真的抽一顆**（不是既有樣本）。左格以醒目色落點、右格小球落在山峰上；縮圖看起來合理，標「不在五萬張裡——這是生成」。
- 「在谷底丟一個點」：在密度 ≈ 0 處落點；右格小球落在谷底、縮圖是雜訊或四不像，標「這是亂猜」。
- 左下角一行灰字：「從既有的點裡挑一張 → 那是檢索，不是生成」。

**底部觀察句**：「觀察：五萬張圖是點，$p_{	ext{data}}$ 是整片地形的高度——每個位置都有值。生成不是從點裡挑一張，是在山峰上、點還沒出現的位置，找出一張新的。」

**圖說 / 註記（.mdx 內或畫面角落）**：「真實資料活在 $\mathbb R^{3072}$，密度是 3072 維空間上的函數，畫不出來；這裡把空間壓成 2D、高度當密度，是為了看得見。高維裡的『山峰』其實是很薄的一片，這件事 W3.3 談 score 時會再回來。」

**匯出 PNG**：左右兩格併成 16:9，含當前 $\lambda$、旋轉角與已落下的新點；縮圖列放在下緣。

---

## 圖 3 ｜ Q1「訓練卡在 $Z_\theta$，取樣卡在 mixing」— 互動 demo，左右並排

**位置**：`<Question id="Q1">` 內、`<Answer>` 結束之後、`</Question>` 之前。讀者先想、看完答案，再用圖確認兩件事是分開的。
**檔名**：`week-3/w3-0-3.html`（demo）。

這張圖的任務是把正文 Q1 答案的兩段各對到一格，而且要讓讀者**看到 $Z_\theta$ 只出現在左格**。

**左格「訓練：MLE 需要 $Z_\theta$」**
- 上方式子：$\log p_\theta(x)=-E_\theta(x)-\log Z_\theta$，下面一行 $\nabla_\theta\log Z_\theta=-\mathbb E_{x\sim p_\theta}[\nabla_\theta E_\theta(x)]$，把 $\mathbb E_{x\sim p_\theta}$ 用醒目色框起來、標「要先從 $p_\theta$ 抽樣」。
- 畫一個 2D energy landscape $E_\theta$（two_moons 的負 log-density）heatmap。
- 一個滑桿「維度 $d$」：1 → 2 → … → 3072（對數刻度）。旁邊即時顯示「用每維 10 個格點做數值積分需要 $10^d$ 次評估」，$d=3072$ 時顯示 $10^{3072}$ 並標「宇宙原子數 ≈ $10^{80}$」。**不要**真的算高維積分，這只是讓數字爆炸看得見。
- 一支從左格指向右格的箭頭，標「每一步梯度都得抽樣 → 把右邊的困難也拖進來」。

**右格「取樣：Langevin 只要 score，$Z_\theta$ 已消失」**
- 同一個 two_moons 密度等高線。上方式子 $x\leftarrow x+\tfrac{\eta}{2}\nabla\log p_\theta(x)+\sqrt{\eta}\,\epsilon$，並在旁邊把 $\nabla\log p_\theta=-\nabla E_\theta$ 寫出來，$Z_\theta$ 打一個刪除線。
- 一顆 Langevin 粒子從其中一個 moon 出發，按鈕「走 100 步」「走 1000 步」，軌跡畫出來。步長 $\eta$ 滑桿。
- 右上角即時顯示「造訪過兩個 mode 的比例」。合理步長下幾乎不會跨到另一個 moon；步長調大則亂跳、離開高密度區。
- 一個小開關「顯示 score 箭頭」：在網格上畫 $\nabla\log p_\theta$（精確的混合高斯 score），讓讀者看到取樣只用到這個場。

**底部觀察句**：「觀察：$Z_\theta$ 只出現在左格。訓練的困難是 normalizing constant（而且要抽樣），取樣的困難是 mixing——取樣從頭到尾只需要 score。」

**匯出 PNG**：左右兩格併成 16:9。

---

## 圖 4 ｜「學映射 $G$：pushforward 讓取樣變容易」— 互動 demo

**位置**：「## 換一個角度：不學密度，學映射」段落最後（「剩下的問題只有一個：$G$ 要怎麼訓練？」之後）。
**檔名**：`week-3/w3-0-4.html`（demo）。

**畫面**
- 左：$z\sim\mathcal N(0,I)$ 點雲（灰）。右：$p_{\text{data}}$ = two_moons 點雲（淡色底）。用 `w3-0-shared.js` 的座標。
- 滑桿 $s\in[0,1]$：$x=(1-s)\,z+s\,G(z)$，$G$ 用**預先算好的解析映射**（例：高斯 → CDF → uniform → two_moons 參數化；或 nearest-pair 配對；不訓練網路）。拖滑桿看灰點被搬成兩個 moon。**不自動播放。**
- Hover 一顆 $z$ 高亮 $z\to G(z)$ 連線；點一下固定 3–5 顆。按鈕「再抽一顆 $z$」：新增一顆 $z$ 直接落到 $G(z)$——這就是「抽一個 $z$、算一次 $G$」。
- 開關「顯示 $p_{\text{data}}$ 等高線」。
- 右下角一個灰色、不可點的假按鈕「跑 MCMC」，hover 提示「不需要」。這是刻意的：對照圖 3 右格。
- **不要**出現 loss、likelihood、flow 等字眼，這張圖只負責「取樣變容易了」。

**底部觀察句**：「觀察：生成只需要『抽 $z$、算 $G$』——沒有 MCMC、沒有 mixing。剩下的問題是：$G$ 要怎麼訓練？」

**匯出 PNG**：當前滑桿狀態，16:9。

---

## 圖 5 ｜「Normalizing flow 的交換：結構 vs 模擬」— 靜態 SVG（新）

**位置**：「## 第一個框架：Normalizing Flow」那段 topic summary（「它十年的發展史其實只在反覆做同一個交換…」）之後、第一個 `<Details>` 之前。這樣主線讀者不用展開細節也能從圖上看到兩代 flow 各付了什麼。
**檔名**：`week-3/imgs/w3-0-5.svg`（16:9）。

**版面：三欄，中間欄是天平**
- **頂部橫幅**：$\log p_\theta(x)=\log p_z(G^{-1}(x))+\log|\det \partial G^{-1}/\partial x|$，右邊小字「精確 likelihood → 可以直接 MLE」。橫幅底下一行大字：「代價：$G$ 的每一步都要可逆、Jacobian 要好算」。

- **左欄「離散時間：付在結構上」**（NICE / Real NVP / MAF / Glow）
  - 畫一疊 4–5 個 coupling layer 的方塊，每塊裡把座標條分成 $x_a$（照抄，畫成直通的線）與 $x_b$（被 $s(x_a),t(x_a)$ 變換，畫成彎過去的線）。旁邊小字 $y_a=x_a,\;y_b=x_b\odot e^{s(x_a)}+t(x_a)$。
  - 一個小三角矩陣圖示，標「Jacobian 三角 → $\log|\det|=\sum s_i$，$O(d)$」。
  - 下方兩個標籤：綠色「每步訓練便宜」、橘色「每層只動一半座標、維度不能變、要疊很多層」。
  - 底部 mini 示意：一團高斯經過 4 層後只變成「稍微扭曲的高斯」，暗示表達力弱（不用精確，示意即可）。

- **右欄「連續時間：付在模擬上」**（Neural ODE / FFJORD）
  - 畫一條從 $z$ 到 $x$ 的 ODE 軌跡，沿路 6–8 個 solver 步點，每個步點旁一支小箭頭 $v_\theta$。標 $\frac{dx}{dt}=v_\theta(x,t)$。
  - 軌跡上方一條反向的虛線箭頭，標「adjoint：再解一次回來算梯度」。
  - 一個小圖示 $\mathbb E_\epsilon[\epsilon^\top J_v\epsilon]$，標「Hutchinson 估 divergence」。
  - 下方兩個標籤：綠色「$v_\theta$ 任意、表達力解除」、橘色「每個樣本來回解 ODE、步數隨訓練變多、simulation-based」。
  - 底部 mini 示意：同一團高斯經 ODE 變成漂亮的 two_moons（表達力夠），但旁邊放一個計時器／NFE 計數器圖示。

- **中間欄**：一個天平，左盤寫「表達力」、右盤寫「每步訓練成本」；左欄那代天平往「成本低、表達力低」傾，右欄那代往反向傾。天平下方一行：「**同一個交換，付在不同地方**」。

**圖說（.mdx 內）**：「**圖：normalizing flow 的交換。** 要拿精確 likelihood 當 loss，就得為 $G$ 的每一步付出可逆性與 Jacobian 的代價。第一代（coupling / autoregressive flow）付在結構上：便宜但表達力弱；第二代（Neural ODE / FFJORD）付在模擬上：任意 $v_\theta$ 但每個樣本都要來回解 ODE。」

---

## 圖 6 ｜「太多 $G$，還是自己定路徑」— 靜態 SVG

**位置**：替換 `<VizPlan id="w3-0-many-maps">` 區塊（Q2 之後、「補充」引言之前）。
**檔名**：`week-3/imgs/w3-0-6.svg`（16:9，左右兩格對照）。配色與點雲座標必須與圖 3 完全一致；W4.3 會再用這張圖。

**左格「哪一個才是 $G$？」**
- 同一對點雲（左 $\mathcal N(0,I)$ 灰、右 two_moons）。畫 **3 組不同但都合法的配對**，三種線型（實線／虛線／點線）各 6–8 條 $z\to G_i(z)$ 箭頭；三組終點都落在 moons 上，但配法明顯不同（就近配、交叉配、上半高斯全配到下 moon）。
- 標題：「把 $\mathcal N(0,I)$ 推到 $p_{\text{data}}$ 的 $G$ 有無限多個」。角落小字：「flow 用 maximum likelihood 挑一個——付結構代價，或每步模擬整條 ODE（圖 5）」。

**右格「路徑自己定」**
- 同一對點雲，每顆點只有**一條指定路徑**（從 moons 出發、逐步加噪聲彎向高斯的曲線；6–8 條）。路徑上等距 3 個中間點 $x_t$，每個旁邊一支小箭頭「該往哪走」。
- 標題：「路徑先寫好，每個中間點都有答案」。角落小字：「訓練＝在每個 $t$ 做一次回歸；不模擬、不算 likelihood；路徑一定，$G$ 就定了」。

**兩格之間**一個大箭頭，上方一行：「不讓 likelihood 挑，改成自己定」。可以在箭頭下方放一個極小的「搬倉庫」icon（兩排箱子、一張路線圖），呼應 Q2 答案的 metaphor；不要放文字說明。

**圖說（.mdx 內）**：「**圖：太多 $G$，還是自己定路徑。** 左：把噪聲推到資料的映射有無限多個，flow 靠 maximum likelihood 挑一個，代價付在結構或模擬上。右：先把每個 $x$ 到噪聲的路徑寫好，每個中間點都有『該往哪走』的答案，訓練只剩回歸。這就是 diffusion 的起點。」

---

## 順序與範圍
1. **圖 6 → 圖 5**（兩張靜態 SVG，先做；圖 6 是這篇的核心圖，先確認風格再往下）→ 圖 2 → 圖 4 → 圖 3。
2. 先寫 `w3-0-shared.js`（點雲座標、配色常數），每張圖都從它取值。
3. 只動 W3.0 這一篇與新資料夾裡的檔案；不要改元件、build 設定或其他筆記。
