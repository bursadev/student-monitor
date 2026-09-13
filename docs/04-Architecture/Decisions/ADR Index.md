---
title: ADR Index
updated: 2026-09-12
---

# Architecture Decisions

```dataview
TABLE status, date
FROM "04-Architecture/Decisions"
WHERE id != null
SORT id ASC
```

| ID | Decision | Status |
| --- | --- | --- |
| [[ADR-0001]] | pnpm + Turborepo monorepo | accepted |
| [[ADR-0002]] | Self-hosted JWT auth rather than a managed provider | superseded by [[ADR-0012]] |
| [[ADR-0003]] | PostgreSQL with Prisma | accepted |
| [[ADR-0004]] | Effective-dated rates with snapshotted earnings | accepted |
| [[ADR-0005]] | One `WorkItem` table for tasks and assignments | accepted |
| [[ADR-0006]] | Central policy layer for authorization | accepted |
| [[ADR-0007]] | Documentation in English with a Turkish glossary | accepted |
| [[ADR-0008]] | Derive work-item status rather than storing it | accepted |
| [[ADR-0009]] | Feature-sliced frontend with enforced import boundaries | accepted |
| [[ADR-0010]] | What web and mobile share, and what they do not | accepted |
| [[ADR-0011]] | No internationalisation layer — the product is Turkish only | accepted |
| [[ADR-0012]] | Clerk for authentication, our database for authorization | accepted |
| [[ADR-0013]] | Account deletion anonymises our row, deletes the Clerk identity | accepted |
| [[ADR-0014]] | One role per account, fixed at onboarding | accepted |

All of these are reversible except [[ADR-0004]] and [[ADR-0008]], which get baked into historical
data and are therefore worth arguing about now. [[ADR-0009]] is cheap to reverse on day one and
expensive on day two hundred — it decides where every file goes.

Use [[ADR]] as the template for new ones.
