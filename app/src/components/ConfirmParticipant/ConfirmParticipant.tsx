import React from 'react';
import { stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import style from './ConfirmParticipant.module.scss';
import { viewEventRoute, eventIdKey, emailKey } from 'src/routing';
import { hasLoaded } from 'src/remote-data';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import { useParam } from 'src/utils/browser-state';
import { useEvent, useWaitinglistSpot } from 'src/hooks/cache';
import { Page } from 'src/components/Page/Page';
export const ConfirmParticipant = () => {
  const eventId = useParam(eventIdKey);
  const participantEmail = useParam(emailKey);

  const remoteEvent = useEvent(eventId);
  const remoteWaitinglistSpot = useWaitinglistSpot(eventId, participantEmail);

  if (!hasLoaded(remoteEvent) || !hasLoaded(remoteWaitinglistSpot)) {
    return <div>Loading...</div>;
  }

  const event = remoteEvent.data;
  const isWaitlisted = remoteWaitinglistSpot.data >= 1;

  return isWaitlisted ? (
    <Page>
      <h1 className={style.header}>
        Du er nummer {remoteWaitinglistSpot.data} på ventelisten!
      </h1>
      <div className={style.text}>
        Du er nå på venteliste for {event.title} den{' '}
        {stringifyDate(event.start.date)} kl {stringifyTime(event.start.time)} -{' '}
        {stringifyTime(event.end.time)}{' '}
        <span role="img" aria-label="hugging face">
          🤗
        </span>
        <br />
        <br />
        Bekreftelse er sendt på e-post til {participantEmail}. Detaljer for
        avmelding står i e-posten. <br /> Du vil få beskjed på e-post om du får
        plass på arrangementet.
      </div>
      <BlockLink to={viewEventRoute(eventId)}>
        Tilbake til arrangement
      </BlockLink>
    </Page>
  ) : (
    <Page>
      <h1 className={style.header}>Du er påmeldt!</h1>
      <div className={style.text}>
        Gratulerer, du er nå påmeldt {event.title} den{' '}
        {stringifyDate(event.start.date)} kl {stringifyTime(event.start.time)} -{' '}
        {stringifyTime(event.end.time)}! Vi gleder oss til å se deg{' '}
        <span role="img" aria-label="hugging face">
          🤗
        </span>
        <br />
        Bekreftelse er sendt på e-post til {participantEmail}. Detaljer for
        avmelding står i e-posten.
      </div>
      <BlockLink to={viewEventRoute(eventId)}>
        Tilbake til arrangement
      </BlockLink>
    </Page>
  );
};
