# Test Strategy Rules

Testing standards and organization for this project.

## Coverage Target

**100% coverage** across all metrics:
- Statements
- Lines
- Functions
- Branches

All defensive guard clauses and edge cases tested. Dead code removed. No untested branches.

## Test Organization

Tests organized by **source module**, not by feature or test type.

### File Structure

```
tests/
  ├── engine.test.js       # GameEngine + lifecycle tests
  ├── shareMessage.test.js # Share message generation
  ├── ladder.test.js       # Prize ladder validation
  └── questions.test.js    # Question bank loading
```

**Rule:** Each `.js` source file in `src/` has corresponding `.test.js` in `tests/`.

Test file name: `[module-name].test.js` (e.g., `engine.js` → `engine.test.js`).

### Test Placement

| Module | Tests Location | What Tests |
|--------|----------------|-----------| 
| `engine.js` | `engine.test.js` | FSM states, transitions, lifelines, answer logic, scoring, guard clauses |
| `shareMessage.js` | `shareMessage.test.js` | Message generation, formatting, emoji mapping, edge cases |
| `ladder.js` | `ladder.test.js` | Ladder structure, prize amounts, safe haven markers |
| `questions.js` | `questions.test.js` | Question loading, bank validation, format requirements |

**Never:** Mix tests from different modules. No `coverage-gaps.test.js` or generic catch-all files.

## Test Standards

### Naming & Clarity

- Describe **what is being tested**, not implementation detail.
- Avoid vague names like "test case" or "it works".

Good: `it('_reveal() returns early when state is not REVEAL')`  
Bad: `it('test guard clause')`

### Defensive Guards

Tests verify defensive guards (null checks, state validation) silently return without errors when called in invalid states.

Example:
```javascript
it('_setState() returns early when engine has no session', () => {
  expect(engine._session).toBeNull();
  engine._setState(States.DISPLAY_QUESTION);
  expect(engine._session).toBeNull();
});
```

### Edge Cases

Test boundary conditions:
- Minimum/maximum values
- Empty inputs
- Missing/undefined properties
- Invalid state transitions
- Out-of-order method calls

### Mocking & Isolation

Prefer real instances with realistic data. Mock external dependencies (Math.random for determinism, vi.spyOn for behavior verification).

Keep `mockQuestionBank` definitions close to tests that use them, or in file header if shared across suites.

## Running Tests

```bash
# Run all tests (no coverage)
npm test

# Generate coverage report
npm run coverage

# View interactive test UI
npm run test:ui
```

## Coverage Reporting

Coverage report includes:
- Text summary in terminal (statements, branches, functions, lines)
- JSON report in `coverage/coverage-final.json`
- HTML report in `coverage/index.html`

Uncovered lines appear in `Uncovered Line #s` column. Verify all 0% are either:
- Dead code that was removed, OR
- Defensive guards tested by calling in invalid state

## Adding New Tests

1. Test goes in same file as the module it tests.
2. Add `describe` block in appropriate section (or create new section for substantial feature).
3. Use existing `beforeEach` setup if applicable; create local setup if test needs custom state.
4. Run `npm run coverage` to confirm new test hits its target branch.
5. Do not merge if coverage drops below 100%.

## Refactoring Tests

When refactoring source:
1. Update tests in same file.
2. Do not move tests to different files (keep module → test mapping).
3. Run `npm run coverage` after each change to catch regressions.
4. If new branch added, add test before merge.
