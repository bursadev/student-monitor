---
id: FR-01
aliases: [FR-01]
title: Accounts and Sessions
area: identity
source: "§3.1, §3.2"
status: specified
priority: must
updated: 2026-09-12
---

# FR-01 — Accounts and Sessions

> **Source:** catalog §3.1, §3.2 · **Rules:** [[BR-001]]

## Intent

Anyone — coach, student or parent — can create their own account. Registering creates a *person*,
not a *relationship*: a fresh account sees nothing about anyone else until a link is established
and, where required, approved.

## Requirements

- **FR-01.1** A user can register as a coach, a student or a parent.
- **FR-01.2** The account and the coach–student / parent–student relationships are independent
  concepts. Registration never auto-links two users.
- **FR-01.3** A user can log in, log out, and access their own account.
- **FR-01.4** A user can view and edit their own profile (name, contact, password).
- **FR-01.5** A user can recover access if they forget their password.
- **FR-01.6** Sessions survive app restarts on mobile and expire after inactivity on web. Logging
  out invalidates the refresh token.
- **FR-01.7** A new account's landing state is an empty state that explains how to get linked — an
  invite code for students, "invite your first student" for coaches, "request access" for parents.

## Acceptance criteria

- [ ] A newly registered student sees no coach, no tasks, no data belonging to anyone else.
- [ ] A newly registered parent sees no student until [[FR-05]] completes.
- [ ] Logging out on one device does not log the user out everywhere (unless they ask).
- [ ] Password reset does not reveal whether an e-mail is registered.

## Authorization

The user is the only one who can read or write their own credentials. No role can change another
user's password. See [[Authorization Matrix]].

## Design notes

- Identifier: e-mail, with phone as a likely second option for Turkish users. Phone-first signup is
  common in this market — worth validating before building.
- Role is chosen at registration and fixed afterwards in v1 ([[Open Questions|Q-08]]).
- Students are minors: parental consent must be captured at signup ([[Open Questions|Q-12]],
  [[Security and Privacy]]).

## Open questions

- [[Open Questions|Q-08]] — can one person hold several roles?
- [[Open Questions|Q-12]] — who consents for a minor's account under KVKK?

## Related

[[FR-02]] · [[FR-04]] · [[FR-05]] · [[Security and Privacy]]

## Change log

- 2026-09-12 — created from catalog §3.1–3.2
