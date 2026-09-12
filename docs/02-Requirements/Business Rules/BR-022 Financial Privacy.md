---
id: BR-022
aliases: [BR-022, İK-022]
source: "İK-022"
area: money
status: specified
updated: 2026-09-12
---

# BR-022 — Only the coach and authorised parents see money

**Rule.** Price and earnings information is visible only to the relevant coach and to the student's
authorised parent(s). **The student can never see it.**

**Why.** What a family pays for coaching is not a student's business, and exposing it changes the
coaching relationship. This is the rule most likely to be violated accidentally by a shared DTO.

**Enforcement.** Money fields live in separate endpoints and separate response types from anything a
student can call. No student-reachable serializer includes a price or amount field — enforce with a
test over the student-facing response schemas, not by review.

**Verification.** Every money route returns 404 to a student, including nested and expanded reads.

**Related.** [[FR-18]] · [[FR-19]] · [[FR-20]] · [[BR-020]]
