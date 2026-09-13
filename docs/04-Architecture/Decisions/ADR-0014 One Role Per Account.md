---
id: ADR-0014
aliases: [ADR-0014]
title: One role per account, fixed at onboarding
status: accepted
date: 2026-09-13
---

# ADR-0014 — One role per account, fixed at onboarding

## Status

accepted — answers [[Open Questions|Q-08]]

## Context

`AppUser.role` has existed since [[ADR-0012]] but nothing wrote it, so every account in the database
had `role = null`. Nothing in [[FR-02]] can be built on a null: the policy layer resolves
capabilities *by* role, and a coach–student link needs to know which side is which.

[[Open Questions|Q-08]] asked whether one person can hold several roles. It is a real question in
this market — a coach who is also the parent of another student is an ordinary person, not a corner
case. The documented placeholder was "one role per account", and [[FR-01]] already noted the role is
"chosen at registration and fixed afterwards in v1".

## Decision

**One role per account, chosen at onboarding, never changed afterwards.**

- `POST /api/me/onboarding` takes `{ role, displayName }` and is the only thing that ever writes
  `role`. A second call answers **409**, so "fixed" is enforced rather than merely intended.
- `onboardedAt` doubles as the completed flag. The write is conditional on it still being null
  (`updateMany … where onboardedAt: null`), so two concurrent submits cannot both win.
- A future `PATCH /api/me` may edit `displayName` (FR-01.4). It will never accept `role`.
- Both clients offer all three roles. The web/mobile split in `CLAUDE.md` is about where each role is
  *comfortable*, not a gate — stranding someone who installed the wrong app first is a worse failure
  than an extra radio button.

A person who needs two roles opens two accounts with two e-mail addresses.

## Consequences

**Good.** Authorization stays one column. Every policy check reads a single value, with no "acting
as" dimension threaded through queries, no role switcher in the UI, and no ambiguity about which
capacity a request was made in. It is the cheapest thing that unblocks all of M1.

**Bad / accepted cost.**

- The coach-who-is-also-a-parent needs two accounts and two e-mails. If that person turns out to be
  common rather than occasional, this is the decision to revisit first.
- **Choosing wrong is unrecoverable by the user.** A teenager who taps "Koç" on day one needs
  support intervention — and we have no admin role to intervene with ([[Open Questions|Q-18]]). The
  form warns before submitting ("Rolünü daha sonra değiştiremezsin"), which is mitigation, not a fix.
- Deleting and re-registering is the only self-service escape, and by [[ADR-0013]] that discards all
  history.

## Reversibility

Deliberately cheap to relax, expensive to have got wrong in the other direction. Going from one role
to several means a join table and an "acting as" concept in the policy layer — a large change, but a
*mechanical* one, and one where the existing single-role data is valid input.

Going the other way — shipping multi-role, then discovering the authorization surface is too big to
reason about — means unpicking rules that have already been written against it. The single-role
version is the smaller bet.

The one thing that keeps this option open: **`role` is written in exactly one place.** Keep it that
way.

## Alternatives considered

| Option | Why not |
| --- | --- |
| One role, changeable later | avoids the day-one trap, but nothing answers what happens to work, links and earnings created under the old role — and an audit trail for it ([[FR-21]]) does not exist yet |
| Several roles per account | truest to the domain, but role stops being a column, every policy check gains an "acting as" dimension, and the UI needs a switcher. Revisit when there is evidence people actually need it |
| Infer role from the first relationship | magical and ambiguous — a person with no links yet has no role, and the landing state in [[FR-01|FR-01.7]] depends on knowing it |

## Related

[[FR-01]] · [[FR-02]] · [[ADR-0012]] · [[ADR-0013]] · [[Open Questions|Q-08]] · [[T-017]]
