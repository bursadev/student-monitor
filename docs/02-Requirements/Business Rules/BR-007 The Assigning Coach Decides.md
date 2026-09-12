---
id: BR-007
aliases: [BR-007, İK-007]
source: "İK-007"
area: work
status: specified
updated: 2026-09-12
---

# BR-007 — Only the assigning coach evaluates the completion request

**Rule.** A completion request is evaluated by the coach who created the item. The student's other
coaches are neither asked nor notified about it.

**Why.** Multi-coach isolation. Coach B has no context on Coach A's assignment and no business
approving it.

**Enforcement.** `approve()` / `return()` require `actorId == workItem.coachId`; anyone else gets
404. Notification fan-out targets exactly that one coach.

**Verification.** On a student with three coaches, a submission generates exactly one notification,
and the other two coaches get 404 on the approval route.

**Related.** [[FR-06]] · [[FR-16]] · [[BR-024]]
