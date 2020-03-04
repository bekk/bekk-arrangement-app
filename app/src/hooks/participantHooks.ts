import { useCallback } from 'react';
import { getParticipantsForEvent } from 'src/api/arrangementSvc';
import {
  IParticipant,
  IParticipantViewModel,
  parseParticipantViewModel,
} from 'src/types/participant';
import { useLocalStorage } from 'src/hooks/localStorage';
import { cachedRemoteData } from 'src/remote-data';

const participantsCache = cachedRemoteData<string, IParticipant[]>();

export const useParticipants = (eventId: string) => {
  return participantsCache.useOne({
    key: eventId,
    fetcher: useCallback(async () => {
      const participantContracts = await getParticipantsForEvent(eventId);
      return participantContracts.map((participant: IParticipantViewModel) =>
        parseParticipantViewModel(participant)
      );
    }, [eventId]),
  });
};

type Participation = {
  eventId: string;
  email: string;
  cancellationToken: string;
};
const isParticipationAndHasCancellationToken = (x: any): x is Participation =>
  'eventId' in x &&
  typeof x.eventId === 'string' &&
  'email' in x &&
  typeof x.email === 'string' &&
  'cancellationToken' in x &&
  typeof x.cancellationToken === 'string';

export const useSavedParticipations = () => {
  const [storage, setStorage] = useLocalStorage({
    key: 'participations',
  });

  const parsedStorage: unknown[] = storage ? JSON.parse(storage) : [];
  const validatedStorage = Array.isArray(parsedStorage)
    ? parsedStorage.filter(isParticipationAndHasCancellationToken)
    : [];

  const updateStorage = (participant: Participation) =>
    JSON.stringify([...validatedStorage, participant]);

  const removeFromStorage = (p: { eventId: string; email: string }) =>
    JSON.stringify(
      validatedStorage.filter(
        x => !(x.eventId === p.eventId && x.email === p.email)
      )
    );

  return {
    savedParticipations: validatedStorage,
    saveParticipation: (participant: Participation) =>
      setStorage(updateStorage(participant)),
    removeSavedParticipant: (participant: { eventId: string; email: string }) =>
      setStorage(removeFromStorage(participant)),
  };
};
