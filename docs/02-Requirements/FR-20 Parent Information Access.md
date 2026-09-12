---
id: FR-20
aliases: [FR-20]
title: Parent Information Access
area: parent
source: "§30"
status: specified
priority: must
updated: 2026-09-12
---

# FR-20 — Parent Information Access

> **Source:** catalog §30 · **Rules:** [[BR-003]], [[BR-022]]

## Intent

The parent pays and worries, but does not coach. Their view is *informational* — a weekly reassurance
that the work is happening and the money is accounted for — not a management console.

## Requirements

- **FR-20.1** A parent can view the progress information that the coach has **opened to them** for
  their linked student.
- **FR-20.2** The purpose on the parent side is general follow-up and information, not student
  management.
- **FR-20.3** Data that may be surfaced to a parent includes: overall work progress, completed and
  missing work, lesson attendance, mock exam development, information shared by the coach, price,
  and timesheet/earnings.
- **FR-20.4** Price and earnings are parent-facing financial information and are **never**
  student-facing ([[BR-022]]).
- **FR-20.5** A parent sees only students they are actively and approvedly linked to ([[BR-003]]).
- **FR-20.6** The coach controls what is opened; nothing is shared by default.
- **FR-20.7** A parent can receive notifications from the coach ([[FR-16]]), but does not
  automatically receive the student's notifications.

## Acceptance criteria

- [ ] A newly approved parent sees the student's name and nothing else until the coach opens
      categories.
- [ ] Turning off a category removes it from the parent's view immediately.
- [ ] A parent's financial view shows price and earnings for every coach the student works with,
      each attributed — but never a coach's pool total across other students.
- [ ] Unapproved mock exam results never reach a parent ([[BR-017]]).
- [ ] No parent endpoint allows a write to student data.

## Design notes

- **Sharing granularity is open** ([[Open Questions|Q-05]]). Proposal: per-category toggles set by
  the coach on the coach–student relationship — progress / attendance / exams / financial — all off
  until the coach turns them on. A single master switch is simpler but forces the coach to choose
  between "everything" and "nothing", which they will not do.
- Two parents share the same view; there is no per-parent configuration.
- The parent view is weekly-cadence, not daily. Design for a summary, not a feed.
- Consider a monthly digest notification — the parent behaviour we want is "read the summary", not
  "log in and dig".

## Open questions

- [[Open Questions|Q-05]] — sharing granularity.

## Related

[[FR-05]] · [[FR-14]] · [[FR-15]] · [[FR-18]] · [[FR-19]] · [[Authorization Matrix]]

## Change log

- 2026-09-12 — created from catalog §30
