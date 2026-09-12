---
id: T-007
aliases: [T-007]
title: Parent links
status: todo
milestone: M1
area: relationships
requirements: [FR-05]
updated: 2026-09-12
---

# T-007 — Parent links with coach approval

**Goal.** A parent gains access only when a coach approves, and never more than two per student.

**Implements.** [[FR-05]] · [[BR-003]] · [[BR-004]]

## Steps

- [ ] `ParentStudentLink` with `PENDING_COACH_APPROVAL → ACTIVE → REVOKED`
- [ ] Request from either end (parent enters a code, or the coach invites)
- [ ] Coach approval recording which coach and when
- [ ] Max-2-active enforced by a **database constraint**, not only in the service
- [ ] Revoke, freeing a slot

## Done when

- [ ] Approving a third parent fails atomically with `MAX_PARENTS_REACHED`
- [ ] A pending parent gets nothing from any endpoint
- [ ] Revoking one then allows a third to be approved
