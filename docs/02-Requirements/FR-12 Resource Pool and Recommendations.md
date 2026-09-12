---
id: FR-12
aliases: [FR-12]
title: Resource Pool and Recommendations
area: resources
source: "§16"
status: specified
priority: should
updated: 2026-09-12
---

# FR-12 — Resource Pool and Recommendations

> **Source:** catalog §16, §16.1, §16.2 · **Rules:** [[BR-015]], [[BR-024]]

## Intent

Every exam-prep student accumulates a pile of books and question banks, and every coach wants to
know which ones — before recommending a seventh. The pool is the student's inventory; the
recommendation is the coach's advice on top of it.

## Requirements

- **FR-12.1** Every student has their own resource pool.
- **FR-12.2** The pool records the educational resources the student uses or follows.
- **FR-12.3** Resource types include at least: book, question bank, mock exam source, document,
  digital resource, other material. **The type list must be extensible** without a schema change.
- **FR-12.4** An actively linked coach can view their student's resource pool ([[BR-015]]). This is
  a separate permission from the schedule privacy rule ([[BR-014]]) — the pool *is* visible.
- **FR-12.5** A coach can recommend a resource to their student.
- **FR-12.6** A recommendation carries at least: the student, the recommending coach, the resource,
  and the time of the recommendation.
- **FR-12.7** A student can view the recommendations made to them.
- **FR-12.8** With several coaches, the system preserves **which coach recommended which resource**
  ([[BR-024]]).

## Acceptance criteria

- [ ] A student with two coaches sees both sets of recommendations, each attributed.
- [ ] Coach A cannot edit or withdraw Coach B's recommendation.
- [ ] Adding a new resource type requires data, not a migration.
- [ ] A student can accept a recommendation into their pool, and the origin is retained.
- [ ] A coach who is no longer linked loses access to the pool.

## Design notes

- Model `Resource` as a per-student row with optional reference to a shared catalogue entry. A
  shared catalogue (publisher, title, subject) is tempting but not required in v1 — start with
  free text plus type and subject, and normalise later if coaches ask for shared library.
- A recommendation and a pool item are different objects; accepting a recommendation *creates* a
  pool item that remembers where it came from.
- Subjects should come from the same list used by mock exam results ([[FR-15]]) so per-subject views
  line up.

## Related

[[FR-15]] · [[FR-13]] · [[BR-015]] · [[BR-024]]

## Change log

- 2026-09-12 — created from catalog §16
