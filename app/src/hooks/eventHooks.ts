import { useCallback } from 'react';
import { getEvent, getEvents } from 'src/api/arrangementSvc';
import { IEvent, maybeParseEvent } from 'src/types/event';
import { useLocalStorage } from './localStorage';
import { cachedRemoteData } from 'src/remote-data';

const eventCache = cachedRemoteData<string, IEvent>();

export const useEvent = (id: string) => {
  const event = eventCache.useOne({
    key: id,
    fetcher: useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      return maybeParseEvent(retrievedEvent);
    }, [id]),
  });

  return event;
};

export const useEvents = () => {
  const events = eventCache.useAll(
    useCallback(async () => {
      const eventContracts = await getEvents();
      const events: [string, IEvent][] = eventContracts.map(
        ({ id, ...event }) => {
          return [id, maybeParseEvent(event)];
        }
      );
      return events;
    }, [])
  );
  return events;
};

export const useCreatedEvents = (): {
  createdEventIds: string[];
  setCreatedEventId: (string: string) => void;
} => {
  const [storage, setStorage] = useLocalStorage({
    key: 'created-events',
  });
  const parsedStorage: string[] = storage ? JSON.parse(storage) : [];
  const updateStorage = (string: string) =>
    JSON.stringify([...parsedStorage, string]);

  return {
    createdEventIds: parsedStorage,
    setCreatedEventId: (string: string) => setStorage(updateStorage(string)),
  };
};
