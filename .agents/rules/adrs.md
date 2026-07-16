# Rules for Architecture Decision Records

Rules for creating and maintaining ADRs. Follow current implementation pattern.

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
| **Context** | Yes | Explain problem/constraint. 1–3 sentences. |
| **Decision** | Yes | State what was chosen and why. 1–2 sentences. |
| **Consequences** | Yes | Bulleted lists. At least one positive AND one negative. |

## Scope

ADRs document **architectural and technical choices** affecting design, not sprint tasks or implementation details.

**Appropriate for ADR:**
- Framework choice (Vanilla JS vs. React)
- State management pattern (FSM vs. Redux)
- Audio library (Tone.js vs. Web Audio API)
- Data model (JSON flat file vs. API)

**Not appropriate:**
- "Fix bug in button handler" (implementation)
- "Add help text to Q3" (content)
- "Refactor CSS into modules" (local refactor)

## Index Maintenance

The `index.md` file lists all ADRs in a table:

```markdown
| # | Title | Status |
|---|-------|--------|
| [001](./001-file.md) | Title | Accepted |
```

When adding ADR:
1. Create `NNN-kebab-case-title.md`.
2. Add row to index table.
3. Use relative links to .md file.

## References

ADRs referenced from other documents using relative links:

```markdown
[ADR-001: Single Page Application](../adrs/001-single-page-application.md)
```

When deprecated/superseded, add note and link:

```markdown
**Status:** Deprecated

**Superseded by:** [ADR-007](./007-plain-css3.md)
```
