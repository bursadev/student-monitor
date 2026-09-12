---
title: Business Rules Index
updated: 2026-09-12
---

# Business Rules Index

The client's 26 hard rules (`İK-001`–`İK-026` in [[Source - Requirement Catalog (TR)]]), restated as
testable constraints. These are not negotiable design preferences — breaking one is a defect.

```dataview
TABLE source AS "İK", area, status
FROM "02-Requirements/Business Rules"
WHERE id != null
SORT id ASC
```

| ID | İK | Rule | Area |
| --- | --- | --- | --- |
| [[BR-001]] | İK-001 | A student may work with several coaches at once | relationships |
| [[BR-002]] | İK-002 | Either side can end a coach–student relationship | relationships |
| [[BR-003]] | İK-003 | A parent link is active only after coach approval | relationships |
| [[BR-004]] | İK-004 | A student has at most two active parents | relationships |
| [[BR-005]] | İK-005 | Tasks and assignments are tracked independently | work |
| [[BR-006]] | İK-006 | A student's "done" does not close the item | work |
| [[BR-007]] | İK-007 | Only the assigning coach evaluates the completion request | work |
| [[BR-008]] | İK-008 | The return explanation is optional | work |
| [[BR-009]] | İK-009 | Lateness is measured by the student's submission time | work |
| [[BR-010]] | İK-010 | Completed-late and never-completed are different | work |
| [[BR-011]] | İK-011 | Only a coach can create a lesson request | lessons |
| [[BR-012]] | İK-012 | Either side can cancel a confirmed lesson | lessons |
| [[BR-013]] | İK-013 | The cancellation explanation is optional | lessons |
| [[BR-014]] | İK-014 | A coach cannot see the student's whole personal schedule | schedule |
| [[BR-015]] | İK-015 | A coach can see the resource pool and recommend resources | resources |
| [[BR-016]] | İK-016 | Mock exam results are not final until the coach approves | exams |
| [[BR-017]] | İK-017 | Unapproved results enter no statistic | exams |
| [[BR-018]] | İK-018 | v1 accepts manually entered exam values | exams |
| [[BR-019]] | İK-019 | Net and score rules must be changeable per exam type | exams |
| [[BR-020]] | İK-020 | Each coach sets their own price per student | money |
| [[BR-021]] | İK-021 | Earnings are calculated from lesson records and the applicable price | money |
| [[BR-022]] | İK-022 | Only the coach and authorised parents see money | money |
| [[BR-023]] | İK-023 | Changing the price never rewrites past earnings | money |
| [[BR-024]] | İK-024 | One coach cannot manage another coach's content | authorization |
| [[BR-025]] | İK-025 | Historical records are preserved | platform |
| [[BR-026]] | İK-026 | Every student's grade level is tracked and visible to linked coaches | identity |

## The five that will bite us

Ranked by how easy they are to break without noticing:

1. **[[BR-024]]** — one missing `coachId` in a `where` clause leaks a competitor's content.
2. **[[BR-022]]** — one shared DTO between a coach view and a student view exposes money.
3. **[[BR-023]]** — one "simple" price update in place silently rewrites last month's income.
4. **[[BR-009]]** — using `approvedAt` for lateness looks correct and is wrong.
5. **[[BR-017]]** — one aggregate reading the raw results table poisons every chart.

Each of these deserves a test that fails loudly, written before the feature.

## Related

[[Requirements Index]] · [[Authorization Matrix]] · [[Source - Requirement Catalog (TR)]]
