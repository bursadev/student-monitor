---
id: T-003
aliases: [T-003]
title: CI pipeline
status: todo
milestone: M0
area: foundation
requirements: []
updated: 2026-09-12
---

# T-003 — CI pipeline

**Goal.** Every pull request is linted, typechecked and tested before review.

## Steps

- [ ] GitHub Actions: install, lint, typecheck, unit tests, API integration tests with a Postgres service
- [ ] Migration check: the schema and migrations agree
- [ ] Turborepo remote caching or a sensible local cache strategy
- [ ] Dependency audit

## Done when

- [ ] A PR that breaks a type in `packages/shared` fails CI on the consuming app
