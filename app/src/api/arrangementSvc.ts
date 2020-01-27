import { IEvent, serializeEvent, IEventContract } from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import { IParticipantContract, IParticipant } from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { serializeEmail } from 'src/types/email';

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
  }).then(response => response as IParticipantContract);

export const deleteParticipant = (eventId: string, participantEmail: string) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${participantEmail}`,
  });
