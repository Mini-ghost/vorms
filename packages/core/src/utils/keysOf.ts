export default <TRecord extends Record<string, unknown>>(
  record: TRecord,
): (keyof TRecord)[] => {
  return Object.keys(record);
};
