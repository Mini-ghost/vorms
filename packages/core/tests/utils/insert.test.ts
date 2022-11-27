import { describe, expect, it } from 'vitest';

import insert from '../../src/utils/insert';

describe('insert', () => {
  it('should add value at specific position of array', () => {
    expect(insert([1, 2], 1, 3)).toEqual([1, 3, 2]);
    expect(insert([1, 2], 2, 3)).toEqual([1, 2, 3]);
  });
});
