import React from 'react';
import style from './ViewEventContainer.module.scss';
import { isInThePast } from 'src/types/date-time';
import { asString } from 'src/utils/timeleft';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { cancelParticipantRoute, eventIdKey } from 'src/routing';
import { userIsAdmin, userIsLoggedIn } from 'src/auth';
import { hasLoaded, isBad } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { useParam } from 'src/utils/browser-state';
import { useEvent, useNumberOfParticipants } from 'src/hooks/cache';
import {
  Participation,
  useEditToken,
  useSavedParticipations,
} from 'src/hooks/saved-tokens';
import { AddParticipant } from 'src/components/ViewEvent/AddParticipant';
import { ViewParticipants } from 'src/components/ViewEvent/ViewParticipants';
import { toEmailWriteModel } from 'src/types/email';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';
import { ViewParticipantsLimited } from 'src/components/ViewEvent/ViewParticipantsLimited';
import { useHistory } from 'react-router';
import { Button } from 'src/components/Common/Button/Button';

export const ViewEventContainer = () => {
  const history = useHistory();
  const eventId = useParam(eventIdKey);
  const remoteEvent = useEvent(eventId);

  const editTokenFound = useEditToken(eventId);

  const remoteNumberOfParticipants = useNumberOfParticipants(eventId);
  const numberOfParticipants = hasLoaded(remoteNumberOfParticipants)
    ? remoteNumberOfParticipants.data
    : '-';

  const { savedParticipations: participationsInLocalStorage } =
    useSavedParticipations();
  const participationsForThisEvent = participationsInLocalStorage.filter(
    (p) => p.eventId === eventId
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

  const eventIsFull =
    event.maxParticipants !== 0 &&
    event.maxParticipants <= numberOfParticipants;

  const waitingList =
    hasLoaded(remoteNumberOfParticipants) && eventIsFull
      ? remoteNumberOfParticipants.data - event.maxParticipants
      : '-';

  const participantsText = `${
    eventIsFull
      ? event.maxParticipants + ' påmeldte'
      : numberOfParticipants + ' påmeldte'
  }${
    event.maxParticipants === 0
      ? '. Ubegrenset antall plasser igjen'
      : event.hasWaitingList && eventIsFull
      ? ` og ${waitingList} på venteliste`
      : numberOfParticipants !== '-' &&
        `. ${event.maxParticipants - numberOfParticipants} plasser igjen.`
  }`;

  const closedEventText = isInThePast(event.end)
    ? 'Arrangementet har allerede funnet sted'
    : timeLeft.difference > 0
    ? `Åpner om ${asString(timeLeft)}`
    : eventIsFull && !event.hasWaitingList
    ? 'Arrangementet er dessverre fullt'
    : undefined;

  const waitlistText =
    eventIsFull && waitingList
      ? 'Arrangementet er dessverre fullt, men du kan fortsatt bli med på ventelisten!'
      : undefined;

  const numberOfPossibleParticipantsText =
    event.maxParticipants === 0
      ? 'Ubegrenset antall plasser'
      : event.maxParticipants + ' plasser';

  const removeParticipant = (participation: Participation) => {
    history.push(
      cancelParticipantRoute({
        eventId: participation.eventId,
        cancellationToken: participation.cancellationToken,
        email: encodeURIComponent(toEmailWriteModel(participation)),
      })
    );
  };
  return (
    <Page>
      <ViewEvent
        event={event}
        participantsText={participantsText}
        userCanEdit={editTokenFound || userIsAdmin() ? true : false}
      />
      <section>
        {participationsForThisEvent.length >= 1 ? (
          <div>
            <h2 className={style.subHeader}>
              Du er påmeldt{' '}
              <span role="img" aria-label="konfetti">
                🎉
              </span>
            </h2>
            <p>
              Hurra, du er påmeldt {event.title}! Vi gleder oss til å se deg. En
              bekreftelse er sendt på e-post til{' '}
              {participationsForThisEvent[0].email}
            </p>
            <h2 className={style.subHeader}>Kan du ikke likevel?</h2>
            <Button
              onClick={() => removeParticipant(participationsForThisEvent[0])}
            >
              Meld deg av
            </Button>
          </div>
        ) : (
          <div className={style.registrationContainer}>
            <h2 className={style.subHeader}>Meld deg på</h2>
            {closedEventText ? (
              <div>
                <p>{numberOfPossibleParticipantsText}</p>
                <p>
                  Påmeldingen er stengt <br /> {closedEventText}
                </p>
              </div>
            ) : waitlistText ? (
              <p>{waitlistText}</p>
            ) : null}
            {(!closedEventText || timeLeft.difference < 60000) && (
              <AddParticipant eventId={eventId} event={event} />
            )}
          </div>
        )}
        <h2 className={style.subHeader}>Påmeldte</h2>
        <p>{participantsText}</p>
        {editTokenFound || userIsAdmin() ? (
          <ViewParticipants eventId={eventId} editToken={editTokenFound} />
        ) : (
          userIsLoggedIn() && (
            <ViewParticipantsLimited
              eventId={eventId}
              editToken={editTokenFound}
            />
          )
        )}
      </section>
    </Page>
  );
};
