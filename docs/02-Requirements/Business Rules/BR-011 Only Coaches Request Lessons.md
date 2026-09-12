---
id: BR-011
aliases: [BR-011, İK-011]
source: "İK-011"
area: lessons
status: specified
updated: 2026-09-12
---

# BR-011 — Only a coach can create a lesson request

**Rule.** Lesson/meeting requests are created by coaches only. A student cannot request a lesson from
a coach.

**Why.** The coach owns their availability. A student-initiated request queue would turn the coach's
calendar into an inbox they have to defend.

**Enforcement.** The create-lesson route is guarded to the coach role **and** to an active link with
that student. No student-facing path constructs a `LessonRequest`.

**Verification.** A student calling the endpoint with a crafted payload is rejected.

**Related.** [[FR-09]] · [[FR-04]]
