---
id: BR-005
aliases: [BR-005, İK-005]
source: "İK-005"
area: work
status: specified
updated: 2026-09-12
---

# BR-005 — Tasks and assignments are tracked independently

**Rule.** Görev (task) and ödev (assignment) are separate content types with separately calculated
progress. One never influences the other's statistics or Filiz.

**Why.** Coaches and parents think of them as different things: coaching work versus academic
homework. Merging the numbers hides exactly the pattern a coach is looking for.

**Enforcement.** Shared `WorkItem` storage with a `type` discriminator; every statistic, list and
progress computation groups by `type` ([[ADR-0005]]).

**Verification.** Completing all tasks and no assignments leaves assignment progress at zero and the
assignment Filiz at its lowest stage.

**Related.** [[FR-06]] · [[FR-07]] · [[FR-08]] · [[FR-14]]
