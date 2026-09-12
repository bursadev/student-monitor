---
id: BR-015
aliases: [BR-015, İK-015]
source: "İK-015"
area: resources
status: specified
updated: 2026-09-12
---

# BR-015 — A coach can see the resource pool and recommend resources

**Rule.** An actively linked coach can view their student's resource pool and recommend resources to
them. This is an explicit exception to the privacy posture of [[BR-014]] — the pool is shared, the
calendar is not.

**Why.** A coach cannot advise on materials they cannot see, and the client called this out as a
separate permission precisely to avoid it being swept up in the calendar privacy rule.

**Enforcement.** Pool reads are allowed for any coach with an `ACTIVE` link; recommendations record
the recommending coach.

**Verification.** A linked coach lists the pool; an ended coach does not.

**Related.** [[FR-12]] · [[BR-014]]
