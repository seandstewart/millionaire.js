# ADR 010: Inline SVG and CSS-Generated Graphics

**Status:** Accepted

**Context:** 2D retro aesthetic; no 3D models or complex sprites. Canvas/WebGL unnecessary.

**Decision:** Use inline SVG for icons (logo, lifelines) and CSS-styled elements for money ladder and buttons. No Canvas or WebGL.

**Consequences:**
- Positive: DOM-native; styleable with CSS; no additional rendering contexts.
- Negative: Not suitable if pivoting to pixel-art sprite animations.
