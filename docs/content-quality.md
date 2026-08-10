# Learning Content Quality Standard

## Editorial Goal

Every lesson must leave the learner with a new decision lens, not just a new
term. A lesson is publishable only when the learner can use it to explain a
failure, distinguish alternatives, and transfer the decision to another
project.

## Required Lesson Sequence

1. Retrieval before explanation
2. A concrete failure or ambiguous decision
3. A prediction made before seeing the answer
4. A causal mental model
5. A worked example with decision points
6. A comparison with nearby alternatives
7. A micro-lab that produces evidence
8. A transfer prompt in a different context
9. Reflection and delayed review

The quick mode may reduce scope, but it cannot remove retrieval, prediction,
and evidence. The deep mode must ask for an artifact link or a detailed plan;
neither is called verified until a separate assessment checks it.

## Writing Rules

- Start with the engineering consequence, not a dictionary definition.
- Define an English technical term in plain Turkish on first use.
- Keep one main learning objective per session.
- Separate durable principles from version-specific current information.
- Explain mechanism, boundary, and trade-off before giving a recommendation.
- Prefer timelines, state diagrams, decision tables, and annotated examples to decorative images.
- Do not claim that a pattern is universally best.
- State when the simpler direct solution is preferable.
- Do not repeat the same generic security, testing, or abstraction paragraph across topics.
- Never invent a source, benchmark, API behavior, or production result.

## Pattern Standard

A design-pattern lesson must answer all of these:

- Which change or failure axis does the pattern isolate?
- What is the smallest situation where it earns its complexity?
- Which simpler solution should be tried first?
- Which nearby pattern is commonly confused with it?
- Where does selection, composition, or orchestration still live?
- How can a test demonstrate the value rather than merely cover classes?
- How does the pattern appear in at least two different projects?

This prevents pattern-name memorization and architecture astronautics.

## Current Information Policy

Current news can become a lesson only when it includes:

- A primary source and publication date
- A clear connection to the learner's stack, project, or durable concept
- The affected version or scope when relevant
- The lasting engineering principle beneath the event
- A prediction, lab, or migration decision
- An explicit validity date

Security advisories and breaking changes may be shown as operational alerts.
General trend content remains optional discovery and cannot displace due review
or a high-value foundation by popularity alone.

## Source Policy

- Primary documentation and vendor advisories are preferred.
- Strong secondary sources may explain patterns and trade-offs.
- Social and trend sources are discovery-only.
- Every factual section references only registered source keys.
- Source snapshots preserve title, URL, authority, date, excerpt, and content hash.
- Unsupported claims are removed rather than softened with confident language.

## Publish Gate

Score each dimension from 0 to 2:

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Relevance | Generic | Related to role | Connected to active project/career gap |
| Mental model | Definition only | Mechanism present | Mechanism, boundary, and failure chain |
| Alternatives | One prescription | Alternative named | Decision criteria and trade-offs |
| Evidence | No source | General links | Claim-linked authoritative evidence |
| Activity | Passive reading | Recall question | Prediction, lab, and transfer |
| Accuracy | Unsupported | Mostly grounded | Versioned and fully grounded |
| Reuse | Personalized core | Partially reusable | User-independent canonical article |
| Clarity | Long AI prose | Understandable | Progressive, precise, visually supported |

A normal article requires at least 13/16. Security and financial topics require
15/16 and must not contain unsupported factual claims.

## Product Quality Review

At every milestone ask:

1. Does this improve durable knowledge or only engagement?
2. Does it help the learner make a better engineering decision?
3. Is the selected topic demonstrably relevant to full-stack growth?
4. Does a pattern lesson include its cost and simpler alternative?
5. Can the learner produce evidence rather than click complete?
6. Can the shared content be reused without private context or new tokens?
7. Are current claims source-linked and time-bounded?
8. Does the interface reduce attention cost instead of adding dashboard noise?
