# ADR 010: Inline SVG and CSS-Generated Graphics

**Status:** Accepted

**Context:** 2D retro aesthetic; no 3D models or complex sprites. Canvas/WebGL is unnecessary complexity.

**Decision:** Use inline SVG for icons (logo, lifelines) and CSS-styled elements for the money ladder and buttons. No Canvas or WebGL.

**Consequences:**
- Positive: DOM-native; styleable with CSS; no additional rendering contexts.
- Negative: Not suitable if later pivoting to pixel-art sprite animations.
