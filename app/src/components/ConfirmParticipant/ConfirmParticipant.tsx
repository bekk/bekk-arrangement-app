import React from 'react';
import { useParams, useHistory } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { Page } from '../Page/Page';
import { stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { Button } from '../Common/Button/Button';
import style from './ConfirmParticipant.module.scss';
import { viewEventRoute } from 'src/routing';
import { hasLoaded } from 'src/remote-data';

export const ConfirmParticipant = () => {
  const { eventId = 'UGYLDIG-URL', email: participantEmail } = useParams();
  const remoteEvent = useEvent(eventId);
  const history = useHistory();
  const goToEvent = () => eventId && history.push(viewEventRoute(eventId));

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading...</div>;
  }

  const event = remoteEvent.data;

  return (
    <Page>
      <h1 className={style.header}>Du er påmeldt!</h1>
      <div className={style.text}>
        Gratulerer, du er nå påmeldt {event.title} den{' '}
        {stringifyDate(event.start.date)} kl {stringifyTime(event.start.time)} -{' '}
        {stringifyTime(event.end.time)}! Vi gleder oss til å se deg{' '}
        <span role="img" aria-label="hugging face">
          🤗
        </span>
        Bekreftelse er sendt på e-post til {participantEmail}. Detaljer for
        avmelding står i e-posten.
      </div>
      <Button onClick={goToEvent}>Tilbake til arrangement</Button>
    </Page>
  );
};
