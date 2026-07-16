# ADR 002: Vanilla JavaScript (ES6+)

**Status:** Accepted

**Context:** Frameworks like React/Vue offer component state management but add dependency overhead and bundle bloat.

**Decision:** Use Vanilla JavaScript for MVP. React documented as alternative only if lifeline complexity justifies it later.

**Consequences:**
- Positive: Bundle ~zero; no dependency debt; meets <200 KB target.
- Negative: Manual DOM updates and state management; no framework conventions.
