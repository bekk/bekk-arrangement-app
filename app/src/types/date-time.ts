import {
  IDate,
  parseDate,
  stringifyDate,
  EditDate,
  validateDate,
} from './date';
import {
  ITime,
  validateTime,
  stringifyTime,
  parseTime,
  EditTime,
} from './time';
import { Validate } from './validation';
import { isAfter } from 'date-fns';

export interface IDateTime {
  date: IDate;
  time: ITime;
}

export type EditDateTime = {
  date: EditDate;
  time: EditTime;
};

export const parseDateTime = (datetime: string) => {
  const date = parseDate(datetime);
  const time = parseTime(datetime);

  return { date, time };
};

export const validateDateTime = (
  datetime: EditDateTime
): Validate<EditDateTime, IDateTime> => {
  const { data: date, errors: dataErrors = [] } = validateDate(datetime.date);
  const { data: time, errors: timeErrors = [] } = validateTime(datetime.time);

  if (!date || !time) {
    return {
      value: datetime,
      errors: [...dataErrors, ...timeErrors],
    };
  }

  return { value: datetime, data: { date, time } };
};

export const isAfterNow = ({ date, time }: IDateTime) => {
  const now = new Date(Date.now());
  return isAfter(toDate({ date, time }), now);
};

export const toDate = ({ date, time }: IDateTime) =>
  new Date(date.year, date.month - 1, date.day, time.hour, time.minute);

export const stringifyDateTime = ({ date, time }: IDateTime) =>
  `${stringifyDate(date)}T${stringifyTime(time)}`;

//Bør nok flyttes ut i en date utils
export const getNow = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}T00:00`;
};
