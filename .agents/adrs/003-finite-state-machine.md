# ADR 003: Finite State Machine for Game Loop

**Status:** Accepted

**Context:** The game has strict, sequential phases with clear entry/exit conditions. Ad-hoc state flags lead to inconsistent UI and race conditions.

**Decision:** Govern the entire game loop with a Finite State Machine. States: `IDLE → DISPLAY_QUESTION → LIFELINE → LOCK_IN → REVEAL → UPDATE_LADDER → {NEXT_QUESTION | GAME_OVER | WIN}`.

**Consequences:**
- Positive: UI is a pure function of state; deterministic transitions prevent invalid actions.
- Negative: All state changes must route through the FSM; minor boilerplate for transitions.
