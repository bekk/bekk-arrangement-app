import {
  IEvent,
  IEventViewModel,
  INewEventViewModel,
  toEventWriteModel,
} from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import {
  IParticipant,
  INewParticipantViewModel,
  toParticipantWriteModel,
  IParticipantViewModelsWithWaitingList,
} from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { queryStringStringify } from 'src/utils/browser-state';
import { toEmailWriteModel } from 'src/types/email';

export const postEvent = (
  event: IEvent,
  editUrlTemplate: string
): Promise<INewEventViewModel> =>
  post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: toEventWriteModel(event, editUrlTemplate),
  });

export const putEvent = (
  eventId: string,
  event: IEvent,
  editToken?: string
): Promise<IEventViewModel> =>
  put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
    body: toEventWriteModel(event),
  });

export const getEvent = (eventId: string): Promise<IEventViewModel> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  });

export const getEvents = (): Promise<WithId<IEventViewModel>[]> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events`,
  });

export const deleteEvent = (
  eventId: string,
  cancellationMessage: string,
  editToken?: string
) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
    body: cancellationMessage,
  });

export const getParticipantsForEvent = (
  eventId: string,
  editToken?: string
): Promise<IParticipantViewModelsWithWaitingList> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants${queryStringStringify({
      editToken,
    })}`,
  });

export const getNumberOfParticipantsForEvent = (
  eventId: string
): Promise<number> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/count`,
  });

export const getWaitinglistSpot = (
  eventId: string,
  email: string
): Promise<number> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${encodeURIComponent(
      email
    )}/waitinglist-spot`,
  });

export const postParticipant = (
  eventId: string,
  participant: IParticipant,
  cancelUrlTemplate: string
): Promise<INewParticipantViewModel> =>
  post({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${encodeURIComponent(
      toEmailWriteModel(participant.email)
    )}`,
    body: toParticipantWriteModel(participant, cancelUrlTemplate),
  });

export const deleteParticipant = ({
  eventId,
  participantEmail,
  cancellationToken,
}: {
  eventId: string;
  participantEmail: string;
  cancellationToken?: string;
}) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${encodeURIComponent(
      participantEmail
    )}${queryStringStringify({ cancellationToken })}`,
  });
