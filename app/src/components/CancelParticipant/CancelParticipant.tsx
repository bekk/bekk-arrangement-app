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
import { hasLoaded, isBad } from 'src/remote-data';
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
  const { eventId = 'UGYLDIG_URL', email: participantEmail } = useParams();
  const remoteEvent = useEvent(eventId);
  const cancellationToken = useQuery('cancellationToken');
  const [wasDeleted, setWasDeleted] = useState(false);
  const { catchAndNotify } = useNotification();
  const history = useHistory();
  const goToEvent = () => eventId && history.push(viewEventRoute(eventId));

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

  if (isBad(remoteEvent)) {
    return (
      <div>
        Ugyldig url!{' '}
        <span role="img" aria-label="sad emoji">
          😔
        </span>
      </div>
    );
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Laster...</div>;
  }

  const event = remoteEvent.data;

  const HasCancelledView = () => (
    <>
      <h1 className={style.header}>Avmelding bekreftet!</h1>
      <div className={style.text}>
        Da er du avmeldt {event.title} den {stringifyDate(event.start.date)} kl{' '}
        {stringifyTime(event.start.time)} - {stringifyTime(event.end.time)}
      </div>
    </>
  );

  const CancelView = () => (
    <>
      <h1 className={style.header}>Avmelding</h1>
      <div className={style.text}>Vil du melde deg av {event.title}?</div>
      <div className={style.buttonContainer}>
        <Button onClick={cancelParticipant}>Meld av</Button>
        <Button onClick={goToEvent}>Se arrangement</Button>
      </div>
    </>
  );

  return <Page>{wasDeleted ? <HasCancelledView /> : <CancelView />}</Page>;
};
