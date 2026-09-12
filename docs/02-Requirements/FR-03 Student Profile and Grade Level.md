---
id: FR-03
aliases: [FR-03]
title: Student Profile and Grade Level
area: identity
source: "§3.4"
status: specified
priority: must
updated: 2026-09-12
---

# FR-03 — Student Profile and Grade Level

> **Source:** catalog §3.4 · **Rules:** [[BR-026]]

## Intent

A student's grade level is the single piece of academic context everything else leans on — which
exam they are preparing for, what a coach should assign, which resources make sense.

## Requirements

- **FR-03.1** A student's current grade level is stored on their profile.
- **FR-03.2** Any coach actively linked to the student can view it.
- **FR-03.3** It can be updated — by the student, and by a linked coach.
- **FR-03.4** Grade level is available as context to tasks, assignments, lessons, resources and mock
  exams; it is not duplicated onto those records.
- **FR-03.5** The profile also holds the exam track the student is preparing for (e.g. TYT/AYT field,
  LGS), because grade alone does not determine it.

## Acceptance criteria

- [ ] A coach sees the grade level of every actively linked student, and of no one else.
- [ ] Updating grade level writes an audit entry ([[FR-21]]).
- [ ] Values are a controlled list, not free text, so reporting can group by them.

## Design notes

- Grade levels to support: 5–12, plus *mezun* (graduate re-taker) — a significant segment in Turkish
  exam prep that a naive 1–12 enum would exclude.
- Grade level changes every September; consider prompting rather than silently going stale.

## Related

[[FR-01]] · [[FR-04]] · [[FR-15]] · [[BR-026]]

## Change log

- 2026-09-12 — created from catalog §3.4
