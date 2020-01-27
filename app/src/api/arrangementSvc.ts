import { IEvent, serializeEvent, IEventContract } from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import { IParticipant, IParticipantViewModel } from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { serializeEmail } from 'src/types/email';
import queryString from 'query-string';

export const postEvent = (event: IEvent) =>
  post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: serializeEvent(event),
  }).then(response => response as WithId<IEventContract>);

export const putEvent = (
  eventId: string,
  event: IEvent
): Promise<IEventContract> =>
  put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
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

export const deleteEvent = (eventId: string) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  });

export const postParticipant = (participant: IParticipant) =>
  post({
    host: getArrangementSvcUrl(),
    path: `/events/${participant.eventId}/participants/${serializeEmail(
      participant.email
    )}`,
    body: {},
  }).then(response => response as IParticipantViewModel);

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
    path: `/events/${eventId}/participants/${participantEmail}?${queryString.stringify(
      { cancellationToken }
    )}`,
  });
