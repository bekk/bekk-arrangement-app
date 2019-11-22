import { IDate, createDate, getYearMonthDay } from './date';
import { Validation } from './validation';
import { format, addHours } from 'date-fns';
import {
  ITime,
  createTitle,
  createDescription,
  createLocation,
  createTime
} from './index';

export interface IEvent {
  title: Validation<string>;
  description: Validation<string>;
  location: Validation<string>;
  startDate: Validation<IDate>;
  startTime: Validation<ITime>;
  endDate: Validation<IDate>;
  endTime: Validation<ITime>;
  openForRegistrationDate: Validation<IDate>;
  openForRegistrationTime: Validation<ITime>;
}

export const createInitalEvent = () => {
  const date = new Date();

  const todaysDate = format(date, 'y-MM-dd');
  const startTime = format(date, 'H:mm');
  const endTime = format(addHours(date, 1), 'H:mm');

  return {
    title: createTitle(''),
    description: createDescription(''),
    location: createLocation(''),
    startDate: createDate(todaysDate),
    startTime: createTime(startTime),
    endDate: createDate(todaysDate),
    endTime: createTime(endTime),
    openForRegistrationDate: createDate(todaysDate),
    openForRegistrationTime: createTime(endTime)
  };
};
