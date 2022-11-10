import { describe, it, expect } from 'vitest';
import isNullOrUndefined from '../../src/utils/isNullOrUndefined';

describe('isNullOrUndefined', () => {
  it('should return true when value is null or undefined', () => {
    expect(isNullOrUndefined(null)).toBeTruthy();
    expect(isNullOrUndefined(undefined)).toBeTruthy();
  });

  it('should return false when value is not null or undefined', () => {
    expect(isNullOrUndefined('')).toBeFalsy();
    expect(isNullOrUndefined(0)).toBeFalsy();
    expect(isNullOrUndefined([])).toBeFalsy();
    expect(isNullOrUndefined({})).toBeFalsy();
    expect(isNullOrUndefined(() => null)).toBeFalsy();
  });
});
