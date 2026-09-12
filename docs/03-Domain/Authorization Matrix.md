---
title: Authorization Matrix
status: draft
updated: 2026-09-12
---

# Authorization Matrix

The concrete form of [[FR-02]], catalog §32–§33. **Enforced in the backend** — the UI only mirrors it.

Columns:

- **Student** — the student the data belongs to
- **Coach (owner)** — an actively linked coach who created the item
- **Coach (other)** — an actively linked coach who did *not* create it
- **Parent** — an approved, active parent of that student
- **Anyone else** — including unlinked coaches, pending parents, other students

`R` read · `W` create/update · `—` no access

| Resource | Student | Coach (owner) | Coach (other) | Parent | Anyone else |
| --- | --- | --- | --- | --- | --- |
| Own profile | R W | R W | — | R W (own) | — |
| Student grade level | R W | R W | R W | R | — |
| Coach–student link | R W (end) | R W (end) | — | R | — |
| Parent–student link | R | R W (approve) | R W (approve) | R (own) | — |
| Task / assignment | R, submit | R W, approve/return | — | R¹ | — |
| Work item history | R | R | — | R¹ | — |
| Lesson request | R, accept/decline | R W | — | R¹ | — |
| Lesson cancellation | W | W | — | — | — |
| Attendance | R | R W | — | R¹ | — |
| Personal schedule (school, personal) | R W | **—** | **—** | — | — |
| Schedule: own lessons | R | R | — | — | — |
| Resource pool | R W | R | R | R¹ | — |
| Resource recommendation | R | R W | — | — | — |
| Shared file | R (if shared) | R W | — | — | — |
| Mock exam result | R W | R, approve | R, approve | R¹ (approved only) | — |
| Progress / statistics | R (own) | R (own items) | R (own items) | R¹ | — |
| Price | **—** | R W | — | R | — |
| Timesheet / earnings | **—** | R | — | R | — |
| Coach's pool total earnings | — | R (own) | — | **—** | — |
| Notification | R (own) | R W (to own students) | — | R (own) | — |
| Notification template | — | R W (own) | — | — | — |
| Audit log | — | — | — | — | — (support only) |

¹ Only if the coach has opened that category to the parent ([[FR-20]], [[Open Questions|Q-05]]).

## The five bolded cells

Those are the ones the catalog states explicitly and the ones a careless join will break:

1. **Coach cannot read the personal schedule** — [[BR-014]]. Not school hours, not personal events,
   not free time. Only their own lessons.
2. **Student cannot read price** — [[BR-022]].
3. **Student cannot read earnings** — [[BR-022]].
4. **Parent cannot read the coach's pool total** — that is the coach's business across other
   families ([[FR-19|FR-19.9]]).
5. **Coach (other) has no access to another coach's items** — [[BR-024]], the whole "Coach (other)"
   column of dashes.

## Rules of enforcement

1. Resolve the caller's **capabilities** once per request (which students, in which capacity), then
   scope every query with it. Do not re-derive permissions per controller.
2. Rows the caller cannot see return **404, not 403** — otherwise the API confirms that Coach B has
   a task with that id.
3. Never share a serializer between a coach response and a student response for anything containing
   money.
4. Every list endpoint gets a negative test. Positive tests do not catch leakage.
5. `ENDED` links grant no writes. Read access after ending is [[Open Questions|Q-07]].

## Related

[[FR-02]] · [[BR-024]] · [[BR-022]] · [[BR-014]] · [[Domain Model]]
