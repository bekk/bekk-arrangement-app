import { IDate } from '../utils/date';
import { Validation, validate, warning, error } from './validation';

export interface IEvent {
  title: Validation<string>;
  description: Validation<string>;
  location: Validation<string>;
  startDate: Validation<IDate>;
  startTime: ITime;
  endDate: Validation<IDate>;
  endTime: ITime;
  openForRegistrationDate: Validation<IDate>;
  openForRegistrationTime: ITime;
}

export const createLocation = (value: string): Validation<string> => {
  return {
    value: value,
    data: value
  };
};

export const createDescription = (value: string): Validation<string> => {
  const validator = validate<string>(value);

  if (value.length < 4) {
    validator.add(warning('Should be more than 3 characters'));
    return validator.reject();
  }
  return validator.resolve(value);
};

export const createTitle = (value: string): Validation<string> => {
  const validator = validate<string>(value);

  if (value.length < 4) {
    validator.add(error('Must be more than 3 characters'));
    validator.reject();
  }
  return validator.resolve(value);
};

export interface ITime {
  hour: number;
  minute: number;
}
