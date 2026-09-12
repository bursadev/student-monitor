---
id: BR-012
aliases: [BR-012, İK-012]
source: "İK-012"
area: lessons
status: specified
updated: 2026-09-12
---

# BR-012 — Either side can cancel a confirmed lesson

**Rule.** Once a lesson is confirmed, both the coach and the student can cancel it. The initiator,
the time, and any explanation are recorded.

**Why.** Life happens on both sides. Who cancelled matters — for trust, and potentially for money
([[Open Questions|Q-03]]).

**Enforcement.** `cancel()` accepts either party; `cancelledBy`, `cancelledAt` and `cancelNote` are
persisted, and an audit row is written.

**Verification.** A coach-initiated and a student-initiated cancellation are distinguishable
afterwards.

**Related.** [[FR-09]] · [[FR-19]] · [[BR-013]]
