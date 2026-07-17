**Project Proposal: "Who Wants to Be a Moy-llionaire"

**Key Architecture Decisions:** [ADR-001: SPA](../../../adrs/001-single-page-application.md) | [ADR-002: Vanilla JavaScript](../../../adrs/002-vanilla-javascript.md) | [ADR-003: FSM](../../../adrs/003-finite-state-machine.md) | [ADR-004: Static JSON Questions](../../../adrs/004-static-json-question-bank.md) | [ADR-005: In-Memory State](../../../adrs/005-in-memory-session-state.md) | [ADR-006: Slug-Based Model](../../../adrs/006-slug-based-data-model.md)

**1. Executive Summary**
A browser-based trivia game replicating the classic TV format under the working title *"Who Wants to Be a Moy-llionaire."* The aesthetic is intentionally reduced: 2D, flat vector or pixel-art styling, high-contrast color blocks, and chiptune audio cues. No WebGL, 3D assets, or complex physics. The deliverable is a single-page application (SPA) playable on desktop and mobile browsers.

---

**2. Scope & Core Requirements**

| Feature | Specification |
| --- | --- |
| **Question Structure** | 15 progressive questions with a fixed money ladder. |
| **Lifelines** | 50:50, Ask the Audience, Phone a Friend. |
| **Game States** | Intro / Name Entry / Gameplay / Lifeline Active / Answer Lock / Reveal / Milestone Safe Haven / Walk Away / Game Over / Win. |
| **Visual Style** | 2D retro: dark background, high-contrast accent color (classic blue/gold), monospace or pixel font, simple CSS transitions for "tension" effects. |
| **Audio** | 8-bit/chiptune SFX for answer select, lock, reveal, win/lose. |
| **Data** | Static JSON question bank; no backend required for MVP. |
| **Platform** | Responsive web (Chrome, Firefox, Safari, Edge; mobile + desktop). |

---

**3. Recommended Technical Stack**

| Layer | Recommendation | Rationale |
| --- | --- | --- |
| **Framework** | Vanilla JavaScript (ES6+) ([ADR-002](../../../adrs/002-vanilla-javascript.md)) | Vanilla keeps the bundle near-zero and avoids dependency debt |
| **Styling** | Plain CSS3 + custom properties ([ADR-007](../../../adrs/007-plain-css3.md)) | Sufficient for 2D layouts and transitions |
| **Animation** | CSS transitions + keyframes ([ADR-008](../../../adrs/008-css-animations.md)) | Use `transform` and `opacity` for "pulse" and "highlight" effects |
| **Audio** | Tone.js ([ADR-009](../../../adrs/009-tonejs-for-audio.md)) + lazy init ([ADR-014](../../../adrs/014-lazy-audio-context.md)) | Synthesize retro beeps; initialize audio context only after user first click |
| **Graphics** | Inline SVG ([ADR-010](../../../adrs/010-inline-svg-and-css-graphics.md)), custom assets ([ADR-015](../../../adrs/015-custom-title-assets.md)) | Logo, money tree, button states; no external image files |
| **Build Tool** | **Vite** ([ADR-011](../../../adrs/011-vite-build-tool.md)) | Fast dev server, bundling, static site export |
| **Hosting** | **Netlify** or **Vercel** ([ADR-012](../../../adrs/012-netlify-vercel-hosting.md)) | Free tier, CI/CD from GitHub |
| **Version Control** | Git + GitHub | Required. |

---

**4. Architecture Overview**

Per [ADR-003](../../../adrs/003-finite-state-machine.md), implement a finite state machine (FSM) governing the game loop. UI is a function of state:

```
States: IDLE -> DISPLAY_QUESTION -> LIFELINE -> LOCK_IN -> REVEAL -> UPDATE_LADDER -> {NEXT_QUESTION | GAME_OVER | WIN}
```

- **Question Bank** ([ADR-004](../../../adrs/004-static-json-question-bank.md)): Static JSON array with slug-based keys ([ADR-006](../../../adrs/006-slug-based-data-model.md)).
- **Lifeline Logic** ([ADR-013](../../../adrs/013-pure-functions-lifelines.md)): Pure functions that filter available options (e.g., 50:50 removes two incorrect slugs).
- **Session State** ([ADR-005](../../../adrs/005-in-memory-session-state.md)): In-memory JS object; no persistence layer. Current winnings, lifeline flags, question index.

---

**5. Key Milestones & Deliverables**

| Milestone | Duration (est.) | Deliverable |
| --- | --- | --- |
| **M1: Design & Wireframe** | 3 days | Figma mockup of all screens (title, gameplay, ladder, game over). Finalized color palette and typography. JSON schema for questions. |
| **M2: Game Engine Core** | 4 days | State machine, question loading, answer validation, money ladder progression, safe-haven thresholds (e.g., Q5, Q10). |
| **M3: UI Implementation** | 5 days | All screens styled to retro spec. Responsive layout. Button interactions and lock-in flow. |
| **M4: Lifelines** | 3 days | 50:50 option removal, Ask the Audience (simulated random bar chart weighted toward correct answer), Phone a Friend (timer + simulated "friend" dialog). |
| **M5: Audio & Polish** | 3 days | Integrate chiptune SFX. Finalize animations. Add "walk away" prompt. |
| **M6: QA & Deployment** | 2 days | Cross-browser testing, mobile touch testing, bug fixes, deploy to Netlify. |

**Total estimated timeline: 2–2.5 weeks** (solo developer, part-time).

---

**6. Asset List**

| Asset | Format | Notes |
| --- | --- | --- |
| Logo / Title | SVG | "Moy-llionaire" wordmark. |
| Money Tree | SVG/CSS | 15-tier vertical list. Highlight current tier with a retro glow. |
| UI Buttons | CSS | Rounded rectangles with `:active` and `:hover` states. |
| Lifeline Icons | SVG | 50:50, phone, audience silhouette. |
| Sound Effects | Synthesized (Tone.js) | 4–5 beeps/boops. No external file hosting needed. |

---

**7. Risk Factors & Mitigation**

| Risk | Mitigation |
| --- | --- |
| **Question content** | Use placeholder JSON set of 50 questions for MVP; swap in licensed API later |
| **Mobile performance** | Keep DOM nodes low ([ADR-016](../../../adrs/016-mobile-performance-budget.md)); avoid reflow-heavy animations |
| **Audio autoplay policy** | Initialize audio context only after first user click/tap ([ADR-014](../../../adrs/014-lazy-audio-context.md)) |
| **Copyright proximity** | Custom assets and naming ([ADR-015](../../../adrs/015-custom-title-assets.md)) mitigate risk. Game mechanics are not copyrightable. |

---

**8. Success Criteria**

- Game completes a 15-question flow without page reload.
- Lifelines execute deterministically and reset per session.
- Ladder and winnings calculate correctly including safe-haven floor logic.
- Load time < 1s on 3G; total bundle size < 200 KB (excluding question JSON).
