import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine, States } from '../src/engine.js';
import { ladder } from '../src/ladder.js';

const mockQuestionBank = [
  { slug: 'q1', question: 'What is 2+2?', difficulty: 1, correctOptionSlug: 'a', options: [
    { slug: 'a', text: '4' },
    { slug: 'b', text: '5' },
    { slug: 'c', text: '3' },
    { slug: 'd', text: '6' },
  ]},
  { slug: 'q2', question: 'Capital of France?', difficulty: 2, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'Paris' },
    { slug: 'b', text: 'London' },
    { slug: 'c', text: 'Berlin' },
    { slug: 'd', text: 'Madrid' },
  ]},
  { slug: 'q3', question: 'What is 5+5?', difficulty: 3, correctOptionSlug: 'b', options: [
    { slug: 'a', text: '9' },
    { slug: 'b', text: '10' },
    { slug: 'c', text: '11' },
    { slug: 'd', text: '12' },
  ]},
  { slug: 'q4', question: 'Q4', difficulty: 4, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q5', question: 'Q5', difficulty: 5, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q6', question: 'Q6', difficulty: 6, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q7', question: 'Q7', difficulty: 7, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q8', question: 'Q8', difficulty: 8, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q9', question: 'Q9', difficulty: 9, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q10', question: 'Q10', difficulty: 10, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q11', question: 'Q11', difficulty: 11, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q12', question: 'Q12', difficulty: 12, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q13', question: 'Q13', difficulty: 13, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q14', question: 'Q14', difficulty: 14, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  { slug: 'q15', question: 'Q15', difficulty: 15, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
  // Duplicate difficulty to test byDifficulty.has() true branch (line 41)
  { slug: 'q1b', question: 'Q1 Variant', difficulty: 1, correctOptionSlug: 'a', options: [
    { slug: 'a', text: 'A' },
    { slug: 'b', text: 'B' },
    { slug: 'c', text: 'C' },
    { slug: 'd', text: 'D' },
  ]},
];

describe('GameEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new GameEngine(mockQuestionBank, ladder);
  });

  describe('States enum', () => {
    it('has correct values', () => {
      expect(States.IDLE).toBe('idle');
      expect(States.NAME_ENTRY).toBe('name_entry');
      expect(States.DISPLAY_QUESTION).toBe('display_question');
      expect(States.LIFELINE_ACTIVE).toBe('lifeline_active');
      expect(States.ANSWER_LOCKED).toBe('answer_locked');
      expect(States.REVEAL).toBe('reveal');
      expect(States.SAFE_HAVEN).toBe('safe_haven');
      expect(States.GAME_OVER).toBe('game_over');
      expect(States.WIN).toBe('win');
    });
  });

  describe('constructor', () => {
    it('initializes with questionBank and ladder', () => {
      expect(engine).toBeDefined();
      expect(engine._bank).toBe(mockQuestionBank);
      expect(engine._ladder).toBe(ladder);
    });
  });

  describe('start()', () => {
    it('sets state to NAME_ENTRY', () => {
      engine.start();
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.NAME_ENTRY);
    });
  });

  describe('submitName()', () => {
    it('throws on empty string', () => {
      expect(() => engine.submitName('')).toThrow('Invalid player name');
    });

    it('throws on whitespace-only string', () => {
      expect(() => engine.submitName('   ')).toThrow('Invalid player name');
    });

    it('throws on null', () => {
      expect(() => engine.submitName(null)).toThrow('Invalid player name');
    });

    it('throws on undefined', () => {
      expect(() => engine.submitName(undefined)).toThrow('Invalid player name');
    });

    it('throws on number', () => {
      expect(() => engine.submitName(123)).toThrow('Invalid player name');
    });

    it('accepts valid name and transitions to DISPLAY_QUESTION', () => {
      engine.submitName('Alice');
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.playerName).toBe('Alice');
    });

    it('trims whitespace from valid names', () => {
      engine.submitName('  Bob  ');
      const snapshot = engine.getSnapshot();
      expect(snapshot.playerName).toBe('Bob');
    });

    it('submitName with options.startQuestion selects starting difficulty', () => {
      engine.submitName('Charlie', { startQuestion: 5 });
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.playerName).toBe('Charlie');
      expect(snapshot.currentQuestion.difficulty).toBe(6);
    });

    it('submitName with options.lifelines makes selected lifelines available', () => {
      engine.submitName('Diana', { lifelines: ['50-50', 'ask-audience'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.playerName).toBe('Diana');
      // Selected lifelines should be available (false = available)
      expect(snapshot.lifelines['50-50']).toBe(false);
      expect(snapshot.lifelines['ask-audience']).toBe(false);
      // Unselected lifeline should be unavailable (true = unavailable)
      expect(snapshot.lifelines['phone-friend']).toBe(true);
    });

    it('submitName with no lifelines in options leaves all unavailable', () => {
      engine.submitName('Eve');
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      // No lifelines specified, all should be unavailable (true)
      expect(snapshot.lifelines['50-50']).toBe(true);
      expect(snapshot.lifelines['ask-audience']).toBe(true);
      expect(snapshot.lifelines['phone-friend']).toBe(true);
    });

    it('submitName with all lifelines selected makes all available', () => {
      engine.submitName('Frank', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['50-50']).toBe(false);
      expect(snapshot.lifelines['ask-audience']).toBe(false);
      expect(snapshot.lifelines['phone-friend']).toBe(false);
    });

    it('submitName with options combines startQuestion and lifelines', () => {
      engine.submitName('Grace', { startQuestion: 10, lifelines: ['phone-friend'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.playerName).toBe('Grace');
      expect(snapshot.currentQuestion.difficulty).toBe(11);
      expect(snapshot.lifelines['50-50']).toBe(true);
      expect(snapshot.lifelines['ask-audience']).toBe(true);
      expect(snapshot.lifelines['phone-friend']).toBe(false);
    });
  });

  describe('startGame()', () => {
    it('initializes lifelines object', () => {
      engine.startGame('Player', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['50-50']).toBe(false);
      expect(snapshot.lifelines['ask-audience']).toBe(false);
      expect(snapshot.lifelines['phone-friend']).toBe(false);
    });

    it('initializes ladder with state tracking', () => {
      engine.startGame('Player');
      const snapshot = engine.getSnapshot();
      expect(snapshot.ladder.length).toBe(15);
      expect(snapshot.ladder[0].current).toBe(true);
      expect(snapshot.ladder[0].passed).toBe(false);
    });

    it('sets state to DISPLAY_QUESTION', () => {
      engine.startGame('Player');
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
    });

    it('selects one question per difficulty', () => {
      engine.startGame('Player');
      const snapshot = engine.getSnapshot();
      expect(snapshot.currentQuestion).toBeDefined();
      expect(snapshot.currentQuestion.difficulty).toBe(1);
    });

    it('Missing question for difficulty throws error', () => {
      // Create engine with incomplete question bank (missing difficulty 3)
      const incompleteBank = mockQuestionBank.filter(q => q.difficulty !== 3);
      const incompleteEngine = new GameEngine(incompleteBank, ladder);
      // Expect error when trying to start game
      expect(() => incompleteEngine.startGame('Test')).toThrow('Missing question for difficulty 3');
    });

    it('startGame() with NO options → all lifelines unavailable (true)', () => {
      engine.startGame('Player');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines).toEqual({
        '50-50': true,
        'ask-audience': true,
        'phone-friend': true,
      });
    });

    it('startGame() with options.lifelines = [] → all lifelines unavailable (true)', () => {
      engine.startGame('Player', { lifelines: [] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines).toEqual({
        '50-50': true,
        'ask-audience': true,
        'phone-friend': true,
      });
    });

    it('startGame() with options.lifelines = ["50-50"] → 50-50 available, others unavailable', () => {
      engine.startGame('Player', { lifelines: ['50-50'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines).toEqual({
        '50-50': false,
        'ask-audience': true,
        'phone-friend': true,
      });
    });

    it('startGame() with ["50-50", "ask-audience"] → those two available, phone unavailable', () => {
      engine.startGame('Player', { lifelines: ['50-50', 'ask-audience'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines).toEqual({
        '50-50': false,
        'ask-audience': false,
        'phone-friend': true,
      });
    });

    it('startGame() with all three lifelines → all available (false)', () => {
      engine.startGame('Player', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines).toEqual({
        '50-50': false,
        'ask-audience': false,
        'phone-friend': false,
      });
    });
  });

  describe('selectOption()', () => {
    beforeEach(() => {
      engine.startGame('Player');
    });

    it('only works from DISPLAY_QUESTION state', () => {
      engine.selectOption('a');
      let snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.ANSWER_LOCKED);

      // Move to REVEAL
      engine.lockIn();
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);

      // Try to select another option - should be ignored
      engine.selectOption('b');
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);
    });

    it('sets selectedOptionSlug and moves to ANSWER_LOCKED', () => {
      engine.selectOption('a');
      const snapshot = engine.getSnapshot();
      expect(snapshot.selectedOptionSlug).toBe('a');
      expect(snapshot.state).toBe(States.ANSWER_LOCKED);
    });

    it('only accepts active options', () => {
      engine.selectOption('invalid-slug');
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.selectedOptionSlug).toBeNull();
    });

    it('allows re-selection while in ANSWER_LOCKED state', () => {
      // First selection
      engine.selectOption('a');
      let snapshot = engine.getSnapshot();
      expect(snapshot.selectedOptionSlug).toBe('a');
      expect(snapshot.state).toBe(States.ANSWER_LOCKED);

      // Change selection
      engine.selectOption('b');
      snapshot = engine.getSnapshot();
      expect(snapshot.selectedOptionSlug).toBe('b');
      expect(snapshot.state).toBe(States.ANSWER_LOCKED);
    });
  });

  describe('lockIn()', () => {
    beforeEach(() => {
      engine.startGame('Player');
      engine.selectOption('a');
    });

    it('only works from ANSWER_LOCKED state', () => {
      engine.lockIn();
      let snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);

      // Try again - should be ignored
      engine.lockIn();
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);
    });

    it('moves to REVEAL state', () => {
      engine.lockIn();
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);
    });
  });

  describe('finalizeAnswer()', () => {
    beforeEach(() => {
      engine.startGame('Player');
    });

    it('correct answer: currentWinnings matches ladder, advance to next question', () => {
      engine.selectOption('a'); // q1 correct is 'a'
      engine.lockIn();
      engine.finalizeAnswer();
      const snapshot = engine.getSnapshot();
      expect(snapshot.currentWinnings).toBe(100);
      expect(snapshot.questionIndex).toBe(1);
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
    });

    it('wrong answer: currentWinnings = floorAmount, gameOverReason = wrong', () => {
      engine.selectOption('b'); // q1 correct is 'a', selecting 'b'
      engine.lockIn();
      engine.finalizeAnswer();
      const snapshot = engine.getSnapshot();
      expect(snapshot.currentWinnings).toBe(0);
      expect(snapshot.gameOverReason).toBe('wrong');
      expect(snapshot.state).toBe(States.GAME_OVER);
    });
  });

  describe('Safe haven', () => {
    beforeEach(() => {
      engine.startGame('Player');
    });

    it('level 5 safe haven: correct answer goes to SAFE_HAVEN state, floorAmount updated', () => {
      // Manually advance through Q1-Q4 with correct answers
      for (let i = 0; i < 4; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();
      }

      // Now on question 5 (index 4), which is a safe haven
      const before = engine.getSnapshot();
      expect(before.questionIndex).toBe(4);

      // Get the correct answer for Q5
      const correctAnswer = before.correctOptionSlug;
      engine.selectOption(correctAnswer);
      engine.lockIn();
      engine.finalizeAnswer();

      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.SAFE_HAVEN);
      expect(snapshot.currentWinnings).toBe(1000);
      expect(snapshot.floorAmount).toBe(1000);
    });

    it('level 10 safe haven: correct answer goes to SAFE_HAVEN state', () => {
      // Manually advance through Q1-Q9 with correct answers
      // Handle safe havens by calling nextQuestion() when needed
      for (let i = 0; i < 9; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();

        // If we hit a safe haven, advance past it
        const afterReveal = engine.getSnapshot();
        if (afterReveal.state === States.SAFE_HAVEN) {
          engine.nextQuestion();
        }
      }

      // Now on question 10 (index 9)
      const before = engine.getSnapshot();
      expect(before.questionIndex).toBe(9);

      // Get the correct answer for Q10
      const correctAnswer = before.correctOptionSlug;
      engine.selectOption(correctAnswer);
      engine.lockIn();
      engine.finalizeAnswer();

      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.SAFE_HAVEN);
      expect(snapshot.currentWinnings).toBe(32000);
    });

    it('level 15 safe haven: correct answer goes to SAFE_HAVEN state', () => {
      // Manually advance through Q1-Q14 with correct answers
      // Handle safe havens by calling nextQuestion() when needed
      for (let i = 0; i < 14; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();

        // If we hit a safe haven, advance past it
        const afterReveal = engine.getSnapshot();
        if (afterReveal.state === States.SAFE_HAVEN) {
          engine.nextQuestion();
        }
      }

      // Now on question 15 (index 14)
      const before = engine.getSnapshot();
      expect(before.questionIndex).toBe(14);

      // Get the correct answer for Q15
      const correctAnswer = before.correctOptionSlug;
      engine.selectOption(correctAnswer);
      engine.lockIn();
      engine.finalizeAnswer();

      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.SAFE_HAVEN);
      expect(snapshot.currentWinnings).toBe(1000000);
    });

    it('Answering Q15 (final question) correctly goes to WIN state', () => {
      // Manually advance through Q1-Q14 with correct answers
      // Handle safe havens by calling nextQuestion() when needed
      for (let i = 0; i < 14; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();

        // If we hit a safe haven, advance past it
        const afterReveal = engine.getSnapshot();
        if (afterReveal.state === States.SAFE_HAVEN) {
          engine.nextQuestion();
        }
      }

      // Now on question 15 (index 14)
      const before = engine.getSnapshot();
      expect(before.questionIndex).toBe(14);

      // Get the correct answer for Q15
      const correctAnswer = before.correctOptionSlug;
      engine.selectOption(correctAnswer);
      engine.lockIn();
      engine.finalizeAnswer();

      // Q15 is a safe haven, so it should go to SAFE_HAVEN state
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.SAFE_HAVEN);
      expect(snapshot.currentWinnings).toBe(1000000);

      // Calling nextQuestion() from the final safe haven goes to WIN
      engine.nextQuestion();
      const winSnapshot = engine.getSnapshot();
      expect(winSnapshot.state).toBe(States.WIN);
    });
  });

  describe('nextQuestion()', () => {
    beforeEach(() => {
      engine.startGame('Player');
    });

    it('from SAFE_HAVEN: advances to next level', () => {
      // Answer q1-q5 correctly (level 5 is safe haven)
      for (let i = 0; i < 5; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();
      }

      expect(engine.getSnapshot().state).toBe(States.SAFE_HAVEN);
      engine.nextQuestion();
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.questionIndex).toBe(5);
    });

    it('from SAFE_HAVEN at level 15: goes to WIN state', () => {
      // Answer q1-q15 correctly
      // Handle safe havens by calling nextQuestion() when needed
      for (let i = 0; i < 15; i++) {
        const snapshot = engine.getSnapshot();
        const correctAnswer = snapshot.correctOptionSlug;
        engine.selectOption(correctAnswer);
        engine.lockIn();
        engine.finalizeAnswer();

        // If we hit a safe haven, advance past it
        const afterReveal = engine.getSnapshot();
        if (afterReveal.state === States.SAFE_HAVEN) {
          engine.nextQuestion();
        }
      }

      // After all 15 questions answered, should be at WIN state
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.WIN);
    });
  });

  describe('walkAway()', () => {
    beforeEach(() => {
      engine.startGame('Player');
    });

    it('from DISPLAY_QUESTION: sets gameOverReason = walkaway', () => {
      engine.walkAway();
      const snapshot = engine.getSnapshot();
      expect(snapshot.gameOverReason).toBe('walkaway');
      expect(snapshot.state).toBe(States.GAME_OVER);
    });

    it('from DISPLAY_QUESTION: walkAwayAmount = 0 (no previous level)', () => {
      engine.walkAway();
      const snapshot = engine.getSnapshot();
      expect(snapshot.walkAwayAmount).toBe(0);
      expect(snapshot.currentWinnings).toBe(0);
    });

    it('from ANSWER_LOCKED: sets walkAwayAmount = previous level amount', () => {
      engine.selectOption('a');
      engine.walkAway();
      const snapshot = engine.getSnapshot();
      expect(snapshot.gameOverReason).toBe('walkaway');
      expect(snapshot.state).toBe(States.GAME_OVER);
      expect(snapshot.walkAwayAmount).toBe(0);
    });

    it('from ANSWER_LOCKED after advancing: walkAwayAmount = current level amount', () => {
      engine.selectOption('a');
      engine.lockIn();
      engine.finalizeAnswer();
      // Now on question 2 (index 1), previous level (q1) = $100
      engine.walkAway();
      const snapshot = engine.getSnapshot();
      expect(snapshot.walkAwayAmount).toBe(100);
      expect(snapshot.currentWinnings).toBe(100);
    });

    it('walkAway() ignored from other states', () => {
      // Move to REVEAL state
      engine.selectOption('a');
      engine.lockIn();
      const before = engine.getSnapshot();
      expect(before.state).toBe(States.REVEAL);
      // Try to walk away from REVEAL state (should be ignored)
      const beforeWalkAwayAmount = before.walkAwayAmount;
      engine.walkAway();
      const snapshot = engine.getSnapshot();
      // State and walkAwayAmount should remain unchanged
      expect(snapshot.state).toBe(States.REVEAL);
      expect(snapshot.walkAwayAmount).toBe(beforeWalkAwayAmount);
    });
  });

  describe('useLifeline()', () => {
    beforeEach(() => {
      engine.startGame('Player', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
    });

    it('50-50: removes 2 wrong answers, sets LIFELINE_ACTIVE', () => {
      const before = engine.getSnapshot();
      expect(before.lifelines['50-50']).toBe(false);
      expect(before.currentQuestion.options.length).toBe(4);

      engine.useLifeline('50-50');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['50-50']).toBe(true);
      expect(snapshot.state).toBe(States.LIFELINE_ACTIVE);
      // Only 2 options should remain active: correct + 1 wrong
      const activeCount = snapshot.currentQuestion.options.filter(o => o.active).length;
      expect(activeCount).toBe(2);
    });

    it('ask-audience: generates distribution, sets LIFELINE_ACTIVE', () => {
      engine.useLifeline('ask-audience');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['ask-audience']).toBe(true);
      expect(snapshot.state).toBe(States.LIFELINE_ACTIVE);
      expect(snapshot.lifelineData).toBeDefined();
      expect(Array.isArray(snapshot.lifelineData)).toBe(true);
      expect(snapshot.lifelineData.length).toBe(4);
    });

    it('phone-friend: generates message, sets LIFELINE_ACTIVE', () => {
      engine.useLifeline('phone-friend');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['phone-friend']).toBe(true);
      expect(snapshot.state).toBe(States.LIFELINE_ACTIVE);
      expect(snapshot.lifelineData).toBeDefined();
      expect(typeof snapshot.lifelineData).toBe('string');
      expect(snapshot.lifelineData).toContain('I think it\'s');
    });

    it('rejects reuse: cannot use same lifeline twice', () => {
      engine.useLifeline('50-50');
      engine.resolveLifeline();
      // Try to use again
      engine.useLifeline('50-50');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['50-50']).toBe(true);
      // State should still be DISPLAY_QUESTION, not LIFELINE_ACTIVE
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
    });

    it('only works from DISPLAY_QUESTION state', () => {
      engine.selectOption('a');
      engine.lockIn();
      // Now in REVEAL state
      engine.useLifeline('50-50');
      const snapshot = engine.getSnapshot();
      expect(snapshot.lifelines['50-50']).toBe(false);
      expect(snapshot.state).toBe(States.REVEAL);
    });
  });

  describe('resolveLifeline()', () => {
    beforeEach(() => {
      engine.startGame('Player', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
    });

    it('back to DISPLAY_QUESTION when in LIFELINE_ACTIVE', () => {
      engine.useLifeline('50-50');
      let snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.LIFELINE_ACTIVE);

      engine.resolveLifeline();
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.lifelineType).toBeNull();
      expect(snapshot.lifelineData).toBeNull();
    });

    it('ignores calls from other states', () => {
      engine.selectOption('a');
      engine.lockIn();
      engine.resolveLifeline();
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);
    });
  });

  describe('subscribe()', () => {
    it('notifies subscriber on state change', () => {
      let snapshots = [];
      engine.subscribe(snap => snapshots.push(snap));
      engine.start();
      expect(snapshots.length).toBeGreaterThan(0);
      expect(snapshots[snapshots.length - 1].state).toBe(States.NAME_ENTRY);
    });

    it('returns unsubscribe function', () => {
      let count = 0;
      const unsub = engine.subscribe(() => count++);
      engine.start();
      const firstCount = count;
      unsub();
      engine.startGame('Player');
      expect(count).toBe(firstCount); // No new notifications
    });

    it('sends current snapshot to new subscriber', () => {
      engine.startGame('Player');
      let received = null;
      engine.subscribe(snap => received = snap);
      expect(received).toBeDefined();
      expect(received.state).toBe(States.DISPLAY_QUESTION);
    });
  });

  describe('getSnapshot()', () => {
    it('returns IDLE state before start()', () => {
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('returns NAME_ENTRY state after start()', () => {
      engine.start();
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.NAME_ENTRY);
      expect(snapshot.playerName).toBeNull();
    });

    it('returns complete game state after startGame()', () => {
      engine.startGame('Alice');
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.playerName).toBe('Alice');
      expect(snapshot.questionIndex).toBe(0);
      expect(snapshot.currentQuestion).toBeDefined();
      expect(snapshot.ladder.length).toBe(15);
      expect(snapshot.currentWinnings).toBe(0);
      expect(snapshot.floorAmount).toBe(0);
    });

    it('tracks ladder state: current, passed, safeHaven', () => {
      engine.startGame('Player');
      engine.selectOption('a');
      engine.lockIn();
      engine.finalizeAnswer();
      const snapshot = engine.getSnapshot();
      expect(snapshot.ladder[0].current).toBe(false);
      expect(snapshot.ladder[0].passed).toBe(true);
      expect(snapshot.ladder[1].current).toBe(true);
      expect(snapshot.ladder[1].passed).toBe(false);
    });
  });

  describe('reset() from different states (lines 262-263)', () => {
    // Use a simple question bank where all questions have 'a' as correct answer
    const simpleQuestionBank = Array.from({ length: 15 }, (_, i) => ({
      slug: `q${i + 1}`,
      question: `Question ${i + 1}`,
      difficulty: i + 1,
      correctOptionSlug: 'a',
      options: [
        { slug: 'a', text: 'Correct' },
        { slug: 'b', text: 'Wrong 1' },
        { slug: 'c', text: 'Wrong 2' },
        { slug: 'd', text: 'Wrong 3' },
      ],
    }));
    let resetEngine;
    
    beforeEach(() => {
      resetEngine = new GameEngine(simpleQuestionBank, ladder);
    });
    
    it('from DISPLAY_QUESTION: clears session and returns to IDLE', () => {
      resetEngine.startGame('Player');
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from ANSWER_LOCKED: clears session and returns to IDLE', () => {
      resetEngine.startGame('Player');
      resetEngine.selectOption('a');
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.ANSWER_LOCKED);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from GAME_OVER: clears session and returns to IDLE', () => {
      resetEngine.startGame('Player');
      resetEngine.selectOption('b'); // Wrong answer
      resetEngine.lockIn();
      resetEngine.finalizeAnswer();
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.GAME_OVER);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from WIN: clears session and returns to IDLE', () => {
      const customLadder = Array.from({ length: 15 }, (_, i) => ({
        level: i + 1,
        amount: (i + 1) * 100000,
        safeHaven: false,
      }));
      const customEngine = new GameEngine(simpleQuestionBank, customLadder);
      customEngine.startGame('Player');
      for (let i = 0; i < 14; i++) {
        customEngine.selectOption('a');
        customEngine.lockIn();
        customEngine.finalizeAnswer();
      }
      customEngine.selectOption('a');
      customEngine.lockIn();
      customEngine.finalizeAnswer();
      let snapshot = customEngine.getSnapshot();
      expect(snapshot.state).toBe(States.WIN);
      customEngine.reset();
      snapshot = customEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from SAFE_HAVEN: clears session and returns to IDLE', () => {
      const customLadder = Array.from({ length: 15 }, (_, i) => ({
        level: i + 1,
        amount: (i + 1) * 100000,
        safeHaven: i === 4,
      }));
      const customEngine = new GameEngine(simpleQuestionBank, customLadder);
      customEngine.startGame('Player');
      for (let i = 0; i < 5; i++) {
        customEngine.selectOption('a');
        customEngine.lockIn();
        customEngine.finalizeAnswer();
      }
      let snapshot = customEngine.getSnapshot();
      expect(snapshot.state).toBe(States.SAFE_HAVEN);
      customEngine.reset();
      snapshot = customEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from LIFELINE_ACTIVE: clears session and returns to IDLE', () => {
      resetEngine.startGame('Player', { lifelines: ['50-50', 'ask-audience', 'phone-friend'] });
      resetEngine.useLifeline('50-50');
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.LIFELINE_ACTIVE);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from REVEAL: clears session and returns to IDLE', () => {
      resetEngine.startGame('Player');
      resetEngine.selectOption('a');
      resetEngine.lockIn();
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.REVEAL);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });

    it('from NAME_ENTRY: clears session and returns to IDLE', () => {
      resetEngine.start();
      let snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.NAME_ENTRY);
      resetEngine.reset();
      snapshot = resetEngine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
      expect(snapshot.playerName).toBeNull();
    });
  });

  describe('Q15 without safe haven (line 147 coverage)', () => {
    it('answering Q15 correctly when NOT a safe haven goes to WIN state', () => {
      // Use simple question bank where all correct answers are 'a'
      const simpleQuestionBank = Array.from({ length: 15 }, (_, i) => ({
        slug: `q${i + 1}`,
        question: `Question ${i + 1}`,
        difficulty: i + 1,
        correctOptionSlug: 'a',
        options: [
          { slug: 'a', text: 'Correct' },
          { slug: 'b', text: 'Wrong 1' },
          { slug: 'c', text: 'Wrong 2' },
          { slug: 'd', text: 'Wrong 3' },
        ],
      }));
      const customLadder = Array.from({ length: 15 }, (_, i) => ({
        level: i + 1,
        amount: (i + 1) * 100000,
        safeHaven: false,
      }));
      const customEngine = new GameEngine(simpleQuestionBank, customLadder);
      customEngine.startGame('Player');
      for (let i = 0; i < 14; i++) {
        customEngine.selectOption('a');
        customEngine.lockIn();
        customEngine.finalizeAnswer();
      }
      customEngine.selectOption('a');
      customEngine.lockIn();
      customEngine.finalizeAnswer();
      const snapshot = customEngine.getSnapshot();
      expect(snapshot.state).toBe(States.WIN);
      expect(snapshot.currentWinnings).toBe(1500000);
    });
  });

  describe('_generateAudienceDistribution() branches', () => {
    it('4 options: last wrong option gets remaining weight', () => {
      const questionWith4Options = {
        correctOptionSlug: 'opt-a',
        options: [
          { slug: 'opt-a', text: 'Correct' },
          { slug: 'opt-b', text:'Wrong 1' },
          { slug: 'opt-c', text: 'Wrong 2' },
          { slug: 'opt-d', text: 'Wrong 3' },
        ],
      };

      engine.startGame('TestPlayer');
      const distribution = engine._generateAudienceDistribution(questionWith4Options);
      
      expect(distribution.length).toBe(4);
      distribution.forEach(val => expect(val).toBeGreaterThanOrEqual(0));
      const sum = distribution.reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      expect(distribution[0]).toBeGreaterThanOrEqual(55);
      expect(distribution[0]).toBeLessThanOrEqual(75);
      expect(distribution[3]).toBeGreaterThanOrEqual(0);
    });

    it('2 options: minimal case', () => {
      const questionWith2Options = {
        correctOptionSlug: 'a',
        options: [
          { slug: 'a', text: 'Correct' },
          { slug: 'b', text: 'Wrong' },
        ],
      };

      engine.startGame('TestPlayer');
      const distribution = engine._generateAudienceDistribution(questionWith2Options);
      
      expect(distribution.length).toBe(2);
      const sum = distribution.reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      expect(distribution[0]).toBeGreaterThanOrEqual(55);
    });

    it('3 options: multiple wrong options', () => {
      const questionWith3Options = {
        correctOptionSlug: 'opt-x',
        options: [
          { slug: 'opt-x', text: 'Correct' },
          { slug: 'opt-y', text: 'Wrong 1' },
          { slug: 'opt-z', text: 'Wrong 2' },
        ],
      };

      engine.startGame('TestPlayer');
      const distribution = engine._generateAudienceDistribution(questionWith3Options);
      
      expect(distribution.length).toBe(3);
      const sum = distribution.reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      distribution.forEach(val => expect(val).toBeGreaterThanOrEqual(0));
    });

    it('5 options: middle wrong options weight distribution', () => {
      const questionWith5Options = {
        correctOptionSlug: 'opt-a',
        options: [
          { slug: 'opt-a', text: 'Correct' },
          { slug: 'opt-b', text: 'Wrong 1' },
          { slug: 'opt-c', text: 'Wrong 2' },
          { slug: 'opt-d', text: 'Wrong 3' },
          { slug: 'opt-e', text: 'Wrong 4' },
        ],
      };

      engine.startGame('TestPlayer');
      
      for (let i = 0; i < 10; i++) {
        const distribution = engine._generateAudienceDistribution(questionWith5Options);
        expect(distribution.length).toBe(5);
        const sum = distribution.reduce((a, b) => a + b, 0);
        expect(sum).toBe(100);
        distribution.forEach(val => expect(val).toBeGreaterThanOrEqual(0));
      }
    });

  });

  describe('_generatePhoneFriendResponse() branches', () => {
    it('70% confidence branch: suggests correct answer most of the time', () => {
      const question = {
        correctOptionSlug: 'a',
        options: [
          { slug: 'a', text: 'Paris' },
          { slug: 'b', text: 'London' },
          { slug: 'c', text: 'Berlin' },
        ],
      };

      engine.startGame('TestPlayer');
      
      let correctSuggestions = 0;
      const responseTexts = new Set();
      
      for (let i = 0; i < 100; i++) {
        const response = engine._generatePhoneFriendResponse(question);
        responseTexts.add(response);
        if (response.includes('Paris')) correctSuggestions++;
      }
      
      expect(responseTexts.size).toBeGreaterThan(1);
      expect(correctSuggestions).toBeGreaterThan(50);
    });

    it('30% random branch: can suggest wrong answers', () => {
      const question = {
        correctOptionSlug: 'correct',
        options: [
          { slug: 'correct', text: 'Correct Answer' },
          { slug: 'wrong1', text: 'Wrong Answer 1' },
          { slug: 'wrong2', text: 'Wrong Answer 2' },
          { slug: 'wrong3', text: 'Wrong Answer 3' },
        ],
      };

      engine.startGame('TestPlayer');
      
      const answers = new Set();
      
      for (let i = 0; i < 100; i++) {
        const response = engine._generatePhoneFriendResponse(question);
        answers.add(response);
      }
      
      expect(answers.size).toBeGreaterThan(1);
    });

        it('option not found fallback (line 257): returns fallback when option missing', () => {
          const question = {
            correctOptionSlug: 'correct',
            options: [
              { slug: 'correct', text: 'Correct Answer' },
              { slug: 'wrong1', text: 'Wrong Answer 1' },
            ],
          };
    
          engine.startGame('TestPlayer');
          
          // Force the 30% random branch to pick a slug that doesn't exist in options
          let callCount = 0;
          const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
            callCount++;
            // First call (0.7 check): return 0.75 to enter 30% random branch
            if (callCount === 1) {
              return 0.75;
            }
            // Second call (slug index): return high value
            // floor(0.99 * 2) = 1, picks wrong1
            // But we use mockFloor to make it return invalid index
            if (callCount === 2) {
              return 0.99;
            }
            return 0.5;
          });
    
          // Mock floor to return index beyond array bounds
          let floorCallCount = 0;
          const floorSpy = vi.spyOn(Math, 'floor').mockImplementation((n) => {
            floorCallCount++;
            if (floorCallCount === 1) {
              // For the slugs[Math.floor(...)] call, return out of bounds index
              return 99;
            }
            // For the confidence calculation, return real value
            return Math.trunc(n);
          });
    
          try {
            const response = engine._generatePhoneFriendResponse(question);
            expect(response).toContain('hmm, not sure');
            expect(response).toMatch(/\d+%/);
          } finally {
            randomSpy.mockRestore();
            floorSpy.mockRestore();
          }
        });
    it('confidence is between 40-95%', () => {
      const question = {
        correctOptionSlug: 'a',
        options: [
          { slug: 'a', text: 'Option A' },
          { slug: 'b', text: 'Option B' },
        ],
      };

      engine.startGame('TestPlayer');
      
      for (let i = 0; i < 50; i++) {
        const response = engine._generatePhoneFriendResponse(question);
        const match = response.match(/(\d+)%/);
        expect(match).not.toBeNull();
        const confidence = parseInt(match[1]);
        expect(confidence).toBeGreaterThanOrEqual(40);
        expect(confidence).toBeLessThanOrEqual(95);
      }
    });

  });

  describe('Guard clauses in defensive methods', () => {
    it('_setState() returns early when engine has no session (line 33)', () => {
      // Verify engine starts with no session
      expect(engine._session).toBeNull();
      
      // Calling _setState() on a null session should return silently
      // This should not throw an error
      engine._setState(States.DISPLAY_QUESTION);
      
      // Session should still be null (no state change occurred)
      expect(engine._session).toBeNull();
      
      // Snapshot should show IDLE state when session is null
      const snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.IDLE);
    });

    it('_reveal() returns early when state is not REVEAL (line 134)', () => {
      engine.startGame('Player');
      
      // Engine is in DISPLAY_QUESTION state initially
      let snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      
      // Calling _reveal() in DISPLAY_QUESTION state should return early
      engine._reveal();
      
      // State should still be DISPLAY_QUESTION (unchanged)
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.selectedOptionSlug).toBeNull();
      expect(snapshot.currentWinnings).toBe(0);
    });

    it('nextQuestion() returns early when state is not SAFE_HAVEN (line 163)', () => {
      engine.startGame('Player');
      
      // Engine is in DISPLAY_QUESTION state initially
      let snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      const initialIndex = snapshot.questionIndex;
      
      // Calling nextQuestion() in DISPLAY_QUESTION state should return early
      engine.nextQuestion();
      
      // State and question index should be unchanged
      snapshot = engine.getSnapshot();
      expect(snapshot.state).toBe(States.DISPLAY_QUESTION);
      expect(snapshot.questionIndex).toBe(initialIndex);
    });

    it('_isSafeHaven() returns false when ladder level has no safeHaven property (line 114)', () => {
      // Create a ladder where a level has an undefined/falsy safeHaven property
      const customLadder = Array.from({ length: 15 }, (_, i) => ({
        level: i + 1,
        amount: (i + 1) * 100000,
        // Deliberately omit safeHaven for some levels, or set to undefined
        ...(i === 5 ? {} : { safeHaven: false }), // Level 6 (index 5) has no safeHaven property
      }));
      
      const customEngine = new GameEngine(mockQuestionBank, customLadder);
      customEngine.startGame('Player');
      
      // For the level WITHOUT safeHaven property (index 5),
      // _isSafeHaven should return false via the ?? false fallback
      expect(customEngine._isSafeHaven(5)).toBe(false);
      
      // For levels WITH safeHaven: false, should also return false
      expect(customEngine._isSafeHaven(0)).toBe(false);
      expect(customEngine._isSafeHaven(10)).toBe(false);
    });
  });


});
