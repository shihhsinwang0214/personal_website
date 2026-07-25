# SAM Lab 視覺識別設計規劃(Logo mark + Hero)

給繪圖 agent 的完整規格。目標:一套風格一致的視覺系統 —— 小尺寸 logo mark + 首頁 hero 圖。

## 1. 背景

- 名稱:Structure-Aware Modeling Lab(SAM Lab)· 格物致知實驗室
- 標語:Uncover the structure of things to expand the bounds of insight / 窮究事物之結構,拓展無盡之理解
- 理念關鍵詞:structure(geometry、symmetry、hierarchy、constraints)、研究循環「直覺 → 數學 → 計算 → 實證」、generative modeling / sampling(從 noise 到 structure)、科學發現作為試驗場
- 網站視覺(必須沿用):
  - Light:底 `#f6f3ee`(米白)、accent `#2a4ea3`(靛藍)
  - Dark:底 `#17181c`、accent `#d8a44a`(金黃)
  - 字體:標題/標籤大量使用 monospace(網站 CSS 變數 `--font-mono`)
  - 整體風格:學術極簡、大量留白、細線條

## 2. 核心概念:「從無序到結構」(noise → lattice)

散亂的取樣點沿流線收斂為規則格點(lattice)。一個圖形同時承載三層語意:

1. Structure-aware:lattice = geometry / symmetry / hierarchy
2. Generative / sampling:noise 被引導(guidance)流向結構
3. 「格」物致知:格 = 網格。lattice 本身就是「格」字的視覺本義,不需畫出漢字即完成中文命名的呼應

## 3. Logo mark 規格

- 形式:純向量 SVG,單色,transparent 背景
- 構圖:3×3 圓點格。其中沿「S」軌跡的節點以折線/弧線連接(S = SAM 的隱字);左下角一顆點偏離格位,一條細曲線將它「拉回」最近的格點 —— 象徵 sampling/guidance 把無序導向結構
- 建構網格:24×24 viewBox;點半徑 1.5;線寬 1.5,`stroke-linecap="round"`;四周留白 ≥ 2 單位
- 節點層次:S 軌跡上的節點用實心點,其餘節點用較淡(opacity 0.35)實心點 —— 表現 hierarchy
- 交付變體:
  1. `mark.svg` — 所有 fill/stroke 用 `currentColor`(CSS 可換色,首選)
  2. 檢查 16px 與 32px favicon 縮圖:若「偏離點+曲線」在 16px 不可辨,簡化為只留 3×3 點 + S 連線
- 橫式 lockup(`lockup.svg`):mark + `SAM Lab`(monospace,medium weight)+ 次行小字 `Structure-Aware Modeling Lab · 格物致知實驗室`(可選,小尺寸時省略次行)

## 4. Hero 圖規格

- 形式:優先 SVG(寬幅約 1600×560),顏色全部使用網站 CSS 變數,使其自動適應深淺模式;若繪圖工具只能出定色,交付 light/dark 兩版
- 構圖(左 → 右敘事,水平三段):
  - 左段:低透明度亂散點(noise),疏密隨機,opacity 0.15–0.3
  - 中段:細流線(1px 級)引導散點向右收斂,透明度漸增;流線間隔不均,忌對稱呆板
  - 右段:規則 lattice(與 logo mark 同構的 3×3 子區塊嵌在其中,作視覺呼應),節點清晰、accent 色
- 密度:整體稀疏,留白 ≥ 60%;hero 上會疊標題文字,左上與中央偏左需保持乾淨
- 可選動畫:點沿流線緩慢漂移(CSS/SMIL),`prefers-reduced-motion` 時停用

## 5. 禁止事項

- 不用腦、神經網路節點球、六邊形分子、機器人、電路板等 AI/科技陳腔濫調
- 單一圖形不超過兩色(accent + 灰階)
- 不用漸層、陰影、光暈、3D、噪點材質
- 文字一律 sentence case,不用斜體漢字

## 6. 交付清單與放置位置

| 檔案 | 位置 | 說明 |
|---|---|---|
| `mark.svg` | `site/public/logo/` | currentColor 單色 mark |
| `lockup.svg` | `site/public/logo/` | 橫式組合 |
| `favicon.svg` | `site/public/` | mark 簡化版 |
| `hero.svg`(或 `hero-light.svg`/`hero-dark.svg`) | `site/src/assets/` | 首頁 hero |

驗收:16px favicon 可辨識;深淺模式各截圖一張;SVG 經 svgo 最佳化;hero 疊上標題文字後仍可讀。

## 7. 英文 prompt(若用 AI 圖像生成 hero 的 raster 版)

> Minimalist academic hero illustration, wide 1600x560. Sparse scattered dots on the left (noise) flow along thin 1px curved streamlines toward a clean regular dot lattice on the right (structure). Two colors only: indigo #2a4ea3 on warm off-white #f6f3ee (light version) / muted gold #d8a44a on near-black #17181c (dark version). Flat, no gradients, no shadows, no 3D, generous negative space (60%+), left side kept clean for headline text. Style: precise, mathematical, quiet.
