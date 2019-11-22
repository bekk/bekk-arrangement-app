import { Validation, validate, warning, error } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: number };

export const createLocation = (value: string): Validation<string, string> => {
  return {
    value: value,
    data: value,
  };
};

export const createDescription = (
  value: string
): Validation<string, string> => {
  const validator = validate<string, string>(value, {
    'Description must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};
