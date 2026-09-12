---
id: BR-008
aliases: [BR-008, İK-008]
source: "İK-008"
area: work
status: specified
updated: 2026-09-12
---

# BR-008 — The return explanation is optional

**Rule.** When returning a task or assignment, the coach **may** write an explanation. It must never
be required. If written, the student can read it.

**Why.** Coaches return work from their phone between lessons. Forcing a justification means they
stop returning work, or type "." — and the feature dies.

**Enforcement.** `returnNote` is nullable in the schema, the DTO and the UI. No validator requires it.

**Verification.** Returning with an empty body succeeds; the student sees the item as `RETURNED`
with no note.

**Related.** [[FR-06]] · [[BR-013]]
