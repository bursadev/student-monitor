---
id: ADR-0012
aliases: [ADR-0012]
title: Clerk for authentication, our database for authorization
status: accepted
date: 2026-09-12
supersedes: ADR-0002
---

# ADR-0012 — Clerk for authentication, our database for authorization

## Status

accepted — **supersedes [[ADR-0002]]** (self-hosted JWT auth)

## Context

[[ADR-0002]] chose to implement authentication ourselves: Argon2id, rotating refresh tokens, the
lot. Its reasoning was that a managed provider solves the easy half of the problem and cannot
express the hard half, which here is entirely relationship-based ([[BR-024]]).

That reasoning still holds for *authorization*. It was wrong about the cost of the *authentication*
half. Owning password reset, lockout, rate limiting, token rotation, email verification and SSO —
for an app used by minors, on two platforms — is a large amount of security-sensitive surface for
something that is not the product. The team also already runs Clerk in another product, so the
operational knowledge exists.

## Decision

**Clerk owns authentication. Our database owns authorization.**

- `@clerk/nextjs` on web with Clerk's **prebuilt components** (`<SignIn />`, `<SignUp />`,
  `<UserButton />`). Coaches and parents get a polished hosted flow we do not maintain.
- `@clerk/clerk-expo` on mobile with **our own screens** on `useSignIn` / `useSignUp`. Students live
  in this app daily; the sign-in screen is part of the product's feel, and the session is persisted
  in the device keychain via `expo-secure-store`.
- `@clerk/backend` in NestJS: a **global** `ClerkAuthGuard` (`APP_GUARD`) verifies the bearer JWT and
  puts the Clerk user id on the request. Default-deny — a route is protected unless someone writes
  `@Public()`, which is visible in review.
- An **`AppUser` row mirrors each Clerk identity**, keyed on `clerkUserId`, created **just-in-time**
  on the user's first authenticated request.
- **`role` (`COACH` / `STUDENT` / `PARENT`) lives in our database**, not in Clerk's
  `publicMetadata`.

## Consequences

**Good.** We stop owning credential storage, verification emails, password reset and SSO. Clerk
ships Turkish strings for its components, so the web flow is Turkish without an i18n layer of ours
([[ADR-0011]]). Authorization stays entirely in the policy layer ([[ADR-0006]]), where the rules
that actually matter live.

**Bad / accepted cost.**

- A hard third-party dependency on the sign-in path: if Clerk is down, nobody signs in.
- Per-MAU pricing, against a product whose students and parents are free by design ([[FR-22]]).
  Worth modelling before launch — the free tier is generous but our user count is dominated by
  non-paying roles.
- Two sources of user data. The mirror is eventually consistent with Clerk by design, and the
  hydration cache makes that explicit rather than accidental.
- Data residency: Clerk holds personal data for minors. This needs checking against KVKK before
  launch ([[Security and Privacy]], [[Open Questions|Q-12]]).

## Why the mirror is just-in-time, not webhook-driven

A `user.created` webhook can arrive late, out of order, or not at all. The user, meanwhile, is
already making requests. A webhook-created row is therefore a race against the user's first API
call, and the losing side is a 500.

`ensureAppUser()` runs on the request that needs the row, so the row always exists by the time
anything reads it. Clerk's Backend API is rate-limited and this path runs on nearly every request,
so hydration from Clerk is cached per user for 60s while the database row is served in between. The
database stays the source of truth, so a name changed in our app shows immediately.

Webhooks remain the right tool for **side effects** — analytics, notifications — not for the row the
request itself depends on.

## Why role lives in our database

Clerk's `publicMetadata` rides in the session JWT, which is tempting: middleware could read the role
with no database hit. But the JWT **refreshes lazily**, roughly a minute behind a metadata change.
Any gate reading role from the token right after the user sets it sends them back to where they came
from — a redirect loop. Both codebases we looked at carry a comment about exactly this.

It also splits authorization data across two systems, when [[FR-02]] and [[BR-024]] need it in one
place, joined against links.

Consequence: role gates are database reads, and they belong in a **layout**, not in
middleware/`proxy.ts`.

## `authorizedParties` is deliberately off

`verifyToken` can check the token's `azp` claim against a list of allowed origins, which prevents a
JWT minted for a different Clerk application being replayed against our API. The code path is wired
and env-driven, but **unset by default**: tokens minted through Clerk's Backend API carry no `azp`
at all and are rejected outright when it is on. Before enabling it anywhere, verify what real web
*and* Expo clients actually send — the native app is the likely surprise.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Self-hosted JWT ([[ADR-0002]]) | a large security-sensitive surface that is not the product, across two platforms, for minors |
| Clerk components on mobile too | students live in this app; its sign-in screen is part of the product's feel |
| Our own screens on web too | coaches and parents sign in rarely; a hosted flow we do not maintain is strictly better there |
| Role in Clerk `publicMetadata` | lazy JWT refresh causes redirect loops, and it splits authorization across two systems |
| Webhook-created users | races the user's own first request |
