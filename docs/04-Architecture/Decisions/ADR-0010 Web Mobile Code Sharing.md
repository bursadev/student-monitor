---
id: ADR-0010
aliases: [ADR-0010]
title: What web and mobile share, and what they do not
status: accepted
date: 2026-09-12
refines: ADR-0001
---

# ADR-0010 — The boundary between shared code and app code

## Status

accepted — refines the `packages/shared` sketch in [[ADR-0001]]

## Context

[[ADR-0009]] gives both apps the same structure. That raises the question it does not answer: when
the web app and the mobile app both need "list a student's tasks", is that written twice?

The naive answers are both wrong. Duplicating it means two implementations of the endpoint, the
cache keys and the status derivation, drifting apart — and status derivation is [[ADR-0008]], one of
the rules we cannot get wrong twice. Sharing *everything* means a universal UI layer
(react-native-web), which compromises both platforms to save code that is mostly layout.

There is also a naming problem: [[ADR-0001]] called the shared workspace `packages/shared`, and
[[ADR-0009]] puts a `src/shared/` inside each app. Two different things called "shared" in one repo
is a daily source of confusion.

## Decision

Draw the line between **data + domain** (shared) and **presentation** (per app).

```
packages/
  core/     domain types, enums, Zod schemas, pure rules:
            work-item status derivation, progress + Filiz, earnings + rate resolution
  api/      axios factory, per-feature endpoint modules, SWR hooks and key factories
  config/   biome, tsconfig bases
apps/
  web/src/{app,features,shared,assets}
  mobile/src/{app,features,shared,assets}
```

- `packages/core` and `packages/api` are **sliced by the same feature names** as the apps, so
  `features/work/` in an app maps to `core/src/work/` and `api/src/work/`.
- `packages/shared` is **renamed** — there is no workspace called "shared". Inside an app,
  `src/shared/` means "shared across this app's features" and nothing else.
- The API package is also consumed by nothing else: the NestJS backend imports `@sm/core` for the
  same types and Zod schemas, so the contract has exactly one definition.
- **No react-native-web.** UI components are written per platform.

What lands where, concretely:

| Code | Home | Why |
| --- | --- | --- |
| `WorkItemStatus`, `AttendanceState`, `ProgressStage` | `@sm/core` | one definition, API included |
| Zod request/response schemas | `@sm/core` | the API validates with the same schema the client submits |
| Status derivation, Filiz stages, earnings + rate resolution | `@sm/core` | [[ADR-0008]], [[ADR-0004]] — wrong twice is worse than wrong once |
| Endpoint functions, SWR hooks, cache keys | `@sm/api` | the two apps call one backend |
| Screens, components, navigation | the app | genuinely different products |
| Zustand UI stores | the app | UI state is not shared state |
| Storage, push, secure storage | the app's `src/shared/lib` | platform APIs |

## Consequences

**Good.** The layer where a mistake is expensive — types, validation, money, status — exists once
and is covered by one set of tests. A backend change to a shared Zod schema breaks both clients' CI
in the same commit ([[ADR-0001]]). Feature slicing survives the package boundary, so the mental
model is unchanged.

**Bad / accepted cost.** Feature folders in an app are thinner than in the reference product: no
`lib/api/`, and `hooks/` holds UI hooks only, with data hooks imported from `@sm/api`. That is a
real departure from what the team is used to and should be called out in review until it is habit.
Changing a shared endpoint means touching a package and two consumers. `packages/api` must stay
strictly platform-agnostic — one `window` or one `react-native` import in it breaks the other app,
so it carries its own lint boundary.

**Deliberately unresolved.** If the coach experience later needs to be as good on mobile as on web,
some screens *will* want to be shared, and react-native-web becomes worth reopening. Nothing here
prevents that; it just is not the starting position.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Duplicate everything per app | two implementations of status, money and cache keys — the exact code we cannot afford to have drift |
| Share UI too, via react-native-web | compromises both platforms to save layout code; the two audiences want different products ([[Personas]]) |
| One `packages/features/<x>` per feature, UI included | package-per-feature overhead for a small team, and it still cannot share the UI |
| Keep the name `packages/shared` | collides with `src/shared/` in every app; two meanings, one word |
