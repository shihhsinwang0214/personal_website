# English course-note assets

The English DMA U1–U3 and U7.0–U7.2 notes, Mathematical Foundations M0–M6, and Machine Learning Foundations L0–L5 use separate localized assets.

- 81 images: 59 SVG figures and 22 raster illustrations.
- 74 standalone interactive demos and one localized shared mathematical-demo script.
- English filenames insert `.en` before the extension; Chinese pages continue to use the original assets.
- `_english-demo.js` sizes same-origin English embeds to their content as their width or controls change.

## Raster localization

21 raster figures were localized with the built-in imagegen tool. The matching English corgi illustration already present in the Dojo assets was copied to a course-local filename.

Prompt pattern: “Text-localization edit of this course infographic. Preserve composition, artwork, mathematical symbols, equations, charts and colors. Replace ALL Chinese text with clear English, resizing/wrapping to fit the original regions. No Chinese or invented notation.” Each call additionally specified the English headings, labels, explanatory text, and any mathematical qualifications for that figure.

The prompt topics were: training data and generation; density geometry; posterior geometry; large-noise estimates; denoising ambiguity; SDE/ODE marginals; Gaussian loss floors; forward noising; solver-error slopes; distribution transport; rectification; training versus sampling choices; stochastic interpolants; Euler local and accumulated error; OT monotonicity; trapezoidal integration; reward tilting; test-time steering; classifier guidance; and classifier-free guidance.

## Validation

- All 74 demos were checked at desktop and mobile widths, including selection changes and canvas text: no JavaScript errors, remaining Chinese labels, or horizontal page overflow.
- All 80 English notes were checked at 1440px and 390px: images loaded, embedded demos used English filenames, and iframe bodies were not clipped.
- All 59 SVGs parse; long labels were fitted to their panels.
- The 67 inline/shared demo scripts retain the original code structure and numerical operations, with string values localized.
- Original Chinese image/demo assets were verified unchanged.

## Localized files

### Images

- `site/src/content/notes/research-areas/mathematical-foundations/m2-deterministic-dynamics/imgs/m2-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m2-deterministic-dynamics/imgs/m2-4-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m2-deterministic-dynamics/imgs/m2-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m2-deterministic-dynamics/imgs/m2-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m2-deterministic-dynamics/imgs/m2-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m5-optimization/imgs/m5-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m5-optimization/imgs/m5-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m5-optimization/imgs/m5-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m5-optimization/imgs/m5-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m3-stochastic-dynamics/imgs/m3-4-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m3-stochastic-dynamics/imgs/m3-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m3-stochastic-dynamics/imgs/m3-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m3-stochastic-dynamics/imgs/m3-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m3-stochastic-dynamics/imgs/m3-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m6-optimal-transport/imgs/m6-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m6-optimal-transport/imgs/m6-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m6-optimal-transport/imgs/m6-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m6-optimal-transport/imgs/m6-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m4-markov-chains/imgs/m4-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m4-markov-chains/imgs/m4-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m4-markov-chains/imgs/m4-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m4-markov-chains/imgs/m4-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m1-probability/imgs/m1-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m1-probability/imgs/m1-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m1-probability/imgs/m1-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m1-probability/imgs/m1-4-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m1-probability/imgs/m1-3-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m0-calculus-toolkit/imgs/m0-1-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m0-calculus-toolkit/imgs/m0-0-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m0-calculus-toolkit/imgs/m0-2-1.en.svg`
- `site/src/content/notes/research-areas/mathematical-foundations/m0-calculus-toolkit/imgs/m0-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-5-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-4-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l4-architectures/imgs/l4-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l5-probabilistic-modeling/imgs/l5-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l5-probabilistic-modeling/imgs/l5-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l5-probabilistic-modeling/imgs/l5-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l5-probabilistic-modeling/imgs/l5-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l0-learning-as-fitting/imgs/l0-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l0-learning-as-fitting/imgs/l0-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l0-learning-as-fitting/imgs/l0-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l0-learning-as-fitting/imgs/l0-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l1-generalization/imgs/l1-4-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l1-generalization/imgs/l1-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l1-generalization/imgs/l1-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l1-generalization/imgs/l1-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l1-generalization/imgs/l1-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l3-experimental-method/imgs/l3-3-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l3-experimental-method/imgs/l3-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l3-experimental-method/imgs/l3-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l3-experimental-method/imgs/l3-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l2-optimization-in-practice/imgs/l2-4-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l2-optimization-in-practice/imgs/l2-2-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l2-optimization-in-practice/imgs/l2-1-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l2-optimization-in-practice/imgs/l2-0-1.en.svg`
- `site/src/content/notes/research-areas/machine-learning-foundations/l2-optimization-in-practice/imgs/l2-3-1.en.svg`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w3-0-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-0-2.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-3-2.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-3-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-2-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-4-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-5-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-3/imgs/w-3-1-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-4/imgs/w4-5-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-4/imgs/w4-0-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-3-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-6-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-0-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-2-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-2-2.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-4-1.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-5/imgs/w5-5-rectangle-trapezoid.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/imgs/w10-3-reward-tilting.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/imgs/w10-0-test-time-steering.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/imgs/w10-1-corgi-steering-intuition-v2.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/imgs/w10-1-classifier-guidance.en.png`
- `site/src/content/notes/research-areas/diffusion-models-and-their-applications/week-10/imgs/w10-2-classifier-free-guidance.en.png`

### Demos

- `site/public/notes/research_areas/mathematical-foundations/m2-deterministic-dynamics/m2-1-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m2-deterministic-dynamics/m2-4-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m2-deterministic-dynamics/m2-2-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m2-deterministic-dynamics/m2-0-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m2-deterministic-dynamics/m2-3-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m5-optimization/m5-2-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m5-optimization/m5-0-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m5-optimization/m5-3-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m5-optimization/m5-1-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m3-stochastic-dynamics/m3-4-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m3-stochastic-dynamics/m3-1-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m3-stochastic-dynamics/m3-0-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m3-stochastic-dynamics/m3-3-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m3-stochastic-dynamics/m3-2-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m6-optimal-transport/m6-2-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m6-optimal-transport/m6-0-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m6-optimal-transport/m6-1-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m6-optimal-transport/m6-3-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m4-markov-chains/m4-2-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m4-markov-chains/m4-1-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m4-markov-chains/m4-0-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m4-markov-chains/m4-3-1.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m1-probability/m1-0-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m1-probability/m1-1-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m1-probability/m1-2-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m1-probability/m1-4-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m1-probability/m1-3-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m0-calculus-toolkit/m0-1-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m0-calculus-toolkit/m0-0-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m0-calculus-toolkit/m0-2-2.en.html`
- `site/public/notes/research_areas/mathematical-foundations/m0-calculus-toolkit/m0-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-5-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-4-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l4-architectures/l4-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l5-probabilistic-modeling/l5-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l5-probabilistic-modeling/l5-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l5-probabilistic-modeling/l5-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l5-probabilistic-modeling/l5-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l0-learning-as-fitting/l0-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l0-learning-as-fitting/l0-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l0-learning-as-fitting/l0-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l0-learning-as-fitting/l0-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l1-generalization/l1-4-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l1-generalization/l1-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l1-generalization/l1-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l1-generalization/l1-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l1-generalization/l1-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l3-experimental-method/l3-3-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l3-experimental-method/l3-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l3-experimental-method/l3-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l3-experimental-method/l3-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l2-optimization-in-practice/l2-4-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l2-optimization-in-practice/l2-2-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l2-optimization-in-practice/l2-1-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l2-optimization-in-practice/l2-0-2.en.html`
- `site/public/notes/research_areas/machine-learning-foundations/l2-optimization-in-practice/l2-3-2.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w3-0-many-maps.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w3-3-score.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w3-2-posterior.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w3-4-samplers.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w3-1-forward.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w4-1-reference-paths.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w4-0-flow-ode.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w4-5-steps.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w4-3-crossing.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-3-crossing-reflow.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-3-reflow.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-0-gamma.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-2-curvature.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-4-batch-ot.en.html`
- `site/public/notes/research_areas/diffusion-models-applications/w5-5-solvers.en.html`

### Dependencies

- `site/public/notes/research_areas/mathematical-foundations/_advanced-demo.en.js`

Shared sizing helper: `site/public/notes/research_areas/_english-demo.js`.
