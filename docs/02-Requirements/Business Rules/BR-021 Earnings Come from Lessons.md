---
id: BR-021
aliases: [BR-021, İK-021]
source: "İK-021"
area: money
status: specified
updated: 2026-09-12
---

# BR-021 — Earnings are calculated from lesson records and the applicable price

**Rule.** Earnings are derived from calendar/lesson records combined with the price applicable to
that student at that time. The effect of delivered, cancelled and no-show lessons is governed by
explicit rules.

**Why.** The coach's accounting must be reproducible from facts already in the system, not typed in
separately — that is the whole feature.

**Enforcement.** `Earning` rows are produced from `Lesson` + `Attendance` + `CoachStudentRate`.
Billability is a configurable rule table, not scattered `if` statements.

**Verification.** The monthly total equals the sum over attended lessons at their applicable rates,
and changing the cancellation rule changes only future calculations.

**Related.** [[FR-19]] · [[FR-10]] · [[BR-023]] · [[Open Questions|Q-03]]
