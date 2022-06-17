import isUndefined from '../utils/isUndefined';

export default <T>(data: T[], index?: number): T[] => {
  if (isUndefined(index)) return [];

  const clone = [...data];
  clone.splice(index, 1);
  return clone;
};
