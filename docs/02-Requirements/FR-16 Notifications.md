---
id: FR-16
aliases: [FR-16]
title: Notifications
area: notifications
source: "§25, §26, §31"
status: specified
priority: must
updated: 2026-09-12
---

# FR-16 — Notifications

> **Source:** catalog §25, §26, §31 · **Rules:** [[BR-007]], [[BR-024]]

## Intent

The loop stalls without nudges: work assigned that nobody saw, submissions waiting on a coach who
does not know. Notifications are what make the system feel alive — and the fastest way to make it
unbearable if they go to the wrong person.

## Requirements

### Event notifications (§25)

- **FR-16.1** The system notifies the relevant users on significant events, at minimum:
  new task/assignment, completion request, task/assignment approval, return, lesson request, lesson
  acceptance, lesson decline, lesson cancellation, mock exam approval request, mock exam approval,
  resource recommendation.
- **FR-16.2** Notifications go **only to users involved in the event** — never to a student's other
  coaches ([[BR-007]], [[BR-024]]).

### Coach-sent notifications (§26)

- **FR-16.3** A coach can send manual notifications to their linked students.
- **FR-16.4** A coach can select multiple students for one send.
- **FR-16.5** A coach can create, edit and reuse **notification templates**.
- **FR-16.6** This is explicitly **not** an AI prompt system — templates are stored text with
  placeholders at most.

### Coach → parent (§31)

- **FR-16.7** A coach can send notifications to a linked student's parent.
- **FR-16.8** A coach can create reusable templates for parents as well.
- **FR-16.9** A notification sent to a student is **not** automatically forwarded to the parent.

## Acceptance criteria

- [ ] A completion request for a task assigned by Coach A notifies Coach A and nobody else, on a
      student who has three coaches.
- [ ] Selecting 15 students and a template produces 15 individual notifications, not a group thread.
- [ ] No student notification ever appears in a parent's feed unless separately sent.
- [ ] A notification carries enough context to deep-link to the item it refers to.
- [ ] Templates are per coach and private to them.

## Design notes

- One `Notification` row per recipient per event, with `type` + structured `payload` — never a
  pre-rendered string, or translations and deep links become impossible later.
- Channels: in-app feed plus push (Expo). E-mail/SMS are open ([[Open Questions|Q-11]]).
- **Quiet hours matter here.** Students study late and coaches send at midnight; a push at 02:00
  gets the app muted, permanently. Consider a default send window and per-user preferences.
- Templates want placeholders (`{{student}}`, `{{dueDate}}`) — cheap to add, and the reason a coach
  uses the feature twice.
- Bulk send is a background job, not a request-scoped loop.

## Open questions

- [[Open Questions|Q-11]] — channels and quiet hours.

## Related

[[FR-06]] · [[FR-09]] · [[FR-15]] · [[FR-17]] · [[FR-20]]

## Change log

- 2026-09-12 — created from catalog §25, §26, §31
