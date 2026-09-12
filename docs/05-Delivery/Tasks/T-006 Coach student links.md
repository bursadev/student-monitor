---
id: T-006
aliases: [T-006]
title: Coach student links
status: todo
milestone: M1
area: relationships
requirements: [FR-04, FR-03]
updated: 2026-09-12
---

# T-006 — Coach–student links and invites

**Goal.** A coach and a student can form a working relationship, and either can end it.

**Implements.** [[FR-04]] · [[FR-03]] · [[BR-001]] · [[BR-002]]

## Steps

- [ ] `CoachStudentLink` with the state machine from [[State Machines]]
- [ ] Partial unique index: one `ACTIVE` link per pair
- [ ] Invite codes: high entropy, single use, expiring; deep link for mobile
- [ ] Coach invites student; student requests coach; accept/decline both ways
- [ ] End the relationship from either side, with history preserved ([[BR-025]])
- [ ] Grade level read/write for linked coaches ([[FR-03]])

## Done when

- [ ] A student holds two active links simultaneously and sees both coaches
- [ ] Ending a link deletes nothing
- [ ] An expired or reused invite code fails
