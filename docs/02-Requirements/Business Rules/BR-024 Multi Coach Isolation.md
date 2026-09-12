---
id: BR-024
aliases: [BR-024, İK-024]
source: "İK-024"
area: authorization
status: specified
updated: 2026-09-12
---

# BR-024 — One coach cannot manage another coach's content

**Rule.** When a student works with several coaches, data ownership is preserved. Content created by
Coach A grants Coach B no management rights. This applies to tasks, assignments, lessons,
notifications, files, resource recommendations, prices and earnings.

**Why.** Coaches are independent professionals who happen to share a student. Leaking between them is
both a privacy breach and a commercial one.

**Enforcement.** Every coach-owned row carries `coachId`. Every read and write filters on both
`studentId` **and** `coachId`, resolved in one central policy layer rather than per controller
([[ADR-0006]]). Requests for invisible rows return 404, not 403, so existence is not leaked.

**Verification.** A dedicated test suite for a student shared by two coaches: for every coach-owned
resource, Coach B gets 404 on read, update, delete and any list filter.

**Related.** [[FR-02]] · [[FR-04]] · [[BR-007]] · [[Authorization Matrix]]
