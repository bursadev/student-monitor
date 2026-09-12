---
id: ADR-0006
aliases: [ADR-0006]
title: Central policy layer for authorization
status: accepted
date: 2026-09-12
---

# ADR-0006 — Central policy layer for authorization

## Status

accepted

## Context

Authorization here is not role-based; it is **relationship-based and ownership-based**
([[Authorization Matrix]]). "Is this caller allowed?" requires knowing which students they are
actively linked to, in what capacity, which items they own, and — for parents — which categories the
coach opened.

Written per controller, this becomes dozens of subtly different `where` clauses. [[BR-024]] and
[[BR-022]] then break the first time someone adds a feature in a hurry, and the failure is silent.

## Decision

A single policy module in `apps/backend/src/common/policy`:

1. A guard resolves the caller's **capability set** once per request:
   linked student ids per capacity (own / coached / parented), owned-resource predicates, parent
   sharing settings.
2. Services take that capability set as a required argument and use it to build every query scope.
3. There is no repository method that queries a scoped entity without a capability set — enforced by
   the method signatures, not by convention.
4. Invisible rows produce 404, not 403 ([[API Conventions]]).

## Consequences

**Good.** One place to read, review and test the rules the client cares most about. A negative test
suite ("Coach B gets 404 on every coach-owned resource of Coach A") covers the system rather than
one endpoint. New endpoints inherit correctness by construction.

**Bad / accepted cost.** Indirection: reading a service means understanding the capability object
first. Performance needs care — resolve capabilities in one query per request, not per check.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Permission checks in each controller | how [[BR-024]] gets broken; no central place to audit |
| CASL or a generic ability library | the rules are relationship-shaped, not subject/action-shaped; we would spend the effort encoding them into the library's model |
| Postgres row-level security | genuinely good defence in depth and worth adding later; on its own it pushes rules into SQL policies that are harder to test and to express for parent sharing settings |
