---
id: ADR-0001
aliases: [ADR-0001]
title: pnpm + Turborepo monorepo
status: accepted
date: 2026-09-12
---

# ADR-0001 — pnpm + Turborepo monorepo

## Status

accepted

## Context

Three deliverables (API, web, mobile) that must agree on domain types, status enums, validation
schemas and the Filiz/earnings calculations. Separate repositories would mean publishing a package
and a version bump for every domain change — in a project where the domain is still being discovered.

## Decision

One repository: `apps/backend`, `apps/web`, `apps/mobile`, and shared packages.

> The shared workspace sketched here as `packages/shared` was later split and renamed —
> `@sm/core`, `@sm/api` — because every app also has its own `src/shared/`.
> See [[ADR-0010]].
pnpm workspaces for linking, Turborepo for task orchestration and caching.

## Consequences

**Good.** A domain change and its three consumers land in one commit and one review. CI can run
typecheck across everything and catch a break in mobile caused by an API change. `docs/` sits beside
the code it specifies.

**Bad / accepted cost.** Expo in a monorepo needs Metro configuration care (symlinks, watch folders)
— a known, solved annoyance. CI must be scoped per package to stay fast. Repository grows large.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Three repos + published shared package | version churn on every domain change; drift while a version lags |
| Two repos (backend / clients) | the shared package straddles them anyway |
| Nx | more capable, more machinery than this project needs |
