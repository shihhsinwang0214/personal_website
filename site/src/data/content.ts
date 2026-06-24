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
}

export interface PublicationGroup {
  group: string;
  items: Publication[];
}

export interface NewsItem {
  date: string;
  html: string;
  links?: LinkItem[];
}

export const profile = {
  name: 'Shih-Hsin Wang',
  nameZh: '王士欣',
  photo: 'images/snowboard.jpg',
  subtitle: ['Ph. D. in Mathematics', 'University of Utah', '(Aug 2021 – May 2026)'],
  contact: {
    email: 'shwang@math.utah.edu',
    github: 'https://github.com/shihhsinwang0214',
    linkedin: 'https://www.linkedin.com/in/shih-hsin-sam-wang-9803671a5',
  },
  cv: "assets/Shih-Hsin Wang's CV.pdf",
  quoteLines: ["Guided by mathematics' might,", "the universe's truths come to light."],
};

export const aboutHtml = `
I recently earned my PhD in Mathematics at the University of Utah (advised by Bao Wang and Tommaso de Fernex). My research focuses on developing mathematically rigorous methods that minimize errors, reduce resource waste and cost, and maximize efficiency.
<br><br>
My research bridges rigorous theory and practical application across <strong>geometric deep learning</strong> and <strong>generative models</strong> (e.g., flow matching &amp; diffusion models). <strong>AI for Science</strong> is one of my main goals; I work to translate complex mathematical insights into practical, reliable solutions for molecular and biological scientific applications.
`;

export const philosophy = [
  {
    title: 'Theory & Knowledge → Foundations',
    desc: 'Building foundations through mathematical guarantees and the integration of domain knowledge to ensure reliability and efficiency.',
  },
  {
    title: 'Practical Solution → Application',
    desc: 'Translating theoretical foundations into efficient, controllable AI systems that deliver reliable performance in real-world settings.',
  },
];

export const research = [
  {
    name: 'Geometric Deep Learning',
    desc: 'Equivariant graph neural networks and expressive geometric graph representations.',
  },
  {
    name: 'Generative Models',
    desc: 'Diffusion models, flow matching, single-step models, and test-time guidance.',
  },
  {
    name: 'AI for Science',
    desc: 'Modeling complex structures like molecules and proteins.',
  },
];

export const news: NewsItem[] = [
  {
    date: 'May 2026',
    html: '"Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering" accepted to <strong>ICML 2026 GenBio</strong> as a spotlight.',
  },
  {
    date: 'May 2026',
    html: '"Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions" accepted to <strong>ICML 2026</strong>.',
  },
  {
    date: 'Jan 2026',
    html: '"RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation" accepted to <strong>ICLR 2026</strong>.',
  },
  {
    date: 'Sep 2025',
    html: '"Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs" accepted to <strong>NeurIPS 2025</strong>.',
  },
  {
    date: 'May 2025',
    html: '"Improving Flow Matching by Aligning Flow Divergence" accepted to <strong>ICML 2025</strong>.',
  },
  {
    date: 'Apr 2025',
    html: '<strong>ICLR 2025 Oral Presentation</strong>: Presenting our paper on molecular graph representation.',
    links: [
      { label: '[Slides]', href: 'assets/ICLR25/ICLR_2025_oral_slides.pdf' },
      { label: '[Poster]', href: 'assets/ICLR25/ICLR_2025_oral_poster.pdf' },
    ],
  },
  {
    date: 'Mar 2025',
    html: 'Started visiting UCLA under Andrea Bertozzi, working on flow matching and its applications in RNA/DNA 3D folding.',
  },
];

export const publications: PublicationGroup[] = [
  {
    group: 'Machine Learning',
    items: [
      {
        title: 'Improving the Efficacy of Test-Time Steering in Masked Diffusion Models with Parallel Tempering',
        authors: 'Lu, P. Y., Lin H. T., <span class="me">Wang, S. H</span>.',
        venue: 'ICML 2026 GenBio [Spotlight]',
      },
      {
        title: 'Test-Time Guidance for Flow-Based Generative Models via Parallel Tempering on Source Distributions',
        authors: '<span class="me">Wang, S. H.*</span>, Keller, J.*, Transue, T., Brown, D., Strohmer, T., Wang, B.',
        venue: 'ICML 2026',
      },
      {
        title: 'RMFlow: Refined Mean Flow by a Noise-Injection Step for Multimodal Generation',
        url: 'https://openreview.net/forum?id=p072J56yo4',
        authors: 'Huang, Y., <span class="me">Wang, S. H.</span>, C., Bertozzi, A. L., Wang, B.',
        venue: 'ICLR 2026',
      },
      {
        title: 'Towards Multiscale Graph-based Protein Learning with Geometric Secondary Structural Motifs',
        url: 'https://openreview.net/forum?id=JSbVO7dNYE',
        authors: '<span class="me">Wang, S. H.</span>, Huang, Y., Transue, T., Baker, J. M., Forstater, J., Strohmer, T., Wang, B.',
        venue: 'NeurIPS 2025',
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
      },
      {
        title: 'Learning to Control the Smoothness of Graph Convolutional Network Features',
        url: 'https://arxiv.org/abs/2410.14604',
        authors: '<span class="me">Wang, S. H.*</span>, Baker, J.*, Hauck, C. D., Wang, B.',
        venue: 'Under Review',
      },
      {
        title: 'An Explicit Frame Construction for Normalizing 3D Point Clouds',
        url: 'https://proceedings.mlr.press/v235/baker24a.html',
        authors: 'Baker, J.*, <span class="me">Wang, S. H.*</span>, de Fernex, T., Wang, B.',
        venue: 'ICML 2024',
      },
      {
        title: 'Rethinking the Benefits of Steerable Features in 3D Equivariant Graph Neural Networks',
        url: 'https://openreview.net/forum?id=mGHJAyR8w0',
        authors: '<span class="me">Wang, S. H.</span>, Hsu, Y. C., Baker, J., Bertozzi, A. L., Xin, J., Wang, B.',
        venue: 'ICLR 2024',
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
      },
      {
        title: 'Families of Jets of Arc Type and Higher (Co)Dimensional Du Val Singularities',
        url: 'https://arxiv.org/abs/2306.08291',
        authors: '<span class="me">Wang, S. H.</span>, de Fernex, T.',
        venue: 'C.R. Math. Acad. Sci. Paris, Special Volume in Memory of Jean-Pierre Demailly (2024)',
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
      },
    ],
  },
];

export const experience = {
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
