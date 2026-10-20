# U4 教學改寫（2026-10-19）

作者已同意將主線由「先 discrete diffusion，最後推廣 Flow Matching」改為「先 PMF path，再找離散 velocity、建立訓練和抽樣」。沿用 `intuition-first-academic-teaching` 與 `concept-ordered-math-writing`。保留作者逐句確認的離散定義、token 範例、joint PMF 動機、MASK／uniform 生活直覺與單行 PMF 公式。

| 新編號 | 穩定 label | 已知 → 缺口 → 本篇推進 | 接到下一篇的問題 |
| --- | --- | --- | --- |
| U4.0 | dma-discrete-data | token／PMF／joint → 選 MASK 或 uniform noise → 條件 PMF interpolation 與 reference snapshots | 已有 interpolation，為什麼不能直接像 U2 一樣學 velocity？ |
| U4.1 | dma-ctmc | PMF 導數不等於樣本的移動規則 → 房間與相反 flows → rate、短時間 transition 與離散 continuity equation | 知道原文時，怎麼設計生成方向的 rate？ |
| U4.2 | dma-discrete-flow-matching | 已知原文的 MASK rate → 未知原文 → posterior averaging 與 flow identity → CE 學原字 posterior | 模型給了 rate，怎麼真的抽下一個 state？ |
| U4.3 | dma-d3pm | learned rate → 小步 transition → 精確 MASK reveal probability → 完整 sampler 與重複生成的 empirical PMF | 是否翻開的機率精確，是否就保證新字 joint 精確？ |
| U4.4 | dma-factorization-error | 正確 conditional marginals → parity 反例 → 因子化誤差與重新計算 context | 前面填錯的字，後面能不能再修改？ |
| U4.5 | dma-remasking | absorbing 不能改字 → 保留 training path、增加修改 → 配平 flow 與完整 joint 的 detailed balance | 如何分開驗證理論保留與有限步品質？ |
| U4.6 | dma-lab-discrete-time | 用 oracle 拿掉模型誤差 → 比較 joint／factorized reverse | rate 的時間近似又造成多少偏差？ |
| U4.7 | dma-lab-ctmc | 比較 frozen rate／closed form → 有限步 remasking → 控制 prediction error；ratio 為選讀 | 生成仍需反覆預測，能否學整段 map？ |

## 符號與必須分清的層次

- 全單元使用 $t\in[0,1]$，$t=0$ data、$t=1$ noise，生成倒著走；保留係數統一為 $\alpha_t$，與 U1 的 Gaussian amplitude 不混用。
- $X_0$ 是 training data 隨機變數，$I_t$ 是由已知 conditional PMF 抽出的 reference noisy state；$Y_t$ 是依 rates 實際跳動的過程，$x_t$ 是具體序列。
- $q_t(\cdot\mid x_0)$ 是 conditional PMF，$p_t$ 是混合原文後的 joint PMF；各格的 output 是給定整句 context 的 posterior，並非宣稱整句獨立。
- $\partial_t p_t$ 是分布淨變化；$R_t$ 是向較大 $t$ 走的跳躍 rate。$\bar R_t$ 以正時間長度 $h$ 向 $t-h$ 走，所以 $-\dot p_t=p_t\bar R_t$。
- conditional rate、posterior-average ideal rate、模型近似 $\bar R_{\theta,t}$ 與 finite-step sampler 分開。Rate 乘來源機率才是 flow；rate 乘小步長才近似轉移機率。
- MASK 與 uniform 可以由同一個 conditional reset-rate 建構實現指定 path；uniform D3PM 的反向 chain 未必是這條 dynamics。相同 snapshots 不表示相同 trajectory law。

## 主線與補充的取捨

- 原 U4.7 的 interpolation 開場不再重講；核心 conditional rate、posterior average 與模型訓練提前到新 U4.2。
- 原 U4.3 的修改需求合入 remasking，提出問題後就算補償 flow，不再隔數篇才回答。
- D3PM matrices、Bayes reverse posterior、ELBO／weighted CE、concrete score／SEDD 集中到新 U4.3 的折疊補充；主線不要求先讀 score。
- 一般 source–target coupling 與應用導讀在新 U4.2 補充；沿用 $\alpha_t$，不另引入互補的 $\kappa_t$。
- U4.5 對完整 joint 的 flow 配平，直接從 conditional PMF 逐項推得，不要求先讀 SEDD 補充。
- 訓練、MASK sampling、finite-step remasking 各有獨立的數學 pipeline／pseudocode 切換。新的 conditional average 與 CE loss 使用精簡 FormulaSteps。

## 舊連結與實作

八篇主文的 slug／label 不改，只調整 `noteSlugList`。新增 absorbing-vs-uniform → remasking、concrete-score → sampling 的直接轉向；原 why-continuous-time 也直接指向 remasking，避免 alias chain。既有 masked-diffusion、applications 轉向沿用。

實作 A 保留 oracle 與 parity 問題；實作 B 將 ratio／loss 換算標為選讀，主線先比較時間、因子化與模型誤差。本輪只同步 notebook B 的標題與選讀提示，沒有修改其抽樣程式。

## 本輪驗證

- 八篇主文均通過 MDX 編譯、KaTeX、FormulaSteps 公式解析與 notes 結構檢查。
- 本機完整 Astro build 通過；檢查八篇的 U4.0–U4.7 編號，以及五個舊網址轉向。
- 以相依的三格 bit joint 分布，對 MASK／uniform 與線性／非線性 schedules 驗證 posterior-average rate 滿足 $-\dot p_t=p_t\bar R_t$；另驗證 remasking 的逐邊 detailed balance、$p_tC_t=0$、有限步配平與 reveal survival identity。
- 八篇在 430px 手機版、亮暗主題展開補充後，均無 KaTeX error、展示公式溢出或頁面水平溢出；搬移圖片的相對路徑已校正。
- 新的 conditional-average 與 CE FormulaSteps 測過前後切換、回起點、一鍵到底及 Home／End；步驟切換不改變區塊高度。三個 AlgorithmView 測過數學／pseudocode 與鍵盤切換。
- 兩份 notebook 的 JSON 與 code-cell 語法檢查通過；本輪未修改抽樣 code，沒有重跑 notebook 實驗。

## 原始來源核對

- [MDLM](https://arxiv.org/abs/2406.07524)：copy 可見字、只對 MASK 計算的加權 cross-entropy。
- [SEDD](https://arxiv.org/abs/2310.16834)：ratio target 與 denoising score entropy；本篇保留 posterior-average 所需的 support 條件。
- [ReMDM](https://arxiv.org/abs/2503.00307)：可沿用預訓練 masked denoiser 的 remasking family；本單元用 rate 與有限步配平分別說明。
- [Discrete Flow Matching](https://arxiv.org/abs/2407.15595)：conditional probability paths 與 posterior-average rates；本單元沿用 data 在 $t=0$ 的方向，與論文時間方向對照。
