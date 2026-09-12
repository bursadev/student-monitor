---
title: Screen Inventory
status: draft
updated: 2026-09-12
---

# Screen Inventory

A checklist of surfaces implied by the requirements, so nothing is discovered mid-build. **Not a
navigation design** — grouping and layout are open.

## Student (mobile)

| Screen | Requirements | Milestone |
| --- | --- | --- |
| Register / login / empty state | [[FR-01]] | M1 |
| Join a coach (enter code / scan) | [[FR-04]] | M1 |
| Today — what is due, with Filiz | [[FR-06]] [[FR-07]] [[FR-08]] | M2–M3 |
| Item detail + submit | [[FR-06]] | M2 |
| Returned item with the coach's note | [[FR-06]] | M2 |
| Progress — daily / weekly / monthly | [[FR-14]] | M3 |
| My schedule (06:00–24:00, multi-select) | [[FR-11]] | M4 |
| Lesson requests — accept / decline | [[FR-09]] | M4 |
| My coaches — link, end relationship | [[FR-04]] | M1 |
| Mock exams — list, add result, pending badge | [[FR-15]] | M7 |
| Resource pool + recommendations | [[FR-12]] | M7 |
| Files shared with me | [[FR-13]] | M7 |
| Notifications | [[FR-16]] | M2 |
| Profile — grade level | [[FR-03]] | M1 |

**Never on these screens:** any price, any amount, any earnings ([[BR-022]]).

## Coach (web, key actions mirrored on mobile)

| Screen | Requirements | Milestone |
| --- | --- | --- |
| Follow-up — waiting on me / behind / fine | [[FR-17]] | M3 |
| Students list + invite | [[FR-04]] | M1 |
| Student detail — work, lessons, progress, exams, resources | several | M2+ |
| Assign work (bulk, multi-student) | [[FR-06]] [[FR-07]] | M2 |
| Approvals queue | [[FR-06]] | M2 |
| Lessons calendar — propose, cancel, attendance | [[FR-09]] [[FR-10]] | M4 |
| Pricing per student + history | [[FR-18]] | M5 |
| Earnings — per student and pool total | [[FR-19]] | M5 |
| Parent approvals + sharing settings | [[FR-05]] [[FR-20]] | M1, M6 |
| Notifications + templates (student and parent) | [[FR-16]] | M3, M6 |
| Mock exam approvals | [[FR-15]] | M7 |
| Files — upload and share | [[FR-13]] | M7 |
| Subscription | [[FR-22]] | M8 |

## Parent (web)

| Screen | Requirements | Milestone |
| --- | --- | --- |
| Request access / pending state | [[FR-05]] | M1 |
| Child summary — progress, attendance, exams | [[FR-20]] | M6 |
| Financial — price and earnings per coach | [[FR-18]] [[FR-19]] | M6 |
| Notifications from the coach | [[FR-16]] | M6 |

**Never on these screens:** the coach's pool total across other families ([[FR-19|FR-19.9]]).

## Cross-cutting states every screen needs

- Empty (no coach yet, nothing due today, no results yet) — the most-seen state in week one
- Loading and offline
- Error with a translated, actionable message
- Pending approval — visible as its own state, not hidden in "done" or "missing"

## Related

[[UX Principles]] · [[Personas]] · [[Requirements Index]]
