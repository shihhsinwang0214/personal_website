# Geometric Deep Learning：兩階段課程與改寫紀錄

## 範圍

第一階段完成 G1–G6，共 31 篇（26 篇理論、5 篇實作）。中文內容與推導從零撰寫；七個既有 slug 保留，避免既有連結失效。英文原文不在這次重寫範圍，只調整其課程分組。

第二階段規劃 G7–G11，共 34 個題目，與第一階段規模接近；各單元依新概念與推導需要安排篇幅。這些篇章目前只有課程登錄、題目與銜接，不當成已完成正文。

## 共同教學主線

從讀者可以操作的問題開始：轉地圖、重排名單、依問題參考群組資訊、重新編號路網、旋轉一個分子。先問任務的答案應如何改變，再定義輸入與輸出的 action，最後才設計交換這些 action 的運算。

架構篇先寫下 symmetry 要求，再推導運算限制，交代額外的設計假設，最後才組成並命名架構。不能只先展示熟悉的模型，再驗證它具有 symmetry；也不能把一種可行構造說成 symmetry 唯一指定的答案。

| 架構 | 從要求得到的限制 | 另外選擇的構造 |
| --- | --- | --- |
| CNN | 在線性層中，平移等變要求權重只依相對位移，得到共享 convolution kernel。 | 線性層是推導起點；局部小 kernel、boundary 與 stride 仍要另外選擇與檢查。 |
| GNN | 要求逐邊訊息也跟著重編時，同角色的 message／update 不能依存檔編號換函數，鄰居 aggregation 不依排列。 | 一輪只讀鄰居、逐邊處理與 sum 是這裡採用的選擇，不是所有等變 graph models 的必要形式。 |
| Attention／Transformer | 內容權重須隨詢問者與被參考者共同重排，$A(PH)=PA(H)P^\top$，values 也要對齊。 | 選 shared pairwise score、非負正規化，再用 Q／K／V、dot product 與 softmax 實現；head 數量、FFN、residual 與 LayerNorm 不由 symmetry 唯一決定。 |

每篇依序交代：尚未解決的問題 → 生活操作與資訊差異 → 符號對應 → 可逐行追蹤的推導 → 假設與限制 → 下一篇需要解決的問題。理論篇預設讀者具備矩陣運算與基本微積分，不預設群論、representation theory 或 differential geometry。

保持 Tin/Tout 描述一般 action，ρ 只用在線性 feature action。位置會加平移、方向與力不加平移；permutation 改資料列，geometric transformation 改座標系，兩者分開檢查。

結構上的 equivariance 與訓練後的 task accuracy 分開；augmentation 不是架構定理，離散旋轉不是任意連續旋轉，保守力不是所有 equivariant vectors 的性質。

## 第一階段：已完成

| 單元 | 篇章 | 主問題 |
| --- | --- | --- |
| G1.0 | gdl-output-types | 同一張地圖換個方向，答案應該怎麼變？ |
| G1.1 | gdl-group-actions | 先轉再移，和先移再轉一樣嗎？ |
| G1.2 | gdl-translation-convolution | 同一個偵測規則，為什麼要在每個位置重用？ |
| G1.3 | gdl-composition-pooling | 一層會跟著動，整個網路也會嗎？ |
| G1.4 | gdl-boundaries-augmentation | 寫進架構的對稱，實作時還保得住嗎？ |
| G1.5 | gdl-translation-lab | 實作：平移後，CNN 的答案真的一起移了嗎？ |
| G2.0 | gdl-rotation-problem | 手機轉了，同一個偵測器要怎麼一起轉？ |
| G2.1 | gdl-group-convolution | 有了方向之後，下一層要怎麼共享規則？ |
| G2.2 | gdl-feature-types | 一個數字、一支箭頭，能用同一種 activation 嗎？ |
| G2.3 | gdl-rotation-readout | 要不要把方向留下來？ |
| G2.4 | gdl-rotation-lab | 實作：四個旋轉，逐一檢查同一個模型 |
| G3.0 | gdl-unordered-sets | 地標換個排列，為什麼答案不該變？ |
| G3.1 | gdl-deep-sets | 把每個點的資訊加起來，能留下什麼？ |
| G3.2 | gdl-set-equivariant-layers | 每個點都要一個答案，還能忽略排列嗎？ |
| G3.3 | gdl-pointnet | 看完整群點之後，怎麼回頭判斷每個點？ |
| G4.0 | gdl-attention-problem | 每個點都要讀同一份摘要嗎？ |
| G4.1 | gdl-set-attention | 名單重排後，attention 會跟著怎麼變？ |
| G4.2 | gdl-transformer-block | 一層 attention，怎麼接成 Transformer？ |
| G4.3 | gdl-order-and-position | 句子的順序有意義，還要忽略排列嗎？ |
| G4.4 | gdl-attention-relations | 誰能參考誰，也可以是輸入的一部分嗎？ |
| G4.5 | gdl-set-lab | 實作：Transformer 的排列、位置與 mask |
| G5.0 | gdl-graph-relabeling | 沿道路傳訊息，換路口編號後還是同一條規則嗎？ |
| G5.1 | gdl-gcn | 鄰居很多的路口，訊息要怎麼算？ |
| G5.2 | gdl-aggregation-gin | 取平均之後，還看得出鄰居有幾個嗎？ |
| G5.3 | gdl-graph-expressivity | 每個路口看到的都一樣，模型分得出兩張圖嗎？ |
| G5.4 | gdl-graph-lab | 實作：重編路口與分不開的兩張 graph |
| G6.0 | gdl-euclidean-transformations | 把整個分子轉過去，預測的力也該一起轉嗎？ |
| G6.1 | gdl-egnn | 用距離決定大小，用相對位置決定方向：EGNN |
| G6.2 | gdl-energy-forces | 能量不變，為什麼它的 gradient 會跟著轉？ |
| G6.3 | gdl-chirality | 鏡子裡的分子，也一定要得到相同答案嗎？ |
| G6.4 | gdl-geometry-lab | 實作：座標、力與鏡像的三種檢查 |

各單元依問題與推導切篇，目前篇數為 **6、5、4、6、5、5**。G3 仍在 PointNet 留下「每個點都要讀同一份摘要嗎？」；G4 才構造 attention。切篇的依據是讀者是否已經有一個完整的問題與解法，不是首頁想畫哪種多邊形。

### 本次重新切分的理由

| 單元 | 原篇數 → 新篇數 | 切分理由 |
| --- | --- | --- |
| G1 · 對稱與平移 | 6 → 6 | 輸出要求、group action、共享 kernel、網路組合、實作條件各有獨立推導；保留五篇理論與一篇實作。 |
| G2 · 旋轉與特徵 | 6 → 5 | 將普通 CNN 的旋轉反例與四方向 lifting 放在同一篇，讓問題接著有解法；group convolution、feature types 與 readout 仍分開。 |
| G3 · 集合與排列 | 4 → 4 | 保留排列要求、Deep Sets、逐點更新、PointNet；在 G3.3 留問題，交給 G4。 |
| G4 · Attention／Transformer | 7 → 6 | 將共同摘要的不足與 Q／K／V 的構造合併；排列證明、block、語意順序、關係與實作各自成篇。 |
| G5 · Graph／訊息傳遞 | 6 → 5 | 道路的共同重編直接接到 message passing；GCN、aggregation／GIN、1-WL 反例與實作仍分開。 |
| G6 · 空間幾何 | 6 → 5 | 相對位移、scalar 權重與 EGNN 是同一個構造，合併重複的幾何推導；輸出 action、energy-gradient forces、手性與實作保留。 |

合併不是刪去中間步驟：保留生活操作、符號對應與證明，移除重複開場、重複證明和讀完卻還沒有解法的停點。四個被整合的頁面保留原始來源與引用標籤，舊網址重新導向完整篇章；讀者不會在課程列表看到兩份版本。

實作篇使用同一份可下載的 PyTorch 教材。模型類別與訓練迴圈分開；學生可以保留 symmetry test，再替換模型、dataset 與 loss。集合實作仍可用 --unit 3 執行，並納入 G4.5 的 mask 與 readout 對照。

## 第二階段：擴充規劃

各單元為 **7、8、7、5、7 篇**，共 34 篇；以下僅是重新切分後的規劃，不代表正文已完成。

### G7 · Tensor Features（7 篇）

需要先把 angular features 的值與它們整組如何旋轉分開，才有辦法組合 tensor 與設計 layer。因此 spherical harmonics、feature type 與 tensor product 不擠在同一篇。

- G7.0：Scalar 與 vector 還不夠描述什麼？
- G7.1：球面上的方向要怎麼編碼？
- G7.2：旋轉之後，這組 angular features 要怎麼一起變？
- G7.3：把兩種 feature 組合後，會得到哪種型態？
- G7.4：Tensor field layer 要遵守什麼？
- G7.5：Parity 與 feature budget 要怎麼選？
- G7.6：實作：typed tensor features 的旋轉測試

### G8 · Graph Structure and Spectral Methods（8 篇）

Graph frequency 是一個新物件，spectral filter 是用它做運算；兩者分開。Oversmoothing 與 oversquashing 也不是同一個失敗原因，先各自分析，再留一篇比較補結構、改連線與全局資訊。

- G8.0：局部訊息不夠，要新增哪種資訊？
- G8.1：圖上的平滑與 Laplacian
- G8.2：沒有規則格點，frequency 是什麼？
- G8.3：知道 graph frequency 後，要怎麼設計 filter？
- G8.4：多傳幾輪，訊息為什麼變得太像？
- G8.5：遠方資訊都擠進同一個向量，會怎樣？
- G8.6：要補遠方資訊，可以改連線或加入結構嗎？
- G8.7：實作：深度、瓶頸與 structural encoding

### G9 · Surfaces and Local Frames（7 篇）

把不同位置的箭頭搬來比較，與在同一位置換 local frame，是不同問題。先分開建立，再推導 kernel 條件，最後才檢查整個網路。

- G9.0：沿曲面走，直線還是最短路嗎？
- G9.1：每個位置自己的 tangent plane
- G9.2：不同位置的箭頭怎麼比較？
- G9.3：換一套 local frame，答案怎麼變？
- G9.4：曲面上的 kernel，要怎麼配合 local frames？
- G9.5：局部運算接成整個網路，還保留哪些幾何關係？
- G9.6：實作：局部座標系變換的檢查

### G10 · Approximate Symmetry and Canonicalization（5 篇）

近似對稱的問題與 task/model 偏差必須一起看；不再把問題與量測拆成兩篇。多視角、canonicalization 的不連續與放寬限制，各自保留完整的問題與檢查。

- G10.0：對稱只近似成立，偏差來自任務還是模型？
- G10.1：多看幾個視角，或先換到標準視角？
- G10.2：標準方向突然翻轉，模型會怎樣？
- G10.3：允許偏離對稱時，應保留哪些限制？
- G10.4：實作：近似對稱的效能與一致性

### G11 · Geometric Generative Models（7 篇）

ODE 的確定軌跡與 SDE 的隨機樣本使用不同的比較方式，分成兩篇。先建立起點分布、中心化與 score/velocity action，最後再討論生成有效性。

- G11.0：生成一個分子，答案是座標還是分布？
- G11.1：整體平移與中心化的機率模型
- G11.2：Score 與 velocity 應怎麼隨旋轉變？
- G11.3：沿等變 ODE 取樣，分布也會對稱嗎？
- G11.4：SDE 的每條樣本都不一樣，對稱要怎麼檢查？
- G11.5：幾何合理，化學也一定合理嗎？
- G11.6：實作：幾何生成與有效性評估

## Demo 與圖像

保留地圖輸出型態與集合重排的舊 demo。其餘舊 demo 網址連到新的計算工作台：平移差分、C4 lifting／group mixing、集合摘要／attention、graph 訊息更新、distance energy 與 gradient force。展示數值由目前輸入計算，不使用預設的模型效能曲線。各篇保留對應的概念圖；合併篇使用與主要推導最相關的圖。Attention 工作台實際計算 Q／K／V、權重與輸出，對照固定位置、相對 bias 與 causal mask 的共同重排。首頁每個官能基有幾個頂點由實際篇數決定；目前 G1、G4 是六邊形，G2、G5、G6 是五邊形，G3 是四邊形。規劃中的擴充不畫成已可閱讀的篇章。

## 驗證

從 site 目錄執行：

    node scripts/check-gdl.mjs
    npm run build:astro

MDX 檢查包括公式、教學元件、資產與跨篇 label；demo 檢查包括相容 stride 的平移、C4 action、集合／graph 重排與 Euclidean action。PyTorch 實作可執行：

    python public/notes/research_areas/invariance-and-equivariance/gdl_labs.py --unit all --steps 20

這是短訓練與結構測試，不作為正式資料集的效能評估。

