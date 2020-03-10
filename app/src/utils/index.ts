export const identityFunction = <T>(x: T) => x;

export const concatLists = <T>(...list: (T[] | unknown)[]): T[] =>
  list.flatMap(materialize as any);

const materialize = <T>(list: T[] | undefined): T[] => {
  return Array.isArray(list) ? list : [];
};
