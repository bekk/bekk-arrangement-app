import { Validate } from './validation';
import { WithId } from '.';
import { IDateTime, EditDateTime, validateDateTime } from './date-time';
import { toEditTime } from './time';
import { toEditDate } from './date';

export interface IEventApi {
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

export const serializeEvent = (event: IEvent): IEventApi => ({
  title: event.title,
  description: event.description,
  location: event.location,
  startDate: event.start,
  endDate: event.end,
  openForRegistrationDate: event.openForRegistration,
  organizerEmail: '1296',
});

export const toEvent = (event: WithId<IEventApi>): WithId<IEvent> => {
  return {
    ...event,
    start: event.startDate,
    end: event.endDate,
    openForRegistration: event.openForRegistrationDate,
  };
};

export const toEditEvent = (event: IEvent): IEditEvent => ({
  ...event,
  start: {
    date: toEditDate(event.start.date),
    time: toEditTime(event.start.time),
  },
  end: {
    date: toEditDate(event.end.date),
    time: toEditTime(event.end.time),
  },
  openForRegistration: {
    date: toEditDate(event.openForRegistration.date),
    time: toEditTime(event.openForRegistration.time),
  },
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
