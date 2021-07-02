//**  Event  **//

import { useLocalStorage } from 'src/hooks/localStorage';

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
      ...validatedStorage.filter((x) => x.eventId !== event.eventId),
      event,
    ]);

  return {
    savedEvents: validatedStorage,
    saveEditableEvents: (event: EditEventToken) =>
      setStorage(updateStorage(event)),
  };
};

export const useEditToken = (eventId: string) => {
  const { savedEvents: createdEvents } = useSavedEditableEvents();
  const event = createdEvents.find((x) => x.eventId === eventId);

  return event?.editToken;
};
//**  Participant  **//

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
    JSON.stringify([
      ...validatedStorage.filter(
        (x) =>
          !(participant.eventId === x.eventId && participant.email === x.email)
      ),
      participant,
    ]);

  const removeFromStorage = (p: { eventId: string; email: string }) =>
    JSON.stringify(
      validatedStorage.filter(
        (x) => !(x.eventId === p.eventId && x.email === p.email)
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
