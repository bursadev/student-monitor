---
id: BR-010
aliases: [BR-010, İK-010]
source: "İK-010"
area: work
status: specified
updated: 2026-09-12
---

# BR-010 — Completed-late and never-completed are different

**Rule.** Work completed late and work never completed are never reported under the same statistic.

**Why.** They mean opposite things about a student. A student who finishes everything a day late has
a scheduling problem; one who never finishes has a motivation problem. A coach needs to tell them
apart at a glance.

**Enforcement.** `COMPLETED_LATE` and `OVERDUE` are distinct statuses; every daily, weekly and
monthly figure reports them as separate counts.

**Verification.** The monthly report shows six independent counts; no view sums late into missing.

**Related.** [[FR-06]] · [[FR-14]] · [[BR-009]]
