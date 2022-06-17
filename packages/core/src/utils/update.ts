export default <T>(data: T[], index: number, value: T): T[] => {
  const clone = [...data];

  clone[index] = value;
  return clone;
};
