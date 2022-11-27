import { describe, expect, it } from 'vitest';

import prepend from '../../src/utils/prepend';

describe('prepend', () => {
  it('should add value at first position of array', () => {
    expect(prepend([2, 3], 1)).toEqual([1, 2, 3]);
  });
});
