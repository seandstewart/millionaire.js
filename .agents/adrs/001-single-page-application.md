# ADR 001: Single Page Application (SPA)

**Status:** Accepted

**Context:** Game needs seamless 15-question flow. Full page reloads break pacing and state continuity.

**Decision:** Implement as SPA. All transitions (title, gameplay, lifelines, game over) occur in one document.

**Consequences:**
- Positive: No server round-trips during play; instant state transitions.
- Negative: Client-side state management requires disciplined FSM design.
