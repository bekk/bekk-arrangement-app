import { IDate, parseDate, deserializeDate, validateDate } from './date';
import { ITime, validateTime, stringifyTime, parseTime } from './time';
import { isOk, Result } from './validation';
import { isAfter } from 'date-fns';
import { concatLists } from '.';

export interface IDateTime {
  date: IDate;
  time: ITime;
}

export type EditDateTime = {
  date: string;
  time: [string, string];
};

export const parseDateTime = (datetime: string) => {
  const date = parseDate(datetime);
  const time = parseTime(datetime);

  return { date, time };
};

export const validateDateTime = (
  datetime: EditDateTime
): Result<EditDateTime, IDateTime> => {
  const validationResultDate = validateDate(datetime.date);
  const validationResultTime = validateTime(datetime.time);

  if (isOk(validationResultDate) && isOk(validationResultTime)) {
    return {
      errors: undefined,
      editValue: datetime,
      validValue: {
        date: validationResultDate.validValue,
        time: validationResultTime.validValue,
      },
    };
  }
  const errors = concatLists(
    validationResultTime.errors,
    validationResultDate.errors
  );
  return {
    editValue: datetime,
    errors,
  };
};

export const isAfterNow = ({ date, time }: IDateTime) => {
  const now = new Date();
  return isAfter(toDate({ date, time }), now);
};

export const toDate = ({ date, time }: IDateTime) =>
  new Date(date.year, date.month - 1, date.day, time.hour, time.minute);

export const stringifyDateTime = ({ date, time }: IDateTime) =>
  `${deserializeDate(date)}T${stringifyTime(time)}`;

//Bør nok flyttes ut i en date utils
export const getNow = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}T00:00`;
};
