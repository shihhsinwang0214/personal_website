# Repository instructions

## DMA course notes

Before editing Chinese notes under `site/src/content/notes/research-areas/diffusion-models-and-their-applications/`, read `site/refs/dma-notes-style-guide.md` completely.

Also apply `site/refs/dma-notes-minimum-standard.md`: U4.0 is the minimum completeness benchmark. Each note must connect a motivated question, everyday intuition, explained mathematics with staged core equations, a directly visible explanatory figure, and an editable runnable experiment. Do not replace these with a shorter summary or a checklist of disconnected assets.

Use the same completeness benchmark for other academic teaching notes in this repository, adapting the example and mathematics to their subject.

In particular, apply the section **「U2 改寫後確立的主線規則」** before restructuring U3 or later units. Preserve the author's problem-driven progression, compact paragraph rhythm, everyday intuition, symbol consistency, and distinction between reference paths, learned fields, generated trajectories, and discretized samplers.

When the user supplies replacement prose, treat it as authoritative except for clear mathematical, terminology, formatting, or cross-reference errors. Prefer replacing the old passage over appending a second version.

## Dojo (練功房)

Before adding or editing scripts under `site/src/content/dojo/`, read `docs/dojo-design.md`. A script is a note's question chain, not a compressed note: no score, every wrong option is a real misconception written as a detour, and the ending links back to the source note (`note:` = the note's `label`).
