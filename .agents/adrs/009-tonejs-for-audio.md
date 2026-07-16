# ADR 009: Tone.js for Audio

**Status:** Accepted

**Context:** Game needs retro chiptune SFX. Hosting external audio files adds asset management and bandwidth overhead.

**Decision:** Use Tone.js to synthesize audio programmatically. Rejected direct Web Audio API due to higher boilerplate.

**Consequences:**
- Positive: No external audio files; procedural generation fits retro aesthetic.
- Negative: Adds runtime dependency; audio context must initialize on user interaction per autoplay policy.
