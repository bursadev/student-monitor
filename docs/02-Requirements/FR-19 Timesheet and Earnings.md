---
id: FR-19
aliases: [FR-19]
title: Timesheet and Earnings
area: money
source: "§29"
status: specified
priority: must
updated: 2026-09-12
---

# FR-19 — Timesheet (Puantaj) and Earnings (Hakediş)

> **Source:** catalog §29, §29.1, §29.2, §29.3 · **Rules:** [[BR-021]], [[BR-022]], [[BR-023]]

## Intent

This is the coach's strongest reason to pay for the product: the month's income calculates itself
from lessons that actually happened, per student and in total, instead of being reconstructed from
memory at the end of the month.

## Requirements

- **FR-19.1** The system automatically calculates a coach's earnings per student from the lessons
  that took place in the calendar ([[BR-021]]).
- **FR-19.2** The calculation joins delivered lesson records with the price applicable to that
  student at that time.
- **FR-19.3** A timesheet/earnings record is traceable with at least: student, coach, the related
  lesson(s), lesson date, applicable price, calculated amount.
- **FR-19.4** Only the owning coach and the student's approved parent(s) can view timesheet and
  earnings data ([[BR-022]]).
- **FR-19.5** The student cannot view earnings or price data — at all.
- **FR-19.6** Lesson/calendar records are the primary source of the calculation ([[FR-09]],
  [[FR-10]]).
- **FR-19.7** How delivered, cancelled and no-show lessons affect earnings is governed by
  **explicit, configurable business rules** ([[Open Questions|Q-03]], [[Open Questions|Q-04]]).
- **FR-19.8** Changing a student's price later must **not** retroactively change the amounts already
  calculated for past lessons ([[BR-023]]). A lesson delivered at 500 TL stays 500 TL when the
  current price becomes 600 TL.
- **FR-19.9** A coach can view earnings **per student** and the **total across their whole student
  pool**, so they can do their own accounting. (Client addendum to §29.3.)
- **FR-19.10** Earnings can be viewed per period (month) with a breakdown by student and by lesson.

## Acceptance criteria

- [ ] A lesson marked `ATTENDED` produces exactly one earning row with the rate in force on the
      lesson date, snapshotted onto the row.
- [ ] Raising the price afterwards leaves that row untouched; the next lesson uses the new price.
- [ ] A cancelled lesson produces no billable amount under the default rule, and flipping the rule
      configuration changes future behaviour without rewriting history.
- [ ] The coach's monthly total equals the sum of per-student totals, always.
- [ ] A student gets 404 on every earnings route.
- [ ] A parent sees only their own child's figures, never the coach's pool total.

## Implementation — the calculation

```
Lesson (ATTENDED)  ──►  TimesheetEntry  ──►  Earning
                          billable?           amountMinor
                          rule applied        rateSnapshotMinor
                                              rateId, lessonId, periodMonth
```

- The earning row stores `rateSnapshotMinor` **and** the `rateId` it came from. [[BR-023]] then
  holds even if someone later edits a rate row.
- Recalculation is allowed only when the underlying *fact* changes (attendance corrected), never
  when the *price* changes.
- Default billing rules (configurable, see open questions):

  | Attendance | Billable | Note |
  | --- | --- | --- |
  | `ATTENDED` | yes | |
  | `NO_SHOW` | yes | the coach was there and held the slot |
  | `CANCELLED` | no | regardless of who cancelled, in v1 |

- The pool total is a straightforward aggregate; it is coach-private and must never leak into a
  parent response.

## Open questions

- [[Open Questions|Q-03]] — cancellation billing, and whether the initiator matters.
- [[Open Questions|Q-04]] — no-show billing.

## Related

[[FR-09]] · [[FR-10]] · [[FR-18]] · [[FR-20]] · [[Pricing and Earnings]] · [[BR-023]]

## Change log

- 2026-09-12 — created from catalog §29 plus the client's addendum on pool totals
