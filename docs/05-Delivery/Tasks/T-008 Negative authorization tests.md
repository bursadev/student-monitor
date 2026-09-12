---
id: T-008
aliases: [T-008]
title: Negative authorization tests
status: todo
milestone: M1
area: authorization
requirements: [FR-02]
updated: 2026-09-12
---

# T-008 — Negative authorization test suite

**Goal.** A test suite that fails loudly the moment [[BR-024]] or [[BR-022]] is broken.

**Implements.** [[FR-02]] · [[Authorization Matrix]]

> Positive tests do not catch leakage. This suite is the one that matters, and it must grow with
> every new endpoint.

## Steps

- [ ] Fixture: one student, two coaches, one approved parent, one pending parent, one stranger
- [ ] For every coach-owned resource: Coach B gets 404 on read, update, delete and every list filter
- [ ] For every money route: the student gets 404
- [ ] For the schedule: no coach-facing response contains `SCHOOL` or `PERSONAL` entries
- [ ] For every parent route: pending parent gets nothing; approved parent gets only opened categories
- [ ] A lint rule or test asserting no student-facing response schema contains a money field
- [ ] Make adding an endpoint without a negative test visible in review

## Done when

- [ ] Deliberately removing a `coachId` filter makes the suite fail
