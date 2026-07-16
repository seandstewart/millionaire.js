# ADR 016: Mobile Performance Budget

**Status:** Accepted

**Context:** Success criteria mandate load <1s on 3G and bundle <200 KB (excluding question JSON).

**Decision:** Enforce performance budget: keep DOM nodes low, avoid reflow-heavy animations, minimize dependencies, audit bundle size.

**Consequences:**
- Positive: Forces disciplined, lightweight architecture; better UX on low-end devices.
- Negative: Excludes heavier libraries/rich media exceeding budget.
