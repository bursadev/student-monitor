---
id: T-016
aliases: [T-016]
title: Account deletion and Turkish error copy
status: review
milestone: M1
area: identity
requirements: [FR-01]
updated: 2026-09-13
---

# T-016 — Account deletion and Turkish error copy

**Goal.** A user can erase their own account, and every failure the API or the mobile app surfaces
is Turkish and says something useful.

**Implements.** [[FR-01|FR-01.8]] · [[ADR-0013]] · [[BR-025]] · [[ADR-0011]]

## Done

- [x] `AppUser.deletedAt` + migration `add_app_user_deleted_at`
- [x] `IdentityService.deleteAccount()` — anonymise the row, then delete the Clerk identity;
      `deletedAt` stamped once, Clerk deletion retried on every call, Clerk 404 treated as success
- [x] `ensureAppUser()` refuses a soft-deleted row (401 `"Bu hesap silinmiş."`), which closes the
      up-to-60s window where a JWT minted before deletion is still cryptographically valid
- [x] `DELETE /api/me` → 204, subject always `@CurrentUser()` so it cannot be aimed elsewhere
- [x] `AllExceptionsFilter` (`APP_FILTER`): one `{ statusCode, message }` shape, Turkish copy,
      Prisma `P2025`/`P2002` and Clerk 404 mapped, internals logged rather than returned
- [x] `NotFoundController` in a module imported **last**, so unmatched routes go through the filter
      instead of Express answering `Cannot GET /api/x` in English HTML
- [x] Mobile: `localization={trTR}` on `ClerkProvider`, and `clerk-error.ts` translating by Clerk
      error code against `trTR.unstable__errors`
- [x] Mobile `shared/lib/api` — a token-taking `apiRequest` with no React and no Clerk in it, so
      `shared/**` still never imports `features/**`. Base URL derived from Expo's `hostUri`, which
      is correct on a simulator, an emulator and a physical device without a per-device `.env`
- [x] Mobile `DeleteAccountButton` on the home screen: destructive `Alert` confirmation, then
      `DELETE /api/me`, then `signOut()` so the route guard returns the user to sign-in
- [x] 20 unit + 6 e2e tests green, including the negative case

## Deliberately not done

- **No rate limit** on `DELETE /api/me`. Nothing in the repo has one yet; when a global throttler
  arrives this endpoint should be among the first behind it.
- **Web has no delete UI.** Only mobile can reach the endpoint; the web app still has no API layer
  at all.
- **No grace period** — see [[Open Questions|Q-19]].
- **Mobile has no test runner**, so `clerk-error.ts`, `shared/lib/api` and the delete hook all ship
  untested. They are the obvious first candidates once the workspace has a story for it.
- Cascading behaviour for a coach or student who still has links: irrelevant today because `AppUser`
  is the only table, and it has to be revisited when [[T-006]] lands.

## Follow-ups

- [ ] Decide the workspace test story and cover `clerk-error.ts` + `shared/lib/api` (blocked on
      Turborepo/Biome)
- [ ] Web: an API layer and a delete UI (mobile has both now)
- [ ] Replace the hand-rolled `apiRequest` with `@sm/api` + SWR when that package lands
      ([[Frontend Architecture]]) — this is a deliberate stopgap, not the intended shape
- [ ] Rate-limit the endpoint once a throttler exists
- [ ] Audit row for the deletion itself ([[FR-21]]) — nothing writes an audit log yet
- [ ] Revisit what deletion means for a user with active links ([[T-006]], [[T-007]])
