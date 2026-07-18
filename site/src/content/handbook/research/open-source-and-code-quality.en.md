---
slug: "open-source-and-code-quality"
lang: "en"
title: "Open Source & Code Quality"
section: "research"
order: 8
status: "draft"
updated: 2026-07-05
summary: "Write code you'd be glad to release — because often you will."
---

> Code is a form of communication. Write it for the next human who reads it, who is often you.

## Quality we aim for

- **Readable over clever.** Clear names, small functions, obvious control flow. Optimize for the reader, not the compiler.
- **Tested where it counts.** Sanity checks and tests on the parts that would silently corrupt results.
- **Documented enough to run.** A README that gets someone from clone to a key result.
- **Reproducible.** See [Reproducibility](/personal_website/handbook/reproducibility).

Research code moves fast, and that's fine — but the parts that back a claim deserve care. Prototype loosely; harden what you publish.

## Releasing code

We default to releasing code with papers when we can — it multiplies impact and keeps us honest. Before release: clean the repo, check licenses of dependencies, remove secrets and private data, and write a README others can follow. Released code carries the lab's name; make it something we're proud of.

## Working together in a codebase

Use version control well: small, meaningful commits and clear messages. Review each other's code kindly. Leave shared code better than you found it.

> **Edit me:** add repo conventions, license default, and CI/testing setup.

## In short

Readable, tested where it matters, reproducible, and releasable. Write code the next person can trust — usually that's you or a reader of your paper.
