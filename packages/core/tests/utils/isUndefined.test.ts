import { describe, expect, it } from 'vitest';

import isUndefined from '../../src/utils/isUndefined';

describe('isUndefined', () => {
  it('should return true when value is an undefined', () => {
    expect(isUndefined(undefined)).toBeTruthy();
  });

  it('should return false when value is not an undefined', () => {
    expect(isUndefined(null)).toBeFalsy();
    expect(isUndefined('')).toBeFalsy();
    expect(isUndefined('undefined')).toBeFalsy();
    expect(isUndefined(0)).toBeFalsy();
    expect(isUndefined([])).toBeFalsy();
    expect(isUndefined({})).toBeFalsy();
  });
});
