import { describe, expect, it } from 'vitest';

import isObject, { isObjectType } from '../../src/utils/isObject';

describe('isObject', () => {
  it('should return true when value is a object', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ key: 'object' })).toBeTruthy();
  });

  it('should return false when value is not a object', () => {
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject('object')).toBeFalsy();
    expect(isObject(true)).toBeFalsy();
    expect(isObject(false)).toBeFalsy();
    expect(isObject(0)).toBeFalsy();
    expect(isObject([])).toBeFalsy();
    expect(isObject(() => null)).toBeFalsy();
    expect(isObject(new Date())).toBeFalsy();
  });
});

describe('isObjectType', () => {
  it('should return true when value is object type', () => {
    expect(isObjectType({})).toBeTruthy();
    expect(isObjectType([])).toBeTruthy();
    expect(isObjectType(null)).toBeTruthy();
    expect(isObjectType(new Date())).toBeTruthy();
    expect(isObjectType(new Map())).toBeTruthy();
    expect(isObjectType(new Set())).toBeTruthy();
  });

  it('should return true when value is not object type', () => {
    expect(isObjectType('')).toBeFalsy();
    expect(isObjectType(0)).toBeFalsy();
    expect(isObjectType(true)).toBeFalsy();
    expect(isObjectType(() => null)).toBeFalsy();
  });
});
