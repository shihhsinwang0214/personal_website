# How to Write a Compelling Introduction

A good introduction is not just a summary, but a clear story and argument.

Our goal is to help the reader understand:

1. Why this problem is important
2. What limitations exist in current methods (or what is not yet well understood)
3. How our work provides a new solution or perspective

However, different types of papers (e.g., exploratory, position/perspective, or early-stage work) may have different emphases and narrative styles in their introduction.

Below is a structure I personally use when writing papers, mainly applicable to method-oriented and empirical studies (e.g., method, empirical), for reference.

---

Before entering the structure, let’s look at an example:

> Graph Neural Networks have been very popular for modeling molecules in recent years. Many methods have been proposed and achieve good performance on benchmarks. However, there are still some limitations. In this work, we propose a new method to improve performance. Extensive experiments on several datasets show that our method performs better than existing approaches.

How does it feel? Is it convincing?

This paragraph only describes phenomena + vague improvement, without any verifiable claims.

Now look at the version below (there is an even more optimized version at the bottom):

> Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery, where experimental evaluation is costly and time-consuming. While Graph Neural Networks have become a pivotal tool for modeling molecular structures, existing approaches still struggle to capture geometric symmetry and maintain principled distinguishability, which limits their performance. For example, as illustrated in Fig. 1, current methods fail to distinguish between certain pairs of distinct 3D configurations of molecules.
>
> **Figure 1: Contrast Plot**
>
> * **Left (Failure):** Existing methods fail to distinguish between certain pairs of distinct 3D structures.
>
> * **Right (Solution):** Our method successfully distinguishes the structures.
>
> To address these limitations, we propose [method], a graph neural network framework that enforces geometric equivariance through canonicalization. In particular, we construct a local canonical frame for each node's neighborhood, which allows the extracted features to intrinsically respect geometric symmetry. We further prove, via the Weisfeiler–Lehman test, that [method] can distinguish any pair of distinct 3D structures, ensuring principled distinguishability. Extensive experiments on existing datasets (QM9 and XXX) demonstrate that our method outperforms existing approaches by approximately 22% in accuracy, attributable to this property. Moreover, our approach achieves strong efficiency, reducing training time by 30% while maintaining high accuracy as the dataset scales, as demonstrated on large-scale protein datasets.

This version is more convincing because it satisfies:

1. The problem is specific and clearly important
2. The limitation is explicit and visually or intuitively grounded
3. The contribution is clearly stated, with method and improvements clearly identifiable
4. Experimental results are quantifiable and directly compared to existing methods

## ⭐ Core Tip: If you only read the introduction, would you believe the paper is important, impactful, and truly useful?

## Step 1: Establish Importance

**Goal:**
Help the reader understand why this field and problem matter (capture attention first).

**What to do:**
Start from a broader context or important application (e.g., generative modeling for drug discovery, protein design, or equivariant GNNs for molecular modeling), and emphasize the value of the direction (e.g., efficiency, theoretical guarantees). Think in terms of “why do we need this problem/direction?”

**Example:**

| Type     | Example Text                                                                                                                                                                                                                                                                            |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ❌ Weak   | Graph Neural Networks have been very popular for modeling molecules in recent years.                                                                                                                                                                                                    |
| ✅ Strong | Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery. Graph Neural Networks have become a pivotal tool in this domain, providing a structured framework to integrate data-driven learning with physical constraints. |

**Key Ideas:**

* Start from a “high-value objective”

  * Do not begin only with technique (e.g., GNN); emphasize domain importance
  * Highlight real-world impact (materials, drug discovery, cost)

* Establish “inevitability”

  * Not just popularity, but necessity
  * Use strong wording (essential, pivotal, etc.)

**Takeaway:**
By raising the perceived importance, the *However* in the next section becomes more impactful and compelling.

---

## Step 2: Limitations and Gaps

**Goal:**
Precisely identify limitations of existing SOTA methods and establish the research gap.

**What to do:**

* Describe bottlenecks in existing methods (e.g., from these perspectives):

  * **Computational complexity:**
    Existing methods scale poorly (e.g., (O(N^2))), making them impractical for large systems.

  * **Lack of theoretical guarantees:**
    Existing methods lack theoretical properties (e.g., convergence, stability), making results unreliable or untrustworthy.

  * **Loss of important properties:**
    Important structural properties are not preserved (e.g., equivariance, invariance, or geometric structure), limiting performance or physical plausibility.

* Provide concrete failure cases

  * Use examples instead of abstract criticism

**Example:**

> **Figure 1: Contrast Plot**
>
> * **Left (Failure):** Existing methods cannot distinguish different 3D structures (e.g., isomers)
>   → *“Fail to distinguish between distinct 3D structures”*
>
> * **Right (Solution):** Our method successfully distinguishes them
>   → *“Successfully distinguishes the structures”*

**Key Ideas:**

* Don’t just say “there is a problem”—make readers **see it**
* Use visualization / examples to strengthen persuasion

**Takeaway:**
Make readers intuitively understand both existence and severity of the problem.

---

## Step 3: Our Contributions

**Goal:**
Clearly and concisely present your method and core contributions, explain design rationale, and show how it addresses the limitations above.

**What to do:**

* Clearly describe the proposed method (avoid excessive abstraction)
* Highlight key design ideas, such as:

  * Geometric structure
  * Symmetry / equivariance
  * Theoretical motivation / guarantees
* Explicitly explain *why* the design addresses Step 2 limitations
* Build a mapping between design and limitation (design ↔ limitation)

**Example (Template):**

> To address these limitations, we propose [method name], a [brief description].
> Our approach is based on [core principle], which enables [key advantage].
> In particular, it resolves [limitation 1] by [mechanism], and addresses [limitation 2] through [mechanism].

**Key Ideas:**

* **Design with justification:**
  Don’t just propose a method—explain its motivation

* **Directly address the gap:**
  Each design choice should correspond to a stated limitation

* **Make contributions explicit:**
  You may list contributions such as:

  * New method / architecture
  * Theoretical analysis or guarantees
  * Key performance-enabling properties

**Bad vs Good Contribution Paragraph**

| Type       | Example                                                                                                                                                                                                                                                                                                                                                 |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ❌ **Bad**  | We propose a new graph neural network model for molecular modeling. Our model incorporates geometric information and achieves good performance on several benchmarks.                                                                                                                                                                                   |
| ✅ **Good** | To address these limitations, we propose [method], a graph neural network framework that enforces geometric equivariance through canonicalization. In particular, we construct a local canonical frame for each node's neighborhood, which allows the extracted features to intrinsically respect geometric symmetry. We further prove, via the Weisfeiler–Lehman test, that [method] can distinguish any pair of distinct 3D structures, ensuring principled distinguishability. |

**Key Differences**

* **From "what" → "why + how"**

  * ❌ Weak: only states a model is proposed
  * ✅ Strong: explains necessity + mechanism

* **From empirical statement → mechanism-to-performance link**

  * ❌ Weak: “better performance”
  * ✅ Strong: explains why performance improves and provides theoretical grounding

---

**Takeaway:**
Make the reader feel your method is not an accidental solution, but a systematic consequence of the problem structure.

---

## Step 4: Quantifiable Achievement (Results & Evidence)

**Goal:**
Use concrete, measurable, and visualizable results to demonstrate effectiveness and build credibility.

**What to do:**

* Provide experimental results
* Emphasize quantitative metrics such as:

  * accuracy / error reduction
  * efficiency / speedup
  * scalability
* Optionally mention theoretical guarantees

**Example (Template):**

> Extensive experiments on [datasets] demonstrate that our method outperforms existing approaches by [X%] on [metric].
> In addition, our approach achieves [property], while maintaining [efficiency / scalability].

**Key Ideas:**

* **Quantify instead of being vague**
* **Select representative results only**
* **Align with earlier gaps**

### Bad vs Good Quantifiable Achievement Paragraph

| Type       | Example                                                                                                                                                                                                                                     |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ❌ **Bad**  | Extensive experiments show that our method performs better than existing approaches.                                                                                                                                                        |
| ✅ **Good** | Extensive experiments on QM9 and XXX demonstrate that our method outperforms existing approaches by approximately 22% in accuracy. Moreover, it reduces training time by 30% while maintaining scalability on large-scale protein datasets. |

**Takeaway:**
Make readers not only *believe it works*, but *see that it works*.

---

## Pro-Tips (Writing Refinements)

* **Zero Inference (no reader guessing)**
  Do not let readers infer missing information: explicitly state everything. If slow, say slow; if wrong, say why. Use visuals whenever possible.
  All transitions must be clear:
  *problem → limitation → proposed method → result*

* **Self-check sentence strength**
  If a sentence feels weak, ask: is it missing specificity, causality, or necessity?

* **Think structurally, not sentence-wise**
  A good introduction is not a collection of sentences, but a reasoning chain.

* **Final checklist test**
  Ask yourself: if I only read the introduction, can I understand:

  1. Why this problem matters
  2. What current methods lack
  3. What we propose
  4. Why it works

---

## 🚀 Advanced: Once You Master the Four Steps Above

You will find that, although the previous examples are “acceptable,” there is still significant room for improvement in highly competitive top-tier conferences.

- Replace vague and ambiguous descriptions with more precise technical terminology
- Strengthen the tight coupling between theory and experiments: experiments should not merely serve to improve benchmark scores, but should instead validate the theoretical claims being made
- The first sentence is optional

>Reliable predictive performance in molecular modeling is essential for accelerating materials design and drug discovery, where the high-dimensional candidate space makes exhaustive experimental validation infeasible. Graph-based learning frameworks have emerged as a dominant paradigm for modeling molecular systems, due to their ability to naturally encode geometric interactions and their strong inductive bias toward local structures. However, achieving reliable predictive performance within this paradigm requires reconciling a fundamental tension between geometric invariance and representational expressivity. While enforcing symmetry constraints (e.g., $SE(3)$-invariance) is essential for physical consistency, existing architectures often achieve this by overly restricting the feature space, thereby degrading representational fidelity. In particular, such over-constrained designs fail to resolve subtle yet chemically meaningful geometric variations, including certain classes of isomeric configurations. As a consequence, these approaches are provably incapable of distinguishing non-equivalent 3D structures under standard message-passing schemes (see Fig. 1), revealing a fundamental limitation in their discriminative power. 
>
>To address this limitation, we propose [Method Name], a framework that resolves the symmetry–expressivity trade-off via Adaptive Local Canonicalization. Our key idea is to enforce equivariance by mapping local neighborhoods into uniquely defined canonical reference frames, effectively transforming a global symmetry constraint into a well-posed local alignment problem. From a theoretical perspective, we establish that our method achieves the expressivity upper bound of local geometric graph representations under the Geometric Weisfeiler–Lehman (GWL) framework. Empirically, our approach yields a 22% relative error reduction across standard benchmarks, while simultaneously reducing training time by 30%, demonstrating that enhanced geometric fidelity can be achieved without compromising computational efficiency.

---
