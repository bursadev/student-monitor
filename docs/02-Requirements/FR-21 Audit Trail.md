---
id: FR-21
aliases: [FR-21]
title: Audit Trail
area: platform
source: "§34, §8"
status: specified
priority: must
updated: 2026-09-12
---

# FR-21 — Status and Action History

> **Source:** catalog §34 (and §8 for work items) · **Rules:** [[BR-025]]

## Intent

Every disputed conversation in this product — "I did submit it", "you never told me the lesson was
cancelled", "the price was different then" — is settled by the event log. It is also the only way
[[FR-14]] can report history that does not change retroactively.

Cheap to build now; impossible to backfill later.

## Requirements

- **FR-21.1** Significant state changes are traceable, with **actor** and **timestamp** preserved.
- **FR-21.2** At minimum, these events are recorded:
  task/assignment creation, completion request, return, approval, lesson request, lesson
  acceptance/decline, lesson cancellation, mock exam result submission/approval, resource
  recommendation, price change, timesheet/earning creation.
- **FR-21.3** For work items specifically (§8): creation time, due date, each submission time, each
  approval time, each return time, the return note if any, resubmission details, final status.
- **FR-21.4** Submission time and approval time are stored as distinct fields and never substituted.
- **FR-21.5** Historical records are preserved for reporting; they are not deleted when a
  relationship ends or an item completes ([[BR-025]]).

## Acceptance criteria

- [ ] For any work item, the full sequence of events can be replayed in order with actors.
- [ ] Ending a coach–student relationship deletes no event rows.
- [ ] A price change leaves a record of the old and new value, the actor and the effective date.
- [ ] Attendance corrections are traceable, because they move money ([[FR-19]]).
- [ ] Audit rows are append-only — no update path exists in the application.

## Implementation notes

- One `audit_log` table: `actorId`, `entityType`, `entityId`, `action`, `payload` (jsonb before/after
  or event-specific), `createdAt`. Append-only, indexed on `(entityType, entityId, createdAt)`.
- Work-item events additionally drive the domain (status derivation), so they deserve a typed
  `work_item_events` table rather than living only in generic audit rows.
- Write the audit entry in the **same transaction** as the change. An audit trail that can silently
  miss events is worse than none, because people trust it.
- Retention: keep indefinitely in v1; revisit under [[Security and Privacy]] (KVKK gives data
  subjects deletion rights that interact with this).

## Related

[[FR-06]] · [[FR-14]] · [[FR-18]] · [[FR-19]] · [[BR-025]] · [[Security and Privacy]]

## Change log

- 2026-09-12 — created from catalog §34
