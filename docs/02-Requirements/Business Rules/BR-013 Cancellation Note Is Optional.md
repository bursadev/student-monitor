---
id: BR-013
aliases: [BR-013, İK-013]
source: "İK-013"
area: lessons
status: specified
updated: 2026-09-12
---

# BR-013 — The cancellation explanation is optional

**Rule.** An explanation may be entered when cancelling a lesson, but it is never required. The same
applies to declining a lesson request.

**Why.** Same reasoning as [[BR-008]]: a required field on a fast, awkward action produces either
avoidance or noise.

**Enforcement.** `cancelNote` and `declineNote` are nullable end to end.

**Verification.** Cancelling and declining both succeed with no note.

**Related.** [[FR-09]] · [[BR-008]] · [[BR-012]]
