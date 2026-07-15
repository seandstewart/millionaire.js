# Who Wants to Be a Moy-onaire

Browser-based trivia game replicating the classic TV format. Playable on desktop and mobile, no backend required.

## Quick Start

```bash
npm install
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
```

## Stack

- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: Plain CSS3 + custom properties
- **Animation**: CSS transitions & keyframes
- **Audio**: Tone.js (synthesized chiptune SFX)
- **Build**: Vite
- **Hosting**: Netlify

## Project Structure

```
src/              Game code and assets
public/           Static files
.agents/          Architecture docs, ADRs, project specs
```

## Documentation

- **[.agents/adrs/](./agents/adrs/)** — Architecture Decision Records (16 decisions)
- **[.agents/projects/v1/](./agents/projects/v1/)** — Project proposal, design, milestones
- **[.agents/rules/](./agents/rules/)** — Guidelines for ADRs and projects

## Game Features

- **15-question flow** with progressive difficulty
- **Lifelines**: 50:50, Ask the Audience, Phone a Friend
- **Money ladder** with safe-haven thresholds
- **Responsive design** for mobile and desktop
- **Chiptune audio** with lazy context initialization
- **Retro visual style** (2D flat design, high-contrast colors)

## Success Criteria

✓ Complete 15-question game flow without reload  
✓ Lifelines execute deterministically  
✓ Load time < 1s on 3G; bundle < 200 KB (excluding JSON)  
✓ Cross-browser support (Chrome, Firefox, Safari, Edge)
