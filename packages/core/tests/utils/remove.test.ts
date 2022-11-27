import { describe, expect, it } from 'vitest';

import remove from '../../src/utils/remove';

describe('remove', () => {
  it('should return array that updated', () => {
    expect(remove([1, 2, 3], 0)).toEqual([2, 3]);
    expect(remove([1, 2, 3], 3)).toEqual([1, 2, 3]);
    expect(remove([1, 2, 3])).toEqual([]);
  });
});
