---
id: T-012
aliases: [T-012]
title: Event notifications
status: todo
milestone: M2
area: notifications
requirements: [FR-16]
updated: 2026-09-12
---

# T-012 — Event notifications

**Goal.** The right person is told, and nobody else is.

**Implements.** [[FR-16]] · [[BR-007]] · [[BR-024]]

## Steps

- [ ] `Notification` rows with `type` + structured payload, one per recipient
- [ ] Events: assigned, submitted, approved, returned
- [ ] In-app feed with unread state and deep links
- [ ] Expo push registration and delivery
- [ ] Fan-out targets exactly the involved users ([[BR-007]])

## Done when

- [ ] A submission on a student with three coaches notifies exactly one coach
- [ ] No notification payload contains money ([[BR-022]])
- [ ] A tapped notification opens the item it refers to
