import { useCallback } from 'react';
import { getEvent, getEvents } from 'src/api/arrangementSvc';
import { deserializeEvent, parseEvent, IEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';
import { useLocalStorage } from './localStorage';
import { cachedRemoteData } from 'src/remote-data';

const eventCache = cachedRemoteData<string, IEvent>();

export const useEvent = (id: string) => {
  const event = eventCache.useOne({
    key: id,
    fetcher: useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      const deserializedEvent = deserializeEvent(retrievedEvent);
      const domainEvent = parseEvent(deserializedEvent);
      if (isOk(domainEvent)) {
        return domainEvent.validValue;
      }
      return Promise.reject({
        userMessage:
          'Arrangementobjektet kan ikke parses av følgende grunner ' +
          domainEvent.errors.map(x => x.message).join(', '),
      });
    }, [id]),
  });

  return event;
};

export const useEvents = () => {
  const events = eventCache.useAll(
    useCallback(async () => {
      const eventContracts = await getEvents();
      const events: [string, IEvent][] = eventContracts.mapIf(
        ({ id, ...event }) => {
          const parsedEvent = parseEvent(deserializeEvent(event));
          if (isOk(parsedEvent)) {
            return [id, parsedEvent.validValue];
          }
        }
      );
      return events;
    }, [])
  );
  return events;
};

export const useRecentlyCreatedEvent = (): {
  createdEventId: string | undefined;
  setCreatedEventId: (string: string) => void;
} => {
  const [storage, setStorage] = useLocalStorage({
    key: 'recently-created-event',
  });
  return {
    createdEventId: storage,
    setCreatedEventId: setStorage,
  };
};
