type ValidationType = 'Error' | 'Warning';

export interface IValidation {
  message: string;
  type: ValidationType;
}

export const error = (message: string): IValidation => ({
  type: 'Error',
  message
});

export const warning = (message: string): IValidation => ({
  type: 'Warning',
  message
});

export type Validation<T> = { value: string } & (
  | { data: T; validationResult?: undefined }
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

export const validate = <T>(
  value: string,
  validations: Record<string, boolean> = {}
) => {
  const errorMessages = Object.entries(validations)
    .filter(([errorMessage, isError]) => isError)
    .map(([errorMessage]) => errorMessage);
  return {
    resolve: (data: T): Validation<T> => {
      if (errorMessages.length > 0) {
        return {
          value,
          data: undefined,
          validationResult: errorMessages.map(error)
        };
      }
      return {
        value,
        data,
        validationResult: undefined
      };
    },
    reject: (errorMessage: string): Validation<T> => {
      return {
        value,
        data: undefined,
        validationResult: [error(errorMessage)]
      };
    }
  };
};
