import { IDate, createDate, stringifyDate, getNow } from './date';
import { ITime, createTime } from './time';
import { Edit, valid } from './validation';
import { WithId } from '.';

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

export const createInitalEvent = (): Edit<IEvent> => {
  const startDate = createDate(getNow());
  const startTime = createTime(['00', '00']);

  return {
    title: valid(''),
    description: valid(''),
    location: valid(''),
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

export const fromViewModel = (event: IViewModel): [number, Edit<IEvent>] => {
  const startDate = createDate(event.fromDate);
  const startTime = createTime(['00', '00']);
  const endDate = createDate(event.toDate);
  const endTime = createTime(['00', '00']);
  const openForRegistrationDate = createDate(event.fromDate);
  const openForRegistrationTime = createTime(['00', '00']);
  return [
    event.id,
    {
      title: valid(event.title),
      description: valid(event.description),
      location: valid(event.location),
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      openForRegistrationDate: openForRegistrationDate,
      openForRegistrationTime: openForRegistrationTime,
    },
  ];
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
