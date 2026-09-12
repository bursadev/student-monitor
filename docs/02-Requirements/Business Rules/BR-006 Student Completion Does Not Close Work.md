---
id: BR-006
aliases: [BR-006, İK-006]
source: "İK-006"
area: work
status: specified
updated: 2026-09-12
---

# BR-006 — A student's "done" does not close the item

**Rule.** A student's completion notification moves a task or assignment to *pending approval*. It
never marks it complete.

**Why.** This is what separates a coaching tool from a to-do list. The coach's judgement is the
product.

**Enforcement.** `submit()` may only transition `OPEN|RETURNED → PENDING_APPROVAL`. No path from a
student action reaches a `COMPLETED_*` status.

**Verification.** After a student submits, the item is `PENDING_APPROVAL` and counted in neither the
completed nor the missing bucket.

**Related.** [[FR-06]] · [[BR-007]] · [[BR-009]]
