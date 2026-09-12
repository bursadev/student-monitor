---
title: State Machines
status: draft
updated: 2026-09-12
---

# State Machines

Every transition below is guarded by *who* may perform it. The actor is part of the machine, not an
afterthought.

## Coach–student link ([[FR-04]])

```mermaid
stateDiagram-v2
  [*] --> PENDING_STUDENT_ACCEPT: coach invites
  [*] --> PENDING_COACH_ACCEPT: student requests
  PENDING_STUDENT_ACCEPT --> ACTIVE: student accepts
  PENDING_STUDENT_ACCEPT --> DECLINED: student declines
  PENDING_STUDENT_ACCEPT --> EXPIRED: invite expires
  PENDING_COACH_ACCEPT --> ACTIVE: coach accepts
  PENDING_COACH_ACCEPT --> DECLINED: coach declines
  ACTIVE --> ENDED: either side ends
  ENDED --> [*]
```

`ENDED` is terminal for that record; the pair may create a new link later. History survives
([[BR-002]], [[BR-025]]).

## Parent–student link ([[FR-05]])

```mermaid
stateDiagram-v2
  [*] --> PENDING_COACH_APPROVAL: parent requests / coach invites
  PENDING_COACH_APPROVAL --> ACTIVE: coach approves
  PENDING_COACH_APPROVAL --> REJECTED: coach rejects
  ACTIVE --> REVOKED: coach or parent revokes
```

At most two links may be `ACTIVE` per student ([[BR-004]]).

## Work item — task and assignment ([[FR-06]], [[FR-07]])

```mermaid
stateDiagram-v2
  [*] --> OPEN: coach assigns
  OPEN --> PENDING_APPROVAL: student submits
  RETURNED --> PENDING_APPROVAL: student resubmits
  PENDING_APPROVAL --> RETURNED: coach returns (note optional)
  PENDING_APPROVAL --> COMPLETED_ON_TIME: coach approves, submitted <= due
  PENDING_APPROVAL --> COMPLETED_LATE: coach approves, submitted > due
  COMPLETED_ON_TIME --> [*]
  COMPLETED_LATE --> [*]
```

**`OVERDUE` is not a state in this diagram on purpose.** It is a *view* of `OPEN` or `RETURNED` once
`now > dueAt`. Deriving it avoids a scheduled job and can never be stale.

Guards:

| Transition | Who |
| --- | --- |
| assign | the coach, with an active link |
| submit / resubmit | the student the item belongs to |
| approve / return | **only the assigning coach** ([[BR-007]]) |

The on-time/late branch uses `submittedAt`, never `approvedAt` ([[BR-009]]).

## Lesson ([[FR-09]], [[FR-10]])

```mermaid
stateDiagram-v2
  [*] --> REQUESTED: coach requests (students cannot)
  REQUESTED --> ACCEPTED: student accepts
  REQUESTED --> DECLINED: student declines (note optional)
  ACCEPTED --> CANCELLED: coach or student cancels (note optional)
  ACCEPTED --> COMPLETED: time passes
  COMPLETED --> [*]
```

Attendance is recorded against the outcome:

| Lesson outcome | Attendance | Billable (default) |
| --- | --- | --- |
| `COMPLETED`, student came | `ATTENDED` | yes |
| `COMPLETED`, student absent | `NO_SHOW` | yes |
| `CANCELLED` | `CANCELLED` | no |

Billability is configuration, not code ([[Open Questions|Q-03]], [[Open Questions|Q-04]]).

## Mock exam result ([[FR-15]])

```mermaid
stateDiagram-v2
  [*] --> PENDING_APPROVAL: student enters result
  PENDING_APPROVAL --> APPROVED: coach approves
```

Only `APPROVED` feeds statistics ([[BR-017]]). A rejection state may be added later
([[Open Questions|Q-16]]).

## Subscription ([[FR-22]])

```mermaid
stateDiagram-v2
  [*] --> TRIAL
  TRIAL --> ACTIVE: pays
  TRIAL --> LAPSED: trial ends
  ACTIVE --> LAPSED: payment fails / cancels
  LAPSED --> ACTIVE: pays
```

`LAPSED` restricts the coach's writes. It never locks students or parents out of their own data.

## Related

[[Domain Model]] · [[Authorization Matrix]] · [[Data Model]]
