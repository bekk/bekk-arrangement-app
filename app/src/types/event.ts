import { Result, isOk } from 'src/types/validation';
import {
  concatLists,
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  deserializeMaxAttendees,
  WithId,
} from '.';
import {
  IDateTime,
  EditDateTime,
  parseDateTime,
  deserializeDateTime,
} from 'src/types/date-time';
import { parseEmail, Email, serializeEmail } from 'src/types/email';
import {
  TimeInstanceContract,
  EditTimeInstance,
  TimeInstance,
  deserializeTimeInstance,
  parseTimeInstance,
  serializeTimeInstance,
} from 'src/types/time-instance';
import { addWeeks } from 'date-fns/esm/fp';
import { dateToString } from './date';
import { editEventRoute } from 'src/routing';

export type EventId = string;

export type IEventList = Map<EventId, IEvent>;

export interface INewEventViewModel {
  event: WithId<IEventViewModel>;
  editToken: string;
}

export interface IEventViewModel {
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

export interface IEventWriteModel {
  title: string;
  description: string;
  location: string;
  startDate: IDateTime;
  endDate: IDateTime;
  openForRegistrationTime: TimeInstanceContract;
  organizerName: string;
  organizerEmail: string;
  maxParticipants: number;
  editUrlTemplate: string;
}

export interface IEditEvent {
  title: Result<string, string>;
  description: Result<string, string>;
  location: Result<string, string>;
  start: Result<EditDateTime, IDateTime>;
  end: Result<EditDateTime, IDateTime>;
  openForRegistration: Result<EditTimeInstance, TimeInstance>;
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

export const serializeEvent = (
  event: IEvent,
  redirectUrlTemplate: string = ''
): IEventWriteModel => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationTime: serializeTimeInstance(event.openForRegistrationTime),
  organizerName: event.organizerName,
  organizerEmail: serializeEmail(event.organizerEmail),
  maxParticipants: event.maxParticipants,
  editUrlTemplate: redirectUrlTemplate,
});

export const deserializeEvent = (event: IEventViewModel): IEditEvent => {
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
    openForRegistration: parseTimeInstance(
      deserializeTimeInstance(openForRegistrationTime.getTime().toString())
    ),
    organizerName: parseHost(''),
    organizerEmail: parseEmail(''),
    maxParticipants: parseMaxAttendees(''),
  };
};

export const maybeParseEvent = (eventContract: IEventViewModel): IEvent => {
  const deserializedEvent = deserializeEvent(eventContract);
  const domainEvent = parseEvent(deserializedEvent);
  if (isOk(domainEvent)) {
    return domainEvent.validValue;
  }
  // Man får egt bare lov å kaste new Error
  // men det er tull
  // eslint-disable-next-line
  throw {
    status: 'ERROR',
    userMessage:
      'Arrangementobjektet kan ikke parses av følgende grunner: ' +
      domainEvent.errors.map(x => x.message).join(', '),
  };
};
