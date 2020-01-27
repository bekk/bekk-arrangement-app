import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';
import { stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import style from './CancelParticipant.module.scss';

export const CancelParticipant = () => {
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

  const CancelledView = () => (
    <>
      <h1 className={style.header}>Avmelding bekreftet!</h1>
      <div className={style.text}>
        Da er du avmeldt {event.title} den {stringifyDate(event.start.date)} kl{' '}
        {stringifyTime(event.start.time)} - {stringifyTime(event.end.time)}
      </div>
    </>
  );

  const ConfirmView = () => (
    <>
      <h1 className={style.header}>Du er påmeldt!</h1>
      <div className={style.text}>
        Gratulerer, du er nå meldt på {event.title} den{' '}
        {stringifyDate(event.start.date)} kl {stringifyTime(event.start.time)} -{' '}
        {stringifyTime(event.end.time)} med e-post {participantEmail}!
      </div>
      <div className={style.text}>Vil du melde deg av?</div>
      <Button onClick={cancelParticipant}>Meld av</Button>
    </>
  );

  return <Page>{wasDeleted ? <CancelledView /> : <ConfirmView />}</Page>;
};
