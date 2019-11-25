import { Validate, validate } from './validation';

export interface IDate {
  day: number;
  month: number;
  year: number;
}

export const createDate = (date: string): Validate<string, IDate> => {
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

//Bør nok flyttes ut i en date utils
export const getNow = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const stringifyDate = ({ year, month, day }: IDate) =>
  `${year}-${month}-${day}`;
