# ADR 004: Static JSON Question Bank

**Status:** Accepted

**Context:** MVP has no accounts, no content generation, no API licensing.

**Decision:** Store question bank in static JSON file loaded at runtime. No backend server for MVP.

**Consequences:**
- Positive: Zero backend cost/infrastructure; trivial deployment; fast loading.
- Negative: Content hardcoded; redeploy required for updates. Licensed API/curated bank is future replacement.
