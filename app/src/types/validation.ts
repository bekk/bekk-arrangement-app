import { Optional } from '.';

type ErrorType = 'Error' | 'Warning';

export type Edit<T> = {
  [K in keyof T]: Validate<any, T[K]>;
};

export interface IError {
  message: string;
  type: ErrorType;
}

export const error = (message: string): IError => ({
  type: 'Error',
  message,
});

export const warning = (message: string): IError => ({
  type: 'Warning',
  message,
});

export const valid = <T>(valid: T): Validate<T, T> => ({
  value: valid,
  data: valid,
});

export type Validate<From, To> = { value: From } & (
  | { data: To; errors?: undefined }
  | {
      data?: undefined;
      errors: IError[];
    }
);

export const validationTypeAsIcon = (type: ErrorType) => {
  switch (type) {
    case 'Error': {
      return '⛔';
    }
    case 'Warning': {
      return '⚠️';
    }
  }
};

export const validate = <From, To>(
  value: From,
  validations: Record<string, boolean> = {}
) => {
  const errorMessages = Object.entries(validations)
    .filter(([errorMessage, isError]) => isError)
    .map(([errorMessage]) => errorMessage);
  return {
    resolve: (data: To): Validate<From, To> => {
      if (errorMessages.length > 0) {
        return {
          value,
          data: undefined,
          errors: errorMessages.map(error),
        };
      }
      return {
        value,
        data,
        errors: undefined,
      };
    },
    reject: (errorMessage: string): Validate<From, To> => {
      return {
        value,
        data: undefined,
        errors: [error(errorMessage)],
      };
    },
  };
};

export const fromEditModel = <T>(model: Edit<T>): Optional<T> => {
  const entries = Object.entries(model) as [string, any][];
  const validatedModel = entries.mapIf(([key, value]) => {
    if (value.data !== undefined) {
      return [key, value.data];
    }
  });
  if (validatedModel.length === entries.length) {
    return validatedModel.reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {}
    ) as T;
  }
};

export const toEditModel = <T>(model: T): Edit<T> => {
  const entries = Object.entries(model) as [string, any][];
  const validatedModel: [string, any][] = entries.map(([key, value]) => [
    key,
    { value, data: value },
  ]);
  return validatedModel.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  ) as Edit<T>;
};
