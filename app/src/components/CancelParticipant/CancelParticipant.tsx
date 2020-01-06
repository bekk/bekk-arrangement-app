import React, { useState } from 'react';
import commonStyle from 'src/global/Common.module.scss';
import { useParams } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';

export const CancelParticipantContainer = () => {
  const { eventId, participantEmail } = useParams();
  const [event] = useEvent(eventId);
  const [wasDeleted, setWasDeleted] = useState(false);

  console.log(participantEmail);

  const cancelParticipant = async () => {
    if (eventId && participantEmail) {
      const deleted = await deleteParticipant(eventId, participantEmail);
      console.log(deleted);
      setWasDeleted(true);
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
