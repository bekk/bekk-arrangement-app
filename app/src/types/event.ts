import { Result, isOk } from './validation';
import {
  concatLists,
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  deserializeMaxAttendees,
} from '.';
import {
  IDateTime,
  EditDateTime,
  parseDateTime,
  deserializeDateTime,
} from './date-time';
import { parseEmail, Email, serializeEmail } from './email';
import {
  TimeInstanceContract,
  EditTimeInstance,
  TimeInstance,
  deserializeTimeInstance,
  parseTimeInstance,
  serializeTimeInstance,
} from './time-instance';
import { addWeeks } from 'date-fns/esm/fp';
import { dateToString } from './date';

export type EventId = string;

export type IEventList = Record<EventId, IEvent>;

export interface IEventContract {
  title: string;
  description: string;
  location: string;
  startDate: IDateTime;
  endDate: IDateTime;
  openForRegistrationTime: TimeInstanceContract;
  organizerName: string;
  organizerEmail: string;
  maxParticipants: number;
}

export interface IEditEvent {
  title: Result<string, string>;
  description: Result<string, string>;
  location: Result<string, string>;
  start: Result<EditDateTime, IDateTime>;
  end: Result<EditDateTime, IDateTime>;
  openForRegistration: Result<EditTimeInstance, Date>;
  organizerName: Result<string, string>;
  organizerEmail: Result<string, Email>;
  maxParticipants: Result<string, number>;
}

export interface IEvent {
  title: string;
  description: string;
  location: string;
  start: IDateTime;
  end: IDateTime;
  openForRegistrationTime: TimeInstance;
  organizerName: string;
  organizerEmail: Email;
  maxParticipants: number;
}

export const serializeEvent = (event: IEvent): IEventContract => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationTime: serializeTimeInstance(event.openForRegistrationTime),
  organizerName: event.organizerName,
  organizerEmail: serializeEmail(event.organizerEmail),
  maxParticipants: event.maxParticipants,
});

export const deserializeEvent = (event: IEventContract): IEditEvent => {
  const title = parseTitle(event.title);
  const location = parseLocation(event.location);
  const description = parseDescription(event.description);

  const start = parseDateTime(deserializeDateTime(event.startDate));
  const end = parseDateTime(deserializeDateTime(event.endDate));
  const openForRegistration = parseTimeInstance(
    deserializeTimeInstance(event.openForRegistrationTime)
  );

  const organizerName = parseHost(event.organizerName);
  const organizerEmail = parseEmail(event.organizerEmail);
  const maxParticipants = parseMaxAttendees(
    deserializeMaxAttendees(event.maxParticipants)
  );

  return {
    title,
    location,
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
    isOk(event.location) &&
    isOk(event.description) &&
    isOk(event.organizerName) &&
    isOk(event.organizerEmail) &&
    isOk(event.maxParticipants)
  ) {
    return {
      editValue: event,
      errors: undefined,
      validValue: {
        title: event.title.validValue,
        description: event.description.validValue,
        location: event.location.validValue,
        start: event.start.validValue,
        end: event.end.validValue,
        openForRegistrationTime: event.openForRegistration.validValue,
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

export const initialEditEvent = (): IEditEvent => {
  const eventStartDate = addWeeks(2, new Date());
  const openForRegistrationTime = addWeeks(-1, eventStartDate);
  return {
    title: parseTitle(''),
    description: parseDescription(''),
    location: parseLocation(''),
    start: parseDateTime({
      date: dateToString(eventStartDate),
      time: ['17', '00'],
    }),
    end: parseDateTime({
      date: dateToString(eventStartDate),
      time: ['20', '00'],
    }),
    openForRegistration: parseTimeInstance(openForRegistrationTime.toJSON()),
    organizerName: parseHost(''),
    organizerEmail: parseEmail(''),
    maxParticipants: parseMaxAttendees(''),
  };
};
