# ADR 006: Slug-Based Data Model

**Status:** Accepted

**Context:** Initial schema used `correctIndex` (integer) to identify the correct answer, coupling correctness to array position.

**Decision:** Replace integer indices with `kebab-case` slugs. Every question and option has a `slug`; correctness is determined by `correctOptionSlug` matching an option's `slug`.

**Consequences:**
- Positive: Decouples data from presentation order; options can be shuffled without breaking validation.
- Negative: Slightly larger JSON payload; requires slug uniqueness enforcement.
