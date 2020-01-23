import { validate, Result } from './validation';
import { format } from 'date-fns';

export interface IDate {
  day: number;
  month: number;
  year: number;
}

// export type EditDate = string;

export const parseDate = (date: string) => date.substring(0, 10);

export const validateDate = (date: string): Result<string, IDate> => {
  const dateISO8601 = /^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})/;
  const dates = date.match(dateISO8601) || [];

  const year = Number(dates[1]);
  const month = Number(dates[2]);
  const day = Number(dates[3]);

  const validator = validate<string, IDate>(dates[0] || date, {
    'Need year, month and date in YYYY-MM-DD format': dates.length <= 3,
    'Year needs to be a number': isNaN(year),
    'Year needs to be an integer': !Number.isInteger(year),
    'Month needs to be a number': isNaN(month),
    'Month needs to be an integer': !Number.isInteger(month),
    'Day needs to be a number': isNaN(day),
    'Day needs to be an integer': !Number.isInteger(day),
  });

  return validator.resolve({
    year,
    month,
    day,
  });
};

export const dateAsText = (date: IDate) => {
  return format(
    new Date(Date.UTC(date.year, date.month - 1, date.day)),
    'cccc, dd MMMM yyyy'
  );
};

export const isSameDate = (date: IDate, otherDate: IDate) => {
  return (
    date.year === otherDate.year &&
    date.month === otherDate.month &&
    date.day === otherDate.day
  );
};

export const deserializeDate = ({ year, month, day }: IDate) =>
  `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;

export const stringifyDate = ({ year, month, day }: IDate) =>
  `${day.toString().padStart(2, '0')}.${month
    .toString()
    .padStart(2, '0')}.${year}`;
