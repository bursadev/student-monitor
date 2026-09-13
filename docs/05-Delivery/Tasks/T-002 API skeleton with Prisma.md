---
id: T-002
aliases: [T-002]
title: API skeleton with Prisma
status: doing
milestone: M0
area: backend
requirements: []
updated: 2026-09-13
---

# T-002 — NestJS skeleton with Prisma

**Goal.** The API boots, connects to Postgres and answers a health check.

> **Mostly done already.** [[T-015]] and [[T-016]] delivered the Nest skeleton, Prisma, the
> migration, the error format and the health endpoint. What genuinely remains is the Zod validation
> pipe, structured logging, and an integration test against a real database.

**Implements.** [[ADR-0003]] · [[Architecture Overview]]

## Steps

- [x] NestJS app with the module skeleton from [[Architecture Overview]] — done incidentally by [[T-015]]
- [x] Prisma connected; `docker-compose` for local Postgres — [[T-015]]
- [x] First migration: `AppUser` — [[T-015]]; role profile tables still to come with [[T-006]]
- [ ] **Zod validation pipe wired to `@sm/core`** — still open. `parseOnboardingInput` in
      `features/users/dto` is the hand-rolled stopgap it replaces ([[T-017]])
- [x] Error format — `AllExceptionsFilter` in [[T-016]]. The 404-not-403 rule stays a call-site
      decision, deliberately not enforced by the filter
- [ ] **Structured logging with no personal data in log lines** — still open; the app uses Nest's
      default logger

## Done when

- [x] A health endpoint responds (`/api/health`, not `/v1/health` — the prefix is `/api`)
- [ ] `pnpm --filter backend test` runs an integration test against a **real** test database —
      every suite today uses an in-memory Prisma fake
