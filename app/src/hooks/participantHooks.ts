import { useCallback } from 'react';
import { getParticipantsForEvent } from 'src/api/arrangementSvc';
import {
  IParticipant,
  IParticipantViewModel,
  maybeParseParticipant,
} from 'src/types/participant';
import { useLocalStorage } from 'src/hooks/localStorage';
import { cachedRemoteData } from 'src/remote-data';

const participantsCache = cachedRemoteData<string, IParticipant>();
const hashKey = (participant: IParticipantViewModel) =>
  participant.eventId.concat(participant.email);

export const useParticipants = (id: string) => {
  return participantsCache.useAll(
    useCallback(async () => {
      const participantContracts = await getParticipantsForEvent(id);
      return participantContracts.map((participant: IParticipantViewModel) => {
        return [hashKey(participant), maybeParseParticipant(participant)];
      });
    }, [id])
  );
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
