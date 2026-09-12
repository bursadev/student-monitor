---
id: BR-023
aliases: [BR-023, İK-023]
source: "İK-023"
area: money
status: specified
updated: 2026-09-12
---

# BR-023 — Changing the price never rewrites past earnings

**Rule.** Updating a student's current price must not retroactively change amounts already
calculated for past lessons. A lesson delivered at 500 TL stays 500 TL after the price becomes
600 TL.

**Why.** The client gave this exact example, because it is the bug that destroys trust in the
accounting: a coach raises a price and last month's income silently changes.

**Enforcement.** Two mechanisms, deliberately redundant:
1. Prices are effective-dated (`effectiveFrom`/`effectiveTo`), never updated in place.
2. Each `Earning` stores `rateSnapshotMinor` alongside the `rateId` it came from.

Recalculation is permitted only when the underlying fact changes (attendance corrected), never when
a price changes.

**Verification.** Snapshot the monthly total, change the price, re-read: the total is identical. The
next lesson uses the new price.

**Related.** [[FR-18]] · [[FR-19]] · [[ADR-0004]]
