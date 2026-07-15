# Agent Guidelines

Rules and context for code agents working on this project.

## Architecture Decisions

All structural choices are documented in **[.agents/adrs/](./agents/adrs/)**. Before proposing changes to:

- Framework, build tool, or language choice
- State management pattern
- Audio/animation approach
- Data model

**Read the relevant ADR first.** It explains the decision, consequences, and trade-offs. Respect accepted decisions; propose new ADRs only for genuinely new choices.

## Project Context

**Active Project**: [v1 — "Who Wants to Be a Moy-onaire"](./agents/projects/v1/)

- **Status**: In Progress (see current milestone in `index.md`)
- **Tech Stack**: Vanilla JS, CSS3, Vite, Tone.js
- **Scope**: Single-page browser game, no backend, JSON question bank
- **Key Files**: `src/`, `public/`, game engine + state machine

See `.agents/projects/v1/proposal.md` for full scope, milestones, and success criteria.

## Code Style & Conventions

- **JavaScript**: ES6+ modules, pure functions where possible (especially lifeline logic)
- **CSS**: Plain CSS3 with custom properties (no preprocessor)
- **State**: Finite State Machine for game loop (see ADR-003)
- **Naming**: Slug-based identifiers for questions (see ADR-006)
- **Performance**: Keep DOM nodes low, use CSS transforms for animation (see ADR-016)

## When to Update Documentation

After significant changes:

1. **Architecture change** → New ADR (with Status, Context, Decision, Consequences)
2. **Design/spec update** → Update `.agents/projects/v1/design.md`
3. **Milestone progress** → Update `Current Milestone` in `.agents/projects/v1/index.md`

Document **decisions**, not implementation details.

## Rules Files

- **[.agents/rules/adrs.md](./agents/rules/adrs.md)** — ADR format, numbering, index maintenance
- **[.agents/rules/projects.md](./agents/rules/projects.md)** — Project folder structure, proposal sections, cross-linking

Refer to these when creating or updating architecture docs.
