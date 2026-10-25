# 前瞻資訊科技兩次授課規劃

授課對象是**未修過深度學習的大學部學生**。兩次各 60 頁，包含封面、互動與作業說明，各安排 120 分鐘主講。這份規劃的目標是讓學生能用自己的話說明問題、方法與老師的代表研究；公式只負責把直覺寫清楚。

第一堂讓學生理解「資料換個表示方式，模型的答案應該怎麼變」，最後走到 SCHull。第二堂讓學生理解「怎麼學會生成，以及訓練完成後怎麼加入新要求」，最後走到 Source Parallel Tempering。兩堂共用的研究問題是：**把已知的結構放進模型或生成程序，可以解決什麼困難？**

## 教材與交付內容

- [10 月 23 日逐頁內容與口語講稿](./10-23-learning-with-structure.md)
- [10 月 30 日逐頁內容與口語講稿](./10-30-generating-with-structure.md)
- [學生版作業與短測驗](./student-assignments-and-quizzes.md)
- [教師版答案與評分方式](./teacher-assessment-key.md)

目前交付的是製作投影片用的完整逐頁企劃與口語講稿草案，尚未排版成 PPTX。每頁都附畫面內容、可直接開口的講法，以及素材出處。講稿是該頁的核心說法；指定的操作、等待學生回答與看圖比較也算入授課時間，不需要把每頁講稿擴寫成兩分鐘逐字稿。

## 每次上課時間

| 時段 | 活動 | 分鐘 |
| --- | --- | ---: |
| 14:20–15:15 | 第一段主講與課堂提問 | 55 |
| 15:15–15:25 | 休息 | 10 |
| 15:25–16:30 | 第二段主講、研究成果與作業說明 | 65 |
| 16:30–16:40 | 休息、發放短測驗 | 10 |
| 16:40–17:10 | 個人短測驗 | 30 |
| 17:10–17:20 | 收卷、講評與提問 | 10 |
| 合計 | 主講 120 分鐘，測驗 30 分鐘，其餘 30 分鐘 | 180 |

兩個日期依本學期規劃為 **2026/10/23、2026/10/30**。作業繳交期限留給授課者公告，不預設與課程原有評分制度衝突的新規則。

## 10 月 23 日

**Learning with Structure: Geometry, Symmetry, and Representation in Modern AI**

學生最後應能：判斷分類、定位與方向預測的合理變化；說出 CNN、集合模型、Transformer 與 GNN 各自如何利用結構；解釋為什麼 3D 點雲的連線方式會影響學習，以及 SCHull 處理的三個要求。

| 頁數 | 時間 | 主線與代表內容 |
| --- | --- | --- |
| 01–12 | 14:20–14:40，20 分鐘 | 神經網路的最低限度背景、地圖例子、不變與等變 |
| 13–22 | 14:40–15:00，20 分鐘 | 從共享規則長出 CNN，補上 pooling、augmentation 與旋轉 |
| 23–31 | 15:00–15:15，15 分鐘 | Deep Sets、PointNet、attention、Transformer 與位置 |
| 32–42 | 15:25–15:45，20 分鐘 | Graph、message passing、3D 點雲、能量與力 |
| 43–56 | 15:45–16:15，30 分鐘 | SCHull 研究故事、三步構造、保證與原始實驗 |
| 57–60 | 16:15–16:30，15 分鐘 | 蛋白質多尺度表示、點雲標準化、統整與簡單作業 |

「First principles」採用可操作的順序：先決定任務輸出，再要求變換一致，接著選擇共享與聚合運算，最後命名架構。必須交代額外設計選擇：對稱性不會唯一指定一個完整架構。CNN 的平移結論放在理想邊界／相容位移條件下；Transformer 的集合等變性放在沒有固定位置訊息，或位置與關係一起重排的情況下。

## 10 月 30 日

**Generating with Structure: Diffusion, Flow, and Test-Time Control**

學生最後應能：區分訓練與生成；描述 diffusion 如何自己製造訓練題目；描述 flow matching 的位置與速度標籤從哪裡來；區分換 prompt、fine-tuning 與 steering；解釋固定生成模型仍能搜尋較符合要求的結果。

| 頁數 | 時間 | 主線與代表內容 |
| --- | --- | --- |
| 01–08 | 14:20–14:35，15 分鐘 | 生成是產生新樣本，先看樣本與分布 |
| 09–22 | 14:35–15:00，25 分鐘 | 加噪、製造訓練題目、學去噪、反覆生成 |
| 23–31 | 15:00–15:15，15 分鐘 | Flow matching 的人潮直覺、參考路徑與速度標籤 |
| 32–40 | 15:25–15:45，20 分鐘 | 平均速度場、生成步驟、方法關係、老師的 flow divergence 研究 |
| 41–48 | 15:45–16:05，20 分鐘 | 新要求、參數是否改變、Best-of-N、guidance 與 reward tilt |
| 49–57 | 16:05–16:25，20 分鐘 | Reward 的限制、SMC、source search、parallel tempering 與實驗 |
| 58–60 | 16:25–16:30，5 分鐘 | 統整、出口問題與簡單作業 |

Diffusion 先用加噪時間 τ，τ=0 是乾淨資料；flow matching 改用生成時間 t，t=0 是 source、t=1 是 data，並在轉場當場對照。分開參考路徑、學到的場與生成軌跡，不把直線訓練路徑說成生成也一定走直線。

## 原始素材與代碼

逐頁企劃中的來源代碼對應下表。頁碼皆指檔案內**從 1 起算的實體頁序**，不是頁面標題或講者筆記中的舊編號。中央大學 v2 混有多版筆記，不能用 notes 裡的「第幾頁」直接定位。

| 代碼 | 原始檔與用途 |
| --- | --- |
| GDL | [網站 GDL 主線與架構限制](../../site/refs/gdl-course-plan.md)，以及下表列出的現有筆記 |
| PROFILE | [網站個人介紹與研究紀錄](../../site/src/data/content.ts) |
| ICLR | [ICLR 2025 oral，21 頁](../../assets/ICLR25/ICLR_2025_oral_slides.pdf) |
| D3 | [DMA diffusion，46 頁](/Users/shwang/Documents/dma-slides/dma-w3-diffusion-models.pptx) |
| D4 | [DMA flow matching，61 頁](/Users/shwang/Documents/dma-slides/dma-w4-flow-matching.pptx) |
| D5 | [DMA discretization，74 頁](/Users/shwang/Documents/dma-slides/dma-w5-discretization-error-upload.pptx) |
| NCU | [中央大學 steering v2，42 頁](/Users/shwang/Documents/NCU-Test-Time-Steering-v2.pptx) |
| FDM | [ICML 2025 flow divergence 原始投影片](https://icml.cc/media/icml-2025/Slides/45878.pdf)與[正式論文](https://proceedings.mlr.press/v267/huang25ag.html) |

「沿用」表示原圖與主要內容可保留。「簡化」表示保留圖像、拆出直覺並減少符號。「新增」表示依現有筆記重新安排教學例子，並不代表新增研究成果。

## 網站筆記與互動素材

| 代碼 | 現有內容 | 本次用途 |
| --- | --- | --- |
| G1 | [地圖、輸出型態與等變](../../site/src/content/notes/research-areas/invariance-and-equivariance/map-view-invariance-equivariance.zh.mdx) | 第一堂 07–12 |
| G2 | [平移與共享 kernel](../../site/src/content/notes/research-areas/invariance-and-equivariance/cnn-translation-equivariance-from-map-views.zh.mdx) | 第一堂 13–19 |
| G3 | [Deep Sets](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g3-1-deep-sets.zh.mdx)、[PointNet](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g3-3-pointnet.zh.mdx) | 第一堂 23–26 |
| G4 | [內容式 attention](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g4-0-attention-from-sets.zh.mdx)、[Transformer block](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g4-3-transformer-block.zh.mdx)、[位置與順序](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g4-4-order-and-position.zh.mdx) | 第一堂 27–31 |
| G5 | [訊息傳遞](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g4-1-message-passing.zh.mdx)、[GNN 能分辨什麼](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g4-4-expressivity.zh.mdx) | 第一堂 32–37 |
| G6 | [3D 輸出規則](../../site/src/content/notes/research-areas/invariance-and-equivariance/euclidean-equivariant-gnns-point-clouds.zh.mdx)、[EGNN](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g5-2-egnn.zh.mdx)、[能量與力](../../site/src/content/notes/research-areas/invariance-and-equivariance/gdl-g5-3-energy-and-forces.zh.mdx) | 第一堂 38–42 |
| U1 | [生成在學什麼](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/dma-w3-0-what-are-we-learning.zh.mdx)、[加噪](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/dma-w3-1-forward-process.zh.mdx)、[去噪訓練](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/dma-w3-2-denoising-regression.zh.mdx) | 第二堂 03–22 |
| U2 | [人潮與速度場](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-4/dma-w4-1-flows-and-continuity.zh.mdx)、[搬動分布](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-4/dma-w4-2-conditional-flow-matching.zh.mdx)、[diffusion 與 flow 的關係](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-4/dma-w4-3-linear-path.zh.mdx) | 第二堂 23–40 |
| U7 | [Steering 問題](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/dma-w10-0-test-time-steering.zh.mdx)、[reward tilt](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/dma-w10-3-reward-tilting.zh.mdx)、[gradient-free steering](../../site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/dma-w10-4-gradient-free-steering.zh.mdx) | 第二堂 41–57 |

展示以三次為限，避免切換吃掉主講時間：第一堂用[地圖輸出規則](../../site/public/notes/research_areas/invariance-and-equivariance/map-output-types.html)與[attention 工作台](../../site/public/notes/research_areas/invariance-and-equivariance/attention-workbench.html)；第二堂用[參考路徑與 ODE 軌跡](../../site/public/notes/research_areas/diffusion-models-applications/w4-3-crossing.html)。每次 60–90 秒，預先保留操作前後截圖。這些是概念與數值示意，不能當成真實模型的效能展示。

## 研究成果的呈現範圍

1. SCHull 以 ICLR oral 第 3–17 頁為主要素材。圖的連線之外，還必須保留相應幾何特徵；不能宣稱只靠 adjacency 就還原所有 3D 形狀。[ICLR 正式論文摘要](https://proceedings.iclr.cc/paper_files/paper/2025/hash/59ac7b4faef41e5c49d4fee24f3e8fbb-Abstract-Conference.html)
2. 3D 點雲標準化是另一篇 ICML 2024 工作，安排一頁帶出相關研究，與 ICLR 2025 SCHull 分開介紹。[ICML 2024 正式紀錄](https://proceedings.mlr.press/v235/baker24a.html)
3. Flow divergence 以「局部箭頭的學習誤差，如何連到整體分布誤差」介紹，不把方法說成改進數值 solver。[ICML 2025 正式紀錄](https://proceedings.mlr.press/v267/huang25ag.html)
4. SPT 以固定 deterministic generator 的 source space 搜尋、局部提案與不同強度間的交換介紹。無需 reward gradient，不代表沒有運算成本，也不代表有限步能精確取樣。[ICML 2026 正式紀錄](https://proceedings.mlr.press/v306/wang26da.html)

實驗只選原素材中可讀懂的少量對照。保留資料集、指標、誤差棒與成本條件；不把教學柯基圖片說成論文實測樣本，不把「符合對稱」說成「預測一定準」。NCU 的 proof-heavy 第 07–08、11、17、26–32、35–42 頁不整頁搬入主講，其中少數只取概念，證明留在原講稿供追問。

## 製作時的取捨

每頁一個主要視覺與一個說法。第一次遇到術語，同頁給自然中文解釋。研究段落採「原本遇到什麼困難、我們改哪裡、原圖支持什麼結果」的順序。數學符號、完整 benchmark 表與 proof 不以縮小字體塞入。

若學生提問較多，第一堂先壓縮 21–22、57–58；第二堂先壓縮 37、39–40 的延伸討論。保留 10/23 的 SCHull 三步與實驗、10/30 的 diffusion／FM 訓練對照及 SPT，並按時開始短測驗。壓縮指縮短講解，兩份投影片頁數仍各為 60。
