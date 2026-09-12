---
id: FR-15
aliases: [FR-15]
title: Mock Exam Tracking
area: exams
source: "§22, §23, §24"
status: specified
priority: must
updated: 2026-09-12
---

# FR-15 — Mock Exam (Deneme) Tracking

> **Source:** catalog §22, §22.1, §22.2, §23, §23.1, §24 · **Rules:** [[BR-016]], [[BR-017]],
> [[BR-018]], [[BR-019]]

## Intent

Deneme results are how progress is actually measured in Turkish exam prep. Students take a full
practice exam most weeks, and the trend in *net* over months is the single most-watched number by
student, coach and parent alike.

Results are self-reported, so they are worthless until the coach confirms them.

## Requirements

### Recording

- **FR-15.1** A student can record the results of mock exams they have taken.
- **FR-15.2** A result record supports at least: exam name, exam type, date, per-subject results,
  total result/score.
- **FR-15.3** **v1 is manual entry.** No calculation is required; the student types the values,
  including the score (`puan`) ([[BR-018]]). The system stores what was entered.
- **FR-15.4** The data model must **not** depend on one fixed net/score formula. Later versions must
  be able to calculate net, score and other derived values **per exam type** ([[BR-019]]).

### Approval

- **FR-15.5** Mock exam results are subject to coach approval.
- **FR-15.6** A student-entered result is not treated as final ([[BR-016]]).
- **FR-15.7** Statuses supported at minimum: `PENDING_APPROVAL` (Onay bekliyor), `APPROVED`
  (Onaylandı). Further statuses may be added later ([[Open Questions|Q-16]]).

### Statistics

- **FR-15.8** Unapproved results are **excluded from every performance statistic** ([[BR-017]]).
- **FR-15.9** Only approved results feed: average, best result, development/trend, past performance,
  per-subject performance.

### Progression (§24)

- **FR-15.10** The system stores enough data to support: latest approved result, historical approved
  results, best result, average, change versus previous exams, and per-subject change.
- **FR-15.11** In v1 these are derived from manually entered values, without automatic formulas.

## Acceptance criteria

- [ ] A pending result appears in the student's own list marked "pending", and in **no** average,
      chart, trend or parent-facing figure.
- [ ] Approving a result immediately includes it in all statistics.
- [ ] Per-subject rows survive a change of exam type — the schema is not TYT-shaped.
- [ ] A student can enter a result with only a total and no per-subject breakdown.
- [ ] Net values accept decimals (a net is routinely 42.75).

## Design notes

- Schema: `MockExamResult` (header: name, type, date, totals, status, approval metadata) +
  `MockExamSubjectResult` (subject, correct, wrong, blank, net, score). Every numeric field is
  nullable and manually writable in v1; a future calculator fills them from correct/wrong/blank
  according to the exam type's rule.
- Exam types differ in structure, not just arithmetic: TYT is one combined session, AYT is
  field-specific, LGS splits into two sessions. Store `examType` plus a per-type subject template
  rather than fixed columns.
- Net formula, when we add it: `net = correct − wrong / k`, `k = 4` for YKS, `k = 3` for LGS. Do not
  hard-code either — [[BR-019]].
- Which coach approves when there are several? The same "any active coach, record who" approach as
  [[FR-05]]; the recording coach must be preserved for multi-coach clarity.

## Open questions

- [[Open Questions|Q-09]] — which exam types at launch.
- [[Open Questions|Q-16]] — is there a reject status, or only pending/approved?

## Related

[[FR-14]] · [[FR-20]] · [[FR-03]] · [[BR-016]] · [[BR-017]]

## Change log

- 2026-09-12 — created from catalog §22–§24
