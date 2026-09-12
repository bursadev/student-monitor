---
title: Tech Stack
status: draft
updated: 2026-09-12
---

# Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Language | TypeScript, `strict` | everywhere, no exceptions |
| Runtime | Node.js 24 LTS | |
| Backend | NestJS | modules map to requirement areas; DI makes the policy layer testable |
| Database | PostgreSQL 16+ | partial unique indexes, `jsonb`, `tstzrange` if we want it |
| ORM | Prisma | see [[ADR-0003]] |
| Web | Next.js (App Router) + React | coaches and parents |
| Mobile | Expo / React Native + Expo Router | students, plus coach quick actions |
| Frontend structure | feature-sliced, identical in both apps | [[Frontend Architecture]], [[ADR-0009]] |
| Server data | SWR | hooks and cache keys in `@sm/api` |
| Client state | Zustand | feature-local and session stores |
| Persistence | react-native-mmkv (mobile) / `localStorage` (web) | behind one storage adapter |
| Secure storage | expo-secure-store (mobile) / httpOnly cookie (web) | tokens only |
| Copy | Turkish string literals — **no i18n layer** | [[ADR-0011]] |
| Dates & numbers | `Intl`, `tr-TR`, `Europe/Istanbul` | still required; not internationalisation |
| Shared packages | `@sm/core`, `@sm/api` | [[ADR-0010]] |
| Monorepo | pnpm workspaces + Turborepo | [[ADR-0001]] |
| Auth | JWT access + rotating refresh | [[ADR-0002]] |
| Files | S3-compatible object storage | signed URLs only |
| Push | Expo Push Notifications | plus web push later |
| Testing | Vitest (unit), Supertest (API), Playwright (web e2e) | |
| Lint/format | **Biome** | one config at the root; also enforces the import boundaries ([[ADR-0009]]) |
| CI | GitHub Actions | lint, typecheck, test, migrate-check |

## Conventions that come with it

- **Validation once.** Zod schemas in `@sm/core` are the contract; the API validates with
  them and the clients infer types from them. No hand-written duplicate DTO types.
- **No business logic in controllers.** Controllers resolve the caller, call a service, serialize.
- **Enums are shared.** `WorkItemStatus`, `AttendanceState`, `LessonStatus`, `ProgressStage` are
  defined once and imported. A string literal typed by hand in a client is a bug waiting to happen.
- **Migrations are reviewed like code.** Especially anything touching money or links.

## Deployment (provisional)

Nothing is decided here yet; the sensible defaults:

- API: a container on any Node host (Fly.io, Render, Hetzner + Docker) or a managed Node platform.
- Database: managed Postgres with daily backups and point-in-time recovery.
- Web: Vercel or the same container host.
- Mobile: EAS Build → TestFlight / Play Console.
- **Data residency matters here** — Turkish users' personal data, minors included. Check KVKK
  obligations before choosing a region ([[Security and Privacy]]).

## Deliberately not used in v1

| Not using | Why |
| --- | --- |
| GraphQL | the clients are ours and the shapes are stable; REST + shared types is less machinery |
| Microservices | one team, one domain, tiny data volume |
| Event sourcing | an append-only audit log gives us the history without the rest of the ceremony |
| Redis / caching | nothing is slow yet |
| An AI feature | explicitly out of scope (catalog §26, [[Scope and MVP]]) |
| A design system dependency | build the handful of components we need; see [[UX Principles]] |

## Related

[[Architecture Overview]] · [[ADR Index]] · [[Roadmap]]
