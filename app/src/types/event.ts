import { Result, isOk } from './validation';
import { concatLists, WithId } from '.';
import { IDateTime, EditDateTime, validateDateTime } from './date-time';
import { toEditTime } from './time';
import { toEditDate } from './date';

export type EventId = string;

export type IEventList = Record<EventId, IEvent>;

export interface IEventContract {
  title: string;
  description: string;
  location: string;
  startDate: IDateTime;
  endDate: IDateTime;
  openForRegistrationDate: IDateTime;
  organizerEmail: string;
}

export interface IEvent {
  title: string;
  description: string;
  location: string;
  start: IDateTime;
  end: IDateTime;
  openForRegistration: IDateTime;
}

export interface IEditEvent {
  title: string;
  description: string;
  location: string;
  start: EditDateTime;
  end: EditDateTime;
  openForRegistration: EditDateTime;
}

export const serializeEvent = (event: IEvent): IEventContract => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationDate: event.openForRegistration,
  organizerEmail: 'test@testeepost.com',
});

export const deserializeEvent = (event: IEventContract): IEditEvent => {
  return {
    ...event,
    start: {
      date: toEditDate(event.startDate.date),
      time: toEditTime(event.startDate.time),
    },
    end: {
      date: toEditDate(event.endDate.date),
      time: toEditTime(event.endDate.time),
    },
    openForRegistration: {
      date: toEditDate(event.openForRegistrationDate.date),
      time: toEditTime(event.openForRegistrationDate.time),
    },
  };
};

export const parseEvent = (event: IEditEvent): Result<IEditEvent, IEvent> => {
  const startTimeValidationResult = validateDateTime(event.start);
  const endTimeValidationResult = validateDateTime(event.end);
  const openForRegistrationResult = validateDateTime(event.openForRegistration);

  if (
    isOk(startTimeValidationResult) &&
    isOk(endTimeValidationResult) &&
    isOk(openForRegistrationResult)
  ) {
    return {
      from: event,
      errors: undefined,
      validated: {
        ...event,
        start: startTimeValidationResult.validated,
        end: endTimeValidationResult.validated,
        openForRegistration: openForRegistrationResult.validated,
      },
    };
  }

  const errors = concatLists(
    startTimeValidationResult.errors,
    endTimeValidationResult.errors,
    openForRegistrationResult.errors
  );

  return {
    from: event,
    errors,
  };
};

export const initialEvent: IEvent = {
  title: '',
  description: '',
  location: '',
  start: {
    date: { year: 2019, month: 12, day: 1 },
    time: { hour: 0, minute: 0 },
  },
  end: {
    date: { year: 2019, month: 12, day: 15 },
    time: { hour: 0, minute: 0 },
  },
  openForRegistration: {
    date: { year: 2019, month: 11, day: 15 },
    time: { hour: 0, minute: 0 },
  },
};

export const initialEditEvent: IEditEvent = {
  title: '',
  description: '',
  location: '',
  start: {
    date: '2019-12-02',
    time: ['23', '22'],
  },
  end: {
    date: '2019-12-02',
    time: ['23', '22'],
  },
  openForRegistration: {
    date: '2019-12-02',
    time: ['23', '22'],
  },
};
