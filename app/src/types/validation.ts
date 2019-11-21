type ValidationType = 'ERROR' | 'WARNING';

export interface IValidation {
  message: string;
  type: ValidationType;
}

export const error = (message: string): IValidation => ({
  type: 'ERROR',
  message
});

export const warning = (message: string): IValidation => ({
  type: 'WARNING',
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
    case 'ERROR': {
      return '⛔';
    }
    case 'WARNING': {
      return '⚠️';
    }
    default: {
      return '✅';
    }
  }
};

export const validate = <T>(value: string) => {
  let errors: IValidation[] = [];
  return {
    add: (error: IValidation) => {
      errors = [...errors, error];
    },
    resolve: (data: T): Validation<T> => {
      if (errors) {
        return {
          value,
          data: undefined,
          validationResult: errors
        };
      }
      return {
        value,
        data,
        validationResult: undefined
      };
    },
    reject: (): Validation<T> => {
      return {
        value,
        data: undefined,
        validationResult: errors
      };
    }
  };
};
