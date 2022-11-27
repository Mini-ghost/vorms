import { describe, expect, it } from 'vitest';

import isKey from '../../src/utils/isKey';

describe('isKey', () => {
  it('should return true when value is not a deep key', () => {
    expect(isKey('test')).toBeTruthy();
    expect(isKey('key')).toBeTruthy();
  });

  it('should return false when value is a deep key', () => {
    expect(isKey('test.foo')).toBeFalsy();
    expect(isKey('test.foo[0]')).toBeFalsy();
    expect(isKey('test[1]')).toBeFalsy();
    expect(isKey('test.list[0].data')).toBeFalsy();
  });
});
