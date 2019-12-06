import { Validate } from './validation';
import { WithId } from '.';
import {
  IDateTime,
  EditDateTime,
  validateDateTime,
  toEditDateTime,
} from './date-time';
import { IEventContract } from './contract-types';

type Key = number;

export interface IEvent {
  title: string;
  description: string;
  location: string;
  start: IDateTime;
  end: IDateTime;
  openForRegistration: IDateTime;
  organizer: string;
  participants: string;
}

export interface IEditEvent {
  title: string;
  description: string;
  location: string;
  start: EditDateTime;
  end: EditDateTime;
  openForRegistration: EditDateTime;
  organizer: string;
  participants: string;
}

export const parseEvent = (event: IViewModel): [Key, IEditEvent] => {
  const start = toEditDateTime(event.startDate);
  const end = toEditDateTime(event.endDate);
  const openForRegistration = toEditDateTime(event.openForRegistrationDate);

  return [
    event.id,
    {
      title: event.title,
      description: event.description,
      location: event.location,
      organizer: event.organizerEmail,
      start,
      end,
      openForRegistration,
      participants: event.participants,
    },
  ];
};

export const validateEvent = (
  event: IEditEvent
): Validate<IEditEvent, IEvent> => {
  const { data: start, errors: startErrors = [] } = validateDateTime(
    event.start
  );
  const { data: end, errors: endErrors = [] } = validateDateTime(event.end);
  const {
    data: openForRegistration,
    errors: openForRegistrationErrors = [],
  } = validateDateTime(event.openForRegistration);

  if (!start || !end || !openForRegistration) {
    return {
      value: event,
      errors: [...startErrors, ...endErrors, ...openForRegistrationErrors],
    };
  }

  return {
    value: event,
    data: {
      title: event.title,
      description: event.description,
      location: event.location,
      organizer: event.organizer,
      start,
      end,
      openForRegistration,
      participants: event.participants,
    },
  };
};

export type IWriteModel = IEventContract;
export type IViewModel = WithId<IWriteModel>;

export const serializeEvent = (event: IEvent): IWriteModel => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationDate: event.openForRegistration,
  organizerEmail: event.organizer,
  participants: event.participants,
});

export const initialEvent: IEvent = {
  title: '',
  description: '',
  location: '',
  organizer: '',
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
  participants: '',
};
