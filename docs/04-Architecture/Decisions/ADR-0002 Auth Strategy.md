---
id: ADR-0002
aliases: [ADR-0002]
title: Self-hosted JWT auth rather than a managed provider
status: accepted
date: 2026-09-12
---

# ADR-0002 — Self-hosted JWT auth

## Status

accepted

## Context

Authentication is simple here — e-mail/phone plus password, three roles — but **authorization is
not**, and it is entirely relationship-based ([[BR-024]]). A managed identity provider solves the
easy half and cannot express the hard half. Meanwhile KVKK and minors' data make the location and
custody of user records a real consideration ([[Security and Privacy]]).

## Decision

Implement authentication in the API: Argon2id password hashing, short-lived JWT access tokens,
rotating refresh tokens (httpOnly cookie on web, secure storage on mobile), revocation on logout.

Authorization stays entirely in our policy layer ([[ADR-0006]]).

## Consequences

**Good.** Users, links and permissions live in one database and one transaction. No per-MAU cost for
a free student/parent tier that could reach tens of thousands. Full control of data residency.

**Bad / accepted cost.** We own password reset, rate limiting, lockout, token rotation and the
security bugs in them. Adding social or phone-OTP login later is our work.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Clerk / Auth0 | priced per MAU, and most of our users are free; authorization still ours |
| Supabase Auth | attractive if we used Supabase's database and RLS; we are not, and adopting it for auth alone adds a dependency |
| Firebase Auth | ties identity to Google infrastructure; data residency questions under KVKK |

Revisit if phone-OTP login becomes a launch requirement — that is the one place a provider clearly
earns its cost in this market.
