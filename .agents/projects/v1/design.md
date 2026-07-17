# Who Wants to Be a Moy-llionaire — Design Plan

**Architecture Decisions:** [ADR-007: Plain CSS3 with Custom Properties](../../../adrs/007-plain-css3.md) | [ADR-008: CSS Transitions and Keyframes](../../../adrs/008-css-animations.md) | [ADR-010: Inline SVG and CSS-Generated Graphics](../../../adrs/010-inline-svg-and-css-graphics.md) | [ADR-015: Custom Title and Assets](../../../adrs/015-custom-title-assets.md) | [ADR-016: Mobile Performance Budget](../../../adrs/016-mobile-performance-budget.md)

## 1. Color System

| Token | Hex | Usage |
| --- | --- | --- |
| `--bg-deep` | `#0a0014` | Primary background, near-black purple |
| `--bg-panel` | `#1a0b2e` | Card/panel surfaces |
| `--accent-gold` | `#ffcc00` | Highlights, current money tier, correct answer flash |
| `--accent-blue` | `#0044ff` | Active buttons, lifeline icons |
| `--accent-danger` | `#cc0000` | Wrong answer, game over states |
| `--text-primary` | `#f0e6ff` | Headings, questions |
| `--text-secondary` | `#a080c0` | Labels, inactive money tiers |
| `--border-glow` | `#ffcc0040` | Subtle gold glow on focused elements |

## 2. Typography

| Role | Font | Weight | Size |
| --- | --- | --- | --- |
| Title | `Press Start 2P` (Google Fonts) | 400 | 24px / 36px desktop |
| Questions | `VT323` (Google Fonts) | 400 | 28px |
| Answers | `VT323` | 400 | 22px |
| Money Ladder | `VT323` | 400 | 18px |
| UI Labels | `VT323` | 400 | 16px |

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```

## 3. Screen Specifications

### Screen A: Title / Intro
- **Background:** `--bg-deep` with faint starfield CSS pattern (radial gradients)
- **Center block:** Logo "MOY-LLIONAIRE" in `--accent-gold`, `Press Start 2P`, with slight text-shadow glow
- **Subtitle:** "Who Wants to Be a Moy-llionaire" in `--text-secondary`
- **CTA:** Single centered button "START GAME" in `--accent-blue`, 200px wide
- **Footer:** Three lifeline icons greyed out at 40% opacity (hints at game mechanics)

### Screen B: Name Entry
- **Panel:** Centered 400px wide, `--bg-panel`, 2px `--border-glow` border
- **Label:** "ENTER YOUR NAME"
- **Input:** Monospace, `--bg-deep`, `--text-primary`, 1px `--accent-blue` border
- **Button:** "CONTINUE" below input

### Screen C: Gameplay (Main Screen)
- **Layout:** CSS Grid, 12 columns
  - Left 3 cols: Money ladder (vertical list, 15 tiers)
  - Center 9 cols: Question + answers
- **Top bar:** Lifeline icons (3 circles, 48px each) — active if unused, strikethrough/dimmed if used
- **Question box:** Full width of center, `--bg-panel`, 2px border, padding 24px, `--text-primary`
- **Answer grid:** 2x2 grid below question
  - Each button: `--bg-panel`, 1px `--accent-blue` border, `--text-primary` text
  - Hover: border brightens to `--accent-gold`
  - Selected: background shifts to `--accent-blue` at 20% opacity
- **Walk Away button:** Bottom right, small, `--text-secondary` text

### Screen D: Lifeline — 50/50
- No overlay. Two incorrect answers immediately grey out (`--text-secondary`, disabled state) with a 0.3s CSS transition.

### Screen E: Lifeline — Ask the Audience
- **Overlay:** Fullscreen semi-transparent `--bg-deep` at 90% opacity
- **Center panel:** 500px wide, bar chart of 4 vertical bars
- **Data:** Bars animate height over 1s; correct answer bar weighted higher (e.g., 60-70%)
- **Dismiss:** Click anywhere or 3s auto-dismiss

### Screen F: Lifeline — Phone a Friend
- **Overlay:** Same backdrop
- **Panel:** Shows "CALLING..." with blinking dots (CSS animation) for 2s
- **Then:** Speech bubble appears with text in `VT323`: "I think it's... [letter]. I'm [X]% sure." — confidence and answer are randomized but weighted toward correct.

### Screen G: Answer Lock-In
- Selected answer flashes `--accent-gold` to `--bg-deep` alternately for 1.5s (heartbeat)
- **Then:** If correct, solid `--accent-gold` flash, chime
- **Then:** If wrong, solid `--accent-danger` flash, buzz

### Screen H: Milestone Safe Haven
- Overlay banner: "SAFE HAVEN REACHED" in `--accent-gold`
- Displays minimum guaranteed winnings
- Auto-dismiss after 2s

### Screen I: Game Over / Win
- **Background:** `--bg-deep`
- **Center text:** "GAME OVER" or "YOU ARE A MOY-LLIONAIRE" in `Press Start 2P`
- **Below:** Final winnings amount in large `--accent-gold`
- **Buttons:** "PLAY AGAIN" (primary) / "MAIN MENU" (secondary)

## 4. CSS Design Tokens

Per [ADR-007](../../../adrs/007-plain-css3.md), use CSS custom properties for all theme values:

```css
:root {
  --bg-deep: #0a0014;
  --bg-panel: #1a0b2e;
  --accent-gold: #ffcc00;
  --accent-blue: #0044ff;
  --accent-danger: #cc0000;
  --text-primary: #f0e6ff;
  --text-secondary: #a080c0;
  --border-glow: #ffcc0040;
  --font-title: 'Press Start 2P', cursive;
  --font-body: 'VT323', monospace;
  --radius: 4px;
  --transition-fast: 0.15s ease;
  --transition-medium: 0.3s ease;
}
```

## 5. JSON Schemas

Per [ADR-004: Static JSON Question Bank](../../../adrs/004-static-json-question-bank.md) and [ADR-006: Slug-Based Data Model](../../../adrs/006-slug-based-data-model.md):

### Question Bank Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
          "difficulty": { "type": "integer", "minimum": 1, "maximum": 15 },
          "question": { "type": "string", "maxLength": 200 },
          "options": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
                "text": { "type": "string", "maxLength": 100 }
              },
              "required": ["slug", "text"]
            },
            "minItems": 4,
            "maxItems": 4
          },
          "correctOptionSlug": {
            "type": "string",
            "description": "Must match the slug of one option in this question's options array"
          }
        },
        "required": ["slug", "difficulty", "question", "options", "correctOptionSlug"]
      }
    }
  },
  "required": ["questions"]
}
```

### Money Ladder Schema

```json
{
  "ladder": [
    { "level": 1, "amount": 100, "safeHaven": false },
    { "level": 2, "amount": 200, "safeHaven": false },
    { "level": 3, "amount": 300, "safeHaven": false },
    { "level": 4, "amount": 500, "safeHaven": false },
    { "level": 5, "amount": 1000, "safeHaven": true },
    { "level": 6, "amount": 2000, "safeHaven": false },
    { "level": 7, "amount": 4000, "safeHaven": false },
    { "level": 8, "amount": 8000, "safeHaven": false },
    { "level": 9, "amount": 16000, "safeHaven": false },
    { "level": 10, "amount": 32000, "safeHaven": true },
    { "level": 11, "amount": 64000, "safeHaven": false },
    { "level": 12, "amount": 125000, "safeHaven": false },
    { "level": 13, "amount": 250000, "safeHaven": false },
    { "level": 14, "amount": 500000, "safeHaven": false },
    { "level": 15, "amount": 1000000, "safeHaven": true }
  ]
}
```

## 6. Sample Data (Partial Question Bank)

```json
{
  "questions": [
    {
      "slug": "red-planet",
      "difficulty": 1,
      "question": "Which planet is known as the Red Planet?",
      "options": [
        { "slug": "venus", "text": "Venus" },
        { "slug": "mars", "text": "Mars" },
        { "slug": "jupiter", "text": "Jupiter" },
        { "slug": "saturn", "text": "Saturn" }
      ],
      "correctOptionSlug": "mars"
    },
    {
      "slug": "http-meaning",
      "difficulty": 2,
      "question": "What does 'HTTP' stand for?",
      "options": [
        { "slug": "hypertext-transfer-protocol", "text": "HyperText Transfer Protocol" },
        { "slug": "high-tech-transfer-process", "text": "High Tech Transfer Process" },
        { "slug": "home-tool-transfer-protocol", "text": "Home Tool Transfer Protocol" },
        { "slug": "hypertext-transmission-program", "text": "HyperText Transmission Program" }
      ],
      "correctOptionSlug": "hypertext-transfer-protocol"
    },
    {
      "slug": "au-element",
      "difficulty": 3,
      "question": "Which element has the chemical symbol 'Au'?",
      "options": [
        { "slug": "silver", "text": "Silver" },
        { "slug": "aluminum", "text": "Aluminum" },
        { "slug": "gold", "text": "Gold" },
        { "slug": "argon", "text": "Argon" }
      ],
      "correctOptionSlug": "gold"
    },
    {
      "slug": "two-power-ten",
      "difficulty": 4,
      "question": "In computer science, what is 2^10?",
      "options": [
        { "slug": "256", "text": "256" },
        { "slug": "512", "text": "512" },
        { "slug": "1024", "text": "1024" },
        { "slug": "2048", "text": "2048" }
      ],
      "correctOptionSlug": "1024"
    },
    {
      "slug": "eich-1995",
      "difficulty": 5,
      "question": "Which programming language was created by Brendan Eich in 1995?",
      "options": [
        { "slug": "python", "text": "Python" },
        { "slug": "java", "text": "Java" },
        { "slug": "javascript", "text": "JavaScript" },
        { "slug": "cpp", "text": "C++" }
      ],
      "correctOptionSlug": "javascript"
    },
    {
      "slug": "binary-search-complexity",
      "difficulty": 6,
      "question": "What is the time complexity of binary search in the worst case?",
      "options": [
        { "slug": "on", "text": "O(n)" },
        { "slug": "ologn", "text": "O(log n)" },
        { "slug": "onlogn", "text": "O(n log n)" },
        { "slug": "onsquared", "text": "O(n^2)" }
      ],
      "correctOptionSlug": "ologn"
    }
  ]
}
```

## 7. Slug Rules

- Format: `kebab-case`, lowercase letters, digits, hyphens only
- Question slugs: unique across the entire question bank
- Option slugs: unique within the parent question; may collide across different questions
- `correctOptionSlug` must reference an existing option slug in the same question object

## 8. Asset Inventory

Per [ADR-010: Inline SVG and CSS-Generated Graphics](../../../adrs/010-inline-svg-and-css-graphics.md) and [ADR-015: Custom Title and Assets](../../../adrs/015-custom-title-assets.md):

| Asset | Source | Status |
| --- | --- | --- |
| Starfield background | CSS `radial-gradient` (no image) | Specified |
| Logo text | HTML + `Press Start 2P` font | No graphic asset needed |
| Lifeline icons | Inline SVG | To be created in M2 |
| Money tree | CSS-styled ordered list | To be implemented in M2 |
| UI sounds | Tone.js synthesizer | No external files needed |
