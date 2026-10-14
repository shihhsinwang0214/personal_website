# U7.0–U7.3 知識秘境：連續問題鏈

日期：2026-10-13。沿用 intuition-first-academic-teaching 與 intuition-first-image-slides；本次改練功房腳本，來源筆記保持原文。

## 2026-10-15：U7.3 的 black-box reward 問題鏈

新增 `site/src/content/dojo/gradient-free-steering.zh.mdx`，來源為 `dma-gradient-free-steering`（現行 U7.3，legacy filename `dma-w10-4-gradient-free-steering.zh.mdx`）。沿用 `dma-guidance` 系列，`order: 3`、`progressVersion: "1"`，自動接在 U7.2 後面；首頁、四篇系列導覽、U7.2 的下一套連結與來源筆記橫幅依 collection 自動更新。

主線從「評審只會打分」出發，Mugi 提出完成後選擇、Lumi 提出途中分配草稿的後續計算、Nori 提出保留 deterministic generator 並換起點。先讀提案，分類時收起並提供唯讀回顧；角色不固定代表正確方法。

| 問題鏈 | 本頁的推導與檢查 |
|---|---|
| 挑最高分就抽對比例嗎？ | A/B/C 的 base 各為 1/3，倍率為 1/2/7；自己算 Best-of-2 的 C 比例 5/9，再比較 target 的 7/10。分清每趟候選 N 與重跑次數 n。 |
| 完成後按比例選呢？ | 從 target/base 比值得到 exponential weights；用 A/A/C 算 7/9，檢查有限候選、N=1、生成成本與 rare target。頁內補 self-normalized importance sampling。 |
| 草稿可以多留幾份嗎？ | 去噪估計與多次試畫、propagate/weight/resample、平均複本數與整數份數、共享祖先、deterministic 複本與 particle degeneracy。 |
| 每段都乘一次，會多算嗎？ | 自己算 H2=1、H1=2、H0=6 的新舊比值，推 potentials 消去；分清 FK path target、有限 SMC 近似與 FK steering/DAS。頁內補 proposal 校正、SMC 一致性與 ESS。 |
| 保留生成規則，改抽起點呢？ | 多個起點對同一作品的 toy、source tilt 與 output law、MCMC 接受機率、detailed balance、不同強度的 SPT chains、自己合併交換前後的比值。 |
| 最好候選能提供方向嗎？ | BoNG 放頁內延伸：先比較 predicted clean outcomes，再從固定 state 的去噪公式推出 noise prediction 位移；分清它與 exact tilt 的保證。 |

共 41 個主線節點、3 條誤解岔路、12 張分類卡片、8 個頁內補充。每個錯誤選項都有可重看的理由或岔路；兩題 Judge 各提供兩邊的回應。必要定義與推導直接在主線或頁內，不依賴讀者先看筆記。結尾連回來源 U7.3，並從模糊照片的評分問題接到 U7.4 筆記；不連到尚未製作的 U7.4 秘境。

### 圖片順序

使用者指出開場不能提前透露 Best-of-N 後，新增 `imgs/black-box-score.png`：只有一張完成照片、評分程式、假設的 7 分與「沒有修改線索」。箭頭只表示評分的 input/output，沒有多候選、排名或方法解答。使用內建 ImageGen 生成，檢查繁體文字與單張圖片的限制後保存原 PNG，由 Astro 輸出 responsive WebP。

原本的 `imgs/steering-candidates.png` 移到 Mugi 提出「先畫 N 張再挑」的 `best` 情境；結尾沿用來源的 `w10-4-gradient-free-steering.png` 整理三種機制，圖說補 source 強度不是 diffusion time、generator G 與 potential G 的角色差別。只調整圖片與圖說，不改主線步數或儲存欄位。

### 驗收

- MDX、imports、goto/back、提案群組、正確選項數與每個選項的理由均通過；210 個數學片段經 KaTeX 嚴格渲染，0 error。筆記結構／Ref／禁用句型檢查為 0 issue。
- 實際走完 41 個主線、所有錯誤理由與三條岔路；Judge 的兩邊、Think 與鍵盤分類可用，方法表每列整理後需要點按才進入下一列。
- 完成後續讀還原 12 張分類卡片、5 個提案回顧來源與解釋姿勢；6 個 Think 輸入清空。只記閱讀位置，沒有新增作答或評分儲存。
- 將正式 HTML 移除 scripts、保留 noscript 的教材模擬靜態閱讀：44 個節點與 12 張卡片皆可讀，8 個補充全開後，320px 沒有頁面或展示式橫向溢出，KaTeX error 為 0。
- `check-content.mjs` 通過（50 個既有 warning）；正式建置通過（220 頁），使用獨立 Astro/Vite cache 與輸出。新圖及原候選圖的位置、來源連結與 U7.0–U7.3 導覽已核對。未部署。

<details>
<summary>U7.3 新開場圖的 ImageGen prompt</summary>

```text
+Use case: scientific-educational.
Asset type: first question illustration for a Traditional Chinese Knowledge Realms teaching website, wide 16:9 landscape.
Primary request: depict the learner's problem BEFORE any solution is proposed: an external black-box evaluator can score ONE completed dog photograph, but supplies no advice about how to improve it. Do not reveal generating several candidates, choosing the best, reweighting, particles, or source search.
Scene: clean white canvas, polished natural softly shaded educational illustration, deep navy large Traditional Chinese typography, restrained blue process accents and coral detail, ample whitespace. Match a calm textbook illustration, no humans or mascots.
Composition: exactly ONE large completed photograph at left in a simple paper frame, showing a natural golden-and-white corgi wearing a red hat, realistic proportions, outdoor soft natural light. This is a single finished image, not a noisy draft, not a gallery and not one stage in a series. Center: a modest black-box scoring workstation with a blue computer screen and no exposed algorithm, label exactly「評分程式」. One thin blue connector carries the ONE photo into the workstation. Right: one large white response card showing exactly「7 分」, with a small neutral speech bubble below exactly「沒有修改線索」. A thin blue connector from the workstation to the card only represents input to evaluator and returned score. No vectors pointing to edits, no second photo, no edited output.
Text verbatim: top heading exactly「評審只肯給分數」; under left photo exactly「一張完成圖片」; central label exactly「評分程式」; response exactly「7 分」; speech bubble exactly「沒有修改線索」; bottom question exactly「知道它有幾分，接著能怎麼做？」.
Constraints: exactly one photo and one numeric score, ALL Chinese is Traditional Chinese, sparse large legible type for phone viewing, photo and scoring machine are dominant. The score is a hypothetical classroom score and the image must not imply that 7 is a probability.
Avoid: multiple candidates, thumbnails, gallery, rankings, winner/champion, Best-of-N wording, best selection, resampling, particles, copying pictures, flow paths, gradients, formulas, edited photos, correct/incorrect marks, red crosses, green ticks, page numbers, watermarks, invented methods or extra text. The illustration poses the problem without showing a solution.
```

</details>

## 每套要回答的問題

|編號|來源 note label|腳本|問題與收口|後面的缺口|
|---|---|---|---|---|
|U7.0|dma-test-time-steering|test-time-steering|新要求在使用時進入計算，生成模型的 θ 固定；比較 conditional training、fine-tuning 與 steering|圖片沒完成時，誰能提供修改訊號？|
|U7.1|dma-classifier-guidance|condition-guidance|Bayes 找出額外方向；比較 noisy classifier 的 input gradient 與 conditional/unconditional 差值；檢查 dropout、w=1、noise 換算及成本|只有乾淨圖片的 reward，沒有上述判斷能力時，目標是什麼？|
|U7.2|dma-reward-tilting|reward-tilting|從平均分數的集中問題加入 entropy，得到 exponential tilting；把 clean target 接到 noisy posterior average，再檢查 plug-in|Reward 不能微分時，如何只靠候選評分 steering？（來源 U7.3，本次不做）|

目前 U7.1 已合併 classifier guidance 與 CFG，U7.2 是 legacy filename `dma-w10-3-reward-tilting.zh.mdx`。依現行站內編號排列，沒有把舊 w10-2 當成另一套 U7.2。

## 移出、保留與避免重複

此節是第一版紀錄。2026-10-14 使用者要求秘境提供與來源相應的獨立學習內容後，移出完整 loss、Best-of-N 成功率及延伸的決定已被下方「學習夥伴與獨立內容」取代。

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

## 2026-10-14 學習夥伴與獨立內容

三套延續同一組學習夥伴：戴 orca 帽的北極熊 Nori（作者 mini）、有翅膀的鹿 Lumi、有柴犬臉的柯基 Mugi。Lumi、Mugi 暫名可再改。這次沒有製作角色圖，以字母頭像與動物描述辨識，`dojoPartners.ts` 預留 avatar。已有教學圖沿用。

先讀夥伴的具體做法，再看對應名稱，進入練習就收起該組提案。可用原生 details「再聽一次」重新對照；不是限時記憶考試，也不計分。角色會提出合理但有缺口的想法，沒有固定正確的角色。U7.1 只有兩種 guidance，Nori 檢查工具準備，不虛構第三種。

|單元|新的問題鏈與來源涵蓋|主線／岔路／卡片|版本|
|---|---|---|---|
|U7.0|三個提案 → 名稱配對 → 時間／θ／生成動作 → 固定參數限制 → conditional diffusion／FM losses → 偏好 regression 與更新式 → 額外方向的限制 → condition／observation／reward → Best-of-N 成功率 → fidelity／diversity|25／0／12|6|
|U7.1|Lumi 的 noisy classifier、Mugi 的雙回答、Nori 的準備檢查 → 收起後選輸入 → Bayes 與 input gradient → noisy classifier loss → conditional／unconditional 差 → dropout loss → CFG 係數 → noise 換算 → negative prompt → 五列工具比較 → 換工具遷移題|32／4／13|3|
|U7.2|最高分／原比例／重新分配三個提案 → 收起後選完整需求 → log base 角色 → 集中問題與 entropy → exponential 權重／正規化／KL 最佳性 → 同目標的 KL 寫法 → clean score 與 noisy sources → posterior 平均 → denoiser 提案 → 收起後檢查 plug-in → chain rule → 起始分布／exact target 限制|34／3／0|3|

頁內補充對照（不用離開秘境找定義）：

- U7.1：conditional noisy 起點與 Gaussian 近似、分類值與局部 gradient／robustness、已是 conditional base 的 classifier 額外係數、固定時刻的 power density 與時間一致性的差別、paper strength convention、Flow Matching dropout／velocity 組合與 path 前提。
- U7.2：MLE 中資料固定／θ 改變，以及平均 probability 和平均 log probability 的差別；多候選集中與連續空間極限；KL 懲罰與配對上限的推導；Bayesian observation 特例；RLHF objective 的共同結構與訓練流程差別；noisy 起始分布；posterior bias、mode selection 和 reward over-optimization 的研究脈絡。
- 必要的 noisy classifier／dropout losses、entropy objective、p_R 最佳性、h_t 與 base posterior、denoiser 換算、chain rule 直接在主線，不只藏在答錯岔路。
- U7.0 只提出一般 steering 計算與來源已有的 Best-of-N 命中率；U7.1 推 condition 的方向；U7.2 才處理 reward target 與 posterior average。沒有把 R(x_t) 偷渡成已知的 noisy reward。
- 來源 labels 與結尾連結不變；新增主線使舊閱讀步數不再對應，故遞增版本。仍只存 `{version,step,total}`，不保存輸入文字或對錯。

本版驗收：

- 三套合計 91 個主線步驟、7 條岔路、25 張卡片；482 個數學片段已檢查 KaTeX 語法，MDX、imports、提案群組與 goto/back 均有效。
- 三套主線實際走到結尾；選擇題的錯誤理由與岔路、答後重看、Judge 兩邊與 Think 都可用。分類用 Enter／Space 操作，錯放有提示，每列完成後仍需按鈕才露出下一列。
- 提案在練習前收起；回顧可反覆開關，沒有新增主線節點或重複節點 ID。續讀後 U7.0／U7.1 還原 12／13 張卡片，U7.2 兩組回顧也還原；原提案收起，全部 Think 留空。
- 用移除 scripts、保留 noscript 內容的 production HTML 驗收靜態閱讀：三套 25／36／37 個節點全部可讀，角色、卡片分類與結尾連結保留。展開全部頁內補充後，320px 無頁面或公式橫向溢出，KaTeX error 為 0。
- 桌面版的角色卡片、從頭開始與三套連結已檢查。`npm run check` 通過（50 個既有 warning），正式建置通過（219 頁）。建置使用隔離的 Astro／Vite cache 與輸出。未部署。

## 2026-10-14 核准形象與去背動作圖

使用者核准穿衣服、有道具的 v2 形象後，三位夥伴各有迎接、提出想法、解釋與提問四張透明 PNG，共十二張。原稿放在 `site/src/assets/dojo/partners/`，由 Astro 產生不同尺寸的 WebP；九張新動作的 ImageGen prompts 與檔案對照保存在 `docs/dojo-partner-assets.json`。

首頁介紹三位夥伴。U7.0–U7.2 的主線與岔路依說話者、動作使用對應圖片；提問完成後換成解釋姿勢，表格每列完成先解釋，按下一列後回到提問。答錯不換成懲罰表情。回顧保留原提案的角色圖，表格欄頭使用小型迎接圖。沒有增加主線節點或修改進度儲存欄位。

本版驗收：

- 十二張原稿皆為 1254 × 1254 PNG，檢查 alpha 通道確有透明像素。
- 實際走完三套共 91 個主線步驟，選擇、岔路返回、是非、自由思考與分類表的提問／解釋切換正確；逐列整理後需點按才進入下一列，姿勢也隨之還原。
- 回顧開關保留夥伴圖片，沒有重複節點；續讀能還原解釋姿勢，自由思考欄位留空。
- 首頁與三套主線在 320px 視窗均無頁面或公式溢出。以移除 scripts、保留 noscript 的正式 HTML 驗收靜態閱讀，25／36／37 個節點及夥伴皆保留，展開頁內補充後仍無橫向溢出。
- `npm run check` 與正式建置通過（219 頁；50 個既有 warning）。建置使用獨立 cache 與輸出，未部署。

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


