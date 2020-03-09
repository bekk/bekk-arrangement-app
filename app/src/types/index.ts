import { validate, IError } from './validation';

export type Optional<T> = T | undefined;
export type WithId<T> = T & { id: string };

export type ReactChild = JSX.Element | string | false | undefined;

export const parseDescription = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Beskrivelse må ha minst tre tegn': value.length < 3,
  });
  return validator.resolve(value);
};

export const parseLocation = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Sted må ha minst tre tegn': value.length < 3,
    'Sted kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseTitle = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Tittel må ha minst tre tegn': value.length < 3,
    'Tittel kan ha maks 60 tegn': value.length > 60,
  });
  return validator.resolve(value);
};

export const parseHost = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Arrangør må ha minst tre tegn': value.length < 3,
    'Arrangør kan ha maks 50 tegn': value.length > 50,
  });
  return validator.resolve(value);
};

export const parseMaxAttendees = (value: string): number | IError[] => {
  const number = Number(value);
  const validator = validate<number>({
    'Verdien må være et tall': !Number.isInteger(number),
  });
  return validator.resolve(number);
};
export const toEditMaxAttendees = (value: number): string =>
  value !== 0 ? value.toString() : '';

export const parseQuestion = (value: string): string | IError[] => {
  const validator = validate<string>({
    'Spørsmål til deltaker kan ha maks 500 tegn': value.length > 500,
  });
  return validator.resolve(value);
};

export const parseHasRegistrationOpening = (
  value: boolean
): boolean | IError[] => {
  const validator = validate<boolean>({
    // Denne er enten true eller false. Kan ikke valideres på samme måte som de andre
  });
  return validator.resolve(value);
};
