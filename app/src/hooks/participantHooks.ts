import { useState, useEffect } from 'react';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { getParticipantsForEvent } from 'src/api/arrangementSvc';
import { isOk } from 'src/types/validation';
import {
  deserializeParticipant,
  parseParticipant,
  IParticipant,
} from 'src/types/participant';

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
