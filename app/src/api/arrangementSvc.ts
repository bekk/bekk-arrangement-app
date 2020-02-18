import {
  IEvent,
  serializeEvent,
  IEventContract,
  INewEventViewModel,
} from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import {
  IParticipant,
  INewParticipantViewModel,
  IParticipantViewModel,
} from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { serializeEmail } from 'src/types/email';
import { queryStringStringify } from 'src/utils';

export const postEvent = (event: IEvent) =>
  post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: serializeEvent(event),
  }).then(response => response as INewEventViewModel);

export const putEvent = (
  eventId: string,
  event: IEvent,
  editToken?: string
): Promise<IEventContract> =>
  put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
    body: serializeEvent(event),
  }).then(response => response as IEventContract);

export const getEvent = (eventId: string): Promise<IEventContract> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  }).then(response => response as IEventContract);

export const getEvents = () =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events`,
  }).then(response => response as WithId<IEventContract>[]);

export const deleteEvent = (eventId: string, editToken?: string) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
  });

export const getParticipantsForEvent = (eventId: string) =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants`,
  }).then(response => response as IParticipantViewModel[]);

export const postParticipant = (
  participant: IParticipant,
  redirectUrlTemplate: string
) =>
  post({
    host: getArrangementSvcUrl(),
    path: `/events/${participant.eventId}/participants/${serializeEmail(
      participant.email
    )}`,
    body: { redirectUrlTemplate },
  }).then(response => response as INewParticipantViewModel);

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
