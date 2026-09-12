---
id: FR-07
aliases: [FR-07]
title: Assignment Management
area: work
source: "§9"
status: specified
priority: must
updated: 2026-09-12
---

# FR-07 — Assignment Management (Ödev)

> **Source:** catalog §9 · **Rules:** [[BR-005]]

## Intent

"Görev" (task) and "ödev" (homework/assignment) are two different things to a Turkish coach: a task
is any piece of coaching work — read this, plan your week, fix your sleep schedule — while an
assignment is concrete academic homework. Students and parents think about them separately, and so
must the statistics.

Behaviourally they are identical.

## Requirements

- **FR-07.1** Tasks and assignments are managed as **independent content types** ([[BR-005]]).
- **FR-07.2** A coach can assign an assignment to any actively linked student.
- **FR-07.3** Every rule defined for tasks applies unchanged to assignments: assigning coach, due
  date, completion request, coach approval, return, optional return note, on-time completion, late
  completion, overdue-and-incomplete, action history, notifications, multi-coach support.
- **FR-07.4** Task progress and assignment progress are calculated **separately** and never mixed.

## Acceptance criteria

- [ ] Every acceptance criterion in [[FR-06]] passes for assignments too.
- [ ] Daily/weekly/monthly statistics report tasks and assignments as separate figures
      ([[FR-14]]).
- [ ] Completing all tasks while ignoring all assignments leaves the assignment Filiz at its lowest
      stage ([[FR-08]]).

## Implementation note

One `WorkItem` table with a `type` discriminator (`TASK` | `ASSIGNMENT`), not two parallel tables —
the rules are identical and duplicating them guarantees they will drift. All statistics group by
`type`. Rationale and the rejected alternatives: [[ADR-0005]].

The separation the client asks for is a *product* separation (separate lists, separate progress,
separate Filiz), and it must hold at every surface even though the storage is shared.

## Related

[[FR-06]] · [[FR-08]] · [[FR-14]] · [[ADR-0005]] · [[BR-005]]

## Change log

- 2026-09-12 — created from catalog §9
