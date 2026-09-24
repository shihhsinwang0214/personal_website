# DMA U1–U2 作業：三案實施規格

這份文件是教師與助教使用的實施稿。三案共用同一套 2D case generator、模型、評估、compute ledger 與交件格式；正式開課時選一案發給學生即可。學生版題面位於網站 `Diffusion Models and Their Applications` 課程的「作業 · Unit 1–2」群組。

## 共同時程

| 時間 | 學生要做的事 | 教學端要做的事 |
| --- | --- | --- |
| 第二週週末 | 收到完整題目、starter 與自己的 `case_id` | 公布題目、starter、病例參考值與 rubric |
| W4.5 lab 前 | 繳交 200–300 字押注單 | 鎖定版本，不接受覆寫；之後只能追加修正紀錄 |
| W4.5 lab | 跑通 baseline、確認 budget ledger 與評估 | 排除環境問題，不替學生選方法 |
| 第五週週四上課前 | 繳交 notebook、PDF export 與 U3 接口列 | 自動檢查輸出、分流口試 |
| 第五週課堂 | 兩分鐘圖表口試 | 教師與助教雙線，每人兩分鐘 |

## 共用硬限制

- 個人作業；`case_id = SHA256(student_id)`，不可交換 case。
- 主模型固定三層、寬 128 的 time-conditioned MLP；batch size 256。
- A、B 案最多 6,000 optimizer steps；C 案最多 3,000 steps。
- 主實驗只能宣稱一個 primary intervention；其他設定必須與 baseline 相同。
- training-length sweep 使用同一次訓練的 checkpoints，不可為每個長度重訓。
- limitation micro-toy 固定 width 32、最多 1,000 steps。
- 不得使用 distillation、consistency、reflow、通用 OT solver、learned teacher、高階 solver、額外資料、擴大網路或超出題目規定的 NFE。
- 所有正式數字固定使用 starter 的 training seed、evaluation seed 與 2,048 個 evaluation samples。自由探索可以換 seed，但不得以自由探索數字取代正式表格。

## 個人化病例

Starter 將學生分配到六種基礎幾何，再由 hash 決定旋轉、鏡射、尺度、mode 權重與局部噪聲：

1. 不平衡四 Gaussian；
2. 雙月；
3. 有缺口的環；
4. pinwheel；
5. 交叉的 anisotropic Gaussian；
6. 雙螺旋。

病例生成器必須能無限抽 training samples；評估使用獨立 seed 的 held-out samples。正式發布前，以實際 roster 產生全部 case，剔除 real-vs-real reference 或 baseline 落在校準範圍外的個案。

## 評估

令兩組獨立真資料為 $A,B$，各 2,048 點。先計算每個 $a\in A$ 到 $B$ 最近點的距離，取第 90 百分位為 $r$。對生成樣本 $G$：

$$
\operatorname{precision@r}=\frac1{|G|}\sum_{g\in G}\mathbf 1\!\left[\min_{b\in B}\|g-b\|\le r\right],
$$

$$
\operatorname{coverage@r}=\frac1{|B|}\sum_{b\in B}\mathbf 1\!\left[\min_{g\in G}\|b-g\|\le r\right].
$$

Starter 同時印出 $A$ 對 $B$ 的 real-vs-real reference。數字達標定義為 precision 與 coverage 都補回 baseline 到 reference 差距的至少 40%。若 real-vs-real reference 沒有比 baseline 高至少 0.03，發布前必須換 case，不得用接近零或方向相反的分母計算 gap closure。

題目第一頁固定印出：

> 未達數字門檻、但診斷與失敗分析完整的作業，分數高於達標卻無法說明原因的作業。

## 固定交件格式

1. **押注**：症狀、病因假設、primary intervention、兩個指標的方向預測、預期代價。
2. **驗屍**：baseline 軌跡、time-binned error、precision／coverage。
3. **方法**：生活比喻、自訂符號、介入前後式子、為何應打中病因。
4. **結果**：主圖、兩指標、training-length sweep、compute ledger、負面結果。
5. **自己的 limitation**：改變一個幾何條件的最小 toy；必須實際跑出失效。
6. **U3 接口列**：source、path、pairing、training target／weighting、sampler、NFE、代價。

## Rubric

| 軸 | 配分 | 滿分證據 |
| --- | ---: | --- |
| 問題診斷 | 25 | 用圖與分箱誤差把症狀定位；押注可被實驗推翻 |
| 方法與理由 | 25 | 介入只動一個旋鈕；直覺、符號與式子彼此一致 |
| 實驗證據 | 30 | 控制變因、雙指標、checkpoint sweep、compute ledger 完整；數字達標只占其中 5 分 |
| limitation 與反例 | 20 | 自己造出最小失效例，並說清楚失效條件而非只換 seed |

兩分鐘口試不另立一軸；回答可在對應 rubric 軸上下調整最多 5 分。口試題從下列題庫抽一題：

- 如果把你動的旋鈕轉回 baseline，圖上哪一個特徵應先消失？
- 為什麼 precision 上升不能單獨證明方法變好？
- 你的式子中哪一項對應到圖上的彎曲／漏 mode／低密度偏離？
- 把 NFE 加倍會修掉哪種錯，修不掉哪種錯？
- 你的 limitation 是方法本身的限制，還是 optimization 沒跑完？證據是什麼？

## 三案選擇

### A：有限步急救室

適合強調「新限制下解題」。Baseline 在 64 NFE 可用，正式限制為 6 NFE。學生可選 path family、六個 time points、time sampling／weighting，或 Gaussian path 下的 stochasticity。發布前必須確認每個 case 的 64-step baseline 接近 reference、6-step baseline 明顯較差，且至少兩種合法介入可改善。

### B：幫生成模型鋪路（首選）

最直接接 U3.0。固定 8-step Euler，學生只能選 path design 或 pairing design。Path 必須有明寫的端點與時間導數；pairing 只允許排序、角度、半徑、投影等學生自己寫出的幾何規則，禁止 OT／reflow。評估除 precision／coverage 外，必須報條件 path 圖、同起點 marginal trajectories 與 transport/path-length cost。

### C：短訓練預算分診

營運最穩定。固定 VP path、獨立 pairing、16-step ODE sampler，只給 3,000 optimizer steps。學生選 prediction target、$q(t)$ 或 $w(t)$ 其中一類。核心證據是八個時間 bins 的 common-coordinate velocity error，以及 750／1,500／3,000 step checkpoints。此案必須防止學生把多個 target、sampling 與 weighting 同時掃成 hyperparameter competition。

## 發布前 checklist

- [ ] 乾淨 Colab 可在不手動修路徑的情況下載並 import starter。
- [ ] 所有 roster cases 都有 stable real-vs-real reference。
- [ ] 每個 case 的 baseline failure 與至少兩個合法解都已重跑。
- [ ] 兩指標分別能抓出 off-support samples 與 mode dropping。
- [ ] budget ledger 對超額 steps、width、batch、NFE 直接報錯。
- [ ] 教師與助教各盲改三份模擬 submission，平均不超過八分鐘。
- [ ] 兩線口試排程至少保留 100 分鐘，並準備同一份題庫與記錄表。
