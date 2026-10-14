# 知識秘境(Beta) — 設計與寫作規則

2026-10-13 名稱確定：中文使用「知識秘境(Beta)」，英文使用「Knowledge Realms (Beta)」。原稱練功房；程式檔名、collection、網址與進度鍵沿用 `dojo`，既有閱讀位置可繼續使用。下文的歷史名稱與設計稿名稱保留原稱。

同一個問題，換讀者試著往下推，再一起對照理由。
這一頁是給之後維護練功房的人（含 agent）看的規則。目前已有 U7.0–U7.3 的連續練習；分工與圖片規格見 `docs/dojo-u7-sequence.md`。

## 2026-10-14：獨立學習與學習夥伴

使用者要求：不先看筆記，也能在知識秘境學到來源單元的知識。必要定義、數學角色、訓練前提、推導與限制須在秘境內說清楚。延伸內容可以放可展開的 `<Extra>`，但必須直接寫在頁內，不能只用來源連結代替；筆記仍是連續閱讀版。這個要求取代下文早期版本將完整 losses、Best-of-N 成功率或相關延伸全部移出秘境的決定。

先讓有名字的夥伴在具體情境裡提出做法，操作講清楚後才帶出方法名稱。讀完一組提案，進入選擇／分類／思考時收起原提案，讓讀者先回想；保留「再聽一次夥伴的提案」，允許重新對照，沒有懲罰、限次或分數。不要為了湊三位角色而發明第三種方法。

- Nori：戴 orca 帽的北極熊，是作者的 mini。
- Lumi：有翅膀的鹿；Mugi：有柴犬臉的柯基。兩個名字目前是暫名。
- 角色不固定代表某種方法，也沒有永遠正確的一位。角色提出的想法能保留合理動機，再由讀者檢查缺口。
- 角色定義在 `site/src/lib/dojoPartners.ts`。2026-10-14 使用者核准帶服裝與探索道具的 Q 版形象，並要求製作動作後加入秘境。三位各有 welcome／suggest／explain／question 四種去背姿勢，原始 PNG 保存在 `site/src/assets/dojo/partners/`，生成規格見 `docs/dojo-partner-assets.json`。Astro 產生適合顯示尺寸的 WebP 與 srcset，不以角色道具取代已核准教學圖或數學示意。

姿勢跟著當下的任務：提案用 suggest、提問用 question、推導與整理用 explain、首頁與情境入口用 welcome。`Say`／`Talk`／`Reveal` 可用 `partner`、`pose` 指定；`Choose`／`Judge`／`Think`／`Sort` 的提問角色在對照完成後換成 explain，逐列表格讀整理時也是 explain、進下一列換回 question。角色不因答錯變成責備或失望的表情，不加入分數或勝負效果。

圖片切換只重建該角色的裝飾性 img，不改題目狀態、焦點、閱讀步數或儲存資料。續讀用既有完成狀態還原姿勢；停用 JavaScript 仍能讀全部內容。正常對話顯示完整去背角色，分類標頭縮小；文字與公式保留原本寬度，手機版不讓角色浮在公式旁擠壓推導。插圖的淡入尊重 prefers-reduced-motion。

元件契約：`<Talk partner="nori" study="group">` 沿用 Say 主線；`Say` 也可帶 `study`。`Choose`、`Think`、`Sort` 的 `review="group"` 在顯示時收起同組已讀提案，建立不含節點 ID、按鈕或輸入欄的唯讀複本。重看不改進度；續讀也會重建回顧並收起原提案；無 JavaScript 時原文仍全部可讀。`Reveal partner` 可讓夥伴接著整理公式，`Sort columnPartners` 可用名字作分類標頭。`Extra` 是頁內的原生 details，不增加閱讀步數。

**定位（2026-10-13 確定）：練功房是第一次學這個單元的預設入口。** 筆記的內容在這裡一段段浮現，
在關鍵推理前，讀者先想、先選、先判斷；情境與必要解釋仍直接提供。技能書（筆記）是同一單元的連續閱讀版，給想一口氣讀完或回頭查的人。

## 2026-10-13 架構與內容決定

**主題。** 練功房的外觀是主題（theme），只改 CSS，節點契約不變。目前三種：
`board`（任務告示板，預設）、`plates`（道場掛牌）、`scroll`（秘笈卷軸）。腳本 frontmatter 用 `theme:` 指定，
省略即 `board`；之後不同課程可以用不同主題。tokens 在 `global.css` 的「dojo」區，主題規則在
`Dialogue.astro`／`DojoView.astro`／`DojoIndex.astro` 的 `[data-dojo-theme=…]` 之下。首頁固定用 `board`。

**選擇題（Choose）鼓勵看完所有選項。** 選對之後走得下去，但其他選項仍然可以點：
- `<Option why="…">`：一句話的解釋，點了就在選項下方展開（可收起）。**請替每個錯誤選項寫 `why`**，正確選項也可以寫。
- `<Option goto="d-x">`：解釋太長（含公式、圖、好幾段）時改用岔路 `<Say detour back="c1">`；從已答過的題目點進岔路，讀完會回到題目，原本的「繼續」還在。
- 選對時的回饋句後面會自動接「也可以展開其他選項，比較它們的理由。」（只在有其他可點的選項時）。
- `why` 與 `reply` 是純字串（不跑 KaTeX）；要數學就用 `goto`。
- 答錯但有 `why` 的選項：顯示 `why`，選項不鎖，讀者再選。答錯且有 `goto`：走岔路再回來。

**是非題（Judge）另一邊也能看。** 答對後，另一個按鈕仍可點，點了把它的 `replyYes`／`replyNo` 展開在下面；
回饋句後會接「另一個判斷的理由也可以展開比較。」。所以 `replyYes` 和 `replyNo` 兩個都要寫。選題不要一律以「一定／保證」製造錯誤敘述，要讓兩種判斷都有實際情境。

**自由探索（Explore）沒有正確選項。** 當幾條路都可行，先讓讀者自由選順序，讀完各條路，再提出這次的限制。每個 `<Option goto>` 連到 `<Say detour back="e1">`；回到原題才算看過，全部路徑都看過才出現繼續。必要概念可以放在這些必讀路徑，不能只放在答錯才會走的岔路。

**拖表（Sort）逐列停頓。** 有 `rows` 時一次只露一列；一列全部歸位後**不會自動跳下一列**，
用 `rowReplies` 提供每列整理後的概念回應，並出現「接著比較下一列」按鈕，按了才露出下一列。最後一列完成時用 `done` 收口，並提供「繼續」。卡片描述實際動作，不只考方法名稱。

**存檔格式。** `localStorage["slam:dojo:<slug>"] = {version, step, total}`；`total` 是主線節點數，
首頁用它判斷「讀過了」（step ≥ total）或「閱讀中」，只蓋章、不顯示 n/m、不計分。重排主線時遞增 `progressVersion`；續讀會重建已讀的比較表與探索入口，不還原文字或作答紀錄。

**章。** 題目節點處理完會帶 `data-stamp`（對照過了／比較過了／想過了／整理好了），進行中的題目帶 `data-stamp-live`（正在想）；
主題用 `::after` 畫成圖章（board：旋轉的邊框字；scroll：方印）。純 CSS，runner 不管外觀。

**首頁（DojoIndex）。** 以具體情境和「如果是你，會先怎麼做？」邀請閱讀，不把元件、JavaScript 或遊戲規則當入口說明。同一本技能書的筆記若還沒有腳本，會以「互動版準備中」的灰紙出現（最多 4 張），
資料直接從 notes collection 推，不用手填。

**已確認的互動（Playwright 走過）：** `why` 展開／收起；答前走岔路再回來可重選；答後走岔路回來「繼續」仍在；
正確選項有 `why` 時答後可展開；是非答錯→答對→點另一邊；拖表第一列歸位停頓→下一列→全部歸位；
走完首頁蓋「讀過了」、按鈕變「再想一次」；同版本的舊格式 `{version, step}` 存檔仍可讀。U7.0–U7.2 的本次驗收另記在 `docs/dojo-u7-sequence.md`。

**設計稿。** 三種主題與首頁的設計稿在 Claude 的 Design 畫布「練功房首頁五種方向」（01–10 首頁方向、第三排 U7.0 整頁三種風格）。


## 第一原則

沿用 `docs/lab-rpg-rules.md`：**不計分、不排名、不打等級**。練功房記錄的唯一東西是「這個瀏覽器走到第幾步」（`localStorage` 鍵 `slam:dojo:<slug>`），不記對錯、不上傳。答錯不是失敗，是走一條岔路；岔路的內容就是課堂上最常見的誤解，所以它本身是教材，不是懲罰。

JavaScript 關掉時所有節點直接顯示，整頁仍是一篇可讀的短文（和 `SelfCheck` 同一原則）。

## 一套腳本 = 一篇筆記的問題鏈

腳本**不是筆記的壓縮版**。它把問題鏈改成讀者可以參與的第一次閱讀：情境 → 先想一個做法 → 對照理由與需要的條件 → 參與關鍵推導 → 換個情境再試一次。理解下一步所需的符號、公式與推理必須在主線或必讀探索中出現；其餘來源延伸在頁內提供完整補充，技能書提供連續閱讀與查閱，結尾一定連回去。

每個錯誤選項都必須對應真實的誤解，並且寫成岔路（`<Say detour back="…">`）或可重看的理由（`why`）。`reply` 可補作答當下的回應，但不能單獨代替錯誤選項的教材；只有 `reply` 的錯誤選項會鎖住。沒有理由可寫的錯誤選項，通常代表這題不值得問。

## 檔案

```
site/src/content/dojo/<slug>.<lang>.mdx       腳本（collection `dojo`，schema 在 content.config.ts）
site/src/components/dojo/Dialogue.astro       runner + 全部樣式（is:global，限 .dojo 之下）
site/src/components/dojo/{Say,Explore,Choose,Option,Judge,Think,Reveal,Sort,Card}.astro
site/src/components/dojo/{Talk,Partner,Review,Extra}.astro
site/src/components/dojo/{DojoView,DojoIndex}.astro
site/src/lib/dojo.ts                          路由、列表、筆記對照
site/src/lib/dojoPartners.ts                  學習夥伴與未來 avatar
site/src/pages/{dojo,zh/dojo}/{index,[slug]}.astro
```

Frontmatter：`slug`、`lang`、`title`（用一句情境，不用筆記標題）、`note`（來源筆記的 `label`，索引頁用它分組到對應技能書，筆記頁也靠它顯示「這一篇有練功房版」橫幅）、`summary`、`updated`、`minutes`、`status`、`progressVersion`（預設 `1`；改動主線步驟時遞增，避免把舊位置套進新問題）。儲存內容只有版本與步驟，不記選項或對錯。

連續練習另填 `series` 與 `order`，索引依順序排列，結尾自動連到同系列、同語言的下一套。`note` 仍必須指向這一套真正的來源筆記；不要依 legacy filename 猜單元編號。

## 節點

| 元件 | 讀者做什麼 | 來源 |
|---|---|---|
| `<Say>` | 讀一段旁白，按繼續 | 筆記段落、`<Ask>` |
| `<Talk partner study>` | 聽具名夥伴提出做法，可在練習前收起同組提案 | 具體情境中的合理思路 |
| `<Extra label>` | 展開頁內的完整補充，不改閱讀步數 | 來源的延伸推導與方法前提 |
| `<Say detour back="c1">` | 檢查某條思路，讀完回到原題；答前答後皆可看 | 常見誤解或探索路徑 |
| `<Explore id><Option goto>` | 自由選順序，把所有可行做法讀過後再比較 | 方法選擇前的問題 |
| `<Choose id><Option goto／correct／why／reply>` | 選一個，再比較其他選項的理由 | `<QuizBlock>` |
| `<Judge answer={bool} replyYes replyNo>` | 是／非 | 新 |
| `<Think>` | 先寫幾句（不存），再看整理 | `<Question>` |
| `<Reveal>` | 作者的整理、公式、`<Ref>` | `<Answer>` |
| `<Sort columns rows rowReplies done><Card col row>` | 分類實際動作，逐列比較後對照作者整理 | 筆記裡的比較表 |
| `<Figure src alt>` | 先看情境，點圖可另開大圖 | 已驗收的教學圖 |

`Sort` 有 `rows` 時，一次只重組一列，完成後先閱讀該列回應，再按按鈕露出下一列，最後顯示完整表格。沒有 `rows` 時可把多張卡片放進同一分類。`Card` 的 `hint` 解釋錯放時漏看的條件；`context` 在無 JavaScript 時顯示所屬方法與比較項目。卡片與格子都支援 Enter／Space，Escape 取消選取；沒有 JavaScript 時所有卡片、`rowReplies` 與 `done` 仍可讀。

### 問題與圖的寫法

- 情境、轉場、題幹與回應都沿用作者一起推理的口吻。先描述眼前具體可能發生的事，例如帽子畫成藍色、柯基只站在雪地，再由這個缺口問「能不能在途中提醒？」；不要把情境縮成「品種、動作與背景可能往不同方向發展」這類抽象摘要。
- 新符號先有需要：讀者知道現在看得到什麼、想判斷或改動什麼，再引入記號。公式前交代為什麼要做這一步，公式後把結果讀回原來的情境；不只列方法名稱和結論。
- 錯誤回應帶讀者檢查漏掉的條件或操作，例如「只改 classifier 的參數，圖片有跟著變嗎？」；保留理由，不只用「再想一下」收尾。問題要推進推理，不為增加對話感而把每句宣告都改成反問。
- 三種做法若都能用，題幹先提出這次的限制，再問哪種符合，不能靠猜作者偏好作答。
- 不為了凸顯 steering，宣稱 conditional model 每換一句 prompt 都必須重訓；新組合和未學過的輸入類型要分開。
- 有 gradient 不等於更新參數。先指出想改的是圖片輸入還是模型參數，再寫微分的下標。
- 情境圖放在預測之前，不提前畫出解答。每個重要視覺對應用圖說補清楚，圖片提供詳細 alt；公式保留在可渲染的正文。
- 岔路回到原題時收起，可以重新選取同一岔路。錯誤回應解釋理由，不用紅色或搖晃作懲罰。

Runner 的契約（`data-node`／`data-detour`／`data-back`／`data-goto`／`data-next`）寫在 `Dialogue.astro` 頂端的註解。主線 = 文件順序中非 detour 的節點；detour 只能靠 `goto` 到達。

寫作注意：元件 **props 是純字串，不會跑 KaTeX**（`reply`、`rows`、`intro` 用 θ 這種 Unicode）；slot 內容走 MDX，可以用 `$…$` 與 `<Ref>`。

## 在沙盒裡建置

目前 Windows workspace 可用 `npm run check` 與 `npm run build:astro` 驗證。直接建置與 dev server 同時使用同一份 Astro 快取，可能造成 content collection 暫時為空或檔案 rename 衝突；預覽已開啟時，驗證 build 要另設 `cacheDir`、`outDir` 與 Vite cache，不更動來源筆記或路由驗證。舊 VM 的 `astro.config.homebuild.mjs` 保留作為環境參考，不把移走內容當作驗收流程。

## 之後

- U7.3 已接續 black-box reward、候選比例、途中重抽與 source 搜尋。U7.0 保留 Best-of-N 命中率直覺，U7.3 則檢查輸出分布與 target 的差別；下一套可從 U7.4 的量測與 observation reward 接續。需要排序推導時再加入 `<Order>` 節點。
- 若要和解鎖成就接起來：只在「走完一套」時記錄，不記答對率。
- 英文版：腳本檔名 `<slug>.en.mdx`，頁面與索引已經雙語。
