import { useEffect, useState } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { IEvent, deserializeEvent, parseEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { useLocalStorage } from './localStorage';

export const useEvent = (id: string | undefined): [IEvent | undefined] => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const { catchAndNotify } = useNotification();

  useEffect(() => {
    if (id) {
      catchAndNotify(async () => {
        const retrievedEvent = await getEvent(id);
        const deserializedEvent = deserializeEvent(retrievedEvent);
        const domainEvent = parseEvent(deserializedEvent);
        if (isOk(domainEvent)) {
          setEvent(domainEvent.validValue);
        }
      })();
    }
  }, [id, catchAndNotify]);

  return [event];
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
