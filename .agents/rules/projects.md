# Rules for Projects

Rules for creating and maintaining project folders. Follow current implementation pattern.

## Structure

Each project exists in a versioned folder: `projects/v1/`, `projects/v2/`, etc.

Each project folder contains:

```
projects/v1/
  ├── index.md      (project metadata and overview)
  ├── proposal.md   (scope, tech stack, milestones, timeline)
  └── design.md     (UI specs, color system, schemas, assets)
```

## Files

### `index.md` — Metadata & Overview

Header with project status and current milestone:

```markdown
# Project [vN]: "[Title]"

**Status:** [Proposed | Accepted | In Progress | Completed]
**Current Milestone**: [MN]

> Valid statuses: Proposed → Accepted → In Progress → Completed
```

Followed by an index table:

```markdown
## Index

| Document | Purpose |
|----------|---------|
| [proposal.md](./proposal.md) | Project scope, tech stack, milestones, timeline |
| [design.md](./design.md) | UI specs, color system, typography, JSON schemas, asset inventory |
```

### `proposal.md` — Scope & Strategy

Complete project definition:

1. **Executive Summary** — 1–2 paragraphs. What is this project? What problem does it solve?
2. **Scope & Core Requirements** — Table of key features and their specs.
3. **Recommended Technical Stack** — Table with Layer, Recommendation, Rationale. Link to relevant ADRs.
4. **Architecture Overview** — High-level design, state flows, key patterns. Reference ADRs explicitly.
5. **Key Milestones & Deliverables** — Table with Milestone, Duration, Deliverable.
6. **Asset List** — Table of visual/audio/code assets needed (SVG, CSS, Tone.js, etc.).
7. **Risk Factors & Mitigation** — Table identifying risks and mitigation strategies. Link to ADRs.
8. **Success Criteria** — Bulleted list of measurable outcomes (performance, completeness, compatibility).

### `design.md` — UI & Technical Specs

Design and implementation specifications:

- **Color Palette** — Hex codes, variable names (CSS custom properties), usage.
- **Typography** — Font families, sizes, weights, line-height defaults.
- **Layout & Responsive Breakpoints** — Desktop, tablet, mobile breakpoints and grid specs.
- **UI Components** — Buttons, cards, forms, etc. Include states (default, hover, active, disabled).
- **Game States & Screens** — One section per major UI screen or game state. List content, interactions, transitions.
- **JSON Schemas** — Documented structure for data (e.g., question bank format).
- **Asset Inventory** — Catalog of all SVG, CSS graphics, icons, audio, etc. Include source/storage location.

## Linking ADRs

Proposal must link to **all relevant ADRs**. Use section header or inline within tables/text:

```markdown
**Key Architecture Decisions:** [ADR-001: SPA](../adrs/001-single-page-application.md) | [ADR-003: FSM](../adrs/003-finite-state-machine.md) | ...
```

When describing a choice, include ADR reference:

```markdown
**Framework** | Vanilla JavaScript ([ADR-002](../adrs/002-vanilla-javascript.md)) | Avoids dependency debt
```

## Milestone Conventions

Milestones use uppercase shorthand: `M1`, `M2`, ..., `M6`.

Each milestone should specify:
- **Duration**: Estimated days or weeks.
- **Deliverable**: What is completed and demonstrated at the end.

Total project timeline should be provided.

## Status Progression

Projects follow this progression:

1. **Proposed** — Idea phase. Proposal drafted but not greenlit.
2. **Accepted** — Design approved, ready to start.
3. **In Progress** — Active development. Update `Current Milestone` field as work advances.
4. **Completed** — All milestones delivered, shipped.

When status changes, update the `index.md` header.

## Naming & Location

- Folder name: `projects/v[N]/` (where N is integer: 1, 2, 3, ...).
- Use version numbers to track major iterations or resets.
- Within version, docs evolve without renaming.

## Cross-References

- Projects reference **ADRs** for architectural rationale.
- Projects can reference **other projects** (e.g., "v2 extends v1") using relative links.
- External docs (wikis, design tools) linked by full URL if not co-located.
