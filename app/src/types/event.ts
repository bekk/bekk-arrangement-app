import { Validate } from './validation';
import { WithId } from '.';
import {
  IDateTime,
  stringifyDateTime,
  EditDateTime,
  parseDateTime,
  validateDateTime,
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
}

export interface IEditEvent {
  title: string;
  description: string;
  location: string;
  start: EditDateTime;
  end: EditDateTime;
  openForRegistration: EditDateTime;
}

export const parseEvent = (event: IViewModel): [Key, IEditEvent] => {
  const start = parseDateTime(event.fromDate);
  const end = parseDateTime(event.toDate);
  const openForRegistration = parseDateTime(event.fromDate);

  return [
    event.id,
    {
      title: event.title,
      description: event.description,
      location: event.location,
      start,
      end,
      openForRegistration,
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
      start,
      end,
      openForRegistration,
    },
  };
};

export type IWriteModel = IEventContract;
export type IViewModel = WithId<IWriteModel>;

export const serializeEvent = (event: IEvent): IWriteModel => ({
  title: event.title,
  description: event.description,
  location: event.location,
  fromDate: stringifyDateTime(event.start),
  toDate: stringifyDateTime(event.end),
  responsibleEmployee: 1296,
});

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
