import { describe, expect, it } from 'vitest';

import update from '../../src/utils/update';

describe('update', () => {
  it('should return array that updated', () => {
    expect(update([1, 3, 5], 0, 2)).toEqual([2, 3, 5]);
    expect(update([1, 3, 5], 3, 7)).toEqual([1, 3, 5, 7]);
  });
});
