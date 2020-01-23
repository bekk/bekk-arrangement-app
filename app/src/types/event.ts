import { Result, isOk } from './validation';
import {
  concatLists,
  validateTitle,
  validateDescription,
  validateHost,
  validateMaxAttendees,
} from '.';
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
  organizerName: string;
  organizerEmail: string;
  maxParticipants: number;
}

export interface IEvent {
  title: string;
  description: string;
  location: string;
  start: IDateTime;
  end: IDateTime;
  openForRegistration: IDateTime;
  organizerName: string;
  organizerEmail: string;
  maxParticipants: number;
}

export interface IEditEvent {
  title: Result<string, string>;
  description: Result<string, string>;
  location: string;
  start: Result<EditDateTime, IDateTime>;
  end: Result<EditDateTime, IDateTime>;
  openForRegistration: Result<EditDateTime, IDateTime>;
  organizerName: Result<string, string>;
  organizerEmail: Result<string, string>;
  maxParticipants: Result<string, number>;
}

export const serializeEvent = (event: IEvent): IEventContract => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationDate: event.openForRegistration,
  organizerName: event.organizerName,
  organizerEmail: 'test@testeepost.com',
  maxParticipants: event.maxParticipants,
});

export const deserializeEvent = (event: IEventContract): IEditEvent => {
  const title = validateTitle(event.title);
  const organizerName = validateTitle(event.organizerName);
  const organizerEmail = validateHost(event.organizerEmail);
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
  const maxParticipants = validateMaxAttendees(
    event.maxParticipants.toString()
  );
  return {
    ...event,
    title,
    description,
    start,
    end,
    openForRegistration,
    organizerName,
    organizerEmail,
    maxParticipants,
  };
};

export const parseEvent = (event: IEditEvent): Result<IEditEvent, IEvent> => {
  if (
    isOk(event.start) &&
    isOk(event.end) &&
    isOk(event.openForRegistration) &&
    isOk(event.title) &&
    isOk(event.description) &&
    isOk(event.organizerName) &&
    isOk(event.organizerEmail) &&
    isOk(event.maxParticipants)
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
        organizerName: event.organizerName.validValue,
        organizerEmail: event.organizerEmail.validValue,
        maxParticipants: event.maxParticipants.validValue,
      },
    };
  }

  const errors = concatLists(
    event.start.errors,
    event.end.errors,
    event.openForRegistration.errors,
    event.title.errors,
    event.description.errors,
    event.organizerName.errors,
    event.organizerEmail.errors,
    event.maxParticipants.errors
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
  organizerName: '',
  organizerEmail: '',
  maxParticipants: 1,
};

export const initialEditEvent: IEditEvent = {
  title: validateTitle('Pølsespisekonkurranse 2019'),
  description: validateDescription(
    'Dette er informasjon om et event som du har laget med vår fantastiske app. Du er kjempeflink, men vi er flinkere'
  ),
  location: 'Strøm Larsens Pølsekompani',
  start: validateDateTime({
    date: '2020-03-10',
    time: ['23', '22'],
  }),
  end: validateDateTime({
    date: '2020-03-11',
    time: ['23', '22'],
  }),
  openForRegistration: validateDateTime({
    date: '2020-02-15',
    time: ['23', '22'],
  }),
  organizerName: validateTitle('Pølsekongen'),
  organizerEmail: validateHost('Matkomiteen'),
  maxParticipants: validateMaxAttendees('20'),
};
