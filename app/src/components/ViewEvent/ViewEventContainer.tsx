import React from 'react';
import style from './ViewEventContainer.module.scss';
import { isInThePast } from 'src/types/date-time';
import { asString } from 'src/utils/timeleft';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import {
  cancelParticipantRoute,
  eventsRoute,
  editEventRoute,
  eventIdKey,
} from 'src/routing';
import { stringifyEmail } from 'src/types/email';
import { userIsLoggedIn, userIsAdmin } from 'src/auth';
import { hasLoaded, isBad } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';
import { useParam } from 'src/utils/browser-state';
import { useEvent, useParticipants } from 'src/hooks/cache';
import {
  useSavedEditableEvents,
  useSavedParticipations,
} from 'src/hooks/saved-tokens';
import { EditParticipation } from 'src/components/ViewEvent/EditParticipation';

export const ViewEventContainer = () => {
  const eventId = useParam(eventIdKey);
  const remoteEvent = useEvent(eventId);

  const remoteParticipants = useParticipants(eventId);

  const { savedEvents } = useSavedEditableEvents();
  const editTokenFound = savedEvents.find(event => event.eventId === eventId);

  const {
    savedParticipations: participationsInLocalStorage,
  } = useSavedParticipations();
  const participationsForThisEvent = participationsInLocalStorage.filter(
    p => p.eventId === eventId
  );

  const timeLeft = useTimeLeft(
    hasLoaded(remoteEvent) && remoteEvent.data.openForRegistrationTime
  );

  if (isBad(remoteEvent)) {
    return <div>{remoteEvent.userMessage}</div>;
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading</div>;
  }

  const event = remoteEvent.data;
  const loadedOrderedParticipants = hasLoaded(remoteParticipants)
    ? remoteParticipants.data.sortBy(p =>
        p.registrationTime ? p.registrationTime : p.name
      )
    : [];
  const actualParticipants = loadedOrderedParticipants.filter(
    (p, i) => i < event.maxParticipants
  );
  const waitlistedParticipants = loadedOrderedParticipants.filter(
    (p, i) => i >= event.maxParticipants
  );
  const eventIsFull =
    event.maxParticipants !== 0 &&
    event.maxParticipants <= loadedOrderedParticipants.length;

  const participantsText = `${actualParticipants.length}${
    event.maxParticipants === 0
      ? ' av ∞'
      : ' av ' +
        event.maxParticipants +
        (event.hasWaitingList && eventIsFull
          ? ` og ${waitlistedParticipants.length} på venteliste`
          : '')
  }`;

  const closedEventText = isInThePast(event.end)
    ? 'Arrangementet har allerede funnet sted'
    : timeLeft.difference > 0
    ? `Åpner om ${asString(timeLeft)}`
    : eventIsFull && !event.hasWaitingList
    ? 'Arrangementet er dessverre fullt'
    : undefined;

  const waitlistText =
    eventIsFull && event.hasWaitingList
      ? 'Arrangementet er dessverre fullt, men du kan fortsatt bli med på ventelisten!'
      : undefined;

  return (
    <Page>
      {userIsLoggedIn() && (
        <BlockLink to={eventsRoute}>Til arrangementer</BlockLink>
      )}
      {(editTokenFound || userIsAdmin()) && (
        <BlockLink to={editEventRoute(eventId, editTokenFound?.editToken)}>
          Rediger arrangement
        </BlockLink>
      )}
      {participationsForThisEvent.map(p => (
        <BlockLink key={p.email} to={cancelParticipantRoute(p)}>
          Meld {p.email} av arrangementet
        </BlockLink>
      ))}
      <ViewEvent event={event} participantsText={participantsText} />
      <section>
        <h1 className={style.subHeader}>Påmelding</h1>
        {closedEventText ? (
          <p className={style.text}>
            Stengt <br /> {closedEventText}
          </p>
        ) : waitlistText ? (
          <p className={style.text}>{waitlistText}</p>
        ) : null}
        {!closedEventText && (
          <EditParticipation eventId={eventId} event={event} />
        )}
        <h1 className={style.subHeader}>Påmeldte</h1>
        <div>
          {loadedOrderedParticipants.length > 0 ? (
            actualParticipants.map(p => {
              return (
                <div key={stringifyEmail(p.email)} className={style.text}>
                  {p.name}, {stringifyEmail(p.email)}, Kommentar: {p.comment}
                </div>
              );
            })
          ) : (
            <div className={style.text}>Ingen påmeldte</div>
          )}
          {event.hasWaitingList && waitlistedParticipants.length > 0 && (
            <>
              <h3>På venteliste</h3>
              {waitlistedParticipants.map(p => (
                <div key={stringifyEmail(p.email)} className={style.text}>
                  {p.name}, {stringifyEmail(p.email)}, Kommentar: {p.comment}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </Page>
  );
};
