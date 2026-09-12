---
id: T-014
aliases: [T-014]
title: i18n setup
status: review
milestone: M0
area: platform
requirements: []
updated: 2026-09-12
---

# T-014 — i18n setup on web and mobile

**Goal.** Every user-facing string goes through a key, in both apps, before any screen is written.

**Implements.** [[ADR-0007]] · [[ADR-0011]] · [[Frontend Architecture]]

## Done

- [x] `packages/i18n` (`@sm/i18n`): `tr` + `en` catalogues, `common` and `auth` namespaces
- [x] Type-safe keys via i18next `CustomTypeOptions` — a typo'd key fails `tsc`
- [x] Web: server (`server.ts`) and client (`provider.tsx`) paths, `NEXT_LOCALE` cookie,
      `Accept-Language` negotiation, locale switcher
- [x] Mobile: device locale via `expo-localization`, `metro.config.js` for the workspace
- [x] Verified: both locales render on web; plurals differ correctly (`5 görev` / `5 tasks`)

## Deliberately not done

- **No persisted locale override on mobile.** Needs storage; `react-native-mmkv` requires a
  development build and would take the app out of Expo Go. Revisit with the storage adapter.
- **No `[locale]` URL segment on web** — see [[ADR-0011]] for the cost of reversing that, and the
  deadline for changing our mind.
- Feature namespaces beyond `auth` — each feature adds its own as it lands.

## Follow-ups

- Add a namespace per feature as features arrive ([[FR-06]], [[FR-09]], [[FR-18]]…)
- Date and number formatting in `Europe/Istanbul` belongs with `shared/utils/date/`, not here
