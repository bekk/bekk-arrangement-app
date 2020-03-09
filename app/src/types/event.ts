import { IError, assertIsValid } from 'src/types/validation';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  WithId,
  parseQuestion,
  toEditMaxAttendees,
  parseHasRegistrationOpening,
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
import { listOfErrors } from 'src/utils';

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
  participantQuestion: string;
  hasRegistrationOpening: boolean;
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
  participantQuestion: string;
  hasRegistrationOpening: boolean;
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
  participantQuestion: string;
  hasRegistrationOpening: boolean;
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
  participantQuestion: string;
  hasRegistrationOpening: boolean;
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
  hasRegistrationOpening,
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
    hasRegistrationOpening: parseHasRegistrationOpening(hasRegistrationOpening),
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
  const hasRegistrationOpening = parseHasRegistrationOpening(
    eventView.hasRegistrationOpening
  );

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
    hasRegistrationOpening,
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
  hasRegistrationOpening,
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
  hasRegistrationOpening,
});

export const initialEvent = (): IEvent => {
  const eventStartDate = addWeeks(2, new Date());
  const openForRegistrationTime = addWeeks(-1, eventStartDate);
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
    organizerName: '',
    organizerEmail: { email: '' },
    maxParticipants: 0,
    participantQuestion: 'Allergier, preferanser eller noe annet på hjertet?',
    hasRegistrationOpening: true,
  };
};
