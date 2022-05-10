export default <S extends Record<string, any>, Key extends keyof S>(
  source: S,
  key: Key,
): Omit<S, Key> => {
  const copy = { ...source };
  delete copy[key];

  return copy;
};
