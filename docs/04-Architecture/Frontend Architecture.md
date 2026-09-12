---
title: Frontend Architecture
status: draft
updated: 2026-09-12
---

# Frontend Architecture (web + mobile)

Feature-sliced structure, identical in both apps, adapted from the layout the team already runs in
another product. Decisions: [[ADR-0009]] (structure and import rules) and [[ADR-0010]] (what is
shared between web and mobile).

## The structure

```
apps/<web|mobile>/src/
  assets/
    fonts/ images/ icons/
  app/                          # routing layer — file-based (see "Routing" below)
  features/
    identity/                   # login, register, session            FR-01 FR-02
    onboarding/                 # first run, role, join a coach        FR-01 FR-04
    links/                      # coach–student, parent–student        FR-04 FR-05
    work/                       # tasks + assignments (one engine)     FR-06 FR-07
    progress/                   # Filiz, daily/weekly/monthly          FR-08 FR-14
    lessons/                    # requests, cancellation, attendance   FR-09 FR-10
    schedule/                   # student's private calendar           FR-11
    exams/                      # deneme results + approval            FR-15
    resources/                  # pool + recommendations               FR-12
    files/                      # sharing                              FR-13
    notifications/              # feed, templates, push                FR-16
    students/                   # coach's follow-up view               FR-17
    billing/                    # rates, timesheet, earnings           FR-18 FR-19
    guardians/                  # parent view + sharing settings       FR-20
    subscription/               #                                      FR-22
    settings/
  shared/
    components/
      ui/                       # buttons, inputs, sheets, empty states
      layout/
    lib/
      api/                      # axios instance, interceptors, error mapping
      auth/                     # auth provider, route guards
      storage/                  # platform storage adapter (MMKV | localStorage)
      messaging/                # push registration, deep links
    store/                      # session and app-wide Zustand stores
    utils/
      date/                     # Europe/Istanbul boundaries, week start
  app.tsx                       # mobile only — root component
```

**Feature folders use the same internal slices as the reference app:**

```
features/work/
  components/                   # presentational, feature-scoped
  hooks/                        # UI hooks (useWorkFilters, useSubmitFlow)
  lib/                          # feature-specific platform integration (rare)
  screens/                      # the only thing the routing layer may import
  store/                        # Zustand, feature-local UI state
  types/                        # view-model types (domain types come from @sm/core)
  utils/
  index.ts                      # public entry — the only cross-feature import surface
```

Feature names deliberately match the `FR-xx` notes, so a folder maps to a requirement and back.
See [[Requirements Index]].

## Two adaptations, both forced by the frameworks

### 1. `navigation/` becomes `app/`

The reference app calls the routing layer `navigation/`. Neither framework will take that name
on the happy path:

- **Next.js** requires the App Router directory to be `app/` or `src/app/`. It cannot be renamed.
- **Expo Router** auto-detects `src/app/` (it is the default template's location). A custom root
  *is* configurable via the `expo-router` plugin's `root` option / `EXPO_ROUTER_APP_ROOT` — but
  that path is inlined by Metro as a **relative** path and is documented as breaking when
  `node_modules` is a symlink. In a pnpm workspace, everything is a symlink. Not worth the risk
  for a folder name.

So: **`src/app/` in both apps**, doing exactly the job `navigation/` did. The role is unchanged —
thin route files that mount a screen.

### 2. `react-native-mmkv` is mobile-only

Web gets `localStorage`. Both sit behind `shared/lib/storage/` with one interface, so feature code
and Zustand `persist` never know which platform they are on.

```ts
// shared/lib/storage/index.ts   (resolved per platform at build time)
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
```

> **Tokens do not go in MMKV.** MMKV is fast, unencrypted-by-default storage — right for cached
> lists, draft text and UI preferences. Refresh tokens go in `expo-secure-store` (Keychain /
> Keystore) on mobile and an httpOnly cookie on web ([[ADR-0002]], [[Security and Privacy]]).

## Routing

The route file is an adapter, never a screen. Five lines, no logic:

```tsx
// apps/mobile/src/app/(app)/work/[id].tsx
import { WorkItemScreen } from '@/features/work/screens/WorkItemScreen'
import { useLocalSearchParams } from 'expo-router'

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <WorkItemScreen id={id} />
}
```

This is what makes the reference app's duplicate-modal pattern work: the same modal appears under
two route paths, but the component exists once in `features/*/screens/`.

### Mobile — `apps/mobile/src/app/`

```
_layout.tsx                  providers: SWR, auth, theme
(auth)/
  _layout.tsx                redirects out if already signed in
  login.tsx  register.tsx  join.tsx
(app)/
  _layout.tsx                auth guard + tabs
  (tabs)/
    index.tsx                Today  — features/work + features/progress
    schedule.tsx  progress.tsx  notifications.tsx
  work/[id].tsx
  work/[id]/submit.tsx       presented as a modal
  lessons/[id].tsx
  exams/new.tsx
  settings/index.tsx
```

### Web — `apps/web/src/app/`

Route groups carry the role guard, which is where [[FR-02]] lands in the UI:

```
layout.tsx
(auth)/login/page.tsx
(coach)/
  layout.tsx                 coach guard
  page.tsx                   follow-up: waiting on me / behind / fine   FR-17
  students/[id]/page.tsx
  work/page.tsx
  lessons/page.tsx
  earnings/page.tsx                                                     FR-19
(parent)/
  layout.tsx                 parent guard
  children/[id]/page.tsx                                                FR-20
```

**Modals on web:** use a plain client-side dialog inside the screen unless the modal needs its own
URL. Only then reach for parallel + intercepting routes (`@modal/(.)work/[id]`) — they are powerful
and they are the part of the App Router people most often get wrong.

Note what is absent from web: `schedule/`. A coach cannot see a student's personal calendar
([[BR-014]]) and students are on mobile, so the feature does not ship there.

## Import rules

The rules the structure exists to enforce:

| # | Rule |
| --- | --- |
| 1 | `app/**` may import **only** `features/*/screens/**` and `shared/**`. No other feature internals. |
| 2 | A feature may not reach into another feature. Cross-feature imports go through the public entry `@/features/x` — never `@/features/x/components/...`. |
| 3 | `shared/**` must never import from `features/**`. Dependencies point one way. |
| 4 | Nothing outside `app/**` may import from `app/**`. |
| 5 | Inside a feature, use **relative** imports. The `@/features/...` alias means "another feature" — which is what makes rule 2 lintable. |
| 6 | Domain rules (status derivation, progress, money) come from `@sm/core`. Never re-implement them in an app — see [[ADR-0010]]. |
| 7 | Platform isolation is enforced by **dependencies, not lint**: `apps/web` does not depend on `react-native`, `apps/mobile` does not depend on `next`. pnpm's strict `node_modules` makes an undeclared import fail outright. |

### Enforcing 1–4 with Biome

`noRestrictedImports` lives in the **style** group and takes gitignore-style `patterns` with `!`
negation. Scope it per folder with `overrides`:

```jsonc
// biome.jsonc (repo root)
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "overrides": [
    {
      "includes": ["**/src/app/**"],
      "linter": { "rules": { "style": { "noRestrictedImports": { "level": "error", "options": {
        "patterns": [{
          "group": ["@/features/*/**", "!@/features/*/screens", "!@/features/*/screens/**"],
          "message": "Route files mount screens. Import from @/features/<x>/screens only."
        }]
      }}}}}
    },
    {
      "includes": ["**/src/features/**"],
      "linter": { "rules": { "style": { "noRestrictedImports": { "level": "error", "options": {
        "patterns": [
          {
            "group": ["@/features/*/**", "!@/features/*"],
            "message": "No deep cross-feature imports. Use the feature's public entry (@/features/<x>), or lift the code to src/shared."
          },
          { "group": ["@/app/**"], "message": "Features must not import the routing layer." }
        ]
      }}}}}
    },
    {
      "includes": ["**/src/shared/**"],
      "linter": { "rules": { "style": { "noRestrictedImports": { "level": "error", "options": {
        "patterns": [{
          "group": ["@/features/**", "@/app/**"],
          "message": "shared/ is the base layer. It cannot depend on features or routing."
        }]
      }}}}}
    }
  ]
}
```

> [!warning] Keep override globs non-overlapping
> Biome's docs state that when several override patterns match a file, **only the first match
> applies** — and an override's rule options *replace* the top-level options rather than merging.
> The three globs above are disjoint on purpose. If you add a fourth, make sure it cannot match a
> file the others match, or silently lose the rules you thought were active.

Rule 5 is what makes rule 2 work: a feature importing itself relatively never matches
`@/features/*/**`, so the pattern catches exactly the cross-feature case.

**Optional second layer:** `noPrivateImports` (in the **correctness** group) enforces folder-level
visibility from `@package` JSDoc annotations, so a feature's internals stay private even from its
own barrel. It turns on Biome's project scanner, so measure the lint time before adopting it
repo-wide.

## State and data

| Concern | Tool | Where |
| --- | --- | --- |
| Server data | **SWR** | `@sm/api` — hooks and keys, sliced by feature |
| Client/UI state | **Zustand** | `features/*/store/` (local), `shared/store/` (session) |
| Persistence | **MMKV** / `localStorage` | behind `shared/lib/storage/` |
| Forms + validation | Zod schemas from `@sm/core` | shared with the API |
| Dates & numbers | `Intl` (`tr-TR`, `Europe/Istanbul`) | `shared/utils/date/` |

**SWR conventions**

- One key factory per feature, exported from `@sm/api`: `workKeys.list(studentId)`. Hand-written key
  strings are how cache invalidation quietly stops working.
- After a mutation, invalidate by key — never refetch the whole screen.
- Optimistic update on submit ([[FR-06|FR-06.5]]): the student taps once and it must feel instant, then
  reconcile. This is the single most-used interaction in the product ([[UX Principles]]).

**Zustand conventions**

- Stores hold UI state, not server data. A store caching API responses next to SWR is a
  two-sources-of-truth bug waiting to happen.
- Persist with `zustand/middleware` + the storage adapter, never a direct MMKV import in a feature.
- One store per feature at most. If two features need the same state, it belongs in `shared/store/`.

**Copy conventions**

- **No i18n layer** ([[ADR-0011]]). Turkish copy is written directly in components as string
  literals; there are no keys, no catalogues and no `@sm/i18n` package.
- Turkish words run long and its suffixes make labels longer still — never let a layout depend on
  short strings.
- **Dates, times and numbers still go through `Intl`**, with `tr-TR` and `Europe/Istanbul`, in
  `shared/utils/date/`. That is not internationalisation; hand-formatted dates are a bug in any
  language, and business-day boundaries drive [[FR-14]] reporting.
- If reviewing copy across the codebase starts to hurt, the cheap step is a `strings.ts` per
  feature — centralised text, no library. See [[ADR-0011]].

## Related

[[ADR-0009]] · [[ADR-0010]] · [[Architecture Overview]] · [[Tech Stack]] · [[UX Principles]] · [[Screen Inventory]]
