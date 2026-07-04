# 網站全面審視與升級計畫（2026-07-02）

目標：達到 MIT / Stanford 課程水準的線上課程，以及「頂尖學者 × 知名 blogger」等級的個人網站（標竿：Lilian Weng、Karpathy、Andrew Ng，見 `WEBSITE_ROLE_MODELS.md`）。

---

## 一、現況評分（滿分 5）

| 面向 | 分數 | 摘要 |
|---|---|---|
| 版面設計 | 4.0 | 乾淨、有個性（等高線 hero、mono 標籤）、深淺色完整。小缺陷見下。 |
| 操作難易度 | 3.5 | 導覽、TOC、閱讀進度、上下篇、Pagefind 搜尋都有。語言切換只在筆記層，首頁無中文版。 |
| 筆記內容（中文） | 4.0 | 直覺先行、一篇一概念、測驗＋互動 demo，是全站最大資產。深度多為 B 級（直覺→橋接），未達課程級推導。 |
| 筆記內容（英文） | 1.0 | 44 篇 EN 中 43 篇是 "Content Coming Soon" stub。對國際讀者而言全站幾乎沒有內容。 |
| 清晰程度 | 4.0 | 敘事線清楚、系列有順序與 Start here。缺全站 notation 頁與課程地圖入口。 |
| 學者門面 | 2.5 | 出版列表完整，但無 Google Scholar / ORCID / arXiv 連結、無 BibTeX、無論文 project page。 |
| Blogger 基礎設施 | 2.5 | 有 RSS / sitemap，但無 hreflang、JSON-LD、per-page OG、留言、電子報、流量分析。 |

### 已經做對的事（保留）
- Astro + content collections + frontmatter 契約（AGENT / CONTENT_AGENT 分工）。
- 雙語路由、狀態標記（available / missing / draft）、legacy URL 轉址。
- 筆記閱讀體驗：TOC scroll-spy、閱讀時間、進度條、heading anchor、prev/next。
- 42 篇筆記含 Quiz、30+ 個自足式互動 demo（`public/notes/research_areas/`）。
- 課綱規劃文件已達標竿水準（`docs/syllabus-diffusion-flow-course.md`、`docs/syllabus-math-for-deep-learning-course.md`）。

### 主要缺口（依影響排序）
1. **英文內容缺席**：對標 Weng / Karpathy 的讀者群是英文世界；目前首頁每一列都寫 "Not in English yet"。這是單一最大差距。
2. **深度未達課程級**：n2d 系列 18 篇自評皆為 B 級；dfc 課程 14 講只完成 3 篇（Part I 部分）；無習題集、無程式作業、無 notebook。
3. **學者信號缺件**：無 Google Scholar / ORCID / arXiv 連結；出版頁無 BibTeX、無摘要、無論文縮圖或 project page；og:image 用滑雪照。
4. **SEO / 發現性**：43 個 stub 頁被建成可索引的 thin page（傷 SEO）；zh/en 對無 hreflang alternate；無 JSON-LD（Person / Article / Course）；筆記無 per-note OG 卡圖。
5. **技術債**：筆記內文硬編 `/personal_website/` 路徑（iframe、跨篇連結）；iframe 固定高度（手機體驗差、無 lazy loading）；CV 檔名含空格與撇號；15/44 篇中文筆記 `references: []`；根目錄 legacy `index.html`/`notes.*` 與 `output/playwright/`（60+ 張截圖）留在 repo。
6. **讀者迴路**：無留言（giscus）、無電子報、無隱私友善分析（Plausible/GoatCounter），無法累積受眾。

---

## 二、與兩個標竿的差距定義

**MIT / Stanford 課程水準**＝課綱＋講義（推導完整）＋習題集（理論＋實作）＋可跑的 notebook＋評量（quiz 已有）＋課程首頁（syllabus、prereq、schedule）。目前有：課綱文件、直覺層講義、quiz、demo。缺：推導層講義（M/S 級）、PS1–PS4、notebooks、課程 landing page。

**頂尖學者 × 知名 blogger**＝(a) 學術可查證性：Scholar/ORCID/BibTeX/專頁；(b) 英文長文旗艦：至少 2–3 篇 Weng 級 survey-style 文章；(c) 受眾基礎設施：RSS（有）＋newsletter＋留言＋分析＋分享卡。

---

## 三、分階段計畫

### Phase 0 — 快速修正（1–2 週，維護 agent 為主）
- [x] 加 Google Scholar 連結（hero、About、Person JSON-LD sameAs）。（2026-07-02）ORCID / arXiv 仍待作者提供 URL。
- [x] og:image / About / 品牌頭像改用正式照片（`images/personal_photo.jpeg`）；滑雪照保留為 `profile.photoCasual` 供 About 個人段落使用。（2026-07-02）
- [x] CV 複製為 `assets/shih-hsin-wang-cv.pdf` 並改連結；舊檔保留以免斷連。（2026-07-02）
- [x] EN stub 頁不再產生獨立 thin page（`status: missing` 從 getStaticPaths、search-index、語言切換鈕全部排除；頁數 97→54）。列表照舊顯示「read in 中文」直連 zh。（2026-07-02）
- [x] zh/en 皆存在的筆記加 `hreflang` alternate；JSON-LD：Person（首頁）、Article（筆記頁）。（2026-07-02）ScholarlyArticle（出版頁）與 Course 留待 Phase 2/3。
- [x] 導覽命名統一為「Notes」（nav 與首頁區塊）。（2026-07-02）
- [x] 新增根目錄 `.gitignore`（output/、site/dist、node_modules、caches、logs）。（2026-07-02）※`output/` 與根目錄 legacy 檔仍在 git 歷史中，建議另行 `git rm -r --cached output` 並確認後移除根目錄死碼（`index.html`、`notes.*` — 部署已走 `site/dist`）。
- [ ] 筆記內文的 `/personal_website/` 硬編路徑改為 build-time base 處理（remark plugin 或 `<Demo>` component）。※影響 40+ 內容檔，延後與 Phase 4 demo 元件化一起做。
- [x] 全部 32 檔筆記的 demo iframe 加 `loading="lazy"`。（2026-07-02）固定高度改 aspect-ratio / postMessage 自動高度：延後至 Phase 4。
- [ ] 補齊 15 篇 `references: []` 的中文筆記引用（content agent 任務）。
- [x] EN legacy 轉址（flow-matching-*）改指向仍存在的 zh 筆記頁，避免 404。（2026-07-02）

### Phase 1 — 英文平權（4–8 週，最高槓桿）
- [ ] 優先順序：`from-noise-to-data` 18 篇 → `invariance-and-equivariance` 7 篇 → `math-intuitions` → `dfc-`。
- [ ] 依 CONTENT_AGENT.md：翻譯為「等深不逐字」，範例可在地化；作者逐篇審後才改 `status: available`。
- [ ] 新筆記改為 EN 先行或 zh/en 同步出，避免缺口再擴大。
- [ ] 完成一系列即發佈一篇「系列總覽」英文長文（Weng 式 survey），作為對外旗艦與分享入口。
- 完成定義：首頁不再出現 "Not in English yet"；EN 版 Pagefind 索引數 ≈ zh。

### Phase 2 — 課程升級到 MIT/Stanford 級（一學期節奏）
依 `docs/syllabus-diffusion-flow-course.md` 執行，缺的是「做出來」不是「再規劃」：
- [ ] 課程 landing page（`/courses/diffusion-flow`）：課綱、14 講進度表、prereq 對應 `math-` 筆記、學習成果、更新日誌。
- [ ] 每講 = 3–5 篇短筆記：在既有 B 級直覺層上，加「深一層」推導盒（ELBO→DDPM loss、Anderson 反向 SDE、CFM 定理、PF-ODE、Girsanov/KL vs W₂）。
- [ ] PS1–PS4 習題集：推導題＋2D toy 實作（Colab notebook，repo 連結）；解答另放或延後公開。
- [ ] Notebook 骨架：DDPM / CFM / DDIM+2nd-order solver / CFG sweep，各對應一講。
- [ ] 全站 notation 頁（syllabus §3 已寫好，搬上站）＋每講首篇列 prereq 連結。
- [ ] 「All the Math You Need for Deep Learning」課程比照辦理（`docs/syllabus-math-for-deep-learning-course.md`，10 講；math-intuitions 12 篇已是素材）。
- 完成定義：一位有基礎的學生可只靠網站完成一講：讀講義→做 quiz→跑 notebook→做習題。

### Phase 3 — 學者 × Blogger 門面（與 Phase 1–2 並行）
- [x] 出版頁：12 篇全加 BibTeX（複製鈕）；加 ScholarlyArticle JSON-LD、Google Scholar 連結、equal-contribution 說明。（2026-07-03）摘要摺疊、亮點縮圖待後續。
- [ ] 2–3 篇代表作建 project page（David Bau 式：論文＋圖＋code＋demo 連結）。
- [x] 留言：giscus 元件已建，掛在每篇筆記末（`src/components/Comments.astro`）。（2026-07-03）**待作者啟用**：repo 開 Discussions → 裝 giscus app → giscus.app 取得 repoId/categoryId → 填入 `src/data/integrations.ts` 並設 `comments.enabled: true`。
- [x] 分析：GoatCounter 已接（`src/layouts/Base.astro`，含 view-transition 計數）。（2026-07-03）**待作者啟用**：goatcounter.com 註冊 code → 填入 `integrations.ts` 並設 `analytics.enabled: true`。
- [x] 電子報：依決定「先不做」，RSS 已可訂閱。（2026-07-03）
- [x] 網域：依決定維持 github.io，不改 base path。（2026-07-03）
- [ ] per-note OG 卡圖（satori/resvg build-time 生成：標題＋系列名）。※需新增 build 相依套件，另開一次 pass。

**Phase 3 個資更新**（2026-07-03）：加入「2026 年 8 月起任台大資工系助理教授」— 更新 subtitle、About、News、Person JSON-LD（affiliation 改 NTU）；聯絡 email 暫改 shixinwang0214@gmail.com；首頁 hero eyebrow 改為 NTU 職稱；About 加 AICoRE 合聘與台大數學系學歷；首頁 News 移到最上面。

**筆記顯示開關（hide / release）**（2026-07-03）：在 `site/src/lib/notes.ts` 加了單一設定點——`hiddenGroups`（研究領域 group 名稱）與 `hiddenCourseKeys`（課程 key）。加一行即隱藏整個章節（從所有列表、首頁、搜尋、RSS 移除，且該筆記頁不建置、URL 直接 404）；刪一行即上架。目前隱藏：`Diffusion & Flow Models`（group）與 `math-for-dl`（All the Math You Need 課程）。首頁研究方向的介紹改為固定英文（中英頁一致）。

**識別層微調**（2026-07-03）：職稱去掉「Incoming／準」（日期已標明）；AICoRE 中文正名為「人工智慧頂尖研究中心」；首頁簡介（hero lead）與 About 末段中英文改寫為新版；`--font-mono`／`--font-main` 加共用 CJK fallback（PingFang TC → Microsoft JhengHei → Noto Sans CJK TC），讓 mono 標籤（研究領域、更新於等）的中文字與內文一致，不再掉到難看的等寬 CJK 字體。

**雙語識別層**（2026-07-03）：新增中文版首頁（/zh）與 About（/zh/about）。做法是把首頁、About 抽成共用元件 `HomeView.astro` / `AboutView.astro`（吃 `lang` 參數），英文頁與中文頁共用同一份版型，內容從 `content.ts` 的雙語欄位（`heroContent`、`aboutHtmlZh`、`subtitleZh`、`philosophy.*Zh`、`research.descZh`、`news.htmlZh`、`uiText`）取。導覽列與 header 品牌改為語言感知（首頁/筆記/關於在 zh 走中文路由；著作/經歷/CV 維持英文，屬設計決定）。header 加語言切換鈕（中文↔EN），home/about/雙語筆記都有 hreflang alternate。**維持英文**：Publications、Experience、CV、BibTeX（領域慣例）。

### Phase 4 — Distill 級互動與長期
- [x] demo iframe 全數 `loading="lazy"`（Phase 0 完成）。
- [ ] demo 由 iframe 升級為 inline 元件（保留舊 URL）；統一視覺 token；行動裝置可操作。※需逐一改 30+ 個 `public/notes/.../*.html`，建議獨立一次 pass。
- [ ] iframe 固定高度改 postMessage 自動高度。※同上，需改所有 demo HTML 送 height 訊息。
- [ ] 課程頁加「我的路徑」進度記憶（localStorage，quiz 完成度）。
- [ ] 每學期一篇英文旗艦 survey；News 持續維護（RSS 已就緒）。

> Phase 4 剩餘項各自需要「改動全部 30+ demo 檔」或「新增 build 相依」，屬較大的獨立工程，建議單獨排一次 pass 再做，避免與內容工作互相干擾。

---

## 四、風險與原則
- 一切內容遵守 Ground Truth Policy：Scholar/ORCID 等連結、論文 URL 需作者提供或可驗證，勿生成。
- 翻譯不可未審即發佈（CONTENT_AGENT.md 禁止事項）。
- 舊 URL（`notes.html?cat=...`、demo 直連）持續保留轉址。
- 順序建議：Phase 0 與 Phase 1 先行；Phase 2 是拉開差距的主體；Phase 3 小工快做可穿插。
