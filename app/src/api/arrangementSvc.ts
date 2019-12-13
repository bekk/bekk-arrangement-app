import { IEvent, serializeEvent, parseEvent, IEventApi } from 'src/types/event';
import { post, get, del } from './crud';
import { WithId } from 'src/types';
import {
  IParticipant,
  IParticipantApi,
  parseParticipant,
} from 'src/types/participant';

const host = 'https://api.dev.bekk.no/arrangement-svc/';

export const postEvent = async (event: IEvent) => {
  const createdEvent = (await post({
    host,
    path: 'events',
    body: serializeEvent(event),
  })) as WithId<IEventApi>;
  return parseEvent(createdEvent);
};

export const getEvent = async (eventId: string) => {
  const event = (await get({
    host,
    path: `events/${eventId}`,
  })) as WithId<IEventApi>;
  return parseEvent(event);
};

export const getEvents = async () => {
  const events = (await get({
    host,
    path: `events`,
  })) as WithId<IEventApi>[];
  return events.map(parseEvent);
};

export const deleteEvent = async (eventId: string) => {
  await del({
    host,
    path: `events/${eventId}`,
    body: {},
  });
};

export const postParticipant = async (participant: IParticipant) => {
  const createdParticipant = (await post({
    host,
    path: `participant/${participant.email}/events/${participant.eventId}`,
    body: {},
  })) as IParticipantApi;
  return parseParticipant(createdParticipant);
};
