# U7.0–U7.2 練功房：連續問題鏈

日期：2026-10-13。沿用 intuition-first-academic-teaching 與 intuition-first-image-slides；本次改練功房腳本，來源筆記保持原文。

## 每套要回答的問題

|編號|來源 note label|腳本|問題與收口|後面的缺口|
|---|---|---|---|---|
|U7.0|dma-test-time-steering|test-time-steering|新要求在使用時進入計算，生成模型的 θ 固定；比較 conditional training、fine-tuning 與 steering|圖片沒完成時，誰能提供修改訊號？|
|U7.1|dma-classifier-guidance|condition-guidance|Bayes 找出額外方向；比較 noisy classifier 的 input gradient 與 conditional/unconditional 差值；檢查 dropout、w=1、noise 換算及成本|只有乾淨圖片的 reward，沒有上述判斷能力時，目標是什麼？|
|U7.2|dma-reward-tilting|reward-tilting|從平均分數的集中問題加入 entropy，得到 exponential tilting；把 clean target 接到 noisy posterior average，再檢查 plug-in|Reward 不能微分時，如何只靠候選評分 steering？（來源 U7.3，本次不做）|

目前 U7.1 已合併 classifier guidance 與 CFG，U7.2 是 legacy filename `dma-w10-3-reward-tilting.zh.mdx`。依現行站內編號排列，沒有把舊 w10-2 當成另一套 U7.2。

## 移出、保留與避免重複

- U7.0 的任意 g_t score 合成、input gradient 問答移到 U7.1 的 Bayes／classifier 脈絡，不先假定 noisy reward 已存在。
- U7.0 刪除 Best-of-N 成功率與計算成本；只保留 steering 可以包含生成後挑選的界線。完整 Best-of-N 屬 U7.3。原候選圖保留，尚未在這三套啟用。
- U7.0 的表格只比時間與參數，U7.1 的表格才比訊號、訓練前提與每步計算。
- Bayes 的 conditional score 只在 U7.1 推一次；CFG 是取出共同 base，不重做 Bayes 推導。
- U7.2 沿用同一組 A/B：base 各半、R=0/1、λ=log 3；明講 noisy 圖的 posterior 各半是另一個給定條件，不是由 base 比例推出。
- Plug-in 使用可算的 scalar toy A=0、B=1、R(x)=x：逐個算權重的平均是 2，平均資料後的權重是 √3。即使 R linear，兩者也不同。
- 不展開 negative prompt、Flow Matching、完整 training losses、KL constrained formulation 或 RLHF；這些留在來源筆記，不增加另一條旁支。

## 圖片與呈現

|檔案|位置|教學用途|
|---|---|---|
|steering-new-request.png|U7.0 開場|訓練後才出現紅帽要求（沿用）|
|steering-new-obstacle.png|U7.0 轉移題|新資訊沒有進入 sampler 時，多步數不會提供它（沿用）|
|w10-1-corgi-steering-intuition-v2.png|U7.1 開場|沿用來源筆記已核准的草稿／品種／場景／動作情境，不重新畫一個相同故事|
|guidance-two-questions.png|U7.1 訓練前提題|同一 state、時間與網路，兩種輸入是否學過？沒有預先畫出 dropout 解答|
|reward-two-photos.png|U7.2 平均分數 Think|兩張都合理，保留多種答案的需求先出現|
|reward-possible-sources.png|U7.2 noisy state 題|一個固定的 x_t、多個可能 clean sources；虛線不是生成路徑|

三張新圖以 built-in ImageGen 製作，逐張檢查文字、樣本身份、機率和連線語意後，存至 `site/src/content/dojo/imgs/`。公式放正文，圖片以 responsive WebP 呈現並可點圖查看原 PNG。此為網站輔助圖片，沒有組裝 PPTX。

## 連續閱讀

Frontmatter 新增 series/order。索引依系列與 order 排列；文章頁顯示 U7.0、U7.1、U7.2 導覽。走完 U7.0／U7.1，結尾提供下一套，且仍連回各自來源 note；U7.2 不連到尚未建立的 U7.3 腳本。

U7.0 progressVersion 由 2 改為 3，避免把舊十一個步驟套進新主線。只保存版本與位置，不保存作答內容。

## 第一版驗收（保留原紀錄，本次重排見下節）

- 來源 labels、Ref、goto/back、圖片 imports 與 KaTeX 語法均通過檢查。
- U7.0：7 個主線節點、2 條岔路、6 張卡片；U7.1：16 個主線節點、4 條岔路、6 張卡片；U7.2：15 個主線節點、3 條岔路。
- 三套逐一走過所有正確與錯誤選項、Judge 兩種回應、Think、岔路返回與結尾；表格以 Enter／Space 操作，錯放時有概念回應。
- U7.1 續讀能還原 6 張比較卡片，Think 文字不保存；U7.0 的舊版位置不套入新腳本。
- 索引順序為 U7.0→U7.1→U7.2，前兩套結尾有下一套連結，三套都保留正確來源 note。
- 以 production HTML 移除 scripts、展開 noscript 模擬靜態閱讀；各套所有節點、卡片分類與結尾連結可讀。
- 三套和索引在 320px 寬度無頁面／公式溢出、KaTeX error 為 0；U7.1 長的行內 Bayes 式已拆行，最窄導覽也已調整。
- `npm run check` 通過（50 個既有 warning）；`npm run build:astro` 通過（219 個頁面）。沒有部署。

## 2026-10-13 語氣與引導修訂

- U7.0–U7.2 的情境、轉場、題幹、圖說、岔路、作答回應、卡片提示與索引摘要，改成從具體畫面與合理想法往下提問；數學記號在需要它的地方接進來。
- 保留作者已確認的 U7.1 草稿／朋友提醒開場，不用另一份摘要替換。U7.2 延續同一組照片與數值，先問如何保留其他答案，再引入 entropy 與 posterior average。
- 補清楚 classifier guidance 從 unconditional base 加提醒時，w=0 才是不加提醒；CFG 的 w=1 則是 conditional baseline。
- 主線節點、岔路與來源連結維持原順序，progressVersion 不變。三套 38 個主線步驟、9 條岔路、12 張卡片重新驗過；MDX、262 條數學片段、圖片 imports 與 goto/back 均通過檢查。
- 320px 寬度檢查了三套所有主線：無頁面或公式溢出、KaTeX error 為 0。U7.2 的正規化行內計算改用文字與短公式，避免超出卡片寬度。

## 2026-10-13 第一次閱讀入口重排

使用者確認大規模內容修訂後，將三套改成可直接開始學習的問題鏈。保留已有的三種 layout 主題、來源筆記與教學圖；必要概念在主線或必讀探索中出現，不依賴讀者答錯才遇到。

|單元|本次編排|主線／路徑／卡片|progressVersion|
|---|---|---|---|
|U7.0|紅帽要求 → 任選順序探索三種可行做法 → 區分 θ 與 x_t → 提出固定參數的限制 → 逐列比較 → 倉庫新資訊的遷移題|8 個主線、3 條必讀探索路徑、6 張卡片|4|
|U7.1|幫手看什麼 → 機率問題 → Bayes → 分類誰依賴圖片 → 自己求額外方向 → classifier 準備 → 兩種回答與 dropout → CFG 基準 → noise 換算 → 工具選擇遷移題|24 個主線、4 條誤解岔路、9 張卡片|2|
|U7.2|多樣結果的需求 → 平均分數集中 → entropy → 自己合成 log 比值 → 正規化 → KL 最佳解 → noisy source 的積分與 posterior 平均 → 平均順序 → plug-in → input gradient → 換 base 比例的遷移題|27 個主線、3 條誤解岔路|2|

- U7.0 的三條探索沒有錯誤選項，全部看過才繼續，不能一開始就靠選到 steering 略過其他方法的介紹。生成模型固定參數的限制在比較後才提出。
- 選擇題的所有錯誤選項都有 `why` 或 `goto`；正確選項也補 `why`，答前、答後與續讀都能比較理由。U7.0、U7.1 的 Judge 各有一題成立、一題不成立；U7.2 保留平均 reward 不能證明抽到目標分布的檢查。
- 拖表卡片描述實際動作，`rowReplies` 將每列結果接回下一個問題，`done` 提供最後比較。U7.1 另有三張卡片，先分類 Bayes 式裡誰隨圖片輸入改變。
- U7.2 的新 distribution 保持用 `widetilde p`，不另用 q 表示暫時的抽樣機率；q 保留給 forward conditional density。最後把 base 改成 A:B=3:1，reward 倍率仍是 1:3，讀者需重新算出 1:1。
- 首頁改為從情境邀請第一次閱讀，入口用「從情境開始」，進度用「閱讀中／讀過了」，結束可「再想一次」。技能書入口稱「連續閱讀版」，文字提示不介紹 JavaScript 或節點實作。名稱暫保留練功房，另提供互動導讀、思考工坊等候選供使用者選擇。

本次驗收：

- 三套 MDX、KaTeX、圖片 imports 與 goto/back 皆通過檢查。
- 實際走過 U7.0 任意順序探索、重看與返回；看過一／二條路時不能繼續，三條都看過後才能進入比較。
- 三套選項與所有岔路在作答前後都測過，Judge 兩邊可比較，Think 可先寫理由再對照。拖表用 Enter／Space 操作，錯放顯示卡片的概念提示，逐列停頓與作者回應正常；U7.1 沒有 rows 的分類可把兩張卡放同一桶。
- U7.1 續讀還原兩張表共 9 張卡片，Think 留空，正確選項的理由仍可展開。U7.2 完成後也可續讀到結尾；不保存作答文字或選項。
- 320px 寬度檢查所有主線，公式無橫向捲動、頁面不溢出、KaTeX error 為 0。較長題目標籤保留印章位置，避免字蓋在一起。首頁與灰紙標籤也檢查過。
- 從正式建置 HTML 移除 scripts、展開 noscript 模擬停用 JavaScript：三套分別可讀 11／28／30 個節點，卡片分類與理由、每列整理、公式與結尾連結保留；320px 無公式或頁面溢出。
- `npm run check` 通過（50 個既有 warning）；正式建置通過（219 頁）。最後建置使用獨立 Astro／Vite 快取與輸出，避免干擾已開啟的 dev preview。

## 新圖 prompts（原文）

### 圖 1

```text
Use case: scientific-educational. Asset type: question-led Dojo website illustration, landscape 16:9 white canvas, large deep navy Traditional Chinese title, blue and coral accents, generous whitespace, clean polished simplified illustration. No humans, no avatars, no formula answers, no page number, no watermark.
Title exactly 「同一張草稿，能問出兩種回答嗎？」
At far left ONE noisy unfinished dog drawing (not a finished photograph), tagged 「同一張 noisy image」. It feeds via two thin blue request connectors into the SAME central fixed neural model represented by one modest desktop workstation, exact central label 「同一個模型」. Top request bubble above model exactly 「指定柯基」. Lower request bubble below model exactly 「不指定品種」. Requests are alternative model queries for the same image at the same noise level, not a temporal sequence; neither branch changes the drawing and neither is a separate model. To the right of central model two empty response papers with large question marks, aligned top and bottom with their request bubbles. Top paper label 「有條件的回答」. Lower paper label 「無條件的回答」.
Small bottom question exactly 「兩種輸入，訓練時都看過嗎？」. Do not show training dropout solution, do not draw output directions or finished dogs or arithmetic subtraction, do not mark either response as valid. The black-box workstation denotes shared parameters; the visible question is whether both answers are available. Large spatially legible picture and sparse readable labels, no decorative particles or glowing AI brains.
```

### 圖 2

```text
Use case: scientific-educational. Asset type: question-led Dojo website illustration for reward tilting, landscape 16:9 white canvas, large deep navy Traditional Chinese title, restrained blue/coral palette, readable large labels, generous whitespace, polished natural soft illustration. No humans or avatars, no watermark, no page numbers.
Title exactly 「兩張都合理，之後要怎麼抽？」
Show exactly TWO completed candidate photographs side by side, large and equally sized. A is a natural golden-and-white CORGI standing on a snowboard in a snowy mountain scene, soft overcast lighting, side-facing relaxed pose. B is a natural golden-and-white CORGI gliding on a snowboard in a snowy mountain scene, sunny lighting, different forward-looking dynamic pose. Both are visually reasonable images of corgis with snowboards in snow, B is not a universally better quality dog: its higher reward is assigned by a hypothetical scoring program for this teaching example. No red crosses, no green checks. Above photos place large labels 「A」 and 「B」. Below A exact text on two clear lines 「原本：1/2」 and 「reward：0」. Below B exact text on two clear lines 「原本：1/2」 and 「reward：1」.
Below both photos a single question 「平均分數要最高，就每次都選 B 嗎？」. Do not draw new probabilities, exponential factors, entropy formula, target distribution, or the answer; this is the prediction before the derivation. No funnel collapsing candidates. The main visual is two alternative realistic candidate results with clearly equal base probabilities and different assigned rewards. Sparse text, easily readable on phone.
```

### 圖 3

```text
Use case: scientific-educational. Asset type: question-led Dojo website illustration for posterior uncertainty, landscape 16:9 white background, navy heading, restrained blue/coral colors, polished simple natural illustration, generous whitespace, sparse readable Traditional Chinese.
Title exactly 「這張模糊圖片，原本可能是哪一張？」
At left one large extremely noisy/blurred candidate dog image with only ambiguous broad color masses, exact label 「目前的 x_t」. On the right TWO smaller completed candidate dog photos stacked vertically: A a natural golden-and-white corgi in an overcast snowy mountain setting, relaxed side pose on a snowboard; B a natural golden-and-white corgi in a sunny snowy mountain setting, different forward-looking pose on a snowboard. Labels beside photos: A has exactly 「可能來源 A」, 「後驗機率：1/2」, 「reward：0」. B has exactly 「可能來源 B」, 「後驗機率：1/2」, 「reward：1」. Connect the same left noisy image to each clean photo with separate thin dashed GRAY association lines, no direction arrowheads and no time ticks. These lines indicate two alternative possible ORIGINAL clean sources conditioned on the same current noisy image, not two actual generated paths and not a forward prediction timeline. Photos may both be compatible with the deliberately extreme noise; this is a schematic teaching toy, not a measured model result.
Bottom clear text exactly 「虛線是可能來源，不是生成軌跡」. No exponential weight formula, no h_t answer, no final probabilities after tilting, no averaged image, no solution to which operation to average. No humans, no avatars, no watermark, no page number, no generic AI brain icons. Preserve clear sample identity: A and B are two different clean alternatives, x_t is ONE fixed current image.
```


