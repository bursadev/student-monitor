---
id: BR-014
aliases: [BR-014, İK-014]
source: "İK-014"
area: schedule
status: specified
updated: 2026-09-12
---

# BR-014 — A coach cannot see the student's whole personal schedule

**Rule.** A coach cannot view the student's complete personal calendar — not their school timetable,
not personal activities, not free time. A coach sees only the lesson/meeting records within their own
coaching relationship.

**Why.** The student's calendar is private. A coaching app that quietly becomes a surveillance tool
loses the student, and the student is the daily user.

**Enforcement.** Schedule queries for a coach filter to `kind = LESSON AND coachId = :caller`. Entry
kinds `SCHOOL` and `PERSONAL` are never serialised into a coach-facing DTO.

**Verification.** A coach's view of a student who has a full school week and two coaches returns only
that coach's lessons.

**Related.** [[FR-11]] · [[FR-09]] · [[BR-015]] · [[Authorization Matrix]]
