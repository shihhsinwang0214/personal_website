---
slug: "running-experiments"
lang: "en"
title: "Running Experiments"
section: "research"
order: 3
status: "draft"
updated: 2026-07-05
summary: "Experiments are questions to nature — ask them cleanly."
---

> Every experiment should be able to change your mind. If no result would surprise you, don't run it yet.

## Design

- **State the hypothesis and the prediction first.** What would confirm it? What would kill it?
- **Change one thing at a time.** Confounds make results unreadable.
- **Start with the smallest, fastest version.** A toy setting that isolates the effect beats a giant run you can't interpret.
- **Fix seeds and log everything** needed to reproduce: config, code version, data, environment. See [Reproducibility](/personal_website/handbook/reproducibility).

## Run

Sanity-check on a tiny case first (does the loss go down at all?). Watch for silent failures — the run that "worked" but on the wrong data. Keep a dated log of what you ran and why.

## Interpret

Look at the failures and the boring cases, not just the wins. Ask *what else could explain this?* before celebrating. A result you can't explain is a lead, not a trophy.

> **Edit me:** add your stack (tracker, cluster/compute, config system, plotting conventions).

## In short

Predict first, isolate one variable, start tiny, log everything, and distrust results you can't explain.
