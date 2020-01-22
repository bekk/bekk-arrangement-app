import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';

export const CancelParticipantContainer = () => {
  const { eventId, participantEmail } = useParams();
  const [event] = useEvent(eventId);
  const [wasDeleted, setWasDeleted] = useState(false);

  const cancelParticipant = async () => {
    if (eventId && participantEmail) {
      const deleted = await deleteParticipant(eventId, participantEmail);
      if (deleted.ok) {
        setWasDeleted(true);
      }
    }
  };

  return (
    <Page>
      <section>
        <Button onClick={cancelParticipant}>Meld av</Button>
        {wasDeleted && (
          <div>{`Du er nå avmeldt arrangementet ${event.title}.`}</div>
        )}
      </section>
    </Page>
  );
};
