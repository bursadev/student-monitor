# CLAUDE.md

Guidance for Claude Code working in this repository. Read this before touching code.

## What we are building

A student-coaching platform for Turkish exam preparation (YKS: TYT/AYT, and LGS) that runs
*alongside* regular school. Working title: **Student Monitor**.

Three roles, one shared backend:

| Role | Turkish | What they do |
| --- | --- | --- |
| Coach | Koç | Assigns tasks/assignments, schedules lessons, approves mock-exam results, recommends resources, shares files, sets a per-student price, tracks earnings. **The paying customer.** |
| Student | Öğrenci | Does the work, submits completion requests, keeps a private schedule, logs mock-exam results, keeps a resource pool. **Free.** |
| Parent | Veli | Read-only follow-up: progress, attendance, exam development, and the financial side (price + earnings). **Free.** |

A student may work with **several coaches at once**. Everything a coach creates belongs to that
coach and must stay isolated from the student's other coaches.

## Documentation is in `docs/` (Obsidian vault)

`docs/` is the source of truth for requirements, domain rules, decisions and planning.
Open it as an Obsidian vault, or just read the Markdown.

| You need | Go to |
| --- | --- |
| Entry point / map | `docs/Home.md` |
| Original client requirements (Turkish, **never edit**) | `docs/01-Product/Source - Requirement Catalog (TR).md` |
| Functional requirements FR-01..FR-22 | `docs/02-Requirements/` |
| Business rules BR-001..BR-026 (İK-001..İK-026) | `docs/02-Requirements/Business Rules/` |
| Domain model, state machines, authorization matrix | `docs/03-Domain/` |
| Architecture + ADRs | `docs/04-Architecture/` |
| Roadmap, milestones, tasks | `docs/05-Delivery/` |
| Unanswered product questions | `docs/01-Product/Open Questions.md` |

**Keep docs and code in the same commit.** When you implement something:

1. Flip `status:` in the relevant `FR-xx` note (`specified` -> `in-progress` -> `implemented`).
2. Update the matching task note in `docs/05-Delivery/Tasks/` (`status:` in frontmatter).
3. If you made a structural choice, add an ADR in `docs/04-Architecture/Decisions/`.
4. If a requirement turned out to be ambiguous, add it to `Open Questions.md` instead of guessing
   silently in code.

Cite requirements in code comments and commit messages as `FR-06.4` / `BR-009`.

## Stack

The three apps are scaffolded. Everything else in milestone M0 is still open —
see `docs/05-Delivery/Tasks/T-001 Scaffold the monorepo.md`.

- **Backend**: NestJS 12 (TypeScript, **ESM** — `"type": "module"`, so relative imports need the
  `.js` extension). Tests are **Vitest**, not Jest. PostgreSQL + Prisma are not wired up yet.
- **Web**: Next.js 16 App Router + React 19, **Tailwind v4** (`@import "tailwindcss"` in
  `globals.css`, no `tailwind.config`), Turbopack.
- **Mobile**: Expo SDK 57 + Expo Router 7 at `src/app/`, React Native 0.86, typed routes and the
  React Compiler both on.
- **Frontend data/state** (not installed yet): SWR, Zustand, react-native-mmkv on mobile /
  `localStorage` on web behind one storage adapter.
- **No i18n layer.** The product is Turkish only — copy is written directly in components as string
  literals. Dates and numbers still go through `Intl` with `tr-TR` / `Europe/Istanbul`. See
  `docs/04-Architecture/Decisions/ADR-0011 No Internationalisation Layer.md`.
- **Tooling**: pnpm workspaces. Turborepo and **Biome** are still to be added — the Nest scaffold
  currently ships oxlint + Prettier, which Biome replaces.
- Node 22 locally. Locale `tr-TR`, timezone `Europe/Istanbul`, week starts Monday, currency TRY.

Planned layout:

```
apps/backend    NestJS backend
apps/web        Next.js web app       (coaches, parents)
apps/mobile     Expo React Native app (students, coach quick actions)
packages/core   domain types, enums, Zod schemas, progress + earnings rules
packages/api    axios client, endpoint modules, SWR hooks and cache keys
packages/config Biome and tsconfig bases
docs/           Obsidian vault (this is the spec)
```

There is no workspace called `shared`. Inside an app, `src/shared/` means "shared across this app's
features" and nothing more. See `docs/04-Architecture/Decisions/ADR-0010 Web Mobile Code Sharing.md`.

## Commands

Run from the repo root.

```
pnpm install                    install the whole workspace
pnpm dev:backend                nest start --watch      (apps/backend)
pnpm dev:web                    next dev                (apps/web)
pnpm dev:mobile                 expo start              (apps/mobile)

pnpm typecheck                  tsc --noEmit in every app
pnpm build                      build every app
pnpm test                       run every test suite

pnpm --filter backend test      one app only
```

Two things that will bite you:

- **`pnpm --filter web typecheck` runs `next typegen` first.** Next 16 generates `LayoutProps` /
  `PageProps` into `.next/types`; a bare `tsc --noEmit` fails before those exist.
- **The backend is ESM.** Relative imports need `.js` (`./app.module.js`), and a bare subpath
  import of a CJS dependency needs the extension too (`supertest/types.js`).

## Frontend structure (web and mobile are identical)

Full detail: `docs/04-Architecture/Frontend Architecture.md`.

```
apps/<web|mobile>/src/
  assets/
  app/          routing layer — file-based (Next App Router / Expo Router)
  features/     identity onboarding links work progress lessons schedule exams
                resources files notifications students billing guardians
                subscription settings          ← named after the FR-xx areas
  shared/       components/{ui,layout}  lib/{api,auth,storage,messaging}
                store/  utils/
```

Each feature: `components/ hooks/ lib/ screens/ store/ types/ utils/ index.ts`.

**Import rules — enforced by Biome, do not work around them:**

1. `app/**` imports **only** `features/*/screens/**` and `shared/**`. Route files are five-line
   adapters that mount a screen; they contain no logic.
2. Cross-feature imports go through the public entry `@/features/x` — never `@/features/x/components/...`.
3. `shared/**` never imports `features/**` or `app/**`.
4. **Inside a feature use relative imports.** The `@/features/...` alias always means "another
   feature" — that is what makes rule 2 lintable.
5. Domain rules (status derivation, progress/Filiz, earnings) come from `@sm/core`. Never
   reimplement them in an app.
6. Server data comes from `@sm/api` (SWR). Zustand stores hold UI state only — never cached API
   responses, or you have two sources of truth.
7. Web does not depend on `react-native`; mobile does not depend on `next`. Enforced by the absence
   of the dependency, not by lint.

When adding a Biome `overrides` block, keep its glob **disjoint** from the existing ones: only the
first matching override applies, and it replaces rather than merges the rule's options.

## Domain language — use exactly these names in code

Turkish is the product language; **English is the code language**. Do not invent synonyms.

| Turkish | Code identifier | Note |
| --- | --- | --- |
| Koç | `Coach` | |
| Öğrenci | `Student` | |
| Veli | `Parent` | guardian, max 2 active per student |
| Koç–Öğrenci İlişkisi | `CoachStudentLink` | |
| Veli–Öğrenci İlişkisi | `ParentStudentLink` | |
| Sınıf seviyesi | `gradeLevel` | |
| Görev | `Task` | `WorkItem` with `type = TASK` |
| Ödev | `Assignment` | `WorkItem` with `type = ASSIGNMENT` |
| Tamamlama talebi | `submission` / `submittedAt` | student says "done" |
| Onay | `approval` / `approvedAt` | coach closes it |
| Geri gönderme | `RETURNED` / `returnNote` | note is optional |
| Ders / Görüşme | `Lesson` | |
| Ders talebi | `LessonRequest` | only a coach may create one |
| Devam kaydı | `Attendance` | `ATTENDED` / `NO_SHOW` / `CANCELLED` |
| Program etkinliği | `ScheduleEntry` | student-private |
| Kaynak | `Resource` | |
| Kaynak havuzu | `ResourcePool` | per student |
| Kaynak önerisi | `ResourceRecommendation` | keeps the recommending coach |
| Deneme | `MockExam` | |
| Deneme sonucu | `MockExamResult` | needs coach approval |
| Net / Puan | `net` / `score` | manual entry in v1 |
| Bildirim | `Notification` | |
| Bildirim şablonu | `NotificationTemplate` | not an AI prompt system |
| Dosya paylaşımı | `FileShare` | |
| Öğrenci fiyatlandırması | `CoachStudentRate` | effective-dated |
| Puantaj | `TimesheetEntry` | one per billable lesson |
| Hakediş | `Earning` | amount with a frozen rate snapshot |
| Abonelik | `Subscription` | coach pays us; unrelated to lesson prices |
| Filiz | `Filiz` / `ProgressStage` | keep the brand name, 4 stages |

## Invariants — do not break these

These come straight from the client's rules. Each links to a note in
`docs/02-Requirements/Business Rules/`.

1. **Authorize on the backend.** Hiding a button is not authorization. Every query is scoped by the
   caller's active links. (BR-024, FR-02)
2. **Multi-coach isolation.** Coach A can never read or manage content owned by Coach B for the same
   student — tasks, assignments, lessons, files, recommendations, notifications, prices, earnings.
   Every coach-created row carries `coachId` and every read filters on it. (BR-024)
3. **A student "done" never closes work.** `submittedAt` sets `PENDING_APPROVAL`; only the *assigning*
   coach approves or returns it. The approval request goes to that coach only. (BR-006, BR-007)
4. **Lateness uses `submittedAt`, never `approvedAt`.** A coach approving late does not make the
   student late. (BR-009)
5. **Late-completed ≠ never-completed.** They are separate statistics, always. (BR-010)
6. **Only a coach creates lesson requests.** Students accept or decline; they cannot request lessons.
   (BR-011)
7. **The student's personal schedule is private.** A coach sees only the lessons from their own
   coaching relationship — never school hours, personal events or free slots. (BR-014)
8. **Unapproved mock-exam results are invisible to statistics.** Averages, bests, trends and
   per-subject analysis use approved results only. (BR-016, BR-017)
9. **Students never see money.** Price and earnings are visible to the owning coach and the
   student's approved parents only. (BR-022)
10. **Past earnings are frozen.** A rate change applies from its effective date forward; a lesson
    billed at 500 TL stays 500 TL forever. Store the rate snapshot on the earning row. (BR-020,
    BR-023)
11. **A parent link is inactive until the student's coach approves it**, and a student may have at
    most 2 active parents. (BR-003, BR-004)
12. **Nothing is hard-deleted.** Ending a coach-student relationship, completing work or passing a
    deadline never destroys history; access rules change, records do not. (BR-025, FR-21)
13. **Return notes and cancellation notes are optional.** Never make them required. (BR-008, BR-013)
14. **Progress rules are configuration, not constants.** Filiz thresholds and the monthly progress
    formula are undecided; keep them in one replaceable module in `packages/shared`. (FR-08, FR-14)
15. **Task progress and assignment progress are computed separately** and never influence each
    other's Filiz. (BR-005, FR-08)

## Conventions

- TypeScript everywhere, `strict: true`. No `any` in domain code.
- Enums and status unions live in `packages/shared` and are imported by API, web and mobile.
- Timestamps are `timestamptz` in UTC; format for display in `Europe/Istanbul`.
- Money: integer minor units (kuruş) + currency code. Never floats.
- Soft delete / state transitions instead of `DELETE`.
- Every state change that matters (see FR-21) writes an audit row with actor, timestamp and note.
- API errors: never leak the existence of another coach's data — return 404, not 403, for rows the
  caller cannot see.
- User-facing copy is Turkish; identifiers, comments and commits are English.

## Definition of done

- The requirement note's acceptance criteria all pass.
- Authorization is covered by a test proving the *negative* case (other coach / unlinked parent /
  student reading money).
- Docs updated (see above).
- `pnpm lint` and `pnpm test` pass.

## Working style here

- This is a spec-first project: when code and `docs/` disagree, `docs/` wins until we agree to change it.
- Prefer asking in `Open Questions.md` over inventing business rules — several are genuinely still open
  (Filiz thresholds, monthly formula, cancellation billing, subscription packages).
- Not every requirement will be built. Check `docs/01-Product/Scope and MVP.md` before starting work.
