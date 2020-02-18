import { useState, useEffect } from 'react';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { getParticipantsForEvent } from 'src/api/arrangementSvc';
import { isOk } from 'src/types/validation';
import {
  deserializeParticipant,
  parseParticipant,
  IParticipant,
} from 'src/types/participant';
import { useLocalStorage } from 'src/hooks/localStorage';

export const useParticipants = (
  id: string | undefined
): [IParticipant[] | undefined] => {
  const [participants, setParticipants] = useState<IParticipant[] | undefined>(
    undefined
  );
  const { catchAndNotify } = useNotification();

  useEffect(() => {
    if (id) {
      catchAndNotify(async () => {
        const retrievedParticipants = await getParticipantsForEvent(id);
        const deserializedParticipants = retrievedParticipants.map(
          participant => deserializeParticipant(participant)
        );
        const domainParticipants = deserializedParticipants.map(participant =>
          parseParticipant(participant)
        );
        const validParticipants = domainParticipants.mapIf(p =>
          isOk(p) ? p.validValue : undefined
        );
        setParticipants(validParticipants);
      })();
    }
  }, [id, catchAndNotify]);

  return [participants];
};

type Participation = {
  eventId: string;
  email: string;
  cancellationToken: string;
};
const isCreatedEvent = (x: any): x is Participation =>
  'eventId' in x &&
  typeof x.eventId === 'string' &&
  'email' in x &&
  typeof x.email === 'string' &&
  'cancellationToken' in x &&
  typeof x.cancellationToken === 'string';

export const useParticipations = () => {
  const [storage, setStorage] = useLocalStorage({
    key: 'participations',
  });

  const parsedStorage: unknown[] = storage ? JSON.parse(storage) : [];
  const validatedStorage = Array.isArray(parsedStorage)
    ? parsedStorage.filter(isCreatedEvent)
    : [];

  const updateStorage = (participant: Participation) =>
    JSON.stringify([...validatedStorage, participant]);

  const removeFromStorage = (cancellationToken: string) =>
    JSON.stringify(
      validatedStorage.filter(x => x.cancellationToken !== cancellationToken)
    );

  return {
    participations: validatedStorage,
    setParticipant: (participant: Participation) =>
      setStorage(updateStorage(participant)),
    removeParticipant: (cancellationToken: string) =>
      setStorage(removeFromStorage(cancellationToken)),
  };
};
