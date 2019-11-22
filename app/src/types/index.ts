import { Validation, validate, warning, error } from './validation';

export const createLocation = (value: string): Validation<string> => {
  return {
    value: value,
    data: value
  };
};

export const createDescription = (value: string): Validation<string> => {
  const validator = validate<string>(value, {
    'Description must be more than 3 characters': value.length <= 3
  });

  return validator.resolve(value);
};

export const createTime = (value: string): Validation<ITime> => {
  const time = value.split(':');
  if (time.length < 2) {
    return validate<ITime>(value).reject(
      'Time must be specified in hh:mm format'
    );
  }

  const hour = Number(time[0]);
  const minute = Number(time[1]);

  const validator = validate<ITime>(value, {
    "Can't have more than 60 minutes in an hour": minute > 59,
    "Can't have negative number of minutes": minute < 0,
    'There are not more than 23 hours in a day': hour > 23,
    "Can't have a negative amount of hours in a day": hour < 0,
    'Hours needs to be a number': isNaN(hour),
    'Minutes needs to be a number': isNaN(minute),
    'Number of hours needs to be an integer': !Number.isInteger(hour),
    'Number of minutes needs to be an integer': !Number.isInteger(minute)
  });

  return validator.resolve({ hour, minute });
};

export const createTitle = (value: string): Validation<string> => {
  const validator = validate<string>(value, {
    'Title must be more than 3 characters': value.length <= 3
  });

  return validator.resolve(value);
};

export interface ITime {
  hour: number;
  minute: number;
}
