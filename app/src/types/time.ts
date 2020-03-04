import { validate, IError } from './validation';
import { identityFunction } from 'src/utils';

export type ITimeContract = ITime;
export type ITimeViewModel = ITimeContract;
export type ITimeWriteModel = ITimeContract;

export interface ITime {
  hour: number;
  minute: number;
}

export type EditTime = [string, string];

export const parseEditTime = ([_hour, _minutes]: EditTime):
  | ITime
  | IError[] => {
  const hour = Number(_hour);
  const minute = Number(_minutes);

  const validator = validate<ITime>({
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

export const toEditTime = ({ hour, minute }: ITime): EditTime => [
  hour.toString().padStart(2, '0'),
  minute.toString().padStart(2, '0'),
];

export const parseTimeViewModel = identityFunction;
export const toTimeWriteModel = identityFunction;

// Util functions

export const stringifyTime = ({ hour, minute }: ITime): string =>
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

export const timesInOrder = ({
  first,
  last,
}: {
  first: ITime;
  last: ITime;
}) => {
  if (first.hour < last.hour) {
    return true;
  }
  if (first.hour === last.hour && first.minute < last.minute) {
    return true;
  }
  return false;
};
