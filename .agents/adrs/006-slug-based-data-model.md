# ADR 006: Slug-Based Data Model

**Status:** Accepted

**Context:** Initial schema used `correctIndex` (integer) to identify correct answer, coupling correctness to array position.

**Decision:** Replace integer indices with `kebab-case` slugs. Every question and option has `slug`; correctness determined by `correctOptionSlug` matching option `slug`.

**Consequences:**
- Positive: Decouples data from presentation order; options can shuffle without breaking validation.
- Negative: Slightly larger JSON payload; requires slug uniqueness enforcement.
