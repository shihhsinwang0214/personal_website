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
| 重點色 | `--accent` | `#2a4ea3`（藍） | `#d8a44a`（金） |
| 框線 | `--border` | `#e7e0d6` | `#2c2d31` |
| 燙金 | `--foil` | `#a8842c` | `#d8a44a` |

**深色主題的 accent 本來就是金色**，所以 HUD 感在深色下最強；淺色是藍色，
金色只留給 `--foil`。兩個主題都必須可用——不要為了 HUD 感砍掉淺色。

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
