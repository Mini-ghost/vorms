import { describe, it, expect } from 'vitest';
import append from '../../src/utils/append';

describe('append', () => {
  it('should add value at last position of array', () => {
    expect(append([1, 2], 3)).toEqual([1, 2, 3]);
  });
});
