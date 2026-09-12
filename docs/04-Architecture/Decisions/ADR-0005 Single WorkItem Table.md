---
id: ADR-0005
aliases: [ADR-0005]
title: One WorkItem table for tasks and assignments
status: accepted
date: 2026-09-12
---

# ADR-0005 — One `WorkItem` table for tasks and assignments

## Status

accepted

## Context

The catalog treats görev (task) and ödev (assignment) as independent content types ([[BR-005]]) and
then states that **every** rule defined for tasks applies unchanged to assignments (§9): assigning
coach, due date, completion request, approval, return, optional note, on-time/late/overdue, history,
notifications, multi-coach support.

So: identical behaviour, separate reporting.

## Decision

One `work_item` table with a `type` discriminator (`TASK` | `ASSIGNMENT`), one service, one state
machine. Every list, statistic and Filiz computation groups by `type`.

The product-level separation the client asked for is preserved at every surface — separate lists,
separate progress, separate Filiz — while the rules exist once.

## Consequences

**Good.** The approval and lateness logic — the most rule-dense, most easily broken part of the
system ([[BR-006]]–[[BR-010]]) — exists in exactly one place. A fix applies to both types. Adding a
third work type later (a reading log, a weekly review) is a new enum value.

**Bad / accepted cost.** Every query must remember to filter by `type`; forgetting it silently mixes
the statistics the client explicitly wants separate. Mitigation: the repository exposes
`tasksFor(...)` / `assignmentsFor(...)`, never a raw unfiltered finder, and the progress functions
take `type` as a required argument.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Two tables, two services | duplicated approval/lateness logic that will drift; the client's rules are identical by their own statement |
| Two tables, shared base class | inheritance in the ORM buys the coupling of one table with the query complexity of two |
| Single table, no discriminator, separate "category" free text | loses type safety and makes the required separate statistics fragile |
