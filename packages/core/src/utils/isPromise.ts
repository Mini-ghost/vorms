import isFunction from './isFunction';
import isObject from './isObject';

export default (value: any): value is PromiseLike<any> => {
  return !!value && isObject(value) && isFunction(value.then);
};
