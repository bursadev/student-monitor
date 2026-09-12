---
id: FR-13
aliases: [FR-13]
title: File Sharing
area: resources
source: "§17"
status: specified
priority: should
updated: 2026-09-12
---

# FR-13 — File Sharing

> **Source:** catalog §17 · **Rules:** [[BR-024]]

## Intent

Coaches send PDFs constantly — worksheets, schedules, exam analyses. Today those live in WhatsApp
and are unfindable a week later. File sharing is deliberately *not* the same concept as the resource
pool ([[FR-12]]): this is the coach pushing a document, not the student's inventory.

## Requirements

- **FR-13.1** A coach can share files with their actively linked students.
- **FR-13.2** The coach chooses which student or students a file goes to.
- **FR-13.3** A student can access only files shared **with them**.
- **FR-13.4** File format, maximum size and retention policy are defined separately
  ([[Open Questions|Q-06]]).
- **FR-13.5** File sharing and the resource pool are separate concepts and need not be unified.
- **FR-13.6** A file is owned by the coach who uploaded it; another coach of the same student has no
  access to it ([[BR-024]]).
- **FR-13.7** A coach can revoke a share; the student then loses access.

## Acceptance criteria

- [ ] Sharing one file with 12 of 30 students makes it visible to exactly those 12.
- [ ] A direct download URL cannot be used by a student it was not shared with — signed, expiring
      URLs only, never a guessable public path.
- [ ] Coach B cannot list or download Coach A's files for a shared student.
- [ ] Upload rejects disallowed types and oversized files with a clear, translated message.
- [ ] Ending a relationship removes the student's access to that coach's files.

## Design notes

- Storage: S3-compatible object storage with short-lived signed URLs. The API authorizes; the
  storage never serves public objects.
- Scan or at least constrain uploads by MIME type — coaches will upload whatever their phone gives
  them, and students are minors.
- Bulk sharing to a group of students is the actual workflow; a one-student-at-a-time UI will not be
  used.
- Retention matters for cost: a coach with 30 students sharing weekly PDFs for a year is real volume.

## Open questions

- [[Open Questions|Q-06]] — formats, size cap, retention, per-coach quota.

## Related

[[FR-12]] · [[FR-17]] · [[Security and Privacy]] · [[BR-024]]

## Change log

- 2026-09-12 — created from catalog §17
