export default <T>(data: T[], value: T) => {
  return [value, ...data];
};
