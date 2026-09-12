---
id: ADR-0003
aliases: [ADR-0003]
title: PostgreSQL with Prisma, one schema
status: accepted
date: 2026-09-12
---

# ADR-0003 — PostgreSQL with Prisma, one schema

## Status

accepted

## Context

The domain is highly relational: links, ownership, effective-dated rates, event history. We need
partial unique indexes ([[BR-004]] max-two-parents, one active link per pair), transactional writes
that include an audit row, and date-range queries. Volumes are small.

The ORM choice was revisited against TypeORM before any schema was written, and confirmed with
evidence rather than preference: the team's other product already runs **Prisma 7** in both its
NestJS backend and its Next.js app (20 and 8 migrations respectively), so the mental model, the
commands and the migration review habit already exist.

## Decision

PostgreSQL as the database. Prisma as the ORM, with raw SQL where a query is clearer that way.

**Exactly one `schema.prisma` and one migration history for the whole repo.** The backend owns it;
anything else that needs database types imports the generated client. No second schema, ever.

## Consequences

**Good.** Prisma's generated types flow into the shared package and the clients. Migrations are
explicit files, reviewable — important for anything touching money or links. Postgres gives us the
constraints that let the database, not application code, enforce the invariants that matter.

Migrations are emitted as **plain SQL**, which means they can be read by anyone and hand-edited for
things the DSL cannot express — which is exactly how [[BR-004]] and the one-active-link-per-pair
constraint get their partial unique indexes.

Exact-select return types are worth more here than in a typical CRUD app: [[BR-022]] (a student must
never see money) is most likely to be broken by a careless `include`, and the type system catches
that class of mistake.

**Bad / accepted cost.**

- **Prisma has no `down` migrations.** Rollback means writing a new forward migration. TypeORM would
  have given us `down()`. The cost is smaller here than elsewhere: our risky migrations touch money
  and history, where [[BR-023]] and [[BR-025]] make rolling *backwards* the more dangerous option
  anyway.
- The raw-SQL escape hatch is needed for reporting aggregates and for constraints Prisma cannot
  express.
- Row-level security support is weak; our defence is the policy layer instead ([[ADR-0006]]).
- An extra `prisma generate` step in install and CI.

## Alternatives considered

| Option | Why not |
| --- | --- |
| TypeORM | The Nest-native choice, and the only one here offering `down()` migrations. Rejected on migrations and types: its generator diffs entities against the DB and has a long history of noisy or wrong output around enums, defaults and indexes, and `synchronize: true` is a production footgun. Its inference on relations and partial selects is loose, which is precisely where [[BR-022]] needs to be tight. |
| Drizzle | closer to SQL and very good; smaller ecosystem, and the team already runs Prisma in its other product |
| Supabase (Postgres + RLS) | RLS is a genuinely attractive second layer for [[BR-024]]; rejected for v1 to avoid coupling the whole backend to one platform. Worth revisiting as defence in depth. |
| MongoDB | the domain is relational; we would rebuild joins and constraints by hand |

## What not to copy from the reference project

That codebase keeps a **separate `schema.prisma` and migrations folder in both its backend and its
web app**, with overlapping models (`AppUser`, `Subscription`, `Sentence`, …), and both run
`prisma migrate deploy` against Postgres. Two migration histories writing the same tables is a
split-brain risk whether or not it has bitten yet.

Our monorepo removes the reason it existed — separate repositories that could not share a package.
Hence the single-schema rule above.
