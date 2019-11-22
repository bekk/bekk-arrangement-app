import { Optional } from '.';

type ValidationType = 'Error' | 'Warning';

export type Edit<T> = {
  [K in keyof T]: Validation<any, T[K]>;
};

export interface IValidation {
  message: string;
  type: ValidationType;
}

export const error = (message: string): IValidation => ({
  type: 'Error',
  message,
});

export const warning = (message: string): IValidation => ({
  type: 'Warning',
  message,
});

export type Validation<From, To> = { value: From } & (
  | { data: To; validationResult?: undefined }
  | {
      data?: undefined;
      validationResult: IValidation[];
    }
);

export const validationTypeAsIcon = (type: ValidationType) => {
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
    resolve: (data: To): Validation<From, To> => {
      if (errorMessages.length > 0) {
        return {
          value,
          data: undefined,
          validationResult: errorMessages.map(error),
        };
      }
      return {
        value,
        data,
        validationResult: undefined,
      };
    },
    reject: (errorMessage: string): Validation<From, To> => {
      return {
        value,
        data: undefined,
        validationResult: [error(errorMessage)],
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
