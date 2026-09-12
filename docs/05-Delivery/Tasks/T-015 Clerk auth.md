---
id: T-015
aliases: [T-015]
title: Clerk authentication on web, mobile and backend
status: review
milestone: M1
area: identity
requirements: [FR-01, FR-02]
updated: 2026-09-12
---

# T-015 — Clerk authentication

**Goal.** A person can create an account and sign in on either client, and the API can tell who they
are — with an `AppUser` row to hang the domain off.

**Implements.** [[FR-01]] · part of [[FR-02]] · [[ADR-0012]] · [[ADR-0003]]

## Done

- [x] Postgres via `docker-compose.yml` (host port 5433), Prisma 7 with a **single** schema
- [x] `AppUser` model keyed on `clerkUserId`, with `role` and `onboardedAt` nullable until onboarding
- [x] Backend: global `ClerkAuthGuard` (default-deny), `@Public()`, `@CurrentUser()`,
      `IdentityService` with a just-in-time mirror and a 60s hydration cache
- [x] `GET /api/me` returning an explicitly mapped DTO
- [x] Web: `proxy.ts` route matcher, `ClerkProvider` with Turkish localisation, `<SignIn />` /
      `<SignUp />` on catch-all routes, `requireUserOrRedirect()`, guarded `/panel`
- [x] Mobile: `IdentityProvider` with keychain token cache, hand-rolled sign-in and sign-up
      (incl. email verification), `useSession()` wrapper, `(app)` route guard
- [x] Verified end to end against a real Clerk token: 401 without, 200 with, and the `AppUser` row
      created in Postgres on first call

## Deliberately not done

- **Role selection / onboarding UI.** The column and the enum exist; nothing writes them yet.
  That is the next task, and it is where [[Open Questions|Q-08]] (can one person hold several roles?)
  has to be answered.
- **`authorizedParties`** left off — see [[ADR-0012]] for why, and what to verify first.
- Social sign-in (Google / Apple), account deletion, admin roles.

## Follow-ups

- [ ] Onboarding: pick a role, set display name, stamp `onboardedAt`
- [ ] Wire the clients to `/api/me` (an API layer with a token bridge, per [[Frontend Architecture]])
- [ ] Model Clerk's per-MAU cost against a user base that is mostly free roles ([[FR-22]])
- [ ] KVKK review of Clerk holding minors' data ([[Open Questions|Q-12]])
