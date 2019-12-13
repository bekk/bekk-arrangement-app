import { IEvent, serializeEvent, parseEvent, IEventApi } from 'src/types/event';
import { post, get } from './crud';
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
  const createdEvent = (await get({
    host,
    path: `events/${eventId}`,
  })) as WithId<IEventApi>;
  return parseEvent(createdEvent);
};

export const postParticipant = async (participant: IParticipant) => {
  const createdParticipant = (await post({
    host,
    path: `participant/${participant.email}/events/${participant.eventId}`,
    body: {},
  })) as IParticipantApi;
  return parseParticipant(createdParticipant);
};
