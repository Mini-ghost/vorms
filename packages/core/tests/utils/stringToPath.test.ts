import { describe, expect, it } from 'vitest';

import stringToPath from '../../src/utils/stringToPath';

describe('stringToPath', () => {
  it('shoult convert string to a path array', () => {
    expect(stringToPath('key')).toEqual(['key']);
    expect(stringToPath('key.data')).toEqual(['key', 'data']);
    expect(stringToPath('key.data["value"]')).toEqual(['key', 'data', 'value']);
    expect(stringToPath('key.list.0.value')).toEqual([
      'key',
      'list',
      '0',
      'value',
    ]);
    expect(stringToPath('')).toEqual([]);
  });
});
