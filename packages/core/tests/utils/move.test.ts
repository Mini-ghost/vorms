import { describe, expect, it } from 'vitest';

import move from '../../src/utils/move';

describe('move', () => {
  it('should move value to  specific position of array', () => {
    const array = [1, 2, 3];
    move(array, 0, 2);
    expect(array).toEqual([2, 3, 1]);
  });
});
