import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventCardElement.module.scss';
import { stringifyDate, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { viewEventRoute } from 'src/routing';
import { hasLoaded } from 'src/remote-data';
import { useNumberOfParticipants, useWaitinglistSpot } from 'src/hooks/cache';
import { useEditToken, useSavedParticipations } from 'src/hooks/saved-tokens';
import classNames from 'classnames';
import { EventState,eventState } from 'src/components/ViewEventsCards/EventState';
import { isInThePast } from 'src/types/date-time';
import { isNumber } from 'lodash';
import { LocationIcon } from 'src/components/Common/Icons/LocationIcon';

interface IProps {
  eventId: string;
  event: IEvent;
}

export const EventCardElement = ({ eventId, event }: IProps) => {
  const editToken = useEditToken(eventId);

  const { savedParticipations: participationsInLocalStorage } =
    useSavedParticipations();
  const participationsForThisEvent = participationsInLocalStorage.filter(
    (p) => p.eventId === eventId
  );

  const waitingListSpot = useWaitinglistSpot(
    eventId,
    participationsForThisEvent[0]?.email
  );

  const remoteNumberOfParticipants = useNumberOfParticipants(eventId);
  const numberOfParticipants = hasLoaded(remoteNumberOfParticipants)
    ? remoteNumberOfParticipants.data
    : undefined;

  const numberOfAvailableSpot =
    event.maxParticipants !== 0 && numberOfParticipants !== undefined
      ? event.maxParticipants - numberOfParticipants
      : undefined;

  const registrationState =
    event.maxParticipants === 0
      ? 'Plass'
      : numberOfParticipants === undefined
      ? 'Laster'
      : numberOfParticipants < event.maxParticipants
      ? 'Plass'
      : numberOfParticipants >= event.maxParticipants && event.hasWaitingList
      ? 'Plass på venteliste'
      : 'Fullt';

  const dateTimeText = isSameDate(event.start.date, event.end.date)
    ? `${stringifyDate(event.start.date)}, ${stringifyTime(
        event.start.time
      )} - ${stringifyTime(event.end.time)}`
    : `${stringifyDate(event.start.date)} \n - ${stringifyDate(
        event.end.date
      )}`;

  const viewRoute = viewEventRoute(eventId);

  const titleStyle = classNames(style.title, {
    [style.longTitle]: event.title.length >= 25,
    [style.shortTitle]: event.title.length < 25,
  });

  const eventState = useGetState({
    eventId,
    event,
    waitingListSpot: hasLoaded(waitingListSpot)
      ? waitingListSpot.data
      : 'Laster',
    registrationState,
    editToken,
  });

  const cardStyle = classNames(style.card, getColor(eventId), {
    [style.cardActive]: eventState !== 'Avsluttet',
    [style.cardFaded]: eventState === 'Avsluttet', //TODO: legg til faded på avlyst også (|| eventState === 'Avlyst')
  });

  return (
    <Link to={viewRoute} className={style.link}>
      <div className={cardStyle}>
        <div className={style.date}>{dateTimeText}</div>
        <div className={titleStyle}>{event.title}</div>
        <div className={style.location}>
          <div className={style.locationIcon}>
            <LocationIcon />
          </div>
          <div className={style.locationText}>{event.location}</div>
        </div>
        <div className={style.button}>
          <EventState
            eventId={eventId}
            eventState={eventState}
            event={event}
            numberOfAvailableSpots={numberOfAvailableSpot}
            waitingListSpot={
              hasLoaded(waitingListSpot) && isNumber(waitingListSpot.data)
                ? waitingListSpot.data
                : undefined
            }
          />
        </div>
      </div>
    </Link>
  );
};

interface EventStateProps {
  eventId: string;
  event: IEvent;
  editToken?: string;
  waitingListSpot: number | 'ikke-påmeldt' | 'Laster';
  registrationState?: 'Plass' | 'Plass på venteliste' | 'Laster' | 'Fullt';
}

const colors = [
  style.cardColorHav,
  style.cardColorKveld,
  style.cardColorRegn,
  style.cardColorSkyfritt,
  style.cardColorSol,
  style.cardColorSolnedgang,
  style.cardColorSoloppgang,
];
const getEventHash = (eventId: string): number =>
  [...eventId].map((char) => char.charCodeAt(0)).reduce((a, x) => a + x, 0);
const getColor = (eventId: string) =>
  colors[getEventHash(eventId) % colors.length];

const useGetState = ({
  eventId,
  event,
  editToken,
  waitingListSpot,
  registrationState,
}: EventStateProps):eventState => {
  if (editToken) return 'Rediger';
  
  if (event.isCancelled) return 'Avlyst'

  if (event.openForRegistrationTime >= new Date()) return 'Ikke åpnet';

  if (isInThePast(event.end)) return 'Avsluttet';

  if (isNumber(waitingListSpot)) {
    if (waitingListSpot > 0) return 'På venteliste';
    else return 'Påmeldt';
  }

  if (registrationState) {
    return registrationState;
  }
  return undefined;
};
