import { describe, it, expect } from 'vitest';
import { ladder } from '../src/ladder.js';

describe('ladder', () => {
  it('has 15 levels', () => {
    expect(ladder.length).toBe(15);
  });

  it('level 1 = $100', () => {
    expect(ladder[0].level).toBe(1);
    expect(ladder[0].amount).toBe(100);
  });

  it('level 15 = $1,000,000', () => {
    expect(ladder[14].level).toBe(15);
    expect(ladder[14].amount).toBe(1000000);
  });

  it('safe havens at indices 4, 9, 14 (levels 5, 10, 15)', () => {
    expect(ladder[4].safeHaven).toBe(true);
    expect(ladder[4].level).toBe(5);

    expect(ladder[9].safeHaven).toBe(true);
    expect(ladder[9].level).toBe(10);

    expect(ladder[14].safeHaven).toBe(true);
    expect(ladder[14].level).toBe(15);
  });

  it('no safe havens at other levels', () => {
    for (let i = 0; i < 15; i++) {
      if (i !== 4 && i !== 9 && i !== 14) {
        expect(ladder[i].safeHaven).toBe(false);
      }
    }
  });

  it('amounts increase monotonically', () => {
    for (let i = 1; i < ladder.length; i++) {
      expect(ladder[i].amount).toBeGreaterThan(ladder[i - 1].amount);
    }
  });
});
