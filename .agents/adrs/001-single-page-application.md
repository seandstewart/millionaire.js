# ADR 001: Single Page Application (SPA)

**Status:** Accepted

**Context:** The game requires a seamless 15-question flow without interruption. Full page reloads would break pacing and state continuity.

**Decision:** Implement as a Single Page Application. All screen transitions (title, gameplay, lifelines, game over) occur within one document.

**Consequences:**
- Positive: No server round-trips during play; instant state transitions.
- Negative: All state management is client-side; requires disciplined state machine design.
