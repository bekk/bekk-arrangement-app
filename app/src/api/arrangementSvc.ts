import { IEvent, serializeEvent, toEvent, IEventApi } from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import {
  IParticipant,
  IParticipantApi,
  parseParticipant,
} from 'src/types/participant';

const host = 'https://api.dev.bekk.no/arrangement-svc/';

export const postEvent = async (event: IEvent) => {
  return await post({
    host,
    path: 'events',
    body: serializeEvent(event),
  })
    .then(response => response as WithId<IEventApi>)
    .then(event => toEvent(event));
};

export const putEvent = async (eventId: string, event: IEvent) => {
  return await put({
    host,
    path: `events/${eventId}`,
    body: serializeEvent(event),
  })
    .then(response => response as WithId<IEventApi>)
    .then(event => toEvent(event));
};

export const getEvent = async (eventId: string) => {
  return await get({
    host,
    path: `events/${eventId}`,
  })
    .then(response => response as WithId<IEventApi>)
    .then(event => toEvent(event));
};

export const getEvents = async () => {
  return await get({
    host,
    path: `events`,
  })
    .then(response => response as WithId<IEventApi>[])
    .then(events => events.map(toEvent));
};

export const deleteEvent = async (eventId: string) => {
  await del({
    host,
    path: `events/${eventId}`,
    body: {},
  });
};

export const postParticipant = async (participant: IParticipant) => {
  return await post({
    host,
    path: `participant/${participant.email}/events/${participant.eventId}`,
    body: {},
  })
    .then(response => response as IParticipantApi)
    .then(participant => parseParticipant(participant));
};
