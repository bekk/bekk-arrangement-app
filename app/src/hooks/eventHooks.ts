import { useEffect, useState } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { IEvent, deserializeEvent, parseEvent } from 'src/types/event';
import { isOk } from 'src/types/validation';

export const useEvent = (id: string | undefined): [IEvent | undefined] => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const get = async () => {
        const retrievedEvent = await getEvent(id);
        const deserializedEvent = deserializeEvent(retrievedEvent);
        const domainEvent = parseEvent(deserializedEvent);
        if (isOk(domainEvent)) {
          setEvent(domainEvent.validValue);
        } else {
          throw Error(
            `${domainEvent.errors[0].type}: ${domainEvent.errors[0].message}`
          );
        }
      };
      get();
    }
  }, [id]);

  return [event];
};
