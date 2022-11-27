import { describe, expect, it } from 'vitest';

import compact from '../../src/utils/compact';

describe('compact', () => {
  it('should return filtered array when value is falsy', () => {
    expect(compact(['1', '2', '3'])).toEqual(['1', '2', '3']);
    expect(compact(['1', '', '3'])).toEqual(['1', '3']);
    expect(compact(['1', undefined, '3'])).toEqual(['1', '3']);
    expect(compact(['1', null, '3'])).toEqual(['1', '3']);
    expect(compact(['1', false, '3'])).toEqual(['1', '3']);
  });

  it('should return empty array when value is not an array', () => {
    // @ts-expect-errorr for test case
    expect(compact('value')).toEqual([]);
    // @ts-expect-errorr for test case
    expect(compact(0)).toEqual([]);
    // @ts-expect-errorr for test case
    expect(compact(undefined)).toEqual([]);
    // @ts-expect-errorr for test case
    expect(compact(null)).toEqual([]);
    // @ts-expect-errorr for test case
    expect(compact({})).toEqual([]);
  });
});
