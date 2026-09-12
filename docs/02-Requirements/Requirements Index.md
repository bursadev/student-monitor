---
title: Requirements Index
updated: 2026-09-12
---

# Requirements Index

22 functional areas derived from [[Source - Requirement Catalog (TR)]]. Sub-requirements are
numbered inside each note (`FR-06.4`) and are the unit we write tests against.

```dataview
TABLE status, priority, source AS "Catalog §", area
FROM "02-Requirements"
WHERE id != null AND contains(id, "FR")
SORT id ASC
```

## All areas

| ID | Area | Catalog § | Priority | v1 |
| --- | --- | --- | --- | --- |
| [[FR-01]] | Accounts and Sessions | §3.1, §3.2 | must | ✅ |
| [[FR-02]] | Roles and Authorization | §3.3, §32, §33 | must | ✅ |
| [[FR-03]] | Student Profile and Grade Level | §3.4 | must | ✅ |
| [[FR-04]] | Coach Student Relationship | §4 | must | ✅ |
| [[FR-05]] | Parent Student Relationship | §5 | must | ✅ |
| [[FR-06]] | Task Management | §6, §7, §8 | must | ✅ |
| [[FR-07]] | Assignment Management | §9 | must | ✅ |
| [[FR-08]] | Filiz Progress Character | §10 | should | ✅ |
| [[FR-09]] | Lesson Scheduling | §11, §12 | must | ✅ |
| [[FR-10]] | Lesson Attendance | §15 | must | ✅ |
| [[FR-11]] | Student Schedule | §13, §14 | must | ✅ |
| [[FR-12]] | Resource Pool and Recommendations | §16 | should | ⏳ |
| [[FR-13]] | File Sharing | §17 | should | ⏳ |
| [[FR-14]] | Progress Reporting | §18–§21 | must | partial |
| [[FR-15]] | Mock Exam Tracking | §22, §23, §24 | must | ⏳ |
| [[FR-16]] | Notifications | §25, §26, §31 | must | partial |
| [[FR-17]] | Coach Student Monitoring | §27 | must | ✅ |
| [[FR-18]] | Student Pricing | §28 | must | ✅ |
| [[FR-19]] | Timesheet and Earnings | §29 | must | ✅ |
| [[FR-20]] | Parent Information Access | §30 | must | ✅ |
| [[FR-21]] | Audit Trail | §34 | must | ✅ |
| [[FR-22]] | Subscription and Billing | §35 | should | ⏳ |

✅ in v1 · ⏳ deferred — see [[Scope and MVP]]

## Catalog section → requirement map

Use this to check nothing from the client's document got lost.

| § | Topic | Covered by |
| --- | --- | --- |
| 1 | Purpose of the document | — (meta) |
| 2 | System users | [[Personas]], [[FR-02]] |
| 3.1–3.2 | Account creation, sessions | [[FR-01]] |
| 3.3 | Role-based authorization | [[FR-02]] |
| 3.4 | Student education info | [[FR-03]] |
| 4.1–4.6 | Coach–student relationship | [[FR-04]] |
| 5.1–5.4 | Parent–student relationship | [[FR-05]] |
| 6.1–6.7 | Task management | [[FR-06]] |
| 7.1–7.3 | Lateness handling | [[FR-06]] |
| 8 | Task history | [[FR-06]], [[FR-21]] |
| 9 | Assignments | [[FR-07]] |
| 10 | Filiz / progress | [[FR-08]] |
| 11.1–11.3 | Lesson requests | [[FR-09]] |
| 12 | Lesson cancellation | [[FR-09]] |
| 13 | Student schedule | [[FR-11]] |
| 14 | Schedule privacy | [[FR-11]] |
| 15 | Attendance | [[FR-10]] |
| 16.1–16.2 | Resource pool, recommendations | [[FR-12]] |
| 17 | File sharing | [[FR-13]] |
| 18–21 | History, daily/weekly/monthly progress | [[FR-14]] |
| 22.1–22.2 | Mock exam tracking | [[FR-15]] |
| 23–24 | Exam approval and progression | [[FR-15]] |
| 25 | Event notifications | [[FR-16]] |
| 26 | Coach-sent notifications, templates | [[FR-16]] |
| 27 | Coach follow-up | [[FR-17]] |
| 28 | Per-student pricing | [[FR-18]] |
| 29.1–29.3 | Timesheet / earnings | [[FR-19]] |
| 30 | Parent information | [[FR-20]] |
| 31 | Coach → parent notifications | [[FR-16]], [[FR-20]] |
| 32 | Data authorization | [[FR-02]], [[Authorization Matrix]] |
| 33 | Multi-coach isolation | [[FR-02]], [[BR-024]] |
| 34 | Status and action history | [[FR-21]] |
| 35 | Subscription model | [[FR-22]] |
| 36 | Domain concepts | [[Domain Model]] |
| 37 | Business rules İK-001..026 | [[Business Rules Index]] |

## Related

[[Business Rules Index]] · [[Domain Model]] · [[Scope and MVP]] · [[Roadmap]]
