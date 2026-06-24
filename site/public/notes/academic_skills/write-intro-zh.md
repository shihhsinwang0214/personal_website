# 如何寫出一個有說服力的 Introduction

一個好的 introduction 不只是 summary，而是一個清楚的 story 與 argument。  

我們的目標是讓讀者理解：

1. 這個問題為什麼重要  
2. 現有方法在哪些方面仍有限制（或尚未被充分理解）  
3. 我們的工作如何提供新的解法或觀點  

不過，不同類型的論文（例如 exploratory、position/perspective 或 early-stage work），其 introduction 的重點與敘事方式並不相同。

以下整理的是我自己在寫論文時常用的結構，主要適用於方法類與實證類研究（例如 method、empirical 等），供大家參考。


---

在進入結構之前，我們先看一組例子：

>Graph Neural Networks have been very popular for modeling molecules in recent years. Many methods have been proposed and achieve good performance on benchmarks. However, there are still some limitations. In this work, we propose a new method to improve performance. Extensive experiments on several datasets show that our method performs better than existing approaches. 

感覺怎麼樣？有被說服嗎？

這個段落只是描述現象 + 模糊改進，缺乏任何可檢驗的論點。

再看看下面的版本(最底部還有進一步優化的版本)：

>Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery, where experimental evaluation is costly and time-consuming. While Graph Neural Networks have become a pivotal tool for modeling molecular structures, existing approaches still struggle to capture geometric symmetry and maintain principled distinguishability, which limits their performance. For example, as illustrated in Fig. 1, current methods fail to distinguish between certain pairs of distinct 3D configurations of molecules.
>
> **Figure 1: Contrast Plot**
>
> - **Left (Failure)：** Existing methods fail to distinguish between certain pairs of distinct 3D structures.
>
> - **Right (Solution)：** Our method successfully distinguishes the structures.
>
>To address these limitations, we propose [method], a graph neural network framework that enforces geometric equivariance through canonicalization. In particular, we construct a local canonical frame for each node's neighborhood, which allows the extracted features to intrinsically respect geometric symmetry. We further prove, via the Weisfeiler–Lehman test, that [method] can distinguish any pair of distinct 3D structures, ensuring principled distinguishability. Extensive experiments on existing datasets (QM9 and XXX) demonstrate that our method outperforms existing approaches by approximately 22% in accuracy, attributable to this property. Moreover, our approach achieves strong efficiency, reducing training time by 30% while maintaining high accuracy as the dataset scales, as demonstrated on large-scale protein datasets.

這個版本之所以有說服力，是因為它同時滿足：

1. 問題具體且具有明確的重要性
2. limitation 清晰且具備可視化或直觀對照
3. contribution 表述明確，方法與改進點清楚可辨
4. 實驗結果具備可量化指標，並與既有方法進行直接比較

## ⭐ 最核心 tip：如果只看 introduction，是否能讓人相信這篇 paper 是重要、有影響力且真正可用的？


## Step 1: 建立重要性

**Goal：**  
讓讀者理解這個領域與問題的重要性（先抓住 attention）。

**What to do：**  
從更宏觀的背景或重要應用切入（例如 generative modeling for drug discovery、protein design，或 equivariant GNNs for molecular modeling），並適度點出該方向的價值（例如 efficiency、theoretical guarantees 等）。可以從「why do we need this problem / direction?」這個問題出發來思考。

**Example：**

| Type | Example Text |
|:---|:---|
| ❌ Weak | Graph Neural Networks have been very popular for modeling molecules in recent years. |
| ✅ Strong | Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery. Graph Neural Networks have become a pivotal tool in this domain, providing a structured framework to integrate data-driven learning with physical constraints. |

**Key Ideas：**

- 從「高價值目標」切入  
  - 不要一開始只談技術（如 GNN），也要強調領域本身的重要性  
  - 說明實際影響（材料設計、藥物研發、成本）

- 建立「必然性」  
  - 不要只說流行，而是讓方法變成不可或缺  
  - 使用強語氣（essential, pivotal 等）

**Takeaway：**  
當你把技術的重要性拉高，下一段提出 *However* 時，衝突會更強，讀者也更期待你的解法。

---

## Step 2: 限制與缺口

**Goal：**  
精準指出現有 SOTA 方法的不足，建立 research gap。

**What to do：**

- 描述現有方法的瓶頸（可以從以下幾種類型切入）：
  - **Computational complexity：**  
    現有方法在規模擴大時成本過高（例如 $O(N^2)$），難以應用於大規模系統或實務場景。

  - **Lack of theoretical guarantees：**  
    現有方法缺乏理論上的性質保證（例如收斂性、穩定性），使其訓練結果難以保證或信任。

  - **Loss of important properties：**  
    在建模過程中未能保留關鍵結構性質（例如 equivariance、invariance 或幾何結構），導致模型表現受限或不符合物理直覺。

- 舉出失敗的案例  
  - 用具體例子來說明瓶頸，而不是抽象批評  

**Example：**

> **Figure 1: Contrast Plot**
>
> - **Left (Failure)：** Existing methods 無法區分不同的 3D 結構（e.g., isomers）  
>   → *"Fail to distinguish between distinct 3D structures"*  
>
> - **Right (Solution)：** 我們的方法成功區分  
>   → *"Successfully distinguishes the structures"*

**Key Ideas：**

- 不只是說「有問題」，要讓讀者**「看到問題」**
- 用 visualization / example 強化說服力

**Takeaway：**  
讓讀者直觀理解問題的存在與嚴重性，而不是只靠文字說明。

---

## Step 3: Our Contributions

**Goal：**  
簡潔明確地提出你的方法與核心貢獻，說明其設計依據與關鍵技術，以及如何對應並解決上述提到的limitations、challenges。

**What to do：**

- 清楚說明你提出的方法（method / framework / formulation），避免過度抽象  
- 點出方法的關鍵設計、核心想法、達成什麼，例如：
  - 幾何結構（geometric structure）  
  - 對稱性（symmetry / equivariance）  
  - 理論動機（theoretical formulation / guarantees）  
- 明確說明「為什麼這樣設計」能解決前一段提出的問題（Step 2）  
- 建立方法設計與瓶頸之間的對應關係（design ↔ limitation）


**Example（Template）：**

> To address these limitations, we propose [method name], a [brief description].  
> Our approach is based on [core principle / key technique], which enables [key property or advantage].  
> In particular, it resolves [limitation 1] by [idea], and addresses [limitation 2] through [mechanism].

**Key Ideas：**

- **Design with justification：**  
  不只是提出方法，而是說明其設計背後的依據與動機

- **Directly address the gap：**  
  每個關鍵設計應對應到前面提出的 limitation，而不是憑空冒出來

- **Make contributions explicit：**  
  可以條列具體貢獻，例如：
  - 新方法 / 架構  
  - 理論分析或性質保證  
  - 關鍵設計帶來的能力提升  


**Bad vs Good Contribution Paragraph**

| Type | Example |
|:---|:---|
| ❌ **Bad** | We propose a new graph neural network model for molecular modeling. Our model incorporates geometric information and achieves good performance on several benchmarks. |
| ✅ **Good** | To address these limitations, we propose [method], a graph neural network framework that enforces geometric equivariance through canonicalization. In particular, we construct a local canonical frame for each node's neighborhood, which allows the extracted features to intrinsically respect geometric symmetry. We further prove, via the Weisfeiler–Lehman test, that [method] can distinguish any pair of distinct 3D structures, ensuring principled distinguishability. |

---

**Key Differences**

- **From "what" → "why + how"** 
  - ❌ Weak: 只是說提出一個模型來改善性能  
  - ✅ Strong: 說明「為什麼需要這個方法」，以及「它如何解決問題」

- **From purely empirical statement → mechanism-to-performance connection**  
  - ❌ Weak: 只說 “improved performance on benchmarks”  
  - ✅ Strong: 明確說明方法設計如何導致性能提升，並指出其背後的理論依據或特殊性質，使 empirical improvement 具有可解釋性與合理性
---




**Takeaway：**  
讓讀者感覺你的方法不是「偶然成功的一種解法」，而是順著問題、侷限，有系統性地推導出的解法。

---

## Step 4: Quantifiable Achievement（結果與證據）

**Goal：**  用具體且可量化、視覺化的結果，支持你的方法確實有效，建立說服力。

**What to do：**

- 提供實驗結果（performance improvement）
- 強調可量化指標（quantitative metrics），例如：
  - accuracy / error reduction  
  - efficiency / speedup  
  - scalability  
- 如果有理論性質，也可以簡要提及（theoretical guarantees）

**Example（Template）：**

> Extensive experiments on [datasets] demonstrate that our method outperforms existing approaches by [X%] on [metric].  
> In addition, our approach achieves [property], while maintaining [efficiency / scalability].

**Key Ideas：**

- **量化，而不是模糊描述：**  
  避免使用「significantly better」而沒有數據

- **選擇代表性結果：**  
  不需要列所有實驗，只挑最能支持核心 claim 的

- **呼應前面的 gap：**  
  結果要能對應 Step 2 的問題（例如：更快、更準、更穩定）


### Bad vs Good Quantifiable Achievement Paragraph

| Type | Example |
|:---|:---|
| ❌ **Bad** | Extensive experiments show that our method performs better than existing approaches. We achieve good results on several datasets. |
| ✅ **Good** | Extensive experiments on existing datasets (QM9 and XXX) demonstrate that our method outperforms existing approaches by approximately 22% in accuracy, attributable to the principled distinguishability of our framework. Moreover, our approach achieves strong efficiency, reducing training time by 30% while maintaining high accuracy as the dataset scales, as demonstrated on large-scale protein datasets. |


**Takeaway：**  
讓讀者不只「相信你的方法合理」，還「看到它真的有效」。

---

## Pro-Tips（寫作細節優化）

- **Zero Inference （避免讀者自行補全）**  
不要讓讀者猜測任何資訊：慢就明確說慢，錯就指出錯在哪裡。能視覺化就用圖表，因為圖像通常比文字更直接、可信。
所有 transition 必須清晰
   *problem → limitation → proposed method → result*

- **自我檢查句子強度**  
  如果一句話不夠有力，問自己：缺的是具體性、因果關係，還是必要性？

- **以結構思考，而不是句子**  
  一篇好的 introduction 不是句子的集合，而是一條清楚的推理鏈（chain of reasoning）。

- **Checklist test**  
  問自己：如果我只讀 introduction，我是否能理解
  1. 為什麼這個問題重要
  2. 現有方法缺少什麼
  3. 我們做了什麼新東西
  4. 為什麼這個方法有效

---

## 🚀 進階：當你已經掌握上述四個步驟後

你會發現，前面的案例雖然「合格」，但在競爭激烈的頂會下，仍有明顯的優化空間。

- 將空泛、模糊的描述，替換為**更精確的專有名詞**
- 強化**理論與實驗的緊密耦合**：實驗不只是為了刷 benchmark，而是用來**驗證理論、許下的Claim**
- 第一句是optional

>Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery, where the high-dimensional candidate space makes exhaustive experimental validation infeasible. Graph-based learning frameworks have emerged as a dominant paradigm for modeling molecular systems, due to their ability to naturally encode geometric interactions and their strong inductive bias toward local structures. However, achieving reliable predictive performance within this paradigm requires reconciling a fundamental tension between geometric invariance and representational expressivity. While enforcing symmetry constraints (e.g., $SE(3)$-invariance) is essential for physical consistency, existing architectures often achieve this by overly restricting the feature space, thereby degrading representational fidelity. In particular, such over-constrained designs fail to resolve subtle yet chemically meaningful geometric variations, including certain classes of isomeric configurations. As a consequence, these approaches are provably incapable of distinguishing non-equivalent 3D structures under standard message-passing schemes (see Fig. 1), revealing a fundamental limitation in their discriminative power. 
>
>To address this limitation, we propose [Method Name], a framework that resolves the symmetry–expressivity trade-off via Adaptive Local Canonicalization. Our key idea is to enforce equivariance by mapping local neighborhoods into uniquely defined canonical reference frames, effectively transforming a global symmetry constraint into a well-posed local alignment problem. From a theoretical perspective, we establish that our method achieves the expressivity upper bound of local geometric graph representations under the Geometric Weisfeiler–Lehman (GWL) framework. Empirically, our approach yields a 22% relative error reduction across standard benchmarks, while simultaneously reducing training time by 30%, demonstrating that enhanced geometric fidelity can be achieved without compromising computational efficiency.

---
