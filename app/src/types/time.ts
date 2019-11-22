import { Validation, validate } from './validation';

export const createTime = (
  value: [string, string]
): Validation<[string, string], ITime> => {
  const hour = Number(value[0]);
  const minute = Number(value[1]);

  const validator = validate<[string, string], ITime>(value, {
    "Can't have more than 60 minutes in an hour": minute > 59,
    "Can't have negative number of minutes": minute < 0,
    'There are not more than 23 hours in a day': hour > 23,
    "Can't have a negative amount of hours in a day": hour < 0,
    'Hours needs to be a number': isNaN(hour),
    'Minutes needs to be a number': isNaN(minute),
    'Number of hours needs to be an integer': !Number.isInteger(hour),
    'Number of minutes needs to be an integer': !Number.isInteger(minute),
  });

  return validator.resolve({ hour, minute });
};

export const createTitle = (value: string): Validation<string, string> => {
  const validator = validate<string, string>(value, {
    'Title must be more than 3 characters': value.length <= 3,
  });

  return validator.resolve(value);
};

export interface ITime {
  hour: number;
  minute: number;
}

export const stringifyTime = ({ hour, minute }: ITime) => `${hour}:${minute}`;
