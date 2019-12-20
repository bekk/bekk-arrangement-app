import { Result, isOk } from './validation';
import { concatLists, validateTitle, validateDescription } from '.';
import { IDateTime, EditDateTime, validateDateTime } from './date-time';
import { deserializeTime } from './time';
import { deserializeDate } from './date';

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
  title: Result<string, string>;
  description: Result<string, string>;
  location: string;
  start: Result<EditDateTime, IDateTime>;
  end: Result<EditDateTime, IDateTime>;
  openForRegistration: Result<EditDateTime, IDateTime>;
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
  const title = validateTitle(event.title);
  const description = validateDescription(event.description);
  const start = validateDateTime({
    date: deserializeDate(event.startDate.date),
    time: deserializeTime(event.startDate.time),
  });
  const end = validateDateTime({
    date: deserializeDate(event.endDate.date),
    time: deserializeTime(event.endDate.time),
  });
  const openForRegistration = validateDateTime({
    date: deserializeDate(event.openForRegistrationDate.date),
    time: deserializeTime(event.openForRegistrationDate.time),
  });
  return {
    ...event,
    title,
    description,
    start,
    end,
    openForRegistration,
  };
};

export const parseEvent = (event: IEditEvent): Result<IEditEvent, IEvent> => {
  if (
    isOk(event.start) &&
    isOk(event.end) &&
    isOk(event.openForRegistration) &&
    isOk(event.title) &&
    isOk(event.description)
  ) {
    return {
      editValue: event,
      errors: undefined,
      validValue: {
        ...event,
        title: event.title.validValue,
        description: event.description.validValue,
        start: event.start.validValue,
        end: event.end.validValue,
        openForRegistration: event.openForRegistration.validValue,
      },
    };
  }

  const errors = concatLists(
    event.start.errors,
    event.end.errors,
    event.openForRegistration.errors
  );

  return {
    editValue: event,
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
  title: validateTitle(''),
  description: validateDescription(''),
  location: '',
  start: validateDateTime({
    date: '2019-12-02',
    time: ['23', '22'],
  }),
  end: validateDateTime({
    date: '2019-12-02',
    time: ['23', '22'],
  }),
  openForRegistration: validateDateTime({
    date: '2019-12-02',
    time: ['23', '22'],
  }),
};
