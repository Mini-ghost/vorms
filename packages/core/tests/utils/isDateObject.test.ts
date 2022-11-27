import { describe, expect, it } from 'vitest';

import isDateObject from '../../src/utils/isDateObject';

describe('isDateObject', () => {
  it('should return true when value is a Date', () => {
    expect(isDateObject(new Date())).toBeTruthy();
  });

  it('should return false when value is not a Date', () => {
    expect(isDateObject('')).toBeFalsy();
    expect(isDateObject(0)).toBeFalsy();
    expect(isDateObject(false)).toBeFalsy();
    expect(isDateObject(null)).toBeFalsy();
    expect(isDateObject(undefined)).toBeFalsy();
    expect(isDateObject({})).toBeFalsy();
    expect(isDateObject([])).toBeFalsy();
  });
});
