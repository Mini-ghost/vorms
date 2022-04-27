import isDateObject from './isDateObject';
import isNullOrUndefined from './isNullOrUndefined';

export const isObjectType = (value: any) => typeof value === 'object';

export default (value: any): value is Object =>
  !isNullOrUndefined(value) &&
  !Array.isArray(value) &&
  isObjectType(value) &&
  !isDateObject(value);
