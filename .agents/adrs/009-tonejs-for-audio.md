# ADR 009: Tone.js for Audio

**Status:** Accepted

**Context:** Game needs retro chiptune SFX. Hosting external audio files adds asset management and bandwidth overhead.

**Decision:** Use Tone.js to synthesize audio programmatically. Rejected direct Web Audio API usage due to higher boilerplate.

**Consequences:**
- Positive: No external audio files to host; procedural generation fits retro aesthetic.
- Negative: Adds a runtime dependency; audio context must be initialized on user interaction per browser autoplay policy.
