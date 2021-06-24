import { cachedRemoteData } from 'src/remote-data';
import { IEvent, parseEventViewModel } from 'src/types/event';
import { useCallback } from 'react';
import {
  getEvent,
  getEvents,
  getNumberOfParticipantsForEvent,
  getParticipantsForEvent,
  getWaitinglistSpot,
} from 'src/api/arrangementSvc';
import {
  IParticipantViewModel,
  parseParticipantViewModel,
  IParticipantsWithWaitingList,
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

const participantsCache =
  cachedRemoteData<string, IParticipantsWithWaitingList>();

export const useParticipants = (eventId: string, editToken?: string) => {
  return participantsCache.useOne({
    key: eventId,
    fetcher: useCallback(async () => {
      const { attendees, waitingList } = await getParticipantsForEvent(
        eventId,
        editToken
      );
      return {
        attendees: attendees.map(parseParticipantViewModel),
        waitingList: waitingList?.map(parseParticipantViewModel),
      };
    }, [eventId]),
  });
};

const numberOfParticipantsCache = cachedRemoteData<string, number>();

export const useNumberOfParticipants = (eventId: string) => {
  return numberOfParticipantsCache.useOne({
    key: eventId,
    fetcher: useCallback(async () => {
      const numberOfParticipants = await getNumberOfParticipantsForEvent(
        eventId
      );
      return numberOfParticipants;
    }, [eventId]),
  });
};

const waitinglistSpotCache = cachedRemoteData<string, number>();

export const useWaitinglistSpot = (eventId: string, email: string) => {
  return waitinglistSpotCache.useOne({
    key: `${eventId}:${email}`,
    fetcher: useCallback(async () => {
      const waitinglistSpot = await getWaitinglistSpot(eventId, email);
      return waitinglistSpot;
    }, [eventId, email]),
  });
};
