import { useEffect, useState } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { IEvent, deserializeEvent, parseEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';

export const useEvent = (id: string | undefined): [IEvent | undefined] => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const { catchAndNotify } = useNotification();

  useEffect(() => {
    if (id) {
      const notify = catchAndNotify(async () => {
        const retrievedEvent = await getEvent(id);
        const deserializedEvent = deserializeEvent(retrievedEvent);
        const domainEvent = parseEvent(deserializedEvent);
        if (isOk(domainEvent)) {
          setEvent(domainEvent.validValue);
        }
      });
      notify();
    }
  }, [id, catchAndNotify]);

  return [event];
};
