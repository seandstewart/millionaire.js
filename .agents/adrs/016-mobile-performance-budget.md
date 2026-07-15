# ADR 016: Mobile Performance Budget

**Status:** Accepted

**Context:** Success criteria mandate load time <1s on 3G and total bundle <200 KB (excluding question JSON).

**Decision:** Enforce a performance budget: keep DOM nodes low, avoid reflow-heavy animations, minimize dependencies, and audit bundle size.

**Consequences:**
- Positive: Forces disciplined, lightweight architecture; better UX on low-end devices.
- Negative: Excludes heavier libraries or rich media that would exceed the budget.
