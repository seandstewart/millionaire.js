# ADR 011: Vite as Build Tool

**Status:** Accepted

**Context:** Static site with ES6+ modules. Need fast dev server and efficient bundling/minification for production.

**Decision:** Use Vite for development and production builds.

**Consequences:**
- Positive: Instant HMR; minimal config; emits optimized static assets.
- Negative: Requires Node.js toolchain; team must know Vite conventions.
