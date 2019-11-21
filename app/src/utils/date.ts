import { Validation, validate, error } from '../types/validation';

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

export const createDate = (date: string): Validation<IDate> => {
  const validator = validate<IDate>(date);

  const dates = date.split('-');

  if (dates.length < 3) {
    validator.add(error('Du må ha med både år, måned og dato'));
    return validator.reject();
  }

  return validator.resolve({
    year: 0,
    month: 0,
    day: 0
  });
};

//Bør nok flyttes ut i en date utils
export const getYearMonthDay = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};
