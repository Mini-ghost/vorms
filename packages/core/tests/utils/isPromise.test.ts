import { describe, expect, it } from 'vitest';

import isPromise from '../../src/utils/isPromise';

describe('isPromise', () => {
  it('should return true when value is a promise', () => {
    const promise = new Promise<boolean>((resolve) => resolve(true));
    expect(isPromise(promise)).toBeTruthy();
  });

  it('should return false when value is not a promise', () => {
    //
    expect(isPromise(undefined)).toBeFalsy();
    expect(isPromise(null)).toBeFalsy();
    expect(isPromise('promise')).toBeFalsy();
    expect(isPromise(0)).toBeFalsy();
    expect(isPromise({})).toBeFalsy();
    expect(isPromise([])).toBeFalsy();
    expect(isPromise(() => null)).toBeFalsy();
  });
});
