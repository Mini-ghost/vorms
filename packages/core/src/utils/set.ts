import isKey from './isKey';
import isObject from './isObject';
import stringToPath from './stringToPath';

export default (obj: Record<string, any>, path: string, value?: any) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = obj[key];
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+tempPath[index + 1])
          ? []
          : {};
    }
    obj[key] = newValue;
    obj = obj[key];
  }
  return obj;
};
