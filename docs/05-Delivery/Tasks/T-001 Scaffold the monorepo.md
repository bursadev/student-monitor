---
id: T-001
aliases: [T-001]
title: Scaffold the monorepo
status: doing
milestone: M0
area: foundation
requirements: []
updated: 2026-09-12
---

# T-001 — Scaffold the monorepo

**Goal.** `pnpm install && pnpm dev` runs the API, the web app and the Expo app from one repository,
with the feature-sliced structure and its import boundaries already enforced.

**Implements.** [[ADR-0001]] · [[ADR-0009]] · [[ADR-0010]]

## Steps

### Workspace
- [x] pnpm workspace: `apps/backend`, `apps/web`, `apps/mobile` — `packages/*` not created yet
- [ ] Turborepo pipeline: `dev`, `build`, `lint`, `typecheck`, `test`
- [ ] Shared tsconfig bases in `packages/config`; `@/*` path alias per app

### Biome
- [ ] Root `biome.jsonc` with format + recommended rules ([[Tech Stack]])
- [ ] The three `overrides` enforcing the import rules — globs **disjoint**, see
      [[Frontend Architecture]]
- [ ] Verify each boundary fails: a deep cross-feature import, a `shared/` → `features/` import,
      and a route file importing `features/x/components`
- [ ] `pnpm lint` / `pnpm format` scripts

### App skeletons
- [x] `apps/web`: Next.js 16 App Router at `src/app/`, Tailwind v4, Turbopack — route groups `(auth)` `(coach)` `(parent)` still to add
- [x] `apps/mobile`: Expo SDK 57, Expo Router at `src/app/` — the default, no custom router root
      ([[ADR-0009]] explains why in a pnpm workspace). Verified: Metro resolves through pnpm's
      symlinks and `expo export` succeeds.
- [ ] Both: `src/{assets,features,shared}` with one real feature slice (`identity`) as the pattern
      others copy
- [x] Metro config for the monorepo — not needed yet; revisit when mobile consumes a workspace package

### Shared packages
- [ ] `@sm/core` exports one enum and one Zod schema, consumed by the API **and** both apps —
      proves the wiring end to end
- [ ] `@sm/api` axios factory + SWR provider; platform-agnostic (no `window`, no `react-native`)
- [ ] `@sm/i18n` with i18next init and a `common` namespace in Turkish

### Platform isolation
- [ ] `apps/web` has no `react-native` dependency; `apps/mobile` has no `next` dependency
- [ ] pnpm strict `node_modules` (no hoisting) so an undeclared import fails

### Wrap-up
- [ ] Fill in the Commands section of `CLAUDE.md`

## Done so far

Scaffolds are in and verified: all three typecheck clean, backend builds and its Vitest suite
passes, web builds, mobile exports. Two scaffold bugs fixed on the way — the Nest e2e spec's
`supertest/types` import needed a `.js` extension under ESM + `nodenext`, and `create-next-app`
dropped a nested `pnpm-workspace.yaml` that shadowed the root one.

Still open: Biome, Turborepo, the `packages/*` workspaces, the feature-sliced folders, and CI
([[T-003]]).

## Done when

- [ ] All three apps start from the repo root
- [ ] A change to `@sm/core` is picked up by API, web and mobile without a rebuild dance
- [ ] Each of the three import boundaries has been deliberately broken once and CI caught it
