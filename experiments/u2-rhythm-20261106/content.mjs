// Independent editorial prototype. No production notes are imported or modified.
const r = String.raw;
export const chapters = [
{
 id:'u20', number:'U2.0', title:'起點已經是照片，為什麼還要先變成 noise？',
 lead:'我們已經會從 Gaussian 生成資料。現在，把起點換成另一批資料呢？',
 objectives:['說出任意兩端搬運比 U1 多出的要求。','把此時、此地的移動規則寫成 flow ODE。','分清楚一條 reference path 與真正生成時的路。'],
 sections:[
 ['我們想換的，其實是起點',r`
在 U1，我們從 Gaussian noise 出發，一步步生成資料。這個起點很方便：想要多少 noise 就抽多少；加噪的 construction 也讓我們能直接製造中間狀態，練習怎麼去噪。

但如果今天給你的已經是一張照片，而我們想把它轉成卡通風格呢？起點是照片，終點是卡通，兩邊都是資料。這時候，我們想問的便是：**能不能直接學會從這批資料搬到另一批資料？**

這裡先只要求兩端的 distribution 正確。把照片分布搬成卡通分布，還不會自動保證同一隻狗的身分、姿勢都保留下來；那些要求需要另外放進配對、condition 或 objective。

[[figure:transport]]

U1 的基本生成設定，是從 Gaussian 走到資料。現在我們放開其中一端，改成

$$X_0\sim p_0\quad\longrightarrow\quad X_1\sim p_1.$$

這裡的 $p_0,p_1$ 都可以是指定的 distribution，不要求起點一定是 Gaussian。當然，我們仍然需要能從兩端取得 training samples。`],
 ['一次搬完全程，還是每次只決定下一步？',r`
我們在 U1 已經碰過一個困難：要模型一次回答整個 transport map，問題可能很複雜。所以後來的做法是自己造出中間狀態，把一個大任務切成許多小任務。

那現在能不能也這樣做？想像我們要把一堆沙子從一種形狀搬成另一種形狀。對其中一粒沙來說，每個瞬間需要回答的只是：**現在站在哪裡，接下來往哪裡移動、移動多快？**

用 $x_t$ 記這粒沙在時間 $t$ 的位置，用 $v_t(x)$ 表示時間 $t$、位置 $x$ 的速度。我們希望位置按照這個速度變化：

[[formula:motion]]

這就是 flow ODE。它給的是局部規則；從起點一路解下去，才形成完整的 trajectory。速度可以同時隨時間、位置改變，所以同一條 trajectory 走到不同地方，得到的指令也可能不同。`],
 ['有了一條 ODE，事情就完成了嗎？',r`
[[question:知道每一粒沙該照速度走，是否就已經得到搬運方法？|還差 ODE 右邊的速度。隨便選一個 field，沙子確實會動，但不一定形成我們要的終點分布。例如一直選零速度，所有沙子就留在原地。]]

ODE 告訴我們拿到速度之後怎麼走，卻沒有告訴我們要怎麼找速度。這正是接下來真正要學的東西。

我們可以先考慮一個比較容易的版本：**如果某一筆起點與終點都已經知道，能不能直接畫出它的路，再從這條路拿到速度？** 已知端點的路很好造；生成時只能看目前位置的規則，則需要再想一步。`],
 ['先讓沙子真的動起來',r`
下面用一維沙堆檢查「速度會改變分布」這件事。起點是 $[-1,1]$ 的 uniform distribution；選擇常數速度 $v_t(x)=2$，精確解就是 $x_t=x_0+2t$，所以終點是 $[1,3]$ 的 uniform distribution。

先改速度，再比較終點的平均與範圍。如果把速度改成零，原本的目標不會自己出現。這個實驗使用我們指定的 exact field，**還沒有訓練模型**。

[[python:u20]]

這個例子讓我們看見：容易寫的是「照某個速度走」，需要設計的是「哪個速度會把整群人搬成指定的樣子」。Lipman 等人的 Flow Matching，提供了從容易製造的路徑來學 field 的做法。`]
 ],
 bridge:'我們已經知道要找的是此時、此地的速度。接下來把沙子換成散場的人群：知道自己要去哪裡的人，能不能教會不知道終點的人怎麼走？', next:'u21',
 refs:['fm']
},
{
 id:'u21', number:'U2.1', title:'不知道終點，怎麼學會往哪裡走？',
 lead:'知道終點的人能畫路。但真正生成時，我們手上偏偏沒有終點。',
 objectives:['從端點製造中途 input 與 velocity label。','用 L2 objective 推出固定 input 後的條件平均。','從精確 ODE 位移寫到 Euler 的有限步近似。'],
 sections:[
 ['如果每個人都知道自己要去哪裡',r`
跨年煙火剛結束，我們站在台北 101 附近。有人走向市政府站，有人往 101／世貿站，也有人往象山站。先假設每個人都知道自己的起點 $x_0$ 與終點 $x_1$，暫時把街道與障礙物拿掉。

最簡單暴力的做法，自然就是直接走一直線：

$$I_t(x_0,x_1)=(1-t)x_0+tx_1.$$

$t=0$ 在起點，$t=1$ 到終點。這是我們替這組端點畫出的 **reference path**。對時間微分，就得到這條路的 reference velocity：

$$\dot I_t(x_0,x_1)=x_1-x_0.$$

固定端點後，位置與速度都能直接算出來，不需要神經網路，也不需要先解 ODE。

[[figure:reference]]`],
 ['這個方法看起來超讚，但問題藏在哪裡？',r`
[[question:既然直線已經把起點接到終點，生成時直接照這條線走，不就好了？|生成時不知道終點。如果要生成的圖片已經拿到了，直接回傳它就好。訓練時能抽出端點來製造 label，不表示生成時也知道自己對應哪一組端點。]]

現在想像你是手機沒電、沒有地圖的迷路者。你手上只有「現在是時間 $t$，而我站在位置 $x$」這些資訊。需要的便是一條所有人都能使用、只看 $(x,t)$ 的規則。

走到這種地方，我們可以先盤點：**真正使用時拿不到的東西，訓練時是不是反而有？** 我們雖然不能把終點交給生成模型，卻能用已知端點製造它應該參考的速度。`],
 ['跟著知道方向的人練習',r`
如果自己不知道捷運站在哪裡，一個自然的想法是參考附近知道怎麼走的人。但這個參考得限定在同一個時間、同一個位置：站在象山方向看到的人潮，不一定能拿來指揮市政府那邊的人。

於是我們讓模型做類似的事。先抽一組端點 $(X_0,X_1)$，再獨立抽 $t\sim\mathrm{Uniform}(0,1)$；用 reference path 算出 input $I_t$ 與 label $\dot I_t$。這裡端點的聯合抽樣方式先固定，例如從兩端獨立抽樣。

[[formula:loss]]

期望考慮的是依這個機制抽出的不同時間與端點，也就是我們能製造的各種 velocity labels。網路只收到 $(I_t,t)$，訓練程式則拿同一次抽樣的 $\dot I_t$ 來比較平方誤差。

Lipman 等人把這種不必先解 ODE 就能製造監督訊號的訓練，稱為 **simulation-free training**。這裡省掉的是訓練資料製造過程中的 ODE simulation；模型訓練與生成時的積分仍然有計算成本。`],
 ['同一個街口，卻有不同的答案',r`
但麻煩就出現在這裡：同一個時間，可能有很多條 reference paths 都經過同一個街口。有人往左，有人往右，網路在相同 input 卻只能給一個速度。

例如兩種等可能的來路，分別給出 $(2,2)$ 與 $(-2,2)$。沿用 U1 的 L2 結果，最好的單一答案就是 $(0,2)$：左右抵消，向上的部分留下來。

[[figure:average]]

為什麼是平均？固定 input 後，把速度 label 記成 $U$，它的條件平均記成 $m$。對候選答案 $a$ 展開平方：

$$\begin{aligned}
\mathbb E[\|a-U\|^2\mid I_t=x]
&=\|a-m\|^2\\
&\quad+\mathbb E[\|U-m\|^2\mid I_t=x].
\end{aligned}$$

交叉項為零，因為固定這個條件後，$U-m$ 的平均就是零。第二項不受 $a$ 影響，第一項在 $a=m$ 時最小。所以理想上，模型夠強、訓練到 population objective 的最佳解時，得到的是

[[formula:mean]]

這個期望固定了時間 $t$ 與觀察到的位置，平均的是仍可能產生這個位置的端點所帶來的速度。一般不是每條路等權；連續情況也不是靠數「剛好碰到同一浮點數」的人，而是用 conditional distribution 定義。

> **L2 是實際訓練的方法；conditional mean 是它在理想函數層級的答案。**`],
 ['平均之後，loss 為什麼可能還不是零？',r`
剛才兩種速度都想讓網路跟自己一樣，但網路只輸出平均。所以即使它已經回答得最好，每一筆 label 與答案之間仍可能有差。

下面固定同一個街口，真的用 gradient descent 更新一支可學習的速度向量。把往右的比例從 $0.5$ 改成 $0.8$，觀察最佳速度如何改變；再比較 loss 與 label 本身的分歧。

[[python:u21]]

這是固定 input 的小 regression，讓「模型參數更新」與「平均答案」直接對起來。完整的 $v_\theta(x,t)$ 要對不同 input 都學會回答，我們會在實作篇真的訓練一個小網路。`],
 ['學完之後，怎麼真的走？',r`
從 $p_0$ 抽出起點，再沿 learned field 解 ODE。這裡用 $Y_t$ 記連續時間的生成 trajectory，避免和製造 labels 的 $I_t$ 混在一起：

$$\frac{\mathrm dY_t}{\mathrm dt}=v_\theta(Y_t,t).$$

從 $t$ 走到 $t+h$，精確位移是把沿途的速度累積起來：

$$Y_{t+h}=Y_t+\int_t^{t+h}v_\theta(Y_\tau,\tau)\,\mathrm d\tau.$$

但積分通常沒有 closed form，所以需要 numerical solver，也就是用有限次計算近似這段積分的規則。最簡單的 Euler 方法，用出發時的速度代替整小段：

$$\widehat Y_{k+1}=\widehat Y_k+h\,v_\theta(\widehat Y_k,t_k).$$

$\widehat Y_k$ 是時間 $t_k$ 的有限步近似位置。每一步呼叫一次網路，詢問速度，再從新位置重新問。這樣的一次呼叫稱為一次 **network evaluation**。

現在知道怎麼訓練、也知道怎麼生成了。但每個人都跟著平均方向走，整群人還會以原本的比例到達那幾個捷運站嗎？只知道 L2 的最佳解，還沒有回答這件事。`]
 ],
 bridge:'平均速度不是某一個人的原始路線。要知道它能不能保住整群人的分布，我們得從一條街口的箭頭，改成數一小段走道裡的人。', next:'u22', refs:['fm']
},
{
 id:'u22', number:'U2.2', title:'大家都跟著平均走，最後的人數還對嗎？',
 lead:'一個人的路可以變。每個地方最後有多少人，才是我們想保住的事。',
 objectives:['從固定區域的流入減流出推出 continuity equation。','用條件平均保住 flux 的機制證明 marginal preservation。','區分理想 field 的分布保證、模型誤差與 solver 誤差。'],
 sections:[
 ['左右抵消，人會不會全擠在中間？',r`
在〈不知道終點，怎麼學會往哪裡走？〉，我們看見不同 reference velocities 可以被平均成另一個方向。可是，原本想往不同車站的人都改了方向，最後各站的人數還會對嗎？

[[question:只要平均方向看起來合理，就能說最後的 distribution 正確嗎？|一個位置的一支箭頭，沒有交代沿路的密度如何改變。要保證 distribution，得檢查每個區域的 probability mass 如何流入、流出，而不是只比較單一人的方向。]]

用 $p_t(x)$ 記 reference process $I_t$ 在時間 $t$ 的 density。它描述位置 $x$ 附近有多擠，不是某個人必須站在哪裡。我們想檢查的是：沿平均速度前進的另一群人，是否也會形成同樣的 $p_t$。`],
 ['走得很快，不代表每秒通過很多人',r`
想像一條窄走道。每公尺有 $3$ 人，大家每秒向右走 $2$ 公尺，一個固定截面每秒就通過 $6$ 人。若同樣的速度下每公尺只有 $1$ 人，流量便只有每秒 $2$ 人。

所以要算通過多少，得把 density 與 velocity 相乘。把人數正規化成 probability，就得到 **probability flux**：

$$J_t(x)=p_t(x)v_t(x).$$

一維裡，density 的單位是 probability／公尺，乘上公尺／秒，就得到 probability／秒。多維的 $J_t$ 是向量，穿過邊界的法向分量才是相應流量。

[[figure:flux]]`],
 ['圈住一小段走道，看看多了誰',r`
固定地面上的區間 $[x,x+\Delta x]$，不跟著任何一個人移動。若左邊每秒進來 $6$ 人、右邊出去 $4$ 人，裡面便每秒多 $2$ 人。換成 probability mass，也是同一條守恆規則：

$$\frac{\mathrm d}{\mathrm dt}\int_x^{x+\Delta x}p_t(u)\,\mathrm du
=J_t(x)-J_t(x+\Delta x).$$

左邊問區間內的總質量改變多少，右邊是流入減流出。flux 帶正負號，所以就算向左流，同一個式子也能使用。

兩邊除以 $\Delta x$，再把區間縮小。若 density 與 flux 足夠平滑，右邊成為負的空間導數，得到

$$\partial_t p_t(x)=-\partial_x J_t(x).$$

右端比左端流得多，區間在失去質量，這就是負號的來源。到了多維，把各方向的淨流出加起來，就是 flux 的 divergence：

[[formula:continuity]]

這稱為 **continuity equation**。它把 field 的速度，連到整個 distribution 的變化；要取 divergence 的是 $p_tv_t$，不能只看 $v_t$。`],
 ['平均速度，為什麼沒有把流量平均錯？',r`
先考慮少數幾群人。第 $z$ 群占總人數的比例是 $w_z$，自己的 density 是 $p_t(x\mid z)$，速度是 $u_t(x\mid z)$。混合起來，總 density 是 $p_t(x)=\sum_z w_zp_t(x\mid z)$。

在時間 $t$ 看見位置 $x$ 的人，他來自第 $z$ 群的比例是多少？沒錯！又是使用 Bayes rule 的時候：

$$\Pr(z\mid x,t)=\frac{w_zp_t(x\mid z)}{p_t(x)}.$$

這裡固定的是觀察到的時間與位置，平均時要用這個 posterior 比例。乘上各群速度再相加，就是

$$v_t(x)=\sum_z\frac{w_zp_t(x\mid z)}{p_t(x)}u_t(x\mid z).$$

現在兩邊乘回 $p_t(x)$，便看到真正保住的量：

$$p_t(x)v_t(x)=\sum_z w_zp_t(x\mid z)u_t(x\mid z).$$

**平均後的總 flux，正好等於各群 flux 的加總。** 每群都滿足流入減流出，將它們的 continuity equations 加起來，就得到整群人的 continuity equation。因此 posterior 的權重不能隨便改成等權。

這段用具有平滑 density 的群體幫我們看清機制。固定一組精確端點時，conditional path 可能只是 Dirac measure；那種情況不能直接把它當普通 density 相除，下面用另一種寫法補上。`],
 ['每條 reference path 只是一條細線，也能成立嗎？',r`
我們可以不先替每一條路寫 density。選一個平滑的觀察函數 $\phi$，例如在某個區域附近較大、其他地方較小的函數。$\mathbb E[\phi(I_t)]$ 便是一個描述人群所在位置的觀察量。

先沿 reference process 微分，用 chain rule：

$$\frac{\mathrm d}{\mathrm dt}\mathbb E[\phi(I_t)]
=\mathbb E[\nabla\phi(I_t)\cdot\dot I_t].$$

假設可以交換微分與期望。固定 $I_t$ 後，$\nabla\phi(I_t)$ 已知，所以可以把後面的 reference velocity 換成其條件平均：

$$\begin{aligned}
\mathbb E[\nabla\phi(I_t)\cdot\dot I_t]
&=\mathbb E[\nabla\phi(I_t)\cdot v_t(I_t)].
\end{aligned}$$

這就是 continuity equation 的 weak form。若 $p_t$ 有平滑 density，再做 integration by parts，就會接回剛才的公式。它說的是整個觀察量的變化，不要求每一條 conditional path 都有一般 density。

當 $v_t$ 足夠 regular、ODE 與相應的 transport equation 有唯一解，而且從相同的 $p_0$ 出發時，沿理想 $v_t$ 的生成 marginals 就與 reference process 相同。所以終點是 $p_1$，**但單一人的配對與 trajectory 不必相同**。`],
 ['讓兩群人真的走一次',r`
下面用可直接算出的 Gaussian toy 比較兩件事。reference process 是 $I_t=(1-t)X_0+tX_1$，其中 $X_0\sim\mathcal N(0,1)$、$X_1\sim\mathcal N(2,1)$，兩者獨立。

它的平均是 $2t$，variance 是 $(1-t)^2+t^2$。用 Gaussian conditional mean，可得到 exact field

$$v_t(x)=2+\frac{2t-1}{(1-t)^2+t^2}(x-2t).$$

程式分別抽 reference snapshots、用這個 exact field 做 Euler，再比較同一時間的平均與 variance。增加步數只改善 solver 近似；這裡沒有 neural network 的估計誤差，也沒有拿有限樣本的吻合當作一般定理。

[[python:u22]]

我們現在補上了訓練背後的保證：條件平均保住的是每一時刻的 distribution。真正用 learned $v_\theta$ 與有限步 sampler 時，還要另外算模型誤差與離散化誤差。`]
 ],
 bridge:'這個保證不要求起點是 Gaussian。但如果我們刻意選回 U1 的 Gaussian 起點，前面已經訓練好的 denoiser，會不會其實就能給出這裡要的速度？', next:'u23', refs:['fm']
},
{
 id:'u23', number:'U2.3', title:'已經有 denoiser，還要再學一個 velocity 嗎？',
 lead:'同一個中間狀態，預測 noise 與預測速度，究竟差在哪裡？',
 objectives:['對齊 U1、U2 的時間方向與 signal amplitude。','在相同 probability path 上推導 noise、score 與 velocity 的轉換。','從 deterministic DDIM 的小步極限接回 probability-flow ODE。'],
 sections:[
 ['模型看的是同一個位置嗎？',r`
U1 的 denoiser 看著 noisy image，預測裡面的 noise；U2 的 velocity model 看著中間位置，預測現在該往哪裡走。輸出不同，但如果中間狀態是用同一個方式製造的，兩種答案會不會有關？

這裡先對齊時間：U1 用 $\tau$ 表示從資料走向 noise 的時間，U2 用 $t$ 表示從 noise 走向資料的時間。選同一條 schedule 反向閱讀，例如 $\tau=1-t$，並令 $X_0=\epsilon\sim\mathcal N(0,I)$、$X_1$ 是資料，兩者獨立。

$$I_t=\alpha_tX_1+\sigma_t\epsilon.$$

$\alpha_t$ 是資料的 signal amplitude，對應 U1 的 $\sqrt{\bar\alpha_\tau}$；$\sigma_t$ 是 noise amplitude。這裡的 $\alpha_t$ 不是 U1 單一步的保留率。對 VP path，$\alpha_t^2+\sigma_t^2=1$；noise 端的係數是 $(0,1)$，資料端是 $(1,0)$，理想端點或端點極限需依 schedule 處理。

[[figure:conversion]]`],
 ['知道 noise，能不能反推出資料？',r`
固定看到的位置 $I_t=x$。當 $\alpha_t>0$，這一筆資料與 noise 滿足

$$X_1=\frac{x-\sigma_t\epsilon}{\alpha_t}.$$

位置本身提供了一條關係：只要知道這筆可能用到多少 noise，就能換算對應的資料。另一方面，reference velocity 是對同一條 path 微分：$\dot I_t=\dot\alpha_tX_1+\dot\sigma_t\epsilon$。

把剛才的 $X_1$ 代回去，再把位置項與 noise 項分開：

$$\dot I_t=\frac{\dot\alpha_t}{\alpha_t}x+
\left(\dot\sigma_t-\frac{\dot\alpha_t}{\alpha_t}\sigma_t\right)\epsilon.$$

現在固定的仍是 $I_t=x$，未知的是可能的資料與 noise。對它們的 conditional distribution 取平均，就得到

[[formula:conversion]]

這個式子裡，位置項與係數都已知，剩下的只有平均 noise。U1 在對應 noise level 上訓練的 $\epsilon_\theta$，估計的正是這個 conditional mean。於是把它代入，便得到 $v_\theta$，不必再訓練另一個網路。`],
 ['那 score 又是從哪裡出來的？',r`
U1 已經推過 Gaussian denoising 的 Tweedie 公式。在這條相同的 path、$\sigma_t>0$ 時，它寫成

$$\mathbb E[\epsilon\mid I_t=x]=-\sigma_t\nabla_x\log p_t(x).$$

左邊是固定 noisy state 後相容的 noise 平均，右邊是當下 density 上升的局部方向乘上尺度。把它代進 velocity 公式，就能用 score 表示同一個 field。

所以在這個設定裡，noise、score 與 velocity 的理想答案，可以從同一組 conditional means 互相換算。模型近似時則要帶著轉換係數看誤差；例如很小的 $\alpha_t$ 出現在分母，不能把 noise 誤差大小原封不動當成 velocity 誤差。`],
 ['把 DDIM 的一步縮小，會出現什麼？',r`
我們已經能從 denoiser 換出 velocity，但它真的是 DDIM 背後的 dynamics 嗎？回到 U1 的時間方向，記資料振幅為 $\sqrt{\bar\alpha_\tau}$。deterministic DDIM 先用目前 state 得到 $\widehat x_0$ 與 $\epsilon_\theta$，再用它們重建較低 noise 的時刻 $s<\tau$：

$$x_s=\sqrt{\bar\alpha_s}\,\widehat x_0+
\sigma_s\epsilon_\theta.$$

這一步中，兩個 predictions 都在目前 $(x_\tau,\tau)$ 計算；而 $x_\tau=\sqrt{\bar\alpha_\tau}\widehat x_0+\sigma_\tau\epsilon_\theta$。把它們相減，再除以 $s-\tau$：

$$\begin{aligned}
\frac{x_s-x_\tau}{s-\tau}
&=\frac{\sqrt{\bar\alpha_s}-\sqrt{\bar\alpha_\tau}}{s-\tau}\widehat x_0\\
&\quad+\frac{\sigma_s-\sigma_\tau}{s-\tau}\epsilon_\theta.
\end{aligned}$$

讓 $s\to\tau$，係數的差商變成時間導數。再代入 $\widehat x_0=(x_\tau-\sigma_\tau\epsilon_\theta)/\sqrt{\bar\alpha_\tau}$，得到的就是同一個 velocity 換算，只是時間方向反過來了。

若 VP schedule 滿足 $\dot{\bar\alpha}_\tau=-\beta(\tau)\bar\alpha_\tau$，則 $\partial_\tau\log\sqrt{\bar\alpha_\tau}=-\beta/2$。又因為 $\sigma_\tau^2=1-\bar\alpha_\tau$，有 $2\sigma_\tau\dot\sigma_\tau=\beta\bar\alpha_\tau$。把這兩個關係與 Tweedie 代回，score 係數便是

$$-\sigma_\tau\left(\dot\sigma_\tau+\frac\beta2\sigma_\tau\right)=-\frac\beta2.$$

因此理想 denoiser 下，連續極限是

$$\frac{\mathrm dx_\tau}{\mathrm d\tau}
=-\frac12\beta(\tau)x_\tau
-\frac12\beta(\tau)\nabla_x\log p_\tau(x_\tau).$$

這就是 probability-flow ODE。生成時沿 $\tau$ 由大往小積分。有限步 DDIM 與另一個 ODE solver，仍可能因離散規則不同而得到不同結果。`],
 ['既然能換，能不能順便換一條比較簡單的路？',r`
[[question:把 VP denoiser 的係數改成直線的係數，就能沿 linear path 生成嗎？|不行。換 path 會改變中間的 distribution，也會改變固定 input 後相容的 noise。模型原本學的是 VP path 的 conditional mean，不能只改係數就當成另一條 path 的答案。]]

這很像你在原本的街口學會參考人潮，卻被放到另一張人群配置不同的地圖上。公式還能寫，但需要參考的那群人已經變了。

下面使用已知兩個 Gaussian 端點的 exact posterior，不是假裝載入訓練好的模型。把同一個 posterior noise mean 換成 velocity，再和直接計算的速度比較；另外刻意使用錯誤 path 的 posterior，看差異出現在哪裡。

[[python:u23]]`],
 ['Flow Matching 多出的設計空間在哪裡？',r`
DDIM 已經讓我們看到一條 deterministic flow。Flow Matching 讓我們更直接地設計起點、reference path，以及端點如何配對，再從這些設計製造 velocity labels。

| 想改什麼 | 會連帶改變什麼 |
| --- | --- |
| 只換同一路徑的輸出表示 | 用相同 $p_t$ 的 conditional means 換算 noise／score／velocity |
| 換 reference path 或配對 | 中間的 $p_t$ 與理想 field，通常都需要重新學 |
| 只換 numerical solver | 近似同一條 learned ODE 的方式與成本 |

這些自由不保證任何一條路都比較容易學、比較少步。要比較，就得先把「路怎麼設計」與「生成時怎麼走」分開寫清楚。`]
 ],
 bridge:'前面一直先抽端點，再畫路。現在我們把抽端點的規則也寫成數學，看看同樣的兩端為什麼會有不同的中途，以及這些選擇如何連到 ODE、SDE 與誤差。', next:'u24', refs:['ddim','score','fm']
},
{
 id:'u24', number:'U2.4', title:'兩端都一樣，中途為什麼能差這麼多？',
 lead:'先決定要經過哪些分布，再問怎麼走、學不準時又差多少。',
 objectives:['用 coupling、reference path 與額外 Gaussian 定義 stochastic interpolant。','推導 velocity／score regression，及保住同一 marginal path 的 ODE／SDE。','在明確假設下，連起 regression error 與終點的 Wasserstein／KL 上界。'],
 sections:[
 ['同樣的人與車站，還能改什麼？',r`
散場開始時的人群固定，最後每個車站的人數也固定。這樣整個搬運就決定了嗎？還沒有。站在象山附近的人可以被配到象山，也可以被配到市政府；只要最後各站總人數不變，兩端看到的 distribution 都一樣。

所以我們得寫出「誰與誰配成一組」的規則。用 $\pi$ 記 $(X_0,X_1)$ 的 joint distribution，並要求它的兩個 marginals 分別是 $p_0,p_1$：

$$ (X_0,X_1)\sim\pi. $$

這樣的 joint distribution 叫 **coupling**。兩端獨立抽樣時，$\pi(x_0,x_1)=p_0(x_0)p_1(x_1)$；也可以用其他保住兩端 marginals 的配對。

[[figure:coupling]]

配對之後再放進 reference path：$I_t=I_t(X_0,X_1)$。固定端點時，它是一條路；端點也隨機抽出後，整體便是一個 random process。每個時刻的快照是 $p_t=\operatorname{Law}(I_t)$，其中 Law 表示隨機變數的 distribution。

Albergo 與 Vanden-Eijnden、以及 Albergo、Boffi 與 Vanden-Eijnden 發展的 **stochastic interpolant** 架構，便把這樣的中途 construction 與生成 dynamics 接在一起。這裡不是把 reference path 與 ODE trajectory 改成同一個名字；生成時仍然是另一個 process。`],
 ['如果所有人中途擠在一起呢？',r`
例如起點與終點都是同一個圓環，卻把每個點配到對面。每一組端點都走直線，$t=1/2$ 時便全部擠進圓心。兩端完全正常，中途卻塌成一個點。

一個自然的嘗試是：保留兩端，讓中途的 training points 有一點寬度。用 $Z\sim\mathcal N(0,I)$ 表示與端點獨立、每筆資料另外抽出的 Gaussian，改成

[[formula:interpolant]]

這裡 $\sigma_0=1,\alpha_0=0$，$\sigma_1=0,\alpha_1=1$，而 $\gamma_0=\gamma_1=0$，所以起終點不變。$Z$ 每筆 reference sample 抽一次，沿這筆 reference process 使用同一個 $Z$，不是每小步重抽。

在內部時間 $\gamma_t>0$ 時，中間 law 等於原本的 law 與 Gaussian 的 convolution：$p_t^{(\gamma)}=p_t^{(0)}*\mathcal N(0,\gamma_t^2I)$。這正是 Gaussian smoothing：每個原位置周圍都散開一小團。

它讓 density 在內部時間變平滑，但也改了中間的 $p_t$ 與速度 targets。**不能因此說 ODE trajectories 必定更直，或 noise 越多一定越好。** 端點附近的 regularity 也要另外檢查。`],
 ['多了一個 Gaussian，速度要怎麼學？',r`
同一筆端點與 $Z$ 都已知，對時間微分即可製造 label：

$$\dot I_t=\dot\sigma_tX_0+\dot\alpha_tX_1+\dot\gamma_tZ.$$

做法仍然是抽端點、抽 $Z$、抽時間，讓模型以 $(I_t,t)$ 預測這個 label。沿用 U2.1 的平方誤差與條件平均，就得到

$$v_t(x)=\mathbb E[\dot I_t\mid I_t=x].$$

平均的現在是相容的 $(X_0,X_1,Z)$；固定的仍是此時、此地。U2.2 的守恆證明沒有改，所以理想 field 仍可用 ODE 生成同一條 $p_t$。

注意這裡學到的 field 是新的 interpolant 所對應的答案。不能把沒有 $\gamma_tZ$ 時的模型直接拿來代替。`],
 ['原本兩端都不是 Gaussian，也能拿到 score 嗎？',r`
在 U2.3，我們靠 Gaussian 起點的 noise mean 換出 score。但現在兩端可以是任意資料，未必有那個 Gaussian 可以用。剛才額外加入的 $Z$，反而給了我們一個已知的 Gaussian label。

固定端點，記它們決定的中心為 $\sigma_tX_0+\alpha_tX_1$。中途是以這個中心、variance $\gamma_t^2I$ 的 Gaussian，所以其 conditional score 是

$$\nabla_x\log p_t(x\mid X_0,X_1)=-\frac{Z}{\gamma_t}.$$

這個式子在相應 sample 滿足 $x=I_t$、且 $\gamma_t>0$ 時使用。把 conditional score 對端點 posterior 平均，也就是 U1 的 Tweedie 機制，得到

$$s_t(x):=\nabla_x\log p_t(x)=-\frac{1}{\gamma_t}\mathbb E[Z\mid I_t=x].$$

因此另做 $\mathbb E\|\eta_\theta(I_t,t)-Z\|^2$ 的 regression，理想解就能給出 score。這不是從 score 自動得到 velocity；一般端點下，速度還包含端點如何隨時間交接的資訊。

若起點本來就是獨立 Gaussian，U2.3 已經能取得 score，不一定需要再放入 $Z$。我們這裡補上的是對任意端點 construction 也能使用的入口。`],
 ['知道同一條分布，能不能換一種走法？',r`
現在有 $v_t$ 與 $s_t$。ODE 用 $\mathrm dY_t=v_t(Y_t)\,\mathrm dt$ 走。如果想讓樣本途中有隨機移動，能不能直接加 Brownian noise？

[[question:在原本的 ODE 後面直接加 noise，還會經過相同的 marginals 嗎？|一般不會。Brownian motion 會讓 density 擴散，必須同時修改 drift，才可能抵消多出來的 density 變化。只說「加 noise」還沒有定義一個保住分布的 sampler。]]

用 $\varepsilon>0$ 控制 sampling 時的 noise 強度，考慮

$$\begin{aligned}
\mathrm dY_t&=[v_t(Y_t)+\varepsilon s_t(Y_t)]\,\mathrm dt\\
&\quad+\sqrt{2\varepsilon}\,\mathrm dW_t.
\end{aligned}$$

$W_t$ 是 Brownian motion，它在每段時間提供新且獨立的增量。前面的 $\gamma_tZ$ 用來設計 training reference process；這裡的 Brownian increments 用來定義生成 dynamics，兩者不能混在一起。

為什麼額外加 $\varepsilon s_t$？這條 SDE 對 density 的 Fokker–Planck equation 是

$$\partial_t p_t=-\nabla\cdot[(v_t+\varepsilon s_t)p_t]+\varepsilon\Delta p_t.$$

第一項是 drift 搬運，第二項是 Brownian 擴散。因為 $s_tp_t=\nabla p_t$，新增 drift 造成的 $-\varepsilon\Delta p_t$，恰好抵消 Brownian 的 $+\varepsilon\Delta p_t$。剩下的仍是 $\partial_t p_t=-\nabla\cdot(p_tv_t)$。

在 fields 精確、連續 dynamics well-posed 且由相同 $p_0$ 出發的條件下，ODE 與這條 SDE 因此共享 marginals。軌跡、跨時間的 joint distribution 與有限步誤差，並沒有因此相同。

<details><summary>Fokker–Planck 的擴散項怎麼出來？</summary>

對 smooth $\phi$，Itô's lemma 給出 $\frac{\mathrm d}{\mathrm dt}\mathbb E[\phi(Y_t)]=\mathbb E[\nabla\phi\cdot(v_t+\varepsilon s_t)+\varepsilon\Delta\phi]$。把期望寫成積分，再把導數用 integration by parts 移到 density，便得到剛才的 Fokker–Planck equation。這一步需要相應 integrability 與邊界項消失的條件。

</details>

如果只固定一個 $\varepsilon$，也可以直接對 $\dot I_t-\varepsilon Z/\gamma_t$ 做 regression，學總 drift；只有想切換不同 noise 強度或分開分析兩種誤差時，才需要分別取得 velocity 與 score。$\gamma_t=0$ 的端點不能直接使用含 $1/\gamma_t$ 的公式。`],
 ['模型差一點，最後會差多少？',r`
前面講的是理想 field。實際拿到的是 $v_\theta$，所以我們現在要比較：從同一個起點出發，一個人照正確的 $v_t$ 走，另一個人照 $v_\theta$ 走，兩人會分開多遠？

先定義沿 reference marginals 加權的 velocity error：

$$\mathcal E_v=\int_0^1\mathbb E_{I_t\sim p_t}
[\|v_\theta(I_t,t)-v_t(I_t)\|^2]\,\mathrm dt.$$

時間積分表示考慮整段搬運，期望則考慮每個時間下可能的位置。由 L2 的分解，這是均勻時間的 population CFM loss 超過理想最小值的部分，並不是含 label variance 的整個 training loss。

假設 learned $v_\theta(\cdot,t)$ 對位置是統一的 $L$-Lipschitz，也就是 input 相差 $d$，output 最多相差 $Ld$。令 $Y_t,\widehat Y_t$ 分別是精確解的兩條 ODE，距離為 $e_t$；把速度差拆成「位置不同」與「field 不同」，便有

$$\dot e_t\le Le_t+\|v_\theta(Y_t,t)-v_t(Y_t)\|.$$

第一項控制舊誤差如何放大，第二項是當下新添的模型誤差。因為同一起點有 $e_0=0$，用積分形式的 Grönwall inequality 累積後，得到

$$e_1\le\int_0^1e^{L(1-t)}\|v_\theta(Y_t,t)-v_t(Y_t)\|\,\mathrm dt.$$

把 exponential 上界成 $e^L$，再用 Cauchy–Schwarz 對長度為 $1$ 的時間區間平方，最後對起點取平均：

$$\mathbb E[e_1^2]\le e^{2L}\mathcal E_v.$$

我們用同一起點配出的兩個終點，本身是一個合法 coupling。$W_2^2$ 是所有 couplings 中最小的平均平方距離，所以

$$W_2^2(p_1,\widehat p_1)\le e^{2L}\mathcal E_v.$$

這個 elementary stability bound 說明了 Wasserstein error control 的機制，與 Flow Matching 誤差分析的方向一致。它需要有限二次矩、相應的 ODE regularity 與可積分誤差；不是拿一個有限 training batch 的 loss 直接替換右邊，就能得到實際品質保證。這裡也還沒有加入 solver 的離散化誤差。`],
 ['SDE 為什麼又會出現 KL？',r`
Wasserstein 比較的是搬運距離；KL 比較的是 density ratio，它們不是同一個量。對一維 Gaussian 而言，$\mathrm{KL}(\mathcal N(m,q)\|\mathcal N(\widehat m,\widehat q))$ 同時受平均位移與 variance 的相對大小影響，位置靠近不會自動涵蓋所有 density 差異。

對相同 noise 強度的兩條 SDE，令正確 drift 為 $b_t=v_t+\varepsilon s_t$、近似 drift 為 $\widehat b_t$，並定義 $\Delta b_t=\widehat b_t-b_t$。用 $\delta_t=\nabla\log\widehat p_t-\nabla\log p_t$ 記兩個 density 的 log-gradient 差。

在 density 正、足夠平滑、邊界項消失，且相關積分有限等條件下，對兩條 Fokker–Planck equations 做 integration by parts，得到

$$\frac{\mathrm d}{\mathrm dt}\mathrm{KL}(p_t\|\widehat p_t)
=\mathbb E_{p_t}[\delta_t\cdot\Delta b_t]-\varepsilon\mathbb E_{p_t}\|\delta_t\|^2.$$

這裡 KL 的方向是正確分布對近似分布。差別就在最後的負項：擴散提供了一個可以吸收交叉項的平方。

<details><summary>這個 KL 導數用了哪些動作？</summary>

寫 $h_t=\log(p_t/\widehat p_t)$，先微分 $\int p_th_t$，用 probability mass 守恆消去 $\int\partial_t p_t$。代入兩條 Fokker–Planck equations 並分部積分，drift 留下 $\mathbb E_{p_t}[(b_t-\widehat b_t)\cdot\nabla h_t]$，diffusion 留下 $-\varepsilon\mathbb E_{p_t}\|\nabla h_t\|^2$。因為 $\nabla h_t=-\delta_t$，便得到正文的符號與方向。

</details>

用配方不等式 $a\cdot d-\varepsilon\|a\|^2\le\|d\|^2/(4\varepsilon)$，再從相同初始分布積分到終點：

$$\mathrm{KL}(p_1\|\widehat p_1)
\le\frac{1}{4\varepsilon}\int_0^1\mathbb E_{p_t}\|\Delta b_t\|^2\,\mathrm dt.$$

若 $\widehat b_t=v_\theta+\varepsilon s_\theta$，用 $\|a+b\|^2\le2\|a\|^2+2\|b\|^2$，並像 $\mathcal E_v$ 一樣定義 score error $\mathcal E_s$，便得到

$$\mathrm{KL}(p_1\|\widehat p_1)
\le\frac{\mathcal E_v}{2\varepsilon}+\frac{\varepsilon\mathcal E_s}{2}.$$

這個式子控制的是精確連續 SDE 的模型誤差。在兩端或 $\gamma_t\to0$ 有 singularity 時，還需要端點極限與 integrability 條件；不能略過它們就宣稱任意 schedule 都有有限 KL。ODE 的推導沒有這個擴散負項，也不能直接照搬同一條 KL bound。`],
 ['把兩種 randomness 分開跑看看',r`
下面固定兩端為 $\mathcal N(0,1)$ 與 $\mathcal N(2,1)$，兩端獨立；reference construction 使用 $\gamma_t=g\sin(\pi t)$。因此中間平均是 $2t$，variance 是

$$q_t=(1-t)^2+t^2+g^2\sin^2(\pi t).$$

exact velocity 是 $2+\dot q_t(x-2t)/(2q_t)$，score 是 $-(x-2t)/q_t$。這個 toy 的 variance 在兩端也正，避免了剛才提到的 singular endpoint 問題。

先改 $g$，看 reference 快照的 variance；再固定 $g$ 改 $\varepsilon$，比較 ODE 與補償後 SDE 的終點統計。它們連續時間的理想 marginals 相同，但有限步 Euler／Euler–Maruyama 和 Monte Carlo 估計仍有誤差。程式也提供「只加 noise、不補 score」的對照。

[[python:u24]]

所以我們現在能把兩個動作分開：$\gamma_t$ 改 reference process 與中間 $p_t$；$\varepsilon$ 在理想 field 下改生成走法。兩者都可能改變實作難度，但不能用同一句「加 noise 有幫助」概括。`]
 ],
 bridge:'理論已經把 construction、訓練與生成接起來。接下來真的訓練一個小網路，分開觀察 loss、field error 與有限步生成；看看哪一個變好了，哪一個卻沒有跟著保證。', next:'lab', refs:['si','fm','bounds']
},
{
 id:'lab', number:'U2 實作', title:'Loss 降了，生成的分布就會跟著對嗎？',
 lead:'自己造 labels、更新一個小網路，再把模型誤差與走法的誤差分開看。',
 objectives:['實際訓練一個以位置、時間預測速度的小 MLP。','用相同 field 與相同起點比較 Euler／Heun 的計算預算。','以 exact Gaussian toy 分開衡量模型誤差、有限步偏差與抽樣統計。'],
 sections:[
 ['先選一個拿得到標準答案的世界',r`
我們已經有了許多理想公式，但真的訓練之後，最容易混在一起的是三件事：labels 本身有分歧、模型沒有學準、solver 沒有走準。

為了看清楚它們，我們先在一維的淺水區練習。起點選 $X_0\sim\mathcal N(0,1)$，終點選 $X_1\sim\mathcal N(2,1)$，獨立配對；reference path 仍是 $I_t=(1-t)X_0+tX_1$。這正是 U2.2 已經看過的 toy。

它的平均 $m_t=2t$、variance $q_t=(1-t)^2+t^2$ 都已知，exact field 也能直接算。所以我們能比較模型究竟差在哪裡，而不只看 loss 有沒有下降。

[[figure:lab]]`],
 ['把那幾行 training loop 真的做完',r`
每一筆先抽端點，再抽時間，算出 input 與 label。下面的程式真的建立一個兩個 input、單層 tanh hidden layer、單一 velocity output 的 MLP，用反向傳播更新所有權重；不把 exact posterior 當作模型輸出。

$$\begin{aligned}
(x_0,x_1,t)&\longrightarrow I_t=(1-t)x_0+tx_1,\\
(I_t,t)&\longrightarrow v_\theta(I_t,t),\\
\text{label}&=x_1-x_0.
\end{aligned}$$

更新的是模型參數 $\theta$，梯度來自 velocity 平方誤差。生成時不再提供 $x_1$，只抽 $x_0$，反覆把目前位置與時間送進模型。

[[formula:labupdate]]

先記下你的猜測：如果 training steps 增加，training label MSE、held-out field MSE、終點平均與標準差，哪幾個會比較接近理想值？它們會不會每次都同時改善？

[[python:lab]]

這裡固定 seed 方便比較。它是一個小型教學模型，並沒有因為 toy 簡單就保證有限步 SGD 找到最佳解。曲線與數字都是當次訓練算出的結果。`],
 ['Loss 不到零，是 bug 嗎？',r`
[[question:模型已經學到平均速度，CFM training loss 是不是應該降到零？|不一定。同一 input 可能對應不同 reference velocities。把 prediction 寫成 conditional mean 加上偏差，交叉項的條件平均為零，label MSE 就分成 field MSE 與不可由單一答案消除的 conditional variance。]]

在我們的獨立 Gaussian toy 裡，$U=X_1-X_0$ 的 variance 是 $2$，而 $\operatorname{Cov}(U,I_t)=2t-1$。因此固定 $I_t$ 後，label variance 是

$$\operatorname{Var}(U\mid I_t)=2-\frac{(2t-1)^2}{(1-t)^2+t^2}.$$

這來自 Gaussian conditional variance 公式。它在 $t=1/2$ 等於 $2$，所以即使 field 完全正確，這附近的 labels 仍有很大的分歧。

程式在獨立 validation pairs 上同時印出 label MSE、field MSE 與 conditional variance 的平均。有限樣本下分解會有 Monte Carlo 差異；如果只盯著 training label MSE，就容易把 label 的分歧誤認成模型永遠學不好。`],
 ['每步多問一次，會差在哪裡？',r`
Euler 問一次起點速度，就把它用滿整小段。那如果途中方向或速度變了，能不能再問一次？真正終點尚未知，我們可以先用 Euler 猜一個位置，再查那裡的速度。

$$\begin{aligned}
k_1&=v_\theta(\widehat Y_k,t_k),\\
\widetilde Y_{k+1}&=\widehat Y_k+h k_1,\\
k_2&=v_\theta(\widetilde Y_{k+1},t_k+h),\\
\widehat Y_{k+1}&=\widehat Y_k+\tfrac h2(k_1+k_2).
\end{aligned}$$

這是 Heun：先預測，再把前後兩次速度平均。它每步呼叫兩次模型，所以比較 $N$ 步 Euler 與 $N$ 步 Heun，其實花了不同的計算量。下面固定總 network evaluations：Euler 用 $B$ 步，Heun 用 $B/2$ 步。

[[python:solver]]

這裡用 exact field，把模型誤差先拿掉；對同一批起點比較有限步終點與 exact 終點 $Y_1=Y_0+2$ 的距離。這個 Gaussian toy 的連續 trajectory 雖然在一維、沒有幾何轉彎，速度仍會先壓縮再展開，因此照樣有離散化誤差。高階方法的優勢也需要合適步長與平滑條件，不能由一次大步比較就推成一般定律。`],
 ['把 U1 的 denoiser 接進來時，要對哪些東西？',r`
如果要延伸到原本的 two-moons、PyTorch MLP 或影像 model，training loop 的順序一樣：抽端點、算 reference input 與 label、做 regression。可以把資料換成多維 tensor，但時間係數要能 broadcast 到每個樣本的所有維度。

若沿用 U1 的 VP denoiser，則要保留它訓練時的 schedule，先把 U2 的 $t$ 對回 U1 的 $\tau$，再代入 U2.3 的轉換。比較 deterministic DDIM 與 ODE sampler 時，也得用相同起點與對應的 noise levels。

我們可以改 solver 來比較離散規則；換成 uniform 起點、換 linear path 或換 coupling，則要重新製造 training pairs、重新學相應的 field。這樣才能知道實驗是在比較哪一個設計。

<details><summary>PyTorch 版本的最小訓練與生成入口</summary>

這段是移植到已安裝 PyTorch 的環境用的介面範例。上面的瀏覽器實驗執行的是純 Python MLP。

~~~python
# model(x, t) must return the same shape as x.
for _ in range(training_steps):
    x0 = sample_source(batch)
    x1 = sample_target(batch)
    t = torch.rand(batch, 1, device=x0.device)
    xt = (1 - t) * x0 + t * x1
    prediction = model(xt, t)
    loss = (prediction - (x1 - x0)).square().sum(dim=1).mean()
    opt.zero_grad()
    loss.backward()
    opt.step()

with torch.no_grad():
    x = sample_source(batch)
    h = 1 / sampling_steps
    for k in range(sampling_steps):
        t = torch.full((batch, 1), k * h, device=x.device)
        x = x + h * model(x, t)
~~~

這裡假設 x 是 batch × dimension。若換成影像，t 要 reshape 成 batch × 1 × 1 × 1，loss 則對所有非 batch 維度取平方和；模型的 t 介面也要同步對齊。

</details>`],
 ['接下來改什麼，實驗才回答得出來？',r`
先固定模型、seed 與 training budget，只把起點換成 uniform，重新訓練。再固定兩端，只改配對，看看 reference paths 與學出的 field 怎麼變。每次只改一個設計，才比較知道結果從哪裡來。

如果要看 solver，先固定 exact field 與起點，像剛才一樣比較相同計算預算。若改用 learned field，也要把它與高精度積分的同一條 learned ODE 比較，才能把 solver error 與模型偏差分開。

我們已經用實驗接起了 U2 的整條主線：設計 reference process、製造 labels、用 regression 學平均速度，再透過 ODE 生成。還剩下一個很容易誤會的問題：**training 的 reference paths 都是直線，生成時的 trajectory 也會是直線嗎？**

同一位置可能平均不同方向，而且相容的方向沿路會變。U3 便從這個缺口開始，量出沿 trajectory 的 velocity 變化，研究少走幾步時究竟漏掉了什麼。`]
 ],
 bridge:'U2 得到的是能學、能走、也能分析誤差的搬運方法。接下來的問題是效率：reference path 很簡單，為什麼生成時還可能需要反覆問很多次方向？這就是 U3 的起點。', next:null, refs:['fm','ddim','si']
}
];

export const references = {
fm:['Lipman 等人，Flow Matching for Generative Modeling（ICLR 2023）','https://arxiv.org/abs/2210.02747'],
ddim:['Song、Meng 與 Ermon，Denoising Diffusion Implicit Models（ICLR 2021）','https://arxiv.org/abs/2010.02502'],
score:['Song 等人，Score-Based Generative Modeling through SDEs（ICLR 2021）','https://arxiv.org/abs/2011.13456'],
si:['Albergo、Boffi 與 Vanden-Eijnden，Stochastic Interpolants（2023）','https://arxiv.org/abs/2303.08797'],
bounds:['Benton、Deligiannidis 與 Doucet，Error Bounds for Flow Matching Methods（TMLR 2024）','https://arxiv.org/abs/2305.16860']
};

export const formulas = {
motion:{title:'把「現在往哪裡走」寫成位置變化',formula:r`\reveal{3}{\frac{\mathrm d\reveal{1}{x_t}}{\mathrm dt}=}\reveal{2}{v_t(\reveal{1}{x_t})}`,stages:[
 [r`x_t`,'先記下這粒沙在時間 t 的位置。'],
 [r`v_t(x_t)`,'在同一個時間、同一個位置，詢問方向與速度。'],
 [r`\frac{\mathrm dx_t}{\mathrm dt}=v_t(x_t)`,'讓位置的瞬間變化率等於剛才的速度，才得到一條動態規則。']]},
loss:{title:'讓速度 labels 變成可以訓練的 objective',formula:r`\begin{gathered}\reveal{5}{\mathcal L_{\mathrm{CFM}}(\theta)=}\\\reveal{5}{\mathbb E_{t,(X_0,X_1)}\big[}\reveal{4}{\big\|}\reveal{2}{v_\theta}\reveal{1}{(I_t,t)}\reveal{3}{-\dot I_t}\reveal{4}{\big\|^2}\reveal{5}{\big]}\end{gathered}`,stages:[
 [r`(I_t,t)`,'先抽出端點與時間，算出模型真正看得到的 input。'],
 [r`v_\theta(I_t,t)`,'模型在這個 input 回答一個速度。'],
 [r`v_\theta(I_t,t)-\dot I_t`,'同一次抽樣給出 reference velocity，拿它當 label 比較。'],
 [r`\|v_\theta(I_t,t)-\dot I_t\|^2`,'用速度差的平方長度，衡量這筆資料的誤差。'],
 [r`\begin{gathered}\mathcal L_{\mathrm{CFM}}(\theta)=\\\mathbb E_{t,(X_0,X_1)}[\|v_\theta(I_t,t)-\dot I_t\|^2]\end{gathered}`,'再對抽樣機制能產生的時間、端點與 labels 取平均。']]},
mean:{title:'站在同一個街口，該參考誰？',formula:r`\reveal{3}{v_t(x)=\mathbb E\big[}\reveal{2}{\dot I_t\mid}\reveal{1}{I_t=x}\reveal{3}{\big]}`,stages:[
 [r`I_t=x`,'先固定時間 t 與已觀察到的位置。'],
 [r`\dot I_t\mid I_t=x`,'只考慮能相容於這個 input 的 reference velocities。'],
 [r`v_t(x)=\mathbb E[\dot I_t\mid I_t=x]`,'依這個條件下的可能性平均，得到理想 L2 解。']]},
continuity:{title:'從流量接回當地密度',formula:r`\reveal{3}{\partial_t p_t+}\reveal{2}{\nabla\cdot(\reveal{1}{p_tv_t})}\reveal{3}{=0}`,stages:[
 [r`p_t(x)v_t(x)`,'先算這裡的 density 乘上 velocity，得到 probability flux。'],
 [r`\nabla\cdot(p_tv_t)`,'把各方向的淨流出加總。'],
 [r`\partial_t p_t+\nabla\cdot(p_tv_t)=0`,'淨流出需要由當地質量下降補上，這就是守恆。']]},
conversion:{title:'用已有的 noise mean 換算速度',formula:r`\begin{aligned}\reveal{3}{v_t(x)}&\reveal{3}{=}\reveal{2}{\frac{\dot\alpha_t}{\alpha_t}x}\\&\reveal{3}{\quad+\left(\dot\sigma_t-\frac{\dot\alpha_t\sigma_t}{\alpha_t}\right)}\reveal{1}{\mathbb E[\epsilon\mid I_t=x]}\end{aligned}`,stages:[
 [r`\mathbb E[\epsilon\mid I_t=x]`,'手上的 denoiser 估計同一路徑、同一位置的平均 noise。'],
 [r`\frac{\dot\alpha_t}{\alpha_t}x`,'代入端點關係後，位置本身提供一個已知項。'],
 [r`\begin{aligned}v_t(x)&=\frac{\dot\alpha_t}{\alpha_t}x\\&\quad+\left(\dot\sigma_t-\frac{\dot\alpha_t\sigma_t}{\alpha_t}\right)\mathbb E[\epsilon\mid I_t=x]\end{aligned}`,'沿同一條 schedule 把兩項加起來；在 αₜ > 0 的時間使用。']]},
interpolant:{title:'先配對、畫路，再替中途加上寬度',formula:r`\begin{gathered}\reveal{1}{(X_0,X_1)\sim\pi,}\\\reveal{3}{Z\sim\mathcal N(0,I),\quad Z\perp(X_0,X_1),}\\\reveal{2}{I_t=\sigma_tX_0+\alpha_tX_1}\reveal{3}{+\gamma_tZ}\end{gathered}`,stages:[
 [r`(X_0,X_1)\sim\pi`,'先由 coupling 決定哪些端點會一起出現。'],
 [r`I_t=\sigma_tX_0+\alpha_tX_1`,'用同一組端點算 reference path 的中途位置。'],
 [r`\begin{gathered}Z\sim\mathcal N(0,I),\quad Z\perp(X_0,X_1),\\I_t=\sigma_tX_0+\alpha_tX_1+\gamma_tZ\end{gathered}`,'獨立抽一次 Z，讓中途有寬度；γ₀ = γ₁ = 0 保留兩端。']]},
labupdate:{title:'一次訓練，到底更新什麼？',formula:r`\begin{gathered}\reveal{1}{\ell(\theta)=\|v_\theta(I_t,t)-(X_1-X_0)\|^2}\\\reveal{3}{\theta\leftarrow\theta-\eta}\reveal{2}{\nabla_\theta\ell(\theta)}\end{gathered}`,stages:[
 [r`\ell(\theta)=\|v_\theta(I_t,t)-(X_1-X_0)\|^2`,'先以這組端點的 reference velocity 比較預測。'],
 [r`\nabla_\theta\ell(\theta)`,'對模型參數微分，計算哪些權重改變能降低誤差。'],
 [r`\theta\leftarrow\theta-\eta\nabla_\theta\ell(\theta)`,'用 learning rate η 更新權重。生成時固定這些權重，改的是樣本位置。']]}
};

export const quizzes = {
u20:[['任意選一個 velocity field，就會抵達指定 p₁ 嗎？',['會，只要把步長切得夠小。','不會，field 本身得實現正確的搬運。','會，只要起點是 Gaussian。'],1,'縮小步長能改善積分近似，不能把錯誤的搬運規則變成正確的 field。'],['照片分布搬到卡通分布，是否已保證每張照片保留身分？',['已保證，因為終點合理。','已保證，因為路徑連續。','尚未保證，還要把個別對應要求放進設計。'],2,'Marginal correctness 約束的是整群分布，沒有指定每個人的終點。'],['flow ODE 右邊提供的是什麼？',['此時、此地的速度。','完整終點圖片。','當地 probability density。'],0,'把每個時間的位置變化率接起來，才得到完整 trajectory。']],
u21:[['相同 (x,t) 的速度 labels 衝突，理想 L2 解是什麼？',['隨機挑一條路。','用相容 labels 的 conditional mean。','永遠選最大速度。'],1,'權重由固定 input 後的 conditional distribution 決定。'],['Simulation-free training 省掉哪一步？',['生成時呼叫網路。','所有模型訓練。','先解 ODE 才能製造 training pairs。'],2,'生成時仍需要積分；模型也仍需要更新參數。'],['模型為何不能在生成時直接使用 X₁ − X₀？',['生成時不知道對應的終點 X₁。','直線不能微分。','速度一定必須是隨機的。'],0,'訓練時知道的 label construction，不等於生成時可用的資訊。']],
u22:[['描述固定位置 density 變化，要取誰的 divergence？',['只有 v。','p 乘上 v。','終點 X₁。'],1,'流量同時取決於多少質量與移動速度。'],['保住 marginals，是否代表重走原配對？',['是，連中途每個人都相同。','是，因為平均不改任何路。','否，trajectory 與跨時間 joint 可以不同。'],2,'Continuity equation 約束每時刻分布，沒有固定個別配對。'],['為什麼用 posterior 而非等權平均？',['在此時此地，各群出現比例一般不同。','這能讓每條路不再交叉。','只是為了把公式寫短。'],0,'p v 等於各群 flux 的加總，依賴這個正確權重。']],
u23:[['不重訓做 noise → velocity 轉換，必須保留什麼？',['同一種 solver。','相同 path 與對應 noise level。','相同 sampling 步數。'],1,'轉換沿用的是同一條 path 的 conditional means。'],['deterministic DDIM 的連續極限相同，有限步也必定完全相同嗎？',['必定完全相同。','只有 Gaussian 起點才完全相同。','不必，離散化規則與時間格可不同。'],2,'連續 dynamics 相同，不表示不同有限步方法產生同一條近似路徑。'],['這裡 αₜ 對應 U1 哪個量？',['資料振幅 √ᾱ。','單步保留率 1 − β。','sampling 步長。'],0,'振幅與機率或單步係數要分開。']],
u24:[['γₜ 與 ε 的角色，哪個正確？',['兩者都只是 solver 步長。','γₜ 改中間 pₜ；ε 改補償後的 sampling dynamics。','兩者都是每一步重抽的同一 Gaussian。'],1,'reference construction 的 Z 與 Brownian increments 不同。'],['直接把 noise 加在 ODE 後，能保住原 pₜ 嗎？',['永遠能。','只要 noise 很大就能。','一般不能，需要相應 score drift 補償。'],2,'新增 drift 與 Brownian diffusion 在 density evolution 裡抵消。'],['W₂ bound 的 Eᵥ 是哪個誤差？',['沿真實 pₜ 加權的 field MSE，並做時間積分。','包含所有 label variance 的整個 training loss。','只有最後一個 batch 的 loss。'],0,'理論使用 population excess loss，還需要 regularity 等條件。']],
lab:[['比較相同計算預算，B 次呼叫能做幾步 Heun？',['B 步。','B／2 步。','2B 步。'],1,'標準 Heun 每步兩次 field evaluations。'],['增加 sampling steps，能把錯誤 field 修成真 field 嗎？',['能，只要超過 1000 步。','能，因為 Euler 收斂。','不能；它更準確地解的是同一條 learned ODE。'],2,'模型誤差與離散化誤差需要分開。'],['純 Python MLP 實驗實際學的是什麼？',['位置、時間到 velocity 的參數化函數。','直接儲存每個樣本終點。','以 exact posterior 偽裝網路。'],0,'Exact field 只用於 held-out 比較，訓練 labels 來自抽出的端點。']]
};
