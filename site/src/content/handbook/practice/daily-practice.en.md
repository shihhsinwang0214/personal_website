---
slug: "daily-practice"
lang: "en"
title: "How the Day-to-Day Works"
section: "practice"
order: 4
status: "available"
updated: 2026-07-18
summary: "Group meetings, one-on-ones, the implementation ladder, answering the questions clearly before you start, and open-source code and reproducibility."
---

> This page is the operational side of the day-to-day: how meetings run, and how we push an idea forward. The beliefs behind it are in [Six Things I Believe](/personal_website/handbook/research-principles).

## Group meeting

Our group meeting is not just a flat account of "what I did this week." Instead, you talk about:

> (Motivation) Why am I looking at this thing this week? Why am I trying to solve this problem? Why is this problem important?

> (Limitation) What problem did I find that isn't accounted for — what situation is being missed? What toy example did I design to illustrate it?

> (Solution) What method did I try? Why did I think of it this way?

> (Progress) What **failed**, where am I **stuck** right now, and why?

Being stuck at a wall in research is not embarrassing — it's exactly why this meeting exists. Being stuck for a long time *without bringing it up for discussion* is the problem that can't be solved.

Also, even when you're assigned to present a paper, you can present it with the same logic.

## One-on-ones

We meet one-on-one regularly, basically on a weekly cadence. But the actual frequency depends on your situation with **the task at hand**. The same person can check in every few weeks when running familiar experiments, but might need to talk every few days when writing a rebuttal for the first time. If you feel you need an extra one-on-one, you can email me anytime; likewise, if you feel you're not ready and want to cancel, please tell me in advance.

My role is to listen to your understanding and how you express it, give you big-picture direction and context, and clear possible obstacles as early as I can — the work stays mainly in your hands. If a discussion turns into me just issuing instructions one-way, that is not a good sign.

## The implementation ladder: please follow the steps

```
Level 1  Toy example                              — hours to a few days
Level 2  Small-scale real task                    — days
Level 3  Real scientific problem + large-scale validation — weeks
```

Most ideas will be eliminated at Level 1, or go back and forth being polished at Level 1. This design exists to avoid "ran a big experiment for two weeks before discovering the direction was fundamentally wrong." The times here are only a rough guide.

## Answer the questions clearly first, then start

Before starting any new direction, I usually want the following written down first:

```text
Assumptions: What assumptions does this method rest on? Which settings and conditions does it apply to?
Why existing methods can't do this: Where do existing methods get stuck? Is it because the assumptions are too strong, because they don't cover the full range of settings, or because there's a gap between theory and implementation?
Design and rationale of the toy example: What simple, visualizable example can expose the problem with existing methods? What intuition is this example meant to test?
If the toy example fails, what does that mean: If our method can't even get through the toy example, where is the problem? Are the assumptions wrong, is the method wrong, or does the problem itself need to be rethought?
If the toy example succeeds, what's next: If the method works on the toy example, can it also work on standard benchmarks? Is there theory to support it? Which real datasets should we look at next?
```

The point of this process is to force yourself to think the problem and the idea through first. Sometimes what's really stuck isn't the method — it's that we haven't yet worked out what question we're trying to answer.

It also leaves behind an important trail of your thinking. After a few months of accumulation, you'll see your own reasoning more clearly: which assumptions were overturned, and which ideas later became new research topics. A lot of research results actually grow, slowly, out of these page-by-page notes.

## Open-source code and reproducibility

We care a great deal about organizing code, writing documentation, and the reproducibility of research results.

A clearly labeled, well-documented repository isn't just convenient for other people — it's convenient for your future self. A lot of research doesn't start over from scratch; it builds on the code, experiments, and ideas left behind. If today's result can't even be run by you a few months from now, it can hardly become the foundation for the next piece of work.

On the other hand, genuinely impactful research isn't just proposing a method — it's letting other people understand, reproduce, verify, and even extend it. Only when others can actually run and use your work does its impact have a chance to keep growing. That's also why we place so much weight on open source and reproducibility.
