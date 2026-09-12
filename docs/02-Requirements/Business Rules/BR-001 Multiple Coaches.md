---
id: BR-001
aliases: [BR-001, İK-001]
source: "İK-001"
area: relationships
status: specified
updated: 2026-09-12
---

# BR-001 — A student may work with several coaches at once

**Rule.** A student can have more than one active coach–student relationship simultaneously.

**Why.** Serious exam-prep students commonly have a general coach plus subject tutors. Modelling one
coach per student would be wrong on day one and unfixable later.

**Enforcement.** `CoachStudentLink` is a many-to-many join with its own lifecycle; nothing anywhere
assumes `student.coachId`.

**Verification.** A student with two active links sees work from both, attributed correctly.

**Related.** [[FR-04]] · [[BR-024]]
