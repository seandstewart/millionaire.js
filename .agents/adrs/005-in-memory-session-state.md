# ADR 005: In-Memory Session State

**Status:** Accepted

**Context:** No cross-session persistence, leaderboards, or user accounts needed in MVP.

**Decision:** Track session (current winnings, lifeline usage flags, question index) in plain JavaScript object in memory.

**Consequences:**
- Positive: Simple; no storage APIs or backend sessions.
- Negative: State lost on refresh/close; no past session replay.
