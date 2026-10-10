# 主線範例：看機制，不套句型

以下提煉自 DMA 的 U1.1–U3 非實作篇章。用來判斷例子、數學與問題是否真的連在一起，不要求其他學科沿用人潮、Gaussian 或這一套符號。

## 1. 想做難的方向，先設計能做的方向

**情境：** 想從 noise 生成資料，但不知道每一步該往哪裡走。

**推進方式：** 正向造出一個可掌握的破壞過程，再學如何反過來。洗亂一副牌比恢復原順序容易；這個例子指出的是「先造容易的一端」，不是證明 Gaussian 最好。

**數學需求：** 從目的倒推設計限制：終點可抽樣、中間 snapshot 易算、條件分布能處理。逐項說明 Markov、linear、Gaussian 各自完成什麼，不把它們混成一個「好算」的理由。Noise schedule 決定資訊如何被替換，再寫出閉式的 noisy snapshot。

**檢查問題：** 讀者知道這些是選擇而非所有生成模型的必要條件嗎？Markov 性是否被誤說成單獨解決 marginal integral？

適合其他課程的情境：設計容易求解的 surrogate、由 boundary conditions 倒推構造、用可模擬的過程建立學習目標。

## 2. 端點已知時能造標籤，端點未知時需要共同規則

**情境：** 跨年散場的人若知道起點與捷運站，就能直接畫路；但迷路的人只有目前位置與時間。

給定端點後先建立

$$
I_t=(1-t)X_0+tX_1,
\qquad \partial_t I_t=X_1-X_0.
$$

接著指出：已知終點的 reference path 不等於生成時可用的導航。我們需要只依賴 $(x,t)$ 的共同規則。生活上的動作是參考同一時間、同一街口經過的人；數學上的動作是把 $(I_t,t)$ 當 input，把 $\partial_t I_t$ 當 label，做 L2 regression。

同一 input 對應多個 label，而模型只能輸出一個 velocity；沿用已證過的 MSE conditional-mean 結果，才得到

$$
v_t^*(x)=\mathbb E[\partial_t I_t\mid I_t=x].
$$

**讀法：** 平均所有在時間 $t$ 相容於位置 $x$ 的 reference velocities，不是所有人的速度，也不是猜自己必定屬於某一條路。

**檢查問題：** 是否把訓練時知道的端點偷偷帶進生成？是否尚未解釋 label，就直接寫出 objective？是否重證前文已有的 conditional-mean 定理，反而打斷主線？

## 3. 要追密度，就不能只看速度箭頭

**情境：** 人多但走得慢，或走得快但沒什麼人，都不表示每秒通過很多人。

先把「每秒通過多少」拆成擁擠程度乘上速度，再給它名字：probability flux 是 $p_tv_t$。在一維用單位檢查

$$
(\text{probability}/\text{meter})
\times(\text{meter}/\text{second})
=\text{probability}/\text{second}.
$$

接著比較一小段走道兩端的流入與流出，得到「淨流出為正，密度就下降」。將邊界差縮到局部後，才引入

$$
\partial_t p_t=-\nabla\cdot(p_tv_t).
$$

**檢查問題：** 說 $\nabla\cdot v_t$ 能直接決定固定位置的密度變化了嗎？它描述 field 的局部擴張；密度的演化需要 flux 的 divergence。不能因為速度箭頭散開，就忽略原有密度。

適合其他課程的情境：從守恆量與單位建立微分方程，而非先貼方程再找故事。

## 4. 把「一小步漏掉什麼」接到終點誤差

**情境：** 偶爾看一次導航，直路問題較小；方向沿途改變時，照舊方向走容易偏離。

先寫精確積分，再寫 Euler 替代了哪一部分：

$$
x_{t+h}=x_t+\int_t^{t+h}v_s(x_s)\,\mathrm ds,
\qquad
\widehat x_{t+h}=\widehat x_t+h\,v_t(\widehat x_t).
$$

用 acceleration $a_t(x_t)=\mathrm d[v_t(x_t)]/\mathrm dt$ 描述 velocity 沿 trajectory 的變化；它包含轉向，也包含沿直線加減速。不要直接稱它為 curvature。

若局部 remainder 是 $r_k$，先相減：

$$
\begin{aligned}
x_{t_{k+1}}-\widehat x_{t_{k+1}}
&=(x_{t_k}-\widehat x_{t_k})\\
&\quad+h\big(v_{t_k}(x_{t_k})-v_{t_k}(\widehat x_{t_k})\big)+r_k.
\end{aligned}
$$

然後才取 norm、用三角不等式，並用 $L$-Lipschitz 把第二項控制成 $hLe_k$，得到 $e_{k+1}\le(1+hL)e_k+\|r_k\|$。分別解釋舊位置誤差、速度差與本步 remainder；展開遞迴後再說它們如何累積。

**檢查問題：** 新的模型誤差是否被錯當成 integration error？由 pathwise bound 到 distribution bound 時，有沒有給出合法的 coupling，而非直接跳到 $W_2$？

## 5. 精確成本分解，不能被改寫成所有量都單調

**情境：** Reflow 使用舊 ODE 的端點配對，重新畫直線，平均出下一輪的 field，再解下一輪 ODE。

先寫清楚生成關係，而不是突然開始比較輪次：

$$
\begin{aligned}
I_t^{(k)}&=(1-t)Z_0^{(k)}+tZ_1^{(k)},\\
v_t(x)&=\mathbb E[Z_1^{(k)}-Z_0^{(k)}\mid I_t^{(k)}=x],\\
\frac{\mathrm dZ_t^{(k+1)}}{\mathrm dt}&=v_t(Z_t^{(k+1)}).
\end{aligned}
$$

這裡每一輪的 $v_t$ 都由當輪的配對決定；不是重複積分同一個 field。先確認 marginal preservation，才把 $I_t^{(k)}$ 與 $Z_t^{(k+1)}$ 在同一時間的 expectations 互換。

把兩個不同的 variance 分開：$V$ 是同一 $(x,t)$ 上 reference velocities 相對 conditional mean 的分歧；$S$ 是同一條新 ODE trajectory 的 velocity 相對其時間平均的變化。平方成本 $C^{(k)}$ 不是 ODE 的 path length。

推導經過三個機制：conditional mean 讓交叉項消失；同一 marginal 讓 velocity 的平均平方相同；時間平均 velocity 等於端點位移。然後才得到

$$
C^{(k)}-C^{(k+1)}=V(\pi^{(k)})+S(Z^{(k+1)})\ge0.
$$

**讀法：** 成本逐輪不增加，不表示下降量或每個 variance 逐輪變小。求和讓成本前後抵消；非負且總和有限才推出 $S,V\to0$。這個極限結論不是逐輪單調，也不是 OT 的全域最佳性。

**檢查問題：** 是否把「不保證每輪 straightness 更小」誤寫成「成本不保證下降」？是否把當前 coupling 比上一輪便宜，誤說成比所有其他 couplings 都便宜？

## 6. 先問如何看到漏掉的變化，再介紹 solver

**情境：** Euler 一整步只相信起點方向。能不能多看一次，察覺途中 velocity 的變化？

從精確解的 Taylor expansion 看出漏掉 $h^2a_t/2$。再以幾何說明：常數 velocity 對應方形面積；前後 velocity 的平均對應梯形，能捕捉一部分變化。但真正終點尚未知，不能直接查那裡的 field。

因此先用 Euler 預測位置，再查預測終點的 velocity，最後平均兩次查詢作更新。構造完成後才取名 Heun，接著用展開說明在相應光滑條件下，哪個 remainder 階數改善了。

**檢查問題：** 是否公平比較相同 NFE，而非不同花費的相同步數？是否把 fixed-step Heun 說成自動 adaptive？是否把誤差估計等同於真實誤差，或把高階優勢當成任何大步長下都成立？

## 移植到其他學科

保留「問題如何讓下一個物件有必要」的機制，替換領域角色即可。例如統計用「同一輸入有多種觀測」引出條件平均；物理用「小區域流入減流出」引出守恆式；數值分析用「精確積分被哪個近似替代」引出 remainder。不要把每門課都改寫成生成模型，也不要把以上六種模式當成固定章節表。
