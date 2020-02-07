import { validate, Result } from './validation';

export type ITimeContract = ITime;

export type EditTime = [string, string];

export interface ITime {
  hour: number;
  minute: number;
}

export const parseTime = ([_hour, _minutes]: EditTime): Result<
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
    'Hours needs to be a number': isNaN(hour) || _hour === '',
    'Minutes needs to be a number': isNaN(minute) || _minutes === '',
    'Number of hours needs to be an integer': !Number.isInteger(hour),
    'Number of minutes needs to be an integer': !Number.isInteger(minute),
  });

  return validator.resolve({ hour, minute });
};

export const stringifyTime = ({ hour, minute }: ITime): string =>
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

export const deserializeTime = (time: ITimeContract): EditTime => [
  time.hour.toString().padStart(2, '0'),
  time.minute.toString().padStart(2, '0'),
];

export const serializeTime = (time: ITime): ITimeContract => time;
