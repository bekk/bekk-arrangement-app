import React, { useState } from 'react';
import {
  IEditParticipant,
  toEditParticipant,
  initalParticipant,
  parseEditParticipant,
  parseName,
  parseComment,
} from 'src/types/participant';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { parseEditEmail } from 'src/types/email';
import { Button } from 'src/components/Common/Button/Button';
import { IEvent } from 'src/types/event';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { cancelParticipantRoute, confirmParticipantRoute } from 'src/routing';
import { postParticipant } from 'src/api/arrangementSvc';
import { isValid } from 'src/types/validation';
import { useHistory } from 'react-router';
import { useSavedParticipations } from 'src/hooks/saved-tokens';

interface Props {
  eventId: string;
  event: IEvent;
  isWaitlisted: boolean;
}

export const AddParticipant = ({ eventId, event, isWaitlisted }: Props) => {
  const { catchAndNotify } = useNotification();
  const history = useHistory();

  const [participant, setParticipant] = useState<IEditParticipant>(
    toEditParticipant(initalParticipant)
  );

  const validParticipant = validateParticipation(participant);

  const { saveParticipation } = useSavedParticipations();
  const participate = catchAndNotify(async () => {
    if (validParticipant) {
      const cancelUrlTemplate =
        document.location.origin +
        cancelParticipantRoute({
          eventId: '{eventId}',
          email: '{email}',
          cancellationToken: '{cancellationToken}',
        });
      const {
        participant: { email },
        cancellationToken,
      } = await postParticipant(eventId, validParticipant, cancelUrlTemplate);

      saveParticipation({ eventId, email, cancellationToken });

      history.push(
        confirmParticipantRoute({
          eventId,
          email,
        })
      );
    }
  });

  const participantQuestion = event.participantQuestion;

  return (
    <>
      <ValidatedTextInput
        label={'Navn'}
        placeholder={'Ola Nordmann'}
        value={participant.name}
        validation={parseName}
        onChange={(name: string) =>
          setParticipant({
            ...participant,
            name,
          })
        }
      />
      <ValidatedTextInput
        label={'E-post'}
        placeholder={'ola.nordmann@bekk.no'}
        value={participant.email}
        validation={parseEditEmail}
        onChange={(email: string) =>
          setParticipant({
            ...participant,
            email,
          })
        }
      />
      <ValidatedTextInput
        label={participantQuestion}
        placeholder={'Kommentar til arrangør'}
        value={participant.comment}
        validation={parseComment}
        onChange={(comment: string) =>
          setParticipant({
            ...participant,
            comment,
          })
        }
      />
      <br />
      <Button onClick={participate}>Meld meg på</Button>
    </>
  );
};

const validateParticipation = (participant: IEditParticipant) => {
  const vParticipant = parseEditParticipant(participant);
  if (isValid(vParticipant)) {
    return vParticipant;
  }
};
