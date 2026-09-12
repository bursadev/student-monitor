---
id: FR-06
aliases: [FR-06]
title: Task Management
area: work
source: "§6, §7, §8"
status: specified
priority: must
updated: 2026-09-12
---

# FR-06 — Task Management

> **Source:** catalog §6.1–6.7, §7.1–7.3, §8 · **Rules:** [[BR-005]], [[BR-006]], [[BR-007]],
> [[BR-008]], [[BR-009]], [[BR-010]], [[BR-025]]

## Intent

The core loop. A coach assigns work with a deadline; the student says "done"; the coach decides
whether it really is. The gap between those last two steps is the whole point of a coaching app —
and the reason the system must never collapse *submitted* and *approved* into one timestamp.

## Requirements

### Creating and viewing

- **FR-06.1** A coach can assign a task to any actively linked student.
- **FR-06.2** A task carries at least: student, assigning coach, content, due date, creation
  metadata, current status.
- **FR-06.3** A student can see every task assigned to them, each showing which coach assigned it.

### Statuses

- **FR-06.4** The system distinguishes at least:

  | Code | Turkish (catalog) | Meaning |
  | --- | --- | --- |
  | `OPEN` | Henüz tamamlanmamış | assigned, not yet submitted, not yet overdue |
  | `PENDING_APPROVAL` | Onay bekleyen | student submitted, coach has not decided |
  | `RETURNED` | Geri gönderildi | coach sent it back, student must redo |
  | `COMPLETED_ON_TIME` | Zamanında tamamlanmış | approved, submitted on or before the due date |
  | `COMPLETED_LATE` | Geç tamamlanmış | approved, submitted after the due date |
  | `OVERDUE` | Son tarihi geçmiş ve tamamlanmamış | past due, never submitted |

  UI labels may differ; these codes may not.

### The submit → approve cycle

- **FR-06.5** A student can report a task as done. This creates a **completion request** and does
  **not** close the task ([[BR-006]]).
- **FR-06.6** The completion request goes to the assigning coach only ([[BR-007]]). The student's
  other coaches receive nothing for this task.
- **FR-06.7** The coach can **approve** or **return** the request.
- **FR-06.8** A task is only definitively complete after the assigning coach approves it.
- **FR-06.9** When returning, the coach may write an explanation. It is **optional** ([[BR-008]]).
  If written, the student can read it.
- **FR-06.10** A returned task can be submitted again; each round trip is recorded.

### Lateness

- **FR-06.11** Lateness is computed from the **student's submission time**, never the coach's
  approval time ([[BR-009]]).
- **FR-06.12** Submitted on or before the due date → on time. A coach approving days later does not
  change that.
- **FR-06.13** Submitted after the due date and then approved → `COMPLETED_LATE`.
- **FR-06.14** Past due with no submission → `OVERDUE`.
- **FR-06.15** `COMPLETED_LATE` and `OVERDUE` are never merged into one statistic ([[BR-010]]).

> **Which submission counts when a task was returned and resubmitted?** Proposed: the **last**
> submission before approval determines on-time vs late — a returned task was not actually complete.
> Needs client confirmation; tracked as a design note below.

### History

- **FR-06.16** The system preserves at least: creation time, due date, each student submission time,
  each coach approval time, each return time, the return note if any, resubmission details, and the
  final status.
- **FR-06.17** Submission time and approval time are stored separately and are never substituted for
  one another.
- **FR-06.18** Past tasks are never deleted after completion or after the deadline passes
  ([[BR-025]]).

## Acceptance criteria

- [ ] A task submitted at 23:59 on the due date and approved three days later is `COMPLETED_ON_TIME`.
- [ ] A task submitted one minute after the due date and approved is `COMPLETED_LATE`.
- [ ] A task never submitted and now past due is `OVERDUE`, and is counted separately from late ones.
- [ ] Returning without a note succeeds; the note field is nullable everywhere, including the API.
- [ ] Only the assigning coach can approve; a second coach of the same student gets 404
      ([[BR-024]]).
- [ ] The completion notification reaches exactly one coach.
- [ ] The full event history of a task with two returns and three submissions is reconstructable.

## Design notes

- `OVERDUE` is **derived**, not a stored transition — it is a function of `dueAt`, `submittedAt` and
  now. Do not run a cron job to "mark things overdue"; compute it in the query and you can never be
  stale. The same applies to on-time vs late, which is resolved at approval.
- Store the event log ([[FR-21]]) as the source of truth for §8 and derive the current status.
- Tasks and assignments share this entire engine; see [[FR-07]] and [[ADR-0005]].
- Editing after submission: [[Open Questions|Q-13]].

## Open questions

- [[Open Questions|Q-13]] — can a coach edit a task after submission?
- Which submission determines lateness after a return (see above).

## Related

[[FR-07]] · [[FR-08]] · [[FR-14]] · [[FR-16]] · [[FR-21]] · [[State Machines]]

## Change log

- 2026-09-12 — created from catalog §6, §7, §8
