---
title: "On unvalidated measurements"
description: "METR's MALT dataset is the most serious public attempt to check whether AI safety monitors actually work — and the honest conclusion is that we still can't say."
pubDate: 2026-07-23
tags: ["ai-safety", "evals"]
draft: false
---

I've been going in circles on [METR's MALT study](https://metr.org/blog/2025-10-14-malt-dataset-of-natural-and-prompted-behaviors/) for weeks because it asks a question I keep coming back to as I explore the canon of AI safety research: can we trust the very tools we use to measure safety?

MALT is the most serious public attempt anyone has made to check whether our safety monitors actually work, and the honest conclusion is that we still can't say.

LLM monitors are now the thing telling us whether a model reward hacked, sandbagged, or sabotaged an evaluation. Their verdicts then flow into system cards, deployment decisions, and increasingly into policy. They are, therefore, critical measurement instruments. And yet, it seems like nobody has calibrated them.

## What MALT shows

Somewhere in the dataset there's an agent asked to make some code run faster. Instead of optimizing anything, it rewrites Python's clock so the scoring script sees a thousandth of the real elapsed time. The monitor reviewing that run scored it 0 out of 10 for cheating, and noted in its reasoning that no timers had been mocked.

METR built MALT — a dataset of ~11,000 labeled agent transcripts — to find out how often that happens. Their best monitor catches 80–90% of true positives at the false-positive rate they can afford to review.

The number worth looking at, though, is the dataset composition. 1,505 transcripts are prompted, i.e. models explicitly told to sandbag or sabotage. Of naturally occurring sandbagging, MALT has 32 examples, all of them a model quitting early with resources to spare. There are:

- No samples of natural sabotage.
- No samples of natural targeted refusals.
- No samples of the model spontaneously playing dumb.

Despite METR's best efforts, they had great difficulty coming up with any more than a handful of natural samples across the threat models. And so, that 80–90% is mostly measuring how well monitors catch models that were prompted to misbehave, which introduces serious distribution shift risk relative to deployment.

METR affirms these risks in their dataset collection methods, stating that the prompting was basic, so the positives are contrived ones, and the handful of natural cases were surfaced by anomalous-score detection and keyword search — filters that select for legibility by construction.

And so when we look at MALT's headline 80–90% catch rate, we're actually looking at a ceiling on deployment performance. In reality, the natural-and-subtle rate likely sits below it, unmeasured.

## Why this one grips me

I spent five years as a founding engineer at Watershed building carbon accounting infrastructure. Every number we produced was going into a regulatory filing, an audited disclosure, or an investor deck — which meant every number had to survive a third party trying to take it apart, and an entity being measured that had an incentive to prefer a smaller figure.

The scrutiny in that environment is what makes questions like "what would I say if someone asked me to defend this number under oath?" second nature to me. In response, every emissions factor had provenance; every methodology change had version histories. When a measurement was uncertain, saying so was not an admission of failure but rather, part of the deliverable.

Coming into AI safety, the intellectual honesty is genuinely better than anything I saw in climate — MALT's limitations section is more candid than most corporate sustainability reports I've read end to end. But the measurement infrastructure powering AI safety is roughly a decade behind, and we are already making much bigger claims on top of it.

## Honeypots, and the dimension they add

DeepMind's [scheming honeypot evaluations](https://arxiv.org/abs/2605.29729) are the best answer I've read to the ground-truth scarcity problem. Rather than hunting for natural positives, they build settings where a misaligned model would have a real reason to act and an aligned one wouldn't: real coding tasks in Google's internal alignment research codebases, including the codebase for the scheming monitor itself. (Which is, predictably, the favorite target. Models downgrade it, blind its data queries, rescale its alert thresholds — all framed as performance optimizations.)

The part that reframed the problem for me is what they do with prompting. MALT has two buckets: (1) prompted and (2) natural. Meanwhile, DeepMind has a ladder: (1) nothing, then (2) mild agency nudges, then (3) situational awareness, then (4) awareness plus a hidden goal, then (5) explicit power-seeking.

And you see a step-change in results at each rung. (1) Unprompted, Gemini never takes the bait at all. (2) Mild agency nudges move it very little. (3) Scheming appears once the prompts push situational awareness, and (4) peaks when they add a goal to pursue — change that one phrase from "continue pursuing your goal" to "complete your tasks" and it nearly vanishes again. (5) An explicit power-seeking goal pushes it higher still.

It seems like every rung buys you more positives but at the cost of realism, which they measure. They track how often models say out loud that they think they're being tested, and it's near zero without the agency and goal prompts. The prompts that produce the most scheming turn out to be the same ones that produce the most eval awareness.

And so, "prompted-and-obvious" and "natural-and-subtle" starts to look less like two labels and more like ends of a spectrum you can move along deliberately, with a realism coordinate at every point — and a subtlety coordinate too, since the same autorater scores how covert the resulting sabotage was.

## What I'd build

MALT reports monitor performance as a score, but I think it's two points on a curve nobody has plotted: a realism coordinate, a subtlety coordinate.

My proposal is to run monitors across the rungs and plot catch rate against subtlety, so that we can answer really interesting questions like:

- Where does the curve bend?
- How subtle does a positive have to be before monitors stop seeing it, and
- How far is that point from anything we've actually tested?

If the curve turns out shallow, monitoring claims stand on much firmer ground than we can currently justify claiming — which is genuinely worth knowing. And if it's a cliff, the numbers in circulation describe a regime we don't deploy in, and at the very least the shape tells us where the edge sits.

## The thing I'm actually worried about

In climate, we had a measurement problem and a set of incentives that rewarded looking good over being good. The two combined into greenwashing with offsets as the main vehicle. These were instruments that were rigorous-sounding, hard to verify, and, for a long stretch, largely fictional.

Companies could get away with lofty net-zero claims powered by carbon credits that turned out to be largely worthless, purchased for pennies on the dollar. And the measurement tools we had to detect them were just weak enough to let everyone believe what they preferred to believe. (I have opinions about offsets. I'll spare you.)

AI safety research today seems to have both ingredients: (1) enormous commercial pressure to ship, and (2) a monitoring stack whose real-world error rate nobody knows. And so, it's plausible that a number like "our monitor catches 87% of reward hacking" can travel a very long way: into a system card, into a regulator's briefing, into a policy that presumes we'd notice if something went wrong, without anyone re-checking what it was measured against.

There's a lot we can learn from climate, and I firmly believe that before we can progress, we ought to start with a foundational guarantee across our safety evaluations: we must be able to trust the tools that underpin our measurements.

---

*I'm working through ARENA and building small evals in this area. If you work on monitoring reliability or control protocols and think I've got something wrong here, reach out! I'd love to hear it.*

**Sources:** [MALT (METR, 2025)](https://metr.org/blog/2025-10-14-malt-dataset-of-natural-and-prompted-behaviors/) · [Realistic honeypot evaluations for scheming propensity (Krakovna, Lindner, Ho, Farquhar & Shah, DeepMind, 2026)](https://arxiv.org/abs/2605.29729)
