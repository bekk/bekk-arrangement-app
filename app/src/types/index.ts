import { validate, IError, Result } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: string };

export const concatLists = <T>(...list: Optional<T[]>[]): T[] =>
  list.flatMap(materialize);

export const materialize = <T>(list: Optional<T[]>): T[] => {
  return list === undefined ? [] : list;
};

export const createLocation = (value: string): Result<string, string> => {
  return {
    validValue: value,
    editValue: value,
    errors: undefined,
  };
};

export const validateDescription = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Description must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};

export const validateTitle = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Title must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};
