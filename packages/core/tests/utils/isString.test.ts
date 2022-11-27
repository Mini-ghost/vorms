import { describe, expect, it } from 'vitest';

import isString from '../../src/utils/isString';

describe('isString', () => {
  it('should return true when value is a string', () => {
    expect(isString('')).toBeTruthy();
    expect(isString('string')).toBeTruthy();
  });

  it('should return false when value is not a string', () => {
    expect(isString(null)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(true)).toBeFalsy();
    expect(isString(false)).toBeFalsy();
    expect(isString(0)).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString(() => null)).toBeFalsy();
    expect(isString(new String('string'))).toBeFalsy();
  });
});
