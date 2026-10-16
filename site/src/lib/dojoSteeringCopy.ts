import type { SteeringMode } from './dojoSteering';

export function steeringCopy(mode: SteeringMode, zh: boolean) {
  const both = (a: string, b: string) => zh ? a : b;
  const copy = {
    classifier: {
      question: both('固定模型，從不加提醒改成 w = 1：樣本會靠近哪一群？同一個 xₜ 的 classifier gradient 和 sampler 更新是一樣的量嗎？', 'With the model fixed, what changes from no guidance to w = 1? Is the classifier gradient itself the sampler update?'),
      plan: both('A 用 w = 0；B 用你選的 w。兩次使用同一批初始噪聲與隨機種子。', 'A uses w = 0; B uses your chosen w. Both use identical initial noise and random seeds.'),
      evidence: both('對照 A、B 的右側比例和直方圖，再引用下方三個方向的數值。固定的是什麼？實際更新 xₜ 還加進了什麼？', 'Compare the right share and histograms in A and B, then use the direction readout. What stayed fixed, and what else enters the update of x_t?'),
      explanation: both('Classifier 提供 log 類別機率對 xₜ 的導數，和 base score 合成後，才交給 reverse SDE。實際一步還包含 drift、步長和隨機 noise。這裡使用解析的 noisy classifier 與 score，沒有訓練網路；w = 1 的終點只應接近條件分布，仍有有限起始時間與離散步誤差。', 'The classifier supplies the input derivative of log class probability. The combined score goes into a reverse SDE whose update also includes drift, step size, and random noise. These are analytic functions, not trained networks. At w = 1 the endpoint approximates the conditional distribution, with finite-time and discretization error.'),
      note: both('VP：ᾱₜ = exp(−8t)。從精確的 base p₁ 抽起點，以 Euler–Maruyama 往 t = 0；每步 Δx = (4x + 8s̃)Δt + √(8Δt)ξ。黑色點線是 w = 1 的條件參考；w > 1 時沒有宣稱它是輸出的精確 target。', 'VP: alpha_bar(t) = exp(-8t). Start from the exact base p_1 and use Euler–Maruyama toward t = 0: Δx = (4x + 8s̃)Δt + sqrt(8Δt)ξ. The dotted curve is a conditional reference at w = 1, not an exact endpoint target for w > 1.'),
    },
    cfg: {
      question: both('同一張 xₜ 問有／沒有 condition 兩次，從 w = 1 改成較強的提醒，樣本群內的位置和分散程度會怎麼變？', 'Ask the same x_t with and without the condition. What changes within the selected mode when w increases from 1?'),
      plan: both('A 保留原本 conditional prediction（w = 1）；B 用你選的 w。c、步數與隨機種子保持相同。', 'A retains the conditional prediction (w = 1); B uses your w. The condition, step count, and random seed stay fixed.'),
      evidence: both('用平均值、標準差和直方圖描述變化。下方兩種回答之差，和合成後的 score 各是多少？強度增加能證明模型估得更準嗎？', 'Use the mean, standard deviation, and histogram. What are the difference between the two predictions and the combined score? Does increasing w prove better estimation?'),
      explanation: both('CFG 改的是同一個輸入上兩支 prediction 的組合。這個 toy 使用解析的理想回答，w = 1 保留 conditional；改大 w 會改變生成結果，但變化大小依資料與 condition 而定，不保證每次更集中。兩個方法在理想回答、相同 w 與 sampler 下應一致；真實網路的前提和估計誤差則不同。', 'CFG changes the combination of two predictions at one input. This toy uses ideal analytic predictions. w = 1 retains the conditional prediction. Larger w changes generation, but the amount of change depends on the data and condition; narrowing is not guaranteed. Ideal classifier guidance and CFG agree with the same w and sampler; real networks have different prerequisites and errors.'),
      note: both('同一個 VP sampler、同一組固定參數。s̃ = sᶜ + (w−1)(sᶜ−s∅)。這裡用解析回答觀察組合，後面仍完整檢查 conditioning dropout；沒有把未學過空輸入的網路當成已經準備好。', 'The same VP sampler and fixed parameters use s̃ = s_c + (w−1)(s_c−s_empty). Analytic predictions isolate the combination. The following training derivation still checks conditioning dropout; an unprepared network is not assumed to answer empty inputs.'),
    },
    tilt: {
      question: both('原本左右各半。乘上 reward 倍率後，只有兩群的份量改變，還是群內的形狀與位置也會改？', 'Starting from an equal mixture, does reward weighting change only the mode shares, or also shape and location within each mode?'),
      plan: both('A 不加偏好（λ = 0）；B 用你選的 reward 與 λ。直接從一維新權重的數值 CDF 各抽 1,000 個樣本。', 'A has λ = 0; B uses your reward and λ. Draw 1,000 samples from each one-dimensional numerical CDF.'),
      evidence: both('對照目標曲線、直方圖與平均 reward。改成「兩側 |x₀| 接近 2.5」後，較高 reward 是否仍容許左右兩種答案？', 'Compare the target curve, histogram, and mean reward. With the reward favoring |x0| near 2.5, can high reward retain both modes?'),
      explanation: both('重新加權作用在每個 x₀，會改變群內形狀，不只改類別份量。右側 reward 提高右側與右尾的相對權重；對稱的兩側 reward 則可以保留兩個峰。這個小實驗能用網格正規化和抽樣，完整圖片仍需要後面的方法。', 'Weighting acts on every x0 and can change within-mode shape. The right reward favors the right mode and its tail; the symmetric reward can retain two peaks. A grid makes normalization and sampling possible here; images need the later sampling methods.'),
      note: both('固定 p_base = ½N(−2,0.55²) + ½N(2,0.55²)。以 [−6,6]、Δx = 0.025 的網格正規化 p_base exp(λR)，再反查 CDF 並在格內均勻抽樣。這是一維數值近似，並非 diffusion network。', 'Fixed base: ½N(-2,0.55²) + ½N(2,0.55²). Normalize p_base exp(λR) on [-6,6] with Δx = 0.025, invert the CDF, and sample uniformly within a bin. This is a numerical one-dimensional approximation, not a diffusion network.'),
    },
    posterior: {
      question: both('固定眼前的 xₜ = 0，噪聲增加後，可能的乾淨來源如何改變？平均圖片的 reward 倍率，會等於所有來源倍率的平均嗎？', 'For a fixed x_t = 0, how do possible clean sources change as noise increases? Does scoring their mean equal averaging their reward multipliers?'),
      plan: both('A 用較低 noise level t = 0.08；B 用你選的 t。兩次固定同一個 xₜ、reward 和 λ。', 'A uses noise time t = 0.08; B uses your t. The observation, reward, and λ stay fixed.'),
      evidence: both('圖中的 posterior mean 落在哪裡？那裡的 density 高嗎？引用 hₜ 和 plug-in 的數值，並看下方兩條權重函數，說明它們為何可能給不同方向。', 'Where is the posterior mean, and is its density high? Use h_t and plug-in values and the weight functions below to explain why their directions can differ.'),
      explanation: both('Posterior 平均的是可能乾淨來源；hₜ 先對每個來源算 exponential 倍率再平均。Plug-in 先平均位置再評分。兩團資料的平均可以落在低 density 區，丟掉不確定性；非線性使兩種順序不同。下方是權重函數，不是 density，也沒有把它們當成已生成的分布。', 'The posterior describes possible clean sources. h_t averages their exponential reward multipliers; plug-in scores the mean location. A two-mode posterior can have a mean in a low-density gap. Nonlinearity makes the orders differ. The lower curves are weight functions, not densities or a claimed generated distribution.'),
      note: both('用已知 Gaussian mixture 的 Bayes posterior，真的抽 1,000 個可能來源；hₜ 用解析 Gaussian 積分計算，plug-in 用解析 posterior mean。這裡觀察的是同一張 noisy state 的不確定性，沒有使用已被 reward 改過的 posterior。', 'Sample 1,000 possible sources from the analytic Gaussian-mixture Bayes posterior. h_t uses analytic Gaussian integrals; plug-in uses the analytic posterior mean. This is the base posterior of a fixed noisy observation, not a reward-tilted posterior.'),
    },
    best: {
      question: both('N 增加會讓分數變高，但回傳分布就會接近黑色點線的 reward tilt 嗎？固定排序，只放大 λ 又會怎樣？', 'Increasing N can raise reward. Does that make the output match the dotted reward tilt? What if only λ changes while rankings stay fixed?'),
      plan: both('A 每趟 N = 1；B 用你選的 N。每一趟重新生成候選，只回傳最高分的一個，獨立重跑 1,000 趟。', 'A uses N = 1; B uses your N. Each of 1,000 independent batches generates fresh candidates and returns the highest-reward one.'),
      evidence: both('比較平均 reward 與整張直方圖。固定種子和 N，只改 λ 再跑：候選贏家與 target 曲線是否都改了？', 'Compare mean reward and the whole histogram. With seed and N fixed, change only λ: do the winners and target curve both change?'),
      explanation: both('Best-of-N 只依 reward 排名選贏家；λ 不改排序，就不改同一批候選的贏家。Reward tilt 的倍率卻會隨 λ 改變。因此多跑輸出能看清這個規則，但不能把規則本身改成 target。候選表記錄的是真正生成與選中的數字。', 'Best-of-N selects by rank. Changing λ without changing ranks leaves winners unchanged, while the tilt changes. More output draws reveal the rule but do not change it into the target. The candidate table records actual draws and selections.'),
      note: both('每個候選都直接從同一個 Gaussian mixture 抽出。主圖的直方圖來自 1,000 次獨立回傳；黑色點線是數值積分得到的 tilt 參考，不是 Best-of-N 的理論密度。', 'Every candidate is drawn from the same Gaussian mixture. The histogram contains 1,000 independent returns. The dotted curve is a numerical tilt reference, not the theoretical Best-of-N density.'),
    },
    importance: {
      question: both('候選已經從 base 抽過，只按 exponential 倍率選一個，N = 1 和較大的 N 會有什麼不同？', 'Candidates already come from the base. How does selecting by exponential multipliers differ between N = 1 and a larger N?'),
      plan: both('A 每趟 N = 1；B 用你選的 N。每批都生成新候選，再正規化該批倍率，抽一個編號。', 'A uses N = 1; B uses your N. Draw fresh candidates in every batch, normalize their multipliers, and sample one index.'),
      evidence: both('候選表裡最大的權重是否每次都被選中？比較兩張直方圖與 target；N = 1 時 reward 為何改不了輸出？', 'Is the largest candidate weight always selected? Compare the histograms with the target. Why cannot reward change the output when N = 1?'),
      explanation: both('N = 1 時唯一候選的正規化權重一定是 1，所以輸出仍是 base。N 增加改善候選涵蓋，但有限候選的 self-normalized resampling 仍是近似；選中某張的條件機率，也不等於跨所有批次的結果比例。', 'At N = 1 the only normalized weight is 1, so output remains the base. More candidates improve coverage, but finite self-normalized resampling is still approximate. Conditional selection within one batch differs from the output law across batches.'),
      note: both('每批候選的 base 頻率已反映原分布，權重只補 exp(λR)，沒有再乘一次 base density。1,000 批各回傳一個，圖與表都來自實際抽樣。', 'Base frequencies are already represented by candidate generation. Weights supply exp(λR), without multiplying the base density again. Each of 1,000 batches returns one actual sampled candidate.'),
    },
    smc: {
      question: both('中途估計故意只偏右，最後即使用真正 reward 校正，有限粒子還能保留左峰嗎？哪些草稿會共享祖先？', 'If an intermediate estimate wrongly favors only the right, can finite particles retain the left peak after terminal correction? Which share ancestors?'),
      plan: both('A 使用 posterior 平均倍率；B 使用故意偏右的中途估計。M、checkpoints、terminal reward 和各趟種子相同。', 'A uses the posterior multiplier; B uses a deliberately right-biased intermediate estimate. M, checkpoints, terminal reward, and seeds stay fixed.'),
      evidence: both('引用存活的祖先數與最後直方圖。增加 M、改 estimator，或把 K 設成 1（只在終點重抽）再比較。理想倍率相消，為何仍不能救回已淘汰的粒子？', 'Use surviving ancestors and the endpoint histogram. Increase M, change the estimator, or set K = 1 to resample only at the endpoint. Why cannot ideal telescoping restore an eliminated particle?'),
      explanation: both('每個新狀態只除以自己親代的舊 H，終點用真正 exp(λR)，所以理想路徑的中間 H 相消。有限 M 仍可能失去某一群；增加 M 也不保證每個種子都更好。彩色圖是一趟的祖先，主直方圖則是 300 趟獨立 population 各回傳一個，不把同祖先後代當成獨立樣本。', 'Each child divides by its own parent’s H; the terminal H uses the actual exp(λR), so intermediate H values telescope on ideal paths. Finite M can still lose a mode, and increasing M need not improve every seed. Colors track one population; the main histogram returns one sample from each of 300 independent populations, not independent descendants within one run.'),
      note: both('此 toy 的 base transition 使用已知 mixture VP 過程的精確 reverse conditional，讓誤差集中在有限粒子與中途估計。起點 H_K = 1，終點 H₀ = exp(λR)，每段正規化後 multinomial 重抽 M 份；posterior 的 H 由解析積分取得，沒有隱藏的試畫。', 'This toy uses exact reverse conditionals of the known mixture VP process, isolating finite-particle and estimator effects. H_K = 1 and H_0 = exp(λR). Each stage normalizes incremental weights and multinomially resamples M particles. Posterior H uses an analytic integral, without hidden rollouts.'),
    },
    source: {
      question: both('若每次只收較高 reward，會得到目標分布嗎？真正的接受規則，會接受較低分的起點嗎？', 'Would always accepting only higher reward sample the target? Can the actual acceptance rule accept lower reward?'),
      plan: both('A 用 λ = 0；B 用你選的 λ。兩條單鏈都從 z = −0.8 開始，保留相同步數、步幅與種子。', 'A uses λ = 0; B uses your λ. Both single chains start at z = -0.8 with identical iteration counts, proposal size, and seed.'),
      evidence: both('用接受較低 reward 的次數、拒絕次數與 source 軌跡說明差別。拒絕後留在原位，是否仍應算進樣本？', 'Use lower-reward acceptances, rejections, and the source trace. Should a rejection that stays in place still count as a sample?'),
      explanation: both('接受規則同時看 standard Normal prior 與 reward 比值，允許較低分的 proposal。拒絕時仍留在原位，因此重複位置也要收集；只收接受的步會改變分布。有限鏈可能困在一側，400 步 warm-up 並不保證已收斂。', 'Acceptance uses both the standard-Normal prior and reward ratio and can accept lower reward. Repeated states after rejection must be retained; keeping only accepted moves changes the distribution. A finite chain can remain in one mode; 400 warm-up iterations do not certify convergence.'),
      note: both('固定 G(z) = F_base⁻¹(Φ(z))：Φ 是 standard Normal 的累積機率，F_base 是雙峰資料的累積機率。先找 z 的累積比例，再找 base 中同一比例的位置，便將 z ~ N(0,1) 變成同一個雙峰 base；同一 z 每次得到同一 x₀。數值反查沒有訓練或微分 reward。對稱 Gaussian proposal 使用 prior × reward 的接受比；直方圖包含拒絕與相關樣本。', 'Fixed G(z) = F_base^-1(Phi(z)): Phi is the standard-Normal CDF and F_base is the mixture CDF. Find z’s cumulative probability, then the location with the same cumulative probability in the base. This maps a Normal source to the mixture, always giving the same output for the same z. Numerical inversion does not train a model or differentiate reward. Acceptance uses prior × reward, and the histogram retains rejected and correlated states.'),
    },
    tempering: {
      question: both('多條不同強度的鏈，交換後能找到另一個高分區域嗎？額外的生成與評分成本是多少？', 'Can swaps between chains of different strengths reach another high-reward region? What extra generation and reward cost do they incur?'),
      plan: both('A 是同一個 target 強度的單鏈；B 是 0、λ/2、λ 三條鏈並嘗試相鄰交換。每鏈步數相同，B 的評分成本為三倍，並非等預算比較。', 'A is one chain at the target strength; B uses strengths 0, λ/2, λ with adjacent swaps. Iterations per chain match, so B has three times the evaluation cost; this is not an equal-budget comparison.'),
      evidence: both('查看各鏈的 source 軌跡、交換接受率與目標鏈直方圖。換個種子再跑；看到較高 reward，是否足以判斷已涵蓋兩峰？', 'Inspect source traces, swap acceptances, and the target-chain histogram. Try another seed. Does a higher reward establish coverage of both modes?'),
      explanation: both('每條鏈先做自己的 MCMC proposal，再依交換比值一起交換 z、完成品和 reward。只從 λ 那條鏈收樣本；低強度鏈的樣本不能直接混入。較大的 proposal 是另外設定，不由 λ 自動產生；有限次結果仍可能探索不足。', 'Each chain makes an MCMC proposal, then swaps z, output, and reward together according to the swap ratio. Collect only the λ chain; do not mix in low-strength samples. Larger proposals are separately configured, not generated by λ. Finite runs can still explore poorly.'),
      note: both('同一個固定 quantile generator。三條鏈的 Gaussian proposal 標準差分別為 1.4、0.8、你設定的目標鏈步幅。交換接受比為 exp[(λᵢ−λⱼ)(Rⱼ−Rᵢ)] 截至 1。來源圖畫的是 z 隨迭代改變，並非 diffusion time。', 'The same fixed quantile generator. Proposal standard deviations are 1.4, 0.8, and your target-chain step size. Swap probability is min(1, exp[(λ_i−λ_j)(R_j−R_i)]). The trace shows source z across iterations, not diffusion time.'),
    },
  }[mode];
  return copy;
}
