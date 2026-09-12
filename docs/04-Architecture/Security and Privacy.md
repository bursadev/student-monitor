---
title: Security and Privacy
status: draft
updated: 2026-09-12
---

# Security and Privacy (incl. KVKK)

This product holds academic performance data about **minors**, family financial information, and a
teenager's daily calendar. That combination deserves more care than a typical CRUD app.

## KVKK

Turkey's *Kişisel Verilerin Korunması Kanunu* (KVKK, Law 6698) is GDPR-shaped and applies here.
This is not legal advice — it is the checklist to take to someone who can give it.

| Obligation | What it means for us |
| --- | --- |
| Lawful basis | explicit consent for a minor's data; the **parent/guardian consents** for under-18s ([[Open Questions\|Q-12]]) |
| Explicit consent for special categories | we should avoid collecting health, belief or biometric data entirely — and we currently do |
| Transparency | a Turkish-language privacy notice (*aydınlatma metni*) shown at signup |
| Data minimisation | collect nothing "for later". No ID numbers, no addresses, no school name unless a feature needs it |
| Data subject rights | access, correction, deletion, objection — with a defined process |
| VERBİS registration | likely required once we process at scale; check thresholds |
| Cross-border transfer | transferring personal data abroad has strict conditions — **this constrains hosting region** |
| Breach notification | to the Kurum and affected people, within the statutory window |
| Retention policy | a stated period per data category, with disposal |

**Practical consequences now, not later:**

1. Choose an EU or Turkish hosting region and check the transfer rules **before** deploying.
2. Capture consent at signup with a timestamp and version of the notice — it is evidence.
3. [[BR-025]] (keep history) and the right to deletion are in tension. Resolve it deliberately:
   anonymise the person, retain the aggregate record. Decide this before launch, not after the first
   request.

## Threats specific to this product

| Threat | Mitigation |
| --- | --- |
| A coach reads another coach's students | the policy layer; negative tests on every list ([[BR-024]]) |
| A student finds out what their family pays | separate endpoints and serializers for money ([[BR-022]]) |
| A stranger claims to be a parent | coach approval gate ([[BR-003]]) + max 2 ([[BR-004]]) |
| A coach reads a student's private calendar | coach-facing schedule queries filter to own lessons ([[BR-014]]) |
| Guessable file URLs | signed, expiring URLs; no public objects ([[FR-13]]) |
| Invite-code brute force | high-entropy codes, expiry, rate limiting |
| Credential stuffing | rate limits, lockout, strong password rules, no user enumeration on reset |
| An adult contacting a minor through the product | no free-form student-to-student or stranger messaging exists — keep it that way |

## Engineering baseline

- Argon2id password hashing. Short-lived access tokens, rotating refresh tokens, revocation on logout.
- Rate limiting on auth, invites and uploads.
- No personal data in logs. No tokens, no e-mails, no exam results in log lines or error trackers.
- Secrets from the environment; never committed. `.env` is gitignored.
- Dependency and container scanning in CI.
- Backups encrypted, restore tested — an untested backup is not a backup.
- Uploads restricted by MIME type and size; served only through signed URLs.

## Age and consent

Students are typically 13–18. Before launch, decide and document:

- Minimum age for a student account.
- Whether a student may self-register or must be invited by a coach.
- How parental consent is captured and evidenced ([[Open Questions|Q-12]]).
- What happens to the student's data when they turn 18 and the parental link persists.

That last one is easy to miss and genuinely matters: an adult's academic and financial data should
not keep flowing to a parent by default.

## Related

[[FR-02]] · [[FR-21]] · [[Authorization Matrix]] · [[Open Questions]] · [[Tech Stack]]
