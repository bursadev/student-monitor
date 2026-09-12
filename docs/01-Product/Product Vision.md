---
title: Product Vision
status: draft
updated: 2026-09-12
---

# Product Vision

## The situation

In Turkey, exam preparation (YKS for university, LGS for high school) happens *alongside* school.
Students work with private coaches — "koç" — who plan their week, assign work, chase them when they
fall behind, review mock exam results, and report to the parents who pay for it.

Coaches run this on WhatsApp, paper and spreadsheets. They lose track of who submitted what, they
recalculate their monthly earnings by hand, and parents have no visibility until something goes wrong.

## What we are building

One platform with three views of the same coaching relationship:

- **Students** get a single place to see what is due, mark it done, keep their own weekly schedule,
  log mock exam results and watch their progress grow ([[Progress and Filiz|Filiz]]).
- **Coaches** get assignment, scheduling, approval and follow-up tools across all their students,
  plus automatic per-student earnings from lessons that actually happened.
- **Parents** get read-only follow-up: is my child doing the work, are the lessons happening, are
  the exam results improving, what do I owe.

## Why it can win

1. **Approval is the product.** Every other to-do app lets a student tick a box. Here the coach
   confirms it, and the difference between *on time*, *late* and *never* is preserved forever
   ([[BR-009]], [[BR-010]]). That is what coaches actually need to do their job.
2. **Multi-coach from day one.** Serious students have a coach for coaching and separate subject
   tutors. The data model keeps them isolated ([[BR-024]]) instead of pretending there is only one.
3. **The money is built in.** Attendance drives the timesheet, the timesheet drives earnings, and
   past rates are frozen ([[BR-023]]). Coaches stop doing accounting in a notebook.
4. **Privacy is a feature, not an afterthought.** The student's personal calendar stays private from
   the coach ([[BR-014]]); the student never sees the money ([[BR-022]]). Both sides can trust it.

## Business model

The **coach pays**; students and parents are free ([[FR-22]]). Subscription tiers will likely key off
the number of active students. Packages and prices are not decided — [[Open Questions|Q-10]].

This is entirely separate from the price a coach charges their own students. We never touch that
money in v1.

## Non-goals (v1)

- Not a marketplace: we do not match students with coaches or take a cut of lesson fees.
- Not a content platform: no question banks, no video lessons, no curriculum.
- Not a school system: no classes, no grades, no teacher/administrator hierarchy.
- Not an AI product: notification templates are stored text, explicitly not prompts (catalog §26).
- No payment processing between coach and parent in v1.

## Success signals

- A coach runs a full month — assigning, approving, scheduling, invoicing — without leaving the app.
- A student opens it daily without being told to.
- A parent stops asking the coach "how is it going?" because they can see it.

## Related

[[Personas]] · [[Scope and MVP]] · [[Requirements Index]] · [[Roadmap]]
