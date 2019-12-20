import { validate, Result } from './validation';

export interface ITime {
  hour: number;
  minute: number;
}

export type EditTime = [string, string];

export const validateTime = ([_hour, _minutes]: EditTime): Result<
  EditTime,
  ITime
> => {
  const hour = Number(_hour);
  const minute = Number(_minutes);

  const validator = validate<EditTime, ITime>([_hour, _minutes], {
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

export const parseTime = (time: string): EditTime => {
  const timeISO8601 = /([0-9]{1,2}):([0-9]{1,2})/;
  const [, hour = '', minutes = ''] = time.match(timeISO8601) || [];
  return [hour, minutes];
};

export const stringifyTime = ({ hour, minute }: ITime): string =>
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

export const deserializeTime = (time: ITime): EditTime => [
  time.hour.toString(),
  time.minute.toString(),
];
