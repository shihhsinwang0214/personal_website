# DMA 投影片製作規劃：U1–U7（Week 3–9）

> 依據：`week-2/dma-w2-overview.pptx`（40 張，逐張看過）、`week-3…week-9` 共 46 篇 `.zh.mdx`（逐篇讀過）、`claude/dma-notes-style-guide.md`、`claude/dma-course-notes-structure.md`。
> 產出日期 2026-09-20。放在 `site/refs/` 與 project doc `claude/dma-slides-plan-u1-u7.md` 各一份。
>
> **這份文件回答三個問題**：(1) Week 2 的投影片到底是什麼風格、什麼節奏，抽成一套可以照做的規格；(2) 一篇 `.mdx` 筆記怎麼「翻」成一段投影片——哪個元件變哪種頁面、一篇要幾張、時間怎麼配；(3) 七個單元逐週的投影片序列、要新製的圖、可沿用的 Week 2 頁、demo 與實測數字。
>
> **和 Week 2 最大的差別**：Week 2 是概覽，40 張裡只有 1 張推導頁（slide 12）。U1–U7 每週約 65–73 張，其中 10–14 張是推導頁（約 20%），每一條 `\boxed` 中心式都要有自己的一張。節奏因此從「問句 → 直覺卡片 → 結論」拉長成「問句 → 直覺卡片 → 生活例子 → 可以更嚴謹嗎（推導）→ 中心式 → 回到白話（匾額）→ demo」。

---

## 0. 怎麼用這份文件

- §1 是 **風格規格**：做任何一張之前先對照。六種版型、色彩語意、字級、節奏規則。
- §2 是 **翻譯規則**：`.mdx` 元件 → 版型的對照表；一篇筆記的標準序列；張數與時間預算。
- §3 是 **製作流程**：圖怎麼生（brief 格式）、式子怎麼渲染、demo 怎麼截、交件前檢核。
- §4 是 **七週逐週規劃**：每週一節，含時間分配表、慣例卡、每篇的投影片序列（編號＋版型＋標題＋內容＋來源）、要新製的圖、可沿用的 W2 頁、demo 數字、quiz 題。**做投影片時直接照這一節的序列走。**
- §5 是 **跨單元一致性**：貫穿比喻、conditional trick 累積表、符號衝突、toy 數字鏈。
- §6 是 **待作者決定的事**。

序列裡每張投影片的寫法：`#編號 ［版型］標題 — 內容；來源（筆記節名／式子）；圖`。版型代號見 §1.3。

---

## 1. 從 Week 2 抽出來的風格規格

### 1.1 一句話

**白底、深藍標題、圓角淡色卡片、真實照片配點雲、每張只講一件事、標題是一個問句或一句結論。** 數學不藏在附錄，而是「先用生活例子講到讀者自己會問『可以更嚴謹嗎』，再給推導」。

### 1.2 版面與字

| 項目 | 規格（自 W2 量測） |
| --- | --- |
| 尺寸 | 16:9（13.333 × 7.5 in） |
| 背景 | 白 → 極淡藍漸層（`#f7faff` 附近）；問句分隔頁用全幅插畫 |
| 標題 | 置中、單行、深藍 `#0e2f74`（深處到 `#001663`）、無襯線 CJK（思源黑體／Noto Sans TC 類）、約 36–40 pt；**標題是問句或結論句，不是名詞**（「這樣做會發生什麼問題？」「條件速度是直線的斜率；邊際速度是它的條件平均」） |
| 副標 | 橙色 `#f59e0b` 一句話強調（slide 20「可以隨人潮而動」），或深藍小字（slide 33「從任意 noise state，一步到 Clean Data」） |
| 卡片 | 圓角矩形、三種淡色底：淡藍 `#eaf4fd`、淡紫 `#f2eefd`、淡黃 `#fef6e9`；卡片標題「1. …」「2. …」深藍粗體；卡內小圖＋白底式子框＋灰字圖說 |
| 結論條 | 全寬淡藍條，左側深藍 pill 寫「重點結論」，右側粗體一句＋式子（slide 11） |
| 式子 | LaTeX 排版（Computer Modern 風），slide 12 整頁是 LaTeX；卡片內的式子放白底圓角框 |
| 標籤卡 | 「x：顧客真正出現的位置」「T(z)：你決定把店開在哪裡」——**符號第一次出現時用白色小標籤卡把角色對到符號**（slide 11 左卡） |
| 內文 | 18–20 pt；卡片圖說 14–16 pt 灰 `#5e5e5e` |
| 標點 | 全形；中英數之間留空格 |

### 1.3 六種版型（W2 每一張都能歸進其中一種）

| 代號 | 版型 | 長相 | W2 實例 | 用在 |
| --- | --- | --- | --- | --- |
| **Q** | 問句分隔頁 | 全幅插畫（少年背影望山、大問號）＋大字問句 | 2、6、9、16、21 | 每篇的 `<Ask>`、每個 `<Question>` 題幹、每一節開場的大問題 |
| **C** | 卡片資訊圖 | 2–3 張並排卡片，各「編號標題＋小圖＋式子框＋圖說」，底部可加「重點結論」條 | 5、7、8、10、11、17、19、22–27 | 一節的直覺、生活比喻、三步建構、兩種做法並排、`<Answer>` 的「直覺卡在哪／算出來／出路」 |
| **M** | 推導頁 | 白底、LaTeX 逐行、中文連接詞（令、因為、因此）當節拍、`\underbrace` 標「與 T 無關」、結論紫色 | 12 | 每個 `<Try>`、正文推導、`<Details>` 裡值得帶上課的證明 |
| **F** | 主圖頁 | 中央一張深底 `#161f28` canvas 圖（點雲藍→橙），左右各 1–2 張 icon 卡（直觀想法／意義／比喻），底部兩格式子 | 20、33、34、35 | 每篇的 iframe demo 截圖、`imgs/` 靜態圖、`\boxed` 中心式的「圖＋式」版 |
| **S** | 序列／流程頁 | 照片或 token 一排，上下兩支箭頭：橙 forward、藍 reverse | 14、30 | forward／reverse 過程、取樣程序、迴圈（reflow、PD 逐輪） |
| **T** | 表格／圖表頁 | 對照表或 log-log 圖表，極少文字 | 32、36 | 符號慣例卡、conditional trick 表、四軸總表、log-log 誤差圖、`<Remark label="符號">` |

另外兩個功能頁：**K 程式碼頁**（lab 用；等寬字、改動的那幾行高亮）與 **B 匾額頁**（整張只有一句粗體結論，用在筆記的 blockquote；一週不超過 6 張，否則失效）。

### 1.4 色彩語意（全課固定，不要換）

| 顏色 | 意思 | 來源 |
| --- | --- | --- |
| 藍 `#3b82f6` | 噪聲／起點分布 $p_0$／reverse 方向 | slide 8、14、20 |
| 橙 `#f59e0b` | 資料／目標分布／forward 方向 | slide 8、14、20 |
| 綠 `#22c55e` | 速度向量、正確答案的箭頭 | slide 20 的 $v^\star$ |
| 紫 `#7c3aed` | 最佳解、推導的結論式 | slide 11 的 $T^\star$、slide 12 的 (a.s.) |
| 紅 ✗ `#ef4444` | 行不通、寫不出來 | slide 7、22–24 |
| 深底 `#161f28` | canvas 圖背景 | slide 20 |

U4–U5 加一組：`[MASK]` 灰底 `▨`、被動過的 token 橙底（slide 30 的「遮」）。U6–U7 的 $t$ 方向切換時，**箭頭顏色跟方向走**（forward 永遠橙、往資料永遠藍），不跟 $t$ 的數值走。

### 1.5 節奏（rhythm）

Week 2 的循環（slides 9–12 最典型）：

```
Q  可以直接拿 data 和 noise 配對來學 T 嗎？          ← 大問題
C  先試試看：隨意配對，再用 MSE 學 transport map      ← 最直覺的做法，三步卡片
Q  這樣做會發生什麼問題？                             ← 學生真的會冒出來的疑問
C  把問題想成：在一條街上開店（三卡＋重點結論）        ← 生活例子，角色對符號
M  剛剛比較像是直覺，可以更嚴謹嗎？                    ← 推導，結論紫色
```

單元投影片沿用這個循環，但每一節多兩拍：

```
Q → C(直覺) → C(生活例子) → M(推導，一步一拍) → F/B(中心式或匾額，回到白話) → F(demo：看得到剛才那句話)
```

五條節奏規則：

1. **每 12–15 分鐘至少一張 Q 頁。** 讓教室重新聚焦。
2. **M 頁之後緊接一張 C 或 B。** 推完一定要用白話說它在講什麼（筆記體例：每條式子下一句白話）。連續兩張 M 只允許在 `<Try>` 成對出現時（U1.2 的兩個 Try）。
3. **M 頁一步一拍、逐行 build。** 每個等號旁用小字標機制名（Jensen／對 $x_0$ 取期望／Markov／配方／對 $x$ 微分），中間丟一個小問句（「那中括號裡是什麼？」）——先停、再出下一行。這是「先猜再驗」在投影片上的實作。
4. **每篇恰好一張「中心式」頁**（F 或 B）：筆記的 `\boxed` 或那一篇的匾額。全課 `\boxed` 約 17 條，一張都不省。
5. **一張只放一件事。** W2 slide 23–27 每張三欄（情境／要抽的東西／和一般生成差在哪）是上限；超過三欄就拆。

### 1.6 生活化例子怎麼放

W2 的做法（slide 11）是**先給場景，再貼標籤**：左卡「把問題想成：在一條街上開店」畫街道，白標籤寫「$x$：顧客真正出現的位置」「$T(z)$：你決定把店開在哪裡」；中卡把數學性質翻成場景裡的機制（「遠處的人因為平方代價拉得特別用力」）；右卡換一個條件（「$z$ 換了，最好的位置也要跟著換」）。

沿用規則（與筆記準則 §4 一致）：

- **比喻用筆記裡已經有的，不新造。** 全課比喻表見 §5.1。投影片上的比喻和筆記一字不差，學生上課聽到的和回家讀到的是同一個。
- **每個角色對到符號。** 標籤卡是必要元件，不是裝飾。
- **比喻的數字要在比喻世界裡算得出來**（視力表 E 的 $1/4$）。
- **比喻有極限就當場說**（Markov「不是過去不重要，而是過去已經濃縮在現在」）。
- **真實照片優先**（W2 的狗、貓照片）；點雲用兩團色（藍→橙）；序列用一排等寬圓角方塊。

### 1.7 數學符號怎麼介紹

- **符號在第一次用到的那張才出現，用標籤卡對到角色**（不集中在前面當定義區）。
- **期望值一定寫清楚對誰取**：W2 slide 12 寫 $\mathbb E_Z[\mathbb E_X[\cdot]]$、slide 11 寫 $\mathbb E[(T(z)-x)^2\mid z]$。單元投影片沿用，$\arg\min_f\mathbb E\|f(X)-Y\|^2=\mathbb E[Y\mid X]$ 這類式子用 `\underbrace` 標「對聯合分布取／對給定 $X$ 的條件分布取」。
- **符號預算**：一個單元一組符號，由該單元第一篇建立；每週開場有一張 T 頁「慣例卡」，之後每篇重提只放小角標。換方向、換字母的地方（U2、U3、U6、U7 開頭；U5 的 $Q/R$、$u$、$\sigma$）**必放一張對照表**，內容照筆記的 `<Remark label="符號">`。
- **英文術語保留原文**（Gaussian、affine、closed form、score、posterior、coupling、rate…），第一次出現給全形括號對照。不寫「高斯」「仿射」「週」。
- **用語禁區與筆記相同**：不用「值得…」指示讀者、不用「免費」、不宣稱「唯一」（數學敘述除外）、不命令讀者、不寫「先說清楚／總結一下」。標題語氣可以口語（W2「很慢ㄟ」「酷酷的東東」），但只在 Q 頁。

---

## 2. 從 `.mdx` 到投影片的翻譯規則

### 2.1 元件 → 版型對照表

| 筆記元件 | 版型 | 怎麼翻 |
| --- | --- | --- |
| frontmatter `title` | 篇的第一張 Q 或 C | 篇名本來就是問句／目的句，直接當標題 |
| `<Objectives>` | **不做成投影片** | 三條目標寫進講者備忘；上課不念目標 |
| `<Ask>` | Q | 問句原文；多問句時 `<br />` 分行；下一張若不馬上回答，加一行小字指路 |
| `## 節標題` | C 的標題 | 節標題已是問句或目的，照用；標題不提前洩底 |
| 正文段落 | C 的卡片內容 | 一節 → 1–2 張 C；每卡一件事；粗體結論句 → 卡片圖說的粗體 |
| 生活比喻 | C（三卡：場景／機制／換條件） | 角色→符號標籤卡必放 |
| display 式子 | C 內白框；`\boxed` → F 或 B | 式子下一行白話；`\boxed` 一張獨立 |
| `<Try>`、正文推導、帶上課的 `<Details>` 證明 | M | 一步一拍、機制名、小問句、結論紫色；summary 那句問句當 M 頁標題 |
| `<Question id>` 題幹 | Q | 題幹裡「學生真的會想到的做法」放大字；「這樣會發生什麼事？」當副標 |
| `<Answer>` | C（或 C＋M） | 三卡固定順序：直覺卡在哪 → 算出來（若有算式另開 M）→ 結構與出路 |
| blockquote 匾額 | B，或 C 底部「重點結論」條 | 只放粗體那一句；一週 B 頁 ≤ 6 |
| `<Remark label="符號">` | T | 對照表；換方向處必放 |
| `<Remark>` 補充、`<Details>` 旁支 | 附錄頁（放在該週 deck 最後），或講者備忘 | 主線不放 |
| `<iframe>` demo | F | 截圖＋「操作什麼、會看到什麼」＋ `.stats` 實測數字；上課現場開瀏覽器（頁面放 QR／短網址） |
| `![…](./imgs/…)` | F 或 C 內圖 | 直接用（U1 有 png；U2–U5 每篇一張 png；U6–U7 有 svg） |
| `<QuizBlock>` | 課末 T（每題一張，選項四個） | 3–4 題；正解位置輪換；解答不指涉位置 |
| `<Bridge>` | 週末一張 C（W2 slide 28「共同缺口」型） | 兩到三句；指向下一週 |
| lab 篇 | K（程式）＋F（圖 a/b/c）＋Q（lab 的 `<Question>`） | 程式碼只放「改了哪幾行」，高亮；圖用「先寫下你的猜測」留白版再出答案版 |
| `## 作業` | 週末一張 T | 題號＋一句話；截止日 |

### 2.2 一篇理論筆記的標準序列（8–14 張）

```
1  Q   <Ask>（或篇名問句）
2  C   回指上一篇的結論 → 這一篇想要什麼（意圖）
3  C   第一節：直覺／生活比喻（標籤卡對符號）
4  Q   <Question> 題幹：學生真的會想到的做法
5  C   <Answer>：直覺卡在哪／算出來／出路（三卡）
6  M   推導一（<Try> 或正文），一步一拍
7  F/B 中心式（\boxed）或匾額：回到白話
8  C   下一節的機制（式子＋白話）
9  M   推導二（若有）
10 F   demo 截圖＋實測數字
11 C   代價／限制／伏筆（只講後面也成立的話）
12 T   符號卡（若本篇有 <Remark label="符號">）
```

lab 篇：設定 1 張、每個步驟「K 程式 → F 猜測留白 → F 答案圖」、lab 的 Q＋Answer 各 1 張、作業 1 張，共 7–9 張。

### 2.3 張數與時間預算

課程時間 09:30–12:00，中間休息 10 分鐘，**授課 140 分鐘**。

| 區塊 | 分鐘 | 張數 |
| --- | --- | --- |
| 開場（封面、上週回顧＋本週地圖、慣例卡） | 5 | 3 |
| 理論篇 ×5–6 | 105–110 | 50–58 |
| lab 篇 | 15–20 | 7–9 |
| quiz ＋ Bridge ＋ 叮嚀 | 8–10 | 4–5 |
| **合計** | **140** | **64–75** |

平均 2 分鐘一張。M 頁 3–4 分鐘、Q 頁 30 秒、C 頁 1.5–2 分鐘、F demo 頁 3 分鐘（現場操作）。各週的實際分配見 §4 每節開頭的表。

七週合計約 **480 張**主線。各週估計：U1 72、U2 68、U3 73、U4 64、U5 68、U6 71、U7 70。

### 2.4 硬規則（做投影片時不得違反）

1. **式子與符號照筆記**：時間方向、字母、下標一律與該篇 `.mdx` 相同（U1、U4–U6 用 $t=0$ 資料；U2–U3、U7 用 FM 方向；U5 $R_t$ rate、$Q_t$ transition）。
2. **每條被當結論用的式子，投影片上要看得到它怎麼來**（M 頁或至少一行「由 … 得到」）。不放「可以證明」「整理之後就得到」。
3. **demo 的敘述不超過 demo 真的能顯示的**；引用數字前確認是量出來的（筆記 `.stats`／圖說）還是「預期：」底下的。§4 列的數字全部是筆記圖說裡的實測值。
4. **不用「值得看清楚」「值得停一下」；不用「免費」形容手上的東西；不宣稱「唯一」；不命令讀者**（筆記準則 §2）。
5. **比喻不新造、不換**（§5.1）。
6. **符號經濟**：不為了式子好看命名中間量；不把 $\bar\alpha_t,\sigma_t$ 縮成 $a,\sigma$。
7. **準確性紅線**（筆記準則 §9）逐條適用，投影片版最常踩的六條：density ≠ 機率；$\epsilon$ 是總噪聲不是 $\epsilon_t$；$x_T$ 只是接近 $\mathcal N(0,I)$；「邊際相同」是連續時間敘述，DDPM vs DDIM 判準是模型誤差 vs 離散化誤差；離散 $\bar\alpha_t$ 是機率不是振幅；conditional trick 引用時一律指向 U1.2 並寫英文術語，不用序數計數。
8. **W2 slide 13 撲克牌圖有錯（花色與數字沒維持）**，slide 40 已自嘲。U1.1 重用時必須重製。

---

## 3. 製作流程與工具

### 3.1 建議的檔案與流程

W2 的做法是整張投影片連文字一起用生圖模型畫出來（slide 40 聲明「與 ChatGPT＋Claude 協作」）。它的優點是視覺統一，代價是**文字與式子會錯**（撲克牌那張）。U1–U7 式子多了十倍，建議改成**圖歸圖、字歸字**：

1. **插畫只生「無文字」的圖**（場景、點雲、照片級物件、icon），brief 明寫「不要在圖中放任何文字或符號」。
2. **文字、標籤卡、式子在 PowerPoint 裡疊上去**。式子用 LaTeX 渲染成 SVG／高解析 PNG 貼入（保持 slide 12 的 Computer Modern 風格，也和網站 KaTeX 一致），或直接用 PowerPoint 方程式（Cambria Math）——兩者選一，整套一致（§6 待決）。
3. **demo 截圖**：容器裡 Playwright 載 `public/notes/research_areas/diffusion-models-applications/*.html`，亮色主題、操作到筆記圖說描述的那個狀態、`fullPage` 截圖；每張 F 頁附 `.stats` 的數字與操作說明。
4. **每週一個 .pptx**：`week-N/dma-uK-<topic>.pptx`，與 `dma-w2-overview.pptx` 並列；圖片壓縮到 1920 寬（W2 檔 58 MB，可再小）。
5. **講者備忘**放三樣東西：該篇 `<Objectives>` 三條、`<Answer>` 的完整結構、demo 的操作步驄。

### 3.2 圖像 brief 的格式（沿用 `claude/dma-wN-image-briefs.md` 的寫法）

```
檔名：u1-2-eyechart.png
用在：U1.2 #12（Q3 答案卡，右卡）
版面：16:9 卡片內圖，主體居中，留白 20%
畫什麼：視力檢查表上的一個大 E，三個版本並排——清晰、略糊、糊到只剩輪廓；
       糊的那個旁邊有四個灰色箭頭（上下左右）表示 1/4 盲猜。
不要：任何文字、數字、公式；不要人物。
風格：W2 卡片內插圖風（扁平、柔和陰影、淡藍背景）；主色橙（資料）、灰（不確定）。
對到符號：清晰＝t 小、只剩輪廓＝t 大、四個箭頭＝所有可能的平均。
```

每週要新製的圖列在 §4 各節末尾的「新製圖」。**優先順序**：先做每篇的中心式頁與生活比喻卡的圖，demo 截圖與 `imgs/` 既有圖零成本。

### 3.3 交件前檢核（每週一次）

- [ ] 每篇有且只有一張中心式（F/B）？每條 `\boxed` 都有？
- [ ] 每張 M 之後接 C 或 B？沒有連續三張 M？
- [ ] 每 15 分鐘有一張 Q？
- [ ] 符號慣例卡在開場，換方向處有對照表？
- [ ] 每個生活比喻有標籤卡對符號？比喻與筆記一致（§5.1）？
- [ ] demo 頁的數字對得上筆記圖說？
- [ ] grep 講稿與投影片文字：「值得」（指示動作）、「免費」、「唯一」（修辭）、「高斯」、「仿射」、「週」→ 0。
- [ ] 期望值有寫對誰取？
- [ ] quiz 正解位置輪換、解答不指涉位置？
- [ ] 每張圖片內沒有生成模型生出來的文字或錯式子（撲克牌教訓）？
- [ ] 張數落在 64–75？時間表加起來 140 分鐘？

---

## 4. 七週逐週規劃

寫法提醒：`#編號 ［版型］標題 — 內容；來源；圖`。「來源」寫筆記的節名或式子；「W2 #n」表示沿用 Week 2 第 n 張（可直接複製或重製同款）。每篇末尾的「絕不能省」是時間不夠時的底線。

---

### 4.1 Week 3 · U1 Diffusion Models（6 篇，約 72 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 5 | 3 |
| U1.0 生成到底在學什麼？ | 15 | 8 |
| U1.1 指定路徑的方法：Forward Process | 18 | 10 |
| U1.2 Denoising：倒著走一步，要怎麼學？ | 35 | 16 |
| U1.3 Tweedie 公式 | 22 | 11 |
| U1.4 反向：DDPM、DDIM 與 SDE/ODE | 25 | 13 |
| U1.5 實作：建立這個單元的 Toy | 15 | 8 |
| quiz＋Bridge＋叮嚀 | 5 | 3 |

**慣例卡（開場 #3）**：$t=0$ 資料、$t=T$ 噪聲；$x_0\sim p_{\text{data}}$、$x_t$、$x_T\approx\mathcal N(0,I)$；forward 用 $q(\cdot\mid\cdot)$、邊際用 $p_t$；符號四件組 $\alpha_t=1-\beta_t$、$\bar\alpha_t=\prod\alpha_s$、$\sigma_t^2=1-\bar\alpha_t$、$\mathrm{SNR}(t)=\bar\alpha_t/(1-\bar\alpha_t)$ 在 U1.1 #7 才展開，開場只放時間方向與「我們要學一個 $G$ 把 $\mathcal N(0,I)$ 搬成 $p_{\text{data}}$」。

**U1.0 生成到底在學什麼？**（W2 slides 3–12 已快速走過 $p(x)$、transport map、MSE→平均；這一篇是回顧＋補三件新東西：$Z_\theta$ 的梯度、波紋反例、normalizing flow 的代價。）

1. ［Q］什麼叫做「生」出一張圖片？什麼又叫做「看起來像是來自同一批資料」？ — `<Ask>` 原文；W2 #3 底圖
2. ［C］五萬個點 vs 看不見的地形 — 地形卡（俯視 clusters／側視 density）＋「生成＝從 $p_{\text{data}}$ 再抽一點」重點結論條；來源〈「生」一張圖片〉；W2 #5 直接沿用＋`imgs/w-3-0-2.png`
3. ［Q］拿一個 $p_\theta(x)$ 逼近 $p_{\text{data}}$，訓好再抽樣不就好了？這條路卡在哪？ — Q1 題幹
4. ［C］Q1 答案三卡 — 左：EBM $p_\theta=e^{-E_\theta}/Z_\theta$；中：$\nabla_\theta\log p_\theta=-\nabla_\theta E_\theta+\mathbb E_{x'\sim p_\theta}[\nabla_\theta E_\theta(x')]$，圖說「訓練先要求會從 $p_\theta$ 抽樣」；右：Langevin $x_{k+1}=x_k+\frac\eta2\nabla_x\log p_\theta+\sqrt\eta\,\epsilon_k$「取樣只要 score」；結論條「密度學得近，不代表 score 也近」
5. ［M］密度差 2%，坡度差 10 — 波紋反例：$\tilde p=p\,e^{0.01\sin(1000x)}$ → 密度比在 $e^{\pm0.02}$；對 $x$ 微分得 $0.01\times1000\cos(1000x)$，振幅 10；結論紫色「取樣用的是坡度」；新製圖：平緩地形上的細波紋（側視）
6. ［C］換一個角度：找一台加工機器 — 原料 $z\sim\mathcal N(0,I)$／機器 $G$／成品 $x=G(z)$；pushforward 標籤卡 $(G_\#p_z)(A)=p_z(G^{-1}(A))$；目標一行「找 $G$ 使 $G_\#\mathcal N(0,I)=p_{\text{data}}$」；W2 #8 沿用
7. ［C］Q2：直接對 $L_2$ 會怎樣？ — W2 #10–12 濃縮成一張：三卡「隨意配對／開店的重心／$Z\perp X\Rightarrow T^\star\equiv\mathbb E[X]$」；結論條「沒配對的 $L_2$ 塌成一張平均圖」；W2 #11 圖沿用
8. ［C］第一種答案：Normalizing Flow，付的是什麼 — 左卡 change of variables $\log p_\theta(x)=\log p_z(G^{-1}(x))+\log|\det\partial G^{-1}|$；中卡 maximum likelihood ＝ 下注的人（籌碌總額 $\int p_\theta=1$）；右卡梯度兩項「倒推」「log-det」各自貴（$O(d^3)$）；匾額條「要拿到精確 likelihood，就得為每一步付可逆性與 Jacobian 的代價」；新製圖：可逆管線＋三角 Jacobian 示意（無文字）
9. ［F］其實有無限多個 $G$ — demo `w3-0-many-maps` 截圖（按「換一組配對」兩端不變、中間與路徑變）；右卡 Q3 搬倉庫（A 倉庫→$\mathcal N(0,I)$、B 倉庫擺法→$p_{\text{data}}$、先寫好每箱路線→自己定路徑）；底部匾額「不要一步到位，也不要讓 likelihood 自己挑路」

（#2 與 #7 已在 W2 講過，各 1 分鐘帶過；本篇實際 8 張含 #9 併入 #8 的話。）絕不能省：#2、#4、#5、#7、#9。

**U1.1 指定路徑的方法：Forward Process**

1. ［Q］噪聲→圖不會走；圖→噪聲我們會走 — 標題「有一個方向，我們知道怎麼走」；W2 #13 撲克牌（**重製**：花色數字要維持；洗牌一千次容易、一次排回來難、倒回最後一次洗牌不難）
2. ［S］加噪的階梯 — `imgs/w-3-1-1.png` 七格貓 $t=0\to1000$，橙箭頭「forward：加一點點噪聲——我們本來就會做」；記號 $x_0,x_t,x_T,T$ 標籤卡；W2 #14 同款
3. ［Q］三問 — 「這條路的另一端，真的會走到純 noise 嗎？／走到時間 $t$ 時 $x_t$ 長什麼樣？／想倒著走一步，需要知道什麼？」；小字指路：前兩問這一篇答，第三問等到 U1.2
4. ［C］我們希望 forward process 替我們做到什麼 — 左卡兩個要求（終點是會抽的分布；$q(x_t\mid x_0)$ 算得出、最好是 Gaussian，「而且最好不用真的一步一步走」）；右卡台大→屏東：兩條路線（西部／東部）**都收在屏東**，$q(x_1\mid x_0)$＝第一步到台中的可能性、$q(x_t\mid x_0)$＝走 $t$ 段後在某城市的可能性「不管中間怎麼走」；式子 $q(x_t\mid x_0)=\int q(x_1,\dots,x_t\mid x_0)\,dx_1\cdots dx_{t-1}$ 圖說「所有中間路線全部加總——看起來很麻煩」；新製圖：台灣地圖兩條路線收在同一終點（無文字）
5. ［C］第一個設計：下一步只看現在 — 左卡 Markov $q(x_t\mid x_{t-1},\dots,x_0)=q(x_t\mid x_{t-1})$；中卡考試分發比喻（規則只讀成績單，不讀三年歷程；限定「分發」）＋極限句「不是過去不重要，而是過去該留下的都濃縮在現在」；右卡乘積 $q(x_1..x_t\mid x_0)=\prod q(x_s\mid x_{s-1})$；匾額條「路拆得開，不代表我們就會積分」
6. ［C］第二個設計：Linear ＋ Gaussian — $q(x_t\mid x_{t-1})=\mathcal N(\sqrt{1-\beta_t}\,x_{t-1},\beta_tI)$ ⇔ $x_t=\sqrt{1-\beta_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t$；中卡「為什麼乘 $\sqrt{1-\beta_t}$」：$\mathrm{Var}(x_t)=(1-\beta_t)I+\beta_tI=I$（variance-preserving，對照 VE 會爆）；右卡「為什麼 $\beta_t$ 小」：每步只做一件簡單的事（切碎）；W2 #14 下方式子同款
7. ［T］符號四件組 — $\alpha_t$「這一步留下多少信號」／$\bar\alpha_t$「累積留下多少」／$\sigma_t^2=1-\bar\alpha_t$／$\mathrm{SNR}(t)$／schedule（linear、cosine）「定了就定路的速度」；來源 `<Remark label="符號">`
8. ［Q］訓練要很多組 $(x_0,x_t)$，$t$ 可能是 800——每抽一個樣本遞迴 800 次？有沒有辦法一步跳到 $x_t$？ — Q1 題幹；上方先把遞迴 $t$ 行列出來（先具體再提問）
9. ［M］真的要跑 $t$ 次嗎？ — 一步一拍：代入 $x_{t-1}$ 展開兩步（代換）→ 後兩項是兩個獨立 Gaussian（Gaussian 封閉性：變異數相加 $\alpha_t(1-\alpha_{t-1})+(1-\alpha_t)=1-\alpha_t\alpha_{t-1}$）→ 小問句「係數平方和又是 1，巧合嗎？」→ 歸納到 $t$ 步；結論紫色 $\boxed{q(x_t\mid x_0)=\mathcal N(\sqrt{\bar\alpha_t}x_0,(1-\bar\alpha_t)I)}$
10. ［F］中心式＋demo — 大字 $x_t=\sqrt{\bar\alpha_t}\,x_0+\sigma_t\,\epsilon$；三張標籤卡「$\epsilon$ 是把前 $t$ 步噪聲合併後重新命名的單一 $\mathcal N(0,I)$，與 $x_0$ 獨立——不是任何一步的 $\epsilon_t$」「取一個訓練樣本只要：抽 $t$、抽 $\epsilon$、算一次乘法與加法」「$\bar\alpha_T\approx0$ 且 $1-\bar\alpha_T\to1$ 才走到 noise（prior mismatch）」；右側 demo `w3-1-forward` 截圖（linear vs cosine：兩端一樣、中間速度不同）；伏筆小字「$(\sqrt{\bar\alpha_t},\sqrt{1-\bar\alpha_t})$ 是插值，平方和＝1 是 VP 的限制，U2 會放開」

絕不能省：#1、#6、#7、#9、#10。

**U1.2 Denoising：倒著走一步，要怎麼學？**（本週最重，兩個 `<Try>` 都上）

1. ［Q］倒著走一步，如何從 $q(x_{t-1}\mid x_t)$ 抽樣？ — 副標「為什麼是一個分布，不是一個答案」；右下小卡：屏東的前一站是高雄或台東，照機率抽一個
2. ［Q］最直覺的想法：反解 $\epsilon_t$ — 「$x_{t-1}=(x_t-\sqrt{\beta_t}\epsilon_t)/\sqrt{\alpha_t}$，抽一個 $\epsilon_t$ 代進去不就好了？」Q1 題幹
3. ［M］這樣為什麼不行 — $\mathrm{Cov}(\epsilon_t,x_t)=\mathrm{Cov}(\epsilon_t,\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t)=\sqrt{\beta_t}I\neq0$（Cov 線性＋$\epsilon_t\perp x_{t-1}$）；白話卡：洗牌只看到洗完的樣子，「有幾張還連在一起」已透露那一次怎麼洗；結論「一旦看到 $x_t$，$\epsilon_t$ 不能重抽」
4. ［C］改用 Bayes，卡在兩個邊際 — $q(x_{t-1}\mid x_t)=\dfrac{q(x_t\mid x_{t-1})\,p_{t-1}(x_{t-1})}{p_t(x_t)}$；分子會算（forward 設計的）；分母兩個邊際要知道整個 $p_{\text{data}}$；標籤卡定義 **不可算（intractable）**「式子寫得出、實際算不出」與 **$p_t$**（加噪 $t$ 步後的邊際）
5. ［C］算不出來，那用學的：$\mathcal J(\theta)=\mathbb E_{p_t}[D_{\mathrm{KL}}(q(x_{t-1}\mid x_t)\,\|\,p_\theta(x_{t-1}\mid x_t))]$ — 白話「讓網路的一步跟真實的一步一樣」；但 target $q(x_{t-1}\mid x_t)$ 還在裡面
6. ［Q］卡住的時候，先盤點手上有什麼：forward process 給了我們什麼？ — Q2 題幹；這一張是方法論頁（作者 style：走到死路先教方法論再示範）；答案大字「$x_0$」——「我們其實不是只有 $x_t$，還有創造它的 $(x_0,\epsilon,t)$」
7. ［C］訓練的時候，我們其實多知道一件事 — $\widetilde{\mathcal J}(\theta)=\mathbb E_{x_0}\mathbb E_{q(x_t\mid x_0)}[D_{\mathrm{KL}}(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t))]$；標籤「target 看得到 $x_0$，模型看不到——像作弊？」；右卡直覺：模型分不出這筆是哪張 $x_0$，只能用一個答案應付全部，按頻率平均；紫色一句「是。而且這裡不是 approximation」
8. ［M］先用一個國中 toy 看「對多個目標平均」vs「對平均目標」 — $\tfrac13[(x-a_1)^2+(x-a_2)^2+(x-a_3)^2]=(x-\bar a)^2+\underbrace{\tfrac13\sum(a_i-\bar a)^2}_{\text{不含 }x}$，配方寫出常數給人看；「KL 有類似的性質（不是等同）」
9. ［M］自己實際推一次：為什麼 $\widetilde{\mathcal J}=\mathcal J+C$？ — Try 1 六拍：KL 展開為熵−交叉熵 → 熵無 $\theta$ → 對 $p(x_0\mid x_t)$ 取期望 → 交換積分順序（$\log p_\theta$ 不依賴 $x_0$）→ marginalization $\int q(x_{t-1}\mid x_t,x_0)p(x_0\mid x_t)dx_0=q(x_{t-1}\mid x_t)$ → 只差熵常數；結論紫色：同一個最佳解；**命名 conditional trick**（本課共用名字，之後每個單元回來加一列）
10. ［M］把 $q(x_{t-1}\mid x_t,x_0)$ 算出來 — Bayes＋Markov 三項全是 forward 設計的 Gaussian；匾額先問「配出來的 Gaussian，變異數會跟 $x_0$ 有關嗎？」（先猜）→ Try 2 配方五拍：留含 $x_{t-1}$ 的兩個密度 → 二次式 → 收 $A=\frac{\alpha_t}{\beta_t}+\frac1{1-\bar\alpha_{t-1}}$、$b$ → $\tilde\beta_t=1/A$、$\tilde\mu_t=b/A$ → 用 $\alpha_t\bar\alpha_{t-1}=\bar\alpha_t$ 化簡；紫色 $\tilde\mu_t=\frac{\sqrt{\bar\alpha_{t-1}}\beta_t}{1-\bar\alpha_t}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t,\ \tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t$；白話「平均是 $x_0,x_t$ 的加權平均（一邊拉向起點、一邊留在原地）；變異數只是 schedule 的數字——答案：不會」
11. ［C］DDPM 的訓練 — 三卡：$p_\theta=\mathcal N(\tilde\mu_t(x_t,\hat x_\theta),\tilde\beta_tI)$「變異數照抄、平均照抄形狀、缺的 $x_0$ 換網路輸出」／同變異數 Gaussian 的 KL 只剩兩平均的距離 $\frac1{2\tilde\beta_t}\|\tilde\mu_t(x_t,x_0)-\tilde\mu_t(x_t,\hat x_\theta)\|^2$／affine → $\widetilde{\mathcal J}=\mathbb E_{t,x_0,\epsilon}[w(t)\|\hat x_\theta(x_t,t)-x_0\|^2]$；結論條「路徑自定，每一步變回歸——指的就是這一行」；註記：這一篇的取捨只有一個：把 $p_\theta$ 限制成固定變異數 Gaussian（不是離散化）
12. ［Q］$L_2$ 不是才剛被我們否決過嗎？為什麼這一次它就可以了？ — `<Ask>`＋Q3 題幹
13. ［C］這次有配對 — 左卡 W2 #11 開店重用（配對＝情報 $z$）；中卡 $\hat x^\star(x_t,t)=\mathbb E[x_0\mid x_t]$，匾額「上一次最佳解是一個常數，這一次是一個取決於當下 state $x_t$ 的函數」；右卡視力表 E：清楚時直接說開口朝哪、糊到只剩輪廓只能在四個方向 $1/4$ 盲猜——「$t$ 大時 $\hat x_0$ 模糊是**正確答案**，不是學壞」；註「$w(t)$ 不影響每個 $t$ 的最佳解」；新製圖：視力表 E 三版本（見 §3.2 範例）
14. ［F］同一個 $x_t$ 可以來自很多張圖 — `imgs/w-3-2-1.png`（上排 $t$ 小只一張亮、下排 $t$ 大五張連到同一 $x_t$）＋ demo `w3-2-posterior` 截圖（點一個 $x_t$、拖 $t$：小 $t$ 一兩個點亮、箭頭原地；大 $t$ 整批亮、箭頭指向平均）
15. ［C］學完之後，怎麼真的走回去？＋憑什麼保證好？ — 左卡取樣一行 $x_{t-1}=\tilde\mu_t(x_t,\hat x_\theta(x_t,t))+\sqrt{\tilde\beta_t}z$，從 $x_T\sim\mathcal N(0,I)$ 重複到 $x_0$；右卡三拍鏈（Jensen→ELBO；path KL；Markov 拆逐步 KL）→ 匾額 $\boxed{\text{regression loss}\to\text{reverse-step KL}\to\text{path KL}\to-\log p_\theta(x_0)\text{ 的上界}}$；三個伏筆小字「Gaussian 族多好？noise 一定要加？步切細會怎樣？→ U1.4」
16. ［C］同一個 reverse step，不一定要學 $x_0$；表示上等價，但訓練上不相同 — 左卡 $x_0\leftrightarrow\epsilon$ 互換、$v=\sqrt{\bar\alpha_t}\epsilon-\sigma_tx_0$（角度圖 $\cos\phi_t,\sin\phi_t$，$v$ 是垂直座標）；中卡 $\|\hat x_0-x_0\|^2=\frac1{\mathrm{SNR}(t)}\|\epsilon_\theta-\epsilon\|^2$「換 target 等於換權重」、$\boxed{\text{representation equivalent}\neq\text{optimization equivalent}}$；右卡 $\mathcal L_{\text{simple}}$ 五行 pseudo-code＋匾額「forward process 決定我們怎麼製造不同 noise level 的資料；weighting 決定 training 時多重視哪些 noise level」；預告「loss 會停在非零——U1.3」；新製圖：$(x_0,\epsilon)$ 平面上 $x_t$ 與 $v$ 垂直（無文字）

絕不能省：#4、#9、#10、#11＋#13、#16。

**U1.3 Tweedie 公式：Denoiser 和 Data Distribution 有什麼關係？**

1. ［Q］一個看起來只是做 denoising regression 的 neural network，到底學到了多少關於 data distribution 的資訊？ — `<Ask>`；副標「ELBO 解釋的是 weighted 版，實際訓的是 $\mathcal L_{\text{simple}}$，而它從頭到尾沒寫出 $p_{\text{data}}$」
2. ［C］先固定一個 $t$ — $\mathcal L_{\text{simple}}=\mathbb E_t\underbrace{\mathbb E_{x_0,\epsilon}\|\epsilon_\theta(x_t,t)-\epsilon\|^2}_{\text{每一個 }t\text{ 自己的一項}}$：一堆互不干擾的小問題；加權只是常數，可以先放下
3. ［C］MSE 的最佳解是條件期望 — W2 #11 開店三卡重用；式子 $\arg\min_f\underbrace{\mathbb E_{(X,Y)}\|f(X)-Y\|^2}_{\text{對聯合分布取}}=\underbrace{\mathbb E[Y\mid X]}_{\text{對給定 }X\text{ 的條件分布取}}$；白話「左邊得到一個數值、右邊得到一個隨給定的 $X$ 改變的函數 $f(X)$」；「最好的位置不是人最多的那一點，而是重心」（擋掉 mean／mode 混淆）
4. ［C］所以 $\epsilon_\theta\to\mathbb E[\epsilon\mid x_t]$ — 中卡 $x_0$ 版 $\mathbb E[x_0\mid x_t]=\frac{x_t-\sigma_t\mathbb E[\epsilon\mid x_t]}{\sqrt{\bar\alpha_t}}$（affine＋期望線性，不用 Gaussian）；右卡 Remark：loss 地板 $\min_\theta\mathcal L=\mathbb E_{t,x_t}[\mathrm{tr}\,\mathrm{Var}(\epsilon\mid x_t)]$「停住的高度＝看到 $x_t$ 後 $\epsilon$ 剩多少不確定性」；註「conditional trick 的 MSE 版本」
5. ［B］這個 posterior mean 跟整個分布有什麼關係？ — 定義 $p_t(x_t)=\int q(x_t\mid x_0)\,p_{\text{data}}(x_0)\,dx_0$（也是 U1.2 Bayes 的分母）；匾額問句「$\mathbb E[\epsilon\mid x_t]$ 和 $p_t(x_t)$ 有什麼關係嗎？」
6. ［M］對 $x_t$ 微分看看 — 五拍：$p_t=\int\mathcal N(x_t;\sqrt{\bar\alpha_t}x_0,\sigma_t^2I)p_{\text{data}}dx_0$ → 對 $x_t$ 微分穿進積分，只有 Gaussian 被微分：$-\frac{x_t-\sqrt{\bar\alpha_t}x_0}{\sigma_t^2}\times$ 自身 → 兩邊除以 $p_t$，左邊變 $\nabla\log p_t$ → 小問句「右邊被積函數的比值是誰？」→ 按 Bayes 正好是 $p(x_0\mid x_t)$ → 認出 $\frac{x_t-\sqrt{\bar\alpha_t}x_0}{\sigma_t}=\epsilon$；結論紫色
7. ［F］中心式 — 大字 $\boxed{\nabla_{x_t}\log p_t(x_t)=-\dfrac{\mathbb E[\epsilon\mid x_t]}{\sigma_t}}$；標籤卡：$x_0$ 版 $\mathbb E[x_0\mid x_t]=\frac{x_t+\sigma_t^2\nabla\log p_t}{\sqrt{\bar\alpha_t}}$、$s_\theta(x_t,t):=-\epsilon_\theta/\sigma_t$；匾額「訓好的 denoiser 就是 $p_t$ 的 score function」
8. ［F］廣場 — `imgs/w-3-3-2.png`：廣場上的人群，$t$ 是聚集進行到哪裡，站在 $x_t$ 看周遭的人平均往哪去＝人變密的方向；右卡「density 要從空中數整個廣場（連空角落）；score 站原地看左右」；式子 $\underbrace{\sqrt{\bar\alpha_t}\mathbb E[x_0\mid x_t]-x_t}_{\text{denoising 的方向}}=\sigma_t^2\nabla\log p_t(x_t)$
9. ［F］同一個方向，但 $t$ 太大時 $\hat x_0$ 會退化 — `imgs/w-3-3-1.png`（左：兩支重疊箭頭差 $\sigma_t^2$；右：$t=100,500,900$ 從清楚貓到平均臉）；小字「公式沒有變壞，是 $x_t$ 裡的資訊變少了」；$t$ 大 score $\approx-x$、$t$ 小指最近的團
10. ［Q＋C］為什麼學 score，而不是直接學 density？ — Q1 題幹「訓一個網路表示 $p_t$，然後對它微分，會走到哪裡？」→ 答案三卡：走回那面牆（$Z_\theta$；「我們想做的事變成做這件事的前提」）／$\nabla_x\log p_\theta=\nabla_x\log\tilde p_\theta-\underbrace{\nabla_x\log Z_\theta}_{=0}$「score 對 normalizing constant 免疫」／Remark「繞過≠解決：代價是拿不到 likelihood」
11. ［F］這個 score field 長什麼樣？ — demo `w3-3-score` 截圖（箭頭＝網格上的 $\nabla\log p_t$；切「denoising 方向」方向完全一樣只差 $\sigma_t^2$；$t$ 拉大整片指向原點）

絕不能省：#3、#6、#7、#8、#10。

**U1.4 反向：DDPM、DDIM 與 SDE/ODE**

1. ［Q］訓練時我們把路切成一千小步；生成時，可以自己決定走幾步、每一步走多遠嗎？ — `<Ask>`
2. ［Q］$\hat x_0$ 已經是後驄平均了，代進去抽出來的 $x_{t-1}$ 平均也會是對的——還有什麼好擔心的？這個推理對嗎？ — Q1 題幹；上方先寫「真實的 $q(x_{t-1}\mid x_t)=\int q(x_{t-1}\mid x_t,x_0)p(x_0\mid x_t)dx_0$ 是混合 Gaussian，取樣器只抽一個 Gaussian」
3. ［M］算帳 — law of total variance：$\mathbb E[x_{t-1}\mid x_t]=\tilde\mu_t(x_t,\mathbb E[x_0\mid x_t])$（affine，精確）；$\mathrm{Var}[x_{t-1}\mid x_t]=\tilde\beta_tI+c_0^2\,\mathrm{Var}[x_0\mid x_t]$，$c_0=\frac{\sqrt{\bar\alpha_{t-1}}\beta_t}{1-\bar\alpha_t}\propto\beta_t$ → 丟掉／保留 $=O(\beta_t)$；表格（linear schedule）17%（t=10）、3.7%、1.8%、0.4%、0.09%、<0.01%；匾額「平均值是精確的；錯的只有變異數，而那個錯是 $O(\beta_t)$」；白話「這就是『把一件難事切成很多小步』真正的數學內容」
4. ［C］DDPM：扣掉一點，再抖一下 — $x_{t-1}=\frac1{\sqrt{\alpha_t}}\Big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta(x_t,t)\Big)+\sqrt{\tilde\beta_t}z$；右卡「為什麼又加噪」：廣場——每個人只朝周遭平均走，附近的人看到同一方向會疊到同一點（塌）；加回噪聲＝走完再隨機挪一下，回到 $p_{t-1}$ 該有的寬度；註「朝平均走會塌 ≠ 確定性會塌（下一張）」；新製圖：廣場人群朝平均走疊成一點 vs 挪開（無文字）
5. ［C］DDIM：同一個網路，完全不加噪聲 — 左卡構造：每個 $x_s$ 都能由 $(x_0,\epsilon)$ 直接寫出 $x_s=\sqrt{\bar\alpha_s}x_0+\sigma_s\epsilon$ → 把估計代進去 $x_s=\sqrt{\bar\alpha_s}\hat x_0+\sigma_s\epsilon_\theta(x_t,t)$「是構造，不是相信」；中卡兩性質：完全確定、可跳步（$s$ 不必是 $t-1$）；匾額「走幾步、每一步走多遠，是取樣時才決定的事，和訓練無關」
6. ［T＋M］一般式與 $\eta$ — `<Remark label="符號">`：$x_s=\sqrt{\bar\alpha_s}\hat x_0+\sqrt{1-\bar\alpha_s-\tilde\sigma^2}\,\epsilon_\theta+\tilde\sigma z$，$\tilde\sigma=\eta\sqrt{\frac{1-\bar\alpha_s}{1-\bar\alpha_t}}\sqrt{1-\frac{\bar\alpha_t}{\bar\alpha_s}}$；Try 兩行「$\eta=1,s=t-1$ 為什麼退回 DDPM」：$\tilde\sigma^2=\frac{(1-\bar\alpha_{t-1})\beta_t}{1-\bar\alpha_t}=\tilde\beta_t$（用 $\bar\alpha_t/\bar\alpha_{t-1}=\alpha_t$）
7. ［F］兩種走法，看得見 — demo `w3-4-samplers` 截圖：同一個精確 score、同一組起點，只換 $\eta$；$\eta$ 1→0 軌跡由抖變滑、終點都落在資料上；步數 200→10 終點越遠、$\eta=0$ 掉得慢；**$\eta=0$ 的軌跡明顯是彎的**（伏筆 U2）；註「demo 的 score 精確，看不到加噪拉回那一面」
8. ［Q］如果步長縮到 0 呢？ — 副標「$\Delta t=1/T$，$\beta_t\to\beta(t)\Delta t$」
9. ［C］三條方程 — forward SDE $dx=-\frac12\beta x\,dt+\sqrt\beta\,dW_t$（往原點縮＋灌噪聲）／Anderson reverse SDE $dx=[-\frac12\beta x-\beta\nabla\log p_t]dt+\sqrt\beta\,d\bar W_t$／probability-flow ODE $\frac{dx}{dt}=-\frac12\beta x-\frac12\beta\nabla\log p_t$；標籤「score 的係數：SDE 是 $\beta$，ODE 只有一半」；Remark 通式 $f_t,g_t$ 小字
10. ［F＋T］同一組邊際，兩種走法 — `imgs/w-3-4-1.png` 時空圖（上抖下滑、同起同終）＋三欄表（邊際相同／軌跡 隨機·隨機·確定／離散版 加噪·DDPM·DDIM）；匾額「DDPM 是 reverse SDE 的一階離散，DDIM 是 PF-ODE 的一階離散」；廣場拍照比喻卡（每隔一段時間對整個廣場拍一張，兩組人的照片一模一樣）
11. ［M（附錄可）］少掉的一半 score 去哪了 — Fokker–Planck 的擴散項 $\frac12\beta\Delta p_t=\nabla\cdot(\frac12\beta\,p_t\nabla\log p_t)$ 吸進 drift → continuity equation $\partial_tp_t+\nabla\cdot(p_tu_t)=0$，$u_t=-\frac12\beta x-\frac12\beta\nabla\log p_t$；（時間不夠移附錄，quiz b 會考）
12. ［Q＋C］那它們的取樣結果會一樣嗎？步數少的時候哪一個比較好？ — Q2 題幹 → 答案三卡：「邊際相同」是連續時間、無限步的敘述／ODE 誤差來自彎（割線代曲線），SDE 有離散誤差但 score 會拉回／匾額「模型誤差大的時候，SDE 的修正有東西可修；模型幾乎沒有誤差的時候，剩下的只有離散化，SDE 的噪聲就只是多餘的抖動」；註「第二套誤差帳：模型族 $O(\beta_t)$、離散化 $O(\Delta t)$」
13. ［C］這是一個方法，不是定律 — 四張小卡：Gaussian、$\sqrt{1-\beta_t}$、$\mathcal N(0,I)$、schedule——每件事是人挑的；代價：起點只能 Gaussian、路徑被 $\bar\alpha_t$ 綁死 → 下單元「三個旋鈕」（W2 #16 底圖可重用）

絕不能省：#3、#4、#5、#9＋#10、#12。

**U1.5 實作：建立這個單元的 Toy**

1. ［C］先在淺水區把每件事看清楚 — 三好處（有標準答案：$p_t$ 是混合 Gaussian，score、posterior mean 精確算得出／看得見／跑得快）；設定卡 make_moons $n=2000$、MLP 三層寬 128、sinusoidal $t$、$T=1000$、linear $\beta$；notebook QR
2. ［K］步驄 1：`q_sample` ＋ 五行 loop — 高亮 `loss=((model(xt,t)-eps)**2).mean()`
3. ［Q］loss 停在 0.3，而且離 0 很遠——是哪裡寫錯了嗎？加寬、調 lr、多訓十倍會掉嗎？ — `<Ask>`＋Q1
4. ［F］不會，一點都不會 — `imgs/w-3-5-1.png`：理論下界 $\mathbb E[\mathrm{tr}\,\mathrm{Var}(\epsilon\mid x_t)]$ 隨 $t$ 由 $\approx0$ 爬到 $\approx1$、分箱實測、水平線 0.3；匾額「該看的不是 loss 停在多少，而是它隨 $t$ 長什麼形狀」
5. ［F］圖 a：score field — 模型 $-\epsilon_\theta/\sigma_t$ vs `exact_score`，$t\in\{50,300,700,950\}$；資料密集處吻合、低密度角落偏差大（後果在圖 c）
6. ［F］圖 b：三種 parametrization 真的等價嗎？ — 不重訓換算 $\hat x_0,\hat v$；反解回 $\hat\epsilon$ 差 $\lesssim10^{-6}$；$\hat x_0$ 誤差在 $t$ 大被 $1/\sqrt{\bar\alpha_t}$ 放大、$v$ 兩端不退化
7. ［K＋F］`ddim_step`（一支函數，$\eta$ 切換）＋圖 c 軌跡 — 32 起點、步數 $\{10,50,1000\}$；DDIM 10 步彎且落月牙外、1000 步收斂仍彎；匾額「用精確的 score 看不到加噪聲的好處——那個好處是拿來對付網路誤差的」
8. ［T］作業四題（$W_2$、$1/\mathrm{SNR}$ 加權、…）＋「先寫下你的猜測再跑」

**收尾**：quiz 選 w3-1-b（$\epsilon$ 不是 $\epsilon_t$）、w3-2-e（$t$ 大模糊是正確答案）、w3-3-c（$t$ 大 score≈$-x$）、w3-4-c（邊際相同⇏任意步數品質相同）；Bridge 卡「兩個留下的問題：forward 一定要 Gaussian 嗎？DDIM 的軌跡為什麼是彎的？」；叮嚀（作業一 10/08 前）。

**沿用 W2**：#3（開場底圖）、#5、#8、#10–12（濃縮）、#11（U1.2、U1.3 各用一次）、#13（重製）、#14、#15、#16（底圖）。
**新製圖（無文字）**：波紋地形側視；可逆管線＋三角 Jacobian；台灣兩路線收同終點；撲克牌重製；視力表 E 三版；$(x_0,\epsilon)$ 平面 $v$ 垂直；廣場塌 vs 挪開。
**demo**：`w3-0-many-maps`、`w3-1-forward`、`w3-2-posterior`、`w3-3-score`、`w3-4-samplers`。

---

### 4.2 Week 4 · U2 Flow Matching（6 篇，約 68 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 6 | 4 |
| U2.0 Forward Process 是必要的嗎？ | 12 | 7 |
| U2.1 速度場怎麼推動一整個分布？ | 22 | 11 |
| U2.2 先配對，再平均：CFM | 30 | 14 |
| U2.3 直線插值 | 22 | 10 |
| U2.4 FM 與 Diffusion 放在一起看 | 26 | 12 |
| U2.5 實作 | 15 | 7 |
| quiz＋Bridge | 7 | 3 |

**慣例卡（開場 #3，全週最重要的一張 T）**：照 w4-0 §3 的對照表——資料 $x_0\leftrightarrow x_1$、時間方向 $t:0\to1$ 往資料走、中間點 $\sqrt{\bar\alpha_t}x_0+\sigma_t\epsilon\leftrightarrow\alpha_tx_1+\sigma_tx_0$、邊界 $\alpha_0=0,\alpha_1=1,\sigma_0=1,\sigma_1=0$、網路學 $u_\theta$；兩個最易錯：**FM 的 $x_0$ 是噪聲**；**$(\alpha_t,\sigma_t)$ 不必 $\alpha^2+\sigma^2=1$**（$\alpha_t=t,\sigma_t=1-t$ 就不滿足）。開場 #4：本單元三個口號預告——「三個旋鈕」「把平均交給 loss」「彎來自交叉，交叉來自隨機配對」。

**U2.0 Forward Process 是必要的嗎？**

1. ［Q］如果我只想換掉套餐裡的其中一樣，剩下的還能不能用？ — `<Ask>`；W2 #16 底圖
2. ［S］上一個單元買的是一個套餐 — U1 推導鏈五環（加 Gaussian noise → closed form → denoising 回歸 → Tweedie → reverse SDE/PF-ODE）畫成相扣的鏈；粗體「它們是一起來的」；新製圖：五環鎖鏈（無文字）
3. ［Q＋C］兩個生成任務：草圖→照片（兩邊都不是 Gaussian）、球面上的資料——用 U1 框架會卡在哪？ — Q1 題幹 → 答案三卡（三個旋鈕）：起點分布（平穩分布 $\mathcal N(0,I)$ 定不出來）／路徑（中間形狀被 $\bar\alpha_t$ 鎖死、離開球面）／配對（獨立抽樣 → $\mathbb E[x_0\mid x_t]$ 候選很多 → 模糊）；`imgs/w4-0-1.png`；匾額「flow matching 的動機就是把它們拆開，一個一個拿回設計權」
4. ［C］點餐比喻 — 主餐／配菜／飲料 ↔ 起點／路徑／配對；「價格漂亮」＝推導鏈每環相扣；「不能只換飲料」；旋鈕轉到最上面那一組＝diffusion 能做的那一種組合
5. ［F］三個旋鈕 demo — `w4-0-three-knobs` 截圖：三個下拉都轉到最上面就是 diffusion；試「環形起點」與「配對：依位置排過」
6. ［C］換一個問法 — 匾額「先決定我們想要的中間分布長什麼樣，再問要用什麼速度場，把粒子從起點推到終點」；好處三條（起點任意、路徑自訂、不需 SDE/score/Tweedie）；代價一條「條件好算、邊際難算」會以新面貌回來
7. ［T］這個單元換一套慣例 — 對照表（＝開場 #3，再放一次，這次逐格講）

**U2.1 速度場怎麼推動一整個分布？**

1. ［C］先把三個容易混在一起的東西分開 — 開車：每個路口的指示牌＝速度場 $u_t(x)$／一台車走出的路線＝ODE 軌跡 $\frac{d}{dt}x_t=u_t(x_t)$／所有車的位置對照表＝flow map $\psi_t$；`imgs/w4-1-1.png`；W2 #18、#34 可重用局部；匾額「三個物件裡只有速度場是被參數化的；軌跡與 flow map 都是它的後果」
2. ［C］軌跡不交叉；生成器就是 $\psi_1$ — Lipschitz 唯一性（伏筆 U2.3）；$G=\psi_1$
3. ［Q］既然生成器就是 $\psi_1$，為什麼不乾脆直接學 $\psi_1$，一次算完就好？ — `<Ask>`
4. ［C］我們寫不出 $\psi_1$ 的訓練目標 — 左卡：沒配對會塌成平均圖（U1.0）；右卡：一旦路徑指定，中間每一點「該往哪走」就是已知的——速度場有現成的回歸目標；代價：取樣要解 ODE；伏筆「consistency／flow maps 單元會回頭直接學 $\psi$」
5. ［Q］從推動一顆點，到推動一整個分布 — 副標 $p_t=[\psi_t]_\#p_0$
6. ［M］自己導一次：一維的小盒子，兩行就出來了 — Try 四拍：區間 $[x,x+\Delta x]$ 質量 $\approx p_t\Delta x$ → 流量＝密度×速度 $p_tu_t$，「左端流進−右端流出」→ 除 $\Delta x$ 取極限 → 高維把 $\partial_x$ 換成 $\nabla\cdot$；結論紫色 $\boxed{\partial_tp_t+\nabla\cdot(p_tu_t)=0}$；白話「東西不會憑空出現或消失；$p_tu_t$ 是流量，散度是淨流出」
7. ［C］這條方程是雙向的 — 給 $u$ 算 $p$／給 $p$ 驗 $u$；匾額「要驗證一個速度場對不對，不必解 ODE——代進 continuity equation 就好」；定義「$u_t$ 生成 $p_t$」
8. ［F］速度場遊樂場 — demo `w4-1-fields` 截圖：先試「旋轉」——軌跡一圈圈但整團 Gaussian 雲不變；再試收縮／鞍點／推到雙月
9. ［C］同一對端點，無限多條路 — 兩層自由度：分布路徑的選擇；同一路徑上 $u_t+w$ 且 $\nabla\cdot(p_tw)=0$（沿等密度面繞圈）；一步驗證：代入 continuity equation 多出的項為零
10. ［Q＋C］聽起來這兩層自由度是免費的——隨便挑一個滿足式子的速度場，生出來的分布都一樣。這樣想哪裡不對？ — Q1 → 答案：分布層面沒錯／卡在數值解 ODE 的步數取決於軌跡形狀（旋轉 demo：滿足方程但繞很長）／匾額「兩層自由度不影響『走到哪裡』，只影響『要走幾步才走得到』」；出路：挑速度場的標準是代價 → U2.3、U3.2
11. ［T］（無符號卡；本篇的 $(\alpha_t,\sigma_t)$ 未出現）— 改放 Bridge 小卡：「下一篇給具體建構，證明它可以用回歸訓練——核心是 U1.2 那個 conditional trick，換到速度場上」

**U2.2 先配對，再平均：Conditional Flow Matching**

1. ［C］目標寫得出來，可是算不出來 — $\mathcal L_{\text{FM}}=\mathbb E_{t,x\sim p_t}\|u_\theta(x,t)-u_t(x)\|^2$；白話；麻煩：$u_t(x)$ 要整條 $p_t$ 與整個 $p_{\text{data}}$，手上只有五萬個點；匾額「要學的目標本身，是一個我們算不出來的量」；回指 U1 兩次同樣困境
2. ［Q］一個算不出來的東西，還能拿它當回歸目標嗎？ — `<Ask>`
3. ［C］把一個整體問題切成一堆小任務 — 倉庫搬貨三步卡：抽一組端點對 $z=(x_0,x_1)$／把路線寫死 $x_t=\alpha_tx_1+\sigma_tx_0$、條件速度 $u_t(x\mid z)=\dot\alpha_tx_1+\dot\sigma_tx_0$「好算到不需要網路」／對 $z$ 積分得 $p_t$；`imgs/w4-2-1.png`
4. ［T］符號 — `<Remark label="符號">`：$(\alpha_t,\sigma_t)$ 只要求四個邊界值與可微；**不需要** $\alpha^2+\sigma^2=1$；時間 $0\to1$ 噪聲→資料
5. ［F］站在 $x$ 往外看：很多路線經過這裡 — W2 #20 人潮圖重用（起點分佈／終點分佈／隨機配對直線、$v^\star(x_t,t)$ 綠箭頭）；式子 $u_t(x)=\int u_t(x\mid z)\frac{p_t(x\mid z)p(z)}{p_t(x)}dz=\mathbb E[u_t(x_t\mid z)\mid x_t=x]$；白話「按後驗權重平均，就是邊際速度」
6. ［Q］既然邊際速度是加權平均，最直接的做法是先把平均估出來：對每個 $(x,t)$ 抽很多配對、算權重、加權平均當目標。這樣做會遇到什麼？ — Q1
7. ［M］有效樣本數崩潰 — self-normalized IS：$w_i\propto p_t(x\mid z_i)$、$\hat u=\sum w_iu_t(x\mid z_i)$、有效樣本數 $1/\sum w_i^2$；權重由 $\|x-(\alpha_tx_{1,i}+\sigma_tx_{0,i})\|^2$ 決定、隨 $d$ 累加；$d=3072$ 不可能；紫色結論「這個平均我們根本不需要自己算：$L_2$ 最佳解＝條件期望」
8. ［F］中心式 — $\mathcal L_{\text{CFM}}=\mathbb E_{t,z,x\sim p_t(\cdot\mid z)}\|u_\theta(x,t)-u_t(x\mid z)\|^2$；匾額「難算的邊際量＋好算的條件量＋一個算得出來的 loss：平均那一步交給 loss 自己做」；口號「不要估平均，把平均交給 loss」
9. ［M］定理 1：$u_t$ 生成 $p_t$ — 三拍：每個 $z$ 的條件 continuity equation → 兩邊乘 $p(z)$ 對 $z$ 積分（線性、交換）→ 散度移出積分、用 $u_t$ 定義認出 $p_tu_t$；白話「每一箱貨各自守恆，加起來就是整批守恆」；註：需 $p_t(\cdot\mid z)$ 是真密度 → $z=x_1$ 版本 $p_t(x\mid x_1)=\mathcal N(\alpha_tx_1,\sigma_t^2I)$
10. ［M］定理 2：$\nabla_\theta\mathcal L_{\text{FM}}=\nabla_\theta\mathcal L_{\text{CFM}}$ — 四拍：兩 loss 各展開三項 → $\|u_\theta\|^2$ 項相同（$x$ 的邊際正是 $p_t$）→ 不含 $\theta$ 的項對梯度無貢獻 → 交叉項：$u_t$ 定義＋tower property；紫色「連每一步走的方向都一樣，不是近似」；差的常數 $\mathbb E\,\mathrm{tr}\,\mathrm{Var}[u_t(x_t\mid z)\mid x_t=x]$（loss 不會收到 0）
11. ［T］這是 conditional trick 的速度版本 — 三欄表 KL／MSE／velocity：想要的邊際量／好算的條件量／放進條件的／誰取平均／差的常數；粗體「不是三個各自獨立的技巧，是同一個策略在三種 objective 上的樣子」（**累積表第 3 列**）
12. ［K］訓練只換掉目標那一行 — 六行 pseudo-code，與 U1 五行只差 target
13. ［Q＋C］$x_0,x_1$ 各自獨立抽，配對是隨機的，路線交錯成一團——這樣學出來的東西還會是對的嗎？ — Q2 → 分布對（兩定理沒用到不交叉）／卡在一個位置只能一個速度，交錯處輸出平均、粗箭頭變短／軌跡是彎的，步數少時離散化誤差跑出來／出路：能不能挑不交錯的配對 → U3.3、U3.4
14. ［F］條件速度疊成邊際速度 — demo `w4-2-conditional-average` 截圖：細箭頭條件速度、粗箭頭加權平均；粗箭頭較短＝交叉方向互相抵消

**U2.3 代入最簡單的一條路：直線插值**

1. ［C］最沒有花招的選法 — $\alpha_t=t,\sigma_t=1-t$：$x_t=tx_1+(1-t)x_0$、$u_t(x\mid x_0,x_1)=x_1-x_0$「條件速度是一個常數——不隨 $t$、不隨位置」；網路的工作「看到 $x_t$ 和 $t$，猜出終點減起點」；程式只改 `target = x1 - x0`；Remark 三個名字（rectified flow／stochastic interpolants／OT path）「寫下來的訓練目標是同一個」；W2 #19 重用
2. ［Q］條件路徑每一條都是直線。那訓好之後，粒子會走直線嗎？ — `<Ask>`
3. ［Q］一個聽起來很順的推理：每條條件路徑都直，邊際速度是它們的平均，一堆直線方向平均起來還是一個方向，所以邊際軌跡當然也直。錯在哪？ — Q1 題幹（引文用 blockquote 樣式）
4. ［M］用兩組配對就能算出來 — $(-1,-1)\to(1,1)$、$(1,-1)\to(-1,1)$ 各半；$t=\frac12$ 都過原點；條件速度 $(2,2)$、$(-2,2)$；$u_{1/2}((0,0))=\frac12(2,2)+\frac12(-2,2)=(0,2)$；紫色「正上方——這個方向沒有任何一條條件直線在走，水平分量互相抵消」；加一層硬理由：ODE 軌跡不能交叉 → 邊際軌跡只能是不交叉曲線族；`imgs/w4-3-1.png`
5. ［B］「彎」來自「交叉」，「交叉」來自「隨機配對」 — 三個詞各自長成 U3.2／U3.3／U3.4
6. ［C］直不直，決定要走幾步 — Euler $x_{t+h}=x_t+h\,u_\theta(x_t,t)$「拿一條割線代替真正的軌跡」；連 DDIM 少步掉品質同因
7. ［F］交叉、彎曲，與要走幾步 — demo `w4-3-crossing` 截圖：四團 toy，配對是唯一變數；彎曲度 隨機 1.59 vs 依位置 1.00；Euler 終點誤差 隨機 4 步 1.49／20 步 0.26／200 步 0.01，依位置 4 步 0.03（差近五十倍）；兩種配對 $p_0,p_1$ 相同
8. ［M］換到 $\epsilon$ 座標看，其實不是同一個 loss — 四拍：$x_0\to\epsilon$ → 反解 $x_1=(x_t-(1-t)\epsilon)/t$ → $u_t=\frac{x_t}{t}-\frac\epsilon t$，$u_\theta=\frac{x_t-\epsilon_\theta}{t}$ → 相減：$\|u_\theta-u_t\|^2=\frac1{t^2}\|\epsilon_\theta-\epsilon\|^2$；紫色
9. ［T］加權對照 — DDPM $\mathcal L_{\text{simple}}$ 均勻 vs FM 均勻 $t$ 在 $\epsilon$ 座標帶 $1/t^2$（噪聲端看得重很多）；結論一：學速度＝學噴聲（affine）、DDPM 的 $x_0$-prediction 在這裡叫 $x_1$-prediction（「最容易讀錯的術語」）
10. ［B］FM 與 DDPM 的差別不只在路徑（線性 vs VP），還在那個沒有人明說的加權

**U2.4 把 Flow Matching 和 Diffusion 放在一起看**

1. ［Q］如果中間分布是同一族，那兩邊學的東西是不是同一個？ — `<Ask>`；左右兩欄「SDE／score／Tweedie」vs「ODE／速度場／回歸」看起來差很多
2. ［M］把兩邊的速度場寫進同一個座標 — 三拍：$u_t=\dot\alpha_t\mathbb E[x_1\mid x]+\dot\sigma_t\mathbb E[\epsilon\mid x]$（條件期望線性）→ 對 $x_t=\alpha_tx_1+\sigma_t\epsilon$ 取條件期望得約束 $x=\alpha_t\mathbb E[x_1\mid x]+\sigma_t\mathbb E[\epsilon\mid x]$「兩個條件期望不是獨立未知數」→ 代 Tweedie $\mathbb E[\epsilon\mid x]=-\sigma_t\nabla\log p_t$
3. ［F］中心式 — $\boxed{u_t(x)=\frac{\dot\alpha_t}{\alpha_t}x-\sigma_t\Big(\dot\sigma_t-\frac{\dot\alpha_t}{\alpha_t}\sigma_t\Big)\nabla\log p_t(x)}$；白話「速度場就是『位置』和『score』的線性組合，兩個係數只跟 $t$ 有關」；`imgs/w4-4-1.png` 兩套座標
4. ［M］代 VP 進去：兩個係數各化簡一次，就是 PF-ODE — Try 四拍：DDPM 時間 $\tau$（方向相反！）、$\bar\alpha_\tau=\exp(-\int\beta)$、$\alpha_\tau=\sqrt{\bar\alpha_\tau}$、$\sigma_\tau=\sqrt{1-\bar\alpha_\tau}$ → $\dot\alpha_\tau/\alpha_\tau=-\beta/2$ → 第二係數 $-\sigma_\tau(\frac{\beta\bar\alpha_\tau}{2\sigma_\tau}+\frac\beta2\sigma_\tau)=-\frac\beta2(\bar\alpha_\tau+\sigma_\tau^2)=-\frac\beta2$（用 VP 恆等式）→ $\frac{dx}{d\tau}=-\frac12\beta x-\frac12\beta\nabla\log p_\tau$；紫色「一字不差就是 U1.4 的 PF-ODE」
5. ［C］同一個訓好的 $\epsilon_\theta$，不用重訓就能當速度場用 — 轉換式 $u_\theta=\frac{\dot\alpha_t}{\alpha_t}(x-\sigma_t\epsilon_\theta)+\dot\sigma_t\epsilon_\theta$；右卡「坑：$(\alpha_t,\sigma_t)$ 必須是訓練時的路徑——換的是座標，不是路徑」（拿 VP 訓的 $\epsilon_\theta$ 配線性係數＝要求網路在沒看過的分布上答題）
6. ［F］兩套座標、兩條路徑 — demo `w4-4-two-paths` 截圖：左式右式差 $10^{-15}$ 量級；切換路徑軌跡形狀立刻不同
7. ［T］交集之外，兩邊各能動什麼 — 四個旋鈕（起點／路徑／配對／訓練端加權）vs 後果（likelihood、取樣器、訓練目標語意）分兩層的對照表；「likelihood 與取樣器不是旋鈕，是後果」
8. ［C］Likelihood — $\frac{d}{dt}\log p_t(x_t)=-\nabla\cdot u_t(x_t)$；匾額「沿路把『體積被壓縮了多少』累加起來，就是 likelihood」；Remark Hutchinson 小字（附錄）
9. ［Q］常聽到：「線性路徑的軌跡比較直，所以少步數就能取樣。」demo 可以直接量彎曲度——這個說法在什麼意義下成立？ — Q1
10. ［C］先量 — 雙月 toy：線性 2.1、VP 1.5；8 步 Euler 線性誤差較大；粗體「在這裡，線性路徑反而比較彎」
11. ［M］為什麼：一去一回 — $u_0(x)=\mathbb E[x_1-x_0\mid x_0=x]=\mathbb E[x_1]-x$（獨立配對）：每顆粒子一開始都朝資料平均位置衝，之後才分岔；VP 的 $\dot\sigma_0=0$ 起步是整片平移；結論「『線性比較直』成立於條件路徑；條件直≠邊際直」；相信可量的：全域誤差 $\approx h\int_0^1\|\ddot x_t\|dt$（U3.2 證）
12. ［C］這件事不能用框架的名字來推論 — 歸因要控制住其他三個旋鈕（把加權的效果誤記在路徵頭上）；Details「為什麼文獻說線性少步更好」放附錄

**U2.5 實作：同一個 toy，只換訓練目標**

1. ［K］設定：只動兩行 — 七行 PyTorch，高亮 `xt = t*x1 + (1-t)*x0` 與 `loss = ((model(xt,t) - (x1-x0))**2).mean()`；符號提醒 `x0` 噪聲、`x1` 資料；匾額「換框架在程式裡只是換兩行；換掉的是那兩行背後的設計自由度」；loss 停在 >0 且比上單元大（多一個變異數常數）
2. ［F］圖 a：DDIM 與 FM 軌跡並排 — 32 起點、步數 $\{10,50,1000\}$；兩月牙中間最彎（條件直線交叉最密）
3. ［Q］那到底哪一條路徑的軌跡比較好走？能不能量出來，而不是看圖猜？ — `<Ask>`
4. ［F］圖 b：步數對誤差 log-log — `imgs/w4-5-1.png` 兩種讀法：斜率＝取樣器階數（Euler $\approx-1.05$、Heun $\approx-2.05$）、高度＝彎曲（線性高出 VP 兩到三倍）；只積到 $t=0.9$；Remark 用中位數（分岔選錯邊 $O(1)$）；匾額「量收斂階數之前，先確認你量的是離散化誤差，不是分岔選錯邊」；demo `w4-5-steps`
5. ［K＋F］圖 c：不重訓的轉換 — `eps_to_velocity` ＋ `to_ddpm_step`（**反向**：FM $t=1\leftrightarrow s=0$）；與 DDIM 50 步幾乎重合
6. ［Q＋C］U1 的模型是不是也能直接拿去用線性路徵的 FM 取樣器？ — Q1 → 不行：$\mathbb E\|x_t\|^2=t^2\mathbb E\|x_1\|^2+(1-t)^2d$ vs VP 大致固定 → 沒見過的分布；「能事後換的（取樣器、座標）vs 不能事後換的（起點、路徑、配對、加權）」
7. ［T］作業 — 五題摘要（非 Gaussian 起點、logit-normal $t$、VP 參數化 $(\sin\frac{\pi t}2,\cos\frac{\pi t}2)$、Hutchinson likelihood…）＋ U1–U2 作業候選 A／B／C 一句話各一（急救室／鋪路／分診）

**收尾**：quiz 選 w4-0-b（$t=0.9$ 接近資料）、w4-2-b（梯度同、loss 差常數）、w4-3-a（$1/t^2$）、w4-4-c（線性邊際軌跡一般是彎的）；Bridge「軌跡為什麼彎、彎多少、怎麼拉直、噴聲該不該加回去——下一個單元從一個把兩個框架都裝得進去的式子開始」。

**沿用 W2**：#16（底圖）、#18、#19、#20（U2.2 核心圖）、#34（flow map 對照表局部）。
**新製圖**：五環鎖鏈；點餐套餐三格；開車三物件（若 `imgs/w4-1-1.png` 不夠）；一去一回（粒子先衝向平均再分岔）。
**demo**：`w4-0-three-knobs`、`w4-1-fields`、`w4-2-conditional-average`、`w4-3-crossing`、`w4-4-two-paths`、`w4-5-steps`。

---

### 4.3 Week 5 · U3 Stochastic Interpolants 與共用技巧（7 篇，約 73 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 6 | 4 |
| U3.0 一個式子裝下前面兩個單元 | 20 | 11 |
| U3.1 取樣器不只一個，是一整族 | 18 | 10 |
| U3.2 把「彎」寫成一個算得出來的數 | 18 | 10 |
| U3.3 拉直（一）：Reflow | 15 | 9 |
| U3.4 拉直（二）：Minibatch OT | 15 | 9 |
| U3.5 共用技巧 | 22 | 12 |
| U3.6 實作 | 14 | 7 |
| quiz＋Bridge | 12 | 4 |

**慣例卡（開場 #3）**：Albergo 記號 $x_t=\alpha_tx_0+\beta_tx_1+\gamma_tz$，$\alpha_t$＝**起點**係數、$\beta_t$＝**資料**係數、$\gamma_t$＝噪聲幅度；**U2 的 $(\alpha_t,\sigma_t)$＝U3 的 $(\beta_t,\alpha_t)$**；$t=1$ 資料；$\varepsilon_t$（取樣旋鈕，`\varepsilon`）≠ $\epsilon$（噴聲，`\epsilon`）。**三個記號切換點各再放一張對照卡**：U3.0 §2、U3.1 Remark 切回 U2 的 $\sigma_t$、U3.5 加權表第一列用 U1 離散 $\bar\alpha_t$。開場 #4：三個懸案（彎怎麼量／怎麼拉直／取樣加不加噪聲）歸到三軸（路徑／配對／取樣器）。

**U3.0 一個式子裝下前面兩個單元**

1. ［Q］有沒有一個式子，能把前面兩個單元的所有方法都裝進去？ — `<Ask>`
2. ［F］中心式 — $\boxed{x_t=\alpha_tx_0+\beta_tx_1+\gamma_tz,\ (x_0,x_1)\sim\pi,\ z\sim\mathcal N(0,I)\text{ 獨立}}$；邊界 $\alpha_0=\beta_1=1$、$\alpha_1=\beta_0=0$、$\gamma_0=\gamma_1=0$「額外的噪聲在兩端都要被掐掉」；標籤卡 **$x_0\neq z$**（起點可以是任意分布；$z$ 是硬加進來的 Gaussian）；`imgs/w5-0-1.png`
3. ［T］符號對照卡 — U2 $(\alpha,\sigma)$ ↔ U3 $(\beta,\alpha)$；`<Remark label="符號">` 原文
4. ［C］三個可以轉的東西：路徑 $(\alpha_t,\beta_t)$、配對 $\pi$、$\gamma_t$ — 粗體「注意這三個不等於 U2.0 的那三個旋鈕」（起點分布在 $\pi$ 的邊際裡；取樣噴聲 $\varepsilon_t$ 是第五個，下一篇）
5. ［T］前面學過的東西全部是特例 — 五列表：線性 FM／RF／OT-CFM／VP（$\alpha=\cos\frac{\pi t}2,\beta=\sin\frac{\pi t}2$）／Albergo 預設 $\gamma=\sqrt{2t(1-t)}$；粗體「diffusion 在 $\gamma=0$ 列——因為它的噪聲就是 $x_0$ 本身，不用自己掏 $\gamma_tz$ 來買」
6. ［C］$\gamma_tz$ 到底買到了什麼？ — 管子比喻：把每條條件路徑撐成一根有寬度的管子，兩端收緊成點；新製圖：束狀管子（無文字）
7. ［M］微分 → 兩個回歸目標 — $\dot x_t=\dot\alpha_tx_0+\dot\beta_tx_1+\dot\gamma_tz$ 給定 $(x_0,x_1,z)$ 就算得出 → conditional trick（通式版，累積表第 4 列）：$b_t(x)=\mathbb E[\dot x_t\mid x_t=x]$（速度）、$\eta_t(x)=\mathbb E[z\mid x_t=x]$（denoiser）；訓練迴圈跟 CFM 幾乎一樣、多抽一個 $z$；$b_t$ 生成 $p_t$（引 CFM 定理 1）
8. ［M］為什麼「對條件 Gaussian 套 Tweedie 再平均」就得到邊際的 score — 四拍：條件密度 $\mathcal N(x;m,\gamma_t^2I)$，$m=\alpha_tx_0+\beta_tx_1$ → 條件 score $-\frac{x-m}{\gamma_t^2}=-\frac z{\gamma_t}$ → 邊際 score＝條件 score 的後驴平均（$\nabla$ 拉進積分再除 $p_t$）→ $\nabla\log p_t(x)=-\eta_t(x)/\gamma_t$；紫色
9. ［B］只要 $\gamma_t>0$，同一個框架就同時給你速度與 score——不管起點是什麼分布、配對是怎麼配的
10. ［Q＋C］U2.3 說要拉直得動配對；剛剛說配對變確定性 score 就拿不到——矛盾嗎？ — Q1 → 拆兩個需求：$b_t$ 只需條件期望（退化分布也定義得好）；score 需要密度＋非退化條件 Gaussian → 匾額「想要直的軌跡 → 動配對 → 失去 score → 只能用 ODE 取樣／想要 score → 要嘛保留獨立配對，要嘛付 $\gamma_tz$ 這筆錢」；出路：$\gamma_tz$ 讓管子重疊、軌跡彎回一點 → 三旋鈕互相牽動
11. ［F］$\gamma_t$ 這個旋鈕在做什麼 — demo `w5-0-gamma` 截圖：環→環；「對徑配對」$x_1=-x_0$、$\gamma=0$、$t=0.5$ 環**塌成一個點**（兩主方向標準差 0.000，$p_t$ 連密度都沒有）；推高 $\gamma$ 變有厚度的雲

**U3.1 取樣器不只一個，是一整族**

1. ［C］手上有兩樣東西，可以怎麼組 — 訓完有 $b_t$ 與 $s_t=\nabla\log p_t$；ODE 只用前者、reverse SDE 兩個都用——中間呢？
2. ［Q］如果把 score 摻進去一點，會不會走到別的地方？ — `<Ask>`
3. ［F］中心式 — $\boxed{dX_t=[b_t(X_t)+\varepsilon_ts_t(X_t)]dt+\sqrt{2\varepsilon_t}\,dW_t,\ X_0\sim p_0,\ t:0\to1}$；粗體「答案是：不會走到別的地方。對每一個 $\varepsilon_t\ge0$，這個 SDE 在時刻 $t$ 的邊際都是同一個 $p_t$」；`imgs/w5-1-1.png`
4. ［M］Fokker–Planck 兩行 — $\partial_t\rho=-\nabla\cdot((b+\varepsilon s)\rho)+\varepsilon\Delta\rho$ → 代 $\rho=p_t$、用 $s\,p_t=\nabla p_t$ → $-\nabla\cdot(\varepsilon\nabla p_t)+\varepsilon\Delta p_t=0$「兩個多出來的項**互相抵消**」→ 剩下 $b_t$ 生成 $p_t$ 的 continuity equation；紫色
5. ［C］Langevin 項 — $\underbrace{\varepsilon_ts_tdt+\sqrt{2\varepsilon_t}dW_t}_{\text{Langevin 項}}$；匾額「加一點噪聲，再用 score 把樣本往高密度處拉回來」；新製圖：推一把＋拉回（無文字）
6. ［T］Remark：這一族在 diffusion 那一側長什麼樣 — DDIM $\eta=0\leftrightarrow\varepsilon=0$、$\eta=1\leftrightarrow$ reverse SDE；score 量級 $O(1/\sigma_t)$（Tweedie 分子 $O(1)$）→ 取 $\varepsilon_t\propto\sigma_t^2$ 使 $\varepsilon_ts_t=O(\sigma_t)$ 在資料端自己收掉；**符號卡：這裡的 $\sigma_t$ 是 U2 記號**
7. ［Q＋T］U3.0 訓練時加了 $\gamma_tz$——這樣訓出來的 FM 是不是就有 U1.4 那種自我修正能力了？ — Q1 → 2×2 表（訓練 $\gamma$ ∈{0,>0} × 取樣 ∈{ODE,SDE}）只有 SDE 欄有修正；「$\gamma$ 給的是選擇權：有 score 才有選 $\varepsilon$ 的權利；訓練 $\gamma_t$ 決定學得到什麼、取樣 $\varepsilon_t$ 決定怎麼走」；警語「修正既不免費也不瞬間——需要足夠大的 $\varepsilon$ 與足夠的剩餘時間」
8. ［C］有修正，不代表更好 — 每步注入 $\sqrt{2\varepsilon h}$ 本身是誤差來源；EM 弱一階／強半階；Details「兩端收小、中間放大」（附錄）；匾額「$\varepsilon_t$ 不影響邊際，只影響誤差怎麼累積」
9. ［F］同一組邊際，一整族走法 — demo `w5-1-epsilon` 截圖：$c$ 0→6 軌跡由滑變抖、energy distance 一直停在 0.01 上下；按「把所有樣本推歪」（$t=0.15$ 平移近一單位）：$c=0$ 偏移帶到終點（約 0.7），$c$ 越大救得越回，$c=4$ 以後幾乎回到沒推的水準
10. ［T］「一樣」有四種意思 — 預測量／訓練目標／軌跡／邊際四層階梯，一層比一層弱；「看到『其實是同一個』先問在哪一層同」

**U3.2 把「彎」寫成一個算得出來的數**

1. ［Q］「彎」能不能寫成一個數？而且那個數真的壓住誤差嗎？ — `<Ask>`；副標「到目前為止它還是一個形容詞」
2. ［M］Euler 走一步差多少 — Taylor $x_{t+h}=x_t+h\dot x_t+\frac{h^2}2\ddot x_\xi$；前兩項就是 Euler → 局部誤差 $\frac{h^2}2\|\ddot x_\xi\|$
3. ［C］加速度的兩個來源 — $\ddot x_t=\underbrace{\partial_tu_t(x_t)}_{\text{場自己在變}}+\underbrace{(u_t\cdot\nabla)u_t(x_t)}_{\text{粒子換位置了}}$；`imgs/w5-2-1.png`；「等速直線時兩項都是零」
4. ［M］一步的誤差怎麼變成終點的誤差 — Grönwall 放大 $e^{L(1-t_k)}$ → 加總 → $\le\frac{e^L}2h\int_0^1\|\ddot x_t\|dt+o(h)$；結論 $\boxed{\text{Euler 全域誤差}\lesssim C_Lh\int_0^1\|\partial_tu_t+(u_t\cdot\nabla)u_t\|_{x=x_t}dt}$
5. ［C］三行讀法 — $h$ 給斜率（log-log 上 $-1$）／積分給高度／$C_L$ 是速度場正則性，**不由路徑直不直控制**；匾額「『彎』現在是一個數：$\int_0^1\|\ddot x_t\|dt$。這也是 reflow 與 minibatch OT 真正在壓小的量」
6. ［F］曲率積分真的壓住誤差嗎 — demo `w5-2-curvature` 截圖：六個設定散點、雙對數、六點排在斜率約 1 的線上（$r$ 通常 0.95 以上）；最有效一招是換配對：線性路徑獨立→依位置，積分約 9 → 1.4
7. ［C］SDE 為什麼不能用同一個量 — 布朗軌跡上 $\ddot x$ 不存在；控制它的是 drift 正則性與 $\varepsilon$；弱 $O(h)$、強 $O(h^{1/2})$；粗體「拉直不會幫到 SDE」「ODE 每一步犯錯少但全部累積，SDE 每一步犯錯多但錯不會全留下」
8. ［Q＋C］reflow 拉直之後誤差這麼小，能不能再把 Langevin 項加上去，同時享有直軌跡和自我修正？ — Q1 → reflow＝確定性配對＋$\gamma\equiv0$ ⇒ 無 score ⇒ 寫不出 SDE；留 $\gamma>0$ ⇒ 管子重疊 ⇒ 積分回不到 0；匾額「『所有粒子沿確定的直線走』和『中間分布有厚度、偏了可以拉回來』不可能同時成立」
9. ［T］四個數字 — 積分：獨立配對約 9、好配對 1.4、好配對加 $\gamma$ 回升約 3.5、壞配對加 $\gamma$ 掉到約 6（加 $\gamma$ 的方向依配對好壞而異）；沒有例外的只有「$\gamma>0$ 讓積分不可能等於 0」
10. ［C］Details：從單條軌跡誤差到 $W_2$ 上界（附錄）— 同起點兩終點是合法耦合、$W_2$ 是下確界；反向不成立

**U3.3 拉直（一）：讓模型自己生出配對**

1. ［C］一個很便宜的觀察 — 三句話：邊際軌跡彎，因為條件直線交叉；交叉，因為配對是隨機的；**ODE 的軌跡不會交叉** ⇒ 用 ODE 生配對就不交叉；匾額「配對不必自己設計——讓上一輪的模型生出來就好」
2. ［Q］能不能拿模型自己的取樣結果，當成下一輪訓練的配對？ — `<Ask>`
3. ［S］一輪要做哪三件事 — $X_t=(1-t)X_0+tX_1$ → 解 $\dot Z_t=u_t(Z_t)$、$Z_0=X_0$ → 把 $(Z_0,Z_1)$ 當新耦合 $\pi'=\mathsf R(\pi)$；reflow $\pi^{k+1}=\mathsf R(\pi^k)$；`imgs/w5-3-1.png` 迴圈；「訓 FM＋ODE 取樣在耦合層次就是 $\mathsf R$」
4. ［C］三個性質 — 保邊際（$Z_1\sim p_1$ 由 CFM 定理 1）／不增運輸成本 $\mathbb E[c(Z_1-Z_0)]\le\mathbb E[c(X_1-X_0)]$「粒子不再繞路」／軌跡不交叉（$\mathsf R(\pi)$ 的條件直線是不交叉軌跡的弦）
5. ［M］不增運輸成本：兩次 Jensen — $Z_1-Z_0=\int_0^1u_t(Z_t)dt$ → 對時間平均用 Jensen $c(\int u)\le\int c(u)$ → 對條件期望用 Jensen → 取期望、用 $Z_t\overset d=X_t$ 接起來；$\square$
6. ［C］為什麼一直做下去會變直？ — $S(\pi)=\int_0^1\mathbb E\|(X_1-X_0)-u_t(X_t)\|^2dt$（straightness）；白話「每個粒子自己的條件速度，和它在那個位置實際被指派到的邊際速度，差多少」；$S=0$ ⇔ 粒子照著自己的直線走、一步 Euler 就精確；Remark：$S$ 與曲率積分是同一件事
7. ［M］簿記 — 每一輪省下的運輸成本 ≥ 那一輪的 $S$；預算有限（下界是 OT 成本）→ $\sum_{k\le K}S(\pi^k)\le\mathbb E\|X_1-X_0\|^2\big|_{\pi^0}$ → $\min_kS(\pi^k)=O(1/K)$；紫色
8. ［F］Reflow demo — `w5-3-reflow` 截圖 0→1→2→3：straightness 約 1.4→0.03；1 步 Euler 誤差 1.4→0.1；運輸成本 4.0→0.6；終點分布與資料距離一直 <0.01；「第一輪就吃掉大部分好處」；註「精確場 demo 顯示的是上限」
9. ［C＋Q］直是有代價的 — 誤差累積（上一輪模型誤差進配對）／多樣性（無 score、無 SDE 退路）／極限未必 OT；匾額「reflow 買到的是『直』，付出的是多樣性與上一輪的模型誤差」；Q1「只改配對，曲率為什麼變？」→ $u_t=\mathbb E[X_1-X_0\mid X_t=x]$ 取決於聯合分布：獨立配對四面八方平均、粗箭頭短；不交叉配對近乎平行

**U3.4 拉直（二）：在每個 batch 裡解一次配對**

1. ［Q］最省力的那組配對，是不是剛好也是不交叉的那一組？ — `<Ask>`；「好」＝總位移最小＝OT（倉庫搬貨）
2. ［M］交換一次就看出來了 — $(\|a-B\|^2+\|b-A\|^2)-(\|a-A\|^2+\|b-B\|^2)=2(a-b)^\top(A-B)$（平方項全消）；「如果 $(a-b)^\top(A-B)<0$，交換一定更省」→ 最佳配對滿足 $(a-b)^\top(T(a)-T(b))\ge0$：**單調**；`imgs/w5-4-1.png`
3. ［B＋C］OT 配對真正保證的是「單調」，不是「不交叉」 — 一維單調＝零交叉；高維只是把交叉壓到很少（全域 OT 實測仍有 0.2–0.8%）；Remark Brenier $T=\nabla\varphi$（附錄）；minibatch OT 仍有後驄（同一 $x_0$ 在不同 batch 遇到不同候選）
4. ［K］Minibatch OT：只多兩行 — `C[i,j]=‖x0[i]−x1[j]‖²`、`argmin_σ Σ C[i,σ(i)]`、`x1 ← x1[σ]`；$O(B^3)$、Sinkhorn
5. ［F］Batch 內解一次 OT — demo `w5-4-batch-ot` 截圖：獨立→192（全域）交叉比例約 20%→9%→4%→1.4%→0.6%；1 步 Euler 誤差 1.5→0.77→0.41→0.21→0.08；「batch 16 就走完八成的路，但後面還有得賺」
6. ［C］邊際正確，配對次佳 — batch 內重排是置換 ⇒ 兩集合不變 ⇒ 合法耦合，**無論 $B$ 多小都沒有邊際偏差**；偏差在「非全域 OT」、$S>0$；匾額「Minibatch OT 影響的是曲率，不是正確性」；「在散點圖上往左移，不改斜率」
7. ［T］reflow 與 minibatch OT，差在哪？ — 六列對照表
8. ［Q＋M］在 2D toy 上 minibatch OT 效果漂亮，在圖像（$d=3072$）上增益小得多——為什麼？ — Q1 → 距離集中：$\mathbb E\|x_0-x_1\|^2=2d$、$\mathrm{Var}=8d$、相對標準差 $\sqrt{2/d}$（$d=2$ 是 100%，$d=3072$ 只剩 2.5%）→ 成本矩陣幾乎是常數 → 最佳指派≈隨機指派；出路：latent space、batch 要大；順帶解釋 reflow 在高維較常見（配對結構是學出來的）
9. ［B］（可併 #6）「配對的結構是學出來的，不依賴成本矩陣有沒有對比度」

**U3.5 共用技巧：guidance、高階 solver、時間加權**

1. ［Q］這三個技巧在三份論文裡、用三套語言寫，有沒有一個說法可以一次講完？ — `<Ask>`；副標「Gaussian 路徑上 diffusion／FM 是同一物件的兩套座標；曲率積分是共同度量」
2. ［C］Classifier-free guidance 兩座標 — $\tilde s_t=s_t(\cdot\mid\varnothing)+w(s_t(\cdot\mid c)-s_t(\cdot\mid\varnothing))$、$\tilde u_t$ 同形；「同一件事」的理由：$u$ 是 $x$ 與 $s$ 的線性組合、係數只依賴 $t$，線性組合與線性外推可交換；$w=1$ 普通條件生成，$w>1$ 才叫 guidance；W2 #22 重用
3. ［C］$w>1$ 生成的是什麼 — $\tilde s_t$ 對應 $\propto p_t(x\mid c)^wp_t(x\mid\varnothing)^{1-w}$（銳化）；但 $\tilde u_t$ 不滿足這條路徑的 continuity equation ⇒ 終點**既不是 $p_1(\cdot\mid c)$、也不是那個銳化的分布**；匾額「$w=1$ 已經是正確答案了。$w>1$ 是刻意把分布改掉，換一個『更像那一類』的樣子」
4. ［F］Guidance 買到什麼、付了什麼 — demo `w5-5-guidance` 截圖：終點分布與該類資料距離在 $w=1$ 最小（0.01～0.03）、$w=4$ 約 0.4、$w=8$ 約 0.8；終點散布 $\sigma$ 1.1→0.57（「多樣性是被換掉的」）；曲率積分 $w>2$ 後近似線性成長 3.5→5.8→10.5；8 步時 $w=1$ 的 0.011 → $w=4$ 的 0.018；結論「guidance 越強需要越多步；少步＋高 guidance 易過飽和與結構崩壞」；Remark 平滑窗（附錄）
5. ［C］高階 solver — Heun $\tilde x=x_t+hu_t(x_t)$，$x_{t+h}=x_t+\frac h2(u_t(x_t)+u_{t+h}(\tilde x))$「兩次評估估這一步的平均速度」；全域誤差 $\lesssim Ch^2\int\|\dddot x_t\|dt$；粗體「階數換成二、代價是被積函數升成三階導數」＋兩倍 NFE；「賭的是軌跡夠光滑；彎本身不是問題，彎得不規律才是」
6. ［C］Details：DPM-Solver 為什麼比通用高階方法有效 — $u_t=\frac{\dot\alpha_t}{\alpha_t}x+(\dot\sigma_t-\frac{\dot\alpha_t}{\alpha_t}\sigma_t)\epsilon_\theta$（**U2 記號**）：線性部分精確積分（換 $\log$-SNR 更乾脆），只近似 $\epsilon_\theta$ 項；「先把已經知道的彎曲扣掉，剩下要近似的部分本來就更直」；三種「拉直」並列：RF 改配對／OT 改配對／DPM-Solver 改座標
7. ［T］時間取樣與加權：三處加權並排 — DDPM $w(t)=\frac{\bar\alpha_{t-1}\beta_t}{2(1-\bar\alpha_t)(1-\bar\alpha_{t-1})}$（**U1 離散記號**）／$\epsilon$ 座標 $\frac{\beta_t}{2\alpha_t(1-\bar\alpha_{t-1})}$／線性 FM 均勻 $t$ 在 $\epsilon$ 座標 $1/t^2$；「加權從來不是新旋鈕」；**符號警示：這張表的 $w(t)$ 與 guidance 的 $w$ 撞字，投影片改寫 $w_{\text{loss}}(t)$**
8. ［C］中段最難 — 兩端都太容易（$t\approx0$ 速度近常數、$t\approx1$ 去噪近恆等）；訓練難度論證（不是誤差分布論證）；SD3 logit-normal、EDM、Kingma & Gao；匾額「選 $t$ 的分布，就是選 $\log\mathrm{SNR}$ 上的權重」；「動的是高度，不是斜率」
9. ［Q＋T］如果只能挑一個技巧來改善「10 步取樣的品質」，該挑哪一個？為什麼其他的不行？ — Q1 → 六列表（技巧／動的旋鈕／對誤差的影響）；逐項刪：SDE 來不及、Heun 有限、guidance 反向、時間加權間接 ⇒ 改配對（reflow demo 1.4→0.1）；誠實補述「排序針對少步；不限步數時答案反過來（SDE 多步常贏、確定性配對失去 score 變缺點）」；`imgs/w5-5-1.png`
10. ［B］六個技巧，一個共同的靶（終點誤差）
11–12. ［附錄］平滑窗 Remark；Hutchinson。

**U3.6 實作：把曲率積分畫成一條線**

1. ［K］設定與四種配對 — 同架構同 seed，粗體「只有配對不一樣」；(a) 獨立 (b) reflow×1 (c) reflow×2 (d) minibatch OT（`cdist`＋`linear_sum_assignment`，batch 256）
2. ［F］圖 a 軌跡並排 ＋ demo `w5-6-four-couplings` 四指標：獨立 $S\approx1.6$、1 步誤差≈1.5、交叉≈23%；reflow×1 $S$ 0.03、誤差 0.12、交叉 1%；batch OT(32) $S$ 0.22、誤差 0.30；全域 OT $S$ 0.02、誤差 0.06；「旋鈕動的是路，不是終點」
3. ［Q＋K］曲率積分小，誤差就一定小嗎？在自己的圖上驗一次 — `<Ask>`＋`curvature_integral`（細步差分兩次）；圖 b 四點共線斜率約 1；換步數整體平移
4. ［T］步驟 4：straightness 與運輸成本 — 表；「reflow×1 和全域 OT 在『直』上打成平手，但運輸成本 OT 一貫略低——直和省是兩件事」
5. ［K］步驟 5：`sde_step` — `s = -eta/gamma(t)`；`x + h*(b + eps_t*s) + sqrt(2*eps_t*h)*randn`（U3.0 的 score 式＋U3.1 的一族 SDE 合成一行）；$\gamma_t=0.3\sqrt{2t(1-t)}$、雙 head；「先寫下你的猜測：$\varepsilon\in\{0,0.1,0.5\}$ 三條會不會交叉？」
6. ［C］Remark：這一步很容易得到和文獻相反的結論 — $\varepsilon_t=c\gamma_t^2$ 尺度；score 精確 vs 學出來；「掃大範圍 $\varepsilon$、兩種網路都報」
7. ［Q＋F］圖 b 上有一個點落在共線之上——第一個該懷疑什麼？ — Q1 → 不等式有**兩個**因子 → 匾額「點偏離那條線的時候，先懷疑 $C_L$，不要先懷疑理論」；收尾圖 `imgs/w5-6-1.png`「三個單元，一張圖」

**收尾**：quiz 選 w5-0-c（$\gamma\equiv0$＋確定性配對 $b_t$ 仍存在）、w5-1-b（訓練有噴聲≠有自我修正）、w5-2-d（加 $\gamma$ 不一定讓積分變大）、w5-4-b（$B=4$ 邊際仍正確）；Bridge「三個單元的主線在這裡收尾……接下來進入離散資料，這幾樣工具會一直回來」；作業一（10/08）截止提醒——本週就是 Week 5。

**沿用 W2**：#22（CFG 情境卡）、#35（steering 三格可預告 guidance）。
**新製圖**：束狀管子（$\gamma_tz$）；推一把＋拉回（Langevin）；直 vs 厚互斥（兩張並排小圖）；交換終點（若 `imgs/w5-4-1.png` 不夠）。
**demo**：`w5-0-gamma`、`w5-1-epsilon`、`w5-2-curvature`、`w5-3-reflow`、`w5-4-batch-ot`、`w5-5-guidance`、`w5-6-four-couplings`。

---

### 4.4 Week 6 · U4 Discrete Diffusion I（6 篇，約 64 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 5 | 3 |
| U4.0 資料是 Token 的時候，噪聲是什麼？ | 15 | 8 |
| U4.1 D3PM | 25 | 12 |
| U4.2 Masked Diffusion | 22 | 11 |
| U4.3 因子化誤差 | 22 | 11 |
| U4.4 Absorbing 與 Uniform | 15 | 8 |
| U4.5 實作 | 20 | 9 |
| quiz＋Bridge | 6 | 2 |

**慣例卡（開場 #3）**：狀態離散 $x\in\{1,\dots,K\}$、one-hot **列向量**；$Q_t$ 每列和 1；**$\bar\alpha_t$ 是機率（token 沒被動過的機率），不是連續世界的振幅 $\sqrt{\bar\alpha_t}$**；時間方向 $t=0$ 資料（同 U1）；`[MASK]` 是第 $K{+}1$ 個符號、灰底 `▨`。全週視覺：序列一律畫成一排等寬圓角方塊（W2 #29–31）。

**U4.0 資料是 Token 的時候，噪聲是什麼？**

1. ［Q］兩個 token 之間沒有「中間」。那「加一點噴聲」該換成什麼？ — `<Ask>`；W2 #29 重用（貓 +0.01 噴聲還是貓 vs 字沒有中間值）
2. ［C］它們是類別，不是數值 — 「想」和「吃」的平均不是一個字；$x_0+\sigma\epsilon$ 不是合法物件
3. ［T］盤點：哪些壞了，哪些還活著 — U2 骨架四環節：已知路徑 ✓、每個 $t$ 回歸 ✓（MSE→cross-entropy，目標 $\mathbb E[x_0\mid x_t]\to p(x_0\mid x_t)$）、Tweedie／score ✗、SDE／ODE ✗（類別之間沒有方向）；結論「本單元任務：把加噴聲換成離散 Markov chain，看回歸目標長什麼樣」
4. ［Q＋C］「加噴聲」在離散空間上該換成什麼？先自己想兩三種候選 — Q1 → 候選五類（uniform 換字／`[MASK]`／刪除／embedding＋Gaussian＋round／交換位置）× 兩個原則（forward 是完全已知的 Markov chain 且 $q(x_t\mid x_0)$ 有 closed form；終點簡單到可直接抽）→ 留下 uniform（終點獨立均勻）與 absorbing（終點全 `[MASK]`）；Diffusion-LM 是第三條路、本課不走
5. ［T］一個容易混的詞 — 2×2 表：時間離散／連續 × 狀態連續／離散；本單元在「時間離散、狀態離散」格，下單元走 CTMC；「discrete 指狀態空間，不是步數有限」
6. ［S］兩條鏈，兩個終點 — `imgs/w6-0-1.png` ＋ W2 #30 forward／reverse 雙箭頭同款；demo `w6-0-noising` 截圖：同一句、同一 $t$，上排 uniform 下排 absorbing，被動過的格數大致相同（都是機率 $\bar\alpha_t$ 存活）；absorbing 沒有格子復原＝吸收態
7. ［C］為什麼 mask 值得特別看 — 獨有性質「任何 $t$，沒被遮的 token 一定是 $x_0$ 的原字；不確定的資訊全部集中在被遮的位置」→ 預告 loss 會塌成 masked CE（BERT／MaskGIT 線）；代價「翻開就永遠固定」（＝ODE 沒有自我修正）→ 留給 U4.4
8. ［C］（Bridge 小卡）下一篇把兩條鏈寫成 transition matrix

**U4.1 D3PM：Transition Matrix、Closed Form 與 x₀-Parametrization**

1. ［Q］「$q(x_t\mid x_0)$ 有 closed form」在離散世界是什麼意思？ — `<Ask>`
2. ［C］先只看一個 token — forward 對每位置獨立；$[Q_t]_{ij}=q(x_t=j\mid x_{t-1}=i)$「第 $i$ 列是從 $i$ 出發下一步落在各狀態的機率」；$x_{t-1}$ 挑出 $Q_t$ 的那一列
3. ［F］中心式 — $q(x_t\mid x_0)=\mathrm{Cat}(x_0\bar Q_t),\ \bar Q_t=Q_1Q_2\cdots Q_t$；粗體「這一行是整個單元的地基：$\bar Q_t$ 有 closed form 就是離散版『任何 $t$ 可一步抽出 $x_t$』」；小問句「一般矩陣連乘沒有 closed form——我們選的兩條鏈有嗎？」
4. ［M］uniform — $Q_t=(1-\beta_t)I+\beta_t\frac1K\mathbb 1\mathbb 1^\top$；令 $J=\frac1K\mathbb 1\mathbb 1^\top$，$J^2=J$ → $(aI+bJ)(cI+dJ)=acI+(1-ac)J$（形狀閉合）→ $\bar Q_t=\bar\alpha_tI+(1-\bar\alpha_t)J$，$\bar\alpha_t=\prod(1-\beta_s)$；白話「機率 $\bar\alpha_t$ 從沒被動過，$1-\bar\alpha_t$ 已是均勻隨機字」
5. ［M］absorbing — $Q_t=(1-\beta_t)I+\beta_t\mathbb 1e_m^\top$；檢查第 $m$ 列 $=e_m^\top$（`[MASK]` 留在 `[MASK]`）；$e_m^\top\mathbb 1=1$ ⇒ 同樣代數 → $\bar Q_t=\bar\alpha_tI+(1-\bar\alpha_t)\mathbb 1e_m^\top$；紫色「機率 $\bar\alpha_t$ 原字、$1-\bar\alpha_t$ 是 `[MASK]`，**沒有第三種可能**——上一篇那句話現在是公式」
6. ［T］符號卡 — `<Remark label="符號">`：$\bar\alpha_t$ 機率 vs 連續世界 $\sqrt{\bar\alpha_t}$ 振幅，差一個平方根；同符號是為了搬直覺
7. ［F］$\bar Q_t$ 熱圖 — demo `w6-1-qbar` 截圖：uniform 對角線淡下去、整張變均勻；absorbing 質量整批流進 `[MASK]` 那一欄；「$Q_t$ 只走一步幾乎是 identity，是連乘 $t$ 次才把質量搬走」；對角線 uniform 比 $\bar\alpha_t$ 多一點（換回自己）
8. ［M］Posterior：多知道 $x_0$，一切都好算 — Bayes＋Markov：$q(x_{t-1}\mid x_t,x_0)\propto(x_tQ_t^\top)\odot(x_0\bar Q_{t-1})$「兩個長度 $K$ 向量逐元素乘再正規化」；absorbing 版塌成一枚硬幣「要不要把這個 `[MASK]` 換回 $x_0$」；新製圖：硬幣兩面（`[MASK]`／原字）
9. ［M］那 loss 長什麼樣？ — ELBO 三項（與 DDPM 逐字相同）：$-\log p_\theta(x_0)\le L_0+\sum_{t\ge2}L_{t-1}+L_T$；$L_T$ 無參數趨近 0、$L_0$ 普通 CE、$L_{t-1}$ 是兩個 $K$ 維類別分佈的 KL（有限個數字，無 normalizing constant 問題）；Details 骨架（Jensen／Bayes 反轉／逐項配對）附錄
10. ［F］網路該輸出什麼 — 中心式 $p_\theta(x_{t-1}\mid x_t)=\sum_{\tilde x_0}q(x_{t-1}\mid x_t,\tilde x_0)\,p_\theta(\tilde x_0\mid x_t)$；`imgs/w6-1-1.png`；匾額「讓網路預測 $x_0$，再用已知的 posterior 把它折回 $x_{t-1}$」（**$x_0$-parametrization**，這一篇最該記的一句）
11. ［Q＋C］U1.2 說 $x_0$／$\epsilon$／$v$ 三座標可互換，離散世界為什麼只剩 $x_0$-parametrization？ — Q1 → 互換靠 affine $x_t=\sqrt{\bar\alpha_t}x_0+\sigma_t\epsilon$，離散是「抽」出來的類別、沒有 $\epsilon$ 可解回；直接輸出 $x_{t-1}$ 不好的兩個理由（分工／跳步 $q(x_{t-k}\mid x_t,\tilde x_0)$）
12. ［C］D3PM 的輔助 $\lambda$ CE 項 — 預告 absorbing 上 ELBO 自己就會塌成那形狀 → 下一篇

**U4.2 Masked Diffusion：ELBO 塌成加權的 Cross-Entropy**

1. ［Q］上一篇那個一般的 ELBO，在 absorbing 鏈上會塌成什麼？ — `<Ask>`；副標「用手算完」
2. ［M］情形一：位置 $\ell$ 沒被遮 — posterior 與 model（看到沒被遮的位置就照抄）同為確定分佈 → KL＝0；紫色「這個位置對 loss 沒有貢獻」
3. ［M］情形二：被遮 — posterior 硬幣 $q(x_{t-1}^\ell\mid x_t,x_0)=$ `[MASK]` 機率 $\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}$／$x_0^\ell$ 機率 $\frac{\bar\alpha_{t-1}-\bar\alpha_t}{1-\bar\alpha_t}$；model 邊的 `[MASK]` 機率對任何 $\tilde x_0$ 相同 → 同一枚硬幣；「留」面相消、「翻開」面是點分佈對 $p_\theta$ 的 KL＝$-\log p_\theta(x_0^\ell\mid x_t)$，乘翻開機率；`imgs/w6-2-1.png`
4. ［F］中心式 — $\boxed{\mathcal L_{\text{MDM}}=\sum_t\mathbb E_{x_t}\Big[\frac{\bar\alpha_{t-1}-\bar\alpha_t}{1-\bar\alpha_t}\sum_{\ell:x_t^\ell=\texttt{[MASK]}}-\log p_\theta(x_0^\ell\mid x_t)\Big]}$；匾額「抽一個 $t$、按 $\bar\alpha_t$ 隨機遮掉一些位置、對被遮的位置做 cross-entropy、乘上一個只跟 $t$ 有關的權重」；「沒有 KL、沒有 posterior、沒有輔助 loss——簡單到會讓人懷疑是不是算錯了」
5. ［T］連續時間極限（Details，可附錄）— $T\to\infty$ 橫線省掉：$\int_0^1\frac{-\dot\alpha_t}{1-\alpha_t}\mathbb E[\sum-\log p_\theta]dt$；線性 $\alpha_t=1-t$ 給 $1/t$（把每個被遮位置拉成等權）；**符號卡：從這裡到 U5，$\alpha_t$ 指的都是 $\bar\alpha_t$**
6. ［C］和 BERT 差在哪 — 兩件事：遮罩比例隨機且要學所有比例（BERT 固定 15%）；每個 $t$ 有 ELBO 給的權重（因此有 likelihood 界、可報 perplexity）；「表徵學習的預訓練目標 → 合法的生成模型」；Remark 權重 $1/t$ 實務常改掉、代價失去 likelihood 界；Details「網路其實不需要看 $t$」（附錄）
7. ［S］取樣：從全 `[MASK]` 出發 — 每步對仍 `[MASK]` 的位置擲硬幣翻開／留下；**已翻開不再改（不是額外規定，是 posterior 說的）**；跳步 $t\to t-k$ 機率 $\frac{\bar\alpha_{t-k}-\bar\alpha_t}{1-\bar\alpha_t}$；訓 $T=1000$ 取樣 8 或 16 步
8. ［F］demo `w6-2-sampling` 截圖 — toy 文法（長度 16、`A B ( )`）；按下一步看翻開哪些格「機率只跟 $t$ 有關，和內容無關」；步數 16→1 每步翻更多；點格子看柱子「翻開時是從柱子抽的，不是 argmax」；BERT 對照開關
9. ［Q＋C］取樣時翻開的字是從 $p_\theta$ 抽的，改成每次取 argmax 會怎樣？ — Q1 → 程序變確定性、失去多樣性；$p_\theta$ 是 conditional，遮罩比例大時很平、argmax 偏很遠；MaskGIT 的信心保留是在「哪些位置翻開」上選擇——偷偷處理下一篇的問題
10. ［C］（Bridge）步數越少、每步同時翻開越多——哪裡會出錯？答案是離散世界的「曲率」
11. ［附錄］Details 連續極限、Details 不需要看 $t$、Remark $1/t$。

**U4.3 因子化誤差：離散世界的曲率**

1. ［Q］上一篇說步數可以壓到 8 步、甚至 1 步。那同時翻開很多格，代價是什麼？ — `<Ask>`；W2 #31 重用（那隻 遮 在 遮 → 貓在飛／狗在飛 ✗）
2. ［C］網路給的是什麼 — 逐位置 **marginal** $p_\theta(x_0^\ell\mid x_t)$，沒有 joint；同時翻開 $S$＝從 $\prod_{\ell\in S}p_\theta$ 抽，正確目標是 $p(x_0^S\mid x_t)$；「今天想吃 `[MASK]` `[MASK]`」→ 牛肉／麵、壽／司合法，「牛肉／司」是乘積生出來的；相等的條件：給定 $x_t$ 條件獨立——語言裡幾乎從不成立
3. ［Q］最省事的做法——一步全翻——會壞到什麼程度？先在小例子上算：長度 8 的 0/1 序列、偶數個 1（128 條均勻）、完美網路 — Q1 題幹
4. ［M］parity toy 三個數字 — 一步全翻：每位置 marginal $\frac12$，$\{0,1\}^8$ 均勻，合法率 $\frac12$；每步一個走 8 步：前 7 位置 $\frac12$、第 8 位置 conditional 確定 → 合法率 1；每步兩個走 4 步：前三步無誤，最後一步 joint 只允許 2 種、乘積 4 種 → $\frac12$；紫色「誤差不由步數均勻決定，出現在『同時翻開的位置有條件相依』那一步——parity 的相依全藏在最後一個自由度」
5. ［F］中心式 — $\mathrm{FE}(S\mid x_t)=\mathrm{KL}\big(p(x_0^S\mid x_t)\,\big\|\,\prod_{\ell\in S}p(x_0^\ell\mid x_t)\big)$＝total correlation「合起來看比分開看多知道多少」；$\ge0$；$=0$ iff 條件獨立；$|S|=1$ 恆零；Details「$\mathrm{KL}(p\|\tilde p)=\sum_{\text{steps}}\mathbb E\,\mathrm{FE}$，且不在訓練 loss 裡」（附錄）
6. ［F］demo `w6-3-parity` 截圖 — $k=1$：FE 一直 0、合法率 100%；$k=2/4/8$：FE 前面幾步 0、最後一步跳到 $\log2\approx0.693$，合法率 49.8%／48.3%／52.6%；$k=8$ 真實 joint 256 個組合只有 128 個非零、乘積 256 個都有值
7. ［T］這是離散世界的曲率 — 對照表（本單元最重要的一張）：訓練物件 $u_t(x)$ vs $p(x_0^\ell\mid x_t)$／一步假設 直線 vs 條件獨立／誤差來源 $\int\|\ddot x\|dt$ vs total correlation／何時為零／減少做法（拉直 vs 信心排序、顯式相依）；「連續的『拉直』在離散沒有對應——沒有『直的配對』這回事」
8. ［C］那不如直接用 autoregressive？ — 每步翻一個的 MDM＝任意順序 AR；取捨：AR 精確但 $L$ 次呼叫不可平行／MDM 可平行 $L/k$ 次但有 FE、天生雙向填空；`imgs/w6-3-1.png`；「比較時『每步翻開幾個』要當實驗變數」
9. ［B］有限步取樣的誤差，在兩個世界裡都來自「一步之內假設了太簡單的結構」
10. ［C］（Bridge）翻錯的字能不能改？absorbing 說不能，uniform 說可以
11. ［附錄］Details KL 分解。

**U4.4 Absorbing 與 Uniform：翻錯的字能不能改？**

1. ［Q］如果第三步就把一個字填錯了，後面還有機會改回來嗎？ — `<Ask>`
2. ［C］反向的時候，兩條鏈差在哪 — absorbing 只對 `[MASK]` 做事，錯字（牛肉／司）留下且成為後續 context「之後的 6 步只能在這個錯字旁邊繼續填」；uniform 的 posterior $\propto(x_tQ_t^\top)\odot(x_0\bar Q_{t-1})$ 對每個位置都可能改字 → 自我修正；對到 ODE（無修正、誤差累積）vs SDE（噴聲＋score 拉回）
3. ［F］demo `w6-4-correction` 截圖 — 長度 16 的 0/1 序列、精確 conditional marginal；「植入一個錯誤」：absorbing 紅框永遠不變、uniform 常被改成綠框；200 次修正率 absorbing 0.0%、uniform 62%～67%；「視角」按鈕：uniform 的噪聲字和原字長得一模一樣（虛線框讀者看得到、模型看不到）
4. ［Q］那 uniform 應該更好——為什麼實務上（D3PM、SEDD）absorbing 的 perplexity 明顯更好？ — 節標題當問句
5. ［C］今天想吃壽貓 — uniform 每步每位置要先判斷「貓是噪聲還是原文」，判斷會錯兩方向（原字當噪聲改掉／噪聲當原字留下）→ 修正引入新錯；absorbing 把判斷完全拿掉，容量全用在「填什麼」；取捨卡「**修正能力**（uniform 有）對上**乾淨的 context**（absorbing 有）」；`imgs/w6-4-1.png`；「uniform 的手續費不隨步數變小——和 SDE 離散化誤差不同」；Remark：demo 修正率是上限
6. ［Q＋C］有沒有辦法兩個都要——保留 `[MASK]` 的乾淨 context，又讓早期填錯的字有機會被改？ — Q1 → 在 absorbing 反向鏈加小機率「回到 `[MASK]`」＝remasking；三個開放問題（重遮機率多少？會不會改變 $q(x_t\mid x_0)$？翻開與重遮比例怎麼平衡？）→ 離散時間矩陣語言答起來笨拙 → 下一單元 rate 語言，remasking 只是多加一個 rate，對應 sampler 的 $\varepsilon$
7. ［T］（對照）ODE／SDE ↔ absorbing／uniform ↔ 訓練噴聲／取樣噴聲 預告表
8. ［C］（Bridge）下一篇動手

**U4.5 實作：Parity 與 Markov Toy 上的 Masked Diffusion**

1. ［C］為什麼是這兩個 toy — 離散版「月牙」：狀態空間小到能查表算所有 conditional marginal（標準答案）→ 模型誤差與因子化誤差分得開；parity（$L=8$，相依集中在最後一個自由度）、Markov（$L=16$，$p=0.9$，相依散在相鄰）；`imgs/w6-5-1.png`；網路規格；notebook QR
2. ［K］步驄 1：forward 與訓練 — `q_sample`（以 $\bar\alpha_t$ 機率保留否則遮）、`weight(t)`、加權 masked CE；與 U2 五行逐行對照，粗體「其他一行都沒變」；檢查點
3. ［Q］一張圖上兩種誤差，怎麼一眼看出哪一段是誰的責任？ — `<Ask>`
4. ［F］圖 a／demo `w6-5-decompose` — 縱軸切換率（真值 0.10）；「三條線在 $k=1$ 的高低差是模型誤差（完美網路 0.09～0.11、$\epsilon=0.15$ 是 0.17～0.18）；同一條線隨 $k$ 爬升的那一段是因子化誤差（完美網路爬到 $k=16$ 的 0.50＝每格獨立擲硬幣）」；Remark 為何用切換率不用 KL
5. ［K］步驟 3：`sample` 跳步（`ts=linspace(T,0,steps+1)`、`flip` 逐位置硬幣）
6. ［F］圖 b：每步翻開幾個 vs 合法率 — parity 步數 1／2／4／8 → 50%／約 52%／約 64%／**78–79%**（不是 100%）；Markov 畫 `kl_to_data`「把這張圖留好，U5 疊 remasking 線」
7. ［Q＋M］8 步、$L=8$，每步平均翻一格，合法率卻是 78–79% 不是 100%——哪裡出問題？ — Q1 → 不是模型也不是 bug：`flip` 逐位置硬幣 → 一步翻開數是 Binomial → 匾額「這條樣本合法，等價於最後一次翻開只翻了一格」→ 標籤重參數化：每位置獨立抽 $\{0,\dots,N-1\}$ 均勻標籤 → $q=\Pr[\text{最大標籤唯一}]=\frac{L}{N^L}\sum_{k=0}^{N-1}k^{L-1}$ → 合法率 $\frac{1+q}2$，$L=N=8$ 得 78.6%（剩 21.4% 全是因子化誤差，是設定的天花板）；三種修法：強制每步一格（100%＝任意順序 AR）／加大步數 $N=16/32/64\to88.4/94.0/96.9\%$／記在報告：「步數 $=L$」≠「每步一格」
8. ［F］步驟 4：absorbing vs uniform 修正實驗（圖 c）— 另訓 uniform（`d3pm_loss`）、第 2 步植入錯字、200 次修正率與 `kl_to_data`；期待 absorbing 0%、uniform 非零但整體未必更好
9. ［T］作業四題（uniform 合法率／信心排序在 Markov 有效、parity 幾乎無效／直接預測 $x_{t-1}$／拿掉 $t$）

**收尾**：quiz 選 w6-1-a（uniform 對角 $\bar\alpha_t+(1-\bar\alpha_t)/K$）、w6-2-c（翻開不改來自 posterior）、w6-3-b（4 步×2 個合法率 $\frac12$）、w6-5-b（78–79% 是 Binomial）；Bridge「翻錯的字能不能改、要付什麼代價——下一個單元換成 rate 的語言，這個問題會有一個短答案」。

**沿用 W2**：#29、#30、#31（U4 的三張核心圖全在 W2）。
**新製圖**：硬幣兩面（`[MASK]`／原字）；「今天想吃壽貓」三格漫畫（無文字→字用疊圖）；parity 8 格序列與「最後一格」高亮。
**demo**：`w6-0-noising`、`w6-1-qbar`、`w6-2-sampling`、`w6-3-parity`、`w6-4-correction`、`w6-5-decompose`。

---

### 4.5 Week 7 · U5 Discrete Diffusion II（7 篇，約 68 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 6 | 4 |
| U5.0 要把「改」說清楚，需要什麼語言？ | 12 | 7 |
| U5.1 CTMC：Rate Matrix 與 Forward Equation | 22 | 11 |
| U5.2 反向 Rate 與 Concrete Score | 25 | 12 |
| U5.3 Remasking | 18 | 9 |
| U5.4 Discrete Flow Matching | 18 | 9 |
| U5.5 應用 | 15 | 8 |
| U5.6 實作 | 14 | 7 |
| quiz＋Bridge | 10 | 3 |

**慣例卡（開場 #3，本週符號衝突最多）**：$t\in[0,1]$、$t=0$ 資料、$t=1$ 噪聲；**本單元的 $\alpha_t$ 就是 U4 的 $\bar\alpha_t$**；**$Q_t$ 是 transition matrix、$R_t$ 是 rate matrix——與多數 CTMC 文獻的 $Q$ 相反**；$u_t$（純量翻開 rate）≠ 前幾單元的 $u_t(x)$（速度場）；$\sigma_t$（remasking rate，無上界）≠ Gaussian 振幅 $\sigma_t\in[0,1]$；$\kappa_t=1-\alpha_t$；$\sigma_t\neq\gamma_t$。開場 #4：貫穿比喻預告——水桶／水管／閥門。

**U5.0 要把「改」說清楚，需要什麼語言？**

1. ［Q］上一篇那個「加一點回到 `[MASK]` 的機會」，為什麼用上一個單元的語言答起來很笨拙？ — `<Ask>`
2. ［C］把含糊的提議拆成三個小問題 — 改多少？會不會動到邊際？能不能連續地調（介於 absorbing 與 uniform 之間）？
3. ［T］用 transition matrix 試一次：三面牆 — 第一面 closed form 消失（改 `[MASK]` 列後「$aI+b\times$投影」形狀破掉）／第二面「一點」沒有單位（$\gamma=0.01$ 的「一步」長度取決於 $T$）／第三面 取樣器和 forward chain 綁死（$p_\theta(x_{t-1}\mid x_t)=\sum q(x_{t-1}\mid x_t,\tilde x_0)p_\theta$ 每個因子都由 $Q_t$ 決定）；`imgs/w7-0-1.png`
4. ［F］demo `w7-0-two-languages` 截圖 — 在 $T=40$ 校準的每步機率拿去 $T=10/100/1000$：終點遮罩量 0.126／0.556／0.926（差七倍）；改成每步取 $\sigma/T$ 則 0.335／0.340／0.341；匾額「rate 有單位，每步的機率沒有」
5. ［C］這面牆我們撞過一次 — DDPM $T$ 步→SDE 同一件事；$dX_t=[b_t+\varepsilon_ts_t]dt+\sqrt{2\varepsilon_t}dW_t$ 的 $\varepsilon_t$ 如何一次拆掉三面牆（Fokker–Planck 證邊際不變；SDE 描述「單位時間變化率」而非「一步到哪」）
6. ［F］本單元的新物件：rate — $R_t(x\to y)$「在時刻 $t$，每單位時間有多少機率從 $x$ 流到 $y$」；$Q_{t\to t+\Delta t}\approx I+R_t\Delta t$「$\Delta t$ 從模型定義消失」；預告：三個小問題各有短答案、score→比值、ODE/SDE→flow matching
7. ［Q＋C］rate 只是「$Q$ 減 identity 再除 $\Delta t$」，換一種寫法為什麼會讓問題變簡單？ — Q1 → $Q_t$ 混編了「鏈長什麼樣」與「走幾步」；換成 rate 後參數有單位、可連續調、同一問題只算一次；「換語言沒有換掉任何數學，變的是問新問題要付多少力氣」

**U5.1 CTMC：Rate Matrix 與 Forward Equation**

1. ［Q］「每單位時間流過去多少機率」這句話寫成式子長什麼樣？ — `<Ask>`
2. ［F］先看三個水桶 — 三個桶（狀態）、總水量 1（機率和）、水管（轉移通道）、閥門上的數字（rate：每單位時間來源桶漏掉自己水量的比例；$a\to b$ 標 2、$\Delta t=0.01$ 就漏 2%——rate 乘時間才是機率，rate 可 $>1$）；水位變化率＝流進−流出；新製圖：三水桶＋閥門（無文字，數字疊上）
3. ［C］把閥門寫成矩陣 — $R_t$ 三條：非對角 $\ge0$；對角＝負列和；列和為零＝守恆記帳；$Q_{t\to t+\Delta t}=I+R_t\Delta t+O(\Delta t^2)$（列和 $1+0\cdot\Delta t$）；粗體「$Q_t$ 是一步之後到哪，$R_t$ 是此刻正往哪流」
4. ［T］符號 Remark — 本課 $Q=I+R\Delta t$ vs 文獻 $P=I+Q\Delta t$；「同一條式子，$Q$ 這個字母意思相反」；時間方向卡
5. ［M］分佈怎麼隨時間變 — $p_{t+\Delta t}=p_tQ_{t\to t+\Delta t}$ → 代 $Q\approx I+R\Delta t$ → 移項除 $\Delta t$ → $\boxed{\dot p_t=p_tR_t}$（forward equation）；逐分量 $\dot p_t(y)=\sum_{x\neq y}p_t(x)R_t(x\to y)-p_t(y)\sum_{x\neq y}R_t(y\to x)$「流進 $y$ 的減從 $y$ 流出去的」；常 rate 解 $p_0e^{tR}$
6. ［T］與 Fokker–Planck 並排 — 五行對照表；「分佈的時間導數＝一個線性算子作用在分佈上；drift 搬質量、Laplacian 攤平質量；離散世界的 generator 就是 $R$」；`imgs/w7-1-1.png`
7. ［M］Try：一條線上只跳相鄰，$\dot p_t=p_tR_t$ 攤開長什麼樣？ — 流入 $r\,p(y\pm1)$、流出 $2r\,p(y)$ → $\dot p_t(y)=r[p(y-1)+p(y+1)-2p(y)]$；紫色「方括號正是 $\partial_{xx}$ 的有限差分——熱方程式的離散版」
8. ［M］把兩條鏈翻成 rate — uniform $R_t=\beta_t(J-I)$、absorbing $R_t=\beta_t(\mathbb 1e_m^\top-I)$，都是 $\beta_t(\Pi-I)$；$A=\Pi-I$，$A^2=-A$ → 矩陣指數三行 $e^{sA}=e^{-s}I+(1-e^{-s})\Pi$ → $\bar Q_t=\exp(\int_0^tR_s\,ds)=\bar\alpha_tI+(1-\bar\alpha_t)\Pi$，$\bar\alpha_t=\exp(-\int\beta)$；反過來 $\beta_t=-\dot\alpha_t/\alpha_t$（線性 $\alpha_t=1-t$ 給 $1/(1-t)$，在 $t=1$ 發散——最後一刻遮罩要無限快，仍合法）
9. ［F］demo `w7-1-ctmc` 截圖 — absorbing $t=2$ 時 `[MASK]` 水位 0.910（$=1-e^{-1.2\times2}$）；加回流 $\sigma=2$ 停在平衡 0.374；總和永遠 1.0000
10. ［Q＋C］整句的 rate matrix 是 $K^L\times K^L$——這樣算哪裡比較好？ — Q1 → 多 token 一次只跳一個（兩位置同時跳是 $O(\Delta t^2)$）；鄰居只有 $L(K-1)$ 個 $=1024\times50256\approx5.1\times10^7$＝logits 張量大小——就是同一個東西；「每一步只碰它的一列；加一根管子＝加一個數字到某一格」；匾額「大小不是重點，能不能局部地問問題才是」
11. ［C］（Bridge）把時間反過來：反向 rate 是什麼？答案裡會冒出一個比值

**U5.2 反向 Rate 與 Concrete Score**

1. ［Q］forward 的每一根管子上都標好了數字。把時間倒過來，管子上該改標什麼？ — `<Ask>`
2. ［M］把水管倒過來 — 流量（不是 rate，是 rate×來源水位）$p_t(y)R_t(y\to x)$；要求反向流量相等 $p_t(x)\bar R_t(x\to y)=p_t(y)R_t(y\to x)$ → $\boxed{\bar R_t(x\to y)=R_t(y\to x)\,\frac{p_t(y)}{p_t(x)}}$；Bayes 一行也得到（除以 $\Delta t$）；「長得像 detailed balance 但不需要 reversible——兩邊是不同的鏈」
3. ［C］兩個因子 — 已知的 forward rate 反向讀／未知的邊際比值——**要學的只有比值**；Details 兩狀態手算（$\bar R(b\to a)=\frac{re^{-rt}}{1-e^{-rt}}$，$t\to0$ 發散：剩下少數 `[MASK]` 要極快翻開）附錄
4. ［Q＋C］U1.4 的 reverse SDE 裡要學的是 score，U4.0 說離散沒有梯度。離散空間裡扮演 score 角色的量是什麼？ — Q1 → 就是比值 $p_t(y)/p_t(x)$，每個鄰居一個數；有限差分 $\partial_x\log p\approx\frac1h(\frac{p(x+h)}{p(x)}-1)$：拿掉極限與 $h$ 剩比值；「連續 score 加在 drift 上、離散比值乘在 rate 上——一個是加、一個是乘」；`imgs/w7-2-1.png`；Remark「比值不是機率，不必和為 1，不能 softmax」
5. ［F］demo `w7-2-ratios` 截圖 — absorbing 下除掉 $\alpha_t/(1-\alpha_t)$ 後同一格兩根柱和 1.0000；比值最大值 $t=0.15$ 5.60、$t=0.5$ 0.99、$t=0.9$ 0.11（對應係數 5.67／1.00／0.11）；沒被遮位置是空槽；uniform 下比值擠在 1 附近（0.88～1.18）
6. ［M］這是 conditional trick 的比值版本 — $\frac{p_t(y)}{p_t(x)}=\sum_{x_0}\underbrace{\frac{q_t(y\mid x_0)}{q_t(x\mid x_0)}}_{\text{條件比值}}\underbrace{\frac{q_t(x\mid x_0)p(x_0)}{p_t(x)}}_{p(x_0\mid x_t=x)}=\mathbb E\big[\tfrac{q_t(y\mid x_0)}{q_t(x\mid x_0)}\mid x_t=x\big]$；三拍（展開／同乘 $q_t(x\mid x_0)$／認出後驗）
7. ［T］conditional trick 全版本表 — KL／MSE／速度／通式／比值（累積表第 5 列；原文出處 Lai et al. §6.1 *Conditional Tricks: The Secret Sauce*）；「每一條都是：條件版＝邊際版＋一個與參數無關的常數」
8. ［C］SEDD：直接回歸比值 — 比值是正數，MSE 不自然 → score entropy $\mathcal L_{\text{SE}}=\mathbb E\sum_{y\neq x}w_{xy}[s_\theta(x)_y-\frac{p_t(y)}{p_t(x)}\log s_\theta(x)_y+h(\frac{p_t(y)}{p_t(x)})]$，$h(a)=a(\log a-1)$；denoising 版把真比值換成條件比值——**真比值只在 $-a\log s$ 線性出現 ⇒ 梯度不變**；Details Bregman（$\varphi=u\log u-u$；MSE 對應 $\varphi=u^2$）與 $w_{xy}=R_t(y\to x)$ 附錄
9. ［M］Absorbing 鏈上：比值就是上一個單元的網路 — 條件比值 $\frac{q_t(y\mid x_0)}{q_t(x\mid x_0)}=\frac{\alpha_t\mathbb 1[x_0^\ell=v]}{1-\alpha_t}$（其他位置相消）→ 後驗平均 $\frac{p_t(y)}{p_t(x)}=\frac{\alpha_t}{1-\alpha_t}p(x_0^\ell=v\mid x_t)$；紫色「MDLM 的網路乘上 $\alpha_t/(1-\alpha_t)$ 就是 concrete score——離散世界的 Tweedie 公式」
10. ［F］代回反向 rate — $\bar R_t(\texttt{[MASK]}\to v)=\beta_t\frac{\alpha_t}{1-\alpha_t}p_\theta=\frac{-\dot\alpha_t}{1-\alpha_t}p_\theta(x_0^\ell=v\mid x_t)$；白話「被遮位置以總 rate $\frac{-\dot\alpha_t}{1-\alpha_t}$ 翻開，翻成哪個字按 $p_\theta$ 抽——上一單元那枚硬幣 $\frac{\bar\alpha_{t-1}-\bar\alpha_t}{1-\bar\alpha_t}$ 的連續時間版」
11. ［C］（Bridge）三個小問題可以正面回答了：多加一條「回到 `[MASK]`」的管子
12. ［附錄］Details 兩狀態手算＋一般驗證、Bregman。

**U5.3 Remasking：取樣器多一條管子**

1. ［Q］「翻開就固定」在 rate 的語言裡，是一根流量為零的管子。把那個閥門打開一點，會壞掉什麼？ — `<Ask>`
2. ［F］先把反向鏈畫出來 — 唯一的管子 `[MASK]`→$v$，rate $u_t\,p_\theta(x_0^\ell=v\mid x_t)$，$u_t:=\frac{-\dot\alpha_t}{1-\alpha_t}$；字→`[MASK]` 是 rate 為零的管子；remasking＝把它打開成 $\sigma_t$；符號 Remark：這一篇借走 $u$ 與 $\sigma$ 兩個字母
3. ［C］只做這件事會動到邊際 — `[MASK]` 比例會高於 $1-\alpha_t$，網路面對沒見過的輸入
4. ［Q＋C］加一條「回到 `[MASK]`」的 rate $\sigma_t$，對應 U3.1 那一族取樣器裡的哪個旋鈕？順著對應能不能推出邊際不變的條件？ — Q1 → 排除「訓練的 $\gamma_t$」與「變成 uniform」（forward 沒動）→ 是 $\varepsilon_t$：推出去（噴聲）＋沿 score 拉回，淨效果零
5. ［M］流量配平 — $m_t:=P(x_t^\ell=\texttt{[MASK]})=1-\alpha_t$；往回走 $\frac{dm}{ds}=-u'_tm_t+\sigma_t(1-m_t)$（流出＝翻開、流入＝重遮）；令等於原式 $-u_tm_t$ → $\boxed{u'_t=u_t+\sigma_t\frac{1-m_t}{m_t}=u_t+\sigma_t\frac{\alpha_t}{1-\alpha_t}}$；粗體「倒回 `[MASK]` 的流量 $\sigma_t(1-m_t)$，必須由多翻開的流量 $(u'_t-u_t)m_t$ 一比一補回來——rate 不相等，流量相等」；`imgs/w7-3-1.png`
6. ［C］訓練端什麼都不用改 — 多翻開的部分也按 $p_\theta$ 填；實作只是把翻開 rate 整體放大；Details joint 邊際也不變（$\sigma_t$ 不能依字，MaskGIT 式信心重遮不在此族）附錄
7. ［F］這條管子要付什麼 — 修正機制（第二次填的時候 context 比第一次完整）／每步多出的誤差（再呼叫網路、再付因子化）／「$\sigma$ 划不划算，取決於現在最大的誤差是哪一種」；demo `w7-3-remasking` 截圖：Markov toy，$\sigma=0$ 時 $N=8$ 約 0.14–0.15、$N=32/128$ 貼 0.10；推 $\sigma$ 只有 $N=8$ 降到 0.13 左右（最佳 $\sigma$ 0.25～1）；「有誤差的網路」開關：三條線上抬且 $\sigma$ 補不回來——「修得動 context 不完整的錯，修不動網路本來就估偏的錯」
8. ［T］兩個旋鈕，現在分開了 — uniform 的修正能力是**訓練噴聲**、remasking 是**取樣噴聲**（第五個旋鈕）；U4.4「能不能兩個都要」答案是可以；Campbell 的 $\eta$、Gat 的 corrector 是同一構造 $(\sigma_t,\sigma_t\frac{\alpha_t}{1-\alpha_t})$
9. ［C］（Bridge）換一個起點：像 FM 那樣先寫條件路徑

**U5.4 Discrete Flow Matching：條件路徑、Rate 與配對**

1. ［Q］兩個字之間沒有中點。那 flow matching 的「條件路徑」在離散空間裡是什麼？ — `<Ask>`；Remark：時間方向與 Gat et al. 相反、$\kappa_t=1-\alpha_t$
2. ［F］中心式（無 boxed，本篇中心）— $p_t(x\mid x_0,x_1)=(1-\kappa_t)\delta_{x_0}(x)+\kappa_t\delta_{x_1}(x)$，$\kappa_0=0,\kappa_1=1$ 單調；白話「機率可以插值：時刻 $t$ 這個 token 以 $1-\kappa_t$ 還是 $x_0$、$\kappa_t$ 已變成 $x_1$，沒有第三種可能——一枚只翻一次的硬幣」；$L$ 個位置獨立
3. ［C］它就是上一個單元的兩條鏈 — $x_1$＝全 `[MASK]` 是 absorbing、$x_1$ 均勻是 uniform；source 也可以是「另一句話」（序列到序列，不需 `[MASK]`）
4. ［M］條件 rate：一行 — forward「還沒跳」機率 $1-\kappa_t$ 衰減 → $R_t=\frac{\dot\kappa_t}{1-\kappa_t}$（代 $\kappa=1-\alpha$ 得 $\beta_t$ ✓）；生成方向「還在 $x_1$」機率 $\kappa_t$ 衰減 → $\bar R_t=\frac{\dot\kappa_t}{\kappa_t}$（代 absorbing 得 $u_t$ ✓）；「端點決定、不需網路」
5. ［F］demo `w7-4-token-path` 截圖 — 六根柱子同步；$\kappa_t=t$ 時 $t=0.1$ forward rate 1.11、生成 rate 10.00，$t=0.9$ 反過來（兩端要 clamp）；換 $\kappa_t=1-\cos(\pi t/2)$ 的數字
6. ［M］條件目標平均起來，還是對的嗎？ — 定義邊際 rate $\bar R_t(x\to y):=\mathbb E[\bar R_t(x\to y\mid x_0,x_1)\mid x_t=x]$；證明三拍（每組端點的 forward equation 線性／乘 $\pi$ 求和／認出後驴平均）；紫色「與 CFM 定理 1 **逐字相同，只換了方程式**」；順手檢查仍是合法 rate matrix；`imgs/w7-4-1.png` 兩個世界並排
7. ［C］Details：定理 2 離散版 → mask source 下 $\bar R_t(x\to x^{(\ell\to v)})=\frac{\dot\kappa_t}{\kappa_t}p(x_0^\ell=v\mid x_t)$，自然 loss 是 cross-entropy；一般 source 多一個 joint posterior（uniform context 不乾淨的式子化）（附錄可）
8. ［C］這個框架多給了什麼 — source 任意／schedule 與 source 可逐位置不同／取樣器的 stochasticity（Campbell $\eta$、Gat corrector）
9. ［Q＋T］配對 $\pi(x_0,x_1)$ 在離散空間裡，把獨立配對換成別的，還有 U3.4「拉直軌跡」的意義嗎？ — Q1（題幹先釘住「上一篇的 $\sigma_t$ 不是 $\gamma_t$」）→ 三欄：mask source 沒東西可配／uniform source 可配但拉直鏈每一環都換了（無直線、無交叉，有限步誤差來自因子化，由資料條件相依決定）／成對資料（原文與譻文、結構與序列 Multiflow）；匾額「拉直的意義消失，對齊的意義留下」；「『交叉』歸『每步翻開幾個』與 remasking 取樣器管」

**U5.5 應用：語言模型、蛋白質序列、圖**

1. ［Q］看到一篇離散生成的論文，要怎麼一句話說出「它動了哪一格」？ — `<Ask>`
2. ［T］一個離散模型要填哪三格 — 槽位表：**path**（forward chain／source 與 $\kappa_t$）、**target**（網路回歸什麼：$x_0$ logits＋加權 CE，或比值＋score entropy）、**sampler**（步數、每步翻開幾個、有沒有 $\sigma_t$）；「沒有新數學」
3. ［T］語言：LLaDA 三格 — absorbing 線性／$x_0$ logits 加權 CE（權重 $1/t$）雙向 transformer／block 半 AR＋low-confidence remasking（不保持邊際）；與 AR 的速度／品質／修正權衡（$L/N$）
4. ［Q＋F］最常被講的優點是可以平行生成——如果速度優勢會縮回去，這條路線真正贏的是什麼？ — Q1 → 匾額「平行的上限不是架構決定的，是資料的條件相依決定的」；demo `w7-5-blocks` 截圖：$B=1$（16 次呼叫）0.098＝AR；$B=16$ 一步 0.504＝每格獨立；$B=4$（8 次）0.172「一半呼叫走完約八成」；相依 0.7 時範圍變窄 0.299／0.498；三件留下來的：雙向 context、取樣預算可調不必重訓、同一 loss 是表徵學習目標；KV cache 成本
5. ［C］蛋白質序列 — 長程雙向相依、任務多是填空；EvoDiff（OA-AR／uniform 變體含替換矩陣）、DPLM（masked diffusion 當預訓練）、Multiflow（結構 FM＋序列 DFM 成對＝對齊）
6. ［C］圖：DiGress — 為什麼不能加 Gaussian noise（稠密實數矝陣不再是圖）；path 朝 marginal 走的 uniform 型鏈 $Q_t=\bar\alpha_tI+(1-\bar\alpha_t)\mathbb 1m^\top$（$\mathbb 1m^\top$ 也是投影，D3PM 代數一字不改）；target 節點與邊的 $x_0$ logits、permutation equivariant；sampler 一步更新全圖、因子化誤差明顯（一個碳最多四根鍵）
7. ［T］回頭看這張表 — 四系統回填；兩個觀察：target 欄幾乎不變（都學 $x_0$ posterior）、sampler 欄變動最快（都在對付因子化誤差、不必重訓）；`imgs/w7-5-1.png`；Remark 哪些數字是量的、哪些是論文報的
8. ［C］Details：這條線上其他名字（MDLM、SEDD、BD3-LM、Mercury、Gemini Diffusion）附錄

**U5.6 實作：τ-leaping、Remasking 與比值學習**

1. ［C］沿用上一單元的 toy＋連續時間設定 — $\alpha_t=1-t$、$\beta_t=1/(1-t)$、$u_t=1/t$；新增 `exact_marginal`、`exact_ratios`；notebook QR
2. ［K］步驄 1：`tau_leap_step`（CTMC 的 Euler 法：凍結步首 rate、所有位置獨立決定、`1−exp(−u_total τ)` 翻開、`1−exp(−σ τ)` 遮回）＋與精確跳步逐行對照（$\frac{\bar\alpha_s-\bar\alpha_t}{1-\bar\alpha_t}$ vs $1-e^{-u_t\tau}$，$\tau\to0$ 一致）；Remark 兩端 rate 發散怎麼收
3. ［F］圖 a／demo `w7-6-tauleap` — 精確跳步 4/8/32 步 63–65／78–79／94–95%（理論 64.1／78.6／94.0%）；τ-leaping 57–59／73–74／93–94%；最大差 5–8 個百分點、集中在步數最少處；「強制每步剛好一格」：精確跳步 100%、τ-leaping 71–72%；`imgs/w7-6-1.png`
4. ［Q＋C］精確跳步每個步數都不輸、又不需要 rate——那為什麼還要學 τ-leaping？ — Q1 → closed form 只對「寫得出 $\bar Q_t$」的鏈存在，本單元每件事都破壞這前提（remasking、逐位置 source、比值直接寫 rate）→ 匾額「rate 是比 $\bar Q$ 更通用的介面」；「精確的是逐位置邊際，不是 joint」（兩取樣器差 5–8 點 vs 因子化誤差三十幾點）
5. ［K＋F］步驟 2：remasking — 邊際檢查（$t=0.5$ 時 `[MASK]` 比例應為 0.5，拿掉補償會上升）；圖 b $\sigma\in\{0,0.5,1,2\}$ 的 KL／合法率 vs 步數疊在 U4 圖 b 上；「先寫下猜測」；兩種網路都跑
6. ［K］步驟 3：`score_entropy_loss`（`a = α/(1−α)·one_hot(x0)`、`bregman = s − a·log s + K_a`、`w = 1/(1−t)`）＋三個比對（vs 精確比值、vs MDLM×$\alpha_t/(1-\alpha_t)$、用比值直接做 τ-leaping）；「常見 bug：把 $\alpha_t/(1-\alpha_t)$ 寫反」
7. ［T］作業四題（uniform 比值／$\sigma_t$ schedule 以 $\int\sigma_t(1-m_t)dt$ 為基準／信心排序 vs remasking／Gillespie＝任意順序 AR）

**收尾**：quiz 選 w7-0-b（沒有單位）、w7-1-d（非零非對角至多 $L(K-1)$）、w7-2-a（只有比值要學）、w7-3-b（流量相等方向相反）；Bridge「只要積分不是零、只要每步翻開超過一個，有限步就有誤差。下一個單元換一個問法：能不能不走步，直接學那個一步到位的映射？」。

**沿用 W2**：#30、#31（序列版型）。
**新製圖**：三水桶＋水管＋閥門；把水管倒過來（同圖反向）；兩條管子流量配平（若 `imgs/w7-3-1.png` 不夠）；只翻一次的硬幣（六根柱子上下半）。
**demo**：`w7-0-two-languages`、`w7-1-ctmc`、`w7-2-ratios`、`w7-3-remasking`、`w7-4-token-path`、`w7-5-blocks`、`w7-6-tauleap`。

---

### 4.6 Week 8 · U6 Consistency Models（7 篇，約 71 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 6 | 4 |
| U6.0 不走了，直接學那一步 | 15 | 9 |
| U6.1 Progressive Distillation | 14 | 8 |
| U6.2 Consistency Function | 22 | 11 |
| U6.3 CD 與 CT：沒有老師，憑什麼？ | 25 | 12 |
| U6.4 iCT 與 sCM | 20 | 11 |
| U6.5 多步 CM 的極限 | 12 | 7 |
| U6.6 實作 | 15 | 8 |
| quiz＋Bridge | 11 | 3 |

**慣例卡（開場 #3）**：時間方向**切回** $t=0$ 資料、$t=T$ 噴聲（EDM/CM 慣例，$T=80$）；$x_t=x_0+t\epsilon$（VE，噴聲標準差就是 $t$，沒有 schedule 符號）；PF-ODE $\frac{dx}{dt}=\mathbb E[\epsilon\mid x_t]=-t\nabla\log p_t$（生成從 $T$ 解到 0）；$\psi_{s\to t}$ 下標**例外**沿用 FM 慣例；w8-0 的半頁轉換表（DDPM／FM／EDM 三欄：資料端、噴聲端、中間點、ODE 速度、一步映射目標、對照 $t=\frac{1-s}s$）整張放。開場 #4：本單元三問座標——配對從哪來／學速度還是學終點／要不要 teacher。W2 #32、#33 重用。

**U6.0 不走了，直接學那一步**

1. ［Q］生成一定要走那麼多步嗎？很慢ㄟ — W2 #32 重用（log-log 圖）
2. ［C］回到那條不等式 — $\lesssim C_Lh\int\|\ddot x_t\|dt$ 往左看到底：積分只有 $S(\pi)=0$ 才為零，reflow 一兩輪就停；只要不為零，$h=1$ 就有誤差；「先學速度場再積分」的一步生成是永遠只能逼近的極限
3. ［B］能不能不學速度場，直接學那個映射？
4. ［C］要學的物件叫什麼 — flow map $\psi_{s\to t}(x_s)=x_t$；生成＝算一次 $\psi_{0\to1}$；「$N$ 步 Euler 就是 $N$ 個『假設這一小段是直線』的映射疊起來」；新目標 $G_\theta\approx\psi_{0\to1}$，**而且這次知道 $G$ 該等於什麼**（由 PF-ODE 決定的一對一映射）
5. ［Q＋C］手上有訓好的 FM／diffusion 可以跑 ODE——最笨、最直接的做法是什麼？哪裡好、哪裡不好？ — Q1 → teacher 跑 ODE 收集 $(x_0,x_1)$、回歸 $G_\theta(x_0)\approx x_1$；一好：MSE 極小是 $\mathbb E[x_1\mid x_0]=\psi_{0\to1}(x_0)$，ODE 一對一所以不糊；三不好：資料太貴／學生只看過 $t=0$／只是蒸餾、上限是 teacher → 三篇分別對付
6. ［T］這件事我們其實做過 — reflow vs 直接回歸表（配對怎麼來相同：teacher 跑 ODE；學什麼不同：速度／終點；產物：更直的速度場仍要積分／一個一步映射）；`imgs/w8-0-1.svg`；三問座標
7. ［T］切換時間方向 — 轉換表（＝開場 #3 再放一次，逐格講）；$x_t=x_0+t\epsilon$、$\frac{dx}{dt}=\mathbb E[\epsilon\mid x_t]$；FM 對照 $x^{\text{FM}}_s/s=x_{\text{data}}+\frac{1-s}s\epsilon$，$t=\frac{1-s}s$
8. ［M］Details：VE 路徑的 PF-ODE 為什麼是 $\mathbb E[\epsilon\mid x_t]$ — forward SDE $dx=\sqrt{2t}\,dW$ 代 PF-ODE 公式／Tweedie $\nabla\log p_t=-\frac{x-\mathbb E[x_0\mid x_t]}{t^2}$／U3 一般式取 $\alpha=1,\sigma=t$ 交叉驗證（附錄）
9. ［C］（Bridge）下一篇的物件 $f(x_t,t)=x_0$：任何 $t$ → 資料

**U6.1 Progressive Distillation：學生一步，等於老師兩步**

1. ［S］不要先造資料，邊走邊教 — 規則「學生一步，要到 teacher 走兩步的地方」；$N\to N/2$、重複 $\log_2N$ 輪、每筆兩次 teacher 呼叫；「學生變成下一輪的老師」；新製圖：階梯逐輪減半（無文字）
2. ［M］寫成式子 — teacher 一步 DDIM $x_{t'}=\frac{t'}tx_t+(1-\frac{t'}t)\hat x_0(x_t,t)$「往 $t'$ 走就是把 $x_t$ 與去噴結果按 $t'/t$ 線性混合」→ 走兩步得 $\tilde x$ → 學生一步同形式、要求落在 $\tilde x$ → 反解 $\boxed{x_0^{\text{target}}=\frac{\tilde x-\frac{t''}tx_t}{1-\frac{t''}t}}$、$\mathcal L_{\text{PD}}=\mathbb E[w(t)\|\hat x_0^\theta(x_t,t)-x_0^{\text{target}}\|^2]$
3. ［C］三個性質 — 目標是確定的（DDIM 確定性，一個點不是分佈）／學生看過所有 $t$／從 teacher 初始化
4. ［Q＋C］每一輪的老師都是上一輪的學生。為什麼不乾脆讓第一個學生直接學 teacher 的 $N$ 步，一次到位？ — Q1 → 一次到位就是上一篇的直接回歸；PD 換到資料成本＋**難度階梯**（前幾輪兩小步幾乎共線≈直線，最後幾輪一步跨過中段）；代價：上一輪誤差進本輪訓練資料（同 reflow）；順帶解釋 PD 蒸到 4 步好、1 步明顯下降
5. ［F］demo `w8-1-1` 截圖 — 32 步→1 步（5 輪）；理想學生 vs 帶逼近誤差的 surrogate，分開看「兩步合一」本身與誤差沿輪次累積
6. ［C］誤差怎麼累積 — 兩種誤差進學生（teacher 自帶＋本輪逼近）疊 $\log_2N$ 輪；「曲率以表達難度回來」
7. ［T］解掉了什麼、留下什麼 — 三個「不好」記帳：資料貴 ✓解掉／只看過 $t=0$ 解一半（固定步長）／上限 teacher 沒解且更明顯；Details $v$-prediction 出處（附錄）
8. ［C］（Bridge）把「一步」重新定義：不是跳到網格下一格，而是從任何一點直接跳到終點

**U6.2 Consistency Function：同一條軌跡，同一個終點**

1. ［F］先看一條軌跡 — W2 #33 重用；「軌跡上每一個點都會走到同一個終點」→ 定義 $f(x_t,t)=$ 該點所在 PF-ODE 軌跡在乾淨端的位置，整條軌跡上是常數
2. ［C］$f(\cdot,t)=\psi_{t\to\varepsilon}$；$G=f(\cdot,T)$ 只是 $t=T$ 那一片 — 粗體「所以『學 $f$』比『學 $G$』要求更多」；$\varepsilon=0.002$ 乾淨端（讀時當 $x_0$）
3. ［C］這個 $f$ 必須滿足什麼 — 邊界 $f(x,\varepsilon)=x$／自我一致性 $f(x_t,t)=f(x_{t'},t')$ 對同一軌跡上所有 $t,t'$；兩條合起來唯一決定 $f$；反例：常數函數 $f\equiv c$ 滿足自我一致性——少了邊界就有平凡解
4. ［Q＋C］下一節把邊界寫死在架構裡。但看起來更省事：在損失裡加一項 $\|f_\theta(x,\varepsilon)-x\|^2$ 讓網路自己學會邊界。差在哪？ — Q1 → 一句答案「差在平凡解還在不在搜尋空間裡」；軟約束兩項拉扯、停在中間、拉扯不隨訓練變小；寫進架構對每組參數成立；原則「答案定義的一部分寫進架構，希望大致成立的才放損失」；預告 CT 全靠這個錨才能不用 teacher
5. ［F］中心式 — $\boxed{f_\theta(x,t)=c_{\text{skip}}(t)\,x+c_{\text{out}}(t)\,F_\theta(x,t)}$，$c_{\text{skip}}(\varepsilon)=1,c_{\text{out}}(\varepsilon)=0$；EDM 係數 $c_{\text{skip}}=\frac{\sigma_d^2}{(t-\varepsilon)^2+\sigma_d^2}$、$c_{\text{out}}=\frac{\sigma_d(t-\varepsilon)}{\sqrt{\sigma_d^2+t^2}}$；`imgs/w8-2-2.svg`；白話「$t\approx\varepsilon$ 幾乎恆等（終點就在腳邊）；$t$ 大時 $f_\theta\approx\sigma_dF_\theta$」
6. ［C］借用了 denoiser 的參數化來表示一個不是 denoiser 的東西 — denoiser 輸出 $\mathbb E[x_0\mid x_t]$（一對多平均）；$f$ 輸出 ODE 終點（一對一）；兩者 $t\to\varepsilon$ 都趨近恆等，可從 diffusion 初始化
7. ［F］中心式二 — $\boxed{\mathcal L_{\text{CM}}=\mathbb E\big[\lambda(t_n)\,d\big(f_\theta(x_{t_{n+1}},t_{n+1}),\,f_{\theta^-}(\hat x_{t_n},t_n)\big)\big]}$；逐項讀：相鄰兩格各自跳到終點落點要相同／$d$（$\ell_2$ 或 LPIPS）／$\lambda$（原文取 1）／$\theta^-$ 側 stop-gradient（原文 EMA）；「$N$ 在 CM 是相鄰的密度，不是取樣步數」
8. ［C］為什麼只用相鄰點就夠、為什麼 stop-gradient — 歸納：$t_1=\varepsilon$ 由架構正確（錨）→ $(t_n,t_{n+1})$ 項把 $t_{n+1}$ 拉向已對的 $t_n$ → 走一小步局部誤差 $O(\Delta t^2)$；雙側梯度會壓成幾乎不隨 $x$ 變、只在 $\varepsilon$ 附近急轉（退化解）→ 單向：「已經知道的答案」教「要被教會的」；新製圖：錨＋單向箭頭鏈
9. ［F］demo `w8-2-1` 截圖 — 沿軌跡拖動時間，真值終點不動；三種 surrogate 狀態輸出曲線由起伏變平
10. ［C］一步生成就是抽 $x_T\sim\mathcal N(0,T^2I)$、算 $f_\theta(x_T,T)$；Details 與 PD 的關係（附錄）
11. ［Q］（Bridge）損失裡有一個空格：$\hat x_{t_n}$——同一條軌跡上往乾淨端走一格的點——怎麼算？

**U6.3 Consistency Distillation 與 Consistency Training：沒有老師，憑什麼？**

1. ［C］空格的兩個答案並排 — CD：$\hat x^{\text{CD}}_{t_n}=x_{t_{n+1}}+(t_{n+1}-t_n)\,t_{n+1}\,s_\phi(x_{t_{n+1}},t_{n+1})$（teacher score 走一步 Euler，是蒸餾）；CT：$\hat x^{\text{CT}}_{t_n}=x_0+t_n\epsilon$（同一組 $(x_0,\epsilon)$ 在 $t_n$ 再造一次，一行程式 `x_hat = x0 + t[n]*eps`，不需網路）；右側「皺眉」卡：$x_0+t_n\epsilon$ **不在** $x_{t_{n+1}}$ 的 PF-ODE 軌跡上，在條件直線上——「靠近的錯點還是錯點」
2. ［Q］CT 沒有 teacher、沒有 score，$x_0+t_n\epsilon$ 也明明不在同一條軌跡上。它憑什麼能學到 consistency function？ — Q1；三類常見答案（「$\Delta t$ 小差不多」對一半／「$f_\theta$ 自己平均掉」方向對／「條件與邊際」正確）
3. ［M］算一次條件期望 — 改寫 $x_0+t_n\epsilon=x_{t_{n+1}}-\Delta t\cdot\epsilon$「從 $x_{t_{n+1}}$ 退 $\Delta t$，但退的方向是自己的 $\epsilon$，不是平均方向」→ 多組 $(x_0,\epsilon)$ 對同一 $x_{t_{n+1}}$ → 固定 $x_{t_{n+1}}$ 取後驄平均（線性）→ Tweedie $\mathbb E[\epsilon\mid x_t]=-t\nabla\log p_t$ → $\mathbb E[x_0+t_n\epsilon\mid x_{t_{n+1}}]=x_{t_{n+1}}+\Delta t\,t_{n+1}\nabla\log p_{t_{n+1}}(x_{t_{n+1}})$；紫色「正是 CD 的一步 Euler，而且用的是**真實** score」；**conditional trick 的 consistency 版本**（累積表第 6 列）
4. ［B］CT 不是「沒有 teacher」，它的 teacher 是資料本身
5. ［C］但這裡有兩個新的細節 — 細節一：條件目標先進非線性 $f_{\theta^-}$ 再比較，$\mathbb E[f_{\theta^-}(x_0+t_n\epsilon,t_n)\mid x_{t_{n+1}}]\neq f_{\theta^-}(\hat x^{\text{CD}}_{t_n},t_n)$，Jensen gap $\sim\Delta t^2\times f''$；細節二：Euler 本身的曲率誤差 $\frac12\Delta t^2\|\ddot x\|$（CD 也有）；兩者隨 $\Delta t\to0$ 消失（Song et al. 定理精神：CT 與真 score CD 損失差 $o(\Delta t)$）
6. ［F］條件目標的扇形 — demo `w8-3-1` 截圖：單筆 CT 目標散佈成扇形（半徑＝variance $O(\Delta t)$）、扇子質心＝Euler 點、質心到真實點＝bias $O(\Delta t^2)$
7. ［C］為什麼時間網格要慢慢變細 — bias $O(\Delta t^2)$ 累積 $N$ 格 → $O(\Delta t)$；variance 標準差 $O(\Delta t)$；訊號（兩點輸出真實差距）也是 $O(\Delta t)$ → 訊噪比不改善 → curriculum $N$ 從 2 到 150（iCT 指數到 1280）
8. ［C］Details：CT 的目標其實是假設這一段是直線——接回配對交叉 — 三個點（CT 沿 $-\epsilon$ 直線、Euler 沿平均方向直線、真實曲線）；若配對不交叉則 bias 幾乎零 →「先拉直、再做 CT」（可附錄）
9. ［T］CD 與 CT 各付什麼 — 對照表（$\hat x_{t_n}$／需要／誤差／上限／對 $N$ 的敏感度）；「CT 是獨立的生成模型家族」
10. ［C］（Bridge）iCT／sCM 每一項技術都要問：它在對付 bias、variance，還是 boundary？
11–12. ［附錄］Details 直線假設完整版。

**U6.4 讓 CT 訓得起來：iCT 與連續時間的 sCM**

1. ［T］訓練不穩，是哪三件事在作用 — 三格 boundary／bias／variance（本篇座標系）；「新的物件只有一個：沿軌跡的全導數」
2. ［Q＋C］第一個改動是把 target 的 EMA 拿掉——目標會動的訓練不是都要靠 EMA 才不發散嗎？拿掉之後為什麼不會崩？ — Q1 → RL 的 target 要 EMA 因為無外部錨；CT 被兩件事釘住：邊界寫在架構、$t_n<t_{n+1}$ 單向；定理條件 $\theta^-=\theta$，EMA 滯後讓極限換目標＝到不了的 bias；匾額「EMA 在這裡壓的不是不穩定，是收斂的位置」；仍要 stop-grad 防退化解
3. ［T］iCT：五個改動，各對一格 — 拿掉 EMA（bias）／pseudo-Huber $d=\sqrt{\|x-y\|^2+c^2}-c$，$c=0.00054\sqrt D$（variance）／$\lambda=1/\Delta t$（variance 均衡）／lognormal 時間取樣 $P_{\text{mean}}=-1.1,P_{\text{std}}=2.0$（預算放在有訊號的中段）／$N(k)=\min(s_02^{\lfloor k/K'\rfloor},s_1)+1$，$s_0=10,s_1=1280$（bias↔variance）；Details Fourier 尺度、dropout（附錄）
4. ［Q］全部是在離散網格上周旋。能不能讓 $\Delta t\to0$？
5. ［F］中心式 — $\boxed{\frac{d}{dt}f(x_t,t)=\partial_tf(x_t,t)+\nabla_xf(x_t,t)\cdot\frac{dx_t}{dt}=0}$ 沿每一條 PF-ODE 軌跡；白話「時間走、位置不動的變化 ＋ 位置隨軌跡移動的變化，兩項恰好相消——兩支箭頭的合力為零」；demo `w8-4-2` 截圖
6. ［C］沒有 $\Delta t$ 之後 — 兩個 bias（Euler 曲率誤差與 Jensen gap）一次消失；$\ell_2$ 損失 $N\to\infty$ 的極限梯度 $\nabla_\theta\mathbb E[f_\theta^\top\frac d{dt}f_{\theta^-}]$；conditional trick：$\dot x_t$ 用條件速度 $\epsilon$，全導數對 $\dot x_t$ 線性 → 期望精確、無 Jensen gap（sCT）
7. ［K］全導數的 JVP：三行程式 — `torch.func.jvp(f,(x,t),(v,ones))` 得 $\nabla_xf\cdot v+\partial_tf$，成本≈一次前向；為什麼不算 Jacobian
8. ［C］sCM：為什麼 2023 年寫出來卻訓不穩 — 問題在 $\frac{d}{dt}f_{\theta^-}$ 的數值行為；TrigFlow $x_t=\cos t\,x_0+\sin t\,z$，$f_\theta=\cos t\,x_t-\sin t\,\sigma_dF_\theta(\frac{x_t}{\sigma_d},t)$（$c_{\text{skip}}=\cos t$、$c_{\text{out}}=-\sigma_d\sin t$ 有界；與 diffusion 共用網路；$t_{\text{EDM}}=\sigma_d\tan t$）；`imgs/w8-4-1.svg`
9. ［M］全導數分解成兩個括號 — $\frac{d}{dt}f_{\theta^-}=-\cos t\,(\sigma_dF_{\theta^-}-\frac{dx_t}{dt})-\sin t\,(x_t+\sigma_d\frac{dF_{\theta^-}}{dt})$；「兩個括號各是該為零的東西：第一個是 $F$ 與真速度的差（初始化後小）；第二個含 $\frac{dF}{dt}$——網路對時間的敏感度，這是不穩定的來源」
10. ［C］穩住它 — tangent normalization $g\leftarrow g/(\|g\|+c)$，$c=0.1$「只改每樣本權重不改方向，極限解不變」／tangent warmup（$r$ 前一萬步 0→1，先只用第一個括號）／時間 embedding、double normalization、adaptive weighting——共同動機「讓 $f$ 對 $t$ 平滑」
11. ［T］四個方法各站在哪裡 — 技術總表 12 列（技術／出處／對付的誤差／一句話）；「$\Delta t\to0$ 消 bias 的代價是算全導數、面對 $\frac{dF}{dt}$；sCM 其餘技術都為此」

**U6.5 多步 CM 的極限：每一步都得回到 x₀**

1. ［S］一步不夠，那就兩步 — 四步程序：$\hat x_0=f_\theta(x_T,T)$ → 重新加噴 $x_{\tau_1}\leftarrow\hat x_0+\tau_1z_1$（$z_1$ **新抽**）→ $\hat x_0\leftarrow f_\theta(x_{\tau_1},\tau_1)$ → 再來；「兩步 FID 常是一步的一半，然後增益迅速變小」
2. ［Q］ODE 取樣的誤差隨步數以 $O(1/N)$ 下降。多步 CM 為什麼不是這樣？為什麼第二步幫很多，之後就不再照那個速率改善？ — Q1；三類常見答案都對，是同一件事的三個面
3. ［F］第一面：這不是在離散化任何東西 — ODE 多步是同一條軌跡的 $N$ 段折線，有連續極限；重加噴的 $x_{\tau_1}$ 由新的獨立 $(\hat x_0,z_1)$ 出發、不在原軌跡上——畫一條新的隨機方向的條件直線再沿邊際軌跡走回來，「起點與終點的對應每一步都在換」＝配對交叉；demo `w8-5-1` 截圖（跳、重加噴、換軌）
4. ［C］第二面：每一跳的誤差都是「滿的」 — 第 $k$ 跳誤差＝$\|f_\theta-f\|$ 在該點，與 $k$ 無關，最後一跳決定輸出；第二步幫很多是因為 $\tau_1<T$ 的映射更簡單（換了一個容易的問題）；$\tau$ 太小退化成恆等 → 最佳 $\tau_1$ 在中段
5. ［C］第三面：沒有 score，就沒有拉回 — Langevin 修正＝drift $\varepsilon s_tdt$＋噴聲 $\sqrt{2\varepsilon}dW$ 配套；CM 只有噴聲項，把誤差平移；$f=\psi_{t\to\varepsilon}$ 只知道終點不知道密度（定義使然）；Details「CD 有 teacher score 能不能做 SDE？」（附錄）
6. ［T］同一個結構問題，三種語言 — 連續 CM／離散時間因子化誤差／離散連續時間 remasking 四行對照；共同：跳沒有中間狀態，修正只能回起點重來；Sabour et al. Theorem 3.1：對 Gaussian 資料存在次佳 $f_\theta$ 使步數超過某 $N$ 後 $W_2$ 上升（**不用形狀詞描述曲線**）
7. ［B＋Q］收在問題上 — 病根一句「$f$ 只會跳到 $\varepsilon$」；若能從 $t$ 跳到任何中間 $s$、留在同一軌跡上，ODE 結構就回來——雙時間映射要滿足什麼、怎麼訓？（W2 #34 預告）

**U6.6 實作：三種「一步」放在同一張圖上**

1. ［C］設定三件事 — 座標（$\varepsilon=0.002$、$T=10$、$\sigma_d=1$）、teacher 用 `exact_score_ve`（把 teacher 誤差從實驗裡拿掉）、評估 2000 樣本 $W_2$「同一把尺」；notebook QR
2. ［K］步驟 1：`karras_grid`、`c_skip`/`c_out`、`ConsistencyModel`；檢查點：$t=\varepsilon$ 恆等、$c_{\text{skip}}$ 單調降
3. ［K］步驟 2：`train_cm` — CD／CT 只差 `x_hat` 一行；stopgrad 不用 EMA；`huber`；$\lambda=1/\Delta t$；檢查點「沿精確軌跡 8 點輸出平線」；Details 固定 $N$ 訓不起來用 curriculum（$s_0=4,s_1=128$）
4. ［F］圖 a：CT 的 bias 對 $N$ — $N\in\{2,\dots,256\}$；先猜再出：CD 單調降趨平、CT 先降後升、小 $N$ 重合
5. ［F］圖 b：條件目標的扇子（不訓練）— 後驟抽 500 個 $x_0$；`(ct.mean(0)−euler).norm()` ≲ 5e-3 驗證 U6.3 中心等式；log-log 斜率 1（variance）與 2（bias）
6. ［F］圖 c 主圖：三種「一步」 — CD（$N=128$、精確 score）、CT（最佳 $N$）、reflow×2（座標轉換 $x_T/(1+T)$，寫成 $x_T/T$ 會差 10%）；每根長條標誤差來源（MLP 逼近極限／bias–variance 極限／$\int\|\ddot x\|dt$ 尚未為零）；「把這張圖留好，U7 加 MeanFlow」
7. ［Q＋C］三個東西拿到的資源完全不同（精確 teacher／不用 teacher／訓出來的速度場跑兩輪）——這樣比，比得出什麼？比不出什麼？ — Q1 → 比得出「拿這些資源能做到多好」，比不出「哪個方法好」；三個沒控制住（teacher 品質、訓練預算、配對）各對應作業；「一步生成沒有單一瓶頸」
8. ［F］圖 d：多步 CM 還吃不吃步數？ — `multistep_cm`、$k$ 掃到 64、疊 FM Euler 斜率 $-1$ 線；真值 $f$ 對照（任何步數都精確 → 曲線形狀全來自 $f_\theta$）；**距離不要用 $W_2$**（$n=1000$ 兩組真資料互比就有 0.3 地板），用無偏 energy distance（$n=8000$ 地板 $10^{-4}$）；作業五題

**收尾**：quiz 選 w8-0-b（直接回歸不糊因 ODE 一對一）、w8-2-c（$c_{\text{skip}}(\varepsilon)=1$ 讓邊界對任何 $\theta$ 成立）、w8-3-a（CT 目標的條件期望＝真實 score 的 Euler）、w8-5-c（真值 $f$ 多步任何步數都精確）；Bridge「$f$ 只會跳到終點，多步必須回到 $x_0$ 再加噴。下一個單元：能不能從 $t$ 直接跳到中間的 $s$，不回終點、不重加噴？」。

**沿用 W2**：#32、#33、#34（預告）。
**新製圖**：階梯逐輪減半（PD）；錨＋單向箭頭鏈（stop-gradient 歸納）；跳回終點＋重加噴＝換軌（U6.5，也給 U7.0 用）。
**demo**：`w8-1-1`、`w8-2-1`、`w8-3-1`、`w8-4-2`、`w8-5-1`（路徑在 `week-8/`）。

---

### 4.7 Week 9 · U7 Flow Maps 與分佈匹配（7 篇，約 70 張）

**時間分配**

| 篇 | 分鐘 | 張 |
| --- | --- | --- |
| 開場 | 6 | 4 |
| U7.0 不回到終點，能不能直接跳到中間？ | 16 | 9 |
| U7.1 Flow Map Matching：三條恆等式 | 18 | 9 |
| U7.2 MeanFlow | 25 | 12 |
| U7.3 Shortcut 與 Align Your Flow | 16 | 9 |
| U7.4 分佈匹配 | 20 | 10 |
| U7.5 統一表與選擇指南 | 12 | 7 |
| U7.6 實作 | 13 | 6 |
| 全課收尾＋quiz | 14 | 4 |

**慣例卡（開場 #3）**：切回 FM 慣例 $t=0$ 噴聲、$t=1$ 資料、$x_t=(1-t)x_0+tx_1$、條件速度 $x_1-x_0$；**邊際速度改記 $v_t(x)$，$u$ 留給平均速度 $u(z,r,t)$**；單獨的 $u$＝progressive 恆等式的中間時刻；書的 $\Psi_{s\to t}$ 下標與本篇 $\psi_{t\to s}$ 相反；$s$ 在 U7.3 有四個意思——靠「吃幾個輸入」分辨（$s_\theta(x,t,d)$ Shortcut／$s$ 目標時刻／$s_\phi$ teacher score／$s_\theta(x,t)$ score）。W2 #34 重用。

**U7.0 不回到終點，能不能直接跳到中間？**

1. ［C］上一個單元留下的病根 — 三個理由指向同一個動作「回到終點再加噴」：跳回終點是浪費、重新加噴是有害（獨立配對把交叉請回來）；新製圖（U6.5 同款）
2. ［Q］有沒有東西能從 $x_t$ **直接**送到 $x_s$，不經終點、不加噴？ — 節標題當問句；W2 #34 重用
3. ［T］先把慣例對齊 — 開場 #3 再放一次；「翻書時會踩到：書的下標方向相反」
4. ［F］這個東西該長什麼樣 — $\psi_{t\to s}(x)=$ 經過 $(x,t)$ 的那條軌跡在時刻 $s$ 的位置（$s$ 可大於或小於 $t$）；demo `w9-0-1` 截圖（兩個時間滑桿；半群模式比較直接跳與分段跳；多步 consistency 對照畫出換軌）
5. ［Q］不看任何論文，只從定義出發：一個網路 $\psi_\theta$ 想當合格的 flow map，必須滿足哪些條件？至少列三個，各對應前幾單元的哪個物件 — Q1
6. ［M］四個條件 — 恆等 $\psi_{t\to t}=\mathrm{id}$（對應 $c_{\text{skip}},c_{\text{out}}$）／端點 $\psi_{t\to1}$＝consistency function／半群 $\psi_{s\to r}(\psi_{t\to s}(x))=\psi_{t\to r}(x)$「中途停一下不會換到另一條軌跡；多步不再需要重新加噴」／相容 $\partial_s\psi_{t\to s}(x)=v_s(\psi_{t\to s}(x))$，$\psi_{t\to t+h}(x)=x+hv_t(x)+O(h^2)$「FM 學的速度場是 flow map 的一階 Taylor 項」；不獨立：三推一、三加四推一切
7. ［T］整張表 vs 一階項 vs 切片 — FM 學一階項、CM 學 $s=1$ 的切片、本單元學整張表 $\psi_{t\to s}$
8. ［C］第一個具體實作：CTM — $G_\theta(x_t,t\to s)\approx G_{\theta^-}(\tilde x_u,u\to s)$，$\tilde x_u=\text{Solver}_{\text{teacher}}(x_t,t\to u)$「從 $x_t$ 直接跳到 $s$，要等於 teacher 先走到 $u$、再由 stop-gradient 的自己跳到 $s$——正是半群條件、第一段交給 teacher」；$u$ 兩端極限：$u\to t$ 是 CD 推廣到任意 $s$、$u=s$ 變純回歸 teacher 軌跡點；粗體「CTM 是 consistency distillation 加上第二個時間輸入，並用半群條件當損失」；Details teacher 換成對角線（$s=t$ 的 $G_\theta(x,t,t)$ 導數＝速度場）附錄
9. ［S］這個單元的路線 — U7.1 三條恆等式 → U7.2 MeanFlow → U7.3 Shortcut／AYF → U7.4 分佈匹配 → U7.5 統一表

**U7.1 Flow Map Matching：三條恆等式，三種損失**

1. ［C］從條件到損失 — 判準要變成可微分的數；條件四兩種微分＋條件三本身＝三條；核心問題粗體「速度場 $v$ 在哪一個點被需要？」
2. ［M］第一條：Lagrangian——跟著輸出點走 — $\mathcal L_{\text{Lag}}=\mathbb E\|\partial_s\psi_\theta(x_t,t\to s)-v_s(\psi_\theta(x_t,t\to s))\|^2$；「輸出點像粒子沿軌跡前進，它的速度要等於那一點的速度場；$v$ 在網路輸出點被需要 → 只能來自 teacher（distillation 專用）」
3. ［M］第二條：Eulerian——固定輸出，讓輸入沿軌跡動 — $\frac{d}{dt}\psi_{t\to s}(x_t)=\partial_t\psi_{t\to s}+\nabla_x\psi_{t\to s}\,v_t(x_t)=0$；「從同一軌跡上任何一點出發跳到 $s$ 都是同一位置，所以沿軌跡的全導數為零；$v$ 在我們自己造的輸入點 → 可用條件速度」；粗體「Eulerian 是能夠不要 teacher 的那一條」
4. ［M］Details：用條件速度代替時的一個陷阱 — 直接把 $x_1-x_0$ 塞進 squared loss：$\delta=(x_1-x_0)-v_t$，$\mathbb E[\delta\mid x_t]=0$，交叉項消失但多出 $\mathbb E\|\nabla\psi_\theta\delta\|^2$（含 $\theta$ 的 Jacobian 懲罰）→ bias；解法：含 $v$ 的部分移到 stop-gradient 目標，目標對 $v$ 線性 → 期望精確（U7.2 會用）
5. ［C］第三條：progressive——兩小步等於一大步 — $\psi_{t\to r}=\psi_{s\to r}\circ\psi_{t\to s}$，完全不含 $v$；動力學只能從「最小的那一步」$\psi_{t\to t+h}\approx x+hv_t$ 進來（teacher 或 FM 底層）；代價：一級一級往上帶的累積；沒有底層時恆等映射也是最小值
6. ［F］三條恆等式一張圖 — `imgs/w9-1-1.svg`（Lagrangian 速度在輸出點／Eulerian 在輸入點／progressive 只要兩小步等於一大步）
7. ［Q＋T］三條都在說同一件事，但只有 Eulerian 可以不用 teacher——差別到底在哪？從「速度場在哪一個點被需要」去看 — Q1 → 三列表：$v$ 被需要的位置／那個點是誰造的；「條件速度只在『我知道是哪組 $(x_0,x_1)$ 造的點』拿得到：輸入點自己造、輸出點網路吐」；progressive 是另一種依賴＝bootstrapping
8. ［T］十列方法總表 — FM／Reflow／PD／CD／CT／sCM／CTM／MeanFlow／Shortcut／AYF ×「學的物件／恆等式／$v$ 的估計量／teacher」；結論「不要 teacher 的方法全部在 Eulerian 那一欄，或在 progressive 配 FM 底層那一欄」
9. ［C］（Bridge）MeanFlow 把 Eulerian 換到「平均速度」座標，得到一條精確、可從頭訓練的式子

**U7.2 MeanFlow：平均速度與一條精確的恆等式**

1. ［C］換一個座標寫 flow map — 直接對 $\psi_\theta$ 寫 Eulerian 的兩個不順手：恆等要參數化；$s\approx t$ 時網路學一個接近恆等的映射，訊號很弱
2. ［F］中心式一 — $u(z,r,t):=\frac{\psi_{t\to r}(z)-z}{r-t}=\frac1{t-r}\int_r^tv(z_\tau,\tau)\,d\tau$；三個字母讀法「$z$ 是時刻 $t$ 的位置，$r$ 是要跳去的時刻，$u$ 是這一段軌跡上瞬時速度的平均」；$\psi_{t\to r}(z)=z+(r-t)u$；$u(z,t,t)=v(z,t)$「flow matching 是 $r=t$ 的切片，恆等自動成立」；Details 原文 $r<t$ 慣例對照（附錄）
3. ［M］把定義式微分 — 四拍：乘 $(t-r)$：$(t-r)u(z_t,r,t)=\int_r^tv\,d\tau$ → 固定 $r$、$t$ 與 $z_t$ 一起沿軌跡動，右邊微分是 $v(z_t,t)$（微積分基本定理）→ 左邊乘法法則 $u+(t-r)\frac{d}{dt}u=v$ → 全導數展開 $\frac{d}{dt}u=\partial_tu+(\partial_zu)v$（小問句「$u$ 裡誰在動？」）
4. ［F］中心式二 — $\boxed{u(z_t,r,t)=v(z_t,t)-(t-r)\frac{d}{dt}u(z_t,r,t)}$；白話「平均速度＝瞬時速度−修正項（平均速度沿軌跡的變化率×時間差）；直線時修正為零；對**任何**一對 $(r,t)$ 精確成立」；demo `w9-2-1` 截圖：弦（平均速度）、切線（瞬時速度）、修正向量三者精確閉合，$r\to t$ 修正縮到零；Details「它就是上一篇的 Eulerian」（附錄）
5. ［C］訓練：把右邊當目標 — $u_{\text{tgt}}=v(z_t,t)-(t-r)\underbrace{[\partial_tu_\theta+(\partial_zu_\theta)v]}_{\frac{du}{dt}\text{，用 JVP}}$、$\mathcal L=\|u_\theta(z_t,r,t)-\mathrm{sg}(u_{\text{tgt}})\|^2$；三個實作決定：全導數用 JVP（切向量 $(v,0,1)$ 對應 $(z,r,t)$）／目標 stop-gradient／$v$ 用條件速度——**兩處 $v$（顯式的、JVP 切向量裡的）都換成 $x_1-x_0$**
6. ［Q］Identity 是對**邊際**速度成立的，訓練卻代進**條件**速度，而同一個 $z_t$ 被許多 $(x_0,x_1)$ 經過。為什麼可以？這是哪一個用過的模式？和 consistency training 那一次差在哪？ — Q1
7. ［M］細節一：目標對 $v$ 是線性的 — $\mathbb E[u_{\text{tgt}}(x_1-x_0)\mid z_t]=u_{\text{tgt}}(\mathbb E[x_1-x_0\mid z_t])=u_{\text{tgt}}(v(z_t,t))$「期望可以穿過去，代換後的梯度與用真正邊際速度訓練時完全相同」（conditional trick 累積表第 7 列：線性精確版）；細節二：與 CT 差在「沒有離散化」——CT 走一步 Euler 有 $O(\Delta t)$ 曲率 bias，這裡是解析的全導數，曲率積分不是被壓小，是根本沒有出現
8. ［C］還有一件事要誠實標出來 — $\frac{du}{dt}$ 那一項用的是 $u_\theta$ 自己＝bootstrapping；不動點論證（$u_\theta=u$ 時目標恰為 $u$）；靠 stop-gradient＋$r=t$ 樣本當錨（純 FM、無 bootstrapping）＋sCM 穩定技巧
9. ［C］取樣，與它為什麼值得 — 一步 $z_1=\psi_{0\to1}(z_0)=z_0+u_\theta(z_0,1,0)$；多步合法（分段跳）；代價：JVP、bootstrapping；粗體「flow map 可以像 flow matching 一樣從頭訓練、不要 teacher、不帶曲率 bias」
10. ［C］（Bridge）同一個輸出，換 progressive 恆等式——Shortcut
11–12. ［附錄］Details 慣例對照、Details 就是 Eulerian。

**U7.3 Shortcut 與 Align Your Flow：同一張表的其他格子**

1. ［Q］如果輸出一樣是平均速度，但改用 progressive 恆等式，會長什麼樣？ — 節標題
2. ［C］Shortcut 網路 — $x_{t+d}=x_t+d\,s_\theta(x_t,t,d)$，第三輸入是步長 $d$；$s(x,t,d)=u(x,t+d,t)$
3. ［M］兩個 $d$ 步的平均等於一個 $2d$ 步 — progressive 用位移寫：$2d\cdot s(x_t,t,2d)=d\cdot s(x_t,t,d)+d\cdot s(x'_{t+d},t+d,d)$，$x'_{t+d}=x_t+d\,s(x_t,t,d)$ → 除以 $2d$ → $\boxed{s(x_t,t,2d)=\tfrac12[s(x_t,t,d)+s(x'_{t+d},t+d,d)]}$；「大步的平均速度是兩個小步平均速度的平均；完全沒有 $v$」
4. ［C］$d=0$ 是 FM 底層 — $s(x_t,t,0)=v(x_t,t)$ ⇒ $\mathcal L_{d=0}=\|s_\theta(x_t,t,0)-(x_1-x_0)\|^2$（$v$ 是被回歸的目標，沒有 U7.1 的陷阱）；離散網格 $d\in\{0,\frac1{128},\dots,\frac12,1\}$；3/4 FM 樣本、1/4 bootstrap；demo `w9-3-1` 截圖（階梯：底層誤差如何逐級上傳；MeanFlow 對照把階梯換成連續 $(t,r)$ 區域）
5. ［T］Shortcut 與 MeanFlow 並排 — 七列表（輸出／恆等式／動力學從哪進來／需要 JVP／步長／誤差結構／teacher）；「兩者不要 teacher 的理由不同」；誤差被「級數」$\log_2(1/d_{\min})$ 放大
6. ［T］符號 Remark — 這一篇的 $u$ 與 $s$ 各有兩個意思（見開場慣例卡）
7. ［Q＋C］MeanFlow 對任何 $(r,t)$ 直接成立，Shortcut 卻要一級一級 bootstrap 還多付級數的誤差放大——那它還有什麼存在的理由？ — Q1 → 一、不需要微分（省掉 sCM 那整套 tangent 穩定手段）；二、步長是離散格點輸入，「這一對我練過」；代價與 PD 同一種：「PD 把 bootstrapping 攤在訓練的輪次上，Shortcut 攤在同一個網路的步長維度上」；匾額「MeanFlow 用一階微分換掉 bootstrapping，Shortcut 用 bootstrapping 換掉一階微分」
8. ［C］Align Your Flow：distillation 設定下同時用兩條 — AYF-EMD＋AYF-LMD、連續時間、teacher 給輸出點的 $v$；「AYF＝Eulerian＋Lagrangian，連續時間，要 teacher」；順帶：他們證明 CM 多步 $W_2$ 可能上升（U6.5 引用的定理）；工程加料（autoguidance、adversarial finetuning）「要照著做之前先讀原文實驗那一節」
9. ［F］六格圖＋回頭看 CTM — `imgs/w9-3-2.svg`（三條恆等式 × teacher／條件速度）；CTM＝progressive、第一段給 teacher；$u\to t$ 滑向 Eulerian（soft）；「輸出位置 vs 平均速度是座標選擇」；Bridge「到這裡所有方法都是**回歸**——下一篇換一條路：只要求分佈等於分佈」

**U7.4 另一條路：分佈匹配**

1. ［C］到目前為止，全部都是回歸 — 四個損失同一形狀「學生在某個輸入上的輸出，要等於某個目標點，用 squared loss 拉近」；最小值是條件期望 → 目標多值（SDE teacher／條件配對／粗網格）時輸出＝終點平均 → 落在兩個 mode 中間、不像任何一個樣本的點（模糊）；粗體「交叉問題在蒸餾裡換了一身裝」
2. ［Q］能不能完全不要求逐點對應？ — 節標題「只要求分佈一樣」
3. ［C］DMD 的目標 — $\min_\theta\mathrm{KL}(p_\theta\|p_{\text{real}})=\mathbb E_{x\sim p_\theta}[\log p_\theta(x)-\log p_{\text{real}}(x)]$，$x=G_\theta(z)$；「兩個密度都沒有，直接算不出來——但梯度有」
4. ［M］一維四行推導：為什麼 KL 的梯度是 score 差 — $G_\theta$ 那條路 chain rule → score 差×生成器 Jacobian；下標那條路 $\mathbb E_{p_\theta}[\partial_\theta\log p_\theta]=0$（score function 期望為零，$\int\partial_\theta p_\theta=\partial_\theta1=0$）→ 只剩第一條；sanity check $p_\theta=\mathcal N(\theta,1)$、$p_{\text{real}}=\mathcal N(0,1)$：KL $=\theta^2/2$、梯度 $\theta$、$s_\theta-s_{\text{real}}=\theta$ ✓
5. ［F］中心式 — $\boxed{\nabla_\theta\mathrm{KL}(p_\theta\|p_{\text{real}})=\mathbb E_z\Big[(s_\theta(x)-s_{\text{real}}(x))\big|_{x=G_\theta(z)}\cdot\frac{\partial G_\theta(z)}{\partial\theta}\Big]}$；讀法「梯度下降把每個學生樣本往 $s_{\text{real}}-s_\theta$ 推——往 teacher 密度高處（吸引）、離開學生自己密度高處（排斥，防止全部擠到一處）」；符號提醒卡
6. ［C］為什麼要在所有 noise level 上做 — 乾淨的 $p_\theta,p_{\text{real}}$ 在高維太薄、幾乎不重疊，score 差沒意義 → 兩個分佈都加噴 $x_t=(1-t)x_0'+tx$（$x_0'$ 與 $z$ 無關的新噴聲）→ $\mathcal L_{\text{DMD}}=\mathbb E_t[w(t)\mathrm{KL}(p_{\theta,t}\|p_{\text{real},t})]$，$\nabla_\theta=\mathbb E[w(t)(s_{\text{fake}}-s_{\text{real}})\frac{\partial x_t}{\partial\theta}]$；「與 forward process 選加噴同理」
7. ［S］兩個 score 都是 denoiser — $s_{\text{real}}$ 由 teacher denoiser 經 Tweedie；$s_{\text{fake}}$ 由「追著學生的」fake denoiser 即時估計、交替更新（VSD 結構）；粗體「DMD 的訓練訊號是兩個 score 的差，其中一個 score 要即時估計」；DMD2 改動；新製圖：生成器＋追著它的 score 網路（無文字）
8. ［Q＋F］回歸式蒸餾與分佈匹配式蒸餾，各自的失敗模式是什麼？壞掉時樣本長什麼樣、病根在哪個數學性質？ — Q1 → 回歸式：目標多值時平均到中間（容量無限也不消失，是目標的性質；優點是穩定 supervised）；分佈匹配式三層代價：估正在移動的目標的 score（GAN 追逐、追不上）、$\mathrm{KL}(p_\theta\|p_{\text{real}})$ 方向 mode-seeking → mode collapse、需要 teacher 且學生不是 flow map；匾額「回歸式的錯是『平均』，分佈匹配式的錯是『塌縮』或『追不上』」；demo `w9-4-1` 截圖（CT 網格控制落在中間的比例；DMD surrogate 關掉排斥項→collapse、降低更新頻率→震盪）
9. ［C］延伸：同一族的其他成員 — ADD（判別器）、IMM（moment matching＋半群、不要 teacher）；「『回歸 vs 分佈匹配』是訓練訊號的分類，『學什麼物件』是另一個獨立的軸」
10. ［C］（Bridge）四個軸的一張表

**U7.5 統一表與選擇指南**

1. ［T］沿哪四個軸排這張表 — 軸一學什麼（速度／終點／flow map／平均速度／分佈）、軸二要不要 teacher（CTM 中間案例）、軸三能否多步、多步的路合不合法（＝不需回終點重加噴）、軸四誤差從哪裡來
2. ［T］四種結構性誤差各對應前幾單元的哪個工具 — 曲率 bias（U3.2 Euler／U6.3 CT $O(\Delta t)$）／累積（PD、Shortcut 階梯、reflow 逐輪）／交叉平均（U2.3 Q1 的最終形態）／score 估計（DMD 的 $s_{\text{fake}}$、U3.1 SDE）；第五種「網路本身的近似誤差」不列
3–4. ［T］四軸總表 12 列（分兩張；內容照 w9-5 原表逐字）— FM／Reflow／PD／CD／CT／sCM／CTM／MeanFlow／Shortcut／AYF／DMD／IMM
5. ［C］兩條對角線＋「沒有一格是全綠的」 — (a) 不要 teacher ↔ 無曲率 bias 的矛盾被 JVP（連續時間）解掉；(b) 回歸 ↔ 交叉平均綁定，只能換訊號解
6. ［Q＋C］「交叉平均」出現得特別頻繁，但 CD、sCM、MeanFlow 那幾列沒有——一個方法什麼時候會吃到、什麼時候不會？ — Q1 → 判準一句「回歸目標，在給定輸入之後是不是唯一的」；逐列：CD 目標唯一→無；CT 目標刻意多值、後驴平均恰對→variance 非 bias（網格粗到退化成 $x_t\to x_1$ 才真糊）；sCM／MeanFlow 條件速度線性進目標、連 Jensen gap 都沒有，付 bootstrapping；Reflow 目標唯一但帶上一輪誤差→累積；「看新方法先問：目標給定輸入唯一嗎？不唯一是像 CT 會被正確平均、還是像 SDE teacher 會平均掉終點？」
7. ［T］怎麼選：四個問題 — 有沒有訓好的 teacher？要一步還是幾步？最怕哪一種錯？算力在哪一邊？；demo `w9-5-1`（可篩選統一表）；「每一列都建在前幾個單元的物件上；新方法三分鐘就能放進表裡」

**U7.6 實作：MeanFlow、半群檢查，與交叉問題的最終回收**

1. ［K］`meanflow_loss` 逐行對回 identity — `t,r = min,max`；`r = where(rand<p_same, t, r)`（$r=t$ 錨，$p_{\text{same}}=0.25$）；`u, dudt = torch.func.jvp(model,(zt,r,t),(v,0,1))`（切向量 $(dz/dt,dr/dt,dt/dt)$）；`target = v − (t−r)·dudt`；`((u − target.detach())**2).mean()`；notebook QR
2. ［K］`sample`：`z = z + (r−t)·model(z,r,t)`；`steps=1` 即 $z_1=z_0+u_\theta(z_0,1,0)$；三個檢查點（`p_same=1` 退回 FM／半群／早期會抖是 bootstrapping）
3. ［F］圖 a：三種一步方法同一張圖 — 四條 $W_2$ vs 步數 $\{1,2,4,8,32\}$ 曲線（FM、reflow×2、CT、MeanFlow）；先猜形狀再出
4. ［Q＋C］四條線的起點（一步）高低不同，斜率也不同——分別由什麼決定？把它們分開比直接比誰低有用得多 — Q1 → 匾額「一步的高低看訓練目標，之後的斜率看學的物件撐不撐得住多步」：起點＝一步逼近誤差（FM 最差、reflow 較好、CT／MeanFlow 最好）；斜率＝多步合法性（FM／reflow $O(1/N)$ 直線；MeanFlow 合法分段；CT 回終點重加噴無保證）；「只報 $N=1$ 或只報 $N=32$ 會得相反結論——讀論文最易被帶偏處」
5. ［F］圖 b：半群檢查 — 512 個 $z_0$ 比較 $0\to\frac12\to1$ vs $0\to1$ 等切法，直方圖疊 `exact_flow_map` 真值；「identity 只**隱含**半群，這裡驗它多成立」
6. ［T］作業四題 — DMD 在 toy 上（`g = w(t)·(score(D_fake)−score(D_real))`、`loss_G=(zt·g).sum()/B`；FM 慣例 Tweedie $s=\frac{tD-z_t}{(1-t)^2}$）／交叉問題的最終回收（兩 Gaussian 交叉例子：CT 樣本落在兩個上方 mode **之間**、DMD 不會）／Shortcut（不需 jvp）／（選）拿掉 $\frac{du}{dt}$：弦學成了切線

**全課收尾（4 張）**：

1. ［T］三件工具站穩整門課 — **conditional trick**（累積表七列一次放完：KL／MSE／速度／通式／比值／consistency／線性精確）；**曲率積分壓住有限步誤差**（連續：$\int\|\ddot x\|dt$；離散：total correlation）；**訓練噴聲與取樣噴聲是兩個旋鈕**（$\gamma_t$ vs $\varepsilon_t$；uniform vs remasking $\sigma_t$）
2. ［T］一路跟到最後的問題：配對交叉 — U2.3 兩組配對 $(0,2)$ → reflow 裡是彎曲 → 多步 CM 裡是重加噴 → 蒸餾裡是模糊 → 作業 2 再做它一次；一張橫向時間軸
3. ［B］往後讀任何一篇新的論文，先問它動了哪個旋鈕、誤差落在哪一格；通常，那就是它全部的新意。
4. ［C］quiz（選 w9-0-b 半群、w9-2-c 線性＋sg、w9-4-a 梯度方向、w9-5-c 擺脫交叉平均只能換訊號）＋預告應用單元（W2 #21–28 的七個場景會一個一個回來）

**沿用 W2**：#34（核心）、#21–28（收尾預告）。
**新製圖**：跳回＋重加噴＝換軌（與 U6.5 共用）；弦／切線／修正向量三角形（若 demo 截圖不夠清楚）；階梯 bootstrap；生成器＋追著它的 score 網路。
**demo**：`w9-0-1`、`w9-2-1`、`w9-3-1`、`w9-4-1`、`w9-5-1`（路徑 `week-9/`）。

---

## 5. 跨單元一致性

### 5.1 貫穿比喻表（投影片上只用這些，第一次出現的單元負責立起來）

| 比喻 | 對到 | 立起來 | 之後回來 |
| --- | --- | --- | --- |
| 地形（山峰 mode、山谷≈0） | $p_{\text{data}}$ | U1.0（W2 #5） | U1.3 廣場換視角 |
| 隨手可得的原料＋加工機器 | $\mathcal N(0,I)$、$G$ | U1.0（W2 #8） | U6.0 $G_\theta\approx\psi_{0\to1}$ |
| 下注的人、籌碌總額固定 | maximum likelihood、$\int p_\theta=1$ | U1.0 | — |
| 搬倉庫：先寫好每箱路線 | 自己指定路徑、配對 | U1.0 Q3 | U2.2 三步、U3.4 OT |
| 洗牌／撲克牌 | forward process 切碎 | U1.1（W2 #13 重製） | U1.2 Q1 |
| 台大→屏東兩條路線收同終點 | marginal $q(x_t\mid x_0)$ | U1.1 | U1.2 開頭 |
| 考試分發只看成績單 | Markov | U1.1 | — |
| 在一條街上開店，代價是距離平方，最好位置是重心 | MSE 最佳解＝條件期望 | U1.2 Q3／U1.3（W2 #11） | U2.2、U6.0、U7.4「平均到中間」 |
| 視力檢查表的 E、$1/4$ 盲猜 | $\mathbb E[x_0\mid x_t]$ 為什麼模糊 | U1.2 Q3 | U1.3 平均臉 |
| 廣場上的人群、站原地看周遭平均去向 | score、$t$ 是聚集進度 | U1.3 | U1.4 塌與拍照 |
| 淺水區 | 2D toy | U1.5 | 每個 lab |
| 點套餐不能只換飲料 | 三個旋鈕綁在一起 | U2.0 | U2.4 四個旋鈕 |
| 開車：指示牌／路線／位置對照表 | 速度場／軌跡／flow map | U2.1 | U6.0、U7.0 |
| 小盒子流進流出 | continuity equation | U2.1 Try | U5.1 水桶 |
| 站在 $x$ 往外看很多路線經過 | 邊際速度＝後驟平均 | U2.2（W2 #20） | U7.1「$v$ 在哪一點被需要」 |
| 割線代替曲線 | Euler 誤差 | U2.3 | U3.2、U6.3 |
| 有寬度的管子、兩端收緊 | $\gamma_tz$ | U3.0 | U3.2 互斥 |
| 推一把再拉回來 | Langevin 項 | U3.1 | U5.3 remasking、U6.5 第三面 |
| 簿記、有限預算 | reflow 的 $S\to0$ | U3.3 | — |
| 交換終點 | OT 單調 | U3.4 | — |
| 想＋吃 的平均不是一個字 | 類別不是數值 | U4.0 | — |
| 一枚硬幣 | absorbing posterior | U4.1 | U4.2、U4.5 Binomial、U5.2 連續時間版 |
| 牛肉／司 | 因子化誤差 | U4.3 | U4.4 錯字留下 |
| 今天想吃壽貓 | uniform 噴聲字不可辨 | U4.4 | — |
| 三面牆 | $Q_t$ 語言的三個障礙 | U5.0 | — |
| 水桶／水管／閥門 | rate、forward equation | U5.1 | U5.2 倒過來、U5.3 多一條管子 |
| 只翻一次的硬幣 | DFM 條件路徑 | U5.4 | — |
| 三格槽位 path／target／sampler | 讀一篇離散論文 | U5.5 | U7.5 四軸 |
| 老師走兩步、學生走一步；難度階梯 | PD | U6.1 | U7.3 Shortcut 階梯 |
| 錨、單向傳 | 邊界寫進架構、stop-gradient | U6.2 | U6.4 拿掉 EMA |
| 扇形 | CT 條件目標的散佈 | U6.3 | U6.6 圖 b |
| 兩支箭頭相消 | 沿軌跡全導數 | U6.4 | U7.2 |
| 跳、重加噴、換軌 | 多步 CM 病根 | U6.5 | U7.0 |
| 整張表／一階項／切片 | flow map／FM／CM | U7.0 | — |
| 弦、切線、修正向量 | MeanFlow identity | U7.2 | — |
| 微分換 bootstrapping | MeanFlow vs Shortcut | U7.3 | — |
| 吸引、排斥 | $s_{\text{real}}-s_{\text{fake}}$ | U7.4 | — |
| 沒有一格是全綠的 | 四軸表 | U7.5 | — |

**已退役、不要用**：看監視器猜車牌（→視力表 E）；下棋（→考試分發）；teacher／student 當一般比喻（只在 U6–U7 的蒸餾語意下用）。

### 5.2 Conditional trick 累積表（每次回來加一列、整張重放；不用序數）

| 版本 | 邊際量（要的） | 條件量（訓練用） | 單元 |
| --- | --- | --- | --- |
| KL | $q(x_{t-1}\mid x_t)$ | $q(x_{t-1}\mid x_t,x_0)$ | U1.2 |
| MSE | $\nabla\log p_t(x)$ | $-\epsilon/\sigma_t$ | U1.3 |
| 速度 | $u_t(x)$ | $\dot\alpha_tx_1+\dot\sigma_tx_0$ | U2.2 |
| 通式 | $b_t$、$\eta_t$ | $\dot\alpha_tx_0+\dot\beta_tx_1+\dot\gamma_tz$、$z$ | U3.0 |
| 比值 | $p_t(y)/p_t(x)$ | $q_t(y\mid x_0)/q_t(x\mid x_0)$ | U5.2 |
| consistency | 真實 score 的一步 Euler | $x_0+t_n\epsilon$ | U6.3 |
| 線性精確 | $u_{\text{tgt}}(v)$ | $u_{\text{tgt}}(x_1-x_0)$ | U7.2 |

每一列都是「條件版＝邊際版＋一個與參數無關的常數」；引用時一律指向 U1.2、寫英文 conditional trick。

### 5.3 符號衝突表（換方向、換字母處必放對照卡）

| 地方 | 衝突 | 投影片處理 |
| --- | --- | --- |
| U1→U2 | 資料在 $t=0$ → $t=1$；$x_0$ 從資料變噴聲；$(\alpha_t,\sigma_t)$ 不必平方和 1 | U2 開場 T 頁＋U2.0 #7 |
| U2→U3 | U2 $(\alpha,\sigma)$＝U3 $(\beta,\alpha)$；$\varepsilon_t$ vs $\epsilon$ | U3 開場＋U3.0 #3；U3.1 #6、U3.5 #7 各一張角標 |
| U4 | $\bar\alpha_t$ 是機率不是振幅 | U4.1 #6 |
| U4→U5 | $\alpha_t\equiv\bar\alpha_t$；$Q_t$ transition／$R_t$ rate（與文獻相反）；$u_t$ 純量 vs $u_t(x)$；$\sigma_t$ rate vs 振幅；$\kappa_t=1-\alpha_t$；$\sigma_t\neq\gamma_t$ | U5 開場＋U5.1 #4、U5.3 #2、U5.4 #1 |
| U5→U6 | 切回 $t=0$ 資料；$x_t=x_0+t\epsilon$；$\psi_{s\to t}$ 下標例外 | U6 開場轉換表＋U6.0 #7 |
| U6→U7 | 切回 FM；$u\to v$；$u$ 留給平均速度；$s$ 四義；書的下標反向 | U7 開場＋U7.0 #3、U7.3 #6 |
| U3.5 | 加權表 $w(t)$ 與 guidance $w$ 撞字 | 投影片改寫 $w_{\text{loss}}(t)$ |

### 5.4 Toy 與數字鏈（demo 頁只引這些實測值）

- **two moons（U1–U3、U6–U7）**：U1.5 loss 地板 0.3；U2.3 四團 toy 彎曲度 1.59／1.00、Euler 4 步 1.49／0.03；U2.4 雙月線性 2.1 vs VP 1.5；U2.5 斜率 $-1.05$／$-2.05$；U3.2 曲率積分 9→1.4（加 $\gamma$：3.5／6）；U3.3 reflow 1.4→0.03、4.0→0.6；U3.4 交叉 20%→0.6%、誤差 1.5→0.08；U3.5 guidance $\sigma$ 1.1→0.57、曲率 3.5→10.5；U3.6 四配對 $S$ 1.6／0.03／0.22／0.02；U6.6 扇子 ≲5e-3、$W_2$ 地板 0.3（改 energy distance）。
- **parity toy（$L=8$，U4–U5）**：U4.3 合法率 $k=1$ 100%、$k=2/4/8$ 49.8／48.3／52.6%、FE $\log2$；U4.5 步數 1/2/4/8 → 50／52／64／78–79%（理論 78.6%）；U5.6 精確跳步 63–65／78–79／94–95% vs τ-leaping 57–59／73–74／93–94%。
- **Markov toy（$L=16$，0.9，切換率真值 0.10，U4–U5）**：U4.4 修正率 0.0% vs 62–67%；U4.5 切換率 0.10→0.50；U5.2 比值 5.60／0.99／0.11；U5.3 $N=8$ 0.14–0.15→0.13；U5.5 block 0.098／0.172／0.504。
- **W2 已用的數字**：slide 32 的「4 步 1.49（隨機配對）／0.03（換配對）／200 步 0.01」就是 U2.3 的 demo——U2.3 #7 直接接回。

---

## 6. 待作者決定

1. **式子的渲染**：LaTeX→SVG 貼圖（與 W2 slide 12、網站 KaTeX 同風格；可批次生成、字型一致）vs PowerPoint 內建方程式（可編輯、字型 Cambria Math）。建議前者，理由是七週約 150 條 display 式子，批次生成＋版本控制比手打穩。
2. **附錄頁的去留**：各週標「附錄」的 `<Details>`（U1.0 NICE/FFJORD、U1.4 半個 score、U3.5 DPM-Solver、U4.2 連續極限、U5.2 Bregman、U6.0 VE PF-ODE、U7.2 兩個 Details…）建議放在 deck 最後，上課不講、給自習；quiz 若考到（U1.4 w3-4-b 半個 score）就升回主線。
3. **quiz 形式**：每週 4 題選擇放在 deck 末（本文件的預設），或改用 NTU COOL／Kahoot 現場作答，deck 只放題目。
4. **U1.0 的長度**：W2 已花 10 張講過 $p(x)$、transport map、MSE→平均；本文件把 U1.0 壓到 8 張、15 分鐘。若希望 U1 從零講起，可回到筆記估算的 16–18 張，但 U1.2 就要砍到 12 張。
5. **lab 篇上課怎麼用**：本文件假設 lab 篇 15–20 分鐘、以「程式碼頁＋猜測留白圖＋答案圖」帶過、作業回家做。若改成課堂實作，每週要多 30 分鐘，理論篇得再壓。
6. **W2 撲克牌（slide 13）**：U1.1 #1 重用時重製，還是換成筆記裡的「洗牌」純文字比喻卡？建議重製（視覺記憶已在），並在 brief 明寫花色與數字要一致。
7. **投影片語言**：W2 標題中英混排（「Flow Matching：學一條 Flow 將資料送到對的地方」）。本文件的標題全部沿用筆記篇名／節名（中文為主、術語英文），與筆記一致；若希望投影片保留更多英文標題（給非中文母語旁聽者），要另訂一條規則。
