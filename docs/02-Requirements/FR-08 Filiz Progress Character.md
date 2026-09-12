---
id: FR-08
aliases: [FR-08]
title: Filiz Progress Character
area: progress
source: "§10"
status: specified
priority: should
updated: 2026-09-12
---

# FR-08 — Filiz (Progress Character)

> **Source:** catalog §10 · **Rules:** [[BR-005]]

## Intent

Filiz ("sprout") is the emotional layer over a dry completion percentage: a character that visibly
thrives when the student keeps up and wilts when they do not. It is the reason a 17-year-old opens
the app without being told to.

## Requirements

- **FR-08.1** The system represents the student's **daily** progress through a visual character or
  animation, currently named **Filiz**.
- **FR-08.2** Filiz has exactly **four** progress stages.
- **FR-08.3** Progress is computed **separately** for tasks and for assignments.
- **FR-08.4** There are therefore two Filiz instances, and they never influence each other: task
  progress does not move the assignment Filiz and vice versa.
- **FR-08.5** The exact mathematical thresholds for the four stages are **not fixed** and must be
  implemented as a replaceable business rule, not as scattered constants.

## Acceptance criteria

- [ ] Changing the threshold configuration changes both Filiz stages with no other code change.
- [ ] A student who completed all tasks and no assignments sees a thriving task Filiz and a wilting
      assignment Filiz on the same screen.
- [ ] The stage shown matches the stage used in reporting — one function, one source of truth in
      `packages/shared`.

## Placeholder rules (until [[Open Questions|Q-01]] is answered)

Progress for a given day and type = `completed / due`, where *completed* counts items approved or
pending approval whose submission was on time, and *due* counts items with that due date.

| Stage | Placeholder threshold | Feel |
| --- | --- | --- |
| 1 — seed | 0% | nothing done yet |
| 2 — sprout | > 0% and < 50% | started |
| 3 — growing | ≥ 50% and < 100% | on track |
| 4 — thriving | 100% | done for the day |

Open decisions: does pending-approval work count as done? Does yesterday's late submission repair
yesterday's Filiz, or only today's? Is the window a calendar day or rolling?

## Design notes

- **Never punish the student for the coach being slow.** If pending approval counted as incomplete,
  a diligent student would watch Filiz wilt while waiting on their coach. Proposed default: pending
  counts as done, and a later return reverts it.
- Four stages want four illustrations plus transitions; treat the transition (sprout growing) as the
  reward moment. See [[UX Principles]].
- Keep stage computation pure and shared so mobile, web and the API cannot disagree.

## Open questions

- [[Open Questions|Q-01]] — the real thresholds and window.

## Related

[[FR-06]] · [[FR-07]] · [[FR-14]] · [[Progress and Filiz]] · [[UX Principles]]

## Change log

- 2026-09-12 — created from catalog §10
