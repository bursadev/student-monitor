---
id: FR-17
aliases: [FR-17]
title: Coach Student Monitoring
area: coach
source: "§27"
status: specified
priority: must
updated: 2026-09-12
---

# FR-17 — Coach's Student Follow-up

> **Source:** catalog §27 · **Rules:** [[BR-024]]

## Intent

A coach with 30 students cannot open 30 profiles every morning. They need one screen that answers:
who is fine, who is behind, and who is waiting on **me**.

The catalog is explicit that this does not mandate a particular dashboard design — the requirement
is the *information*, not the layout.

## Requirements

- **FR-17.1** A coach can follow the working status of their linked students.
- **FR-17.2** The coach can at minimum distinguish students who: have completed their work, have
  missing work, have work pending the coach's approval.
- **FR-17.3** The coach can send quick notifications to a student or a group of students from this
  context ([[FR-16]]).
- **FR-17.4** All figures respect ownership: a coach sees progress on **their own** assigned work,
  not work assigned by the student's other coaches ([[BR-024]]).

## Acceptance criteria

- [ ] For a student shared by two coaches, each coach's follow-up view counts only their own items.
- [ ] "Pending approval" lists exactly the items this coach must act on.
- [ ] Selecting several students from the list and sending a templated message works in one flow.
- [ ] The view loads in one query per group, not N+1 per student.
- [ ] Past lessons with no attendance recorded surface here too ([[FR-10]]).

## Design notes

- The three buckets are an *action* ordering, not a report: **waiting on me** first, then **behind**,
  then **fine**. Anything else makes the coach do the triage the app should have done.
- Worth including: last activity per student, tomorrow's lessons, unapproved mock exam results
  ([[FR-15]]).
- This screen is where a coach lives. It deserves the most design attention of any surface — see
  [[Screen Inventory]].

## Related

[[FR-06]] · [[FR-10]] · [[FR-15]] · [[FR-16]] · [[BR-024]] · [[Screen Inventory]]

## Change log

- 2026-09-12 — created from catalog §27
