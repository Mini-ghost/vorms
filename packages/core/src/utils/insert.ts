export default <T>(data: T[], index: number, value: T): T[] => {
  return [...data.slice(0, index), value, ...data.slice(index)];
};
