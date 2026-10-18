# Astro／MDX 的逐步公式

這份 reference 適用於 `personal_website` 的 notes。先找 repository 的 `AGENTS.md` 與適用 style guide；DMA 位於 `site/refs/dma-notes-style-guide.md`。不要將這個專案的相對路徑硬套到其他專案。

## 現有元件

- 實作：`site/src/components/notes/FormulaSteps.astro`。
- MDX 轉接：`site/src/content/notes/components/FormulaSteps.astro`。
- 頁面用法：`docs/formula-steps.md`，以及 U2.1 的 CFM loss／conditional velocity。

在 DMA 各 `week-N` 目錄中，import 為：

```mdx
import FormulaSteps from '../../../components/FormulaSteps.astro';
```

元件使用 KaTeX 的完整 typesetting，`\reveal{步驟}{部分公式}` 僅控制可見性。編號從 1 連續到 `steps.length`，每一步至少有一組；同一編號可分散在多個位置。每個 instance 有獨立 `id`，同頁不可重複。

## 先條件，再速度，最後平均

```mdx
<FormulaSteps
  id="conditional-velocity"
  compact
  title="站在同一個街口，該聽誰的？"
  formula={String.raw`
    \reveal{1}{v_t(x)=}
    \reveal{4}{\mathbb E\big[}
    \reveal{3}{\dot I_t\mid}
    \reveal{2}{I_t=x}
    \reveal{4}{\big]}
  `}
  steps={[
    { label: '要選的速度', text: '站在目前的時間與位置，該怎麼選速度？' },
    { label: '固定條件', text: String.raw`先看同一時刻經過 $x$ 的人：$I_t=x$。` },
    { label: '參考 label', text: String.raw`再看他們各自的速度 $\dot I_t$。` },
    { label: '取條件平均', text: '依這個條件下的可能性，把這些速度取平均。' },
  ]}
/>
```

用該篇原本的符號與最適解記號；上例沒有要求所有篇章都使用完全相同的左式。

## 分式與外層運算可以晚於內容出現

`\reveal` 可以巢狀使用。外層編號較晚時，內層較早的部分仍可先出現，例如先寫 likelihood 與 prior，最後才加上分數線與 normalizer：

```latex
\reveal{4}{\frac{
  \reveal{2}{q(x_t\mid x_{t-1})}
  \reveal{3}{\,p_{t-1}(x_{t-1})}
}{p_t(x_t)}}
```

同樣可以把成對的括號、norm 與 expectation 放在外層，將較早的 input／label 放在內層。保留完整 LaTeX 結構，不要為了動畫拆斷 `\frac` 或 `\left…\right`。元件會讓先出現的部分保持正文顏色，不隨後來的外框一起變色或重新淡入。

## 較長的 loss

保留數學角色，先按語意拆組，再用 `gathered` 或合適的多行版面避免手機溢出。不要把公式縮得難以閱讀，也不要在不同 `\reveal` 內分開不完整的 `\left`／`\right`。

```latex
\begin{gathered}
  \reveal{1}{\mathcal L_{\mathrm{CFM}}(\theta)=} \\[.25em]
  \reveal{5}{\mathbb E_{t,(X_0,X_1)}\big[}
  \reveal{4}{\big\|}
  \reveal{2}{v_\theta}\reveal{1}{(I_t,t)}
  \reveal{3}{-\dot I_t}
  \reveal{4}{\big\|^2}
  \reveal{5}{\big]}
\end{gathered}
```

五步分別解釋 input 的製造、模型輸出、速度 label、平方誤差、涵蓋所有可產生 labels 的平均。具體文字沿用作者與當前段落，不把這個 CFM 例子當成所有 loss 的固定拆法。

## 寫入與驗證

- `formula` 使用 `String.raw` 保留 LaTeX 反斜線。含數學的 `steps.text` 也可使用 `String.raw`；一般 JavaScript 字串的反斜線需跳脫。文字屬性由 `inlineMath` 解析 `$…$`。
- 以精確的舊片段取代，檢查匹配次數為 1，保留其他修改。引用的 label、slug、前後篇指路與既有假設不變。
- 依 repository 的實際工具跑 MDX、KaTeX 與 build；傳入真正改過的檔案給 `check-notes.py`，不以零檔案檢查當成通過。
- 在實際頁面測逐步、回起點、一鍵到底與鍵盤操作；多個 instance 不互相改動。檢查不同步驟的相對位置與區塊高度，特別是長 caption 與多行公式。
- 以手機欄寬檢查完整式及所有部分，不能只看初始幾個符號。亮暗主題都看過，確認沒有 `.katex-error`、公式裁切或控制項溢出；確認沒有 JavaScript 與列印時仍顯示完整內容。
