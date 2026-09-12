---
id: BR-018
aliases: [BR-018, İK-018]
source: "İK-018"
area: exams
status: specified
updated: 2026-09-12
---

# BR-018 — v1 accepts manually entered exam values, including the score

**Rule.** In the first version, all required result values — net, score (`puan`), totals — can be
entered manually. The system stores what the user entered; no calculation is required.

**Why.** Score formulas differ per exam type and per year, and getting them wrong is worse than not
having them. Manual entry ships the value now.

**Enforcement.** All numeric result fields are writable and nullable; no computed column, no
calculation on write.

**Verification.** A result can be saved with a total only, or with a full per-subject breakdown, and
round-trips unchanged.

**Related.** [[FR-15]] · [[BR-019]]
