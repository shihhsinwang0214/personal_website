---
name: concept-ordered-math-writing
description: Write or revise mathematical teaching notes so formulas develop in conceptual order, with explicit conditions, inputs, labels, comparisons, and expectations. Use for introducing objectives, conditional means, probability laws, identities, and numerical updates; includes staged equation authoring for interactive notes. Complements the author's existing teaching style rather than rewriting whole chapters or animating routine algebra.
---

# 依概念順序寫數學

讀者應該先知道「現在要決定什麼、手上有什麼」，再看數學如何把這個動作寫出來。公式的閱讀順序與版面上的左右順序可以不同。這是一個額外的數學書寫 skill，沿用作者既有的問題主線、生活例子、段落節奏與符號。

## 先選真正需要逐步建立的式子

- 先讀 repository instructions、作者的 style guide、待改的段落與前後銜接。使用者提供的替換文字優先；只修明確的數學、術語、格式與交叉引用錯誤。
- 優先處理第一次出現、而且讀者需要理解各部分為何存在的中心式子：loss、conditional expectation、Bayes、noise construction、守恆式、誤差分解與 sampler update。
- 不機械地把每個字母拆成一步，也不讓每一條常見等式都變成互動。重複引用、簡單代入、表格、quiz 與程式碼通常保留靜態；lab 只在連接理論與實作的數學入口使用。
- 批次處理章節時逐篇檢查，不只找含有 expectation 的篇章。以各篇自己的問題挑公式，不新增與原問題無關的數學，也不重構整篇來湊出一個動畫。

## 把思考動作排成符號的出場順序

先用作者的語氣寫出每一步要做的事，再指定這一步要顯示的數學部分。一步只引入一個機制；不預設要從左寫到右。

- **條件平均：** 先固定可見條件，再看仍然可能的 label，最後對它們取 conditional expectation。例如先出現 $I_t=x$，再寫 $\dot I_t\mid$，最後才補 $\mathbb E[\;]$。
- **Loss：** 交代一筆資料怎麼產生、模型看到什麼、要對準哪個 label、用什麼誤差比較，最後才對抽樣取平均。可以先寫 input，再在它前面補上模型，最後把 expectation 包在外面；順序由當前問題決定。
- **機率與 Bayes：** 先說給定的資訊與想求的對象，再放入可算的 joint／likelihood／prior，最後用 normalizer 讓比例成為合法的 probability 或 density。
- **路徑與更新：** 先有當下位置、時間與可取得的方向，再加入步長、noise 或修正；說明每一項真正改變的是哪個 state。
- **推導與誤差：** 先指出比較的兩個量，再做相減、代入、分組或套用不等式。新增的一步要說明理由，不把「依序出現」當成證明。

以上是選順序的例子，不是固定模板。讀者已經知道的部分可以一起出現；不為了增加步數重講舊物件。

## Expectation 必須說出它考慮了哪些可能性

- 分清「loss 對不同 training pairs 的誤差取平均」與「固定 input 後，把可能的 labels 取平均」。前者是一個 objective，後者給出理想 L2 regression 的解。
- 說出固定了什麼、哪些量仍然隨機，以及平均的對象。讓 $t$、端點、noise、label 的下標對回這筆資料的製造方式。
- 不停在「對 $t,(X_0,X_1)$ 取平均」的記號翻譯；還要解釋這是在考慮我們能依這個抽樣機制產生的 labels，讓模型參考不同可能的學習目標。
- 例如作者對 CFM loss 的說法是：「再對不同時間 $t$ 與端點 $(X_0,X_1)$ 的平方誤差取平均，也就是考慮所有我們能產生的 label，參考所有的速度作為學習目標。」沿用這個語意；換到別的 objective 時，用該篇真正的 label 取代速度。
- 「所有可能」依相應的抽樣分布或 conditional distribution 加權；不因此宣稱每個 label 等權、模型在單一 input 能同時輸出所有 labels，或只參考一個 label 就足夠。

## 在筆記裡呈現

- 每一步配一句當下動作或它的意思。預設精簡，使用者指定的完整文字不因介面篇幅而被改寫或截掉。
- 先用完整公式排定所有位置，再依概念順序顯示各部分；可以在不同位置同時補上括號、expectation、norm 或係數。新部分強調，舊部分回到正文顏色；切換時公式和說明不跳動。
- 保留逐步前後切換，也提供一鍵看完整公式與一鍵回到第一步。各公式獨立操作，避免讀者被迫走完每個步驟。
- 網頁以目前的精簡樣式為主：公式、當前一句說明與低調控制項。沒有 JavaScript、列印或輔助閱讀時仍能取得完整數學與說明。
- 若使用這個 repository 的 Astro／MDX notes，先讀 [Astro 寫法與例子](references/astro-notes.md)。其他格式沿用同樣的概念順序，採該格式適合的呈現方式。

## 完成前檢查

1. 每一步是否回答了「為什麼現在需要這個量或運算」，而不是只說符號名稱？
2. 給定條件、隨機量、model、label 與平均對象是否明確，並沿用課程的 notation 與時間方向？
3. 完整公式是否保留原本的等號／近似／界、權重、條件、定義域與適用假設？揭露順序不能改變數學。
4. 是否取代了原式，而沒有在旁邊留下另一套意思相同的版本？原本支撐結論的推導、圖與銜接是否仍然在？
5. 編譯與公式檢查、首尾與前後切換、多公式獨立性、手機欄寬、亮暗主題、靜態閱讀是否實際驗證？對新出現的問題修正後再交付，不把成功 build 當成排版通過。
