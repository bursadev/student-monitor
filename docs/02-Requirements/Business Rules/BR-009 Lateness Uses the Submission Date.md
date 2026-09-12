---
id: BR-009
aliases: [BR-009, İK-009]
source: "İK-009"
area: work
status: specified
updated: 2026-09-12
---

# BR-009 — Lateness is measured by the student's submission time

**Rule.** On-time versus late is determined by when the **student submitted**, never by when the
coach approved. A coach approving days later does not make the student late.

**Why.** The student controls only their own submission. Penalising them for a coach's response time
would make the whole statistic dishonest, and coaches would be blamed for it by parents.

**Enforcement.** The completion state is computed as `submittedAt <= dueAt ? ON_TIME : LATE` at
approval time. `approvedAt` never enters any lateness comparison — this is worth a comment in the
code, because it looks like a bug to anyone who has not read this rule.

**Verification.** Submitted 23:59 on the due date, approved three days later → `COMPLETED_ON_TIME`.

**Related.** [[FR-06]] · [[BR-006]] · [[BR-010]]
