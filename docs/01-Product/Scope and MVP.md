---
title: Scope and MVP
status: draft
updated: 2026-09-12
---

# Scope and MVP

The catalog describes the full product. **Not all of it ships in v1.** This note is the agreed
cut line; check it before starting work. Changing it is a product decision, not an implementation
detail.

## The core loop we must nail first

> A coach assigns work → the student does it and submits → the coach approves or returns it →
> both sides see honest progress.

Everything else — lessons, money, exams, parents — hangs off that loop. If the loop is not
frictionless on a phone, nothing else matters.

## v1 — in scope

| Area | Requirement | Why it is v1 |
| --- | --- | --- |
| Accounts, login, roles | [[FR-01]], [[FR-02]] | nothing works without it |
| Student grade level | [[FR-03]] | cheap, needed for context |
| Coach–student link (invite code + request, end relationship) | [[FR-04]] | the product is the relationship |
| Parent link with coach approval, max 2 | [[FR-05]] | the parent is the one paying |
| Tasks | [[FR-06]] | the core loop |
| Assignments | [[FR-07]] | same engine, different type |
| Filiz progress character | [[FR-08]] | the reason a student opens the app daily |
| Lesson request / accept / decline / cancel | [[FR-09]] | drives both calendar and money |
| Attendance | [[FR-10]] | the input to earnings |
| Student private schedule | [[FR-11]] | the student's own reason to stay |
| Daily + weekly progress | [[FR-14]] | proves the loop is working |
| Per-student pricing, effective-dated | [[FR-18]] | required by earnings |
| Timesheet + earnings + coach total | [[FR-19]] | the coach's strongest pull |
| Parent read-only view | [[FR-20]] | closes the trust loop |
| Event notifications (in-app + push) | [[FR-16]] | the loop stalls without them |
| Coach follow-up view | [[FR-17]] | how a coach handles 30 students |
| Audit trail | [[FR-21]] | required by [[BR-025]], cheap now, expensive later |

## v1 — deliberately deferred

| Area | Requirement | Reason |
| --- | --- | --- |
| Mock exam tracking + approval | [[FR-15]] | valuable but self-contained; ships right after the loop is stable |
| Resource pool + recommendations | [[FR-12]] | same |
| File sharing | [[FR-13]] | storage, quota and retention policy are unanswered ([[Open Questions\|Q-06]]) |
| Monthly progress report | [[FR-14]] | the formula is undecided ([[Open Questions\|Q-02]]) — daily/weekly ship first |
| Subscription and paywall | [[FR-22]] | packages undecided ([[Open Questions\|Q-10]]); run unlimited until we have coaches |
| Notification templates + bulk send | [[FR-16]] | manual single-student messages are enough at first |
| QR-code linking | [[FR-04]] | invite code and link cover it; QR is a thin add-on later |
| Recurring lessons | [[FR-09]] | [[Open Questions\|Q-14]] |

## Explicitly out of scope

- Payments between coach and parent. We *calculate* what is owed; we do not move money.
- Chat / messaging. Notifications are one-way. Coaches already have WhatsApp, and a chat feature
  buys us a moderation problem involving minors.
- AI anything — the catalog calls this out for templates (§26); it holds for the whole v1.
- Content: no question banks, no videos, no curriculum.
- Coach discovery / marketplace.
- Web version of the student experience beyond a basic responsive view — students are on mobile.

## Platform split for v1

| App | Audience | Scope |
| --- | --- | --- |
| **Mobile** (Expo) | students, and coaches for quick approvals | full student experience; coach approvals, follow-up list, lesson requests |
| **Web** (Next.js) | coaches, parents | full coach experience (assigning in bulk, earnings, follow-up); parent view |
| **API** (NestJS) | all | one backend, all authorization here ([[BR-024]]) |

Parents get the web app first; a parent mobile view follows if they ask for it.

## Cut-line principles

1. If a feature cannot be authorized correctly yet, it does not ship.
2. If a business rule is still open ([[Open Questions]]), ship the part that does not depend on it.
3. Anything that writes history ships early, even if the reporting on top comes later — we can
   backfill reports, not events.

## Related

[[Roadmap]] · [[Milestones]] · [[Requirements Index]]
