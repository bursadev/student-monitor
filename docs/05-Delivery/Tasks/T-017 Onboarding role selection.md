---
id: T-017
aliases: [T-017]
title: Onboarding — role selection and display name
status: review
milestone: M1
area: identity
requirements: [FR-01, FR-02]
updated: 2026-09-13
---

# T-017 — Onboarding: role selection and display name

**Goal.** Every account has a role, so the rest of M1 has something to authorize against.

**Implements.** [[FR-01|FR-01.9]] · [[ADR-0014]] · part of [[FR-02]]

Before this, `AppUser.role` was null for every user in the database and nothing could be built on
it — [[T-006]] cannot link a coach to a student without knowing which is which.

## Done

- [x] `POST /api/me/onboarding` → 200 `AppUserDTO`, 409 on a second attempt
- [x] The write is conditional on `onboardedAt` still being null, so two concurrent submits cannot
      both succeed — the guard clause is for the error message, the `updateMany` is the real lock
- [x] `parseOnboardingInput` — role in the enum, name trimmed to 2–80 chars, Turkish messages
- [x] Deleted accounts refused (inherited from `ensureAppUser`, asserted here anyway)
- [x] Web: first `features/` slice — server action, `(onboarding)` route group, gate in
      `(app)/layout.tsx`, panel now greets by our `displayName` and role
- [x] Web: `shared/lib/api/server.ts`, marked `server-only` so a client import fails the build
- [x] Mobile: `useAppUser`, gate in `(app)/_layout.tsx`, `OnboardingScreen` at a root-level route
- [x] Both gates fail **closed** — an unreachable API reads as "not onboarded", never as "done"
- [x] 35 unit + 7 e2e green

## Notes

**Why onboarding is gated in a layout, not `proxy.ts`.** The Clerk JWT lags a metadata change by up
to a minute ([[ADR-0012]]). A proxy-level check would bounce a user straight back into the form they
just submitted. A layout reads our database, which is correct the instant the write lands.

**Why the onboarding route sits outside the authenticated group** on both clients: the gate in
`(app)` redirects *to* it, so it cannot live under the thing redirecting to it.

## Deliberately not done

- **Grade level for students** ([[FR-03]]) — belongs to its own requirement and needs a new enum and
  migration. Onboarding is the natural place to ask for it eventually.
- **No `PATCH /api/me`** yet, so a display name cannot be edited after onboarding ([[FR-01|FR-01.4]]).
- **No way back from a wrong choice.** The form warns, but a user who picks the wrong role needs an
  admin who does not exist ([[Open Questions|Q-18]]). Flagged in [[ADR-0014]].
- **Web and mobile ship untested** — neither app has a test runner.

## The API-client debt

This is now the **second** hand-rolled API client: `apps/web/src/shared/lib/api/server.ts` alongside
mobile's from [[T-016]]. Neither is what [[Frontend Architecture]] prescribes (`@sm/api` + SWR), and
the two have already drifted — the web one takes a token internally via Clerk's server helper, the
mobile one takes it as an argument.

That is two migrations instead of one, and it grows with every feature. **`@sm/core` + `@sm/api`
should be the next task**, before [[T-006]] adds a third caller.

## Follow-ups

- [ ] `@sm/core` + `@sm/api`, replacing both hand-rolled clients
- [ ] Zod schema for onboarding in `@sm/core`, replacing `parseOnboardingInput` ([[T-002]])
- [ ] `PATCH /api/me` for display-name edits ([[FR-01|FR-01.4]])
- [ ] Audit row when a role is set ([[FR-21]])
- [ ] Route users toward the right client after onboarding (a coach on mobile, a parent on web)
