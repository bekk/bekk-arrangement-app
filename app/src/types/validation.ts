export type ErrorType = 'Error' | 'Warning';
const isErrorType = (s: string): s is ErrorType =>
  s === 'Error' || s === 'Warning';

export interface IError {
  message: string;
  type: ErrorType;
}
const isIError = (error: any): error is IError =>
  'message' in error &&
  typeof error.message === 'string' &&
  'type' in error &&
  isErrorType(error.type);

export const isIErrorList = (errors: any): errors is IError[] =>
  Array.isArray(errors) && errors.every(isIError);

export type Valid<EditType, ValidType> = {
  editValue: EditType;
  validValue: ValidType;
  errors: undefined;
};

export type Invalid<EditType> = {
  editValue: EditType;
  errors: IError[];
};

export type Editable<EditType, ValidType> =
  | Valid<EditType, ValidType>
  | Invalid<EditType>;

export function isValid<EditType, ValidType>(
  result: Valid<EditType, ValidType> | Invalid<EditType>
): result is Valid<EditType, ValidType> {
  return result.errors === undefined;
}

export function isInvalid<EditType, ValidType>(
  result: Valid<EditType, ValidType> | Invalid<EditType>
): result is Invalid<EditType> {
  return !isValid(result);
}

export const error = (message: string): IError => ({
  type: 'Error',
  message,
});

export const warning = (message: string): IError => ({
  type: 'Warning',
  message,
});

export const validate = <From, To>(
  validations: Record<string, boolean> = {}
) => {
  const errorMessages = Object.entries(validations)
    .filter(([errorMessage, isError]) => isError)
    .map(([errorMessage]) => errorMessage);
  return {
    resolve: (validatedValue: To) => {
      if (errorMessages.length > 0) {
        return errorMessages.map(error);
      }
      return validatedValue;
    },
    reject: (errorMessage: string) => error(errorMessage),
  };
};
