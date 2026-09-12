---
id: ADR-0009
aliases: [ADR-0009]
title: Feature-sliced frontend with enforced import boundaries
status: accepted
date: 2026-09-12
---

# ADR-0009 — Feature-sliced frontend with enforced import boundaries

## Status

accepted

## Context

The team already runs this structure in another product: `src/{assets,navigation,features,shared}`,
each feature sliced into `components / hooks / lib / screens / store / types / utils`. Familiarity
is worth a great deal — it is the difference between a structure people follow and one they work
around.

It also happens to fit this domain well. The requirement areas ([[Requirements Index]]) are already
vertical slices: work, lessons, schedule, exams, billing. And two of the rules we most need to not
break are structural — [[BR-022]] (money never reaches a student screen) and [[BR-024]] (one coach's
content never reaches another). Boundaries the linter can check are worth more here than boundaries
in a document.

Two constraints forced adaptation:

1. **Next.js cannot rename its router directory.** It is `app/` or `src/app/`.
2. **Expo Router defaults to `src/app/`.** A custom root is configurable, but Metro inlines it as a
   relative path and the Expo source documents that breaking under symlinked `node_modules` — which
   is every path in a pnpm workspace.

## Decision

Adopt the structure as-is in **both** apps, with one rename: the routing layer is `src/app/`
instead of `src/navigation/`. Its role is unchanged — thin route files that mount a screen from
`features/*/screens/`.

Feature folders are named after the `FR-xx` requirement areas, so a folder maps to a requirement.

Four import rules, enforced by Biome `noRestrictedImports` in three non-overlapping `overrides`:

1. `app/**` may import only `features/*/screens/**` and `shared/**`.
2. Cross-feature imports go through the public entry `@/features/x`, never deep.
3. `shared/**` may not import `features/**` or `app/**`.
4. Inside a feature, imports are relative — so the `@/features/...` alias always means
   "another feature", which is what makes rule 2 mechanically checkable.

Platform isolation (no React Native in web, no Next in mobile) is enforced by **not declaring the
dependency**, not by lint rules. pnpm's strict `node_modules` turns an undeclared import into a
hard failure.

Full detail and the config: [[Frontend Architecture]].

## Consequences

**Good.** One mental model across web, mobile and the requirements. A new feature is a folder with
a known shape. The boundaries are checked in CI rather than in review, so they survive a busy week.
Deleting a feature is deleting a folder. Route files stay trivial, which keeps the two apps' screens
comparable even though their navigation differs.

**Bad / accepted cost.** The `navigation/` → `app/` rename breaks muscle memory from the other
product. Barrel files (`features/x/index.ts`) are a public API that must be curated, and they can
hurt tree-shaking if they grow careless. Rule 4 (relative inside, alias across) is a convention
people have to learn — it reads as arbitrary until you see that it is what makes rule 2 enforceable.

**Gotcha to watch.** Biome applies only the **first** matching override to a file, and an override's
rule options replace rather than merge with the top-level ones. Adding a fourth override that
overlaps the existing three would silently disable rules. Documented in [[Frontend Architecture]].

## Alternatives considered

| Option | Why not |
| --- | --- |
| Keep `navigation/` on mobile via the expo-router `root` option | off the supported path, and the documented symlink fragility lands squarely on a pnpm monorepo — for a folder name |
| Layer-first (`components/`, `hooks/`, `screens/` at the top) | every feature change touches every folder; no boundary to enforce |
| Full Feature-Sliced Design (entities/features/widgets/pages layers) | more taxonomy than this team needs, and further from what they already run |
| Boundaries by convention, documented only | the two rules we cannot afford to break are exactly the ones a hurried change breaks |
| ESLint + `eslint-plugin-boundaries` | more expressive for layered rules, but we are on Biome ([[Tech Stack]]); `noRestrictedImports` covers these four rules |
