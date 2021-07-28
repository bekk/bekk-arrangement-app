import React, { createRef } from 'react';
import style from './ViewEventContainer.module.scss';
import { isInThePast } from 'src/types/date-time';
import { asString } from 'src/utils/timeleft';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { cancelParticipantRoute } from 'src/routing';
import { userIsAdmin, userIsLoggedIn } from 'src/auth';
import { hasLoaded, isBad } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { useEvent, useNumberOfParticipants } from 'src/hooks/cache';
import {
  Participation,
  useEditToken,
  useSavedParticipations,
} from 'src/hooks/saved-tokens';
import { AddParticipant } from 'src/components/ViewEvent/AddParticipant';
import { ViewParticipants } from 'src/components/ViewEvent/ViewParticipants';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';
import { ViewParticipantsLimited } from 'src/components/ViewEvent/ViewParticipantsLimited';
import { useHistory } from 'react-router';
import { Button } from 'src/components/Common/Button/Button';
import { getParticipantExportResponse } from 'src/api/arrangementSvc';
import { DownloadIcon } from 'src/components/Common/Icons/DownloadIcon';
import {
  isMaxParticipantsLimited,
  maxParticipantsLimit,
} from 'src/types/event';

interface IProps {
  eventId: string;
}

export const ViewEventContainer = ({ eventId }: IProps) => {
  const history = useHistory();
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

  const oneMinute = 60000;

  if (isBad(remoteEvent)) {
    return <div>{remoteEvent.userMessage}</div>;
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading</div>;
  }

  const event = remoteEvent.data;

  const eventIsFull =
    isMaxParticipantsLimited(event.maxParticipants) &&
    maxParticipantsLimit(event.maxParticipants) <= numberOfParticipants;

  const waitingList =
    hasLoaded(remoteNumberOfParticipants) &&
    eventIsFull &&
    isMaxParticipantsLimited(event.maxParticipants)
      ? remoteNumberOfParticipants.data -
        maxParticipantsLimit(event.maxParticipants)
      : '-';

  const shortParticipantsText = `${
    eventIsFull
      ? isMaxParticipantsLimited(event.maxParticipants) &&
        maxParticipantsLimit(event.maxParticipants)
      : numberOfParticipants
  }${
    !isMaxParticipantsLimited(event.maxParticipants)
      ? ' av ∞ påmeldte'
      : ' av ' + maxParticipantsLimit(event.maxParticipants) + ' påmeldte'
  }`;

  const participantsText = `${
    eventIsFull
      ? isMaxParticipantsLimited(event.maxParticipants) &&
        maxParticipantsLimit(event.maxParticipants) + ' påmeldte'
      : numberOfParticipants + ' påmeldte'
  }${
    !isMaxParticipantsLimited(event.maxParticipants)
      ? '. Ubegrenset antall plasser igjen'
      : event.hasWaitingList && eventIsFull
      ? ` og ${waitingList} på venteliste`
      : numberOfParticipants !== '-' &&
        `. ${
          maxParticipantsLimit(event.maxParticipants) - numberOfParticipants
        } plasser igjen.`
  }`;

  const closedEventText = isInThePast(event.end)
    ? 'Arrangementet har allerede funnet sted'
    : timeLeft.difference > 0
    ? `Åpner om ${asString(timeLeft)}`
    : eventIsFull && !event.hasWaitingList
    ? 'Arrangementet er dessverre fullt'
    : event.isCancelled
    ? 'Arrangementet er desverre avlyst'
    : undefined;

  const waitlistText =
    eventIsFull && waitingList
      ? 'Arrangementet er dessverre fullt, men du kan fortsatt bli med på ventelisten!'
      : undefined;

  const numberOfPossibleParticipantsText = !isMaxParticipantsLimited(
    event.maxParticipants
  )
    ? 'Ubegrenset antall plasser'
    : maxParticipantsLimit(event.maxParticipants) + ' plasser';

  const goToRemoveParticipantRoute = ({
    eventId,
    cancellationToken,
    email,
  }: Participation) => {
    history.push(
      cancelParticipantRoute({
        eventId,
        cancellationToken,
        email: encodeURIComponent(email),
      })
    );
  };

  return (
    <>
      <ViewEvent
        eventId={eventId}
        event={event}
        participantsText={shortParticipantsText}
        userCanEdit={editTokenFound || userIsAdmin() ? true : false}
      />
      <Page>
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
                Hurra, du er påmeldt {event.title}! Vi gleder oss til å se deg.
                En bekreftelse er sendt på e-post til{' '}
                {participationsForThisEvent[0].email}
              </p>
              <h2 className={style.subHeader}>Kan du ikke likevel?</h2>
              <Button
                onClick={() =>
                  goToRemoveParticipantRoute(participationsForThisEvent[0])
                }
              >
                Meld meg av
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
              {!isInThePast(event.end) &&
                timeLeft.difference < oneMinute &&
                !event.isCancelled && (
                  <AddParticipant eventId={eventId} event={event} />
                )}
            </div>
          )}
          <div className={style.attendeesTitleContainer}>
            <h2 className={style.subHeader}>Påmeldte</h2>
            {(editTokenFound || userIsAdmin()) && (
              <DownloadExportLink eventId={eventId} />
            )}
          </div>
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
    </>
  );
};

interface IPropsDownloadExport {
  eventId: string;
}

export function DownloadExportLink({ eventId }: IPropsDownloadExport) {
  const link = createRef<HTMLAnchorElement>();

  const handleAction = async () => {
    if (link.current?.href) {
      return;
    }

    const result = await getParticipantExportResponse(eventId);
    const blob = await result.blob();

    const href = window.URL.createObjectURL(blob);

    if (link.current) {
      link.current.download = eventId + '.csv';
      link.current.href = href;
      link.current.click();
    }
  };

  return (
  // eslint-disable-next-line
    <a
      role="button"
      ref={link}
      onClick={handleAction}
      className={style.downloadIcon}
    >
      <DownloadIcon />
    </a>
  );
}
