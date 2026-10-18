# 知識秘境(Beta) — 設計與寫作規則

2026-10-13 名稱確定：中文使用「知識秘境(Beta)」，英文使用「Knowledge Realms (Beta)」。原稱練功房；程式檔名、collection、網址與進度鍵沿用 `dojo`，既有閱讀位置可繼續使用。下文的歷史名稱與設計稿名稱保留原稱。

同一個問題，換讀者試著往下推，再一起對照理由。
這一頁是給之後維護練功房的人（含 agent）看的規則。目前已有 U1.0–U1.5 與 U7.0–U7.3 的連續練習；實作記錄分別見 `docs/dojo-u1-implementation.md` 與 `docs/dojo-u7-sequence.md`。

## 2026-10-18：U1 只在本機預覽

使用者指定知識秘境的群組標籤直接顯示 Unit 名稱，移除「技能書／Skill manual」前綴；來源筆記的連結文字仍保留。

U1.0–U1.5 的十二份中英文腳本暫改為 `status: draft`。`isPublishedDojo` 只表示正式可發布；路由、列表、系列前後篇、語言切換及 notes 的秘境入口統一使用 `isVisibleDojo`，只在非 CI 的 dev 或 `local-preview` 模式顯示草稿。正式 build 會先依 `localOnlyDojoSlugs` 排除 U1 的內容載入，避免 MDX 預編譯把專用實驗／Worker 留在產物；同時不產生頁面或列表／筆記入口，因此不進 sitemap 與頁面搜尋索引。

本機可用 `npm run dev`；靜態預覽使用 `npm run build:local` 和 `npm run preview:local`，輸出至 `site/dist-local`，與正式上傳的 `site/dist` 分開，快取也獨立。U1 腳本、專用實驗／運算／Python／測試與規劃檔已加入 `.gitignore`；目前均未被 Git 追蹤。原有 U1 課程 notes 仍保留原發布狀態。日後正式開放 U1 秘境時，須同時調整腳本的 status、`localOnlyDojoSlugs` 與相應的 Git 排除規則。

驗證：本機建置保留十二個 U1 頁面，正式建置為 304 頁、排除十二個 U1 頁面；所有 HTML 與 sitemap 無 U1 秘境連結，專用實驗 script／Worker 也不在正式產物。先做本機 build、再不加 force 做正式 build，同樣不殘留 U1。二十份 U1 專用檔案仍在本機，全部 ignored 且未追蹤。44 項測試、content check（49 個既有警告）通過；本機 4333 已確認群組標籤無前綴，U1 可開啟且六篇導覽完整。

## 2026-10-17：修正 U1.1–U1.3 的理解斷點

U1.1–U1.3 中英文版本提高為 5。題目先交代足以判斷的條件，不把「容易抽樣」偷換成「一定要非退化 Gaussian」；零向量提案另讓讀者檢查 regression 的來源歧義與隨機性。開放提案後提供可操作的自我檢查，不假裝分析讀者填入的文字。

第一個 forward 實驗沿用每步 β 與整數步數，A／B 使用同一 β，只比較有無縮小原狀態。原生與 Python 都真正逐步執行；這裡不顯示尚未引入的 r／連續時間。閉式抽樣推完後才用 k/T 與 Δt 說明連續進度、r 和切步數的關係。VP 的單位 covariance 是設計參考，先說清楚，再推縮小係數。

Posterior 主線先固定已知原圖與 observation，用一維未知量實際展開兩個平方、收集係數、完成配方，再讀 mean／variance 與換回原符號。`Derivation showLabel={false}` 與 `DeriveStep compact` 可省去重複標題及已在正文說明的三列 metadata，不省略推理。手機驗證應檢查公式本身是否需要左右拖動，不能只看頁面有無溢出。U1.3 的兩點 MSE 例子明示暫用 x₀ 作 label，接著才把一般結果套回 ε。

各 diffusion 實驗主畫面保留當前問題的兩個指標，其餘資料置於「其他數據與抽樣診斷」。判讀提示依實驗指明先看哪個圖或量；累積 noise variance 與單步 β 分開命名。同組 histogram 與理論虛線使用相同顏色。

## 2026-10-17：精簡閱讀節奏（取代下方逐句預設）

使用者試讀後指出內容與操作太冗長。預設直接顯示一個完整概念的對話，段內不要求逐句或換人點擊；只在問題、推導與實驗判讀處保留必要操作。「閱讀設定」集中在章首，逐句、自動播放與速度為可選模式，可一鍵顯示本段全部。U1 移除重複接話與推導前的第二次開場，將部分回答合併到計算或實驗，保留原有公式、必要假設與 22 個實驗。U1.0／U1.4 版本為 5，其餘為 4。不要再把每段拆成互相確認的碎句來增加互動。

## 2026-10-16：讓學生加入夥伴的討論

2026-10-17 延伸至 U1 全系列：保留使用者確認的 U1.0 開場，將其餘方法說明與 U1.1–U1.5 的敘述改為接續彼此想法的 `Exchange`。先提出手上能做的動作、檢查缺口，再進既有思考與實驗；完整推導另保留為可逐步展開的計算板，前面新增對話說清楚為什麼需要這段計算，不讓自動播放代替推導操作。U1.0／U1.4 的閱讀版本為 4，其餘為 3，中英文一致。

使用者再次強調初衷：知識秘境要能獨立學習，對話設計須幫助學生形成問題、提出做法、檢查缺口，再建立方法。只替旁白加名字、套用指定文句或完成頁面生成，都不足以達成這個目的。

- 夥伴要接著上一個人的想法追問、補充或檢查，避免輪流講完各自的段落。角色可以有合理但尚未完整的想法，不固定一人永遠知道答案。
- 使用者指定每個對話框都要更像實際說話：用短句、自然接話和第一人稱，避免讓角色朗讀書面段落或教學規格。保留 input／function／loss 等必要術語與數學的精確意思；口語化不靠刻意裝可愛、誇張驚嘆或把定義省掉。以一句實際能說出口的話安排每個 Sentence 的停頓。
- 學生是討論的參與者。在關鍵推論尚未說完時，用開放問題讓讀者提出判斷、要看的證據或下一個做法，再讀夥伴的後續討論。不用一眼就能猜作者偏好的選擇題代替這個過程。
- 必要定義仍完整教，不把所有定義寫成假裝能答的測驗。使用者隨後指定「話一句一句出來」：同一段討論內每次展開一句，由讀者按「接著聽」控制速度；真正的推理問題另用 Think 停下來。
- 數學與實驗由討論中的需求引出。讀者應能說出現在缺什麼、為什麼需要這個量，以及接下來如何驗證；不以看過台詞或跑完程式當作學會。

U1.0 先以 Nori／Lumi 討論動物照片開始，在提出「只畫新狗、沒有貓」後停下來讓讀者設計判斷，再從整批結果引出分布。照片向量、data law、density 與一維示範分開處理；三條方法的入口也改為提案與追問。中英文版本同步為 3。

`Exchange` 是沿用 `data-kind="say"` 的單一主線節點；內含 `Speech partner pose`，每句用 `Sentence` 明確分段，公式另成一段，不在瀏覽器用標點硬切數字與數學。首次只露第一句，按「接著聽」再露一句，保留前文；尚未輪到的角色不先出現。全部展開才開放主線繼續，真正的思考點另外用 `Think`。句子不產生主線子節點或額外存檔；續讀已完成的討論還原全文，尚未完成的討論由第一句開始。可從這段重聽，已讀完後重聽不重新鎖住主線。手機的角色顯示在發言上方，避免擠壓公式寬度。停用 JavaScript 仍可讀完整討論。

2026-10-17 使用者新增可選「自動播放對話」：預設保留手動逐句；開啟後依句子長度留閱讀時間、淡入同一位夥伴的下一句，到換人處一定停下，按「下一位」才開始另一位的發言。播放中可顯示這位的完整發言或關閉開關，保留已出現的內容；本頁各段共用開關，不額外寫入存檔。自動播放不切換主線、不越過思考題，離開分支或頁面進入背景時停止計時，回到頁面後再接著播。自動展開不搶鍵盤焦點，淡入與捲動尊重 reduced motion；無 JavaScript 與列印仍直接提供全文。

播放速度可選 0.5×、1×、1.5×、2×，同時調整句間閱讀停頓與淡入時間；本頁各段同步設定，播放中切換會重新安排下一句，不一次傾倒未讀內容，也不跨過換人處。

## 2026-10-16：U1 的多實驗問題鏈

**本次教學改寫優先於下方初版的實驗安排。** 使用者指出初版像是替 notes 佐證的 lab：口吻不符、缺少目的與操作的引導，太早給公式和結果。秘境必須是一條可獨立學習的路，notes 是另一條連續閱讀路徑。不能以實驗數量、可執行程式或技術驗收代替教學驗收。

使用者進一步指定 U1.0 的用詞與讀者前提：標題採「我們有一批資料，要怎麼讓模型學會生成類似的資料呢？」；由 Nori 第一人稱提出「我手上收集了很多動物的照片」，再邀請讀者一起想怎麼讓神經網路生成新照片。讀者已知道資料是 input、神經網路是 function、loss 衡量目前 function 距離目標多遠，並會用 gradient descent 優化。從這些已有工具引出「生成任務與 loss 怎麼設計」，保留使用者提供的口吻，不自行改成抽象的課程宣告。

U1.0 改為三條完整方法探索，各自從需求、構造、loss 走到計算與實作，最後才比較。U1.1 依序處理：沒有配對 → 選擇能做的破壞方向 → 反向起點的要求 → 只加 noise 的尺度問題 → 由 variance 條件選縮放係數 → 具體兩步操作 → Markov 與 Gaussian 的角色 → 訓練成本才引出直接抽樣式 → 檢查終點。第一個實驗只比較逐步 VP 與逐步 additive，不提前教抽樣捷徑。

U1.2 先檢查反解缺少的資訊，再分清 target 與網路 input，從可算 posterior、objective 等價與 model family 得到 regression；完整交代 training example、label、參數更新及生成的資訊。U1.3 先讓讀者處理來源歧義與平方誤差，再引入 score、推導與兩種移動規則。U1.4 保留完整 SDE／ODE 路徑，新增訓練快照、noise variance、時間方向與 probability flux 的推理入口。U1.5 先提出受控比較，再執行與判讀，不在觀察前指定原因。中英文主線對應，版本改為 2（U1.4 為 3）。

使用者指定先實作 U1.0–U1.5，並明確要求每篇不限制只能有一個實驗，可運算的補充也提供實作。六篇各有中英文版本，同屬 `dma-u1-diffusion` 系列；U2、U3 仍為規劃。各篇對應來源 note label，現行編號仍由 notes metadata 產生。

`DiffusionExperiment` 有 13 個計算模式，在六篇共出現 22 次：獨立配對 generator regression、RBF EBM、monotone nonlinear normalizing flow、forward、prior、reverse、denoiser training、clean posterior、posterior-mean map、fixed-time score sampling、prediction equivalence、cross-time coupling、reverse sampling。純計算在 `dojoDiffusion.ts`，長運算使用獨立 Worker；`dojoDiffusionPython.ts` 產生自足 NumPy／Matplotlib 程式，只附該模式需要的 helpers。

EBM 真的在有限網格正規化並以 data/model feature expectations 更新 energy。Flow 為 G(z)=b+az+c tanh(dz)，a、c、d 正，使用 inverse、Jacobian 與 implicit differentiation 真正訓練 likelihood；不是用預設曲線當結果。Denoiser 是輸入 (xₜ,t) 的 32-unit tanh MLP，explicit backprop／Adam，以 ε、clean 或 v labels 訓練，生成只使用 learned prediction；held-out error 換到共同 ε 座標。解析 score 與 posterior 另外標明，不能冒充 trained network。

每個實驗保留預測、A／B、自由改設定、實際 histogram、訓練／field／trajectory 證據與判讀。執行不直接開放主線，對照解釋後才取得繼續；Python 成功只打開判讀。圖表附 actual settings，不把新控制項或 Python 結果冒充原生舊圖。閱讀存檔仍不含參數、samples、weights、文字或程式。

U1.4 的 reverse SDE 與 PF-ODE 是完整必讀 `MethodPath`，讀過最後的設定、推導、實驗與限制才標記，再進共同 A／B、最後統整與新情境。Continuous solvers 截止 t=.001，參考線也是該時刻 law；DDPM／DDIM 可到 0，但 finite-step Gaussian/mean substitution 不宣稱精確終點抽樣。故意錯誤的 bad-skip、noise-off、independent inverse 都清楚標明，不能拿它們當正確 sampler 範例。

## 2026-10-16：U7.1–U7.3 的分布、posterior、粒子與 source 實作

延續學生視角體驗的修改。U7.1 用兩條完整 `MethodPath` 探索 classifier guidance 與 CFG；U7.3 用三條完整路徑探索完成後 Best-of-N／IW、途中 SMC／FK、source MCMC／SPT。保留共同定義與完整必要推導，各路讀完才標記，全部完成才進最後比較表與新的限制情境。U7.3 開頭記角色提案的 Sort 改成自由選路；四條路徑的數值例子提前到一般 FK 路徑分布之前。中英文節點與 progressVersion 一致（U7.1：4、U7.2：5、U7.3：3）。

`SteeringExperiment` 共九個模式：classifier、cfg、tilt、posterior、best、importance、smc、source、tempering。每個模式有預測、受控 A／B、自由改條件、原生 SVG 分布與真正樣本直方圖、計算紀錄、讀圖解釋及可編輯 NumPy／Matplotlib 程式。執行本身不開放外層繼續；讀者對照自己的判讀與解釋後才往下走。不計分、不儲存回答、控制項、樣本或程式。讀取舊位置不偽造舊數據。Python 只同步設定，修改後的程式結果不冒充原生圖。

計算在 `dojoSteering.ts`，教學文字在 `dojoSteeringCopy.ts`，自足 Python 範例在 `dojoSteeringPython.ts`。所有模式沿用 μ = ±2、σ = 0.55 的 Gaussian mixture。它們是解析 toy model，沒有把 preset 曲線說成已訓練的神經網路，也沒有即時生成狗照片。

- Guidance 真正用 Euler–Maruyama 積分 reverse VP SDE，ᾱ(t) = exp(−8t)，由精確 base p₁ 抽起點。Classifier 的 log-probability 導數與 CFG 的兩支 score 分開計算；score 箭頭與 sampler 一步含 drift／noise 的位移分開顯示。w = 1 的 conditional 曲線只是參考，有限時間／步數仍有近似；w > 1 不宣稱精確 terminal tilt。
- Tilt 以 [−6,6]、Δx = 0.025 的網格積分正規化，再反查 CDF 抽樣。Posterior 用 Gaussian-mixture Bayes 條件分布真的抽可能來源；hₜ 使用解析 Gaussian 積分，plug-in 使用 posterior mean。下方權重函數的縱軸是 log₁₀(1+weight)，不是 density。沒有把高維圖片的抽樣問題說成已被網格解決。
- Best-of-N 與 IW 各自真正抽 1,000 批，每批 N 個再回傳一個。顯示同一批候選的 reward、正規化倍率與選中的編號，區分條件機率與跨批次的 output law。
- SMC 使用已知 mixture VP Markov process 的精確 reverse conditional，集中觀察有限粒子與 H 估計的影響。逐步模式分開 propagate、計算自己來路的 H_new/H_old、multinomial resampling；每段保留 M 份。色彩追蹤同一 population 的祖先，主直方圖另以 300 趟獨立 population 各回傳一個。中間 H 可選 posterior、plug-in 或故意偏右的正估計；H_K = 1、H₀ = exp(λR)，不把理想相消當成有限 M 的精確性。列出 transitions 與 H 呼叫，解析 H 不隱藏 rollout 成本。
- Source 使用固定 G(z) = F_base⁻¹(Φ(z))，standard Normal prior 與對稱 Gaussian proposal；MCMC 含 prior × reward 的接受比。SPT 同時保留 0、λ/2、λ 三個 targets，依正確接受率交換 z、G(z)、reward，只從目標鏈取樣。拒絕留在原位也算樣本。Warm-up 400 步不是收斂保證。三鏈與單鏈的每鏈迭代數相同，明示三倍評分成本，不宣稱等預算優勢；proposal 步幅與 λ 分開設定。

原有兩結果 `Experiment` 的 Python 現在也在首次展開時同步控制項，之後重開保留編輯。U7.3 有限粒子題的否定回饋直接以「仍可能有偏差」開頭，避免「是的」指涉相反結論。

## 2026-10-16：完整方法路徑、分布實作，再統整與選擇

學生體驗後調整：每條路先給必要模型設定，立即進入「先預測 → A／B 實驗 → 用圖和參數判讀」，再完整推導 toy objective 與 diffusion／Flow Matching 對應式；所有必要內容讀完才回列表標記。資料入口先畫真實抽出的帶類別樣本與 base density。實驗內的單一路徑角色表追蹤資料、c、θ 與回傳規則；跨方法的正式比較表仍只在三條路全部讀完後出現。

`DistributionTask` 的預測與解釋不計分、不存檔，允許先在心裡想。`distributionComparison` 實際執行兩組受控觀察：條件訓練學好後只換 c；微調後只換評估資料；固定模型把 Best-of-N 從 1 改成 32。A／B 保留參數、loss／樣本平均與成本紀錄，圖以同一座標對照兩個 density。自由操作會收起舊 A／B 紀錄，不把舊實驗冒充新條件結果。執行後先開放讀圖解釋，再由讀者按「把我的判讀和解釋對照」取得外層繼續；Python 成功執行也只先開放這段判讀。

模型只開放哪些參數是 toy 的設定，不是方法定義。微調路徑補「開放均值學習仍是微調」反例；最後加上既有 conditional model 換 prompt、微調後再 steering 的組合情境，以及要求保留右群內形狀時的開放讀圖題。中英文同步版本 9。

分布實驗的 Python 首次展開會套用控制項，之後重開保留修改，不自動覆蓋程式。明示只同步設定、不匯入已訓練參數或樣本，每次整份執行由初始模型開始。程式分為資料／訓練（或固定模型）／生成／畫圖四段，編輯目標參數放在開頭。套件載入訊息與 stderr 警告放在可展開診斷；真正的執行錯誤仍直接顯示在主要結果。

U7.0 的 Explore 現在選的是完整方法路徑。每條 `<MethodPath id back title>` 都包含必要定義、loss／更新對象、檢查題、實作與收口；只有走過最後一個節點才標記「已完整探索」。中途可回列表並稍後接著讀。三條路完整探索後，才開啟最後比較表；表格之後再給不同限制與需求，請讀者選方法。本決定取代先讀短提案就進比較表的順序。

三條路使用相同的一維 Gaussian mixture。`DistributionExperiment` 的條件訓練用帶類別的資料學兩個平均值；微調以偏好資料的 likelihood 更新原模型的混合 logit；steering 固定原模型，實際生成 N 個候選、按 reward 留一個。圖中同時對照 base、訓練資料的目標密度（如有）、目前模型／回傳密度與 1,000 個生成樣本的直方圖。不要用預設曲線位移冒充學習；畫圖來自實際梯度更新或候選抽樣。明示這是能直接抽樣的 toy model，並連回 diffusion／Flow Matching 的對應式子。

三份 Python 都使用 NumPy 與 Matplotlib，實際訓練或選候選並畫分布。按執行才載入所需套件；Worker 使用 Agg 擷取 `plt.show()` 與剩餘 figures，每次最多顯示三張圖片。原生互動不依賴 Python 套件下載。套件載入與程式執行分別有逾時，保留停止、還原與 fresh globals。

有完整方法路徑時，存檔增加選填 `paths: { [pathId]: 已讀節點數 }`，仍只記閱讀位置，不記選項、對錯、參數、生成樣本或程式。`step/total` 保持主線語義，首頁與舊腳本相容。續讀能恢復方法完成標記與路徑內位置；圖表從初始模型重來，不偽造上次的訓練結果。

## 2026-10-15：把嘗試與實驗放回問題鏈

使用者要求新設計以提升互動性為主，讓學習與實驗直接在秘境內完成；設計不以搬入原有 lab 為起點。實驗必須讓讀者的條件或規則影響結果，再把觀察接回推理。運算結果與數學目標分開，toy model 明確交代假設，不把機率卡片說成真正生成的圖片。

U7.0 開場改為由讀者選擇先探索哪個動作。三位夥伴的提案是必讀探索路徑，讀完回工作桌；必要定義仍完整提供。移除先記角色與方法名稱的分類，保留實際操作的比較。`Talk` 支援 `detour/back`，沿用既有 Explore 契約。

`Experiment` 是一個主線節點，第一版包含獨立候選命中率（U7.0）與兩結果的目標比例／回傳規則（U7.2）。先預測、選條件與規則，執行後對照理論與有限抽樣，再換條件比較；預測可以留空，不判分。看一組示範也能接回主線，不要求猜對或湊操作次數。最近三次觀察只留在頁面記憶體。

`PythonCell` 可展開編輯並真正執行同一個小實驗。按執行才從固定版本的 CDN 載入 Pyodide，Python 在 module Worker 中執行；只有程式傳給該瀏覽器的 Worker，不上傳作答或閱讀資料。每次以新 globals 執行，提供還原、套用上方條件、停止與逾時終止；主線往下走後仍能改程式。Python 載入失敗不影響原生互動與完整文字。範例使用標準函式庫，沒有預設下載大型模型或數值套件。

實驗內的操作不是額外主線節點。`dojo:experiment-complete` 只表示試過或看過示範，Runner 才提供繼續；成功執行 Python 也可接回主線。儲存仍只有 `{version, step, total}`；重排與新增主線已同步遞增中英文 `progressVersion`。續讀已走過的實驗提供示範與重試，不虛構上次的預測、數據或程式。實驗節點不放進 `study` 提案複本。

停用 JavaScript 時，條件、示範與 Python 原始碼仍可讀，操作控制項隱藏。鍵盤、手機、深淺色與 reduced motion 沿用網站設計；抽樣次數與機率是實驗的量，不是學生的分數或完成百分比。

## 2026-10-15：Knowledge Realms 英文版

使用者確認英文名稱為 **Knowledge Realms**，介面保留現有 Beta 標示。已完成的 U7.0–U7.3 各有 `<slug>.en.mdx`，英文主線、岔路、分類卡片、頁內補充與逐步推導對應中文版本，不以摘要代替教材。公式沿用中文版本的符號與運算；公式裡的說明文字翻成英文。

共用元件沿用 `Ref` 的 `langFromUrl(Astro.url)` 判斷頁面語言，涵蓋預設提問、思考欄、提案回顧、圖片放大、夥伴介紹與推導標籤。Runner 的推導進度文字也放入既有 i18n。語言切換與下一篇由既有雙語路由產生；同 slug 的閱讀位置沿用共用進度鍵，因節點順序完全對應，英文 `progressVersion` 與中文一致。

九張教學圖以 imagegen 製作英文文字版，作為 `imgs/*.en.png`，中文原圖保留；prompts 與產物對照在 `docs/dojo-english-assets.json`。U7.3 開場只有單張完成圖與黑箱分數，候選選擇圖仍在 Best-of-N 情境，方法總覽仍在結尾。來源技能書沒有英文正文時，沿用既有跨語言 fallback，秘境的連續閱讀入口明示 Chinese；來源翻譯完成後會自動使用英文連結。

## 2026-10-15：逐步推導

先以 U7.3「新舊估計的比值 → potentials 相消 → FK 的 terminal target」試作。逐步展開依據的是數學動作，不是一句話或一個等號：每步交代想算什麼、用哪個工具、為什麼選它，再給公式與結果。先完整示範一個例子，再讓讀者選工具、補關鍵步驟，最後檢查不同路徑如何接回終點比例。

`<Derivation label>` 放在一個既有對話節點裡，內含 `<DeriveStep title goal tool reason>`；公式與結果寫在 step 的 MDX slot。第一次只露第一步，按「接著推」才展開下一步，已讀步驟仍可對照。「看完整推導」可一次展開，「從這段重看」可縮回第一步；看完整段後重看，不會重新鎖住主線。

必要推導展開完才提供外層繼續，也可以選完整查看。`Extra` 裡的推導或 `optional` 推導不擋主線。子步驟不是 `data-node`，不加入 total、分數或額外儲存；續讀尚未完成的主線時，推導從第一步開始，已走過的主線還原完整推導。改動主線順序或增加題目仍需遞增 `progressVersion`。

鍵盤可操作所有按鈕，展開後焦點落在新的步驟，捲動尊重 reduced motion。無 JavaScript 時所有步驟直接顯示，控制項隱藏。提案回顧中的推導是完整的唯讀文字，移除展開控制項，不重複保存進度。`goal/tool/reason` 是純字串，含公式的解釋放 slot；不把方法選擇藏在小標籤裡，工具與選它的理由都要有完整句子。

## 2026-10-14：獨立學習與學習夥伴

使用者要求：不先看筆記，也能在知識秘境學到來源單元的知識。必要定義、數學角色、訓練前提、推導與限制須在秘境內說清楚。延伸內容可以放可展開的 `<Extra>`，但必須直接寫在頁內，不能只用來源連結代替；筆記仍是連續閱讀版。這個要求取代下文早期版本將完整 losses、Best-of-N 成功率或相關延伸全部移出秘境的決定。

先讓有名字的夥伴在具體情境裡提出做法，操作講清楚後才帶出方法名稱。讀完一組提案，進入選擇／分類／思考時收起原提案，讓讀者先回想；保留「再聽一次夥伴的提案」，允許重新對照，沒有懲罰、限次或分數。不要為了湊三位角色而發明第三種方法。

- Nori：戴 orca 帽的北極熊，是作者的 mini。
- Lumi：有翅膀的鹿；Mugi：有柴犬臉的柯基。兩個名字目前是暫名。
- 角色不固定代表某種方法，也沒有永遠正確的一位。角色提出的想法能保留合理動機，再由讀者檢查缺口。
- 角色定義在 `site/src/lib/dojoPartners.ts`。2026-10-14 使用者核准帶服裝與探索道具的 Q 版形象，並要求製作動作後加入秘境。三位各有 welcome／suggest／explain／question 四種去背姿勢，原始 PNG 保存在 `site/src/assets/dojo/partners/`，生成規格見 `docs/dojo-partner-assets.json`。Astro 產生適合顯示尺寸的 WebP 與 srcset，不以角色道具取代已核准教學圖或數學示意。

姿勢跟著當下的任務：提案用 suggest、提問用 question、推導與整理用 explain、首頁與情境入口用 welcome。`Say`／`Talk`／`Reveal` 可用 `partner`、`pose` 指定；`Choose`／`Judge`／`Think`／`Sort` 的提問角色在對照完成後換成 explain，逐列表格讀整理時也是 explain、進下一列換回 question。角色不因答錯變成責備或失望的表情，不加入分數或勝負效果。

圖片切換只重建該角色的裝飾性 img，不改題目狀態、焦點、閱讀步數或儲存資料。續讀用既有完成狀態還原姿勢；停用 JavaScript 仍能讀全部內容。正常對話顯示完整去背角色，分類標頭縮小；文字與公式保留原本寬度，手機版不讓角色浮在公式旁擠壓推導。插圖的淡入尊重 prefers-reduced-motion。

元件契約：`<Talk partner="nori" study="group">` 沿用 Say 主線；`Say` 也可帶 `study`。`Choose`、`Think`、`Sort` 的 `review="group"` 在顯示時收起同組已讀提案，建立不含節點 ID、按鈕或輸入欄的唯讀複本。重看不改進度；續讀也會重建回顧並收起原提案；無 JavaScript 時原文仍全部可讀。`Reveal partner` 可讓夥伴接著整理公式，`Sort columnPartners` 可用名字作分類標頭。`Extra` 是頁內的原生 details，不增加閱讀步數。

**定位（2026-10-13 確定）：練功房是第一次學這個單元的預設入口。** 筆記的內容在這裡一段段浮現，
在關鍵推理前，讀者先想、先選、先判斷；情境與必要解釋仍直接提供。技能書（筆記）是同一單元的連續閱讀版，給想一口氣讀完或回頭查的人。

## 2026-10-13 架構與內容決定

**主題。** 練功房的外觀是主題（theme），只改 CSS，節點契約不變。目前三種：
`board`（任務告示板，預設）、`plates`（道場掛牌）、`scroll`（秘笈卷軸）。腳本 frontmatter 用 `theme:` 指定，
省略即 `board`；之後不同課程可以用不同主題。tokens 在 `global.css` 的「dojo」區，主題規則在
`Dialogue.astro`／`DojoView.astro`／`DojoIndex.astro` 的 `[data-dojo-theme=…]` 之下。首頁固定用 `board`。

**選擇題（Choose）鼓勵看完所有選項。** 選對之後走得下去，但其他選項仍然可以點：
- `<Option why="…">`：一句話的解釋，點了就在選項下方展開（可收起）。**請替每個錯誤選項寫 `why`**，正確選項也可以寫。
- `<Option goto="d-x">`：解釋太長（含公式、圖、好幾段）時改用岔路 `<Say detour back="c1">`；從已答過的題目點進岔路，讀完會回到題目，原本的「繼續」還在。
- 選對時的回饋句後面會自動接「也可以展開其他選項，比較它們的理由。」（只在有其他可點的選項時）。
- `why` 與 `reply` 是純字串（不跑 KaTeX）；要數學就用 `goto`。
- 答錯但有 `why` 的選項：顯示 `why`，選項不鎖，讀者再選。答錯且有 `goto`：走岔路再回來。

**是非題（Judge）另一邊也能看。** 答對後，另一個按鈕仍可點，點了把它的 `replyYes`／`replyNo` 展開在下面；
回饋句後會接「另一個判斷的理由也可以展開比較。」。所以 `replyYes` 和 `replyNo` 兩個都要寫。選題不要一律以「一定／保證」製造錯誤敘述，要讓兩種判斷都有實際情境。

**自由探索（Explore）沒有正確選項。** 當幾條路都可行，先讓讀者自由選順序，讀完各條路，再提出這次的限制。每個 `<Option goto>` 連到 `<Say detour back="e1">`；回到原題才算看過，全部路徑都看過才出現繼續。必要概念可以放在這些必讀路徑，不能只放在答錯才會走的岔路。

**拖表（Sort）逐列停頓。** 有 `rows` 時一次只露一列；一列全部歸位後**不會自動跳下一列**，
用 `rowReplies` 提供每列整理後的概念回應，並出現「接著比較下一列」按鈕，按了才露出下一列。最後一列完成時用 `done` 收口，並提供「繼續」。卡片描述實際動作，不只考方法名稱。

**存檔格式。** `localStorage["slam:dojo:<slug>"] = {version, step, total}`；`total` 是主線節點數，
首頁用它判斷「讀過了」（step ≥ total）或「閱讀中」，只蓋章、不顯示 n/m、不計分。重排主線時遞增 `progressVersion`；續讀會重建已讀的比較表與探索入口，不還原文字或作答紀錄。

**章。** 題目節點處理完會帶 `data-stamp`（對照過了／比較過了／想過了／整理好了），進行中的題目帶 `data-stamp-live`（正在想）；
主題用 `::after` 畫成圖章（board：旋轉的邊框字；scroll：方印）。純 CSS，runner 不管外觀。

**首頁（DojoIndex）。** 以具體情境和「如果是你，會先怎麼做？」邀請閱讀，不把元件、JavaScript 或遊戲規則當入口說明。同一本技能書的筆記若還沒有腳本，會以「互動版準備中」的灰紙出現（最多 4 張），
資料直接從 notes collection 推，不用手填。

**已確認的互動（Playwright 走過）：** `why` 展開／收起；答前走岔路再回來可重選；答後走岔路回來「繼續」仍在；
正確選項有 `why` 時答後可展開；是非答錯→答對→點另一邊；拖表第一列歸位停頓→下一列→全部歸位；
走完首頁蓋「讀過了」、按鈕變「再想一次」；同版本的舊格式 `{version, step}` 存檔仍可讀。U7.0–U7.2 的本次驗收另記在 `docs/dojo-u7-sequence.md`。

**設計稿。** 三種主題與首頁的設計稿在 Claude 的 Design 畫布「練功房首頁五種方向」（01–10 首頁方向、第三排 U7.0 整頁三種風格）。


## 第一原則

沿用 `docs/lab-rpg-rules.md`：**不計分、不排名、不打等級**。練功房記錄的唯一東西是「這個瀏覽器走到第幾步」（`localStorage` 鍵 `slam:dojo:<slug>`），不記對錯、不上傳。答錯不是失敗，是走一條岔路；岔路的內容就是課堂上最常見的誤解，所以它本身是教材，不是懲罰。

JavaScript 關掉時所有節點直接顯示，整頁仍是一篇可讀的短文（和 `SelfCheck` 同一原則）。

## 一套腳本 = 一篇筆記的問題鏈

腳本**不是筆記的壓縮版**。它把問題鏈改成讀者可以參與的第一次閱讀：情境 → 先想一個做法 → 對照理由與需要的條件 → 參與關鍵推導 → 換個情境再試一次。理解下一步所需的符號、公式與推理必須在主線或必讀探索中出現；其餘來源延伸在頁內提供完整補充，技能書提供連續閱讀與查閱，結尾一定連回去。

每個錯誤選項都必須對應真實的誤解，並且寫成岔路（`<Say detour back="…">`）或可重看的理由（`why`）。`reply` 可補作答當下的回應，但不能單獨代替錯誤選項的教材；只有 `reply` 的錯誤選項會鎖住。沒有理由可寫的錯誤選項，通常代表這題不值得問。

## 檔案

```
site/src/content/dojo/<slug>.<lang>.mdx       腳本（collection `dojo`，schema 在 content.config.ts）
site/src/components/dojo/Dialogue.astro       runner + 全部樣式（is:global，限 .dojo 之下）
site/src/components/dojo/{Say,Explore,Choose,Option,Judge,Think,Reveal,Sort,Card}.astro
site/src/components/dojo/{Talk,Partner,Review,Extra}.astro
site/src/components/dojo/{Derivation,DeriveStep}.astro
site/src/components/dojo/{DojoView,DojoIndex}.astro
site/src/lib/dojo.ts                          路由、列表、筆記對照
site/src/lib/dojoPartners.ts                  學習夥伴與未來 avatar
site/src/pages/{dojo,zh/dojo}/{index,[slug]}.astro
```

Frontmatter：`slug`、`lang`、`title`（用一句情境，不用筆記標題）、`note`（來源筆記的 `label`，索引頁用它分組到對應技能書，筆記頁也靠它顯示「這一篇有練功房版」橫幅）、`summary`、`updated`、`minutes`、`status`、`progressVersion`（預設 `1`；改動主線步驟時遞增，避免把舊位置套進新問題）。儲存內容只有版本與步驟，不記選項或對錯。

連續練習另填 `series` 與 `order`，索引依順序排列，結尾自動連到同系列、同語言的下一套。`note` 仍必須指向這一套真正的來源筆記；不要依 legacy filename 猜單元編號。

## 節點

| 元件 | 讀者做什麼 | 來源 |
|---|---|---|
| `<Say>` | 讀一段旁白，按繼續 | 筆記段落、`<Ask>` |
| `<Talk partner study>` | 聽具名夥伴提出做法，可在練習前收起同組提案 | 具體情境中的合理思路 |
| `<Extra label>` | 展開頁內的完整補充，不改閱讀步數 | 來源的延伸推導與方法前提 |
| `<Say detour back="c1">` | 檢查某條思路，讀完回到原題；答前答後皆可看 | 常見誤解或探索路徑 |
| `<Explore id><Option goto>` | 自由選順序，把所有可行做法讀過後再比較 | 方法選擇前的問題 |
| `<Choose id><Option goto／correct／why／reply>` | 選一個，再比較其他選項的理由 | `<QuizBlock>` |
| `<Judge answer={bool} replyYes replyNo>` | 是／非 | 新 |
| `<Think>` | 先寫幾句（不存），再看整理 | `<Question>` |
| `<Reveal>` | 作者的整理、公式、`<Ref>` | `<Answer>` |
| `<Derivation><DeriveStep>` | 在一個主線節點內，逐步對照目標、工具、理由與結果 | 核心推導的 worked example |
| `<Sort columns rows rowReplies done><Card col row>` | 分類實際動作，逐列比較後對照作者整理 | 筆記裡的比較表 |
| `<Figure src alt>` | 先看情境，點圖可另開大圖 | 已驗收的教學圖 |

`Sort` 有 `rows` 時，一次只重組一列，完成後先閱讀該列回應，再按按鈕露出下一列，最後顯示完整表格。沒有 `rows` 時可把多張卡片放進同一分類。`Card` 的 `hint` 解釋錯放時漏看的條件；`context` 在無 JavaScript 時顯示所屬方法與比較項目。卡片與格子都支援 Enter／Space，Escape 取消選取；沒有 JavaScript 時所有卡片、`rowReplies` 與 `done` 仍可讀。

### 問題與圖的寫法

- 情境、轉場、題幹與回應都沿用作者一起推理的口吻。先描述眼前具體可能發生的事，例如帽子畫成藍色、柯基只站在雪地，再由這個缺口問「能不能在途中提醒？」；不要把情境縮成「品種、動作與背景可能往不同方向發展」這類抽象摘要。
- 新符號先有需要：讀者知道現在看得到什麼、想判斷或改動什麼，再引入記號。公式前交代為什麼要做這一步，公式後把結果讀回原來的情境；不只列方法名稱和結論。
- 錯誤回應帶讀者檢查漏掉的條件或操作，例如「只改 classifier 的參數，圖片有跟著變嗎？」；保留理由，不只用「再想一下」收尾。問題要推進推理，不為增加對話感而把每句宣告都改成反問。
- 三種做法若都能用，題幹先提出這次的限制，再問哪種符合，不能靠猜作者偏好作答。
- 不為了凸顯 steering，宣稱 conditional model 每換一句 prompt 都必須重訓；新組合和未學過的輸入類型要分開。
- 有 gradient 不等於更新參數。先指出想改的是圖片輸入還是模型參數，再寫微分的下標。
- 情境圖放在預測之前，不提前畫出解答。每個重要視覺對應用圖說補清楚，圖片提供詳細 alt；公式保留在可渲染的正文。
- 岔路回到原題時收起，可以重新選取同一岔路。錯誤回應解釋理由，不用紅色或搖晃作懲罰。

Runner 的契約（`data-node`／`data-detour`／`data-back`／`data-goto`／`data-next`）寫在 `Dialogue.astro` 頂端的註解。主線 = 文件順序中非 detour 的節點；detour 只能靠 `goto` 到達。

寫作注意：元件 **props 是純字串，不會跑 KaTeX**（`reply`、`rows`、`intro` 用 θ 這種 Unicode）；slot 內容走 MDX，可以用 `$…$` 與 `<Ref>`。

## 在沙盒裡建置

目前 Windows workspace 可用 `npm run check` 與 `npm run build:astro` 驗證。直接建置與 dev server 同時使用同一份 Astro 快取，可能造成 content collection 暫時為空或檔案 rename 衝突；預覽已開啟時，驗證 build 要另設 `cacheDir`、`outDir` 與 Vite cache，不更動來源筆記或路由驗證。舊 VM 的 `astro.config.homebuild.mjs` 保留作為環境參考，不把移走內容當作驗收流程。

## 之後

- U7.3 已接續 black-box reward、候選比例、途中重抽與 source 搜尋。U7.0 保留 Best-of-N 命中率直覺，U7.3 則檢查輸出分布與 target 的差別；下一套可從 U7.4 的量測與 observation reward 接續。需要排序推導時再加入 `<Order>` 節點。
- 若要和解鎖成就接起來：只在「走完一套」時記錄，不記答對率。
- 英文版：腳本檔名 `<slug>.en.mdx`，頁面與索引已經雙語。
