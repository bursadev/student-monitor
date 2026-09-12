---
id: FR-09
aliases: [FR-09]
title: Lesson Scheduling
area: lessons
source: "§11, §12"
status: specified
priority: must
updated: 2026-09-12
---

# FR-09 — Lesson Scheduling and Cancellation

> **Source:** catalog §11.1–11.3, §12 · **Rules:** [[BR-011]], [[BR-012]], [[BR-013]]

## Intent

Lessons are the billable unit: a coach proposes a time, the student confirms, and what actually
happened feeds both the student's calendar and the coach's earnings. Asymmetric on purpose — the
coach drives scheduling, the student consents.

## Requirements

### Requesting

- **FR-09.1** **Only a coach** can create a lesson request. A student cannot request a lesson from a
  coach ([[BR-011]]).
- **FR-09.2** A coach can propose a lesson/meeting for a specific date and time to a linked student.
- **FR-09.3** A lesson request carries at least: student, coach, date, time, lesson/meeting details,
  status.

### Student response

- **FR-09.4** The student can **accept** or **decline** the request.
- **FR-09.5** A lesson is not confirmed until the student accepts.
- **FR-09.6** An accepted lesson is added to the student's schedule ([[FR-11]]).
- **FR-09.7** When declining, the student may write an explanation — **optional**.
- **FR-09.8** The decline, and any explanation, is delivered to the requesting coach.

### Cancellation

- **FR-09.9** Once confirmed, **either** the coach or the student can cancel ([[BR-012]]).
- **FR-09.10** A cancellation may carry an explanation — **optional** ([[BR-013]]).
- **FR-09.11** The system records at least: who initiated the cancellation, when, and the
  explanation if given.
- **FR-09.12** A cancelled lesson is **not** counted as a delivered lesson. Its effect on
  earnings is governed by an explicit business rule ([[FR-19]], [[Open Questions|Q-03]]).

## Acceptance criteria

- [ ] No API path lets a student create a lesson request, including by crafting the payload.
- [ ] A pending request does not appear in the student's schedule; an accepted one does.
- [ ] Cancelling records the initiator; both a coach-initiated and a student-initiated cancellation
      are distinguishable afterwards.
- [ ] Declining and cancelling both work with an empty note.
- [ ] A cancelled lesson never produces a billable timesheet entry under the default rule.

## State machine

`REQUESTED → ACCEPTED → (COMPLETED | CANCELLED)`, plus `DECLINED` from `REQUESTED`.
Attendance is recorded against `COMPLETED` — see [[FR-10]] and [[State Machines]].

## Design notes

- Overlap detection: the coach should be warned when proposing a time that collides with one of
  their own confirmed lessons. The student's other commitments are invisible to the coach by design
  ([[BR-014]]) — so the student must be able to see the conflict when accepting.
- Time zone is `Europe/Istanbul`; store UTC.
- Recurring lessons ("every Tuesday 19:00") are the obvious next request — [[Open Questions|Q-14]].

## Open questions

- [[Open Questions|Q-03]] — does a cancelled lesson earn anything, and does the initiator matter?
- [[Open Questions|Q-14]] — recurring lessons.

## Related

[[FR-10]] · [[FR-11]] · [[FR-19]] · [[BR-011]] · [[BR-012]]

## Change log

- 2026-09-12 — created from catalog §11, §12
