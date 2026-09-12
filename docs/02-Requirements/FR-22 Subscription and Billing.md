---
id: FR-22
aliases: [FR-22]
title: Subscription and Billing
area: platform
source: "§35"
status: specified
priority: should
updated: 2026-09-12
---

# FR-22 — Subscription and Commercial Model

> **Source:** catalog §35

## Intent

The coach is the customer. Students and parents use the platform free — which is also what makes the
product spread: every coach brings 30 students, and some of those students have another coach who is
not on the platform yet.

## Requirements

- **FR-22.1** The paying customer of the platform is the **coach**.
- **FR-22.2** Students and parents use the application without paying.
- **FR-22.3** A coach's usage rights can be limited by a subscription model.
- **FR-22.4** Subscriptions must be able to differentiate later by criteria such as: number of
  active students, package, usage level.
- **FR-22.5** Exact packages and pricing are **not yet determined** ([[Open Questions|Q-10]]).
- **FR-22.6** This subscription is a **separate concept** from the lesson price a coach sets for
  their own students ([[FR-18]]) — the platform never touches that money.

## Acceptance criteria

- [ ] Subscription state is stored per coach and is enforceable at the API, not only in the UI.
- [ ] The active-student count is derivable at any moment from [[FR-04]] links.
- [ ] Turning enforcement off leaves every coach unlimited — the v1 default.
- [ ] A lapsed subscription degrades gracefully: the coach keeps read access to history and cannot
      create new work. Students and parents are never locked out of their own data.

## Design notes

- Ship the *model* in v1 (a `Subscription` row per coach, plan, status, period end, student limit)
  and leave enforcement disabled. Retrofitting entitlements after launch means touching every
  endpoint; leaving a disabled check in place costs nothing.
- Payment provider for the Turkish market (iyzico, PayTR, Stripe where available) is a later
  decision — [[Open Questions|Q-10]]. App-store rules apply if the coach subscribes inside the
  mobile app; subscribing on the web avoids the platform cut.
- **Never lock a student out because their coach stopped paying.** The student's history is their
  own, and punishing them makes the free side worthless.

## Open questions

- [[Open Questions|Q-10]] — packages, limits, prices, payment provider.

## Related

[[FR-18]] · [[FR-04]] · [[Product Vision]]

## Change log

- 2026-09-12 — created from catalog §35
