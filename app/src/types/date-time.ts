import {
  IDate,
  deserializeDate,
  IDateContract,
  parseDate,
  EditDate,
  stringifyDate,
  datesInOrder,
  isSameDate,
} from 'src/types/date';
import {
  ITime,
  parseTime,
  stringifyTime,
  ITimeContract,
  EditTime,
  timesInOrder,
  deserializeTime,
} from 'src/types/time';
import { isOk, Result } from 'src/types/validation';
import { isAfter } from 'date-fns';
import { concatLists } from '.';

export type IDateTimeContract = {
  date: IDateContract;
  time: ITimeContract;
};

export type EditDateTime = {
  date: EditDate;
  time: EditTime;
};

export interface IDateTime {
  date: IDate;
  time: ITime;
}

export const parseDateTime = (
  datetime: EditDateTime
): Result<EditDateTime, IDateTime> => {
  const date = parseDate(datetime.date);
  const time = parseTime(datetime.time);

  if (isOk(date) && isOk(time)) {
    return {
      errors: undefined,
      editValue: datetime,
      validValue: { date: date.validValue, time: time.validValue },
    };
  }

  const errors = concatLists(date.errors, time.errors);
  return {
    errors,
    editValue: datetime,
  };
};

export const deserializeDateTime = (
  datetime: IDateTimeContract
): EditDateTime => ({
  date: deserializeDate(datetime.date),
  time: deserializeTime(datetime.time),
});

export const isInTheFuture = ({ date, time }: IDateTime) => {
  const now = new Date();
  return isAfter(toDate({ date, time }), now);
};

export const isInOrder = ({
  first,
  last,
}: {
  first: IDateTime;
  last: IDateTime;
}) => {
  if (datesInOrder({ first: first.date, last: last.date })) {
    return true;
  }
  if (
    isSameDate(first.date, last.date) &&
    timesInOrder({ first: first.time, last: last.time })
  ) {
    return true;
  }
  return false;
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
