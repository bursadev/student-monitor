---
id: T-010
aliases: [T-010]
title: Submit approve return
status: todo
milestone: M2
area: work
requirements: [FR-06]
updated: 2026-09-12
---

# T-010 — Submit, approve, return, derived status

**Goal.** The core loop works, and lateness is computed honestly.

**Implements.** [[FR-06]] · [[BR-006]] · [[BR-007]] · [[BR-008]] · [[BR-009]] · [[BR-010]] · [[ADR-0008]]

## Steps

- [ ] `submit` → `PENDING_APPROVAL`, never a completed state ([[BR-006]])
- [ ] `approve` / `return` restricted to the assigning coach ([[BR-007]])
- [ ] Optional return note, nullable end to end ([[BR-008]])
- [ ] `finalState` computed once from `submittedAt <= dueAt` ([[BR-009]]) — with a comment
      explaining why `approvedAt` is deliberately unused
- [ ] Derived `OVERDUE`, no cron job ([[ADR-0008]])
- [ ] Resubmission after a return

## Done when

- [ ] Submitted 23:59 on the due date, approved three days later → `COMPLETED_ON_TIME`
- [ ] Submitted a minute late, approved → `COMPLETED_LATE`
- [ ] Never submitted, past due → `OVERDUE`, counted separately from late ([[BR-010]])
- [ ] Return with an empty note succeeds
