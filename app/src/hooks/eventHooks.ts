import { useCallback } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { deserializeEvent, parseEvent, IEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';
import { useLocalStorage } from './localStorage';
import {
  useRemoteData,
  RemoteData,
  isLoading,
  hasLoaded,
  isNotRequested,
} from 'src/remote-data';

let eventCache: Record<string, RemoteData<IEvent>> = {};

export const useEvent = (id: string) => {
  const event = useRemoteData(
    useCallback(async () => {
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
    }, [id])
  );

  const cachedEvent = eventCache[id];
  if (cachedEvent) {
    if ((isNotRequested(event) || isLoading(event)) && hasLoaded(cachedEvent)) {
      return cachedEvent;
    }
  }

  eventCache[id] = event;

  return event;
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
