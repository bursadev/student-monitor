---
id: FR-05
aliases: [FR-05]
title: Parent Student Relationship
area: relationships
source: "§5"
status: specified
priority: must
updated: 2026-09-12
---

# FR-05 — Parent–Student Relationship

> **Source:** catalog §5.1–5.4 · **Rules:** [[BR-003]], [[BR-004]], [[BR-022]]

## Intent

A parent account by itself is worth nothing: it grants access to no student. The link is gated by
the **coach's approval**, not the student's — the coach is the professional accountable for who sees
a minor's data.

## Requirements

- **FR-05.1** A parent can create their own account ([[FR-01]]).
- **FR-05.2** Creating a parent account grants no access to any student's data.
- **FR-05.3** A parent can start the process of being linked to a student.
- **FR-05.4** Only the student's coach can approve a parent–student link ([[BR-003]]).
- **FR-05.5** Until approved, the parent can access none of the student's protected data.
- **FR-05.6** A student may have at most **2 active parents** at any time. The system prevents a
  third ([[BR-004]]).
- **FR-05.7** A parent accesses only the linked student, and only the information the coach has
  opened to them ([[FR-20]]).
- **FR-05.8** A parent has no management rights over the student's or the coach's data — no
  assigning, no approving, no cancelling.
- **FR-05.9** A link can be revoked, freeing a slot. Revoked links keep their history.

## Acceptance criteria

- [ ] Creating the third active parent link fails with a clear, translated error.
- [ ] Revoking one of two links lets a third parent be approved.
- [ ] A `PENDING` parent calling any student endpoint gets nothing.
- [ ] An approved parent can read price and earnings for that student ([[BR-022]]) but cannot write.
- [ ] Approval is recorded with the approving coach and timestamp ([[FR-21]]).

## Design notes

- **Which coach approves when the student has several?** Any actively linked coach may approve; the
  approval records *which* one did. This needs confirming with the client — added as
  [[Open Questions|Q-05]] context.
- A parent link should be startable from either end: the parent enters the student's code, or the
  coach invites the parent directly. The coach's approval is required either way.
- Two parents typically means mother and father; both should see the same thing.

## State machine

`PENDING_COACH_APPROVAL → ACTIVE → REVOKED`, plus `REJECTED`.

## Related

[[FR-20]] · [[FR-02]] · [[BR-003]] · [[BR-004]] · [[Authorization Matrix]]

## Change log

- 2026-09-12 — created from catalog §5
