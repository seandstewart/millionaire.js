import { describe, it, expect } from 'vitest';
import { generateShareMessage, getGameNumber, generateEmojiGrid, getLifelineEmojis, copyShareMessage } from '../src/shareMessage.js';

const mockQuestions = [
  { slug: 'q1', question: 'Q1', difficulty: 1, correctOptionSlug: 'a', options: [] },
  { slug: 'q2', question: 'Q2', difficulty: 2, correctOptionSlug: 'b', options: [] },
  { slug: 'q3', question: 'Q3', difficulty: 3, correctOptionSlug: 'a', options: [] },
  { slug: 'q4', question: 'Q4', difficulty: 4, correctOptionSlug: 'c', options: [] },
  { slug: 'q5', question: 'Q5', difficulty: 5, correctOptionSlug: 'a', options: [] },
  { slug: 'q6', question: 'Q6', difficulty: 6, correctOptionSlug: 'b', options: [] },
  { slug: 'q7', question: 'Q7', difficulty: 7, correctOptionSlug: 'a', options: [] },
  { slug: 'q8', question: 'Q8', difficulty: 8, correctOptionSlug: 'd', options: [] },
  { slug: 'q9', question: 'Q9', difficulty: 9, correctOptionSlug: 'a', options: [] },
  { slug: 'q10', question: 'Q10', difficulty: 10, correctOptionSlug: 'c', options: [] },
];

describe('shareMessage module', () => {
  describe('generateShareMessage()', () => {
    it('includes 🏆 emoji when won', () => {
      const snapshot = {
        state: 'win',
        playerName: 'Alice',
        questionIndex: 15,
        currentWinnings: 1000000,
        selectedOptionSlug: 'a',
        gameOverReason: null,
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('🏆');
    });

    it('includes 💰 emoji when lost', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Bob',
        questionIndex: 5,
        currentWinnings: 1000,
        selectedOptionSlug: 'b',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('💰');
    });

    it('includes player name in title', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Charlie',
        questionIndex: 3,
        currentWinnings: 300,
        selectedOptionSlug: 'a',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('Charlie');
    });

    it('includes game number', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Player',
        questionIndex: 1,
        currentWinnings: 100,
        selectedOptionSlug: 'a',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('#40');
    });

    it('includes emoji grid', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Player',
        questionIndex: 2,
        currentWinnings: 300,
        selectedOptionSlug: 'a',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('🟩');
      expect(msg).toContain('⬜');
    });
  });

  describe('getGameNumber()', () => {
    it('returns 40', () => {
      expect(getGameNumber()).toBe(40);
    });
  });

  describe('generateEmojiGrid()', () => {
    it('correct answers → 🟩', () => {
      const snapshot = {
        questionIndex: 2,
        selectedOptionSlug: null,
        gameOverReason: null,
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      expect(gridArray[0]).toBe('🟩');
      expect(gridArray[1]).toBe('🟩');
    });

    it('wrong answers → 🟥', () => {
      const snapshot = {
        questionIndex: 3,
        selectedOptionSlug: 'b', // q3 correct is 'a', selecting 'b'
        gameOverReason: null,
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      expect(gridArray[3]).toBe('🟥');
    });

    it('unanswered questions → ⬜', () => {
      const snapshot = {
        questionIndex: 2,
        selectedOptionSlug: null,
        gameOverReason: null,
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      // Grid is 10 wide, only q1-q2 answered, rest unanswered
      expect(gridArray.slice(2).join('')).toContain('⬜');
    });

    it('grid size is 10', () => {
      const snapshot = {
        questionIndex: 5,
        selectedOptionSlug: null,
        gameOverReason: null,
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      expect(gridArray.length).toBe(10);
    });

    it('gameOverReason set: marks failed current question as red', () => {
      const snapshot = {
        questionIndex: 3,
        selectedOptionSlug: null,
        gameOverReason: 'wrong',
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      // Grid index 3 (current question where player failed) should be 🟥
      expect(gridArray[3]).toBe('🟥');
      // Previous questions should be correct
      expect(gridArray[0]).toBe('🟩');
      expect(gridArray[1]).toBe('🟩');
      expect(gridArray[2]).toBe('🟩');
      // Following questions should be unanswered
      expect(gridArray[4]).toBe('⬜');
    });

    it('correctly marks passed questions', () => {
      const snapshot = {
        questionIndex: 5,
        selectedOptionSlug: null,
        gameOverReason: null,
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      expect(gridArray.slice(0, 5).join('')).toBe('🟩🟩🟩🟩🟩');
      expect(gridArray.slice(5).join('')).toContain('⬜');
    });

    it('generateEmojiGrid marks failed current question as red', () => {
      const snapshot = {
        questionIndex: 2,
        selectedOptionSlug: null,
        gameOverReason: 'wrong',
      };
      const grid = generateEmojiGrid(mockQuestions, snapshot);
      const gridArray = [...grid];
      // Grid index 2 (current question where player got it wrong) should be 🟥
      expect(gridArray[2]).toBe('🟥');
      // Previous questions should be correct
      expect(gridArray[0]).toBe('🟩');
      expect(gridArray[1]).toBe('🟩');
      // Following questions should be unanswered
      expect(gridArray[3]).toBe('⬜');
    });
  });


  describe('copyShareMessage()', () => {
    it('copyShareMessage handles clipboard write promise', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'TestPlayer',
        questionIndex: 3,
        currentWinnings: 500,
        selectedOptionSlug: 'b',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      
      // Mock navigator.clipboard if it doesn't exist
      let clipboardCalled = false;
      let clipboardText = '';
      const originalClipboard = navigator.clipboard;
      
      // Create or replace clipboard mock
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: (text) => {
            clipboardCalled = true;
            clipboardText = text;
            return Promise.resolve();
          }
        },
        writable: true
      });
      
      // Call copyShareMessage
      copyShareMessage(snapshot, mockQuestions);
      
      // Verify clipboard was called
      expect(clipboardCalled).toBe(true);
      // Verify clipboard text contains expected content
      expect(clipboardText).toContain('TestPlayer');
      expect(clipboardText).toContain('#40');
      
      // Restore original clipboard
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          writable: true
        });
      }
    });

    it('copyShareMessage handles clipboard write rejection', async () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'TestPlayer',
        questionIndex: 2,
        currentWinnings: 300,
        selectedOptionSlug: 'a',
        gameOverReason: 'wrong',
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };

      const originalClipboard = navigator.clipboard;
      const consoleError = console.error;
      let errorLogged = false;

      // Create mock clipboard that rejects
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: (text) => {
            return Promise.reject(new Error('Clipboard error'));
          }
        },
        writable: true
      });

      // Mock console.error to capture error logging
      console.error = () => {
        errorLogged = true;
      };

      // Call copyShareMessage and wait a tick for promise to settle
      copyShareMessage(snapshot, mockQuestions);
      await new Promise(resolve => setTimeout(resolve, 0));

      // Verify error was logged
      expect(errorLogged).toBe(true);

      // Restore original clipboard and console
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          writable: true
        });
      }
      console.error = consoleError;
    });
  });

  describe('getLifelineEmojis()', () => {
    it('shows used lifelines + count', () => {
      const lifelines = { '50-50': true, 'ask-audience': false, 'phone-friend': false };
      const result = getLifelineEmojis(lifelines);
      expect(result).toContain('✂️');
      expect(result).toContain('(1/3)');
    });

    it('shows multiple used lifelines', () => {
      const lifelines = { '50-50': true, 'ask-audience': true, 'phone-friend': false };
      const result = getLifelineEmojis(lifelines);
      expect(result).toContain('✂️');
      expect(result).toContain('🎤');
      expect(result).not.toContain('☎️');
      expect(result).toContain('(2/3)');
    });

    it('shows all lifelines used', () => {
      const lifelines = { '50-50': true, 'ask-audience': true, 'phone-friend': true };
      const result = getLifelineEmojis(lifelines);
      expect(result).toContain('✂️');
      expect(result).toContain('🎤');
      expect(result).toContain('☎️');
      expect(result).toContain('(3/3)');
    });

    it('shows none used', () => {
      const lifelines = { '50-50': false, 'ask-audience': false, 'phone-friend': false };
      const result = getLifelineEmojis(lifelines);
      expect(result).toContain('(0/3)');
    });
  });


  describe('generateShareMessage branch coverage', () => {
    it('emoji 🏆 when won', () => {
      const snapshot = {
        state: 'win',
        playerName: 'Alice',
        questionIndex: 14,
        currentWinnings: 1000000,
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('🏆');
    });

    it('emoji 💰 when lost', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Bob',
        questionIndex: 5,
        currentWinnings: 1000,
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('💰');
    });

    it('prize $0 when falsy', () => {
      const snapshot = {
        state: 'game_over',
        playerName: 'Zero',
        questionIndex: 0,
        currentWinnings: 0,
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('$0');
    });

    it('default player name when null', () => {
      const snapshot = {
        state: 'game_over',
        playerName: null,
        questionIndex: 1,
        currentWinnings: 100,
        lifelines: { '50-50': false, 'ask-audience': false, 'phone-friend': false },
      };
      const msg = generateShareMessage(snapshot, mockQuestions);
      expect(msg).toContain('Player on Moy-onaire');
    });
  });

  describe('getLifelineEmojis unknown type (shareMessage.js line 48)', () => {
    it('unknown lifeline type returns ? emoji', () => {
      const lifelines = {
        '50-50': false,
        'unknown-lifeline': true,
        'ask-audience': false,
        'phone-friend': false,
      };
      
      const result = getLifelineEmojis(lifelines);
      
      // Should contain the fallback ? for unknown lifeline type
      expect(result).toContain('?');
      // Count should include the unknown lifeline
      expect(result).toContain('(1/');
    });
  });
});
