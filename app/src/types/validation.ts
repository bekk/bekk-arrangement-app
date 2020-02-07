export type ErrorType = 'Error' | 'Warning';

export type Ok<EditType, ValidType> = {
  editValue: EditType;
  validValue: ValidType;
  errors: undefined;
};

export type Bad<EditType> = {
  editValue: EditType;
  errors: IError[];
};

export type Result<EditType, ValidType> =
  | Ok<EditType, ValidType>
  | Bad<EditType>;

export function isOk<EditType, ValidType>(
  result: Ok<EditType, ValidType> | Bad<EditType>
): result is Ok<EditType, ValidType> {
  return result.errors === undefined;
}

export function isBad<EditType, ValidType>(
  result: Ok<EditType, ValidType> | Bad<EditType>
): result is Bad<EditType> {
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
          editValue: fromValue,
          errors: errorMessages.map(error),
        };
      }
      return {
        editValue: fromValue,
        validValue: validatedValue,
        errors: undefined,
      };
    },
    reject: (errorMessage: string): Result<From, To> => {
      return {
        editValue: fromValue,
        errors: [error(errorMessage)],
      };
    },
  };
};

export function toEdit<T>(x: T) {
  return { errors: undefined, editValue: x, validValue: x };
}
