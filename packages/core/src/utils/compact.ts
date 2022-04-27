export default <T>(value: T[]) =>
  Array.isArray(value) ? value.filter(Boolean) : [];
