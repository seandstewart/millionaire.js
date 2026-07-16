# ADR 003: Finite State Machine for Game Loop

**Status:** Accepted

**Context:** Game has strict sequential phases with clear entry/exit conditions. Ad-hoc state flags cause inconsistent UI and race conditions.

**Decision:** Govern game loop with FSM. States: `IDLE → DISPLAY_QUESTION → LIFELINE → LOCK_IN → REVEAL → UPDATE_LADDER → {NEXT_QUESTION | GAME_OVER | WIN}`.

**Consequences:**
- Positive: UI is function of state; deterministic transitions prevent invalid actions.
- Negative: All state changes route through FSM; minor boilerplate for transitions.
