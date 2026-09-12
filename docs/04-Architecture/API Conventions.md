---
title: API Conventions
status: draft
updated: 2026-09-12
---

# API Conventions

REST over JSON. Predictable, boring, and shaped so that authorization mistakes are hard to make.

## URLs

```
/auth/login            POST
/auth/refresh          POST
/me                    GET PATCH

/links/coach-students  GET POST              create = invite or request
/links/coach-students/:id/accept   POST
/links/coach-students/:id/end      POST
/links/parent-students/:id/approve POST

/students/:id                      GET PATCH  (grade level)
/students/:id/work-items           GET POST
/work-items/:id/submit             POST       student
/work-items/:id/approve            POST       assigning coach only
/work-items/:id/return             POST       assigning coach only, note optional

/students/:id/lessons              GET POST   coach only for POST
/lessons/:id/accept  /decline  /cancel        POST
/lessons/:id/attendance            PUT

/students/:id/schedule             GET POST   coach response is filtered
/students/:id/resources            GET POST
/students/:id/exam-results         GET POST
/exam-results/:id/approve          POST

/students/:id/rate                 GET PUT    coach + parent only
/coaches/me/earnings               GET        ?month=&studentId=
/notifications                     GET PATCH
```

State changes are **named actions**, not `PATCH {status}`. `POST /work-items/:id/approve` is
guardable, auditable and obvious; a generic status patch invites illegal transitions.

## Requests and responses

- Body and query validated with the shared Zod schema; the inferred type is the handler's parameter.
- Lists are paginated: `?cursor=&limit=`, response `{ items, nextCursor }`.
- Timestamps are ISO 8601 UTC. Business-day boundaries are computed server-side in
  `Europe/Istanbul` — never let a client decide what "today" means.
- Money fields: `{ amountMinor: number, currency: "TRY" }`. Never a decimal string, never a float.

## Errors

```json
{ "error": { "code": "WORK_ITEM_NOT_FOUND", "message": "…", "details": {} } }
```

- `code` is stable and machine-readable; clients translate it. `message` is for developers.
- **404 for rows the caller cannot see**, not 403 ([[BR-024]]) — 403 confirms the row exists.
  Reserve 403 for "you are authenticated, this action is not available to your role at all".
- 409 for rule violations with a specific code: `MAX_PARENTS_REACHED`, `LINK_ALREADY_ACTIVE`,
  `INVALID_TRANSITION`.
- 422 for validation, with field paths.

## Authorization in the handler

Every handler receives a resolved capability set (see [[Architecture Overview]]) and passes it into
the service. Services never read the raw request. There is no code path where a query is built
without a caller scope — make that structurally true, not a convention people remember.

## Serializers

Separate response types per audience where sensitive fields differ. Specifically: **no serializer is
shared between a coach response and a student response for anything containing money**
([[BR-022]]). It is tempting — the objects look the same — and it is exactly how a price leaks.

## Versioning

`/v1` prefix from day one. Mobile clients cannot be force-updated; we will need to keep an old shape
alive at some point.

## Related

[[Architecture Overview]] · [[Authorization Matrix]] · [[Data Model]]
