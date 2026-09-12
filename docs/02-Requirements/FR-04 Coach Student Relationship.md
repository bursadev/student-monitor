---
id: FR-04
aliases: [FR-04]
title: Coach Student Relationship
area: relationships
source: "§4"
status: specified
priority: must
updated: 2026-09-12
---

# FR-04 — Coach–Student Relationship

> **Source:** catalog §4.1–4.6 · **Rules:** [[BR-001]], [[BR-002]], [[BR-024]], [[BR-025]]

## Intent

The relationship — not the account — is what grants access. It is created deliberately by both
sides, it can be ended by either, and it is the boundary every authorization check is drawn around.

A student may work with several coaches at once, and their content must stay separated.

## Requirements

### Forming the link

- **FR-04.1** A student can be linked to more than one coach at the same time ([[BR-001]]).
- **FR-04.2** Linking happens through a controlled mechanism: invite code, invite link or QR code.
  The exact UX is a design decision; the security property is that both parties consent.
- **FR-04.3** A coach can invite a student. The link becomes **active** when the student accepts.
- **FR-04.4** A student can request to work with an existing coach. The link becomes active when the
  coach accepts.
- **FR-04.5** A connection request is *not* a lesson request. It only establishes the working
  relationship ([[BR-011]] keeps lesson requests coach-only).
- **FR-04.6** An invite is single-purpose and expires.

### Ending the link

- **FR-04.7** Either side can end an active relationship ([[BR-002]]).
- **FR-04.8** Ending the relationship never physically deletes past data ([[BR-025]]).
- **FR-04.9** After the relationship ends, access rules change without damaging historical records.
  Exact read access after ending: [[Open Questions|Q-07]].
- **FR-04.10** The same pair can re-link later; the previous period stays a distinct record.

### Ownership

- **FR-04.11** Everything a coach creates for a student is attributed to that coach: tasks,
  assignments, lessons, files, notifications, resource recommendations ([[BR-024]]).
- **FR-04.12** The system can always answer "which coach created this?" for every such record.

## Acceptance criteria

- [ ] A student with two active coaches sees both, and each task shows which coach assigned it.
- [ ] An invite code cannot be reused, cannot be guessed, and expires.
- [ ] Ending a link leaves every past task, lesson, and earning row intact.
- [ ] A partial unique index prevents two simultaneously active links for the same pair.
- [ ] After ending, the coach can no longer create new work for that student.

## State machine

See [[State Machines]] — `CoachStudentLink`:
`PENDING_STUDENT_ACCEPT | PENDING_COACH_ACCEPT → ACTIVE → ENDED`, plus `DECLINED` and `EXPIRED`.

## Open questions

- [[Open Questions|Q-07]] — read access after the relationship ends.
- [[Open Questions|Q-17]] — what happens to work pending approval when the link ends.

## Related

[[FR-02]] · [[FR-05]] · [[FR-06]] · [[FR-18]] · [[Authorization Matrix]]

## Change log

- 2026-09-12 — created from catalog §4
