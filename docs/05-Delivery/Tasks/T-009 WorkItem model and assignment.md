---
id: T-009
aliases: [T-009]
title: WorkItem model and assignment
status: todo
milestone: M2
area: work
requirements: [FR-06, FR-07]
updated: 2026-09-12
---

# T-009 — WorkItem model, assign and list

**Goal.** A coach assigns tasks and assignments; students see them attributed to the right coach.

**Implements.** [[FR-06]] · [[FR-07]] · [[ADR-0005]]

## Steps

- [ ] `work_item` table with `type` discriminator, `coach_id` never null
- [ ] Assign to one student, and to several students in one action (the real workflow)
- [ ] Student list grouped by due date, showing the assigning coach
- [ ] Coach list per student, scoped to own items
- [ ] Repository exposes `tasksFor` / `assignmentsFor`, never an unfiltered finder

## Done when

- [ ] A student with two coaches sees both sets, each attributed
- [ ] Coach B gets 404 on Coach A's item
- [ ] Task and assignment lists are separate everywhere ([[BR-005]])
