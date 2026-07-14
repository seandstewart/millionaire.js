**Project Proposal: "Who Wants to Be a Moy-onaire"**

**1. Executive Summary**
A browser-based trivia game replicating the classic TV format under the working title *"Who Wants to Be a Moy-onaire."* The aesthetic is intentionally reduced: 2D, flat vector or pixel-art styling, high-contrast color blocks, and chiptune audio cues. No WebGL, 3D assets, or complex physics. The deliverable is a single-page application (SPA) playable on desktop and mobile browsers.

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
| **Framework** | Vanilla JavaScript (ES6+) or **React** | Vanilla keeps the bundle near-zero and avoids dependency debt. React is justified only if you prefer component-driven state management for lifeline logic. |
| **Styling** | Plain CSS3 (Grid/Flexbox) + CSS custom properties | Sufficient for 2D layouts and transitions. Avoid heavy CSS frameworks. |
| **Animation** | CSS transitions + keyframes | Use `transform` and `opacity` for the "pulse" and "highlight" effects. |
| **Audio** | Web Audio API or **Tone.js** | Tone.js simplifies synthesizing retro beeps without external audio files. |
| **Graphics** | Inline SVG or small PNG sprite sheet | For the logo, money tree, and button states. |
| **Build Tool** | **Vite** | Fast dev server, handles bundling/minification, and emits a static site. |
| **Hosting** | **Netlify** or **Vercel** | Free tier, drag-and-drop or CI/CD from GitHub. |
| **Version Control** | Git + GitHub | Required. |

---

**4. Architecture Overview**

Implement a finite state machine (FSM) governing the game loop. The UI is a function of state.

```
States: IDLE -> DISPLAY_QUESTION -> LIFELINE -> LOCK_IN -> REVEAL -> UPDATE_LADDER -> {NEXT_QUESTION | GAME_OVER | WIN}
```

- **Question Bank**: A JSON array of objects `{id, question, options[4], correctIndex, difficulty}`.
- **Lifeline Logic**: Pure functions that mutate the current question's available options (e.g., 50:50 removes two incorrect indices).
- **Session Store**: Plain JS object in memory; persists current winnings, lifeline usage flags, and question index.

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
| Logo / Title | SVG | "Moy-onaire" wordmark. |
| Money Tree | SVG/CSS | 15-tier vertical list. Highlight current tier with a retro glow. |
| UI Buttons | CSS | Rounded rectangles with `:active` and `:hover` states. |
| Lifeline Icons | SVG | 50:50, phone, audience silhouette. |
| Sound Effects | Synthesized (Tone.js) | 4–5 beeps/boops. No external file hosting needed. |

---

**7. Risk Factors & Mitigation**

| Risk | Mitigation |
| --- | --- |
| **Question content** | Use a placeholder JSON set of 50 questions for MVP; swap in a licensed API or curated bank later. |
| **Mobile performance** | Keep DOM nodes low; avoid reflow-heavy animations. |
| **Audio autoplay policy** | Initialize audio context only after the first user click/tap. |
| **Copyright proximity** | Rename lifelines if needed; the game mechanics are not copyrightable, but trade dress is. "Moy-onaire" and custom UI mitigate this. |

---

**8. Success Criteria**

- Game completes a 15-question flow without page reload.
- Lifelines execute deterministically and reset per session.
- Ladder and winnings calculate correctly including safe-haven floor logic.
- Load time < 1s on 3G; total bundle size < 200 KB (excluding question JSON).
