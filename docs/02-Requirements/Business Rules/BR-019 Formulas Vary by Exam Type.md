---
id: BR-019
aliases: [BR-019, İK-019]
source: "İK-019"
area: exams
status: specified
updated: 2026-09-12
---

# BR-019 — Net and score rules must be changeable per exam type

**Rule.** The data model must not depend on one fixed net/score formula. Later versions must be able
to calculate net, score and other derived values differently per exam type.

**Why.** YKS deducts a quarter-point per wrong answer, LGS a third; exam structures change by
ministry decision. A formula baked into the schema becomes a migration every time.

**Enforcement.** Store `correct`, `wrong`, `blank`, `net`, `score` per subject, plus `examType`.
Derivation lives in a per-type strategy in `packages/shared`, never in a database default or a
hard-coded constant.

**Verification.** Adding a new exam type with a different coefficient requires no schema change.

**Related.** [[FR-15]] · [[BR-018]]
