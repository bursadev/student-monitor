---
id: FR-14
aliases: [FR-14]
title: Progress Reporting
area: progress
source: "§18, §19, §20, §21"
status: specified
priority: must
updated: 2026-09-12
---

# FR-14 — Progress Reporting (Daily, Weekly, Monthly)

> **Source:** catalog §18, §19, §20, §21 · **Rules:** [[BR-005]], [[BR-010]], [[BR-025]]

## Intent

The history is the product's memory: it is what makes a coaching conversation concrete ("you missed
four of six assignments last week") and what a parent actually wants to see.

## Requirements

### History

- **FR-14.1** Past task and assignment records are **never deleted** after completion or after the
  deadline passes ([[BR-025]]).
- **FR-14.2** A student can review their own history at **daily**, **weekly** and **monthly** level.
- **FR-14.3** On-time, late and incomplete work is distinguishable at every level ([[BR-010]]).

### Daily (§19)

- **FR-14.4** For any given day, task and assignment results can be viewed and calculated.
- **FR-14.5** The system distinguishes at least: completed on time, completed late,
  incomplete/overdue, pending approval.
- **FR-14.6** Task and assignment statistics are calculated **separately** ([[BR-005]]).

### Weekly (§20)

- **FR-14.7** Weekly performance can be calculated.
- **FR-14.8** Task and assignment results remain separable.
- **FR-14.9** Where coach approval is required, approval status is taken into account.

### Monthly (§21)

- **FR-14.10** Monthly reporting separately calculates: tasks on time, tasks late, tasks
  overdue/incomplete, assignments on time, assignments late, assignments overdue/incomplete.
- **FR-14.11** An overall monthly progress value can be produced.
- **FR-14.12** The exact progress formula is defined separately ([[Open Questions|Q-02]]).

## Acceptance criteria

- [ ] The six monthly figures are reported independently and sum correctly against the raw records.
- [ ] Late-completed work never appears inside the "not completed" figure.
- [ ] Pending-approval work is visible as its own category, not silently counted either way.
- [ ] A day with no assigned work reports "nothing due", not 0%.
- [ ] Weeks start Monday and days end at local midnight `Europe/Istanbul`.

## Design notes

- Compute from the event log ([[FR-21]]) so a historical report never changes retroactively because
  of a status column being overwritten.
- Aggregation strategy: compute on read for v1 (volumes are tiny — one coach, 30 students, a few
  hundred rows a month). Introduce daily rollup tables only when a report gets slow.
- **The empty-denominator problem**: a student assigned nothing scores 0/0. Report "no work
  assigned" explicitly; never show 0% — it blames the student for the coach's week off.
- The overall monthly value is the number a parent will fixate on. Do not ship it before
  [[Open Questions|Q-02]] is answered; the six raw counts are honest and sufficient until then.

## Open questions

- [[Open Questions|Q-02]] — the overall monthly formula.

## Related

[[FR-06]] · [[FR-07]] · [[FR-08]] · [[FR-20]] · [[FR-21]] · [[Progress and Filiz]]

## Change log

- 2026-09-12 — created from catalog §18–§21
