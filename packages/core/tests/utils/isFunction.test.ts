import { describe, it, expect } from 'vitest';
import isFunction from '../../src/utils/isFunction';

describe('isFunction', () => {
  it('should return true when value is a function', () => {
    expect(isFunction(() => null)).toBeTruthy();
  });

  it('should return false when value is not a function', () => {
    expect(isFunction('')).toBeFalsy();
    expect(isFunction(0)).toBeFalsy();
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction([])).toBeFalsy();
    expect(isFunction({})).toBeFalsy();
  });
});
