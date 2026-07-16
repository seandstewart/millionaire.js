# ADR 014: Lazy Audio Context Initialization

**Status:** Accepted

**Context:** Modern browsers block AudioContext autoplay until user gesture detected.

**Decision:** Initialize audio context (and Tone.js) only after first user click or tap.

**Consequences:**
- Positive: Complies with browser autoplay policies; avoids console errors.
- Negative: No audio during initial title screen until interaction.
