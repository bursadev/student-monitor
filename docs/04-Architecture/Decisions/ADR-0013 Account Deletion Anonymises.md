---
id: ADR-0013
aliases: [ADR-0013]
title: Account deletion anonymises our row and deletes the Clerk identity
status: accepted
date: 2026-09-13
---

# ADR-0013 — Account deletion anonymises our row and deletes the Clerk identity

## Status

accepted

## Context

[[BR-025]] says history is never destroyed: *"No hard deletes in the domain: state transitions and
soft-delete flags only."* The history **is** the coaching record — it settles disputes and feeds
every report in [[FR-14]].

KVKK grants a data subject the right to erasure. [[Security and Privacy]] already flagged the
collision and proposed the shape of the answer — *"anonymise the person, retain the aggregate
record"* — but left it undecided. This ADR decides it, while `AppUser` is still the only table and
the choice is cheap to make.

Two systems hold the person: Clerk (credentials, e-mail, name) and our database (the mirror row
plus, later, everything hanging off it).

## Decision

**Delete the identity in Clerk for real. Anonymise our row and keep it.**

`DELETE /api/me` — the subject is always `@CurrentUser()`, so there is no id in the path and the
route cannot be aimed at another account.

1. Null the personal columns on `AppUser` (`email`, `displayName`) and stamp `deletedAt`.
   `id`, `role` and `createdAt` survive: the aggregate record stays intact for [[FR-14]].
2. Delete the user in Clerk via the Backend API. A 404 from Clerk counts as success.

`clerkUserId` **stays on the row**. Clerk never reuses a user id, so the unique index cannot collide
with a later signup, and keeping it is what lets `IdentityService` recognise a deleted account.

### The order is deliberate

Anonymise first, then Clerk. If Clerk is unreachable we have still honoured the erasure request on
our side, and the account is already locked out. Doing it the other way round — deleting in Clerk
and then failing the write — would strand personal data in our database with no authenticated route
left for the user to retry.

The operation is therefore idempotent in a specific way: `deletedAt` is stamped once (it is the
evidence of *when* erasure happened, so a retry must not move it), but the Clerk deletion is
re-attempted on every call, because that is the half that can fail on its own.

### Closing the token window

Clerk verifies tokens offline, so a JWT minted just before deletion stays cryptographically valid
for up to a minute. `ensureAppUser()` refuses a row with `deletedAt` set, throwing 401
`"Bu hesap silinmiş."`. Every feature reaches `AppUser.id` through that method, so refusing once
there refuses everywhere — and the guard keeps its property of doing no database work.

## Consequences

**Good.** [[BR-025]] survives intact: no row is destroyed, no cascade is introduced, and reports
still add up after a user leaves. The KVKK obligation is met where it actually bites — the personal
data is gone from both systems, and the credentials with it.

**Bad / accepted cost.**

- A deleted user who signs up again is a **new person** to us. Same human, new `AppUser.id`, no
  history. That is the price of not keeping an identifier that links them.
- The anonymised row is not literally anonymous while it is the only row in the system: with one
  student and one coach, `role` plus `createdAt` identifies someone. It becomes genuinely anonymous
  only at scale. Worth revisiting if a regulator asks.
- Deletion is **immediate and irreversible**. A student who deletes in anger has no undo, and no
  grace period exists ([[Open Questions|Q-19]]).
- Nothing rate-limits or confirms the endpoint yet — see [[T-016]].

## Alternatives considered

| Option | Why not |
| --- | --- |
| Hard delete the row too | contradicts [[BR-025]]; needs cascade rules the schema is forbidden from having once tasks, lessons and earnings exist |
| Soft-deactivate, purge after N days | best protection against an angry or coerced deletion, but needs a job runner and a restore path nothing else in the repo needs yet — kept open as [[Open Questions\|Q-19]] |
| Ban the Clerk user instead of deleting | leaves the e-mail and name with Clerk, which is exactly the personal data the request was about |
| Keep `email` for "do not re-register" checks | retaining the identifier defeats the erasure it is meant to serve |

## Related

[[BR-025]] · [[FR-01]] · [[FR-21]] · [[Security and Privacy]] · [[ADR-0012]] · [[T-016]]
