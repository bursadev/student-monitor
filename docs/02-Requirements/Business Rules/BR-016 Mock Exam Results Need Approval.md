---
id: BR-016
aliases: [BR-016, İK-016]
source: "İK-016"
area: exams
status: specified
updated: 2026-09-12
---

# BR-016 — Mock exam results are not final until the coach approves

**Rule.** A mock exam result entered by a student is not a finalised result. It becomes final only on
coach approval.

**Why.** Results are self-reported and manually typed. Both honest mistakes and optimistic rounding
are routine; an unverified number would poison every trend the product exists to show.

**Enforcement.** `MockExamResult.status` starts `PENDING_APPROVAL`; approval records the coach and
timestamp.

**Verification.** A freshly entered result is pending and marked as such in the student's own view.

**Related.** [[FR-15]] · [[BR-017]]
