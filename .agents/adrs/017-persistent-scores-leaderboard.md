# ADR 017: Persistent Scores & Local Leaderboard

**Status:** Proposed

**Context:** 
Current state (ADR-005) stores session in memory. Scores lost on refresh. No way to review past performance or share results with context (score, questions reached, lifelines used). Players want retention mechanics and bragging rights.

**Decision:** 
Store game sessions in browser `localStorage` as JSON array. Each session object: `{ id, timestamp, playerName, finalScore, questionsReached, lifelinesUsed, difficulty }`. Leaderboard displays top 10 local scores. Share button generates text+emoji snapshot (e.g., "🎬 Reached Q12 for $1M! 📺 Beat me?").

**Consequences:**

*Positive:*
- Improved retention—players see history, motivation to beat personal best.
- Zero backend; no cross-device sync needed (user asks for local-only).
- Social share low friction—copy emoji+text to clipboard or paste to social.
- localStorage ~5–10 MB per domain; 100 sessions ~10 KB easily fits.

*Negative:*
- Not synced across devices/browsers (user accepted).
- localStorage cleared if user clears browser data.
- Leaderboard privacy: all scores visible to anyone with browser access (acceptable for single-player casual game).
- Share format low-fidelity (text/emoji, not image card).

**Implementation Notes:**
- Persist session after game-over state transition.
- Leaderboard UI: sort by score desc, show rank + player name + score + date.
- Share: format as `"🎬 [name] | Q[num] | $[score] | [date]"`, copy to clipboard.
- Clear leaderboard: optional settings menu entry.

**Related ADRs:**
- ADR-005 (In-Memory Session State) — supersedes for local history; main session still in-memory during gameplay.
- ADR-003 (FSM) — persist on GAME_OVER state.

## State Machine Flow → Leaderboard

```mermaid
graph TD
    A["IDLE"] -->|"START clicked"| B["NAME_ENTRY"]
    B -->|"submitName()"| C["DISPLAY_QUESTION<br/>(questionIndex: 0)"]
    C -->|"selectOption()"| D["ANSWER_LOCKED"]
    D -->|"lockIn()"| E["REVEAL"]
    E -->|"correct answer<br/>+ not Q15"| C2["DISPLAY_QUESTION<br/>(questionIndex++)"<br/>currentWinnings = amount]
    E -->|"correct answer<br/>+ safe haven"| F["SAFE_HAVEN"]
    F -->|"nextQuestion()"| C2
    E -->|"WRONG"| G["GAME_OVER<br/>gameOverReason: 'wrong'<br/>currentWinnings = floorAmount"]
    C -->|"walkAway()"| H["GAME_OVER<br/>gameOverReason: 'walkaway'<br/>currentWinnings = walkAwayAmount"]
    D -->|"walkAway()"| H
    C -->|"all 15 correct"| I["WIN<br/>gameOverReason: null"]
    G -->|"⭐ LEADERBOARD ENTRY"| J["Capture snapshot:<br/>playerName<br/>currentWinnings<br/>questionIndex<br/>gameOverReason"]
    I -->|"⭐ LEADERBOARD ENTRY"| J
    J --> K["Save to Leaderboard"]
    G -->|"PLAY AGAIN"| A2["reset() → IDLE"]
    I -->|"PLAY AGAIN"| A2
    style G fill:#ffcccc
    style I fill:#ccffcc
    style J fill:#ffffcc,stroke:#ff9900,stroke-width:3px
    style K fill:#ffff99,stroke:#ff9900,stroke-width:3px
```

---

## Session Object Lifecycle

```mermaid
graph LR
    A["new GameEngine()"] --> B["_session = null"]
    B -->|"start()"| C["_session = {<br/>state: NAME_ENTRY<br/>}"]
    C -->|"submitName(playerName)"| D["_session = {<br/>state: DISPLAY_QUESTION<br/>playerName: 'Alice'<br/>questionIndex: 0<br/>currentWinnings: 0<br/>floorAmount: 0<br/>gameOverReason: null<br/>}"]
    D -->|"game progresses"| E["_session = {<br/>state: REVEAL<br/>questionIndex: 3<br/>currentWinnings: $1000<br/>floorAmount: $500<br/>gameOverReason: null<br/>}"]
    E -->|"wrong or walkaway"| F["_session = {<br/>state: GAME_OVER<br/>questionIndex: 3<br/>currentWinnings: $500<br/>gameOverReason: 'wrong'<br/>}"]
    F -->|"reset()"| B
    style D fill:#e1f5ff
    style E fill:#fff3e0
    style F fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

---

## Snapshot Flow (for UI & Leaderboard)

```mermaid
graph TD
    A["GameEngine._session<br/>(private mutable state)"] -->|"getSnapshot()"| B["Immutable Snapshot Object"]
    B --> C["render(snapshot)<br/>(main.js)"]
    B --> D["captureGameEnd(snapshot)<br/>(new leaderboard handler)"]
    B --> E["generateShareMessage(snapshot)<br/>(shareMessage.js)"]
    C -->|"snap.state === GAME_OVER"| C1["renderGameOver(snap)<br/>Display: reason, winnings"]
    D -->|"snap.state === GAME_OVER"| D1["Extract leaderboard fields:<br/>playerName<br/>currentWinnings<br/>questionIndex<br/>gameOverReason<br/>timestamp"]
    D1 --> D2["Save to DB/localStorage"]
    style A fill:#e8eaf6
    style B fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style D fill:#ffffcc,stroke:#ff9900,stroke-width:3px
    style D1 fill:#ffff99
```
