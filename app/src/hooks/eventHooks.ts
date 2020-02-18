import { useCallback } from 'react';
import { getEvent, getEvents } from 'src/api/arrangementSvc';
import { IEvent, maybeParseEvent } from 'src/types/event';
import { useLocalStorage } from './localStorage';
import { cachedRemoteData } from 'src/remote-data';

const eventCache = cachedRemoteData<string, IEvent>();

export const useEvent = (id: string) => {
  return eventCache.useOne({
    key: id,
    fetcher: useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      return maybeParseEvent(retrievedEvent);
    }, [id]),
  });
};

export const useEvents = () => {
  return eventCache.useAll(
    useCallback(async () => {
      const eventContracts = await getEvents();
      return eventContracts.map(({ id, ...event }) => {
        return [id, maybeParseEvent(event)];
      });
    }, [])
  );
};

type CreatedEvent = {
  eventId: string;
  editToken: string;
};
const isCreatedEvent = (x: any): x is CreatedEvent =>
  'eventId' in x &&
  typeof x.eventId === 'string' &&
  'editToken' in x &&
  typeof x.editToken === 'string';

export const useCreatedEvents = (): {
  createdEvents: CreatedEvent[];
  setCreatedEvent: (event: CreatedEvent) => void;
} => {
  const [storage, setStorage] = useLocalStorage({
    key: 'created-events',
  });

  const parsedStorage: unknown[] = storage ? JSON.parse(storage) : [];
  const validatedStorage = Array.isArray(parsedStorage)
    ? parsedStorage.filter(isCreatedEvent)
    : [];

  const updateStorage = (event: CreatedEvent) =>
    JSON.stringify([...validatedStorage, event]);

  return {
    createdEvents: validatedStorage,
    setCreatedEvent: (event: CreatedEvent) => setStorage(updateStorage(event)),
  };
};
