import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';
import { stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import style from './CancelParticipant.module.scss';
import queryString from 'query-string';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { viewEventRoute } from 'src/routing';

const useQuery = (key: string) => {
  const {
    location: { search },
  } = useHistory();
  const params = queryString.parse(search);
  if (key in params) {
    const value = params[key];
    if (typeof value === 'string') {
      return value;
    }
  }
};

export const CancelParticipant = () => {
  const { eventId, email: participantEmail } = useParams();
  const [event] = useEvent(eventId);
  const cancellationToken = useQuery('cancellationToken');
  const [wasDeleted, setWasDeleted] = useState(false);
  const { catchAndNotify } = useNotification();
  const history = useHistory();
  const goToEvent = () => eventId && history.push(viewEventRoute(eventId));
  const cameFromEmail = false; // TODO
  
  const cancelParticipant = catchAndNotify(async () => {
    if (eventId && participantEmail) {
      const deleted = await deleteParticipant({
        eventId,
        participantEmail,
        cancellationToken,
      });
      if (deleted.ok) {
        setWasDeleted(true);
      }
    }
  });
  
  if (!event) {
    return (
      <div>
        Ugyldig url!{' '}
        <span role="img" aria-label="sad emoji">
          😔
        </span>
      </div>
    );
  }
  
  const CancelledView = () => (
    <>
      <h1 className={style.header}>Avmelding bekreftet!</h1>
      <div className={style.text}>
        Da er du avmeldt {event.title} den {stringifyDate(event.start.date)} kl{' '}
        {stringifyTime(event.start.time)} - {stringifyTime(event.end.time)}
      </div>
    </>
  );

  const Cancel = () => (
    <>
      <div className={style.text}>Vil du melde deg av?</div>
      <Button onClick={cancelParticipant}>Meld av</Button>
    </>
  )

  const ConfirmView = () => (
    <>
      <h1 className={style.header}>Du er påmeldt!</h1>
      <div className={style.text}>
        Gratulerer, du er nå meldt på {event.title} den{' '}
        {stringifyDate(event.start.date)} kl {stringifyTime(event.start.time)} -{' '}
        {stringifyTime(event.end.time)}! Bekreftelse er sendt på e-post til {participantEmail}.
      </div>
      {cameFromEmail && <Cancel />}
      <Button onClick={goToEvent}>Tilbake til arrangement</Button>
    </>
  );

  return <Page>{wasDeleted ? <CancelledView /> : <ConfirmView />}</Page>;
};
