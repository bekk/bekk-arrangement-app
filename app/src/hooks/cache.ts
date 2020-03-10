import { cachedRemoteData } from 'src/remote-data';
import { IEvent, parseEventViewModel } from 'src/types/event';
import { useCallback } from 'react';
import {
  getEvent,
  getEvents,
  getParticipantsForEvent,
} from 'src/api/arrangementSvc';
import {
  IParticipant,
  IParticipantViewModel,
  parseParticipantViewModel,
} from 'src/types/participant';

//**  Event  **//

const eventCache = cachedRemoteData<string, IEvent>();

export const useEvent = (id: string) => {
  return eventCache.useOne({
    key: id,
    fetcher: useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      return parseEventViewModel(retrievedEvent);
    }, [id]),
  });
};

export const useEvents = () => {
  return eventCache.useAll(
    useCallback(async () => {
      const eventContracts = await getEvents();
      return eventContracts.map(({ id, ...event }) => {
        return [id, parseEventViewModel(event)];
      });
    }, [])
  );
};

//**  Participant  **//

const participantsCache = cachedRemoteData<string, IParticipant[]>();

export const useParticipants = (eventId: string) => {
  return participantsCache.useOne({
    key: eventId,
    fetcher: useCallback(async () => {
      const participantContracts = await getParticipantsForEvent(eventId);
      return participantContracts.map((participant: IParticipantViewModel) =>
        parseParticipantViewModel(participant)
      );
    }, [eventId]),
  });
};
