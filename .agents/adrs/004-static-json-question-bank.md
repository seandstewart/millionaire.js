# ADR 004: Static JSON Question Bank

**Status:** Accepted

**Context:** MVP has no user accounts, no dynamic content generation, and no licensing for a live API.

**Decision:** Store the question bank in a static JSON file loaded at runtime. No backend server for MVP.

**Consequences:**
- Positive: Zero backend cost/infrastructure; trivial to deploy; fast loading.
- Negative: Content is hardcoded; requires redeploy to update questions. Licensed API or curated bank is a future replacement.
