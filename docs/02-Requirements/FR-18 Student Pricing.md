---
id: FR-18
aliases: [FR-18]
title: Student Pricing
area: money
source: "§28"
status: specified
priority: must
updated: 2026-09-12
---

# FR-18 — Per-Student Pricing

> **Source:** catalog §28 · **Rules:** [[BR-020]], [[BR-022]], [[BR-023]]

## Intent

Coaches price per student — by family circumstance, by how long they have worked together, by
negotiation. The price belongs to the *relationship*, not to the coach and not to the student, and
the student must never see it.

## Requirements

- **FR-18.1** A coach can define a separate lesson/work price for each student.
- **FR-18.2** The price belongs to the **coach–student relationship**. If a student works with
  several coaches, each coach sets their own price independently ([[BR-020]], [[BR-024]]).
- **FR-18.3** The price is **not visible to the student** ([[BR-022]]).
- **FR-18.4** Only the owning coach and the student's approved parent(s) can see it.
- **FR-18.5** The system tracks **from which period a price is valid**, so that changing it does not
  corrupt past earnings ([[BR-023]]).
- **FR-18.6** A price change is recorded with who made it and when ([[FR-21]]).

## Acceptance criteria

- [ ] Setting a new price does not alter any already-calculated earning ([[FR-19]]).
- [ ] A student calling any pricing endpoint, by any route, gets nothing.
- [ ] Coach B cannot see Coach A's price for the same student.
- [ ] A parent sees the price of each coach their child works with.
- [ ] Price history for a relationship is retrievable in full.

## Implementation — effective dating

Store prices as an **effective-dated series**, not a mutable column:

```
CoachStudentRate(id, coachId, studentId, amountMinor, currency,
                 effectiveFrom, effectiveTo /* null = current */,
                 createdBy, createdAt)
```

- Setting a new price closes the current row (`effectiveTo = now`) and inserts a new one.
- "The price for a lesson on date D" = the row where `effectiveFrom <= D < effectiveTo`.
- Earnings additionally **snapshot** the amount at calculation time ([[FR-19]]) — belt and braces,
  because [[BR-023]] is the rule most likely to be broken by a well-meaning "just update the price"
  patch later.

Money is stored in integer minor units (kuruş) with a currency code. Never floats.

## Related

[[FR-19]] · [[FR-20]] · [[Pricing and Earnings]] · [[BR-023]] · [[ADR-0004]]

## Change log

- 2026-09-12 — created from catalog §28
