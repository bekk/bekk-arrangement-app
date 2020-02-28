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

export const isValid = <T>(notErrors: T): notErrors is Exclude<T, IError[]> =>
  !isIErrorList(notErrors);

export const error = (message: string): IError => ({
  type: 'Error',
  message,
});

export const warning = (message: string): IError => ({
  type: 'Warning',
  message,
});

export const validate = <To>(validations: Record<string, boolean> = {}) => {
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
