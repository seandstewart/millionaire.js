# Rules for Architecture Decision Records

Rules for creating and maintaining ADRs in this project. Follow current implementation pattern.

## Format

Each ADR file follows this structure:

```markdown
# ADR NNN: [Decision Title]

**Status:** [Proposed | Accepted | Deprecated]

**Context:** [What is the issue/problem driving this decision?]

**Decision:** [What is the chosen approach?]

**Consequences:**
- Positive: [Benefits of this choice]
- Negative: [Trade-offs or drawbacks]
```

## Numbering & Naming

- Sequential numeric prefix with leading zeros: `001`, `002`, ..., `016`.
- Filename: `NNN-kebab-case-title.md`.
- Title mirrors filename: `# ADR NNN: Title Case`.

## Sections

| Section | Required | Notes |
|---------|----------|-------|
| **Status** | Yes | One of: Proposed, Accepted, Deprecated |
| **Context** | Yes | Explain the problem/constraint driving the decision. 1–3 sentences. |
| **Decision** | Yes | State what was chosen and why (briefly). 1–2 sentences. |
| **Consequences** | Yes | Bulleted lists. At least one positive AND one negative consequence. |

## Scope

ADRs document **architectural and technical choices** affecting the design, not sprint tasks or implementation details. Examples:

**Appropriate for ADR:**
- Framework choice (Vanilla JS vs. React)
- State management pattern (FSM vs. Redux)
- Audio library (Tone.js vs. Web Audio API)
- Data model (JSON flat file vs. API)

**Not appropriate:**
- "Fix bug in button handler" (implementation)
- "Add help text to Q3" (content, not architecture)
- "Refactor CSS into modules" (local refactor, no long-term impact)

## Index Maintenance

The `index.md` file lists all ADRs in a table:

```markdown
| # | Title | Status |
|---|-------|--------|
| [001](./001-file.md) | Title | Accepted |
```

When adding a new ADR:
1. Create `NNN-kebab-case-title.md`.
2. Add a row to the index table.
3. Use relative links to the .md file.

## References

ADRs are referenced from other documents (e.g., proposal.md) using relative links:

```markdown
[ADR-001: Single Page Application](../adrs/001-single-page-application.md)
```

When an ADR is deprecated or superseded, add a note and link to the replacement:

```markdown
**Status:** Deprecated

**Superseded by:** [ADR-007](./007-plain-css3.md)
```
