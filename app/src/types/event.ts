import { format, addHours, getHours, getMinutes } from 'date-fns';
import { IDate, createDate, stringifyDate } from './date';
import { ITime, createTitle, createTime } from './time';
import { Edit } from './validation';
import { createDescription, Optional, WithId, createLocation } from '.';

export interface IEvent {
  title: string;
  description: string;
  location: string;
  startDate: IDate;
  startTime: ITime;
  endDate: IDate;
  endTime: ITime;
  openForRegistrationDate: IDate;
  openForRegistrationTime: ITime;
}

export type IEditEvent = Edit<IEvent>;

export const createInitalEvent = (): IEvent => {
  const date = new Date();

  const startYear = date.getFullYear();
  const startMonth = date.getMonth() + 1;
  const startDay = date.getDate();
  const startHours = getHours(date);
  const startMinutes = getMinutes(date);

  const startDate = { year: startYear, month: startMonth, day: startDay };
  const startTime = { hour: startHours, minute: startMinutes };

  return {
    title: '',
    description: '',
    location: '',
    startDate,
    startTime,
    endDate: startDate,
    endTime: startTime,
    openForRegistrationDate: startDate,
    openForRegistrationTime: startTime,
  };
};

export const toWriteModel = (event: IEvent): IWriteModel => ({
  title: event.title,
  description: event.description,
  location: event.location,
  fromDate: stringifyDate(event.startDate),
  toDate: stringifyDate(event.endDate),
  responsibleEmployee: 1296,
});

export const fromViewModel = (event: IViewModel): Optional<WithId<IEvent>> => {
  const startDate = createDate(event.fromDate);
  const startTime = createTime(['00', '00']);
  const endDate = createDate(event.toDate);
  const endTime = createTime(['00', '00']);
  const openForRegistrationDate = createDate(event.fromDate);
  const openForRegistrationTime = createTime(['00', '00']);
  if (
    startDate.validationResult ||
    startTime.validationResult ||
    endDate.validationResult ||
    endTime.validationResult ||
    openForRegistrationDate.validationResult ||
    openForRegistrationTime.validationResult
  ) {
    return undefined;
  }
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: startDate.data,
    startTime: startTime.data,
    endDate: endDate.data,
    endTime: endTime.data,
    openForRegistrationDate: openForRegistrationDate.data,
    openForRegistrationTime: openForRegistrationTime.data,
  };
};

export interface IWriteModel {
  title: string;
  description: string;
  location: string;
  fromDate: string;
  toDate: string;
  responsibleEmployee: number;
}

export type IViewModel = WithId<IWriteModel>;
