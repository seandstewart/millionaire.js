import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadQuestions } from '../src/questions.js';

describe('questions module', () => {
  describe('loadQuestions()', () => {
    beforeEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns array of questions with valid format', async () => {
      const mockData = {
        questions: [
          { slug: 'q1', question: 'Test?', difficulty: 1, correctOptionSlug: 'a', options: [] },
          { slug: 'q2', question: 'Test?', difficulty: 2, correctOptionSlug: 'b', options: [] },
        ]
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        })
      );

      const result = await loadQuestions('/test.json');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].slug).toBe('q1');
      expect(result[1].slug).toBe('q2');
    });

    it('throws on missing .questions array', async () => {
      const mockData = { data: [] }; // No 'questions' key

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        })
      );

      await expect(loadQuestions('/test.json')).rejects.toThrow('Invalid question bank format');
    });

    it('throws on fetch failure with status code', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      );

      await expect(loadQuestions('/missing.json')).rejects.toThrow('Failed to load questions: 404');
    });

    it('throws on 500 server error', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500
        })
      );

      await expect(loadQuestions('/error.json')).rejects.toThrow('Failed to load questions: 500');
    });

    it('uses default URL /questions.json when not provided', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ questions: [] })
        })
      );

      await loadQuestions();
      expect(global.fetch).toHaveBeenCalledWith('/questions.json');
    });

    it('uses provided URL parameter', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ questions: [] })
        })
      );

      await loadQuestions('/custom.json');
      expect(global.fetch).toHaveBeenCalledWith('/custom.json');
    });
  });
});
