# Burak Asarcikli - Portfolio and Learning Lab

A Next.js portfolio with a private, evidence-driven learning platform for
full-stack engineering, software architecture, design patterns, data systems,
reliability, security, delivery, and AI engineering.

## Kanit Defteri

`/learning` is not a daily article feed. It is an adaptive learning loop built
around active recall, failure prediction, causal mental models, worked
examples, micro-labs, transfer, reflection, and delayed review.

The initial knowledge graph contains 58 detailed topics. Full-stack career
value and design-pattern reasoning receive explicit priority, while current
web developments are only promoted when they connect to a durable concept or
an active project risk.

The workspace provides:

- A daily adaptive session with quick, standard, and deep modes
- A competency atlas that distinguishes practice history from assessed capability evidence
- A private evidence notebook for hypotheses, transfer, and reflections
- A fieldwork area for commits, tests, ADRs, diagrams, and project artifacts
- Official-source research, GitHub release ingestion, and optional Tavily discovery
- Evidence-constrained DeepSeek generation outside the page request path
- Owner-only signed-cookie access in production

## Reuse Architecture

Shared knowledge and private learner data are deliberately separated:

```text
Canonical topic + revision
        -> shared article family
        -> immutable article versions
        -> source snapshots and provenance

Private learner profile
        -> adaptive selection
        -> daily session and responses
        -> conservative evidence projection and delayed review
        -> fieldwork evidence
```

Article reuse keys contain the canonical topic revision, locale, level,
content schema, and pedagogy version. They never contain a user ID, repository
name, date, or private reflection. A published shared article can therefore be
used by future learners without another model call.

Every catalog topic and its curated content seed is versioned in MongoDB.
Generated articles are stored as immutable versions with source fingerprints,
content hashes, model metadata, and citation keys.
Citation records bind generated source keys to immutable source snapshot IDs.

## Research Pipeline

The protected daily cron performs this sequence:

1. Seed or revise canonical topics and source definitions.
2. Select the most valuable topic from learner evidence and career priorities.
3. Refresh authoritative documentation or GitHub release snapshots.
4. Use Tavily only for URL discovery when configured.
5. Build a bounded evidence set from trusted source hosts.
6. Reuse the current article or generate a new version with DeepSeek.
7. Validate the structured response and publish an immutable article version.
8. Promote an unopened daily session to the improved version.

Page requests never invoke an AI provider. If research or DeepSeek is
unavailable, the curated lesson remains fully usable.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` for the portfolio and
`http://localhost:3000/learning` for the learning workspace. Authentication is
bypassed in development when its secrets are absent. MongoDB is required for
cross-device progress, article reuse, research snapshots, and history; without
it the daily session runs in read-only preview mode.

## Environment

Required for the complete production workspace:

- `MONGODB_URI`
- `LEARNING_ACCESS_KEY`
- `LEARNING_SESSION_SECRET`
- `CRON_SECRET`

Optional integrations:

- `DEEPSEEK_API_KEY`, `DEEPSEEK_API_URL`, `DEEPSEEK_MODEL`
- `TAVILY_API_KEY`
- `GITHUB_TOKEN`
- `EMAIL_USER`, `EMAIL_PASS`
- `LEARNING_NOTIFICATION_EMAIL`

Set `LEARNING_AUTH_DISABLED=true` if you wish to bypass authentication and access the workspace directly.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs all four checks on pull requests and pushes to `main`.

## Deployment

The application targets Vercel. `vercel.json` schedules the research and
generation endpoint at 05:00 UTC. Vercel sends `CRON_SECRET` as a bearer token
when the same value is configured in the project environment.
