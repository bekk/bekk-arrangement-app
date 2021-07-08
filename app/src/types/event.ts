import { IError, assertIsValid, listOfErrors } from 'src/types/validation';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  WithId,
  parseQuestion,
  toEditMaxAttendees,
} from '.';
import {
  IDateTime,
  EditDateTime,
  toEditDateTime,
  parseEditDateTime,
} from 'src/types/date-time';
import {
  Email,
  toEditEmail,
  parseEditEmail,
  toEmailWriteModel,
} from 'src/types/email';
import {
  TimeInstanceContract,
  TimeInstanceEdit,
  TimeInstance,
  parseTimeInstanceViewModel,
  toTimeInstanceWriteModel,
  toEditTimeInstance,
  parseEditTimeInstance,
} from 'src/types/time-instance';
import { addWeeks } from 'date-fns/esm/fp';
import { parseDateViewModel, dateToIDate } from 'src/types/date';
import { parseName } from 'src/types/participant';

import { getEmailAndNameFromJWT } from 'src/auth';

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
  participantQuestion?: string;
  hasWaitingList: boolean;
  isCancelled: boolean;
  isExternal: boolean;
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
  participantQuestion?: string;
  hasWaitingList: boolean;
  isExternal: boolean;
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
  participantQuestion?: string;
  hasWaitingList: boolean;
  isCancelled: boolean;
  isExternal: boolean;
}

export interface IEditEvent {
  title: string;
  description: string;
  location: string;
  start: EditDateTime;
  end: EditDateTime;
  openForRegistrationTime: TimeInstanceEdit;
  organizerName: string;
  organizerEmail: string;
  maxParticipants: string;
  participantQuestion?: string;
  hasWaitingList: boolean;
  isCancelled: boolean;
  isExternal: boolean;
}

export const parseEditEvent = ({
  title,
  description,
  location,
  start,
  end,
  openForRegistrationTime,
  organizerName,
  organizerEmail,
  maxParticipants,
  participantQuestion,
  hasWaitingList,
  isCancelled,
  isExternal,
}: IEditEvent): IEvent | IError[] => {
  const event = {
    title: parseTitle(title),
    description: parseDescription(description),
    location: parseLocation(location),
    start: parseEditDateTime(start),
    end: parseEditDateTime(end),
    openForRegistrationTime: parseEditTimeInstance(openForRegistrationTime),
    organizerName: parseName(organizerName),
    organizerEmail: parseEditEmail(organizerEmail),
    maxParticipants: parseMaxAttendees(maxParticipants),
    participantQuestion: parseQuestion(participantQuestion),
    hasWaitingList: hasWaitingList,
    isCancelled: isCancelled,
    isExternal: isExternal,
  };

  try {
    assertIsValid(event);
  } catch {
    return listOfErrors(event);
  }

  return event;
};

export const toEventWriteModel = (
  event: IEvent,
  editUrlTemplate: string = ''
): IEventWriteModel => ({
  ...event,
  openForRegistrationTime: toTimeInstanceWriteModel(
    event.openForRegistrationTime
  ),
  organizerEmail: toEmailWriteModel(event.organizerEmail),
  startDate: event.start,
  endDate: event.end,
  editUrlTemplate,
});

export const parseEventViewModel = (eventView: IEventViewModel): IEvent => {
  const title = parseTitle(eventView.title);
  const location = parseLocation(eventView.location);
  const description = parseDescription(eventView.description);

  const start = parseDateViewModel(eventView.startDate);
  const end = parseDateViewModel(eventView.endDate);
  const openForRegistration = parseTimeInstanceViewModel(
    eventView.openForRegistrationTime
  );

  const organizerName = parseHost(eventView.organizerName);
  const organizerEmail = parseEditEmail(eventView.organizerEmail);
  const maxParticipants = eventView.maxParticipants;
  const participantQuestion = parseQuestion(eventView.participantQuestion);
  const hasWaitingList = eventView.hasWaitingList;
  const isCancelled = eventView.isCancelled;
  const isExternal = eventView.isExternal;

  const event = {
    title,
    location,
    description,
    start,
    end,
    openForRegistrationTime: openForRegistration,
    organizerName,
    organizerEmail,
    maxParticipants,
    participantQuestion,
    hasWaitingList,
    isCancelled,
    isExternal,
  };

  assertIsValid(event);

  return event;
};

export const toEditEvent = ({
  title,
  description,
  location,
  start,
  end,
  openForRegistrationTime,
  organizerName,
  organizerEmail,
  maxParticipants,
  participantQuestion,
  hasWaitingList,
  isCancelled,
  isExternal,
}: IEvent): IEditEvent => ({
  title,
  description,
  location,
  start: toEditDateTime(start),
  end: toEditDateTime(end),
  openForRegistrationTime: toEditTimeInstance(openForRegistrationTime),
  organizerName,
  organizerEmail: toEditEmail(organizerEmail),
  maxParticipants: toEditMaxAttendees(maxParticipants),
  participantQuestion,
  hasWaitingList,
  isCancelled,
  isExternal,
});

export const initialEvent = (): IEvent => {
  const eventStartDate = addWeeks(2, new Date());
  const openForRegistrationTime = addWeeks(-1, eventStartDate);
  const { email, name } = getEmailAndNameFromJWT();
  return {
    title: '',
    description: '',
    location: '',
    start: {
      date: dateToIDate(eventStartDate),
      time: { hour: 17, minute: 0 },
    },
    end: {
      date: dateToIDate(eventStartDate),
      time: { hour: 20, minute: 0 },
    },
    openForRegistrationTime,
    organizerName: name ?? '',
    organizerEmail: { email: email ?? '' },
    maxParticipants: 0,
    participantQuestion: undefined,
    hasWaitingList: false,
    isCancelled: false,
    isExternal: false,
  };
};
