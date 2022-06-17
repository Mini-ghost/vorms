export default <T>(data: T[], from: number, to: number) => {
  data.splice(to, 0, data.splice(from, 1)[0]);
};
