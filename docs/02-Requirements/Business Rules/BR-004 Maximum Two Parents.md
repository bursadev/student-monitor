---
id: BR-004
aliases: [BR-004, İK-004]
source: "İK-004"
area: relationships
status: specified
updated: 2026-09-12
---

# BR-004 — A student has at most two active parents

**Rule.** A student can be linked to a maximum of **2** active parents at any one time. Creating a
third active link is prevented.

**Why.** Mother and father. The limit keeps a minor's data from spreading through an extended family
by accident.

**Enforcement.** Checked in the approval transaction and backed by a database constraint (partial
unique index / trigger counting `ACTIVE` links), not by application logic alone.

**Verification.** Approving a third parent fails atomically; revoking one then allows it.

**Related.** [[FR-05]] · [[BR-003]]
