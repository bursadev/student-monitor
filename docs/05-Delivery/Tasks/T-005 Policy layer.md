---
id: T-005
aliases: [T-005]
title: Policy layer
status: todo
milestone: M1
area: authorization
requirements: [FR-02]
updated: 2026-09-12
---

# T-005 — Policy layer and capability resolution

**Goal.** One place decides what a caller can see, and no query can be built without it.

**Implements.** [[FR-02]] · [[ADR-0006]] · [[BR-024]] · [[BR-022]]

> The single highest-risk piece of the codebase. Do this before any feature that reads student data.

## Steps

- [ ] Resolve a capability set per request: student ids by capacity (own / coached / parented),
      ownership predicates, parent sharing settings — in one query
- [ ] Guard that attaches it to the request context
- [ ] Repository method signatures that **require** a capability set — no unscoped finders
- [ ] 404-not-403 behaviour for invisible rows
- [ ] Documented pattern in `CLAUDE.md` so every later feature follows it

## Done when

- [ ] A new endpoint cannot compile without scoping its query
- [ ] [[T-008]] passes against it
