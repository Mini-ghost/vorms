import { describe, expect, it } from 'vitest';

import keysOf from '../../src/utils/keysOf';

describe('keysOf', () => {
  it('should return object all keys', () => {
    expect(keysOf({ name: 'Alex', age: 10 })).toEqual(
      expect.arrayContaining(['name', 'age']),
    );
  });
});
