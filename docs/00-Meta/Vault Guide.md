---
title: Vault Guide
updated: 2026-09-12
---

# Vault Guide

## Languages

- **Turkish** — the product, the UI copy, the client's catalog. Preserved verbatim in
  [[Source - Requirement Catalog (TR)]].
- **English** — every note in this vault, all code identifiers, commits, tests.
- [[Glossary]] is the bridge. If a Turkish term has no entry there, add one before using it in code.

## ID scheme

| Prefix | Meaning | Example | Lives in |
| --- | --- | --- | --- |
| `FR-xx` | Functional requirement area | `FR-06 Task Management` | `02-Requirements/` |
| `FR-xx.n` | A single testable requirement | `FR-06.4` | inside the FR note |
| `BR-xxx` | Business rule (client's `İK-xxx`) | `BR-009` | `02-Requirements/Business Rules/` |
| `ADR-xxxx` | Architecture decision | `ADR-0003` | `04-Architecture/Decisions/` |
| `Mx` | Delivery milestone | `M1` | [[Milestones]], [[Roadmap]] |
| `T-xxx` | Work item | `T-004` | `05-Delivery/Tasks/` |
| `Q-xx` | Open product question | `Q-03` | [[Open Questions]] |

IDs never get reused and never get renumbered. A dropped requirement becomes
`status: dropped`, it does not disappear.

Reference them from code and commits: `feat(tasks): approval flow (FR-06.5, BR-007)`.

## Statuses

**Requirements** (`status:` in frontmatter)

| Value | Meaning |
| --- | --- |
| `draft` | captured but not yet reviewed against the catalog |
| `specified` | agreed, has acceptance criteria, ready to build |
| `in-progress` | being implemented |
| `implemented` | built, tested, shipped |
| `deferred` | agreed, but not in the current scope |
| `dropped` | will not be built (keep the note, state why) |

**Priority** — `must`, `should`, `could`, `wont-v1` (MoSCoW).

**Tasks** — `todo`, `doing`, `blocked`, `review`, `done`.

**ADRs** — `proposed`, `accepted`, `superseded by `ADR-xxxx``.

## Adding a note

Copy from `00-Meta/Templates/`:

- [[Requirement]] — a new FR area
- [[Business Rule]] — a new hard rule
- [[Task]] — a work item
- [[ADR]] — an architecture decision
- [[Meeting Note]] — a client conversation

Always fill the frontmatter; the index notes query it.

## Plugins

The index notes use **Dataview** queries. Without the plugin installed you will see the query as a
code block — every index also keeps a manual list, so nothing is lost. Core plugins used: Templates,
Backlinks, Outline, Graph.

## Rules for editing

1. Never edit [[Source - Requirement Catalog (TR)]]. It is the client's words. Corrections go into
   the FR note plus a line in [[Open Questions]].
2. One idea per note. Link generously — backlinks are how this vault stays navigable.
3. When you change a requirement, update `updated:` and say what changed at the bottom under
   *Change log*.
4. Superseded notes move to `99-Archive/`, they are not deleted.
