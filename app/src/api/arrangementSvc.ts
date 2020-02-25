import {
  IEventViewModel,
  IEventViewModelWithToken,
  IEventWriteModel,
} from 'src/types/event';
import { post, get, del, put } from './crud';
import {
  IParticipant,
  INewParticipantViewModel,
  IParticipantViewModel,
} from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { serializeEmail } from 'src/types/email';
import { queryStringStringify } from 'src/utils/query-string';

export const postEvent = (
  event: IEventWriteModel
): Promise<IEventViewModelWithToken> =>
  post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: event,
  });

export const putEvent = (
  eventId: string,
  event: IEventWriteModel,
  editToken?: string
): Promise<IEventViewModel> =>
  put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
    body: event,
  });

export const getEvent = (eventId: string): Promise<IEventViewModel> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  });

export const getEvents = (): Promise<IEventViewModel[]> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events`,
  });

export const deleteEvent = (eventId: string, editToken?: string) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
  });

export const getParticipantsForEvent = (
  eventId: string
): Promise<IParticipantViewModel[]> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants`,
  });

export const postParticipant = (
  participant: IParticipant,
  cancelUrlTemplate: string
): Promise<INewParticipantViewModel> =>
  post({
    host: getArrangementSvcUrl(),
    path: `/events/${participant.eventId}/participants/${serializeEmail(
      participant.email
    )}`,
    body: { cancelUrlTemplate },
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
    path: `/events/${eventId}/participants/${participantEmail}${queryStringStringify(
      { cancellationToken }
    )}`,
  });
