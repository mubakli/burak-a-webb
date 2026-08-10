# Learning Platform Architecture

## Product Contract

The platform exists to improve durable software-engineering judgment. A feature
is in scope only when it improves at least one of these outcomes:

1. Topic relevance to the learner's full-stack career and active projects
2. Long-term recall, diagnosis, application, or transfer
3. Reuse and verifiability of high-quality shared knowledge

Page views, scroll depth, streaks, article count, and model output volume are
not learning outcomes.

## Domain Separation

```text
Canonical knowledge                  Private learner state

Topic                                LearnerProfile
  -> immutable TopicRevision           -> TopicState
  -> SharedArticle                     -> Daily Session
       -> immutable ArticleVersion     -> Responses
       -> SourceSnapshots              -> Fieldwork Evidence
       -> Provenance
```

The shared side never contains a learner ID, repository name, answer, or
private reflection. The private side references a pinned article version.

This is the key future multi-user invariant: personalize selection and applied
work, not the reusable article core.

## Content Reuse

An article reuse key is a SHA-256 fingerprint of:

- Canonical topic revision hash
- Locale
- Level band
- Content schema version
- Pedagogy version

It deliberately excludes:

- User ID
- Date
- GitHub username or repository
- Learner answers and reflections
- Provider and model

When the same requirement is selected for another learner, the current
published article version is returned with zero model tokens. New evidence can
create a later immutable version without changing sessions that already pinned
an older version.

## Research Pipeline

```text
Source Registry
   -> trusted fetch / GitHub releases / Tavily discovery
   -> normalized SourceSnapshot
   -> topic-linked evidence set
   -> structured DeepSeek generation
   -> Zod schema validation
   -> immutable ArticleVersion
   -> current SharedArticle pointer
```

Rules:

- Official documentation and release feeds are primary.
- Search providers discover URLs; they are not automatic truth sources.
- Only trusted registry hosts can become evidence.
- Fetched text is untrusted data and never gains tool, network, file, or secret access.
- Model-generated URLs are rejected; citations select supplied source keys.
- Page requests never call search or AI providers.
- A curated article remains available when research or generation fails.

## Adaptive Selection

The deterministic first version combines:

- Recall due date and forgetting risk
- Assessed-evidence gap and completed-practice history
- Full-stack career leverage
- Design-pattern priority
- Domain preference
- Prerequisite readiness
- Relevant fresh evidence
- Recent-topic and premature-advanced penalties

The selected session stores human-readable reasons and machine-readable reason
codes. A future recommender may change the weights, but it must preserve this
explainability boundary.

## Learning Evidence

Each concept is tracked across four independent dimensions:

- Recall: explain without seeing the source
- Conditional knowledge: know when and why to choose it
- Application: use it in a familiar task
- Transfer: adapt it in a different project or failure scenario

Completion alone does not increase the four capability dimensions. The current
conservative projection records exposure, a completed evidence cycle, confidence,
and the next review date. Recall text is stored as an attempt but is not graded;
fieldwork is a self-reported submission and does not promote application mastery.
The four dimensions remain unassessed until a rubric or verifier produces bounded
evidence. Recall attempts reveal a pinned rubric and collect a self-check before
they are rescheduled. Raw sessions remain the source of truth and projections are
idempotent.

## Privacy Boundary

The current application is an owner-only workspace protected by an HMAC-signed,
HttpOnly, SameSite cookie. Mutation endpoints derive the learner from the
verified cookie and never accept a user ID from the request.

For a future public product:

- Replace owner access with a database-backed OAuth session.
- Treat GitHub login and repository analysis consent as separate decisions.
- Prefer public metadata first; private repository access must be explicit and revocable.
- Store GitHub-derived signals with confidence and commit/snapshot identity.
- Absence of code on GitHub means unknown, not unskilled.
- Keep private repository material out of shared article prompts and caches.

## Operational Boundaries

- MongoDB unique indexes protect canonical slugs, revisions, reuse keys, and daily sessions.
- Session and fieldwork mutations use revisions; completed evidence is immutable.
- Research and generation claims use fencing tokens at the source, article, and daily orchestration levels.
- Login attempts use a MongoDB-backed fixed-window limiter without storing raw IP addresses.
- AI output is runtime-validated and rendered as text, never executable HTML.
- Learning pages are private, no-store, and noindex.
- Daily cron can notify the learner only after the session and article are ready.
- CI runs lint, TypeScript, catalog/selection tests, and the production build.
