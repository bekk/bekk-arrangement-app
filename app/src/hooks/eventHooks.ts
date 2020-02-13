import { useCallback } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { deserializeEvent, parseEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';
import { useLocalStorage } from './localStorage';
import { useRemoteData } from 'src/remote-data';

export const useEvent = (id: string) => {
  const event = useRemoteData(
    useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      const deserializedEvent = deserializeEvent(retrievedEvent);
      const domainEvent = parseEvent(deserializedEvent);
      if (isOk(domainEvent)) {
        return domainEvent.validValue;
      }
      throw 'Arrangementobjektet kan ikke parses av følgende grunner ' +
        domainEvent.errors.map(x => x.message).join(', ');
    }, [id])
  );

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
