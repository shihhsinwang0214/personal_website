# 舊的「新人上手」草稿（已從網站移出）

這 8 篇是 2026-08 從 mentor guide 展開的第一版草稿，從未公開發布。

`getting-started` 區在 2026-08 改寫成「找到你的研究問題」——以六步驟
（Context → Understand → Analyze → Evaluate → Question → Next Step）為骨架，
來源是 Shih-Hsin 與學生第一週 meeting 之後整理的筆記。

這些舊稿保留在這裡是因為裡面有幾塊仍然有用、已經被新版吸收或值得之後再吸收：

- `phase-first-question.zh.md` — **實驗卡**的欄位清單，以及「如果解釋 A 與 B
  會看到同一件事，這個實驗不會告訴你任何東西」。已吸收進新版 Step 6。
- `phase-shared-language.zh.md` — 「做不到通常代表材料給太多，那是任務設計的
  問題，不是你的問題」。已吸收進新版的卡點段落。
- `onboarding-overview.zh.md` — 「這不是一條只能往前的流水線」，以及每階段
  給一個「大致做到什麼就可以往下走」的判準。兩者都是新版的骨幹。
- `onboarding-setup.zh.md` — 環境與 smoke test。**還沒有被吸收**，第一個月的
  環境設定仍然沒有對應頁面。
- `getting-help.zh.md` — 求助的門檻與對象。**還沒有被吸收。**
- `onboarding-templates.zh.md` — 問題地圖與實驗卡的完整模板。**還沒有被吸收。**
- `phase-reproduce.zh.md` / `phase-present-revise.zh.md` — 重現與報告修正，
  屬於「第一個月」那條軸，不屬於「找研究問題」這條。

要復活其中一篇：把檔案移回 `site/src/content/handbook/<section>/`，確認
frontmatter 的 `section` 與 `order` 沒有和現有頁面衝突，然後從
`draftHandbookSlugs` 移除它的 slug。
