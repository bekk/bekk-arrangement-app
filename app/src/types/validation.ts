type ErrorType = 'Error' | 'Warning';

// export type Edit<T> = {
//   [K in keyof T]: Validate<any, T[K]>;
// };

export type Ok<FromType, ValidatedType> = {
  from: FromType;
  validated: ValidatedType;
  errors: undefined;
};

export type Bad<FromType> = {
  from: FromType;
  errors: IError[];
};

export type Result<FromType, ValidatedType> =
  | Ok<FromType, ValidatedType>
  | Bad<FromType>;

export function isOk<FromType, ValidatedType>(
  result: Ok<FromType, ValidatedType> | Bad<FromType>
): result is Ok<FromType, ValidatedType> {
  return result.errors === undefined;
}

export function isBad<FromType, ValidatedType>(
  result: Ok<FromType, ValidatedType> | Bad<FromType>
): result is Bad<FromType> {
  return !isOk(result);
}

export interface IError {
  message: string;
  type: ErrorType;
}

export const getErrors = (errors: IError[] | undefined) => {};

export const error = (message: string): IError => ({
  type: 'Error',
  message,
});

export const warning = (message: string): IError => ({
  type: 'Warning',
  message,
});

// export const valid = <T>(valid: T): Validate<T, T> => ({
//   value: valid,
//   data: valid,
// });

// export type Validate<From, To> = { value: From } & (
//   | { data: To; errors?: undefined }
//   | {
//       data?: undefined;
//       errors: IError[];
//     }
// );

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
  fromValue: From,
  validations: Record<string, boolean> = {}
) => {
  const errorMessages = Object.entries(validations)
    .filter(([errorMessage, isError]) => isError)
    .map(([errorMessage]) => errorMessage);
  return {
    resolve: (validatedValue: To): Result<From, To> => {
      if (errorMessages.length > 0) {
        return {
          from: fromValue,
          errors: errorMessages.map(error),
        };
      }
      return {
        from: fromValue,
        validated: validatedValue,
        errors: undefined,
      };
    },
    reject: (errorMessage: string): Result<From, To> => {
      return {
        from: fromValue,
        errors: [error(errorMessage)],
      };
    },
  };
};
