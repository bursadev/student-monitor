---
title: Progress and Filiz
status: draft
updated: 2026-09-12
---

# Progress and Filiz

How completion turns into numbers, and numbers into a character. Every threshold on this page is a
**placeholder** until [[Open Questions|Q-01]] and [[Open Questions|Q-02]] are answered — which is
precisely why they all live in one module.

## Where progress comes from

Only from work items ([[FR-06]], [[FR-07]]). Lessons and exams are reported separately; they do not
feed Filiz.

For a period and a `type` (task or assignment):

| Bucket | Definition |
| --- | --- |
| `onTime` | approved, `submittedAt <= dueAt` |
| `late` | approved, `submittedAt > dueAt` |
| `pending` | submitted, not yet decided |
| `missing` | past due, never submitted (`OVERDUE`) |
| `open` | not yet due, not submitted |

`due` = `onTime + late + pending + missing` — that is, items whose due date falls in the period.
Items not yet due are excluded from the denominator, or a student is penalised at 09:00 for work due
at 23:00.

## Daily progress and Filiz

```
progress(day, type) = (onTime + pending) / due       -- due > 0
```

**Pending counts as done.** A student who submitted everything should not watch Filiz wilt while
their coach is asleep. If the coach later returns the item, the day's progress drops — correct, and
attributable.

| Stage | Placeholder threshold |
| --- | --- |
| 1 — seed (tohum) | 0% |
| 2 — sprout (filiz) | > 0% and < 50% |
| 3 — growing (fidan) | ≥ 50% and < 100% |
| 4 — thriving (ağaç) | 100% |

Two independent instances — one for tasks, one for assignments ([[BR-005]]). They are shown side by
side and never averaged.

## The empty denominator

If `due = 0`, there is **no progress value**. Show "nothing due today", never 0%, never stage 1.
A student with no work assigned has not failed; blaming them for the coach's quiet week is the
fastest way to lose them.

This case is common — weekends, exam days, holidays — so handle it as a first-class state rather
than an edge case.

## Weekly

Same buckets aggregated over Monday–Sunday, `Europe/Istanbul`, reported per type ([[FR-14]]).
Weekly is the cadence a coach actually reviews in a session, so it should be the default view on
the coach's student detail screen.

## Monthly

The six counts required by §21, per type:

`tasksOnTime`, `tasksLate`, `tasksMissing`, `assignmentsOnTime`, `assignmentsLate`,
`assignmentsMissing`.

A single overall value is required by [[FR-14|FR-14.11]] but its formula is undefined
([[Open Questions|Q-02]]). **Do not invent one and ship it** — a parent will read it as a grade.
Until it is decided, report the six counts.

A plausible starting proposal, for the conversation:

```
overall = (onTime + 0.5 × late) / due
```

with tasks and assignments weighted equally. It has the right shape — late is worth something,
missing is worth nothing — but the weights are a product decision, not an engineering one.

## Implementation

One module in `packages/shared`:

```
progress/
  buckets.ts     classify a work item into a bucket
  rates.ts       buckets → progress ratio
  filiz.ts       ratio → stage (thresholds from config)
  config.ts      every threshold and weight, in one object
```

API, web and mobile all import it. A stage computed on the phone must equal the stage computed in
a report — if two implementations exist, they will disagree, and the student will notice before we
do.

## Related

[[FR-08]] · [[FR-14]] · [[FR-06]] · [[FR-07]] · [[UX Principles]] · [[Open Questions]]
