import { describe, it, expect } from 'vitest';
import omit from '../../src/utils/omit';

describe('omit', () => {
  it('should return omited object', () => {
    expect(omit({ a: 'value', b: 'omit' }, 'b')).toEqual({ a: 'value' });
    // @ts-expect-error for test case
    expect(omit({ a: 'value' }, 'b')).toEqual({ a: 'value' });
  });
});
