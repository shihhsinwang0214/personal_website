// ============================================================
// Site content — transcribed verbatim from the current site.
// No invented data. Empty 2026 publication links are intentionally
// link-less until an authoritative URL exists (per AGENT.md).
// ============================================================

export interface LinkItem {
  label: string;
  href: string; // external (http...) or site-relative (assets/...)
}

export interface Publication {
  title: string;
  url?: string; // title link; omit when no authoritative URL exists
  authors: string; // HTML (keeps <span class="me"> emphasis)
  venue: string;
  links?: LinkItem[];
  bibtex?: string; // built from the repository's own records; omit when unverified
}

export interface PublicationGroup {
  group: string;
  items: Publication[];
}

export interface NewsItem {
  date: string;
  html: string;
  htmlZh?: string; // Chinese version for the zh home; falls back to `html` when absent
  links?: LinkItem[];
}

export const profile = {
  name: 'Shih-Hsin Wang',
  nameZh: '王士欣',
  photo: 'images/profile-halfbody.jpg', // half-body portrait — About page
  avatar: 'images/profile-avatar.jpg', // head & shoulders — small round header avatar
  photoCasual: 'images/snowboard.jpg',
  // Square crop used on the lab People page — informal, and framed so the whole
  // snowboard stays in shot. Re-crop from images/snowboard.jpg if it needs changing.
  photoPeople: 'images/people/shwang-arches-card.jpg',
  subtitle: ['Assistant Professor', 'CSIE & AICoRE, National Taiwan University'],
  subtitleZh: ['助理教授', '國立臺灣大學資訊工程學系、人工智慧頂尖研究中心'],
  // One-line role for compact places (People page card).
  roleShort: {
    en: 'Assistant Professor · NTU CSIE',
    zh: '助理教授 · 臺大資工',
  },
  contact: {
    email: 'shwang@csie.ntu.edu.tw',
    scholar: 'https://scholar.google.com/citations?user=IoihdcYAAAAJ&hl=en',
    github: 'https://github.com/shihhsinwang0214',
    linkedin: 'https://www.linkedin.com/in/shih-hsin-wang/',
  },
  // Office / lab rooms, shown on the About page and the lab home.
  office: {
    en: 'Office: CSIE Building (德田館) R516 · Lab: CSIE Building R303',
    zh: '辦公室：德田館 R516 ・ 研究室：德田館 R303',
  },
  cv: 'assets/shih-hsin-wang-cv.pdf',
  quoteLines: ["Guided by mathematics' might,", "the universe's truths come to light."],
};

export const aboutHtml = `
I am an Assistant Professor in the Department of Computer Science and Information Engineering (CSIE) at National Taiwan University, with joint appointments in the <a href="https://www.inm.ntu.edu.tw/" target="_blank" rel="noopener">Graduate Institute of Networking and Multimedia (INM)</a> and the <a href="https://aicore.ntu.edu.tw/" target="_blank" rel="noopener">AI Center of Research Excellence (AICoRE)</a>. I am also a <strong>Yushan Young Fellow</strong>, supported by the Yushan Fellow Program of Taiwan’s Ministry of Education.
<br><br>
I received my B.S. in Mathematics from National Taiwan University (2016–2020) and my Ph.D. in Mathematics from the University of Utah (2021–2026), where I was advised by Bao Wang and Tommaso de Fernex.
<br><br>
My work spans <strong>geometric deep learning</strong>, <strong>generative models</strong> (e.g., flow matching &amp; diffusion models), and <strong>AI for Science</strong>. I care about turning intuition into principled, reliable, and efficient tools, and applying them to problems in molecules, biology, and other sciences.`;

export const aboutHtmlZh = `
我目前任職於<strong>國立臺灣大學資訊工程學系（CSIE）</strong>，擔任助理教授，並合聘於<a href="https://www.inm.ntu.edu.tw/" target="_blank" rel="noopener">資訊網路與多媒體研究所（INM）</a>與<a href="https://aicore.ntu.edu.tw/" target="_blank" rel="noopener">人工智慧頂尖研究中心（AICoRE）</a>。我亦獲選為教育部<strong>玉山青年學者</strong>。
<br><br>
我畢業於國立臺灣大學數學系（2016–2020），並於美國猶他大學（University of Utah）取得數學博士學位（Ph.D. in Mathematics, 2021–2026；Advisors: Bao Wang 與 Tommaso de Fernex）。
<br><br>
我的研究涵蓋<strong>geometric deep learning</strong>、<strong>生成模型</strong>（包括 flow matching 與 diffusion models），以及 <strong>AI for Science</strong>。我習慣將直覺轉化為有理論支撐、可靠且高效的工具，並應用於分子、生物與其他科學問題。`;

export const philosophy = [
  {
    title: 'Theory & Knowledge → Foundations',
    titleZh: '理論與知識 → 基礎',
    desc: 'Building foundations through mathematical guarantees and the integration of domain knowledge to ensure reliability and efficiency.',
    descZh: '透過數學保證與領域知識的整合建立基礎，確保可靠性與效率。',
  },
  {
    title: 'Practical Solution → Application',
    titleZh: '實務解法 → 應用',
    desc: 'Translating theoretical foundations into efficient, controllable AI systems that deliver reliable performance in real-world settings.',
    descZh: '把理論基礎轉化為高效、可控的 AI 系統，在真實場景中提供可靠表現。',
  },
];

export const research = [
  {
    name: 'Geometric Deep Learning',
    desc: 'Equivariant graph neural networks and expressive geometric graph representations.',
    descZh: 'Equivariant graph neural networks 與具表達力的幾何圖表示。',
  },
  {
    name: 'Generative Models',
    desc: 'Diffusion models, flow matching, single-step models, and test-time guidance.',
    descZh: 'Diffusion models、flow matching、single-step models，以及 test-time guidance。',
  },
  {
    name: 'AI for Science',
    desc: 'Modeling complex structures like molecules and proteins.',
    descZh: '對分子、蛋白質等複雜結構進行建模。',
  },
];

// UI strings for the bilingual identity layer (home + about). Publications,
// experience, talks, service and CV stay English-only by design.
export const uiText = {
  recent: { en: 'Recent', zh: '最新消息' },
  experienceMore: { en: 'Experience →', zh: '完整經歷 →' },
  notes: { en: 'Notes', zh: '筆記' },
  notesMore: { en: 'All notes →', zh: '所有筆記 →' },
  research: { en: 'Research', zh: '研究方向' },
  selectedPubs: { en: 'Selected publications', zh: '代表著作' },
  pubsMore: { en: 'All publications →', zh: '所有著作 →' },
  aboutTitle: { en: 'About', zh: '關於我' },
  approach: { en: 'Approach', zh: '研究理念' },
  notesOnlyOther: { en: 'Not in English yet — read it in 中文.', zh: '目前僅有英文版。' },
} as const;

export const heroContent = {
  eyebrow: {
    en: 'Assistant Professor · CSIE, National Taiwan University',
    zh: '助理教授 · 國立臺灣大學資訊工程學系',
  },
  lead: {
    en: 'I develop machine learning methods that are both theoretically grounded and practical, spanning geometric deep learning, generative models, and AI for Science. I care about turning intuition into principled, reliable, and efficient tools — and applying them to problems in molecules, biology, and other sciences.',
    zh: '我專注於發展兼具理論基礎與實用性的機器學習方法，研究主題涵蓋 geometric deep learning、生成模型，以及 AI for Science。我關注如何將直覺轉化為有理論支撐、可靠且高效的工具，並應用於分子、生物與其他科學問題。',
  },
};

const newsItems: NewsItem[] = [
  {
    date: 'Aug 2026',
    html: 'Undergraduate project places are <strong>full for now</strong>; MS/PhD depends on capacity. See <a href="/personal_website/handbook/join">Join the Lab</a> for where things stand and how to apply.',
    htmlZh: '學士專題生名額<strong>目前已滿</strong>，碩博士生視情況而定。目前狀況與申請方式請見<a href="/personal_website/zh/handbook/join">加入研究室</a>。',
  },
  {
    date: 'Jul 2026',
    html: 'I was named a <strong>Yushan Young Fellow</strong> by Taiwan\'s Ministry of Education (Yushan Fellow Program).',
    htmlZh: '獲選為教育部<strong>玉山青年學者</strong>（玉山學者計畫）。',
  },
  {
    date: 'Jul 2026',
    html: 'I am organizing two minisymposia on generative models, transport, and inverse problems at <strong>SIAM IS26 &amp; MDS26</strong> (Salt Lake City, Nov 2026).',
    htmlZh: '我將在 <strong>SIAM IS26 與 MDS26</strong>（鹽湖城，2026 年 11 月）籌辦兩場關於 generative models、optimal transport 與 inverse problems 的 minisymposia。',
    links: [{ label: '[Details]', href: 'experience' }],
  },
  {
    date: 'Jul 2026',
    html: 'I will join the <strong>Department of Computer Science and Information Engineering at National Taiwan University</strong> as an Assistant Professor in August 2026.',
    htmlZh: '我將於 2026 年 8 月加入<strong>國立臺灣大學資訊工程學系</strong>擔任助理教授。',
  },
  {
    date: 'May 2026',
    html: '"Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering" accepted to <strong>ICML 2026 GenBio</strong> as a spotlight.',
    htmlZh: '「Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering」獲 <strong>ICML 2026 GenBio</strong> 接受為 spotlight。',
  },
  {
    date: 'May 2026',
    html: '"Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions" accepted to <strong>ICML 2026</strong>.',
    htmlZh: '「Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions」獲 <strong>ICML 2026</strong> 接受。',
  },
  {
    date: 'Jan 2026',
    html: '"RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation" accepted to <strong>ICLR 2026</strong>.',
    htmlZh: '「RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation」獲 <strong>ICLR 2026</strong> 接受。',
  },
  {
    date: 'Sep 2025',
    html: '"Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs" accepted to <strong>NeurIPS 2025</strong>.',
    htmlZh: '「Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs」獲 <strong>NeurIPS 2025</strong> 接受。',
  },
  {
    date: 'May 2025',
    html: '"Improving Flow Matching by Aligning Flow Divergence" accepted to <strong>ICML 2025</strong>.',
    htmlZh: '「Improving Flow Matching by Aligning Flow Divergence」獲 <strong>ICML 2025</strong> 接受。',
  },
  {
    date: 'Apr 2025',
    html: '<strong>ICLR 2025 Oral Presentation</strong>: Presenting our paper on molecular graph representation.',
    htmlZh: '<strong>ICLR 2025 口頭報告（Oral）</strong>：發表我們在分子圖表示（molecular graph representation）上的研究。',
    links: [
      { label: '[Slides]', href: 'assets/ICLR25/ICLR_2025_oral_slides.pdf' },
      { label: '[Poster]', href: 'assets/ICLR25/ICLR_2025_oral_poster.pdf' },
    ],
  },
  {
    date: 'Mar 2025',
    html: 'Started visiting UCLA under Andrea Bertozzi, working on flow matching and its applications in RNA/DNA 3D folding.',
    htmlZh: '在 Andrea Bertozzi 指導下開始訪問 UCLA，研究 flow matching 及其在 RNA/DNA 3D folding 上的應用。',
  },
];


/** `date` is written as "MMM YYYY". Sorted newest first so a new entry can be
 *  added anywhere in the list above without the home page going out of order.
 *  An unparseable date keeps its position rather than jumping to the end. */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function newsRank(item: NewsItem): number {
  const [mon, year] = item.date.trim().split(/\s+/);
  const m = MONTHS.indexOf(mon);
  const y = Number(year);
  if (m < 0 || !Number.isFinite(y)) return Number.NEGATIVE_INFINITY;
  return y * 12 + m;
}
export const news: NewsItem[] = [...newsItems].sort((a, b) => newsRank(b) - newsRank(a));

export const publications: PublicationGroup[] = [
  {
    group: 'Machine Learning',
    items: [
      {
        title: 'Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering',
        url: 'https://openreview.net/pdf?id=RdCA2rtWXR',
        authors: 'Lu, P. Y., Lin H. T., <span class="me">Wang, S. H</span>.',
        venue: 'ICML 2026 GenBio [Spotlight]',
        bibtex: `@inproceedings{lu2026improving,
  title={Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering},
  author={Lu, P. Y. and Lin, H. T. and Wang, S. H.},
  booktitle={ICML 2026 GenBio Workshop},
  year={2026},
  note={Spotlight},
  url={https://openreview.net/pdf?id=RdCA2rtWXR}
}`,
      },
      {
        title: 'Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions',
        url: 'https://openreview.net/pdf?id=5jGcYMUZx1',
        authors: '<span class="me">Wang, S. H.*</span>, Keller, J.*, Transue, T., Brown, D., Strohmer, T., Wang, B.',
        venue: 'ICML 2026',
        bibtex: `@inproceedings{wang2026testtime,
  title={Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions},
  author={Wang, S. H. and Keller, J. and Transue, T. and Brown, D. and Strohmer, T. and Wang, B.},
  booktitle={International Conference on Machine Learning (ICML)},
  year={2026},
  url={https://openreview.net/pdf?id=5jGcYMUZx1}
}`,
      },
      {
        title: 'RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation',
        url: 'https://openreview.net/forum?id=p072J56yo4',
        authors: 'Huang, Y., <span class="me">Wang, S. H.</span>, C., Bertozzi, A. L., Wang, B.',
        venue: 'ICLR 2026',
        bibtex: `@inproceedings{huang2026rmflow,
  title={RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation},
  author={Huang, Y. and Wang, S. H. and Bertozzi, A. L. and Wang, B.},
  booktitle={International Conference on Learning Representations (ICLR)},
  year={2026},
  url={https://openreview.net/forum?id=p072J56yo4}
}`,
      },
      {
        title: 'Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs',
        url: 'https://openreview.net/forum?id=JSbVO7dNYE',
        authors: '<span class="me">Wang, S. H.</span>, Huang, Y., Transue, T., Baker, J. M., Forstater, J., Strohmer, T., Wang, B.',
        venue: 'NeurIPS 2025',
        bibtex: `@inproceedings{wang2025multiscale,
  title={Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs},
  author={Wang, S. H. and Huang, Y. and Transue, T. and Baker, J. M. and Forstater, J. and Strohmer, T. and Wang, B.},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  year={2025},
  url={https://openreview.net/forum?id=JSbVO7dNYE}
}`,
      },
      {
        title: 'Plug-and-Play Image Restoration with Flow Matching: A Continuous Viewpoint',
        authors: 'Jia, F., Huang, Y., <span class="me">Wang, S. H.</span>, Garcia-Cardona, C., Bertozzi, A. L., Wang, B.',
        venue: 'Under Review',
      },
      {
        title: 'Improving Flow Matching by Aligning Flow Divergence',
        url: 'https://openreview.net/pdf?id=FeZimuj6SG',
        authors: 'Huang, Y., Transue, T., <span class="me">Wang, S. H.</span>, Feldman, W. M., Zhang, H., Wang, B.',
        venue: 'ICML 2025',
        links: [{ label: '[Slides]', href: 'https://icml.cc/media/icml-2025/Slides/45878.pdf' }],
        bibtex: `@inproceedings{huang2025aligning,
  title={Improving Flow Matching by Aligning Flow Divergence},
  author={Huang, Y. and Transue, T. and Wang, S. H. and Feldman, W. M. and Zhang, H. and Wang, B.},
  booktitle={International Conference on Machine Learning (ICML)},
  year={2025},
  url={https://openreview.net/pdf?id=FeZimuj6SG}
}`,
      },
      {
        title: 'A Theoretically-Principled Sparse, Connected, and Rigid Graph Representation of Molecules',
        url: 'https://openreview.net/forum?id=OIvg3MqWX2',
        authors: '<span class="me">Wang, S. H.*</span>, Huang, Y.*, Baker, J., Sun, Y. E., Tang, Q., Wang, B.',
        venue: 'ICLR 2025 [Oral Presentation]',
        links: [
          { label: '[Slides]', href: 'assets/ICLR25/ICLR_2025_oral_slides.pdf' },
          { label: '[Poster]', href: 'assets/ICLR25/ICLR_2025_oral_poster.pdf' },
          { label: '[Code]', href: 'https://github.com/shihhsinwang0214/SCHull' },
        ],
        bibtex: `@inproceedings{wang2025schull,
  title={A Theoretically-Principled Sparse, Connected, and Rigid Graph Representation of Molecules},
  author={Wang, S. H. and Huang, Y. and Baker, J. and Sun, Y. E. and Tang, Q. and Wang, B.},
  booktitle={International Conference on Learning Representations (ICLR)},
  year={2025},
  note={Oral Presentation},
  url={https://openreview.net/forum?id=OIvg3MqWX2}
}`,
      },
      {
        title: 'Learning to Control the Smoothness of Graph Convolutional Network Features',
        url: 'https://arxiv.org/abs/2410.14604',
        authors: '<span class="me">Wang, S. H.*</span>, Baker, J.*, Hauck, C. D., Wang, B.',
        venue: 'Under Review',
        bibtex: `@article{wang2024smoothness,
  title={Learning to Control the Smoothness of Graph Convolutional Network Features},
  author={Wang, S. H. and Baker, J. and Hauck, C. D. and Wang, B.},
  journal={arXiv preprint arXiv:2410.14604},
  year={2024},
  url={https://arxiv.org/abs/2410.14604}
}`,
      },
      {
        title: 'An Explicit Frame Construction for Normalizing 3D Point Clouds',
        url: 'https://proceedings.mlr.press/v235/baker24a.html',
        authors: 'Baker, J.*, <span class="me">Wang, S. H.*</span>, de Fernex, T., Wang, B.',
        venue: 'ICML 2024',
        bibtex: `@inproceedings{baker2024frame,
  title={An Explicit Frame Construction for Normalizing 3D Point Clouds},
  author={Baker, J. and Wang, S. H. and de Fernex, T. and Wang, B.},
  booktitle={International Conference on Machine Learning (ICML)},
  year={2024},
  url={https://proceedings.mlr.press/v235/baker24a.html}
}`,
      },
      {
        title: 'Rethinking the Benefits of Steerable Features in 3D Equivariant Graph Neural Networks',
        url: 'https://openreview.net/forum?id=mGHJAyR8w0',
        authors: '<span class="me">Wang, S. H.</span>, Hsu, Y. C., Baker, J., Bertozzi, A. L., Xin, J., Wang, B.',
        venue: 'ICLR 2024',
        bibtex: `@inproceedings{wang2024steerable,
  title={Rethinking the Benefits of Steerable Features in 3D Equivariant Graph Neural Networks},
  author={Wang, S. H. and Hsu, Y. C. and Baker, J. and Bertozzi, A. L. and Xin, J. and Wang, B.},
  booktitle={International Conference on Learning Representations (ICLR)},
  year={2024},
  url={https://openreview.net/forum?id=mGHJAyR8w0}
}`,
      },
    ],
  },
  {
    group: 'Algebraic Geometry',
    items: [
      {
        title: 'Arcs on Rational Double Points in Arbitrary Characteristic',
        url: 'https://arxiv.org/abs/2508.12423',
        authors: '<span class="me">Wang, S. H.</span>, de Fernex, T.',
        venue: 'Under Review',
        bibtex: `@article{wang2025arcs,
  title={Arcs on Rational Double Points in Arbitrary Characteristic},
  author={Wang, S. H. and de Fernex, T.},
  journal={arXiv preprint arXiv:2508.12423},
  year={2025},
  url={https://arxiv.org/abs/2508.12423}
}`,
      },
      {
        title: 'Families of Jets of Arc Type and Higher (Co)Dimensional Du Val Singularities',
        url: 'https://arxiv.org/abs/2306.08291',
        authors: '<span class="me">Wang, S. H.</span>, de Fernex, T.',
        venue: 'C.R. Math. Acad. Sci. Paris, Special Volume in Memory of Jean-Pierre Demailly (2024)',
        bibtex: `@article{wang2024families,
  title={Families of Jets of Arc Type and Higher (Co)Dimensional Du Val Singularities},
  author={Wang, S. H. and de Fernex, T.},
  journal={C.R. Math. Acad. Sci. Paris, Special Volume in Memory of Jean-Pierre Demailly},
  year={2024},
  url={https://arxiv.org/abs/2306.08291}
}`,
      },
    ],
  },
  {
    group: 'Other Fields',
    items: [
      {
        title: 'GenFuzz: GPU-Accelerated Hardware Fuzzing Using Genetic Algorithm with Multiple Inputs',
        url: 'https://tsung-wei-huang.github.io/papers/2023-dac.pdf',
        authors: 'Lin, D. L., Zhang, Y., Ren, H., Khailany, B., <span class="me">Wang, S. H.</span>, Huang, T. W.',
        venue: 'ACM/IEEE Design Automation Conference (DAC), 2023',
        bibtex: `@inproceedings{lin2023genfuzz,
  title={GenFuzz: GPU-Accelerated Hardware Fuzzing Using Genetic Algorithm with Multiple Inputs},
  author={Lin, D. L. and Zhang, Y. and Ren, H. and Khailany, B. and Wang, S. H. and Huang, T. W.},
  booktitle={ACM/IEEE Design Automation Conference (DAC)},
  year={2023},
  url={https://tsung-wei-huang.github.io/papers/2023-dac.pdf}
}`,
      },
    ],
  },
];

export const experience = {
  organizing: [
    '<strong>SIAM IS26 · MS30 — Generative Models, Transport, and Inverse Problems in Imaging Science</strong> (Salt Lake City, Tue Nov 17, 2026)<br>Speakers: Xiaoqun Zhang (Shanghai Jiao Tong University); Jiachen Liu &amp; Thomas Strohmer (UC Davis); Paul Hand (Northeastern University); Bao Wang (University of Utah).',
    '<strong>SIAM MDS26 · MS204 — Generative Models for Scientific Computing and Inverse Problems</strong> (Salt Lake City, Fri Nov 20, 2026)<br>Speakers: Cristina Garcia Cardona (Los Alamos National Laboratory); Jingwei Hu (University of Washington); Yiming Ying (University of Sydney); Qiang Ye (University of Kentucky).',
  ],
  recent: [
    '<strong>Visiting Graduate Researcher, UCLA</strong> (Mar 2025 – June 2025)<br>Initiating a pipeline for 3D RNA/DNA folding from secondary structure using flow-matching models, supervised by Andrea Bertozzi.',
    '<strong>Research Intern, Los Alamos National Lab</strong> (May – Aug 2024)<br>Developed a sparse, rigid, and hyperparameter-free graph representation for molecular structures, supervised by Qi Tang.',
  ],
  talks: [
    '<strong>ICLR 2025</strong> – Oral presentation on "A Theoretically-Principled Sparse, Connected, and Rigid Graph Representation of Molecules" (Singapore)',
    '<strong>JMM 2025</strong> – "Expanding the Mathematical Horizons of Machine Learning"',
    '<strong>SIAM GL 2023</strong> – "Leveraging Geometric Symmetries with GNNs"',
    '<strong>NCTS Algebraic Geometry Seminar 2023</strong> – "Families of Jets on Du Val Singularities"',
  ],
  service: [
    '<strong>Conference Reviewer:</strong> ICLR 2025-2026, ICML 2024–26, NeurIPS 2024–25, AISTATS 2025',
    '<strong>Journal Reviewer:</strong> TMLR, SIAM J. on Applied Algebra and Geometry, ACM TOSN',
  ],
};

// Latest notes — link to the Astro notes pages; the legacy portal remains in public/.
export const notesTeaser: LinkItem[] = [
  { label: 'From Noise to Data', href: 'notes/n2d-what-models-learn' },
  { label: 'Vector Field: Where Should Each Point Move?', href: 'notes/n2d-vector-field' },
  { label: 'How to Write a Compelling Introduction', href: 'notes/writing-compelling-introduction' },
];
