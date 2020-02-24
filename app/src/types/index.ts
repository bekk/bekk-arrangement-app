import { validate, Result } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: string };

export type ReactChild = JSX.Element | string | false | undefined;

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

export const parseDescription = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Beskrivelse må ha minst tre tegn': value.length < 3,
    'Beskrivelse må ha maks 255 tegn': value.length > 255,
  });
  return validator.resolve(value);
};

export const parseLocation = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Sted må ha minst tre tegn': value.length < 3,
    'Sted må ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseTitle = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Tittel må ha minst tre tegn': value.length < 3,
    'Tittel må ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseHost = (value: string): Result<string, string> => {
  const validator = validate<string, string>(value, {
    'Arrangør må ha minst tre tegn': value.length < 3,
    'Arrangør må ha maks 50 tegn': value.length > 50,
  });
  return validator.resolve(value);
};

export const deserializeMaxAttendees = (value: number): string =>
  value !== 0 ? value.toString() : '';

export const parseMaxAttendees = (value: string): Result<string, number> => {
  const number = Number(value);
  const validator = validate<string, number>(value, {
    'Verdien må være et tall': !Number.isInteger(number),
  });
  return validator.resolve(number);
};
