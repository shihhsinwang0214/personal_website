# Design system

站上的設計系統其實一直存在，只是散在 `site/src/styles/global.css` 裡沒有寫下來。
這份文件把它整理出來，給之後維護的人（含 agent）。

搭配閱讀：`lab-rpg-rules.md`（名詞對照與第一原則）、`lab-interaction-plan.md`
（互動的三個篩選問題）、`lab-expedition-redesign.md`（遠征介面的取捨）。

---

## 1. Tokens

全部定義在 `:root` 與 `:root[data-theme=dark]`。**不要在元件裡寫死顏色。**

| 用途 | 變數 | 淺色 | 深色 |
|---|---|---|---|
| 背景 | `--bg` | `#f6f3ee` | `#17181c` |
| 面板／卡片 | `--surface` | `#fffdfb` | `#1f2126` |
| 次層 | `--surface-2` | `#efeae1` | `#262830` |
| 內文 | `--text` | `#1f2733` | `#e9e6e1` |
| 次要文字 | `--text-muted` | `#646c78` | `#9a988f` |
| 重點色 | `--accent` | `#285a83`（海藍） | `#8bbce0`（淺海藍） |
| 框線 | `--border` | `#e7e0d6` | `#2c2d31` |
| 燙金 | `--foil` | `#a8842c` | `#d8a44a` |

全站介面採「海藍杏橙」：`scholar-theme.css` 覆寫基礎 accent，深色使用較亮的海藍；
杏橙 `--icon-apricot` 留給圖示重點與深色焦點環。燙金仍只用於既有 `--foil` 成員卡。
兩個主題都必須可用。

其他：`--radius-sm/--radius/--radius-lg`（8/12/20）、`--space-1..8`、
`--dur-fast/--dur/--dur-slow`、`--shadow-sm/md/lg`。

### 字體

- `--font-main`：Plus Jakarta Sans → CJK fallback
- `--font-mono`：Space Mono → CJK fallback

**`--font-mono` 沒有中文字符。** 任何會出現中文的地方都不能依賴它的字形——
這也是不能用像素字體的原因。所以所有 mono 標籤都是**英文**。

---

## 2. Primitives

### `.hud`

角落括號。`position:relative` + `::before/::after` 畫左上、右下兩個直角。
用在任何「這是一個面板」的容器上。

`.hud-tag`：面板左上角的 mono 小標。`.hud-stats` / `.hud-stat`：dt/dd 的統計列。

**與 `--foil` 互斥**：燙金卡片會把 `.hud` 的括號設成 `opacity:0`，改用四角花紋
（`.foil-frame` + `.foil-corner`），否則兩種角落裝飾會打架。

### Mono 標籤

一律英文、大寫、`letter-spacing` 約 `.1em`、`--text-muted` 或 `--accent`。

現有的：`ROLE` `QUEST` `JOINED` `HOBBY` `NODE n/m` `EXPEDITION` `CODEX`
`MISSIONS` `TUTORIAL` `SKILL MANUAL` `HOW WE LEVEL UP` `RECRUITMENT QUEST`
`MAIN QUEST 01` `SYMPTOM` `WHY` `COUNTER` `ENCOUNTER` `PARTY STATUS`。

相關 class：`.handbook-nav-tag` `.section-tag` `.lab-tree-tag` `.panel-label`
`.quest-code` `.quest-field-label` `.node-counter`。

### 面板 `.panel`

`.panel` + `.panel-head`（`.panel-label` ＋ 右側 `.panel-count` / `.panel-stamp`
/ `.panel-status`）＋ 內容 ＋ `.panel-link`（`margin-top:auto`，所以多個面板的
連結會對齊在底部）。`.panel-wide` 橫跨整個 console。

### 卡片

三種，共用同一套視覺語言：

| class | 用在哪 | 特徵 |
|---|---|---|
| `.member-card` | 成員 | 3:4 照片、可選翻面、可選 `.is-foil` |
| `.quest-card` | 研究方向 | `MAIN QUEST nn` 標籤、只渲染有值的欄位 |
| `.monster` | 怪物圖鑑 | 左框線分級、四欄固定格式 |

---

## 3. 版面

- 斷點：**460**（卡片內部直排→橫排）、**760**（多欄網格）、**960**（側欄固定顯示）
- 網格一律 `repeat(auto-fit, minmax(Xpx, 1fr))`，不寫死欄數
- 圖片一律給 `width`/`height` 與 `loading="lazy"`，避免版位跳動

---

## 4. 不變的規則

這幾條踩過坑，寫下來避免重犯：

1. **`[hidden]` 不一定會隱藏。** 任何設了 `display:` 的 class 都會蓋掉它。
   `global.css` 有一條 `[hidden]{display:none !important}` 一次解決。
2. **照片欄不要 `align-self:stretch`。** 高度會隨文字欄變動，`cover` 每張裁法
   都不同，看起來像圖片載入後又被裁一次。固定 3:4。
3. **不要用像素字體、掃描線、發光、音效。**
4. **`prefers-reduced-motion` 一律遵守。**
5. **同一件事只說一次。** ROLE 那行寫了「遠征隊隊長」，就不要再掛一個
   `EXPEDITION LEADER` 徽章；分組標題寫了「專題生」，卡片上就不用重複。
   用文字或用視覺處理，擇一。
6. **空欄位不要渲染。** 一整片「—」看起來像沒人維護。成員卡與 quest 卡都只
   輸出有值的欄位。

---

## 5. 資料在哪裡

| 內容 | 檔案 |
|---|---|
| 研究室名稱、理念、Why/How/What | `src/lib/handbook.ts` → `labInfo` |
| 手冊分區與標籤 | `handbookSections` |
| 成員 | `labMembers`、型別 `Person` |
| 招募狀態（單一來源） | `recruitmentStatus` |
| 主線任務 | `src/lib/mission.ts` → `mainQuests` |
| 怪物 | `src/lib/bestiary.ts` → `monsters` / `draftMonsterIds` |
| 個人資料、news、research | `src/data/content.ts` |

### 待填：Main Quest 的內容欄位

`mainQuests` 目前只有名稱與描述（沿用 `research`）。以下欄位**刻意留空**，
因為只有本人寫得出來，卡片會自動略過沒有值的欄位：

- `question` — 這個方向想回答的那一個科學問題
- `status` — 目前走到哪，一句話
- `crew` — 對應的成員名字（要和 `labMembers` 裡的名字一致）

填完之後不需要改任何元件，卡片會自己多出那幾欄。

---

## 6. 遊戲語言用在哪、不用在哪

**用**：mono 標籤、狀態指示、區塊 metadata、框線與面板層級、互動細節。

**不用**：正文。內容一律用學術語言。

**完全不碰**：Publications、Experience、Awards、CV。這些是升等與招聘委員會讀的
頁面，維持既有的學術呈現。


## 7. 全站外框與搜尋（2026-11）

`src/styles/site-polish.css` 接在 `global.css` 後，管理全站外框、首頁入口與搜尋。
課程地圖、研究室面板與教材元件的樣式仍由原本的樣式管理。

- 頁首高度來自 `--header-h`：桌面 72px，1199px 以下 64px。
- 導覽在 1200px 起完整顯示；以下使用抽屜。這是頁首專用斷點，避免英文導覽在平板擠在一起。
- `--page-gutter` 控制全站兩側留白；`--border-strong` 與 `--accent-soft` 由既有主題色推導。
- 頁首圖示按鈕最小 44 × 44px，手機 320px 寬仍保留此尺寸。
- 頁首搜尋採原生 `<dialog>`，支援 Esc、背景點擊、焦點返回與 ⌘ / Ctrl K。
- `SearchPanel.astro` 接受 `lang` 與唯一 `id`。筆記首頁與搜尋對話框共用元件，避免重複的元素 ID。
- 正式版使用 Pagefind 全文索引；開發版及全文索引不可用時使用 `search-index.json` 的標題、摘要等 metadata。
- 搜尋固定顯示在地圖／列表切換之外，不受瀏覽模式影響。
- 筆記目錄在手機預設收合、桌面預設展開，兩側閱讀欄的 sticky offset 都由頁首高度計算。
- 網站仍採完整頁面導覽，讓既有教材、Python 實驗與 iframe 依原有生命週期載入。


## 8. 以訪客目的整理入口（2026-11-07）

- 首頁先提供學習、研究著作、招募三個入口；完整研究介紹保留在 disclosure，課程區移至消息之前。
- 頂部導覽以「課程筆記／互動學習」說明目的，互動學習內頁保留知識秘境的名稱。
- 筆記首頁首次預設課程列表；選擇過的地圖模式仍會保留。各課提供第一篇、總覽與單元 disclosure，降低初訪時的連結密度。
- `ReadingResume.astro` 共用於首頁與筆記首頁，只連至目前可發布的內容，並支援原閱讀語言。接續連結可返回上次章節；一般點開筆記維持從頭閱讀。
- 閱讀紀錄只儲存筆記識別、顯示標題、語言、時間與章節 ID；不記錄實驗內容、作答或程式。沿用 `clearReading()` 一併清除。
- 研究室頁首提供成員、招募、手冊入口；手機側欄的 summary 專門展開導覽，回首頁另有明確連結。
- 互動學習先交代怎麼開始，詳細說明可展開閱讀。主題數量依當下可見內容計算，正式版仍排除本機草稿。
- `PublicationTools.astro` 提供標題／作者／會議關鍵字與領域篩選；空結果有復原提示。JavaScript 不可用時，完整著作仍可閱讀。
- 全域 `[hidden]` 規則明確隱藏含 `display` 樣式的元件，避免空白接續卡與篩選後內容殘留；保留 `hidden="until-found"` 的瀏覽器行為。


## 9. 主要入口的去背插圖（2026-11-09）

首頁的課程、互動學習、研究、研究室入口分別搭配書本、問答卡、論文圖表、協作研究者的去背插圖。
圖像採海藍、杏橙與暖白，文字仍是入口的主要名稱，不依賴圖片或顏色才能辨識。

- 原圖與生成提示詞保存在 `site/src/assets/navigation/`，使用內建 ImageGen 生成，PNG 保留透明 alpha。
- 以 Astro `getImage` 輸出透明 WebP，SVG viewport 顯示原圖集中的單一圖示，不直接載入原尺寸 PNG，也不改寫原圖。
- 桌面入口插圖 112px、平板 96px、手機 72px；預留固定圖框，避免載入時版面跳動。
- 插圖與文字共用同一個連結，不新增焦點或獨立按鈕；`alt=""` 與 `aria-hidden="true"` 避免螢幕閱讀器重複播報。
- 大圖放在主要入口；頁首操作與分區導覽使用共用的輕量像素圖示。


## 10. 學者的輕量 RPG 介面（2026-11-09）

作者指定「稍微 gaming，但又有學術性」。首頁、課程目錄與共用導覽可使用探索式介面；學術正文、論文紀錄、經歷與 CV 維持原本的文字與閱讀方式。

- `scholar-theme.css` 接在 `site-polish.css` 後，以 `.scholar-site` 管理全站介面。首頁、課程、互動學習與研究室共用細角框、菱形節點、海藍杏橙與去背物件；閱讀區正文維持既有排版。
- 首頁以研究者手記、淡座標格、細角框卡片與 hover／focus 選取回饋建立趣味。`01 / 04` 是四個真實入口的位置，不是等級或成績。
- 作者選定漫畫大圖、像素小圖與海藍杏橙：使用 `navigation/matched-palettes/01-ocean-apricot-large-v1.png` 與 `01-ocean-apricot-small-v2.png`。歷次提案原圖保留；內建 ImageGen 編修提示詞在同目錄的 `prompts-v1.json`。
- 文字標籤仍清楚描述課程、著作與申請目的。圖像、位置碼與游標均不重複朗讀；不新增遊戲化評分、音效或發光動畫。
- 動效只在 hover／focus 短暫移動，`prefers-reduced-motion` 時停用位移。手機維持圖文並排，平板改為圖在上方。

### 全站延伸與首頁主視覺

- 首頁移除波浪 SVG，以 `research-atlas-v2.png` 的研究手札與幾何模型取代（v1 保留作為歷史素材）。桌面放在介紹旁，手機縮成右上角的小物件，不與姓名或研究摘要重疊。使用內建 ImageGen，提示詞與參考圖記在 `prompt-atlas-v2.json`；Astro 輸出響應式透明 WebP。
- `ExplorationMark.astro` 共用像素書冊、問答卡、協作研究者與英文小標，標示課程目錄、課程總覽、互動學習和研究室入口；圖像不另設焦點，不取代清楚的中文標題。
- 課程單元使用菱形節點、展開回饋與章節卡片；閱讀頁只調整頁首細線、筆記代碼、目錄與目前章節提示，不替正文增加紋理、裝飾字體或動畫。
- 互動學習的預設 board 主題改用手札面板，取消厚木框、圖釘與傾斜文字，保留原有學習夥伴、作答流程與實驗。其他明確選用的 dojo 主題維持原設定。
- 研究室沿用遠征面板，統一卡片角框、側欄與路線節點。所有狀態、數量和閱讀紀錄仍來自真實資料；不引入等級、分數或虛構任務。
- 著作、經歷與個人介紹沿用共用頁首及標題細線，論文列表、履歷內容與 CV 保持正式學術呈現。列印時隱藏入口裝飾。

## 11. 海藍杏橙與圖示動作（2026-11-09）

- `NavigationIcon.astro` 共用四種語意（learn、practice、research、lab）：首頁大圖採漫畫版，分區識別採 32px 像素版，所有導覽項目採 20px 像素版。其餘語意與操作使用 `PixelIcon.astro`。
- `navigation-icons.css` 與 `navigationIcons.ts` 管理動作。課程入口用一張 SVG 紙頁沿書脊翻轉（850ms）；問答卡顯示選取脈衝、論文輕抬、研究室螢幕出現短暫亮點。原圖保持完整，不為動畫改畫學術內容。
- 大圖在滑鼠移入整張入口卡片或鍵盤 `focus-visible` 時播放一次，停留不會循環。小像素圖維持靜態。
- 滑鼠效果只在 `hover:hover` 且 `pointer:fine` 時啟用；觸控不攔截連結、不要求第一次點擊播放動畫。
- `prefers-reduced-motion:reduce` 停用所有圖示動畫與動態圖層；列印不顯示動態圖層。圖示不增加焦點與朗讀內容。
- `node scripts/build-icon-preview.mjs --motion` 可輸出獨立的互動預覽；`--palettes` 保留五配色比較頁。這些預覽不列入正式網站發布。


## 12. RESEARCH ATLAS 與全站像素圖示（2026-11-09）

- 主視覺 v2 以漫畫大圖圖集為風格參考、v1 為構圖參考，改成深藍粗線條、海藍／杏橙色塊與暖白紙張。原 PNG 保留透明 alpha；上線使用 Astro 產生的透明 WebP，不對位圖套濾鏡改色。
- `PixelIcon.astro` 與 `lib/pixelIcons.ts` 補齊首頁、人物、經歷、CV、招募幼苗、指南針、學位帽、顯微鏡、地圖、怪物，以及搜尋、選單、關閉、日夜、列表、地圖模式、收信、位置、RSS 與方向操作。共用 32px 格線與既有 `--icon-*` 色票。
- 四個已選定的主要圖示繼續使用原像素圖集。新增的小圖以 SVG 階梯輪廓延伸系統；不混用系統 emoji。官方 GitHub／LinkedIn 標誌保留其辨識輪廓。
- 主導覽八個入口都有圖示與文字；目前頁面另加杏橙底線。1200–1439px 桌面導覽使用縮寫姓名與較緊的間距，手機保留 44px 按鈕與抽屜導覽。
- 研究室側欄、路線分類、成員、研究任務與圖鑑共用相同語意圖示；著作、經歷與關於頁補上 32px 分區標記。展開箭頭、返回頂端與公式步驟操作也採同一套像素輪廓。
- 圖示全部為裝飾層，`aria-hidden="true"`、`focusable="false"`；控制項保留文字或原有 accessible name。小圖不加入動畫。學術正文、實驗圖表與公式不受影響。


## 13. 研究主題圖集與瀏覽次數（2026-11-10）

- `ResearchAtlas.astro` 選用「雜訊到結構」、「幾何結構羅盤」與新製「生成與方向引導」三張透明插圖。候選與舊版原圖保留，首頁使用 Astro 響應式 WebP。新增圖片與完整 ImageGen 提示詞記在 `navigation/atlas-research-candidates/prompt-steering-v1.json`。
- `lib/researchAtlas.ts` 每 8 秒切換一次，450ms 淡入淡出。只有圖片與標題更新，姓名、研究摘要和入口維持穩定。上一張／下一張會停在選定圖片，訪客可明確重新開始自動切換。
- 滑鼠／筆停留暫停，離開後續播；鍵盤首次聚焦則停止，直到明確按播放。頁籤隱藏與圖集離開視窗時也暫停。減少動態效果設定停用自動播放與淡入淡出，保留手動切換。
- 圖集使用單一輪播群組、目前圖像名稱與計數，未顯示的圖片 `aria-hidden=true`。只有手動切換會以 polite live region 提示；自動播放不重複播報。無 JavaScript 時顯示第一張靜態圖片。
- 手機保留 44px 的上一張／播放暫停／下一張按鈕，研究摘要下方仍維持原字級與行距。
- `VisitorCounts.astro` 置於共用頁尾，顯示本頁與全站累計數。使用既有 GoatCounter 的公開 `/counter/<path>.json` 與 `TOTAL.json`，不把 API token 放進前端；路徑保留 GitHub Pages base、使用相同站台的 canonical 並去除 query／hash 與結尾斜線。
- 啟用方式：在 `src/data/integrations.ts` 填入真實 `analytics.code`、設定 `enabled: true`，並於 GoatCounter Settings 開啟 **Allow adding visitor counts on your website**。`showCounts` 可單獨隱藏公開數字而保留原統計。尚未設定時不渲染計數介面；本機預覽不讀取正式站計數。
- 依 GoatCounter 預設 session 規則，同一訪客重整不一定重複計數；公開數字會快取，最久可能延遲四小時。若尚無紀錄、網路失敗或回傳不合法，隱藏該項數字，不以假 0 或本機 localStorage 代替。每次載入各取一次，沒有持續輪詢。
- 參考：[GoatCounter visitor counter](https://www.goatcounter.com/help/visitor-counter)、[sessions](https://www.goatcounter.com/help/sessions)。`node --test scripts/visitor-counts.test.ts` 驗證路徑、全站端點、真實 0、格式化大數與各種失敗回應。
