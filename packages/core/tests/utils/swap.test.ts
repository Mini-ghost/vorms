import { describe, it, expect } from 'vitest';
import swap from '../../src/utils/swap';

describe('swap', () => {
  it('should swap value positions', () => {
    const array = [1, 3, 5];
    swap(array, 0, 2);
    expect(array).toEqual([5, 3, 1]);
  });

  it('should swap undefined position when index is not exists', () => {
    const array = [1, 3, 5];
    swap(array, 0, 3);
    expect(array).toEqual([undefined, 3, 5, 1]);
  });
});
