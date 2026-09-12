---
title: Milestones
status: draft
updated: 2026-09-12
---

# Milestones

Each milestone has an **exit criterion**: something demonstrable, not "the code is written".

## M0 — Foundation

**Exit:** a deployed skeleton where a request hits the API, reads Postgres, and CI is green on a PR.

- pnpm + Turborepo workspace, `apps/backend`, `apps/web`, `apps/mobile`, shared packages
- NestJS skeleton, Prisma connected, first migration
- Next.js app, Expo app, both calling a `/health` endpoint
- ESLint/Prettier/tsconfig shared; Vitest wired
- GitHub Actions: lint, typecheck, test, migration check
- Decide hosting region with [[Security and Privacy]] in mind

## M1 — Identity and relationships

**Exit:** a coach invites a student on a real device, the student accepts, a parent requests access
and the coach approves — and a second coach can see none of it.

- Registration, login, logout, refresh, password reset ([[FR-01]])
- Role profiles and grade level ([[FR-03]])
- **Policy layer and capability resolution** ([[ADR-0006]], [[FR-02]])
- Invite codes/links, coach→student and student→coach flows, ending a link ([[FR-04]])
- Parent link with coach approval and the max-2 constraint ([[FR-05]])
- Negative authorization test suite — the foundation everything else inherits

## M2 — The work loop

**Exit:** a coach assigns a task and an assignment to three students from the web; a student submits
both from the phone; the coach approves one and returns the other; the lateness outcomes are correct.

- `WorkItem` with type discriminator ([[ADR-0005]])
- Assign, list, submit, approve, return with optional note ([[FR-06]], [[FR-07]])
- Derived status including `OVERDUE` ([[ADR-0008]])
- Event log / history ([[FR-21]])
- Event notifications for assign, submit, approve, return ([[FR-16]])

## M3 — Progress and Filiz

**Exit:** a student sees two Filiz characters reflecting today honestly; a coach opens one screen and
knows who is waiting on them.

- Progress buckets and rates in `packages/shared` ([[Progress and Filiz]])
- Filiz stages with configurable thresholds ([[FR-08]])
- Daily and weekly views for the student ([[FR-14]])
- Coach follow-up: done / behind / waiting on me ([[FR-17]])
- Bulk notifications and templates ([[FR-16]])

## M4 — Lessons and schedule

**Exit:** a coach proposes a lesson, the student accepts and it appears in their calendar; the coach
records attendance; the coach cannot see any of the student's other calendar entries.

- Lesson request/accept/decline/cancel with optional notes ([[FR-09]])
- Attendance recording and correction ([[FR-10]])
- Student schedule with multi-slot selection ([[FR-11]])
- Privacy filtering verified by test ([[BR-014]])

## M5 — Money

**Exit:** a coach sets a price, holds four lessons, sees the month's earnings per student and in
total — then raises the price and watches the past not change.

- Effective-dated rates ([[FR-18]], [[ADR-0004]])
- Timesheet from attendance with configurable billing rules ([[FR-19]])
- Earnings with rate snapshot; per-student and pool totals ([[FR-19|FR-19.9]])
- Student-visibility test: 404 everywhere ([[BR-022]])

## M6 — Parent view

**Exit:** a parent logs in and sees exactly the categories the coach opened, including the money,
and nothing else.

- Coach-controlled sharing settings ([[FR-20]], [[Open Questions|Q-05]])
- Parent dashboard: progress, attendance, financial
- Coach → parent notifications and templates ([[FR-16]])

## M7 — Exams, resources, files

**Exit:** a student logs a deneme, the coach approves it, and the trend chart moves — and did not
move before approval.

- Mock exam results with per-subject detail, manual entry ([[FR-15]])
- Approval gate and statistics scope ([[BR-017]])
- Resource pool and recommendations ([[FR-12]])
- File upload and sharing with signed URLs ([[FR-13]])

## M8 — Subscription and launch

**Exit:** a coach can subscribe; the KVKK notice is live; monthly reports work.

- Subscription model and enforcement switch ([[FR-22]])
- Monthly reporting once [[Open Questions|Q-02]] is answered
- Privacy notice, consent capture, retention policy ([[Security and Privacy]])
- App store submissions

## Related

[[Roadmap]] · [[Task Board]]
