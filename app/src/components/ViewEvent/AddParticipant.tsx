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
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { ValidatedTextArea } from 'src/components/Common/ValidatedTextArea/ValidatedTextArea';

interface Props {
  eventId: string;
  event: IEvent;
}

export const AddParticipant = ({ eventId, event }: Props) => {
  const { catchAndNotify } = useNotification();
  const history = useHistory();

  const [participant, setParticipant] = useState<IEditParticipant>(
    toEditParticipant(initalParticipant())
  );

  const validParticipant = validateParticipation(participant);

  const timeLeft = useTimeLeft(event.openForRegistrationTime);

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
          email: encodeURIComponent(email),
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
        color="White"
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
        color="White"
        onChange={(email: string) =>
          setParticipant({
            ...participant,
            email,
          })
        }
      />
      {participantQuestion !== undefined && (
        <ValidatedTextArea
          label={participantQuestion}
          placeholder={'Kommentar til arrangør'}
          value={participant.comment}
          validation={parseComment}
          backgroundColor="White"
          minRow={3}
          onChange={(comment: string) =>
            setParticipant({
              ...participant,
              comment,
            })
          }
        />
      )}
      <br />
      <Button onClick={participate} disabled={timeLeft.difference > 0}>
        Meld meg på
      </Button>
    </>
  );
};

const validateParticipation = (participant: IEditParticipant) => {
  const vParticipant = parseEditParticipant(participant);
  if (isValid(vParticipant)) {
    return vParticipant;
  }
};
