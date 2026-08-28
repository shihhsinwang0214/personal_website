# Lab pages — RPG rule system

設計規則，給之後維護 lab 區的人（含 agent）。範圍只在 `/handbook/*`，
個人網站其他頁面（首頁、Notes、Publications、About）維持原本的學術風格。

## 第一原則

**每個遊戲元素都必須對應研究室裡真實存在的東西。** 沒有對應物的裝飾一律不做。

這條規則的用途是踩煞車。「加個經驗值條」聽起來好玩，但研究室沒有經驗值這個東西，
做了就會變成假的——而假的東西會讓整套系統失去說服力，也會讓學生覺得被當成小孩。

推論：

- 不做等級、能力值、排行榜。任何需要「替學生打分數」的機制一律不做。
- 不做進度條顯示個人完成度。手冊的節點計數是**內容的長度**，不是誰的成績。
- 遊戲語彙只用在 lab 區。Publications 與 Experience 是審查委員會讀的頁面，維持原樣。

## 核心譬喻

做研究 = 一場**長期經營型 RPG**：沒有終局大魔王，每個週期都在把一個複雜問題拆成
可以打得贏的小戰鬥，並且把打過的經驗留給下一個人。

研究室 = **遠征隊 Expedition**。不是「隊伍 Party」——party 是隨時可以拆的臨時組合，
expedition 是一群人為了同一個目標，長時間走進沒有人畫過的地形，然後帶東西回來。
這正好是研究室在做的事，也是為什麼進度以年計、為什麼要留 failure log 給下一批人。

PI = **遠征隊隊長 Expedition Leader**。隊長的工作是選路線、判斷什麼時候該撤、
確保每個人帶得動自己的包——不是走在前面表演。

戰鬥系統就是既有的研究循環：直覺 → toy example → 證據 → 修正。這不是新發明的，
是 `research-principles` 與 `daily-practice` 已經寫的東西。

用詞：全站中文一律用**研究室**，不用實驗室。

## 名詞對照

節區的標籤寫在 `handbookSections[].tag`（`src/lib/handbook.ts`），側欄、技能樹、
文章頁首會自動顯示。改一個地方就三處同步。

| 遊戲 | 研究室 | 位置 | 標籤 |
|---|---|---|---|
| 遠征攻略 Strategy Guide | 手冊本身。側欄顯示「遠征攻略」，下方小字與 `<title>`／JSON-LD 用「研究室手冊」（`handbookTitle` vs `handbookTitleFormal`）。en 兩者都是 Lab Handbook。 | `/handbook` | — |
| How We Level Up | 我們怎麼做研究 | `practice` 區 | `HOW WE LEVEL UP` |
| 新手教學 Tutorial | 新人上手（第一個月） | `getting-started` 區 | `TUTORIAL` |
| 技能書 Skill Manual | 研究技藝 | `craft` 區 | `SKILL MANUAL` |
| 入團任務 Recruitment Quest | 加入研究室——加入這場長期經營 RPG | `joining` 區 | `RECRUITMENT QUEST` |
| 遠征隊 Expedition | 研究室本身 | 全站 | `EXPEDITION` |
| 遠征隊成員 | 研究室成員（zh 分頁名） | `/handbook/people` | — |
| 遠征隊隊伍 Expedition Party | 成員名冊區塊標題 | People 頁 | — |
| 遠征隊隊長 Expedition Leader | PI（中文頁面標題也用這個詞） | People 頁 | 燙金卡框（`Person.foil`），不再另外掛標籤 |
| 角色 ROLE | 專題生／碩士生／博士生 | 成員卡片（**不是** CLASS，中文會讀成階級） | `ROLE` |
| 任務 QUEST | 目前在解的題目 | 成員卡片 | `QUEST` |
| 節點 NODE | 手冊的一頁 | 每頁頁首 | `NODE n/m` |
| 路線 PATH | 手冊的一個區 | 研究室首頁技能樹 | — |
| 冒險日誌 Adventure Log | group meeting、一起參與與舉辦的活動 | 尚未成頁 | — |
| 道具 Items | 共用模板（問題地圖、實驗卡…） | `onboarding-templates` | — |
| 資源 MP | 運算預算 | 內容中提及 | — |
| 怪物 Monster | 研究中會遇到的困難 | `/handbook/bestiary` | `CODEX` |

## 怪物圖鑑（新增內容，這套系統的重點）

「預期會遇到的狀況」寫成怪物，是整套譬喻裡唯一真正**增加資訊**的部分：
新人最需要知道的就是「你會遇到什麼、那不是你的問題、這裡有解法」。

每一條目固定四欄，缺一不可：

```
名稱     — 帶點幽默，但描述要準確
症狀     — 你會怎麼發現牠出現了（具體、可辨認）
為什麼   — 牠為什麼會出現（拿掉自責）
打法     — 連到手冊裡真正的解法頁面
```

**沒有打法連結的條目不要寫。** 圖鑑的價值在於它是一份索引，不是吐苦水清單。

### 小怪 Common

| 怪物 | 症狀 | 打法 |
|---|---|---|
| 環境地獄 Env Hell | CUDA 版本、套件、權限，一整天沒寫到半行研究程式 | smoke test；卡半天就找技術支援 → `onboarding-setup` |
| 重現不能 The Unreproducible | 數字就是對不上，作者也沒回信 | 差異表；環境／理論／評估分開診斷 → `phase-reproduce` |
| 調參泥沼 Hyperparameter Swamp | 已經調兩天，得到一個不知道為什麼會動的設定 | 先列可能原因，再設計最低成本的區分實驗 → `daily-practice` |
| 論文迷宮 Paper Maze | 讀了三十篇，講不出任何一篇在做什麼 | 分層讀；多數論文停在第一層 → `reading-papers` |
| 空白頁 The Blank Page | 開著編輯器兩小時，一個字都沒有 | 圖表先於文字；四段骨架 → `writing-papers` |

### 精英 Elite

| 怪物 | 症狀 | 打法 |
|---|---|---|
| 沉默 The Silence | 卡住兩天沒講，兩週後變成沒人救得了 | 週會就是為牠存在的；卡兩天就講 → `getting-help` |
| 冒牌者 The Impostor | 覺得只有自己不懂，不敢問「基本」問題 | 幾乎每個做研究的人都遇過；把困難具體化再提出 → `how-we-discuss` |
| 完美主義 The Perfectionist | 東西永遠「還沒準備好給人看」 | 先自己當一次 reviewer，然後就送出 → `promises-and-expectations` |
| 範圍蔓延 Scope Creep | 題目越滾越大，永遠差一個實驗 | 設止損點；縮回 toy example → `research-principles` |

### 王 Boss

| 怪物 | 症狀 | 打法 |
|---|---|---|
| Reviewer 2 | 明顯沒讀懂，但意見會影響結果 | 排序：影響力 × 可完成規模；對的承認、錯的給證據 → `rebuttals` |
| 死線 The Deadline | 時間不夠，什麼都想做 | 三分之一排序、三分之一跑、三分之一寫 → `rebuttals` |
| 空結果 The Null Result | 三個月的方向被自己證明是錯的 | 寫進 failure log；收掉不是失敗，是把時間還給更好的題目 → `research-principles` |
| 漫長平原 The Long Plateau | 好幾個月看不到進展，開始懷疑自己 | 這是研究的正常紋理，不是你的失敗 → `how-we-do-research` |

牠們共同的設計意圖：**把「這是我的問題」翻譯成「這是一隻大家都會遇到的怪」**。

## 任務系統

| 類型 | 對應 | 標記 |
|---|---|---|
| 主線 Main | 你的研究題目 | 成員卡片的 `QUEST` |
| 支線 Side | 開源工具、benchmark、幫別人 debug | 掛名頁有寫「論文之外的成果也算」 |
| 每日 Daily | 週會四問、實驗紀錄 | `daily-practice` |
| 教學 Tutorial | 第一個月四階段 | `getting-started` 標 `STAGE 1–4` |
| 入團 Recruitment | 申請流程兩步 | join 頁的 `01 / 02` |

## 成長：解鎖，不是升級

**不用等級，用「解鎖」。** 因為研究室真正在追蹤的是「你現在能獨立做到什麼」，
這對應 mentor guide 裡的五級鷹架（示範 → 部分接手 → 自選方法 → 只給邊界 → 新情境獨立）。

解鎖是**私下的對話**，不是公開的徽章。網站上不顯示任何個人進度。

## 視覺規則

沿用既有的字體與配色，只借用遊戲的**資訊結構**：

- mono 標籤（`ROLE` `QUEST` `NODE 3/8` `OPEN QUEST`）——英文，跟站上其他技術詞一致
- 角落括號 `.hud`、選單游標 `▸`、上下頁 `◀ ▶`
- accent 色只用在標籤與游標，不改內文顏色
- **不用像素字體**：Space Mono 沒有中文字符，CJK 會 fallback，像素風在中文一定會壞
- **不用掃描線、發光、音效**
- 燙金卡框（`--foil`）只給遠征隊隊長。它是**代替標籤**，不是額外裝飾——
  ROLE 那行已經寫了「遠征隊隊長」，再掛一個 `EXPEDITION LEADER` 徽章是重複。
  規則：同一件事只說一次，用文字或用處理擇一。

## 已建

1. **`/handbook/bestiary`** — 怪物圖鑑，資料在 `src/lib/bestiary.ts`，13 隻，四欄格式。
   打法連結只在對應手冊頁**已發布**時才會變成連結；還是草稿的顯示「尚未開放」。
   所以隨著頁面上線，圖鑑會自己一條一條亮起來，不會有 404。
2. **手冊區標籤** — 寫在 `handbookSections[].tag`，側欄、技能樹、文章頁首三處自動顯示。
3. **ENCOUNTER 區塊** — 手冊頁如果是某些怪的打法，頁尾自動列出牠們（`HandbookArticle.astro`
   用 `monsters.filter(m => m.link === slug)` 算出來，不需要在 md 裡手寫）。
4. **`HandbookSidebar.astro`** — 原本三個元件各有一份側欄，加圖鑑會變成第四份。抽成共用元件。

5. **互動層** — 圖鑑症狀分診、技能樹點亮讀過的節點、首頁路線選擇、名冊鍵盤與
   可分享連結、lab 版 404、join 頁自我檢查表。規劃與界線見
   `docs/lab-interaction-plan.md`。

## 待建清單

1. 四階段頁面加 `STAGE 1/4` 標記（等 `getting-started` 上線）
2. 冒險日誌：group meeting 與活動的頁面／相簿（目前只有名詞，沒有對應頁）

## 加一隻怪的做法

在 `src/lib/bestiary.ts` 的 `monsters` 陣列加一筆，四欄都要有，`link` 指向手冊既有的
slug。中英文同時寫。**沒有打法連結的不要加。**

## 發布一隻怪

`draftMonsterIds`（同樣在 `bestiary.ts`）是未校對清單，用法跟 `draftHandbookSlugs`
一樣：**在裡面的怪，整個站都看不到牠**——圖鑑頁沒有、手冊頁的 ENCOUNTER 區塊沒有、
研究室首頁的圖鑑卡也不會列進計數。刪掉 id 就發布。

程式一律用 `visibleMonsters()`，不要直接用 `monsters`。

全部都還沒發布時：側欄的 CODEX 分組與首頁圖鑑卡自動消失，圖鑑頁本身保留但只顯示
「圖鑑正在校對，還沒開放」。頁面留著是因為靜態站沒辦法有條件地不產生一個固定路由，
與其留一個空頁，不如讓它自己說明狀態。

## Register：按頁面深度，不按語言

中英文用**同一個 register**。理由：讀者不是照語言分的（台大學生讀得動英文，國際學生也會點中文頁），
兩邊語氣不一致會讓雙語讀者不知道哪一個是真的；而且 register 一旦分岔，
每頁都要做兩次獨立編輯判斷，永遠不能用 diff 同步。

真正的切法是**越外層越素、越深入越可以玩**——讀者走到深處是自己選的：

| 層 | 例子 | 分寸 |
|---|---|---|
| 站台導覽 | 頂部 nav「研究室 / Lab」 | 完全平實 |
| 區塊入口 | 側欄、技能樹、頁首標籤 | mono 標籤即可 |
| 內頁 | 手冊各頁、ENCOUNTER 區塊 | 可以有敘事 |
| 圖鑑 | `/handbook/bestiary` | 玩得最開 |

**導航標籤是最不該花俏的地方**，它要承擔認路與搜尋的功能。所以手冊標題拆成兩個常數：
畫面上是「遠征攻略」，但 `<title>`、JSON-LD 與側欄小字保留「研究室手冊」，
讓搜「研究室手冊」或 "lab handbook" 的人找得到。

外觀可以玩，**文字必須嚴肅**。這套系統成立的原因是內容本身沒有變輕——
怪物圖鑑寫的是「卡兩天就講」，不是笑話。反過來（嚴肅版面講空話）才是真的失敗。
