# OG 預覽圖 / Lab 視覺設計需求（交給繪圖 agent）

## 背景
目前全站 `og:image` 指向 `images/personal_photo.jpeg`（`site/src/layouts/Base.astro:41`），
所以貼連結給別人時預覽都是大頭照。目標：改用一張符合實驗室理念的品牌圖卡。

## 交付物
1. **og-card.png**（必要）：1200 × 630 px，PNG 或 JPG，檔案 < 300 KB。
   存到 `site/public/images/og-card.png`。
2. **logo.svg**（建議）：正方形向量 logo，可縮到 32px 仍清晰。
   之後可取代目前的臨時 favicon（橘底白字 "S"）與導覽列頭像。
3. （可選）og-card 深色版，供未來筆記頁使用。

## 品牌內容（圖卡上的文字）
- 主標：**Shih-Hsin Wang 王士欣**（或未來實驗室名稱，待定）
- 副標：Geometric Deep Learning · Generative Models · AI for Science
- 小字：CSIE, National Taiwan University
- 不放照片、不放 email。

## 色彩（沿用網站現有 palette，保持一致）
- 背景：暖米白 `#f6f3ee`（網站 light mode `--bg`）
- 主色：靛藍 `#2a4ea3`（light mode `--accent`）
- 點綴：金色 `#d8a44a`（dark mode `--accent`），少量使用
- 深色版背景：`#17181c`

## 視覺概念（擇一或融合，體現研究理念）
研究理念是「理論/數學基礎 → 可靠高效的實務應用（分子、生物、科學）」。候選 motif：

- **A. 幾何圖網路**：抽象的 3D 點與邊構成的 graph（equivariant GNN 意象），
  節點可漸變成分子/蛋白質結構，象徵 geometric DL → AI for Science。
- **B. 流線／flow matching**：一組平滑流線把散亂點雲「輸運」成有序結構
  （分子形狀），象徵 generative models 從 noise 到 structure。
- **C. 雙層意象**：下層是淡淡的數學元素（流形、方程式線稿）當地基，
  上層浮出清晰的分子 graph，直接對應「Theory → Application」。

風格：extremely clean、學術、幾何線條為主、大量留白；避免 3D 渲染感、
避免 AI 生成的雜訊細節；文字必須在縮圖尺寸（約 500px 寬）仍可讀。

## 技術後續（圖完成後，由網站端執行）
1. 圖存入 `site/public/images/og-card.png`。
2. 修改 `site/src/layouts/Base.astro:41`：
   `const ogImageUrl = new URL(withBase('images/og-card.png'), Astro.url).href;`
3. （可選）在 Base.astro 加 `ogImage` prop，讓個別頁面可覆寫。
4. 部署後用 Facebook Sharing Debugger / LINE Page Poker 重新抓取，
   清掉各平台舊的預覽快取（否則短期內仍會顯示舊照片）。
