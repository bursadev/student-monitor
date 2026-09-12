---
title: Task Board
updated: 2026-09-12
---

# Task Board

Tasks live as notes in `05-Delivery/Tasks/` with `status` frontmatter. Use [[Task]] as the template.

## In progress

```dataview
TABLE milestone, area, requirements
FROM "05-Delivery/Tasks"
WHERE status = "doing"
SORT id ASC
```

## Blocked

```dataview
TABLE milestone, area
FROM "05-Delivery/Tasks"
WHERE status = "blocked"
SORT id ASC
```

## Todo

```dataview
TABLE milestone, area
FROM "05-Delivery/Tasks"
WHERE status = "todo"
SORT milestone ASC, id ASC
```

## Done

```dataview
TABLE milestone, updated
FROM "05-Delivery/Tasks"
WHERE status = "done"
SORT updated DESC
LIMIT 20
```

---

## Without Dataview

The current seed backlog, manually:

### M0 — Foundation
- [ ] [[T-001]] Scaffold the monorepo
- [ ] [[T-002]] NestJS skeleton with Prisma and the first migration
- [ ] [[T-003]] CI pipeline

### M1 — Identity and relationships
- [ ] [[T-004]] Auth: register, login, refresh, logout
- [ ] [[T-005]] Policy layer and capability resolution
- [ ] [[T-006]] Coach–student links and invite codes
- [ ] [[T-007]] Parent links with coach approval and the max-2 constraint
- [ ] [[T-008]] Negative authorization test suite

### M2 — The work loop
- [ ] [[T-009]] WorkItem model, assign and list
- [ ] [[T-010]] Submit, approve, return, and derived status
- [ ] [[T-011]] Work item event history
- [ ] [[T-012]] Event notifications

### M0 — follow-ups
- [x] [[T-014]] i18n setup on web and mobile

### Continuous
- [ ] [[T-013]] Chase the client on [[Open Questions]]

## Conventions

- One task ≈ one reviewable pull request. If it cannot be, split it.
- Every task names the requirements it implements, and updates their status when it closes.
- A task that uncovers an ambiguity adds a `Q-xx` to [[Open Questions]] rather than guessing.
