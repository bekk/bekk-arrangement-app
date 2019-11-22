import { Validation, validate, error } from './validation';
import { ITime } from '.';

export class Date2 {
  constructor(day: number, month: number, year: number) {
    this.day = day;
    this.month = month;
    this.year = year;
  }

  private day: number;
  private month: number;
  private year: number;
}

export interface IDate {
  day: number;
  month: number;
  year: number;
}

export const createDate = (date: string): Validation<string, IDate> => {
  //const tryDate = new Date(date); //test denne

  const dates = date.split('-');
  // const year = dates[0]; //vil år alltid være først?
  // const month = dates[1];
  //check if valid date
  const validator = validate<string, IDate>(date, {
    'Need year, month and date in YYYY-MM-DD format': dates.length < 3,
  });

  return validator.resolve({
    year: 0,
    month: 0,
    day: 0,
  });
};

//Bør nok flyttes ut i en date utils
export const getYearMonthDay = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const stringifyDate = ({ year, month, day }: IDate) =>
  `${year}-${month}-${day}`;
