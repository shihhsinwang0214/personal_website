import type { CollectionEntry } from 'astro:content';

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
  'dma-w5-1-sampler-family',
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
  'dma-w6-2-masked-diffusion',
  'dma-w6-3-factorization-error',
  'dma-w6-4-absorbing-vs-uniform',
  'dma-w6-5-lab',
  'dma-w7-0-why-continuous-time',
  'dma-w7-1-ctmc',
  'dma-w7-2-concrete-score',
  'dma-w7-3-remasking',
  'dma-w7-4-discrete-flow-matching',
  'dma-w7-5-applications',
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
  // Invariance and Equivariance — geometric deep learning bridge notes
  'map-view-invariance-equivariance',
  'cnn-translation-equivariance-from-map-views',
  'sets-and-point-clouds-permutation-invariance',
  'gnn-permutation-equivariance-road-networks',
  'rotation-and-group-equivariant-cnns',
  'euclidean-equivariant-gnns-point-clouds',
  'frontiers-of-equivariant-learning',
  'writing-compelling-introduction',
  'academic-website-starter-prompt',
] as const;

const noteOrder = new Map(noteSlugList.map((slug, index) => [slug, index]));
const archivedNoteSlugs = new Set(['flow-matching-flow-ode', 'flow-matching-training']);

// Display order for note groups within each category/area. Listed explicitly so
// the order is intentional (e.g. "From Noise to Data" before "Diffusion & Flow
// Models", and "Lecture 10 · …" after "Lecture 2 · …" — a string compare fails both).
const groupOrder = [
  // Research Areas
  'From Noise to Data',
  'Diffusion & Flow Models',
  'Invariance and Equivariance',
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
  'Unit 3 · Stochastic Interpolants 與共用技巧',
  'Unit 4 · Discrete Diffusion I',
  'Unit 5 · Discrete Diffusion II',
  'Unit 6 · Consistency Models',
  'Unit 7 · Flow Maps 與分佈匹配',
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
  'Invariance and Equivariance': {
    description: {
      zh: 'geometric deep learning：把對稱性（invariance / equivariance）寫進模型。',
      en: 'Geometric deep learning: building symmetry (invariance / equivariance) into models.',
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
};

// Old URLs; the redirect pages in pages/(zh/)notes/flow-matching-*.astro now land on the
// notes index because the n2d-* targets are hidden (2026-09-14).
export const legacyNoteRedirects: Record<string, string> = {
  'flow-matching-flow-ode': 'n2d-probability-flow-ode',
  'flow-matching-training': 'n2d-velocity-regression',
};

export const categoryOrder = ['courses', 'research-areas', 'academic-skills'] as const;

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
    zh: '介紹如何利用資料中的幾何與對稱結構設計機器學習模型，涵蓋圖神經網路、不變性與等變性，以及分子、蛋白質與其他結構化資料上的應用。',
    en: 'Designing machine learning models around the geometric and symmetry structure in data: graph neural networks, invariance and equivariance, and applications to molecules, proteins and other structured data.',
  },
};

const groupResearchAreas: Record<string, ResearchAreaKey | undefined> = {
  'From Noise to Data': 'flow-based-generative-modeling',
  'Diffusion & Flow Models': 'flow-based-generative-modeling',
  'Invariance and Equivariance': 'geometric-deep-learning',
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
  description: Record<Lang, string>;
  /** Stable key so notes can point at a whole week/class with <Ref week="…"/>. */
  label?: string;
  constellation?: Constellation;
}
/** Colour family for a course — see `--tone-*` in global.css. */
export type CourseTone = 'dma' | 'math' | 'ml' | 'neutral';
/** Where the course lives on the notes sky map: constellations, buoys on the sea, lights on the shore. */
export type CourseRealm = 'sky' | 'sea' | 'land';
export interface CourseDef {
  key: string;
  title: Record<Lang, string>;
  /** One line, for the home page's condensed notes list. */
  description: Record<Lang, string>;
  category: (typeof categoryOrder)[number];
  tone: CourseTone;
  realm: CourseRealm;
  lectures: CourseLectureDef[];
}

export const courses: CourseDef[] = [
  {
    key: 'math-for-dl',
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
    tone: 'dma',
    realm: 'sky',
    title: {
      en: 'Diffusion Models and Their Applications',
      zh: 'Diffusion Models and Their Applications',
    },
    description: {
      zh: '從 Diffusion Models 與 Flow Matching 出發，延伸至離散生成、one-step generative models，以及科學與工程上的應用場景。',
      en: 'Starting from diffusion models and flow matching, extending to discrete generation, one-step generative models, and applications across science and engineering.',
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
          zh: '從 reference paths 與 velocity regression 出發，經 continuity equation 接上 DDIM，再推廣到 stochastic interpolants，以及共享相同 marginals 的 ODE／SDE sampler family。',
          en: 'From reference paths and velocity regression through the continuity equation and DDIM, then on to stochastic interpolants and a family of ODE/SDE samplers with shared marginals.',
        },
      },
      {
        group: 'Unit 3 · 更直、更快的生成路徑',
        label: 'dma-week-interpolants',
        constellation: { anchor: [400, 50], stars: [[0, 40, 3.4], [44, 66, 2.9], [78, 24, 4.9], [120, 44, 3.2], [170, 4, 3.0], [214, 36, 4.0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
        description: {
          zh: '直線 reference paths 為什麼仍會產生彎曲的 ODE trajectories？從 curvature 與有限步誤差出發，再用 reflow、minibatch OT 與共用技巧讓生成更直、更快。',
          en: 'Why can straight reference paths still produce curved ODE trajectories? Connect curvature to finite-step error, then use reflow, minibatch OT, and shared techniques to make generation straighter and faster.',
        },
      },
      {
        group: 'Unit 4 · Discrete Diffusion I',
        label: 'dma-week-discrete-i',
        constellation: { anchor: [340, 262], stars: [[0, 0, 3.0], [28, 46, 4.4], [74, 32, 3.2], [112, 70, 3.6], [136, 18, 2.8], [180, 50, 4.0]], edges: [[0, 1], [1, 2], [2, 3], [3, 5], [2, 4]] },
        description: {
          zh: '資料是 token 時怎麼「加噪聲」？離散是狀態不是時間；D3PM 的轉移矩陣、masked diffusion 塌成加權 cross-entropy、因子化誤差是離散版的曲率。',
          en: 'How to "add noise" to tokens: discrete states, not discrete time; D3PM transition matrices, masked diffusion as weighted cross-entropy, and factorization error as the discrete analogue of curvature.',
        },
      },
      {
        group: 'Unit 5 · Discrete Diffusion II',
        label: 'dma-week-discrete-ii',
        constellation: { anchor: [590, 246], stars: [[0, 30, 3.6], [38, -12, 2.8], [64, 42, 4.6], [118, 26, 3.2], [150, -30, 3.0], [186, 4, 4.2], [226, -24, 2.9]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6]] },
        description: {
          zh: '連續時間 Markov chain 的語言：rate、forward equation 與 Fokker–Planck 並排；反向 rate 需要的是比值（concrete score）；remasking 是取樣器的設計選擇；discrete flow matching 與應用。',
          en: 'The language of continuous-time Markov chains: rates and the forward equation beside Fokker–Planck; reverse rates need ratios (concrete score); remasking as a sampler knob; discrete flow matching and applications.',
        },
      },
      {
        group: 'Unit 6 · Consistency Models',
        label: 'dma-week-consistency',
        constellation: { anchor: [800, 82], stars: [[0, 0, 4.8], [46, 36, 3.0], [90, 22, 3.4], [124, 66, 4.4], [160, 30, 2.8], [190, 90, 3.4], [230, 58, 4.0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6]] },
        description: {
          zh: '能不能直接學「一步」？progressive distillation、consistency function 與自我一致性、CD 與 CT、iCT / sCM 各對付哪個誤差，以及多步 CM 為什麼很快飽和。',
          en: 'Can we learn the one-step map directly? Progressive distillation, the consistency function and self-consistency, CD vs. CT, which error each iCT / sCM trick fights, and why multistep CM saturates.',
        },
      },
      {
        group: 'Unit 7 · Flow Maps 與分佈匹配',
        label: 'dma-week-flow-maps',
        constellation: { anchor: [900, 280], stars: [[0, 20, 3.2], [30, -30, 4.6], [84, -46, 3.0], [130, -20, 3.6], [150, 40, 4.4], [112, 72, 2.8], [60, 50, 3.4]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
        description: {
          zh: '從 t 直接跳到 s：flow map 的四個條件、flow map matching 的三種損失、MeanFlow identity 與條件速度代換、Shortcut / AYF，以及回歸式與分佈匹配式（DMD）蒸餾的失敗模式。',
          en: 'Jumping from t straight to s: the four conditions of a flow map, the three flow-map-matching losses, the MeanFlow identity, Shortcut / AYF, and the failure modes of regression vs. distribution-matching (DMD) distillation.',
        },
      },
    ],
  },
  {
    key: 'mathematical-foundations',
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
}
export interface HomeSection {
  category: (typeof categoryOrder)[number];
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

  // Research areas: the area label is the top-level heading.
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
  if (areaItems.length > 0) sections.push({ category: 'research-areas', items: areaItems });

  // Courses: the course title is the top-level heading.
  const courseItems: HomeSectionItem[] = courseSections(listed, lang)
    .filter((course) => course.noteCount > 0)
    .map((course) => {
      const def = courseByKey(course.key);
      return {
        id: courseAnchor(course.key),
        title: course.title,
        description: def ? def.description[lang] : '',
        noteCount: course.noteCount,
        unitCount: course.readyLectureCount,
        latest: latestNoteDate(course.lectures.flatMap((lecture) => lecture.notes)),
      };
    });
  if (courseItems.length > 0) sections.push({ category: 'courses', items: courseItems });

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
  if (skillItems.length > 0) sections.push({ category: 'academic-skills', items: skillItems });

  // Same order as the notes index (`categoryOrder`), so the home page and the index agree.
  return sections.sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
  );
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
