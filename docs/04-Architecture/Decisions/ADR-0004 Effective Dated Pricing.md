---
id: ADR-0004
aliases: [ADR-0004]
title: Effective-dated rates with snapshotted earnings
status: accepted
date: 2026-09-12
---

# ADR-0004 — Effective-dated rates with snapshotted earnings

## Status

accepted — **hard to reverse**, it shapes historical data

## Context

[[BR-023]] is explicit: changing a student's price must not alter what past lessons earned. The
client gave the example themselves (500 TL lesson stays 500 TL when the price becomes 600 TL). The
obvious implementation — `UPDATE rate SET amount = ...` and `SUM(lessons × current_rate)` — breaks
it silently, and the coach discovers it when last month's income changes.

## Decision

Two mechanisms, deliberately redundant:

1. **Effective dating.** `CoachStudentRate` rows carry `effectiveFrom`/`effectiveTo`. Setting a new
   price closes the current row and inserts a new one. There is no update path for `amountMinor`.
2. **Snapshotting.** Each `Earning` row stores `rateSnapshotMinor` plus the `rateId` it derived from.

Recalculation happens only when an underlying *fact* changes (attendance corrected), never when a
price changes.

## Consequences

**Good.** [[BR-023]] holds even if someone later edits a rate row's dates. Price history is auditable
by construction — the table *is* the history. "Why is this month 12,000 TL?" is answerable from
rows, not from reasoning.

**Bad / accepted cost.** "What is the current price?" becomes a query with a date predicate rather
than a column read. Two places hold the number, and they must be kept consistent by only ever
writing them together. More rows, which at this volume is irrelevant.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Mutable price column + `priceHistory` audit table | history exists but calculations still read the current value; [[BR-023]] depends on discipline |
| Snapshot only, no effective dating | works for earnings, but cannot answer "what was the price in March?" for an unbilled lesson |
| Effective dating only, no snapshot | correct until a rate row is corrected, which will happen |
