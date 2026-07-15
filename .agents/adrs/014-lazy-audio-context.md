# ADR 014: Lazy Audio Context Initialization

**Status:** Accepted

**Context:** Modern browsers block AudioContext autoplay until a user gesture is detected.

**Decision:** Initialize the audio context (and Tone.js) only after the first user click or tap.

**Consequences:**
- Positive: Complies with browser autoplay policies; avoids console errors.
- Negative: No audio during the initial title screen until interaction occurs.
