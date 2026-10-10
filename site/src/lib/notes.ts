import type { CollectionEntry } from 'astro:content';
import type { MoleculeMotif } from './molecules';

export type Lang = 'en' | 'zh';
export type NoteEntry = CollectionEntry<'notes'>;
export type ResearchAreaKey = 'flow-based-generative-modeling' | 'geometric-deep-learning';

export const noteSlugList = [
  // From Noise to Data — a unified path from simple noise to structured data
  'n2d-overview',
  'n2d-what-models-learn',
  'n2d-samples-as-particles',
  'n2d-vector-field',
  'n2d-probability-path',
  'n2d-denoising',
  'n2d-score-function',
  'n2d-velocity-regression',
  'n2d-sampling-as-integration',
  'n2d-three-languages',
  'n2d-review',
  // All the Math You Need for Deep Learning — course notes
  // (category: "courses"; group: "Lecture N · …"; ordered within each lecture by this list)
  'math-randomness-and-distribution',
  'math-density-vs-probability',
  'math-expectation-and-averages',
  'math-points-as-vectors',
  'math-norms-and-distance',
  'math-inner-product-and-similarity',
  'math-matrix-as-data-and-map',
  'math-linear-map-geometry',
  'math-eigenvectors-and-eigenvalues',
  'math-svd',
  'math-pca',
  'math-low-rank-approximation',
  // Diffusion & Flow Models — graduate course notes
  'dfc-principles-transport-map',
  'dfc-principles-corrupt-and-reverse',
  'dfc-principles-prediction-targets',
  'dfc-principles-flow-matching',
  'dfc-principles-course-map',
  'n2d-continuity-equation',
  'n2d-probability-flow-ode',
  'n2d-conditional-to-marginal',
  'n2d-diffusion-fm-core',
  'n2d-path-design',
  'n2d-rectified-flow',
  'n2d-optimal-transport',
  'n2d-why-gaussian',
  // Diffusion Models and Their Applications — weekly course notes
  // (category: "courses"; group: "Unit N · …"; ordered within each unit by this list)
  'dma-w3-0-what-are-we-learning',
  'dma-w3-1-forward-process',
  'dma-w3-2-denoising-regression',
  'dma-w3-3-tweedie-and-score',
  'dma-w3-4-reverse-process',
  'dma-w3-5-lab',
  'dma-w4-0-why-not-diffusion',
  'dma-w4-1-flows-and-continuity',
  'dma-w4-2-conditional-flow-matching',
  'dma-w4-3-linear-path',
  'dma-w5-0-unified-equation',
  'dma-w4-5-lab',
  'dma-u1-u2-homework-a',
  'dma-u1-u2-homework-b',
  'dma-u1-u2-homework-c',
  'dma-w4-4-fm-vs-diffusion',
  'dma-w5-2-error-theory',
  'dma-w5-3-rectified-flow',
  'dma-w5-4-minibatch-ot',
  'dma-w5-5-shared-techniques',
  'dma-w5-6-lab',
  'dma-w6-0-discrete-data',
  'dma-w6-1-d3pm',
  'dma-w6-3-factorization-error',
  'dma-w6-4-absorbing-vs-uniform',
  'dma-w7-1-ctmc',
  'dma-w7-2-concrete-score',
  'dma-w7-3-remasking',
  'dma-w7-4-discrete-flow-matching',
  'dma-w6-5-lab',
  'dma-w7-6-lab',
  'dma-w8-0-learn-the-map',
  'dma-w8-1-progressive-distillation',
  'dma-w8-2-consistency-function',
  'dma-w8-3-cd-vs-ct',
  'dma-w8-4-ict-scm',
  'dma-w8-5-multistep-limit',
  'dma-w8-6-lab',
  'dma-w9-0-flow-map',
  'dma-w9-1-flow-map-matching',
  'dma-w9-2-meanflow',
  'dma-w9-3-shortcut-ayf',
  'dma-w9-4-distribution-matching',
  'dma-w9-5-unified-table',
  'dma-w9-6-lab',
  'dma-w10-0-test-time-steering',
  'dma-w10-1-classifier-guidance',
  'dma-w10-2-classifier-free-guidance',
  'dma-w10-3-reward-tilting',
  'dma-w10-4-gradient-free-steering',
  'dma-w10-5-guidance-applications',
  'dma-w10-6-lab-guidance',
  // Mathematical Foundations — tool notes reused by the courses above
  // (category: "courses"; group: "M{class} · …"; ordered within each class by this list)
  'math-m0-0-gradient',
  'math-m0-1-divergence',
  'math-m0-2-taylor',
  'math-m0-3-total-derivative',
  'math-m1-0-gaussian',
  'math-m1-1-conditional-expectation',
  'math-m1-2-mse-conditional-expectation',
  'math-m1-3-bayes-posterior',
  'math-m1-4-tweedie',
  'math-m2-0-vector-field-ode',
  'math-m2-1-pushforward-flow-map',
  'math-m2-2-continuity-equation',
  'math-m2-3-euler-error',
  'math-m2-4-higher-order',
  'math-m3-0-random-walk-brownian',
  'math-m3-1-sde',
  'math-m3-2-fokker-planck',
  'math-m3-3-langevin',
  'math-m3-4-weak-strong-convergence',
  'math-m4-0-markov-chain',
  'math-m4-1-absorbing-state',
  'math-m4-2-ctmc',
  'math-m4-3-time-reversal',
  'math-m5-0-jensen',
  'math-m5-1-kl',
  'math-m5-2-ema',
  'math-m5-3-generator-gradient',
  'math-m6-0-warehouse-ot',
  'math-m6-1-w2',
  'math-m6-2-monotone-1d',
  'math-m6-3-large-scale-ot',
  // Machine Learning Foundations — the workflow layer between math and the courses
  // (category: "courses"; group: "L{class} · …"; ordered within each class by this list)
  'ml-l0-0-learning-from-examples',
  'ml-l0-1-loss-is-a-declaration',
  'ml-l0-2-risk-and-empirical-risk',
  'ml-l0-3-gradient-descent',
  'ml-l1-0-overfitting-underfitting',
  'ml-l1-1-bias-variance',
  'ml-l1-2-data-splits',
  'ml-l1-3-cross-validation',
  'ml-l1-4-learning-curves',
  'ml-l2-0-minibatch-noise',
  'ml-l2-1-lr-momentum-adam',
  'ml-l2-2-moving-targets-ema',
  'ml-l2-3-regularization-early-stopping',
  'ml-l2-4-loss-landscape-init',
  'ml-l3-0-hyperparameters',
  'ml-l3-1-grid-random-bayes',
  'ml-l3-2-nested-validation',
  'ml-l3-3-seeds-and-honest-reporting',
  'ml-l4-0-mlp-universal',
  'ml-l4-1-backprop',
  'ml-l4-2-convolution-equivariance',
  'ml-l4-3-unet-residual-norm',
  'ml-l4-4-attention-transformer',
  'ml-l4-5-conditioning-and-time',
  'ml-l5-0-maximum-likelihood',
  'ml-l5-1-latent-variables-elbo',
  'ml-l5-2-autoregressive-factorization',
  'ml-l5-3-evaluating-generative-models',
  // Geometric Deep Learning — G1–G6 core with variable unit lengths, G7–G11 planned expansion
  'map-view-invariance-equivariance',
  'gdl-g1-1-group-actions',
  'cnn-translation-equivariance-from-map-views',
  'gdl-g1-3-equivariant-networks',
  'gdl-g1-4-boundaries-and-augmentation',
  'gdl-g1-5-translation-lab',
  'rotation-and-group-equivariant-cnns',
  'gdl-g2-2-group-convolution',
  'gdl-g2-3-feature-types',
  'gdl-g2-4-readout-and-discretization',
  'gdl-g2-5-rotation-lab',
  'sets-and-point-clouds-permutation-invariance',
  'gdl-g3-1-deep-sets',
  'gdl-g3-2-set-equivariant-layers',
  'gdl-g3-3-pointnet',
  'gdl-g4-0-attention-from-sets',
  'gdl-g3-4-set-attention',
  'gdl-g4-3-transformer-block',
  'gdl-g4-4-order-and-position',
  'gdl-g4-5-relations-and-masks',
  'gdl-g3-5-set-lab',
  'gnn-permutation-equivariance-road-networks',
  'gdl-g4-2-gcn',
  'gdl-g4-3-aggregation-and-gin',
  'gdl-g4-4-expressivity',
  'gdl-g4-5-graph-lab',
  'euclidean-equivariant-gnns-point-clouds',
  'gdl-g5-2-egnn',
  'gdl-g5-3-energy-and-forces',
  'frontiers-of-equivariant-learning',
  'gdl-g5-5-geometry-lab',
  'gdl-g6-0-overview',
  'gdl-g6-1-foundations',
  'gdl-tensor-feature-types',
  'gdl-g6-2-construction',
  'gdl-g6-3-analysis',
  'gdl-g6-4-limits',
  'gdl-g6-5-lab',
  'gdl-g7-0-overview',
  'gdl-g7-1-foundations',
  'gdl-g7-2-construction',
  'gdl-spectral-filtering',
  'gdl-g7-3-analysis',
  'gdl-g7-4-limits',
  'gdl-structural-information',
  'gdl-g7-5-lab',
  'gdl-g8-0-overview',
  'gdl-g8-1-foundations',
  'gdl-g8-2-construction',
  'gdl-g8-3-analysis',
  'gdl-g8-4-limits',
  'gdl-surface-layers',
  'gdl-g8-5-lab',
  'gdl-g9-0-overview',
  'gdl-g9-2-construction',
  'gdl-g9-3-analysis',
  'gdl-g9-4-limits',
  'gdl-g9-5-lab',
  'gdl-g10-0-overview',
  'gdl-g10-1-foundations',
  'gdl-g10-2-construction',
  'gdl-g10-3-analysis',
  'gdl-geometric-sde',
  'gdl-g10-4-limits',
  'gdl-g10-5-lab',
  'writing-compelling-introduction',
  'academic-website-starter-prompt',
] as const;

const noteOrder = new Map(noteSlugList.map((slug, index) => [slug, index]));
// Keep old URLs and reference labels working after articles are merged.
export const mergedNoteAliases: Record<string, string> = {
  'gdl-g2-1-orientation-channels': 'rotation-and-group-equivariant-cnns',
  'gdl-g4-1-query-key-value': 'gdl-g4-0-attention-from-sets',
  'gdl-g4-1-message-passing': 'gnn-permutation-equivariance-road-networks',
  'gdl-g5-1-relative-geometry': 'gdl-g5-2-egnn',
  'dma-w6-2-masked-diffusion': 'dma-w6-1-d3pm',
  'dma-w7-0-why-continuous-time': 'dma-w6-4-absorbing-vs-uniform',
  'dma-w7-5-applications': 'dma-w7-4-discrete-flow-matching',
};
const archivedNoteSlugs = new Set([
  'flow-matching-flow-ode', 'flow-matching-training',
  ...Object.keys(mergedNoteAliases),
]);

// Display order for note groups within each category/area. Listed explicitly so
// the order is intentional (e.g. "From Noise to Data" before "Diffusion & Flow
// Models", and "Lecture 10 · …" after "Lecture 2 · …" — a string compare fails both).
const groupOrder = [
  // Research Areas
  'From Noise to Data',
  'Diffusion & Flow Models',
  // Courses — All the Math You Need for Deep Learning
  'Lecture 1 · Vectors & Similarity',
  'Lecture 2 · Eigen, SVD & PCA',
  'Lecture 3 · Spectral Methods',
  'Lecture 4 · Regression & Least Squares',
  'Lecture 5 · Gradients & Optimization',
  'Lecture 6 · Probability & Estimation',
  'Lecture 7 · From Probability to Loss',
  'Lecture 8 · Dynamics & Flows',
  'Lecture 9 · Reading the Math in Papers',
  'Lecture 10 · Review & Projects',
  // Courses — Diffusion Models and Their Applications
  'Unit 1 · Diffusion Models',
  'Unit 2 · Flow Matching',
  '作業 · Unit 1–2',
  'Unit 3 · 減少 ODE 的離散化誤差',
  'Unit 4 · Discrete Diffusion',
  'Unit 5 · Consistency Models',
  'Unit 6 · Consistency Trajectory Model and Flow Map',
  'Unit 7 · Test-time Guidance',
  // Courses — Geometric Deep Learning
  'G1 · Symmetry and Translation',
  'G2 · Rotations and Feature Types',
  'G3 · Sets and Permutations',
  'G4 · Attention and Transformers',
  'G5 · Graphs and Message Passing',
  'G6 · Euclidean Geometry',
  'G7 · Tensor Features',
  'G8 · Graph Structure and Spectral Methods',
  'G9 · Surfaces and Local Frames',
  'G10 · Approximate Symmetry and Canonicalization',
  'G11 · Geometric Generative Models',
  // Courses — Mathematical Foundations
  'M0 · Calculus 工具箱',
  'M1 · 機率與 Conditional Expectation',
  'M2 · Deterministic Dynamics',
  'M3 · Stochastic Dynamics',
  'M4 · Markov Chains',
  'M5 · Optimization、Convexity 與距離',
  'M6 · Optimal Transport',
  // Courses — Machine Learning Foundations
  'L0 · 學習就是擬合',
  'L1 · 泛化：過擬合、欠擬合與資料切分',
  'L2 · 實務中的最佳化',
  'L3 · 實驗方法與超參數搜尋',
  'L4 · 常見架構：結構對應歸納偏置',
  'L5 · 機率建模與生成模型的評估',
  // Academic Skills
  'Paper Writing',
  'Website & Tooling',
];
const groupOrderIndex = (group: string) => {
  const i = groupOrder.indexOf(group);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
};

// Per-group metadata for the notes index (description, reading-order treatment).
// Keys are the frontmatter `group` labels. Every disclosure on the index starts
// closed — there is no per-group "open on load" switch — so the page opens as a
// short table of contents. `startHere` only flags a group's first note.
export interface GroupMeta {
  description?: Record<Lang, string>;
  ordered?: boolean;
  startHere?: boolean;
}
export const groupMeta: Record<string, GroupMeta> = {
  'From Noise to Data': {
    description: {
      zh: '從一團 noise 到結構化資料的統一直覺路徑。',
      en: 'A unified, intuition-first path from noise to data.',
    },
    ordered: true,
  },
  'Diffusion & Flow Models': {
    description: {
      zh: 'diffusion 與 flow-based 生成模型的研究所課程筆記。',
      en: 'Graduate-course notes on diffusion & flow-based generative models.',
    },
    ordered: true,
  },
  'Paper Writing': {
    description: {
      zh: '學術論文寫作技巧。',
      en: 'Craft for academic paper writing.',
    },
  },
  'Website & Tooling': {
    description: {
      zh: '學術網站與研究工具的搭建方式，可以直接複製去用。',
      en: 'Building academic websites and research tooling — copy and reuse.',
    },
  },
};

/**
 * Notes that are planned (and already referenced by <Ref>, <Bridge> or another note's
 * `prereqs`) but not written yet. Keyed by the stable `label` those references use, so
 * a forward reference renders as a muted "規劃中 / Planned" chip instead of a broken-link
 * marker. Their slugs are in `noteSlugList`, so their position codes are derived the same
 * way as a real note's. DELETE an entry the moment its note lands — a real note always
 * wins, so a stale entry is inert, but it lies to the next reader.
 */
export interface PlannedNote {
  slug: string;
  group: string;
  title: Record<Lang, string>;
}
export const plannedNotes: Record<string, PlannedNote> = {
  'gdl-g6-0': { slug: 'gdl-g6-0-overview', group: 'G7 · Tensor Features', title: { zh: 'Scalar 與 vector 還不夠描述什麼？', en: 'What do scalars and vectors leave out?' } },
  'gdl-g6-1': { slug: 'gdl-g6-1-foundations', group: 'G7 · Tensor Features', title: { zh: '球面上的方向要怎麼編碼？', en: 'How can we encode directions on a sphere?' } },
  'gdl-tensor-feature-types': { slug: 'gdl-tensor-feature-types', group: 'G7 · Tensor Features', title: { zh: '旋轉之後，這組 angular features 要怎麼一起變？', en: 'How do angular features transform together?' } },
  'gdl-g6-2': { slug: 'gdl-g6-2-construction', group: 'G7 · Tensor Features', title: { zh: '把兩種 feature 組合後，會得到哪種型態？', en: 'What types result from combining features?' } },
  'gdl-g6-3': { slug: 'gdl-g6-3-analysis', group: 'G7 · Tensor Features', title: { zh: 'Tensor field layer 要遵守什麼？', en: 'What must a tensor field layer respect?' } },
  'gdl-g6-4': { slug: 'gdl-g6-4-limits', group: 'G7 · Tensor Features', title: { zh: 'Parity 與 feature budget 要怎麼選？', en: 'How should we choose parity and a feature budget?' } },
  'gdl-g6-5': { slug: 'gdl-g6-5-lab', group: 'G7 · Tensor Features', title: { zh: '實作：typed tensor features 的旋轉測試', en: 'Lab: rotation tests for typed tensor features' } },
  'gdl-g7-0': { slug: 'gdl-g7-0-overview', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '局部訊息不夠，要新增哪種資訊？', en: 'What information is missing from local messages?' } },
  'gdl-g7-1': { slug: 'gdl-g7-1-foundations', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '圖上的平滑與 Laplacian', en: 'Smoothing and the graph Laplacian' } },
  'gdl-g7-2': { slug: 'gdl-g7-2-construction', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '沒有規則格點，frequency 是什麼？', en: 'What is frequency without a regular grid?' } },
  'gdl-spectral-filtering': { slug: 'gdl-spectral-filtering', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '知道 graph frequency 後，要怎麼設計 filter？', en: 'How can graph frequencies define a filter?' } },
  'gdl-g7-3': { slug: 'gdl-g7-3-analysis', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '多傳幾輪，訊息為什麼變得太像？', en: 'Why do messages become too similar?' } },
  'gdl-g7-4': { slug: 'gdl-g7-4-limits', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '遠方資訊都擠進同一個向量，會怎樣？', en: 'What happens when distant information meets a bottleneck?' } },
  'gdl-structural-information': { slug: 'gdl-structural-information', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '要補遠方資訊，可以改連線或加入結構嗎？', en: 'Can connections and structure provide distant information?' } },
  'gdl-g7-5': { slug: 'gdl-g7-5-lab', group: 'G8 · Graph Structure and Spectral Methods', title: { zh: '實作：深度、瓶頸與 structural encoding', en: 'Lab: depth, bottlenecks, and structural encoding' } },
  'gdl-g8-0': { slug: 'gdl-g8-0-overview', group: 'G9 · Surfaces and Local Frames', title: { zh: '沿曲面走，直線還是最短路嗎？', en: 'Is a straight line still shortest on a surface?' } },
  'gdl-g8-1': { slug: 'gdl-g8-1-foundations', group: 'G9 · Surfaces and Local Frames', title: { zh: '每個位置自己的 tangent plane', en: 'A tangent plane at each position' } },
  'gdl-g8-2': { slug: 'gdl-g8-2-construction', group: 'G9 · Surfaces and Local Frames', title: { zh: '不同位置的箭頭怎麼比較？', en: 'How can we compare arrows at different positions?' } },
  'gdl-g8-3': { slug: 'gdl-g8-3-analysis', group: 'G9 · Surfaces and Local Frames', title: { zh: '換一套 local frame，答案怎麼變？', en: 'How does an answer change with its local frame?' } },
  'gdl-g8-4': { slug: 'gdl-g8-4-limits', group: 'G9 · Surfaces and Local Frames', title: { zh: '曲面上的 kernel，要怎麼配合 local frames？', en: 'How should a surface kernel respect local frames?' } },
  'gdl-surface-layers': { slug: 'gdl-surface-layers', group: 'G9 · Surfaces and Local Frames', title: { zh: '局部運算接成整個網路，還保留哪些幾何關係？', en: 'Which geometric relations survive a full surface network?' } },
  'gdl-g8-5': { slug: 'gdl-g8-5-lab', group: 'G9 · Surfaces and Local Frames', title: { zh: '實作：局部座標系變換的檢查', en: 'Lab: testing changes of local frames' } },
  'gdl-g9-0': { slug: 'gdl-g9-0-overview', group: 'G10 · Approximate Symmetry and Canonicalization', title: { zh: '對稱只近似成立，偏差來自任務還是模型？', en: 'Is approximate symmetry a task or a model mismatch?' } },
  'gdl-g9-2': { slug: 'gdl-g9-2-construction', group: 'G10 · Approximate Symmetry and Canonicalization', title: { zh: '多看幾個視角，或先換到標準視角？', en: 'Multiple views or a canonical view?' } },
  'gdl-g9-3': { slug: 'gdl-g9-3-analysis', group: 'G10 · Approximate Symmetry and Canonicalization', title: { zh: '標準方向突然翻轉，模型會怎樣？', en: 'What happens when a canonical orientation jumps?' } },
  'gdl-g9-4': { slug: 'gdl-g9-4-limits', group: 'G10 · Approximate Symmetry and Canonicalization', title: { zh: '允許偏離對稱時，應保留哪些限制？', en: 'What should remain when symmetry is relaxed?' } },
  'gdl-g9-5': { slug: 'gdl-g9-5-lab', group: 'G10 · Approximate Symmetry and Canonicalization', title: { zh: '實作：近似對稱的效能與一致性', en: 'Lab: performance and consistency with approximate symmetry' } },
  'gdl-g10-0': { slug: 'gdl-g10-0-overview', group: 'G11 · Geometric Generative Models', title: { zh: '生成一個分子，答案是座標還是分布？', en: 'Is a generated molecule a coordinate set or a distribution?' } },
  'gdl-g10-1': { slug: 'gdl-g10-1-foundations', group: 'G11 · Geometric Generative Models', title: { zh: '整體平移與中心化的機率模型', en: 'Translation and centered probability models' } },
  'gdl-g10-2': { slug: 'gdl-g10-2-construction', group: 'G11 · Geometric Generative Models', title: { zh: 'Score 與 velocity 應怎麼隨旋轉變？', en: 'How should scores and velocities transform?' } },
  'gdl-g10-3': { slug: 'gdl-g10-3-analysis', group: 'G11 · Geometric Generative Models', title: { zh: '沿等變 ODE 取樣，分布也會對稱嗎？', en: 'Does an equivariant ODE preserve distributional symmetry?' } },
  'gdl-geometric-sde': { slug: 'gdl-geometric-sde', group: 'G11 · Geometric Generative Models', title: { zh: 'SDE 的每條樣本都不一樣，對稱要怎麼檢查？', en: 'How should we test symmetry in a stochastic sampler?' } },
  'gdl-g10-4': { slug: 'gdl-g10-4-limits', group: 'G11 · Geometric Generative Models', title: { zh: '幾何合理，化學也一定合理嗎？', en: 'Does geometric consistency imply chemical validity?' } },
  'gdl-g10-5': { slug: 'gdl-g10-5-lab', group: 'G11 · Geometric Generative Models', title: { zh: '實作：幾何生成與有效性評估', en: 'Lab: geometric generation and validity evaluation' } },
};

// Old URLs; the redirect pages in pages/(zh/)notes/flow-matching-*.astro now land on the
// notes index because the n2d-* targets are hidden (2026-09-14).
export const legacyNoteRedirects: Record<string, string> = {
  'flow-matching-flow-ode': 'n2d-probability-flow-ode',
  'flow-matching-training': 'n2d-velocity-regression',
};

export const categoryOrder = ['courses', 'research-areas', 'academic-skills'] as const;

// ── Listing tiers ────────────────────────────────────────────────────────────
// What the home page and the notes index show as top-level headings. A tier is the
// ROLE a block plays for the reader, which is why a course and a foundation are not
// in the same bucket even though both are CourseDefs. Order here is the order shown —
// never by note count, so a 52-note course cannot crowd out a 7-note one.
export const tierOrder = ['courses', 'foundations', 'research-areas', 'academic-skills'] as const;
export type NoteTier = (typeof tierOrder)[number];
export const tierLabels: Record<NoteTier, Record<Lang, string>> = {
  courses: { en: 'Courses', zh: '課程' },
  foundations: { en: 'Foundations', zh: '基礎' },
  'research-areas': { en: 'Research Areas', zh: '研究領域' },
  'academic-skills': { en: 'Academic Skills', zh: '學術技能' },
};

export const researchAreaOrder = ['flow-based-generative-modeling', 'geometric-deep-learning'] as const;

export const researchAreaLabels: Record<ResearchAreaKey, Record<Lang, string>> = {
  'flow-based-generative-modeling': {
    en: 'Flow-Based Generative Models',
    zh: 'Flow-Based Generative Models',
  },
  'geometric-deep-learning': {
    en: 'Geometric Deep Learning',
    zh: 'Geometric Deep Learning',
  },
};

// One line per research area, for the home page's condensed notes list.
export const researchAreaDescriptions: Record<ResearchAreaKey, Record<Lang, string>> = {
  'flow-based-generative-modeling': {
    zh: '從一團噪聲到結構化資料：機率路徑、向量場、取樣，以及 diffusion 與 flow matching 的共同核心。',
    en: 'From noise to structured data: probability paths, vector fields, sampling, and the shared core of diffusion and flow matching.',
  },
  'geometric-deep-learning': {
    zh: '從 symmetry 的問題出發，推導 CNN、集合模型、Attention／Transformer 與 GNN，再建立幾何、energy 與 force 的關係。第一階段 G1–G6 共 31 篇；G7–G11 規劃 34 篇擴充。依問題與推導決定每個單元的篇幅。',
    en: 'Designing machine learning models around the geometric and symmetry structure in data: graph neural networks, invariance and equivariance, and applications to molecules, proteins and other structured data.',
  },
};

const groupResearchAreas: Record<string, ResearchAreaKey | undefined> = {
  'From Noise to Data': 'flow-based-generative-modeling',
  'Diffusion & Flow Models': 'flow-based-generative-modeling',
};

export const categoryLabels: Record<(typeof categoryOrder)[number], Record<Lang, string>> = {
  'research-areas': {
    en: 'Research Areas',
    zh: '研究領域',
  },
  courses: {
    en: 'Courses',
    zh: '課程',
  },
  'academic-skills': {
    en: 'Academic Skills',
    zh: '學術技能',
  },
};

export const statusLabels: Record<NoteEntry['data']['status'], Record<Lang, string>> = {
  available: {
    en: 'Available',
    zh: '可閱讀',
  },
  draft: {
    en: 'Draft',
    zh: '草稿',
  },
  missing: {
    en: 'Missing translation',
    zh: '缺少翻譯',
  },
  'coming-soon': {
    en: 'Coming soon',
    zh: '即將推出',
  },
};

// ── Courses ──────────────────────────────────────────────────────────────────
// The "Courses" category renders as: course title → a full lecture roadmap.
// Lectures with no notes yet show as "Coming soon"; the first ready lecture
// opens by default. `group` here must match each note's frontmatter `group`.
/**
 * How a lecture is drawn on the notes sky map (`SkyMap.astro`). Relative to `anchor`
 * (SVG px in a 1120×440 sky); one star per note, in `noteSlugList` order — extra notes
 * beyond the listed stars are placed next to the last one, so adding a note never breaks
 * the picture. `edges` index into `stars`. Only `realm: 'sky'` courses need this.
 */
export interface Constellation {
  anchor: [number, number];
  /** [dx, dy, radius] — radius doubles as brightness. */
  stars: [number, number, number][];
  edges: [number, number][];
}
export interface CourseLectureDef {
  group: string;
  /** Show a roadmap entry before individual articles have been written. */
  planned?: boolean;
  description: Record<Lang, string>;
  /** Stable key so notes can point at a whole week/class with <Ref week="…"/>. */
  label?: string;
  constellation?: Constellation;
  /**
   * `realm: 'lattice'` courses only: the molecular motif this unit is drawn as on the
   * molecule map. Pick the motif whose symmetry IS the unit's topic (see lib/molecules.ts);
   * a unit without one falls back to a ring.
   */
  molecule?: MoleculeMotif;
}
/** Colour family for a course — see `--tone-*` in global.css. */
export type CourseTone = 'dma' | 'gdl' | 'math' | 'ml' | 'neutral';
/** Where the course lives. 'sky' | 'sea' | 'land' place it on the sky map (constellations,
 *  buoys on the sea, lights on the shore). 'lattice' keeps it OFF the sky map entirely — it
 *  gets its own geometric map instead. */
export type CourseRealm = 'sky' | 'sea' | 'land' | 'lattice';
/**
 * How the course is LISTED (home page + notes index): 'course' is something to read through,
 * 'foundation' is a tool layer other notes reuse via `prereqs`. This is listing only — it has
 * nothing to do with `realm`, so a foundation still draws on the sky map exactly as before.
 */
export type CourseKind = 'course' | 'foundation';
export interface CourseDef {
  key: string;
  kind: CourseKind;
  title: Record<Lang, string>;
  /** One line, for the home page's condensed notes list. */
  description: Record<Lang, string>;
  category: (typeof categoryOrder)[number];
  /** Paragraphs shown above this course's map on the notes landing page (falls back to `description`). */
  mapIntro?: Record<Lang, string[]>;
  tone: CourseTone;
  realm: CourseRealm;
  lectures: CourseLectureDef[];
}

export const courses: CourseDef[] = [
  {
    key: 'math-for-dl',
    kind: 'course',
    tone: 'neutral',
    realm: 'land',
    title: {
      en: 'All the Math You Need for Deep Learning',
      zh: 'All the Math You Need for Deep Learning',
    },
    description: {
      zh: '深度學習真正會用到的那些數學，從向量與相似度到 spectral 方法。',
      en: 'The math deep learning actually uses, from vectors and similarity to spectral methods.',
    },
    category: 'courses',
    lectures: [
      {
        group: 'Lecture 1 · Vectors & Similarity',
        description: {
          zh: '把資料變成 vector，再用距離與方向量「像不像」。',
          en: 'Turn data into vectors; compare them with distance and direction.',
        },
      },
      {
        group: 'Lecture 2 · Eigen, SVD & PCA',
        description: {
          zh: '用 eigenvector、SVD、PCA 壓縮與看懂高維資料。',
          en: 'Eigenvectors, SVD, and PCA to compress and visualize high-dimensional data.',
        },
      },
      {
        group: 'Lecture 3 · Spectral Methods',
        description: {
          zh: '同一個 spectral 想法：影像壓縮與圖的分群。',
          en: 'One spectral idea behind image compression and graph clustering.',
        },
      },
      {
        group: 'Lecture 4 · Regression & Least Squares',
        description: {
          zh: '用 feature 預測數值：least squares 與最佳預測。',
          en: 'Predict from features with least squares and the optimal predictor.',
        },
      },
      {
        group: 'Lecture 5 · Gradients & Optimization',
        description: {
          zh: 'gradient、Jacobian、chain rule 與 gradient descent。',
          en: 'Gradients, Jacobians, the chain rule, and gradient descent.',
        },
      },
      {
        group: 'Lecture 6 · Probability & Estimation',
        description: {
          zh: '隨機、期望、變異，以及「差距是不是雜訊」。',
          en: 'Randomness, expectation, spread, and telling real gains from noise.',
        },
      },
      {
        group: 'Lecture 7 · From Probability to Loss',
        description: {
          zh: 'MLE、分類、cross-entropy / KL 與 ELBO。',
          en: 'Maximum likelihood, classification, cross-entropy / KL, and the ELBO.',
        },
      },
      {
        group: 'Lecture 8 · Dynamics & Flows',
        description: {
          zh: 'vector field、ODE，把 noise 流成資料。',
          en: 'Vector fields, ODEs, and flowing noise into data.',
        },
      },
      {
        group: 'Lecture 9 · Reading the Math in Papers',
        description: {
          zh: '把論文公式拆解、重推一次、翻成白話與程式。',
          en: 'Decode, re-derive, and translate the math in real papers.',
        },
      },
      {
        group: 'Lecture 10 · Review & Projects',
        description: {
          zh: '總複習、符號自我檢查與專題。',
          en: 'Review, a notation self-test, and projects.',
        },
      },
    ],
  },
  {
    key: 'diffusion-models-applications',
    kind: 'course',
    mapIntro: {
      zh: [
        '這是一片可以探索diffusion model、flow matching和其相關領域的知識世界：腳下是數學構築的陸地，眼前是機器學習的海洋；再抬頭望去，則是一門門課程組成的星空。',
        '每一顆星，都是一篇筆記；每讀完一篇，就點亮一顆星。從一顆星開始，慢慢點亮屬於你的 DMA 星空吧！',
      ],
      en: [
        'A world of knowledge for exploring diffusion models, flow matching and the fields around them: mathematics is the land underfoot, machine learning the sea ahead, and overhead, a sky made of courses.',
        'Every star is a note; finish one and it lights up. Start with a single star and light up a DMA sky of your own.',
      ],
    },
    tone: 'dma',
    realm: 'sky',
    title: {
      en: 'Diffusion Models and Their Applications',
      zh: 'Diffusion Models and Their Applications',
    },
    description: {
      zh: '從 Diffusion Models 與 Flow Matching 出發，延伸至離散生成、one-step generative models，以及生成時的引導與應用。',
      en: 'From diffusion models and flow matching to discrete generation, one-step models, and guidance at generation time.',
    },
    category: 'courses',
    lectures: [
      {
        group: 'Unit 1 · Diffusion Models',
        label: 'dma-week-diffusion',
        constellation: { anchor: [110, 60], stars: [[0, 70, 3.2], [34, 38, 4.4], [82, 52, 2.8], [118, 18, 3.6], [150, 60, 4.8], [96, 104, 3.0]], edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]] },
        description: {
          zh: '從「生成在學什麼」出發：forward process、denoising 回歸、Tweedie 與 score、DDPM / DDIM / SDE-ODE 反向取樣。',
          en: 'From "what does generation learn" to the forward process, denoising regression, Tweedie & score, and DDPM / DDIM / SDE-ODE sampling.',
        },
      },
      {
        group: 'Unit 2 · Flow Matching',
        label: 'dma-week-flow-matching',
        constellation: { anchor: [70, 300], stars: [[0, 0, 4.6], [52, -22, 3.0], [96, -8, 3.4], [126, -56, 4.2], [178, -40, 2.8], [210, 8, 3.8], [238, -30, 2.9]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6]] },
        description: {
          zh: '從 reference paths 出發，講解 velocity regression 的理論及直觀解釋，介紹 continuity equation 及其直覺含意，並以 DDIM 作為 Flow Matching 與 diffusion model 的橋樑，再推廣到 stochastic interpolants，以及共享相同 marginals 的 ODE／SDE sampler family。',
          en: 'Start from reference paths and explain velocity regression through both theory and intuition. Introduce the continuity equation and its intuitive meaning, use DDIM to bridge Flow Matching and diffusion models, then generalize to stochastic interpolants and a family of ODE/SDE samplers that share the same marginals.',
        },
      },
      {
        group: '作業 · Unit 1–2',
        label: 'dma-week-homework-u1-u2',
        constellation: { anchor: [400, 170], stars: [[0, 0, 3.0], [46, 30, 3.4], [88, 4, 2.8]], edges: [[0, 1], [1, 2]] },
        description: {
          zh: 'Unit 1–2 的作業：把 diffusion 與 flow matching 的推導與實作自己走一遍。',
          en: 'Homework for Units 1–2: work through the diffusion and flow-matching derivations and implementations yourself.',
        },
      },
      {
        group: 'Unit 3 · 減少 ODE 的離散化誤差',
        label: 'dma-week-interpolants',
        constellation: { anchor: [400, 50], stars: [[0, 40, 3.4], [44, 66, 2.9], [78, 24, 4.9], [120, 44, 3.2], [170, 4, 3.0], [214, 36, 4.0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
        description: {
          zh: 'ODE 的離散化誤差從哪裡來？先把沿途的 velocity 變化連到 finite-step error，再走兩條路：用 reflow 或 minibatch OT 改變 learned trajectories，或換一個 numerical solver，讓同樣的計算預算得到更準確的近似。',
          en: 'Where does ODE discretization error come from? Relate velocity variation to finite-step error, then follow two routes: change learned trajectories with reflow or minibatch OT, or use a better numerical solver for a more accurate approximation under the same compute budget.',
        },
      },
      {
        group: 'Unit 4 · Discrete Diffusion',
        label: 'dma-week-discrete-i',
        constellation: { anchor: [340, 252], stars: [[0, 0, 3.0], [24, 38, 4.4], [56, 18, 3.2], [80, 62, 3.6], [108, 6, 2.8], [136, 42, 4.4], [164, 16, 3.4], [188, 60, 4.0], [118, 90, 3.0], [212, 92, 3.2]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [3, 8], [7, 9]] },
        description: {
          zh: '從 token 的加噪與去噪出發，推導 masked cross-entropy，再問平行抽樣漏掉了什麼、填錯能不能重改；用 CTMC、反向 rate 與 remasking 回答，最後接到 Discrete Flow Matching。兩次課堂實作分別檢查因子化誤差與 rate 取樣。',
          en: 'Corrupt and denoise tokens, derive masked cross-entropy, then examine parallel-sampling errors and revision. CTMCs, reverse rates, and remasking lead to Discrete Flow Matching, with two labs on factorization and rate-based sampling.',
        },
      },
      {
        group: 'Unit 5 · Consistency Models',
        label: 'dma-week-consistency',
        constellation: { anchor: [800, 82], stars: [[0, 0, 4.8], [46, 36, 3.0], [90, 22, 3.4], [124, 66, 4.4], [160, 30, 2.8], [190, 90, 3.4], [230, 58, 4.0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6]] },
        description: {
          zh: '能不能直接學「一步」？progressive distillation、consistency function 與自我一致性、CD 與 CT、iCT / sCM 各對付哪個誤差，以及多步 CM 為什麼很快飽和。',
          en: 'Can we learn the one-step map directly? Progressive distillation, the consistency function and self-consistency, CD vs. CT, which error each iCT / sCM trick fights, and why multistep CM saturates.',
        },
      },
      {
        group: 'Unit 6 · Consistency Trajectory Model and Flow Map',
        label: 'dma-week-flow-maps',
        constellation: { anchor: [900, 280], stars: [[0, 20, 3.2], [30, -30, 4.6], [84, -46, 3.0], [130, -20, 3.6], [150, 40, 4.4], [112, 72, 2.8], [60, 50, 3.4]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
        description: {
          zh: '從 CTM 首先提出的任意 t→s 跳躍出發，再把它整理成 flow map：四個條件、Flow Map Matching 的三種損失、MeanFlow identity、Shortcut / AYF，以及回歸式與分佈匹配式（DMD）蒸餾的失敗模式。',
          en: 'Start from CTM\'s arbitrary t→s traversal, then organize it as a flow map: four defining conditions, the three Flow Map Matching losses, the MeanFlow identity, Shortcut / AYF, and failure modes of regression versus distribution-matching (DMD) distillation.',
        },
      },
      {
        group: 'Unit 7 · Test-time Guidance',
        label: 'dma-week-guidance',
        constellation: { anchor: [630, 260], stars: [[0, 22, 3.1], [28, -14, 3.6], [64, 18, 3.0], [94, -28, 4.0], [128, 8, 3.3], [102, 52, 2.9], [52, 58, 3.5]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
        description: {
          zh: '模型訓練好之後，如何在 sampling 時加入新的 condition、observation 或 reward？從 classifier guidance、CFG 與 reward tilting，走到 black-box rewards 的 Best-of-N、Feynman–Kac／SMC、SPT，以及 inverse problems、data assimilation、planning 與 scientific design。',
          en: 'How can a trained model incorporate a new condition, observation, or reward at sampling time? From classifier guidance, CFG, and reward tilting to Best-of-N, Feynman–Kac/SMC, SPT, inverse problems, data assimilation, planning, and scientific design.',
        },
      },
    ],
  },
  {
    key: 'geometric-deep-learning',
    kind: 'course',
    mapIntro: {
      zh: [
        '這是一片可以探索 geometric deep learning 與 symmetry 的知識世界：每一個單元都是一種分子，而那個分子的形狀，隱約的藏著這個單元要講的對稱——不斷重複的長鏈、可以旋轉的環、任意交換也不變的配體，還有照鏡子也疊不回去的手性。',
        '每一顆原子，都是一篇筆記；每讀完一篇，就點亮一顆原子，讀完一個單元，整個分子就會亮起來。從一顆原子開始，慢慢組出屬於你的 GDL 分子吧！',
      ],
      en: [
        'A world of knowledge for exploring geometric deep learning and symmetry: each unit is a molecule, and hidden in the shape of that molecule is the symmetry the unit is about — a chain that repeats, a ring that turns, ligands you can swap without changing a thing, and a handedness no mirror can undo.',
        'Every atom is a note; finish one and it lights up, and finish a unit to light up the whole molecule. Start with a single atom and build a GDL molecule of your own.',
      ],
    },
    tone: 'gdl',
    realm: 'lattice',
    title: {
      en: 'Geometric Deep Learning',
      zh: 'Geometric Deep Learning',
    },
    description: {
      zh: '從 symmetry 的問題出發，推導運算限制、交代設計選擇，再構造 CNN、集合模型、Attention／Transformer 與 GNN，並建立幾何、energy 與 force 的關係。第一階段 G1–G6 共 31 篇；G7–G11 規劃 34 篇擴充。',
      en: 'Designing machine learning models around the geometric and symmetry structure in data: graph neural networks, invariance and equivariance, and applications to molecules, proteins and other structured data.',
    },
    category: 'courses',
    lectures: [
      {
        "group": "G1 · Symmetry and Translation",
        "label": "gdl-unit-map-views",
        "molecule": "chain",
        "description": {
          "zh": "地圖轉過去，答案怎麼變？從輸出 action、group 與 convolution 的共享推導，到 layer composition、boundary 與實作測試。",
          "en": "Output actions, groups, convolutional sharing, composition, boundaries, and translation tests."
        }
      },
      {
        "group": "G2 · Rotations and Feature Types",
        "label": "gdl-unit-rotations",
        "molecule": "ring",
        "description": {
          "zh": "普通 CNN 為什麼不自動跟著旋轉？從四方向 detector、group convolution 與 feature types，推導 readout 並逐一測試 C4。",
          "en": "Orientation channels, group convolution, feature types, readouts, and C4 tests."
        }
      },
      {
        "group": "G3 · Sets and Permutations",
        "label": "gdl-unit-sets-graphs",
        "molecule": "star",
        "description": {
          "zh": "名單順序沒有意義，內容仍要留下：從 Deep Sets、逐點共享到 PointNet，最後問每個點是否都要讀同一份摘要。",
          "en": "Deep Sets, per-point sharing, and PointNet; where a shared summary falls short."
        }
      },
      {
        "group": "G4 · Attention and Transformers",
        "label": "gdl-unit-attention",
        "molecule": "clique",
        "description": {
          "zh": "每個點要參考誰？先用排列要求限制內容權重，再構造 Q／K／V 與 Transformer block，分清設計選擇、真實順序與關係 mask，最後用程式檢查。",
          "en": "Content-dependent attention, Q/K/V, permutation equivariance, Transformer blocks, order, relations, and tests."
        }
      },
      {
        "group": "G5 · Graphs and Message Passing",
        "label": "gdl-unit-graphs",
        "molecule": "tree",
        "description": {
          "zh": "道路關係要留下，node 編號要忽略：從重編要求構造共享訊息與鄰居摘要，再討論 GCN、GIN 與 1-WL 的限制，檢查重編與不可辨識例子。",
          "en": "Relabeling, message passing, GCN, GIN, and expressivity limits."
        }
      },
      {
        "group": "G6 · Euclidean Geometry",
        "label": "gdl-unit-frontiers",
        "molecule": "chiral",
        "description": {
          "zh": "座標與箭頭不能用同一種 action：相對幾何、EGNN、energy-gradient forces 與鏡像，逐一檢查聯合對稱。",
          "en": "Relative geometry, EGNN, energy-gradient forces, and chirality."
        }
      },
      {
        "group": "G7 · Tensor Features",
        "planned": true,
        "label": "gdl-unit-tensors",
        "molecule": "orbital",
        "description": {
          "zh": "擴充規劃（7 篇）：從 scalar／vector 的不足出發，分開引入 spherical harmonics、feature 的旋轉型態、tensor products 與 layer，再檢查 parity 與實作。",
          "en": "Planned expansion."
        }
      },
      {
        "group": "G8 · Graph Structure and Spectral Methods",
        "planned": true,
        "label": "gdl-unit-graph-structure",
        "molecule": "fused",
        "description": {
          "zh": "擴充規劃（8 篇）：分開建立 Laplacian、graph frequency 與 spectral filtering，再分析 oversmoothing、oversquashing，最後比較補充結構與遠方資訊的方法。",
          "en": "Planned expansion."
        }
      },
      {
        "group": "G9 · Surfaces and Local Frames",
        "planned": true,
        "label": "gdl-unit-surfaces",
        "molecule": "bowl",
        "description": {
          "zh": "擴充規劃（7 篇）：從曲面行走建立 tangent plane，再分開處理方向比較、local frame 的變換、kernel 與完整網路的相容條件。",
          "en": "Planned expansion."
        }
      },
      {
        "group": "G10 · Approximate Symmetry and Canonicalization",
        "planned": true,
        "label": "gdl-unit-approximate-symmetry",
        "molecule": "distorted",
        "description": {
          "zh": "擴充規劃（5 篇）：把近似對稱的問題與偏差量測放在同一篇，再比較多視角與 canonicalization，檢查不連續、放寬限制及實驗。",
          "en": "Planned expansion."
        }
      },
      {
        "group": "G11 · Geometric Generative Models",
        "planned": true,
        "label": "gdl-unit-geometric-generation",
        "molecule": "cloud",
        "description": {
          "zh": "擴充規劃（7 篇）：從座標與分布分開的要求出發，建立中心化、score／velocity action，再分別檢查 ODE、SDE 的取樣對稱與化學有效性。",
          "en": "Planned expansion."
        }
      }
    ],
  },
  {
    key: 'mathematical-foundations',
    kind: 'foundation',
    tone: 'math',
    realm: 'land',
    title: {
      en: 'Mathematical Foundations',
      zh: 'Mathematical Foundations',
    },
    description: {
      zh: '以淺顯易懂的方式介紹機器學習中常見的數學工具，以及本網站其他相關課程所需的數學知識。',
      en: 'A plain-language introduction to the mathematical tools that recur in machine learning, and to the mathematics the other courses on this site rely on.',
    },
    category: 'courses',
    lectures: [
      {
        group: 'M0 · Calculus 工具箱',
        label: 'math-class-calculus',
        description: {
          zh: 'gradient 與方向、divergence 與通量、Taylor 展開與「假設直線」、微分穿過積分與沿路徑的全導數。',
          en: 'Gradient and direction, divergence and flux, Taylor expansion and "assume a straight line", differentiating under the integral and the total derivative along a path.',
        },
      },
      {
        group: 'M1 · 機率與 Conditional Expectation',
        label: 'math-class-probability',
        description: {
          zh: '多變量 Gaussian、conditional expectation、MSE 的最小值、Bayes 與 posterior，以及去噪就是取 posterior mean（Tweedie）。',
          en: 'Multivariate Gaussians, conditional expectation, the minimizer of MSE, Bayes and the posterior, and denoising as the posterior mean (Tweedie).',
        },
      },
      {
        group: 'M2 · Deterministic Dynamics',
        label: 'math-class-deterministic-dynamics',
        description: {
          zh: 'vector field 與 ODE、pushforward 與 flow map、continuity equation、Euler 法的誤差與高階方法。',
          en: 'Vector fields and ODEs, pushforward and flow maps, the continuity equation, Euler error and higher-order methods.',
        },
      },
      {
        group: 'M3 · Stochastic Dynamics',
        label: 'math-class-stochastic-dynamics',
        description: {
          zh: '從 random walk 到 Brownian motion、SDE 是加了噪聲的 ODE、Fokker–Planck、Langevin 與 stationary distribution、weak 與 strong convergence。',
          en: 'From random walks to Brownian motion, SDEs as noisy ODEs, Fokker–Planck, Langevin and stationary distributions, weak vs. strong convergence.',
        },
      },
      {
        group: 'M4 · Markov Chains',
        label: 'math-class-markov-chains',
        description: {
          zh: 'Markov chain 與 transition matrix、absorbing state、continuous-time Markov chain 與 rate matrix、時間反轉與比值。',
          en: 'Markov chains and transition matrices, absorbing states, continuous-time Markov chains and rate matrices, time reversal and ratios.',
        },
      },
      {
        group: 'M5 · Optimization、Convexity 與距離',
        label: 'math-class-optimization',
        description: {
          zh: 'Jensen 不等式、KL divergence 與 cross-entropy、移動目標與 EMA、對 generator 微分（KL 的梯度是兩個 score 的差）。',
          en: 'Jensen\'s inequality, KL divergence and cross-entropy, moving targets and EMA, differentiating through a generator (the KL gradient is a difference of scores).',
        },
      },
      {
        group: 'M6 · Optimal Transport',
        label: 'math-class-optimal-transport',
        description: {
          zh: '搬倉庫問題（Monge / Kantorovich）、W₂ 距離、一維與 monotone 配對、大規模近似（Sinkhorn、minibatch）。',
          en: 'The warehouse problem (Monge / Kantorovich), the W₂ distance, one-dimensional monotone matching, and large-scale approximations (Sinkhorn, minibatch).',
        },
      },
    ],
  },
  {
    key: 'machine-learning-foundations',
    kind: 'foundation',
    tone: 'ml',
    realm: 'sea',
    title: {
      en: 'Machine Learning Foundations',
      zh: 'Machine Learning Foundations',
    },
    description: {
      zh: '介紹機器學習的核心概念、方法與實務，建立理解、分析與應用不同機器學習模型的基礎。',
      en: 'The core concepts, methods and practice of machine learning — the basis for understanding, analyzing and applying different models.',
    },
    category: 'courses',
    lectures: [
      {
        group: 'L0 · 學習就是擬合',
        label: 'ml-class-fitting',
        description: {
          zh: '監督式學習的三要素、損失函數決定你學到什麼、母體風險與經驗風險的差距，以及梯度下降的一頁。',
          en: 'The three ingredients of supervised learning, how the loss decides what you learn, population vs. empirical risk, and gradient descent on one page.',
        },
      },
      {
        group: 'L1 · 泛化：過擬合、欠擬合與資料切分',
        label: 'ml-class-generalization',
        description: {
          zh: '背答案與學規則、bias–variance 分解、train / validation / test 的角色與資料洩漏、交叉驗證，以及用學習曲線開處方。',
          en: 'Memorizing vs. learning, the bias–variance decomposition, the roles of train / validation / test and how leakage happens, cross-validation, and reading learning curves as a diagnosis.',
        },
      },
      {
        group: 'L2 · 實務中的最佳化',
        label: 'ml-class-optimization',
        description: {
          zh: 'minibatch 梯度的噪聲、學習率與 Adam、移動目標與 EMA、正則化與提早停止、損失曲面與初始化。',
          en: 'Minibatch gradient noise, learning rates and Adam, moving targets and EMA, regularization and early stopping, loss landscapes and initialization.',
        },
      },
      {
        group: 'L3 · 實驗方法與超參數搜尋',
        label: 'ml-class-experiments',
        description: {
          zh: '參數與超參數的分界、grid / random / Bayesian 搜尋、巢狀驗證與 winner\'s curse、跨種子變異數與誠實報告。',
          en: 'Parameters vs. hyperparameters, grid / random / Bayesian search, nested validation and the winner\'s curse, seed variance and honest reporting.',
        },
      },
      {
        group: 'L4 · 常見架構：結構對應歸納偏置',
        label: 'ml-class-architectures',
        description: {
          zh: 'MLP 與「什麼都能擬合」、反向傳播、卷積與平移等變、U-Net 與殘差、注意力與 Transformer、條件與時間怎麼注入。',
          en: 'MLPs and universal approximation, backpropagation, convolution and translation equivariance, U-Nets and residuals, attention and Transformers, and how conditioning and time are injected.',
        },
      },
      {
        group: 'L5 · 機率建模與生成模型的評估',
        label: 'ml-class-probabilistic',
        description: {
          zh: '最大似然與 KL、潛在變數與 ELBO、自回歸分解與因子化假設，以及怎麼評估一個生成模型。',
          en: 'Maximum likelihood and KL, latent variables and the ELBO, autoregressive factorization and independence assumptions, and how to evaluate a generative model.',
        },
      },
    ],
  },
];

// ── Visibility control ───────────────────────────────────────────────────────
// Hide a whole section from the site with ONE edit here. A hidden group/course is
// removed from every listing, the home page, search, and RSS, and its pages are not
// built at all (the URLs 404). To HIDE a section, add its label/key to the set;
// to RELEASE it, delete that line. Nothing else needs to change.
//
//   hiddenGroups      — research-area group labels (frontmatter `group`)
//   hiddenCourseKeys  — course keys from the `courses` array above
export const hiddenGroups = new Set<string>([
  // Retired 2026-09-14: superseded by the "Diffusion Models and Their Applications"
  // course. Hiding both groups empties the "Flow-Based Generative Models" research
  // area, so the area card / index section disappear with them.
  'From Noise to Data',
  'Diffusion & Flow Models',
]);
export const hiddenCourseKeys = new Set<string>([
  'math-for-dl',
]);

const lectureGroupToCourseKey = new Map<string, string>();
for (const course of courses) {
  for (const lecture of course.lectures) lectureGroupToCourseKey.set(lecture.group, course.key);
}
export function courseKeyForGroup(group: string): string | undefined {
  return lectureGroupToCourseKey.get(group);
}
export function courseByKey(key: string): CourseDef | undefined {
  return courses.find((course) => course.key === key);
}
export function lectureByLabel(label: string): { course: CourseDef; lecture: CourseLectureDef } | undefined {
  if (label === 'dma-week-discrete-ii') label = 'dma-week-discrete-i';
  for (const course of courses) {
    const lecture = course.lectures.find((l) => l.label === label);
    if (lecture) return { course, lecture };
  }
  return undefined;
}
export function noteOrderIndex(slug: string): number {
  return noteOrder.get(slug) ?? 999;
}

export function isHiddenNote(note: NoteEntry): boolean {
  if (hiddenGroups.has(note.data.group)) return true;
  const courseKey = lectureGroupToCourseKey.get(note.data.group);
  return courseKey ? hiddenCourseKeys.has(courseKey) : false;
}

// The single predicate every listing / page-builder should use: listed (not the
// archived legacy notes) AND not currently hidden.
export function isPublishedNote(note: NoteEntry): boolean {
  return isListedNote(note) && !isHiddenNote(note);
}

/**
 * How many notes outside a foundation course declare one of its notes as a prereq.
 * This is what a foundation card shows instead of a reading progress bar: nobody reads
 * the tool layer front to back, so "reused by N notes" is the honest measure.
 */
export function foundationReuse(notes: NoteEntry[], courseKey: string): number {
  const course = courseByKey(courseKey);
  if (!course) return 0;
  const groups = new Set(course.lectures.map((l) => l.group));
  const own = notes.filter((n) => groups.has(n.data.group));
  const keys = new Set<string>();
  for (const n of own) {
    keys.add(n.data.slug);
    if (n.data.label) keys.add(n.data.label);
  }
  let count = 0;
  for (const n of notes) {
    if (groups.has(n.data.group)) continue;
    if (n.data.prereqs.some((p) => keys.has(p))) count++;
  }
  return count;
}

export interface CourseLectureView {
  group: string;
  description: string;
  comingSoon: boolean;
  /** First lecture with notes: its opening note is flagged "start here". */
  startHere: boolean;
  notes: NoteEntry[];
}
export interface CourseView {
  key: string;
  title: string;
  lectures: CourseLectureView[];
  /** Lectures that actually have notes, and the total across them. */
  readyLectureCount: number;
  noteCount: number;
}

export function courseSections(notes: NoteEntry[], lang: Lang): CourseView[] {
  const listed = notes.filter(isPublishedNote);
  return courses
    .filter((course) => !hiddenCourseKeys.has(course.key))
    .map((course) => {
    const lectures: CourseLectureView[] = course.lectures.map((lecture) => {
      const lectureNotes = sortNotes(
        listed.filter(
          (note) => note.data.category === course.category && note.data.group === lecture.group,
        ),
      );
      return {
        group: lecture.group,
        description: lecture.description[lang],
        comingSoon: lectureNotes.length === 0,
        startHere: false,
        notes: lectureNotes,
      };
    });
    const firstReady = lectures.find((lecture) => !lecture.comingSoon);
    if (firstReady) firstReady.startHere = true;
    return {
      key: course.key,
      title: course.title[lang],
      lectures,
      readyLectureCount: lectures.filter((lecture) => !lecture.comingSoon).length,
      noteCount: lectures.reduce((sum, lecture) => sum + lecture.notes.length, 0),
    };
  });
}

// ── Home page: one card per top-level heading ─────────────────────────────────
// The notes index shows three levels (course → lecture → note). The home page
// shows only the first: each course, research area, or standalone group becomes
// one card that links into the index. Nothing here is hand-maintained — titles,
// descriptions and counts all come from the same tables the index uses.
export interface HomeSectionItem {
  /** Anchor id on the notes index; the index opens and scrolls to it. */
  id: string;
  title: string;
  description: string;
  noteCount: number;
  /** Lectures / groups underneath, when there is more than one. */
  unitCount: number;
  latest?: Date;
  /** Foundations only: how many notes elsewhere reuse this one. */
  reuse?: number;
}
export interface HomeSection {
  tier: NoteTier;
  items: HomeSectionItem[];
}

/** Anchor ids, shared by the home page's links and the notes index's targets. */
export const courseAnchor = (key: string) => `course-${key}`;
export const areaAnchor = (area: ResearchAreaKey) => `area-${area}`;
export const groupAnchor = (group: string) => {
  const slug = group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  // A group named only in Chinese slugs to the empty string; keep it addressable.
  return 'group-' + (slug || encodeURIComponent(group));
};

export function homeSections(notes: NoteEntry[], lang: Lang): HomeSection[] {
  // One entry per slug (a note exists in both languages) so counts are notes, not files.
  const listed = notesForListingLang(notes, lang);
  const sections: HomeSection[] = [];

  // Courses and foundations are both CourseDefs; `kind` decides which heading they sit under.
  const views = courseSections(listed, lang).filter((course) => course.noteCount > 0);
  const toItem = (course: CourseView): HomeSectionItem => {
    const def = courseByKey(course.key);
    return {
      id: courseAnchor(course.key),
      title: course.title,
      description: def ? def.description[lang] : '',
      noteCount: course.noteCount,
      unitCount: course.readyLectureCount,
      latest: latestNoteDate(course.lectures.flatMap((lecture) => lecture.notes)),
    };
  };

  const courseItems = views
    .filter((course) => courseByKey(course.key)?.kind !== 'foundation')
    .map(toItem);
  if (courseItems.length > 0) sections.push({ tier: 'courses', items: courseItems });

  const foundationItems = views
    .filter((course) => courseByKey(course.key)?.kind === 'foundation')
    .map((course) => ({ ...toItem(course), reuse: foundationReuse(listed, course.key) }));
  if (foundationItems.length > 0) sections.push({ tier: 'foundations', items: foundationItems });

  // Research areas: the area label is the top-level heading. Empty today (every area group is
  // hidden), so the heading simply does not render; adding a research-area note brings it back.
  const areaItems: HomeSectionItem[] = [];
  for (const area of researchAreaOrder) {
    const inArea = listed.filter(
      (n) => n.data.category === 'research-areas' && noteResearchArea(n) === area,
    );
    if (inArea.length === 0) continue;
    areaItems.push({
      id: areaAnchor(area),
      title: researchAreaLabels[area][lang],
      description: researchAreaDescriptions[area][lang],
      noteCount: inArea.length,
      unitCount: new Set(inArea.map((n) => n.data.group)).size,
      latest: latestNoteDate(inArea),
    });
  }
  if (areaItems.length > 0) sections.push({ tier: 'research-areas', items: areaItems });

  // Academic skills have no course or area layer, so the group itself is the top.
  const skills = listed.filter((n) => n.data.category === 'academic-skills');
  const skillGroups = [...new Set(sortNotes(skills).map((n) => n.data.group))];
  const skillItems: HomeSectionItem[] = skillGroups.map((group) => {
    const inGroup = skills.filter((n) => n.data.group === group);
    return {
      id: groupAnchor(group),
      title: group,
      description: groupMeta[group]?.description?.[lang] ?? '',
      noteCount: inGroup.length,
      unitCount: 1,
      latest: latestNoteDate(inGroup),
    };
  });
  if (skillItems.length > 0) sections.push({ tier: 'academic-skills', items: skillItems });

  // Fixed tier order — never by note count, so the biggest course cannot take over the page.
  return sections.sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));
}

export function noteRoute(slug: string, lang: Lang): string {
  return lang === 'zh' ? `zh/notes/${slug}` : `notes/${slug}`;
}

export function notesIndexRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/notes' : 'notes';
}

/**
 * Where a note link should go. A translation marked `missing` never gets a page, so it
 * links to the other language's page instead (the notes index has always done this;
 * every new listing must too, or the English site 404s on Chinese-only notes).
 */
export function noteHref(note: NoteEntry): string {
  if (note.data.status !== 'missing') return noteRoute(note.data.slug, note.data.lang);
  return noteRoute(note.data.slug, note.data.lang === 'zh' ? 'en' : 'zh');
}

/** The course map page (`CourseMap.astro`): every course with notes gets one. */
export function courseRoute(key: string, lang: Lang): string {
  return lang === 'zh' ? `zh/notes/course/${key}` : `notes/course/${key}`;
}

/** Anchor of one lecture on its course page / the notes index list. */
export const lectureAnchor = (group: string) => groupAnchor(group);

/** Tone of the course a note belongs to ('neutral' outside courses). */
export function noteTone(note: NoteEntry): CourseTone {
  const key = courseKeyForGroup(note.data.group);
  return (key && courseByKey(key)?.tone) || 'neutral';
}

export function sortNotes(notes: NoteEntry[]): NoteEntry[] {
  return [...notes].sort((a, b) => {
    const categoryDelta = categoryOrder.indexOf(a.data.category) - categoryOrder.indexOf(b.data.category);
    if (categoryDelta !== 0) return categoryDelta;
    const areaDelta = researchAreaIndex(a) - researchAreaIndex(b);
    if (areaDelta !== 0) return areaDelta;
    const aGroupIndex = groupOrderIndex(a.data.group);
    const bGroupIndex = groupOrderIndex(b.data.group);
    const groupDelta =
      aGroupIndex === bGroupIndex
        ? a.data.group.localeCompare(b.data.group)
        : aGroupIndex - bGroupIndex;
    if (groupDelta !== 0) return groupDelta;
    return (noteOrder.get(a.data.slug) ?? 999) - (noteOrder.get(b.data.slug) ?? 999);
  });
}

export function notesForLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  return sortNotes(notes.filter((note) => note.data.lang === lang && isPublishedNote(note)));
}

export function notesForListingLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  const listedNotes = notes.filter(isPublishedNote);
  const slugs = [...new Set(listedNotes.map((note) => note.data.slug))];
  const selected = slugs
    .map((slug) => {
      const entries = listedNotes.filter((note) => note.data.slug === slug);
      return entries.find((note) => note.data.lang === lang) || entries.find((note) => note.data.lang !== lang);
    })
    .filter((note): note is NoteEntry => Boolean(note));

  return sortNotes(selected);
}

export function findNote(notes: NoteEntry[], slug: string, lang: Lang): NoteEntry | undefined {
  return notes.find((note) => note.data.slug === slug && note.data.lang === lang);
}

export function groupNotes(notes: NoteEntry[]) {
  return categoryOrder
    .map((category) => {
      const categoryNotes = sortNotes(notes.filter((note) => note.data.category === category && isPublishedNote(note)));
      const areas =
        category === 'research-areas'
          ? researchAreaOrder
              .map((area) => ({
                area,
                groups: groupsForNotes(categoryNotes.filter((note) => noteResearchArea(note) === area)),
              }))
              .filter((areaGroup) => areaGroup.groups.length > 0)
          : [
              {
                area: undefined,
                groups: groupsForNotes(categoryNotes),
              },
            ].filter((areaGroup) => areaGroup.groups.length > 0);

      return { category, areas };
    })
    .filter((categoryGroup) => categoryGroup.areas.length > 0);
}

export function siblingNotes(notes: NoteEntry[], entry: NoteEntry) {
  const siblings = notesForLang(notes, entry.data.lang).filter(
    (note) => note.data.category === entry.data.category && note.data.group === entry.data.group,
  );
  const index = siblings.findIndex((note) => note.data.slug === entry.data.slug);

  return {
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

export function latestNoteDate(notes: NoteEntry[]): Date | undefined {
  return notes.reduce<Date | undefined>((latest, note) => {
    if (!latest || note.data.updated > latest) return note.data.updated;
    return latest;
  }, undefined);
}

export function formatNoteDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

export function isListedNote(note: NoteEntry): boolean {
  return !archivedNoteSlugs.has(note.data.slug);
}

export function noteResearchArea(note: NoteEntry): ResearchAreaKey | undefined {
  return note.data.category === 'research-areas' ? groupResearchAreas[note.data.group] : undefined;
}

export function researchAreaLabelForNote(note: NoteEntry, lang: Lang): string | undefined {
  const area = noteResearchArea(note);
  return area ? researchAreaLabels[area][lang] : undefined;
}

function researchAreaIndex(note: NoteEntry): number {
  const area = noteResearchArea(note);
  return area ? researchAreaOrder.indexOf(area) : researchAreaOrder.length;
}

function groupsForNotes(notes: NoteEntry[]) {
  return [...new Set(notes.map((note) => note.data.group))].map((group) => ({
    group,
    notes: notes.filter((note) => note.data.group === group),
  }));
}
