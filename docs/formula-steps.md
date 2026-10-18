# 依照講解順序展開公式

`FormulaSteps` 讓公式的排版順序與概念出場順序分開。整條式子由 KaTeX 一次排好，`\reveal{步驟}{內容}` 指定每部分何時出現；相同編號可以放在多個位置，例如最後才同時補上 expectation 與左右括號。

數學書寫的選式與概念順序，另見 [concept-ordered-math-writing skill](skills/concept-ordered-math-writing/SKILL.md)。分式、括號與 expectation 可以用巢狀 `\reveal`，讓內層 input 或 label 先於外層運算出現。

DMA 範例位於 U2.1「沿著人潮學會怎麼走」的 CFM loss 與 conditional expectation；loss 依輸入、模型速度、速度 label、平方誤差、取平均的順序展開。其他 MDX 筆記可沿用以下寫法，調整 import 的相對路徑：

```mdx
import FormulaSteps from '../../../components/FormulaSteps.astro';

<FormulaSteps
  id="conditional-velocity"
  title="站在同一個街口，該聽誰的？"
  formula={String.raw`
    \reveal{1}{v_t(x)=}
    \reveal{4}{\mathbb E\big[}
    \reveal{3}{\dot X_t\mid}
    \reveal{2}{X_t=x}
    \reveal{4}{\big]}
  `}
  steps={[
    { label: '要選的速度', text: '在時刻 $t$、位置 $x$，該怎麼選速度？' },
    { label: '同一時刻、同一位置', text: '先找出此刻經過這裡的人：$X_t=x$。' },
    { label: '他們的速度', text: String.raw`再看他們各自的速度 $\dot X_t$。` },
    { label: '取條件平均', text: '依這個條件下的可能性，把速度取平均。' },
  ]}
/>
```

- 加上 `compact` 可只顯示當前一句說明，控制列提供回到起點、上一步、步驟數、下一步與一鍵到底。預設不加此屬性，保留累積說明與播放按鈕。
- `id` 在同一頁不可重複。步驟從 1 連續編號，每一步都需要對應的 `\reveal`、`label` 與 `text`；漏號或公式錯誤會中止 build。
- `formula` 用 `String.raw` 保留 LaTeX 的反斜線。`text` 是 JavaScript 字串，LaTeX 反斜線要寫兩個（或也使用 `String.raw`）；內容支援 `$…$` 行內數學。
- 先選「需要哪個量」，再指定條件、被平均的對象與運算。不要把字母機械切成從左到右的動畫。沿用各篇原有符號；DMA 的 reference process 使用 `I_t`，此處的 `X_t` 只是獨立範例。
- 需要整體伸縮的括號，可把 `\left…\right` 放在同一組，或像範例使用 `\big` 明確指定尺寸，避免把不完整的 LaTeX 結構分進不同組。
- 兩端的直線加箭頭按鈕可一鍵回到第一步或直接顯示完整公式；中間的箭頭逐步移動。控制項也支援左右鍵、`Home` 與 `End`；每個元件獨立操作。累積說明模式另有播放／暫停，由讀者啟動，每步停留 4.5 秒，離開畫面或切換分頁會暫停。
- 新符號以橘色淡入，前面出現的部分回到正文顏色，公式與說明的位置保持不變。`prefers-reduced-motion` 關閉淡入；無 JavaScript 與列印時直接顯示完整公式及說明。保留 KaTeX MathML，讓完整式子仍可由螢幕閱讀器閱讀。

這個元件適用於符號依序出場；真正逐筆畫的手寫動畫需要另外準備 SVG 筆跡，不能從一般 LaTeX 自動得到書寫筆順。
