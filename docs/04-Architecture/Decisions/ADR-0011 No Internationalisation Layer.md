---
id: ADR-0011
aliases: [ADR-0011]
title: No internationalisation layer — the product is Turkish only
status: accepted
date: 2026-09-12
---

# ADR-0011 — No internationalisation layer

## Status

accepted

> An earlier draft carrying this number proposed a cookie-based i18next setup. It was implemented in
> PR #1 and **closed unmerged**, so it never reached `main`; the number is reused for the decision
> that replaced it.

## Context

[[ADR-0007]] settled the language policy — Turkish product, English code — and assumed user-facing
copy would go through i18n keys so a second language stayed possible.

PR #1 built that: `@sm/i18n` with `tr`/`en` catalogues, type-safe keys, a server/client split on
web, device-locale detection on mobile. It worked. It was then closed, because the premise was
wrong: this product serves Turkish exam preparation, in Turkey, for Turkish coaches, students and
parents. There is no second market on the roadmap and no user who wants an English UI.

The layer was machinery bought against a requirement nobody has.

## Decision

**No internationalisation layer.** Turkish copy is written directly in components as string
literals. No i18next, no catalogues, no `@sm/i18n` package, no locale negotiation, no locale
preference on the user profile.

What survives, because it is not internationalisation:

- **Dates, times and numbers still go through `Intl`**, with the `tr-TR` locale and the
  `Europe/Istanbul` time zone — hand-formatted dates are a bug regardless of how many languages a
  product speaks. That belongs in `shared/utils/date/` ([[Frontend Architecture]]).
- `<html lang="tr">` on web.
- Code, comments, commits and this vault stay English ([[ADR-0007]]).

## Consequences

**Good.** Less machinery, fewer dependencies, no key indirection between a component and the words
it renders. No server/client i18n split on web — PR #1 lost a build to `createContext is not a
function` before that was untangled. And no cookie read in the root layout, so routes can stay
statically rendered instead of being forced dynamic.

**Bad / accepted cost.**

- **Copy is scattered across components.** Reviewing or changing wording means grepping the
  codebase rather than reading one file. This is the cost that will actually be felt — coaching apps
  accumulate a lot of user-facing text, and tone consistency matters.
- **Adding a language later means touching every component.** Bounded and mechanical, but it is
  real work, and the further along the product is, the more of it there is.
- Nothing mechanically prevents an English string from being committed by mistake.

**If copy review starts to hurt** before a second language is ever wanted, the cheap middle step is
a plain `strings.ts` per feature — centralised text with no library, no provider and no keys
resolved at runtime. That is not i18n and does not reopen this decision.

## Alternatives considered

| Option | Why not |
| --- | --- |
| Keep i18next, Turkish only | pays the full cost of the abstraction for a benefit nobody is asking for |
| Centralised `strings.ts`, no library | closer to worthwhile, but still indirection today for a hypothetical tomorrow; available later if copy review becomes painful |
| Keep the PR #1 branch merged but unused | dead code that every future contributor has to reason about |
