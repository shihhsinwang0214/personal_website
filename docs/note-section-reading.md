# U4 的短段閱讀（2026-11-11）

作者確認將 `experiments/u2-rhythm-20261106` 的閱讀方式直接套用現有 U4 notes。這次修改 U4.0–U4.7 八篇中文筆記，不另建第二份內容，不改既有 slug、label、篇名或舊錨點；U2 試讀與其他單元不變。

## 教學順序

每段先遇到一個具體問題，做出一個動作，得到足以接到下一段的答案。沿用已確認的句子、直覺與數學推導；新標題出現在概念轉折，不按固定字數切段。不把短段理解成摘要、逐句點擊或一屏必須塞完。

| 篇章 | 問題的推進 |
| --- | --- |
| U4.0 | 一句話怎麼失去資訊 → 克漏字與全 MASK → PMF 與抽 token → uniform 也能抽回原字 → 同一條 interpolation → 逐格加噪與 joint 的差別 |
| U4.1 | 已有 reference state，局部規則是什麼 → 已知原句的兩個非零分量 → 要填回多少質量 → 除以來源比例得到翻開機率 → 時間差商與 rate → 逐格更新整句 → 流入流出與守恆 |
| U4.2 | 生成時少了原句 → 單格動作寫成整句轉換 → 真 posterior 平均 conditional rates → flow 保證 → 原字 label 與 CE → 模型 rates |
| U4.3 | 全 MASK 出發 → 理想 rate 與模型近似 → 連續時間過程 → 小步轉移 → 精確 reveal probability 的保證範圍 → 單格 kernel 與整句 kernel → 更新 context → 多次生成看分布 |
| U4.4 | 兩格都猜對為什麼還組錯 → 先看新 context 再填的差別 → FE 比較兩張搭配表 → 步數與分組的差別 → 實際抽樣 |
| U4.5 | 已填字不能改 → 沿用 training path → 遮回 flow 與補償 reveal → 逐邊配平保住 joint → 理想保證與有限模型 → 有限步 kernel → 修改實驗 |
| U4.6 | 排除模型誤差 → 完整列舉 oracle → joint／同批獨立／逐格重算 → 改 MASK 數量 → 分開記錄誤差 |
| U4.7 | 排除 off-support 的 oracle 問題 → 比較 reveal 時間近似 → 有限步 remasking 配平 → 拿掉原文後的生成 → 人為預測偏差 → 三張表各自回答的問題 |

U4.1 保留作者確認的單行 column-vector 等式、100 份樣本中由 50 份 MASK 填回 10 份的說明、導數定義，以及沿 U4.0 加噪方向反過來走的 `t → t-h`。U4.2／U4.3 保留 conditioning on clean、理想／模型／有限步、token／整句的符號區分。

U4.6、U4.7 新增頁內可編輯 Python，原完整 notebooks 繼續提供。兩份程式均使用明確標示的 oracle；U4.7 的 prediction error 是人為 surrogate，不是假稱訓練出的網路。程式輸出只作有限樣本觀察。

## 閱讀介面

- Frontmatter `readingMode: "sections"` 選擇啟用 `NoteSectionReader.astro`；只有上述八篇啟用。
- 預設全文閱讀，可切換逐段；偏好可在啟用的筆記間沿用。控制列隨正文固定，底部提供上一段、下一段與進度。
- 使用既有的頂層 `h2` 分段；參考文獻留在回顧末段。補充與問答不額外拆成段落。新段落沿用原 heading ID，舊 alias 跟隨相應的新段。
- 伺服器始終輸出完整內容。JavaScript 只移動既有 DOM，不重新建立圖、公式、textarea 或 Python worker；切換模式不清除編輯或執行結果。
- 目錄、直接 hash、舊錨點、瀏覽器返回及既有 `?resume=1` 續讀會揭露對應段落；補充中的直接連結也會展開其 ancestors。
- 公式保留原 `FormulaSteps` 固定排版、當步上色與前後切換，在 reader 內沿用 U2 試讀的 compact 字級與上下留白。長公式優先依語意換行，U4.1 作者指定的單行向量不拆開。
- Objectives 可 opt-in 為折疊格；其他筆記原有形式不變。沒有 JavaScript 仍能閱讀全文，列印包含全部段落與補充，列印後還原補充的開合選擇。

## 驗證

需實際檢查八篇的全文／逐段、目錄與舊錨點、返回導覽、公式固定位置、編輯與執行結果保留、頁內程式預設／改參數／還原，以及 390px 完整公式與展開補充。保留原網址、篇名、所有原有逐步公式與舊 alias 的程式檢查，同時執行 MDX／KaTeX、內容檢查與 Astro build。

目前內容檢查的既有 50 個 warnings（翻譯、舊連結等）不屬於本次改動；不以它們代替本次 U4 的驗收。

本次驗收：八篇共 78 段（U4.1 正文重寫後為 9 段，含回顧），八份頁內 Python 均實際執行、改過參數並還原；U4.1 揭露前後的符號位移與區塊高度變化均為零。390px 完整公式與展開補充無橫向溢出；直接舊錨點、目錄揭露隱藏段落、瀏覽器返回、由首頁續讀原段落均確認。MDX／KaTeX、八篇結構與 306 頁 Astro build 通過；深淺主題及桌面／手機畫面另以實際截圖檢視。

## U4.1：從分段進一步改寫正文（2026-11-11）

作者試讀後指出：原改動仍主要是在分段，需要像 U2 demo 一樣重新寫出問題、直覺與推導之間的連接。本輪只重寫 U4.1，其他篇內容維持上一輪。

- 開場先拿一份真的克漏字問下一步怎麼填，再以 U2 的 velocity 提出局部規則的需求，不先堆完整符號介紹。
- 用老師分批公布答案引出「已可見字保留，MASK 隨機翻開」的選擇；不宣稱 PMF 唯一決定轉換。
- 100 份樣本的圖直接對照 50 份 MASK 中平均翻開 10 份，分清新增質量 0.1 與條件翻開機率 0.2。圖明示平均比例與一次隨機結果的差別。
- 翻開機率 → 縮短時間得到 rate → 來源比例乘 rate 檢查 PMF → 同一規則放回整句 → 實際抽樣，沿一條問題鏈前進。
- 原來的 PMF／categorical 抽樣回顧、矩陣完整記帳與整句 generator 留在補充；正文的守恆公式直接從來源比例與 rate 建立。刪除與 sequence 圖重複的五列轉移表。
- 對角 rate 的 quiz 改為流入流出與總機率守恆，確保不讀選讀補充也能回答正文提問。
- 保留所有舊 heading ID 的 aliases、四個逐步公式 ID、單行 column vector、導數定義與時間方向。已知原句的條件與單格／整句記號仍與 U4.2 一致。

沒有只按篇幅刪去推導。正文先讓讀者想到需要計算什麼，補充再保留完整的另一種記帳方式；總字數不作為閱讀速度的保證。

作者接著要求把 continuity equation 的目標放回正文：先寫出 `-q̇ = rᵀq`（保留完整單格與 clean conditioning 記號），再介紹本例的 rate matrix、負的對角元素與轉置，最後逐步算右邊並核對左邊。這部分是理解流入流出所需，不能只留在補充；補充改為 rate matrix 到短時間 transition matrix 的連結，避免重複同一段證明。

05/09 再依作者指正改為「由定義推出守恆式」：本例已先用指定 PMF 算出翻開機率，再取極限定義 rate，所以 master equation 是已建立 reference 轉換的結果。正文從有限時間 PMF 更新開始，除以步長、使用 rate 極限，再將同一股流入流出寫成矩陣；移除「希望滿足、再檢查是否相同」的敘事，舊標題保留為錨點。


## U4.1 的整句延伸與 U4.2–U4.5 正文改寫（2026-11-11）

作者要求延續 U4.1 新版問題、直覺、推導的節奏，這次替換的是正文，不只是重切段落。沿用 `intuition-first-academic-teaching` 與 `concept-ordered-math-writing`，保留篇名、slug、label、核心公式 ID、舊標題錨點、可編輯 Python 與既有深入推導。

- U4.1 的 06/09 先把同一原句的第三、第五格遮住，列出四種下一步及其機率，再把單格 categorical update 組回整句。由一格事件為 O(h)、兩格事件為 O(h²) 說明整句 generator 的基本跳躍；不再突然把 token 改稱巨大 joint state。整句 rate 的記號先在具體兩格動作出場，再於補充寫一般式與 master equation。
- Sequence 圖改成四種完整結果；reference Python 新增固定兩個 MASK context 的重複抽樣，再分開檢查 reference snapshots 的 PMF。固定 context 的 transition 與整群 snapshot law 不混用。
- U4.2 先把原句拿走，讓 70/30 的資料比例導出 posterior 與 1.4/0.6 的 rates；後面才正式取 conditional-rate average。從 flow identity 承接已建立的守恆，再由可製造的原字 labels 推出 CE；新增二類 CE 的直接算例。刪去開頭重複介紹整句符號與提前比較 regression 的旁支。
- U4.3 從同一格的三種下一步機率開始，將 rate、整段 reveal 與預測 PMF 接成實際動作。小步 rate 定義、CTMC 記號及 clock 積分收進補充；正文保留原理想／模型率、有限步帽號、完整 sampler、empirical PMF 及實驗。明講 w(t,s) 與 U4.1 w(t,h) 的參數對照。
- U4.4 只增加一個新難度：兩個未知字需要搭配。先算同批抽樣與新 context 的差別，主提問改為「已知原句時可以獨立，現在為何不行」。Parity 比較集中在補充，不搶正文句子的主線；資料 PMF 統一寫 p₀，quiz 也改為正文已解釋的 context 更新。
- U4.5 回到給定原句的「想／MASK」與來源比例，推導新增兩股 flow 如何抵消，再混合原句、證明逐邊配平保住 joint。理想新增 generator C、理想修改後 rate 與模型 rate 分開；原位圖解改為與正文數字相同的原生圖，有限步與 CTMC 保證仍分開。

五篇的頁內 Python 都實際執行原始版本、改一個參數再執行，確認 frequency、CE、終點 MASK、joint 配對與新增淨 flow。五篇完整公式、展開補充與 390px 欄寬已檢查，無 KaTeX 錯誤或 display 橫向溢出；整站 local build 通過（318 頁）。


U4.2 的單格到整句銜接再改為具體對照：先列同一句話只填第三格前後的 x、y，再把兩種 conditional rate 寫成同一動作的等式，最後才介紹 x 的位置替換記號。明講 y 是候選下一個 state，原句仍為 x₀，避免把去向誤認成已知答案。


U4.2 的 rate 等號補上事件層級的理由：此例只剩第三格 MASK，其餘可見字不動，所以整句到指定 y 與第三格填成「想」是相同事件，短時間機率及 rate 因而相同。另分清單一跳躍與整句總流出 rate：多個 MASK 時，前者仍對應被改那格，後者才加總各格，避免把「只剩一格」誤寫成單格 rate 等式的一般必要條件。


U4.2 接著補上兩格 MASK 的有限時間推導：整句只填第三格的機率為 w(t,h)[1−w(t,h)]，除以 h 後分成 w/h 與 1−w 的極限，得到單格 rate。正文保留兩格完整 state 的對照、0.16/0.1 與 0.0196/0.01 的數值，以及兩格都翻開為二階事件的說明。新增逐步公式 `u4-two-mask-single-jump-rate`。依作者用詞修正，記號介紹直接說 x、y、x₀ 的角色，移除額外的正反對照。


U4.2 的 posterior-rate-to-flow 推導改為逐步展開：先把 conditional expectation 寫成 posterior 加權和，再乘來源機率、代入 Bayes、將固定來源機率乘進每項、最後約分。新增逐步公式 `u4-posterior-rate-to-flow`；後面的 master equation 也明列混合 PMF 微分、代入 conditional 守恆、交換有限求和，再使用剛才的 flow identity，避免從一句「流入流出加總」直接跳到矩陣式。


依作者要求，U4.2 的 flow 推導將同一個乘積收回一行，保留不同等號之間的逐步分行。平均 rate、代入與約分、conditional master equation 的乘積皆同步整理；窄螢幕沿用公式區的橫向捲動。
