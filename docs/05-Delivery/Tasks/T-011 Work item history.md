---
id: T-011
aliases: [T-011]
title: Work item history
status: todo
milestone: M2
area: work
requirements: [FR-21, FR-06]
updated: 2026-09-12
---

# T-011 — Work item event history

**Goal.** Every work item's life is reconstructable, and reports never change retroactively.

**Implements.** [[FR-21]] · [[BR-025]]

## Steps

- [ ] `work_item_event` append-only table
- [ ] Events written in the **same transaction** as the change
- [ ] Generic `audit_log` for price changes, attendance corrections, link changes, approvals
- [ ] History endpoint for a work item
- [ ] No update or delete path exists in the application

## Done when

- [ ] An item with two returns and three submissions replays in order with actors and timestamps
- [ ] `submittedAt` and `approvedAt` are never conflated anywhere ([[FR-21|FR-21.4]])
