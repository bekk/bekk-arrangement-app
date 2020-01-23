import { IEvent, serializeEvent, IEventContract } from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import { IParticipantContract, IParticipant } from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';

export const postEvent = async (event: IEvent) => {
  return await post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: serializeEvent(event),
  }).then(response => response as WithId<IEventContract>);
};

export const putEvent = async (
  eventId: string,
  event: IEvent
): Promise<IEventContract> => {
  return await put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
    body: serializeEvent(event),
  }).then(response => response as IEventContract);
};

export const getEvent = async (eventId: string): Promise<IEventContract> => {
  return await get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  }).then(response => response as IEventContract);
};

export const getEvents = async () => {
  return await get({
    host: getArrangementSvcUrl(),
    path: `/events`,
  }).then(response => response as WithId<IEventContract>[]);
};

export const deleteEvent = async (eventId: string) => {
  await del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  });
};

export const postParticipant = async (participant: IParticipant) => {
  return await post({
    host: getArrangementSvcUrl(),
    path: `/participant/${participant.email}/events/${participant.eventId}`,
    body: {},
  }).then(response => response as IParticipantContract);
};

export const deleteParticipant = async (
  eventId: string,
  participantEmail: string
) => {
  return await del({
    host: getArrangementSvcUrl(),
    path: `/participant/${participantEmail}/events/${eventId}`,
  });
};
