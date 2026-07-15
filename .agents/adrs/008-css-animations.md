# ADR 008: CSS Transitions and Keyframes for Animation

**Status:** Accepted

**Context:** Mobile performance is a hard constraint (load <1s on 3G, avoid reflow). Complex animation libraries or Canvas are overkill.

**Decision:** Restrict all animations to CSS transitions and keyframes using only `transform` and `opacity`.

**Consequences:**
- Positive: GPU-composited, 60fps on mobile; no JS animation overhead.
- Negative: Limited to declarative effects; complex sequences require chained CSS classes.
