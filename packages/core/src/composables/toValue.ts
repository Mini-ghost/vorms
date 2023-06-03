import { unref } from 'vue';

import { MaybeRefOrGetter } from '../types';
import isFunction from '../utils/isFunction';

export default <T>(value: MaybeRefOrGetter<T>): T => {
  return isFunction(value) ? value() : unref(value);
};
