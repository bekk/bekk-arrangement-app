import { validate, Editable, IError } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: string };

export type ReactChild = JSX.Element | string | false | undefined;

export const createLocation = (value: string): Editable<string, string> => {
  return {
    validValue: value,
    editValue: value,
    errors: undefined,
  };
};

export const parseDescription = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Beskrivelse må ha minst tre tegn': value.length < 3,
  });
  return validator.resolve(value);
};

export const parseLocation = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Sted må ha minst tre tegn': value.length < 3,
    'Sted kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseTitle = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Tittel må ha minst tre tegn': value.length < 3,
    'Tittel kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseHost = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Arrangør må ha minst tre tegn': value.length < 3,
    'Arrangør kan ha maks 50 tegn': value.length > 50,
  });
  return validator.resolve(value);
};

export const parseMaxAttendees = (value: string): number | IError[] => {
  const number = Number(value);
  const validator = validate<string, number>({
    'Verdien må være et tall': !Number.isInteger(number),
  });
  return validator.resolve(number);
};
export const toEditMaxAttendees = (value: number): string =>
  value !== 0 ? value.toString() : '';

export const parseQuestion = (value: string): string | IError[] => {
  const validator = validate<string, string>({
    'Spørsmål til deltaker kan ha maks 500 tegn': value.length > 500,
  });
  return validator.resolve(value);
};
