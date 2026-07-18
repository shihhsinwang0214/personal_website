---
slug: "reproducibility"
lang: "en"
title: "Reproducibility"
section: "research"
order: 7
status: "draft"
updated: 2026-07-05
summary: "If you can't reproduce it, you don't really have it."
---

> A result you can't reproduce is a rumor. Future-you is the first person who will try — be kind to them.

## The default: reproducible by design

- **Version control everything** — code, configs, and the exact command that produced a figure.
- **Pin the environment** (dependencies, versions) so a run is repeatable months later.
- **Fix and record seeds**; log the config with every result.
- **Track data provenance** — where it came from, how it was processed.
- **One command from config to figure**, ideally. The less manual, the less it rots.

## Good habits

Keep a dated research log linking results to the exact commit and config that made them. Re-run a key result from scratch before you trust it in a paper. Write a short README so a labmate — or you in six months — can reproduce the main results.

## Why it matters

Reproducibility is integrity made practical: it protects you from fooling yourself, makes collaboration painless, and is the foundation of releasing code others can trust ([Open Source & Code Quality](/personal_website/handbook/open-source-and-code-quality)).

> **Edit me:** add the lab's concrete conventions (repo layout, env manager, experiment tracker, seed policy).

## In short

Version, pin, seed, and log everything; automate config-to-figure. If future-you can't rerun it, it isn't done.
