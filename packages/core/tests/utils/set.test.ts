import { describe, it, expect } from 'vitest';
import set from '../../src/utils/set';

describe('set', () => {
  it('shoult set value to object', () => {
    const obj = { data: undefined };
    expect(set(obj, 'data', 'value')).toEqual('value');
    expect(obj.data).toEqual('value');

    const obj2 = { list: [0, 1, 2] };
    expect(set(obj2, 'list.0', 3)).toEqual(3);
    expect(obj2.list[0]).toEqual(3);

    const obj3: Record<string, any> = {};
    expect(set(obj3, 'data.list.0', 'value')).toEqual('value');
    expect(obj3.data.list).toEqual(['value']);
  });
});
