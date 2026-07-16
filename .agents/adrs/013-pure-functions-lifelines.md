# ADR 013: Pure Functions for Lifeline Logic

**Status:** Accepted

**Context:** Lifelines (50:50, Ask the Audience, Phone a Friend) modify or derive data from current question state.

**Decision:** Implement lifeline logic as pure functions accepting current question state and returning mutated/derived state. No side effects.

**Consequences:**
- Positive: Deterministic; testable; easy to reset per session.
- Negative: Requires careful state immutability discipline in Vanilla JS.
