import React, { useState } from 'react';
import commonStyle from 'src/style/Common.module.scss';
import { useParams } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';

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
    <article className={commonStyle.container}>
      <section>
        <button onClick={cancelParticipant}>Meld av</button>
        {wasDeleted && (
          <div>{`Du er nå avmeldt arrangementet ${event.title}.`}</div>
        )}
      </section>
    </article>
  );
};
