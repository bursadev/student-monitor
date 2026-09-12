---
title: UX Principles
status: draft
updated: 2026-09-12
---

# UX Principles

The catalog deliberately mandates no screens, navigation or layout. These are the principles the
design should answer to — not a specification.

## Who we are designing for

Three audiences with opposite needs, which is why there are two clients ([[Architecture Overview]]):

- A **17-year-old on a phone**, tired, at 22:00, who will use this daily or not at all.
- A **coach at a laptop**, managing 30 students, doing the same action repeatedly.
- A **parent**, weekly, who wants reassurance in ten seconds.

## Principles

**1. The student's home screen answers one question: what do I do now?**
Not a dashboard. Today's items, ordered, with the coach who assigned each. Everything else is a tab
away.

**2. Submitting must take one tap.**
It is the action the entire product depends on. If it takes a form, students stop, and the coaching
data becomes fiction.

**3. Filiz is a reward, not a scoreboard.**
The growth transition is the moment worth designing. Never let it become a shaming device — and
never show 0% when nothing was assigned ([[Progress and Filiz]]).

**4. Show who, always.**
With multiple coaches, every item, message and recommendation carries its coach. Ambiguity here is a
support ticket ([[BR-024]]).

**5. Optional means optional.**
Return notes and cancellation notes have no asterisk, no nagging, no "are you sure you don't want to
explain?" ([[BR-008]], [[BR-013]]).

**6. The coach's day starts with what is waiting on them.**
Order by action, not alphabetically: waiting on me → behind → fine ([[FR-17]]). A coach should never
have to work out their own triage.

**7. Bulk is the default for coaches.**
Assigning to one student is the special case. Selecting twelve students and one template is the
normal one ([[FR-16]]).

**8. Money is never on a student's screen.**
Not in a lesson detail, not in a summary, not behind a collapsed section ([[BR-022]]). Design the
student's screens as though the concept does not exist.

**9. Privacy is visible.**
The student should be able to *see* that their school hours and personal events are not shared
([[BR-014]]). Trust that is invisible does not build trust.

**10. Turkish, written as Turkish.**
Copy is written directly in Turkish by someone who speaks it — there is no translation step and no
i18n layer ([[ADR-0011]]). Turkish words run long and its suffixes make labels longer still, so
never let a layout depend on short strings. Dates and numbers still go through `Intl` with
`tr-TR` and `Europe/Istanbul`; hand-formatted dates are a bug in any language.

## Practical constraints

- The schedule grid covers 06:00–24:00 minimum ([[FR-11|FR-11.2]]) and must be usable on a phone.
  Multi-slot selection is a core interaction, not a shortcut ([[FR-11|FR-11.5]]).
- Late-night use is normal: a dark theme is not optional polish.
- Connectivity is imperfect. Submitting should feel instant and reconcile afterwards.
- Notifications carry the product; a badly timed push gets the app muted forever
  ([[Open Questions|Q-11]]).

## Related

[[Screen Inventory]] · [[Personas]] · [[Progress and Filiz]] · [[FR-17]]
