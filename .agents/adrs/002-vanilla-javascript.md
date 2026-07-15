# ADR 002: Vanilla JavaScript (ES6+)

**Status:** Accepted

**Context:** Frameworks like React or Vue offer component-driven state management but introduce dependency overhead and bundle bloat.

**Decision:** Use Vanilla JavaScript for the MVP. React is documented as an alternative only if lifeline state complexity justifies it later.

**Consequences:**
- Positive: Bundle size near-zero; no dependency debt; meets <200 KB target.
- Negative: Manual DOM updates and state management; no framework conventions to enforce structure.
