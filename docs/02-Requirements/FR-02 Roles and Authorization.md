---
id: FR-02
aliases: [FR-02]
title: Roles and Authorization
area: identity
source: "§3.3, §32, §33"
status: specified
priority: must
updated: 2026-09-12
---

# FR-02 — Roles and Authorization

> **Source:** catalog §3.3, §32, §33 · **Rules:** [[BR-022]], [[BR-024]]

## Intent

Three roles, and within each role, access is further narrowed by *relationship*. Being a coach does
not grant access to students; being the coach of Mert grants access to Mert's coaching data — and
only the part this coach owns.

This is the requirement most likely to be violated by a careless query. Treat every list endpoint as
a security decision.

## Requirements

- **FR-02.1** The system enforces permissions by role **and** by relationship.
- **FR-02.2** Authorization is enforced in the backend, not only in the UI. A hidden button is not
  a permission ([[BR-024]]).
- **FR-02.3** A coach may only access data for students they are **actively linked** to.
- **FR-02.4** Where a resource is coach-owned (task, assignment, lesson, file, recommendation,
  notification, rate, earning), only the owning coach may manage it. Another coach of the same
  student gets no management rights ([[BR-024]]).
- **FR-02.5** A student may access their own tasks, assignments, schedule, lesson requests, progress
  history, mock exam results, resource pool, recommendations and files shared with them.
- **FR-02.6** A student may **never** access price or earnings data ([[BR-022]]).
- **FR-02.7** A parent may access only an approved, active linked student, only the progress data
  the coach has opened to them, plus that student's price and earnings.
- **FR-02.8** A parent has no management rights over the student's or the coach's data.
- **FR-02.9** Requests for rows the caller cannot see return "not found" rather than "forbidden", so
  the API does not leak the existence of another coach's data.

## Acceptance criteria

- [ ] Coach B cannot read, update, approve or delete a task created by Coach A for a shared student —
      by id, by list, by any filter.
- [ ] A student calling the pricing or earnings endpoints gets 404 regardless of parameters.
- [ ] A parent whose link is `PENDING` gets nothing; the same parent after coach approval gets only
      the opened categories.
- [ ] An ended coach–student relationship stops new writes (see [[Open Questions|Q-07]] for reads).
- [ ] Every list endpoint has a test proving cross-tenant leakage fails.

## Implementation notes

- Every coach-owned table carries `coachId`; every read filters on both `studentId` and `coachId`.
- Centralise this: a policy/guard layer that resolves "which students may this caller see, in which
  capacity" once per request, rather than ad-hoc `where` clauses per controller. See [[ADR-0006]].
- Consider Postgres row-level security as defence in depth later; application-level scoping first.

## Related

[[Authorization Matrix]] · [[BR-024]] · [[BR-022]] · [[FR-04]] · [[FR-05]] · [[FR-21]]

## Change log

- 2026-09-12 — created from catalog §3.3, §32, §33
