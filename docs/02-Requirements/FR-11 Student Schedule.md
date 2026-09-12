---
id: FR-11
aliases: [FR-11]
title: Student Schedule
area: schedule
source: "§13, §14"
status: specified
priority: must
updated: 2026-09-12
---

# FR-11 — Student Schedule and Its Privacy

> **Source:** catalog §13, §14 · **Rules:** [[BR-014]]

## Intent

The student's weekly plan is *theirs*. It is the tool that makes prep-alongside-school survivable —
and it is explicitly not a surveillance surface for the coach.

## Requirements

### The schedule

- **FR-11.1** A student can create and edit their own personal schedule.
- **FR-11.2** The schedule covers at least **06:00–24:00**.
- **FR-11.3** Entry kinds include at least: school, task, assignment, mock exam, personal activity.
- **FR-11.4** Time ranges with no entry are automatically considered free. The student never creates
  an explicit "free" entry.
- **FR-11.5** A student can select **multiple time slots at once** and apply the same entry to all
  of them — the fast path for entering a repeating school timetable.

### Privacy

- **FR-11.6** A coach can **not** view the student's whole personal calendar ([[BR-014]]).
- **FR-11.7** A coach cannot automatically see the student's school timetable, personal activities,
  or free time.
- **FR-11.8** A coach sees only the lesson/meeting records they created, or those within their own
  coaching relationship.

## Acceptance criteria

- [ ] No API response to a coach ever contains a `SCHOOL` or `PERSONAL` entry.
- [ ] The coach's calendar view of a student contains only that coach's lessons — verified with a
      student who has two coaches and a full school week.
- [ ] Selecting 08:00–15:00 across Monday–Friday and applying "School" creates the entries in one
      action.
- [ ] Deleting an entry returns the slot to free without creating a record.
- [ ] An accepted lesson appears in the student's schedule automatically ([[FR-09|FR-09.6]]).

## Design notes

- Storage: discrete entries with `startAt`/`endAt`, never a fixed grid of slots — the grid is a UI
  affordance, not a data model. Multi-select creates N entries (or one recurrence — see
  [[Open Questions|Q-15]]).
- The 06:00–24:00 window is a *minimum*; do not hard-code it as a maximum. Students preparing for
  YKS do study at 01:00.
- Lessons are a projection into the schedule, not copies: one source of truth in `Lesson`.
- If we ever want "find a free slot" for coaches, it must be a student-initiated share, never an
  automatic read — that would break [[BR-014]].

## Open questions

- [[Open Questions|Q-15]] — real recurrence rules vs per-week entries.

## Related

[[FR-09]] · [[BR-014]] · [[Authorization Matrix]] · [[UX Principles]]

## Change log

- 2026-09-12 — created from catalog §13, §14
