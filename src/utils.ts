export const deepClone = (value: any): any => {
  if (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'function' ||
    value === null ||
    value === undefined
  ) {
    return value;
  }
  if (value instanceof Date) { return new Date(value); }
  if (Array.isArray(value)) { return value.map(elem => deepClone(elem)); }
  return Object.keys(value).reduce(
    (acc, key) => ({
      ...acc,
      [key]: deepClone(value[key]),
    }),
    {},
  );
};
