import { describe, it, expect } from 'vitest';
import { median, percentile } from '../../src/shared/format.ts';

describe('format utilities', () => {
  it('computes median', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('computes percentile', () => {
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 95)).toBeGreaterThan(8);
  });
});
