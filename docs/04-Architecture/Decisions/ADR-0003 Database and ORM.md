---
id: ADR-0003
aliases: [ADR-0003]
title: PostgreSQL with Prisma
status: accepted
date: 2026-09-12
---

# ADR-0003 — PostgreSQL with Prisma

## Status

accepted

## Context

The domain is highly relational: links, ownership, effective-dated rates, event history. We need
partial unique indexes ([[BR-004]] max-two-parents, one active link per pair), transactional writes
that include an audit row, and date-range queries. Volumes are small.

## Decision

PostgreSQL as the database. Prisma as the ORM, with raw SQL where a query is clearer that way.

## Consequences

**Good.** Prisma's generated types flow into the shared package and the clients. Migrations are
explicit files, reviewable — important for anything touching money or links. Postgres gives us the
constraints that let the database, not application code, enforce the invariants that matter.

**Bad / accepted cost.** Prisma's raw-SQL escape hatch is needed for the reporting aggregates and
for constraints Prisma cannot express (partial unique indexes go in hand-written migration SQL).
Prisma's row-level-security story is weak; our defence is the policy layer instead ([[ADR-0006]]).

## Alternatives considered

| Option | Why not |
| --- | --- |
| TypeORM | NestJS-idiomatic, but weaker type inference and a rougher migration experience |
| Drizzle | closer to SQL and very good; smaller ecosystem, and the team is likelier to know Prisma |
| Supabase (Postgres + RLS) | RLS is a genuinely attractive second layer for [[BR-024]]; rejected for v1 to avoid coupling the whole backend to one platform. Worth revisiting as defence in depth. |
| MongoDB | the domain is relational; we would rebuild joins and constraints by hand |
