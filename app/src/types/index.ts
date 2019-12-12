import { Validate, validate, IError } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: string };
export type Result<Ok> = Ok | { errors: IError[] };

export const createLocation = (value: string): Validate<string, string> => {
  return {
    value: value,
    data: value,
  };
};

export const createDescription = (value: string): Validate<string, string> => {
  const validator = validate<string, string>(value, {
    'Description must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};

export const createTitle = (value: string): Validate<string, string> => {
  const validator = validate<string, string>(value, {
    'Title must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};
