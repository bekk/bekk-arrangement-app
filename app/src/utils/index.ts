import { IError, isIErrorList } from 'src/types/validation';

export const identityFunction = <T>(x: T) => x;

export const concatLists = <T>(...list: (T[] | unknown)[]): T[] =>
  list.flatMap(materialize as any);

const materialize = <T>(list: T[] | undefined): T[] => {
  return Array.isArray(list) ? list : [];
};

export const listOfErrors = (obj: Record<string, unknown>): IError[] =>
  Object.values(obj)
    .filter(isIErrorList)
    .flat();

export const isErrorFree = <T>(
  x: T
): x is { [K in keyof T]: Exclude<T[K], IError[]> } =>
  !Object.values(x).some(isIErrorList);
