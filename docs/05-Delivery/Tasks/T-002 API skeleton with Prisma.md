---
id: T-002
aliases: [T-002]
title: API skeleton with Prisma
status: todo
milestone: M0
area: backend
requirements: []
updated: 2026-09-12
---

# T-002 — NestJS skeleton with Prisma

**Goal.** The API boots, connects to Postgres and answers `/v1/health` with a database round trip.

**Implements.** [[ADR-0003]] · [[Architecture Overview]]

## Steps

- [ ] NestJS app with the module skeleton from [[Architecture Overview]]
- [ ] Prisma connected; `docker-compose` for local Postgres
- [ ] First migration: `users` and role profile tables
- [ ] Zod validation pipe wired to `packages/shared`
- [ ] Error format and the 404-not-403 rule from [[API Conventions]]
- [ ] Structured logging with no personal data in log lines

## Done when

- [ ] `/v1/health` returns a database-backed response
- [ ] `pnpm --filter api test` runs an integration test against a test database
