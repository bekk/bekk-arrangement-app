import { useCallback } from 'react';
import { getEvent, getEvents } from 'src/api/arrangementSvc';
import { IEvent, parseEventViewModel } from 'src/types/event';
import { useLocalStorage } from './localStorage';
import { cachedRemoteData } from 'src/remote-data';
import { useHistory } from 'react-router';
import { Optional } from 'src/types';
import { previewEventRoute } from 'src/routing';

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

export const eventPreview = {
  useGoto: (eventId: string) => {
    const history = useHistory();
    return (event: IEvent) => history.push(previewEventRoute(eventId), event);
  },
  useEvent: () => {
    const history = useHistory();
    return history.location.state as Optional<IEvent>;
  },
};

type EditEventToken = {
  eventId: string;
  editToken: string;
};
const isEditEventTokenType = (x: any): x is EditEventToken =>
  'eventId' in x &&
  typeof x.eventId === 'string' &&
  'editToken' in x &&
  typeof x.editToken === 'string';

export const useSavedEditableEvents = (): {
  savedEvents: EditEventToken[];
  saveEditableEvents: (event: EditEventToken) => void;
} => {
  const [storage, setStorage] = useLocalStorage({
    key: 'editable-events',
  });

  const parsedStorage: unknown[] = storage ? JSON.parse(storage) : [];
  const validatedStorage = Array.isArray(parsedStorage)
    ? parsedStorage.filter(isEditEventTokenType)
    : [];

  const updateStorage = (event: EditEventToken) =>
    JSON.stringify([
      ...validatedStorage.filter(x => x.eventId !== event.eventId),
      event,
    ]);

  return {
    savedEvents: validatedStorage,
    saveEditableEvents: (event: EditEventToken) =>
      setStorage(updateStorage(event)),
  };
};
