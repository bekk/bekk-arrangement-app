import { validate, Result } from './validation';

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
    'Beskrivelse må ha minst tre bokstaver': value.length < 3,
  });

  return validator.resolve(value);
};

export const validateTitle = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Tittel må ha minst tre bokstaver': value.length < 3,
  });

  return validator.resolve(value);
};

export const validateHost = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Arrangør må ha minst tre bokstaver': value.length < 3,
  });

  return validator.resolve(value);
};

export const validateMaxAttendees = (value: string): Result<string, number> => {
  const number = Number(value);
  const validator = validate<string, number>(value, {
    'Verdien må være et tall': !Number.isInteger(number),
    'Må sette maks antall deltakere': !value,
  });

  return validator.resolve(number);
};
