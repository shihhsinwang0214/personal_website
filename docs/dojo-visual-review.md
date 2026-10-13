# 練功房原型：畫面、問題鏈與圖片

> 本檔記錄 2026-10-12 的 U7.0 原型。2026-10-13 已重新分配內容到 U7.0–U7.2；最新主線、圖片與驗收見 `docs/dojo-u7-sequence.md`，下方原型節點數不代表目前版本。

來源：`site/src/content/dojo/test-time-steering.zh.mdx`，對應筆記 label `dma-test-time-steering`。

## 教學範圍

讀者已經知道 diffusion 的 noisy image、denoising regression 與 score。這套練習讓讀者分清模型參數、生成中的圖片與回傳結果，並說出新要求必須透過訊號進入計算。完整 training loss 與 guidance 推導仍連回來源筆記。

主線：模型已會生成狗 → 使用時才收到紅帽要求 → 固定參數的限制 → 額外評分的角色 → score 與 input gradient → 生成後再挑的成本 → 三種做法逐列比較 → 新障礙物的資訊缺口 → noisy image 上的訊號如何取得。

## 圖片順序與對應

|檔案|插入位置|教學用途|對應與界線|
|---|---|---|---|
|steering-new-request.png|開場 Say|讓「需求在訓練後才出現」可見|左邊是模型的生成能力；右邊是要求示意，並非已經生成的答案|
|steering-candidates.png|Best-of-N 的 Think 前|先預測完成後挑選的計算花費|六張是六個獨立候選，不是同一張圖片的六個 noisy states；比例是示意|
|steering-new-obstacle.png|最後 Judge|把資訊缺口轉移到新場景|兩幅圖保持同一起點、終點與舊路線；藍線是空間中的機器人路線，不是 diffusion trajectory|

三張圖都由 built-in ImageGen 生成，逐張檢查文字和幾何後存進 `site/src/content/dojo/imgs/`。本次是網站輔助圖片，不組裝 PPTX。網站使用 Astro Image 輸出響應式 WebP，原 PNG 可點圖另開查看。

## 原型檢查與修改

- 原本第一題的三種做法都能用，缺少判斷標準；改成先提出固定參數的限制。
- 原本說每換新要求都要重訓 conditional model，容易誤導；補上既有文字模型可以泛化到新組合。
- fine-tuning 的未展開 loss 改成一筆偏好圖片上的 denoising 平方誤差與參數更新，解釋微分對象。
- 加入 input gradient 的判斷與兩條岔路，分開求 gradient、更新參數與增加 sampler 步數。
- Best-of-N 補獨立抽樣、全部沒命中、取補事件的推理與 1% 的數字例子。
- 岔路返回時收起；保持可重訪；錯放卡片回應概念原因，不用搖晃或紅色懲罰。
- 表格一次只露一列的三張卡片，最後顯示完整比較；卡片與格子都支援 Enter／Space，Escape 取消。
- 舊版 progress 不套入新問題順序；只存版本與步驟，文字不存。
- 加入練功房後導覽在中間寬度會拆開中文字，改成較早收進選單，連結不拆字。

## 驗收

- 11 個主線節點、4 條岔路；節點 ID、goto/back、來源 note label 與跨篇 Ref 均存在。
- 58 段 inline/display math 經 KaTeX 嚴格渲染，無語法錯誤；9 個表格格子完整，3 個圖片 import 存在。
- 實際瀏覽器走完 conditional training、fine-tuning、參數 gradient、增加步數四條岔路；返回後原題可操作，岔路收起。
- Judge 的兩種回應、Think、逐列 Sort、最後來源連結、重新開始均走過。
- Sort 測試錯放理由、Enter、Space、點選、原生桌面 drag；每次只顯示目前列的 3 張待放卡片，完成後共有 9 張。
- 續讀會還原完整比較表、移除開場的舊繼續按鈕；Think 的輸入在 reload 後清空。
- 以移除 scripts、展開 noscript 的 production HTML 模擬靜態閱讀：15 個節點與 9 個卡片分類都可讀，結尾保留來源筆記連結。
- 檢查手機、平板及桌面寬度，亮暗主題；320px 的 Best-of-N 機率式改成兩行。
- `npm run check` 通過（50 個既有 warning）；`npm run build:astro` 通過（217 個頁面）。沒有部署。

## 生成 prompts（原文）

### 圖 1

```text
Use case: scientific-educational.
Asset type: website Dojo question illustration, landscape 16:9 canvas, finished bitmap teaching scene in Traditional Chinese.
Primary request: show a dog-image generation model was already trained, and ONLY AFTER training the user asks for a dog in a red hat. Do not show the solution or any method names.
White background, large deep-navy heading, restrained blue accents with red used only for the desired hat; generous whitespace, elegant clean simplified illustration, soft natural painterly shading. No people, no avatars.
Exact title at upper left: 「模型已經訓練好了，現在才收到新要求」
Composition: at left a desktop monitor showing a 2x2 gallery of four plausible dog photographs rendered as soft illustrations: varied breeds, poses, background, one dog wearing a blue cap; none wearing a red hat. Below monitor exact label 「已訓練好的模型」. At center a large horizontal blue timeline arrow from the left monitor to the right arriving request, with exact label 「使用時」 above arrow. On the right a request message bubble with exact text 「這次想要戴紅帽的狗」 and a large small reference thumbnail INSIDE the request bubble showing a dog with a red baseball cap, clearly a requested example not an output. Under bubble exact label 「新要求」.
At bottom only the question 「你會怎麼讓它符合這次的要求？」. No answer, no green ticks, no red crosses, no equations, no other text, no footer, no page number, no watermark. Visual continuity: navy and blue clean classroom illustration, dogs are realistic proportions and recognizable, scene is dominant, text is sparse and large readable on phone. Do not draw a retraining or guidance pipeline; the question has not been answered yet.
```

### 圖 2

```text
Use case: scientific-educational.
Asset type: website Dojo learning question image, landscape 16:9 white canvas.
Primary request: visualize generating a batch of completed candidate dog pictures and then choosing just ONE. Ask whether this is an efficient strategy without giving the answer.
Exact upper title in deep navy: 「那就多生成幾張，最後再挑？」
Large central desktop gallery of exactly SIX complete dog thumbnails arranged 2 rows by 3 columns, all equal-sized and equally visible. Top row left golden retriever no hat; top center corgi wearing a BLUE hat; top right border collie no hat. Bottom row left poodle no hat; bottom center a golden retriever wearing a clear RED baseball hat; bottom right corgi wearing a YELLOW hat. These are six separate samples, not stages of denoising; all photos are completed and crisp, naturally illustrated. Above gallery small text 「六個獨立生成的候選」. No thumbnail is highlighted or marked as selected. To the RIGHT of gallery a white empty picture frame outlined blue with a large navy question mark in center; below exact text 「只回傳一張」. A single blue arrow from gallery to empty frame indicating a selection operation. Bottom question exactly 「如果紅帽很少出現，這樣要等多久？」
Style: clean polished educational illustration, realistic dog proportions, soft natural shading, white space, deep navy title, blue process accents; red only on red hat. Sparse large Traditional Chinese labels readable on mobile. No probabilities, no formula, no score numbers, no method names, no answer, no green ticks, no crosses, no humans, no avatar, no page number, no watermark. Do not put the red-hat picture into the empty frame: leave the learner to select.
```

### 圖 3

```text
Use case: scientific-educational.
Asset type: website Dojo final transfer question illustration, landscape 16:9 white canvas.
Primary request: show that a robot route planned from old scene information intersects an obstacle newly added AFTER model training. Ask what missing information the model needs. Do not show the solution.
Exact deep navy heading at top: 「場景多了一個障礙物，模型會自己知道嗎？」
Two large matched overhead maps side by side; SAME coordinates, SAME start, SAME target, SAME old blue planned route in both panels. Light neutral floor/grid, simple indoor delivery setting with very muted shelves around outer edges. Left map label 「原本的場景」. A small clearly recognizable wheeled delivery robot is at bottom-left START with label 「起點」; destination flag is at top-right with label 「終點」. One blue gently curved planned route starts bottom-left and ends top-right via center. Right map label 「訓練後才放進來」. Same robot start, same flag end, SAME blue old route, but a large coral-red rectangular crate obstacle now occupies the CENTER exactly on top of the old blue route. Route is dashed ONLY where occluded by obstacle to expose the collision, not routed around it. Short red callout 「新障礙物」 points at crate. Do not draw any avoiding route or correcting arrows. Between panels small gray right-pointing arrow only showing scene time change.
Bottom exact question 「只增加 sampling 步數，會多出這個資訊嗎？」
Style: spatially legible, polished softly shaded natural simplified illustration; white background, navy headings, blue base route, red new obstacle, selective detail. No people, no avatar, no formulas, no claims of successful avoidance, no green ticks, no red crosses, no page numbers, no watermark. All text Traditional Chinese and large enough for mobile. The blue route MUST intersect the red obstacle in the right map and endpoints MUST match between panels.
```


