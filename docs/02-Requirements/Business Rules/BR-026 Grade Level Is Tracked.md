---
id: BR-026
aliases: [BR-026, İK-026]
source: "İK-026"
area: identity
status: specified
updated: 2026-09-12
---

# BR-026 — Every student's current grade level is tracked and visible to linked coaches

**Rule.** Each student's current grade level is stored in the system and can be viewed by their
linked coaches.

**Why.** It is the basic academic context for every assignment, resource and exam decision a coach
makes.

**Enforcement.** `gradeLevel` on the student profile, readable by any actively linked coach, updatable
by the student and by a linked coach, with an audit entry on change.

**Verification.** A linked coach reads it; an unlinked coach gets nothing.

**Related.** [[FR-03]] · [[FR-15]]
