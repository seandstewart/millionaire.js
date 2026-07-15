# ADR 013: Pure Functions for Lifeline Logic

**Status:** Accepted

**Context:** Lifelines (50:50, Ask the Audience, Phone a Friend) modify or derive data from the current question state.

**Decision:** Implement lifeline logic as pure functions that accept the current question state and return mutated/derived state. No side effects.

**Consequences:**
- Positive: Deterministic; testable; easy to reset per session.
- Negative: Requires careful state immutability discipline in Vanilla JS.
