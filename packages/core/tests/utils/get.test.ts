import { describe, expect, it } from 'vitest';

import get from '../../src/utils/get';

describe('get', () => {
  it('should get right value', () => {
    const test = {
      data: 'value',
      list: [1, 2, 3],
      nested: {
        obj: {
          value1: 'nested',
          list: [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
        },
      },
      'nested.obj.value2': 'string',
    };

    expect(get(test, 'data')).toEqual('value');
    expect(get(test, 'list.1')).toEqual(2);
    expect(get(test, 'nested.obj.value1')).toEqual('nested');
    expect(get(test, 'nested.obj.value2')).toEqual('string');
    expect(get(test, 'nested.obj.list.0.text')).toEqual('a');
    expect(get(test, 'list')).toEqual(test.list);
  });

  it('should get undefined when provided a empty path', () => {
    const test = {
      data: 'value',
    };

    expect(get(test, '')).toEqual(undefined);
    expect(get(test, 'text')).toEqual(undefined);
  });
});
