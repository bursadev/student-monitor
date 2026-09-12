---
title: Open Questions
status: open
updated: 2026-09-12
---

# Open Questions

Decisions the client (or we) still owe. **Do not invent answers in code** — implement behind the
placeholder noted here and come back.

| ID | Question | Blocks | Status | Placeholder in the meantime |
| --- | --- | --- | --- | --- |
| Q-01 | The four Filiz stages: what exactly are the thresholds, and over what window (a day? rolling 7 days)? Catalog §10 says explicitly undecided. | [[FR-08]] | **open** | 0% / <50% / <100% / 100% of the day's items, configurable in one module |
| Q-02 | The monthly progress formula (§21) — how are on-time, late and missed weighted into one number? | [[FR-14]] | **open** | report the six raw counts, no single number |
| Q-03 | Does a cancelled lesson earn money? Does it depend on who cancelled, or on notice given (§12, §29.2)? | [[FR-19]] | **open** | `CANCELLED` = not billable, `NO_SHOW` = billable, both flags configurable |
| Q-04 | Does a student `NO_SHOW` count as a delivered lesson for earnings? | [[FR-19]] | **open** | billable (see above) |
| Q-05 | What exactly can a coach "open" to a parent (§30)? A single on/off switch, or per-category toggles (progress / attendance / exams / money)? | [[FR-20]] | **open** | per-category toggles, all off by default |
| Q-06 | File sharing: allowed formats, max size, retention, total quota per coach (§17)? | [[FR-13]] | **open** | PDF/image/office, 25 MB, kept until the coach deletes |
| Q-07 | After a coach–student relationship ends, what can each side still see (§4.5)? History is preserved — but is it readable? | [[FR-04]] | **open** | both keep read-only access to shared history; no new writes |
| Q-08 | Can one person hold several roles (a coach who is also a parent of another student)? | [[FR-01]] | **open** | one role per account |
| Q-09 | Exam types to support at launch, and their net formulas for the future (§22.2) — TYT, AYT, YDT, LGS, branş denemesi? | [[FR-15]] | **open** | free-text exam type + manual net/score entry |
| Q-10 | Subscription packages, limits and prices (§35). | [[FR-22]] | **open** | single unlimited plan, billing stubbed |
| Q-11 | Notification channels: push, e-mail, SMS, in-app only? Quiet hours? | [[FR-16]] | **open** | in-app + push, no quiet hours |
| Q-12 | Minimum age and consent: students are minors. Who consents to the account under KVKK — the student or the parent? | [[Security and Privacy]] | **open** | parental consent recorded at signup for under-18 |
| Q-13 | Can a coach edit or delete a task after the student submitted it? | [[FR-06]] | **open** | no edit after submission; return instead |
| Q-14 | Recurring lessons — does a coach schedule "every Tuesday 19:00", or one at a time (§11.1)? | [[FR-09]] | **open** | one at a time in v1 |
| Q-15 | Recurring schedule entries for school hours — a real recurrence rule, or copy-per-week (§13)? | [[FR-11]] | **open** | multi-select across slots, per week |
| Q-16 | Can a coach reject a mock exam result outright, or only leave it pending (§23)? | [[FR-15]] | **open** | `PENDING` / `APPROVED` only, as written |
| Q-17 | What happens to pending approvals when the relationship ends? | [[FR-04]] | **open** | frozen in place, counted as not completed |
| Q-18 | Is there any admin/support role for us as the platform operator? | [[FR-02]] | **open** | out of scope, DB access only |

## Answered

*(move rows here with the date and who decided)*

## How to use this

- Each open question gets a `Q-xx` ID that never changes.
- Reference it in code: `// Q-01: thresholds are placeholders`.
- Answering one is a change to the FR note plus a line in the *Answered* table plus, usually, a task.
