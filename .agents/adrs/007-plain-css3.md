# ADR 007: Plain CSS3 with Custom Properties

**Status:** Accepted

**Context:** UI is 2D, retro, layout-simple. Heavy CSS frameworks (Bootstrap, Tailwind) are unnecessary overhead.

**Decision:** Use CSS3 Grid/Flexbox with CSS custom properties (variables) for theming. No external CSS framework.

**Consequences:**
- Positive: No framework CSS bloat; full control over retro styling; custom properties enable runtime theming.
- Negative: Manual responsive design; no pre-built components.
