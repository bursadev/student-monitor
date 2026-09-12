---
id: ADR-0007
aliases: [ADR-0007]
title: Documentation in English with a Turkish glossary
status: accepted
date: 2026-09-12
---

# ADR-0007 — Documentation in English, product in Turkish

## Status

accepted

## Context

The product, its users and the client's requirement catalog are Turkish. The code, the ecosystem and
potentially future contributors are English. Mixing the two arbitrarily produces identifiers like
`getOgrenciTasks()` and requirement notes nobody can search.

## Decision

- The client's catalog stays **verbatim in Turkish**, frozen, as the traceability source.
- All vault notes, code identifiers, comments, commits and tests are **English**.
- [[Glossary]] maps every domain term Turkish ↔ English ↔ code identifier and is the arbiter.
- All user-facing copy is **Turkish**, via i18n keys — never hardcoded strings in either language.
- Brand terms keep their Turkish name: **Filiz** is Filiz, not `Sprout`.

## Consequences

**Good.** One naming convention in code. The glossary makes the translation decisions once instead of
per pull request. Requirements stay traceable to the client's original wording.

**Bad / accepted cost.** A Turkish-speaking stakeholder cannot read the vault directly. Mitigation:
the source catalog is in their language, and the glossary maps back. If non-technical stakeholders
need to review requirements regularly, revisit this.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Everything in Turkish | fights the ecosystem; Turkish identifiers with English framework terms read badly and break tooling conventions |
| Bilingual notes | double the maintenance, and one language silently goes stale |
