# ADR 005: In-Memory Session State

**Status:** Accepted

**Context:** No requirement for cross-session persistence, leaderboards, or user accounts in MVP.

**Decision:** Track game session (current winnings, lifeline usage flags, question index) in a plain JavaScript object held in memory.

**Consequences:**
- Positive: Simple; no storage APIs or backend sessions needed.
- Negative: State lost on refresh or tab close; no replayability of past sessions.
