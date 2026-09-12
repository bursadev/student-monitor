---
id: ADR-0011
aliases: [ADR-0011]
title: Cookie-based locale, no URL prefix
status: accepted
date: 2026-09-12
---

# ADR-0011 — Cookie-based locale on web, device locale on mobile

## Status

accepted — **reversible now, expensive after the first screens land**

## Context

[[ADR-0007]] settles the language policy: Turkish is the product language, English is the code
language, all copy goes through i18next keys. It does not settle how a *viewer's* locale is chosen
and carried.

On web this is a routing decision. Next.js projects usually put the locale in the URL
(`/tr/...`, `/en/...`), which needs a `[locale]` segment wrapping every route, middleware to
negotiate and redirect, and a locale-aware `Link` everywhere.

The relevant facts here: every user is Turkish, essentially the whole product sits behind
authentication, and English exists so the setup is genuinely multi-locale rather than a
single-language stub — not because anyone has asked for an English UI.

## Decision

**Web:** the locale lives in a `NEXT_LOCALE` cookie. Resolution order is cookie →
`Accept-Language` → `tr`. No `[locale]` route segment, no middleware, no locale-aware links.

**Mobile:** the locale comes from the device via `expo-localization`, falling back to `tr`. No
in-app override yet — that needs persistent storage, and `react-native-mmkv` requires a development
build, which would take the app out of Expo Go ([[Frontend Architecture]]).

**Both:** catalogues are bundled from `@sm/i18n`, not fetched. There are two of them and they are
small; a network round trip would buy a loading state on every screen and nothing else.

## Consequences

**Good.** No middleware, no `[locale]` nesting, no locale-threading through every `Link` — for a
product whose users all speak one language. Adding a third language is a catalogue, not a routing
change. Server and client resolve identically, so there is no hydration flash.

**Bad / accepted cost.**

- **No per-locale URLs.** `/tr/gorevler` and `/en/tasks` cannot both exist, so localised content is
  not separately linkable, shareable or indexable. For an authenticated app that is close to
  irrelevant; for a future public marketing page it is not, and that page may want its own approach.
- Reading cookies makes every route **dynamically rendered** — Next reports `ƒ` instead of `○`. At
  this scale that costs nothing, but a future fully-static public page would need to opt out of
  `getLocale()`.
- **Reversing this later means moving every route under `app/[locale]/`.** Cheap while there are
  two pages; a large mechanical change once the coach and parent sections exist. If per-locale URLs
  are ever wanted, decide before M3.

## Alternatives considered

| Option | Why not |
| --- | --- |
| `[locale]` segment + middleware | the standard answer, and real machinery — for a user base that is entirely Turkish and behind a login |
| `next-intl` | good library, tightly coupled to URL-based routing, and [[ADR-0007]] already commits to i18next, which mobile shares |
| Accept-Language only, no cookie | no way to override a device set to English while browsing a Turkish product |
| Turkish only, no i18n layer | hardcoded strings are the thing [[ADR-0007]] exists to prevent, and Turkish copy would be scattered instead of reviewable in one place |
