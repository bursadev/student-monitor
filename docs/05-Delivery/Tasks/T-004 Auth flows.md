---
id: T-004
aliases: [T-004]
title: Auth flows
status: todo
milestone: M1
area: identity
requirements: [FR-01]
updated: 2026-09-12
---

# T-004 — Register, login, refresh, logout

**Goal.** All three roles can create an account and stay signed in on their platform.

**Implements.** [[FR-01]] · [[ADR-0002]]

## Steps

- [ ] Register with role selection; Argon2id hashing
- [ ] Login issuing access + rotating refresh tokens
- [ ] Refresh rotation with reuse detection; logout revokes
- [ ] Password reset without user enumeration
- [ ] Rate limiting on all auth routes
- [ ] Web: httpOnly cookie. Mobile: secure storage
- [ ] Empty-state landing per role ([[FR-01|FR-01.7]])
- [ ] Record consent at signup, pending [[Open Questions|Q-12]]

## Done when

- [ ] A new account of each role sees no other user's data anywhere
- [ ] Reset reveals nothing about whether an address is registered
