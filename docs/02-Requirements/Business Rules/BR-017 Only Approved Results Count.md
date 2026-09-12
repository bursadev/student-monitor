---
id: BR-017
aliases: [BR-017, İK-017]
source: "İK-017"
area: exams
status: specified
updated: 2026-09-12
---

# BR-017 — Unapproved results enter no statistic

**Rule.** Results not approved by a coach are excluded from **every** performance statistic:
average, best result, development, past performance, per-subject performance.

**Why.** One unverified entry would silently move every chart the student, coach and parent look at.

**Enforcement.** A single query scope (`approvedResults`) is the only source for statistics; no
aggregate reads the raw table. Enforce it by making the statistics service take that scope and
nothing else.

**Verification.** Entering an outlier result changes no average, chart or parent-facing figure until
it is approved.

**Related.** [[FR-15]] · [[FR-20]] · [[BR-016]]
