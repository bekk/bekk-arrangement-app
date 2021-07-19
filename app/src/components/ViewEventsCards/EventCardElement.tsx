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
import {
  EventState,
  eventState,
} from 'src/components/ViewEventsCards/EventState';
import { isInThePast } from 'src/types/date-time';
import { isNumber } from 'lodash';
import { LocationIcon } from 'src/components/Common/Icons/LocationIcon';
import { ExternalIcon } from 'src/components/Common/Icons/ExternalIcon';
import {
  hav,
  hvit,
  kveld,
  morgendis,
  regn,
  skyfritt,
  sol,
  solnedgang,
  soloppgang,
  svart,
} from 'src/style/colors';

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

  const eventState = getEventState({
    event,
    waitingListSpot: hasLoaded(waitingListSpot)
      ? waitingListSpot.data
      : 'Laster',
    registrationState,
    editToken,
  });

  const cardStyle = classNames(
    style.card,
    getEventColor(eventId, style).style,
    {
      [style.cardActive]: eventState !== 'Avsluttet' && eventState !== 'Avlyst',
      [style.cardFaded]: eventState === 'Avsluttet' || eventState === 'Avlyst',
    }
  );

  return (
    <Link className={cardStyle} to={viewRoute}>
      <div className={style.date}>{dateTimeText}</div>
      <div className={titleStyle}>{event.title}</div>
      <div className={style.location}>
        <div className={style.locationIcon}>
          <LocationIcon color="white" />
        </div>
        <div className={style.iconText}>{event.location}</div>
      </div>
      {event.isExternal && (
        <div className={style.external}>
          <div className={style.externalIcon}>
            <ExternalIcon color="white" />
          </div>
          <div className={style.iconText}> Eksternt arrangementet </div>
        </div>
      )}
      <div className={style.cardFooter}>
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
    </Link>
  );
};

const colors = (style: any) =>
  new Map([
    ['Hav', { style: style.hav, colorCode: hav }],
    ['Kveld', { style: style.kveld, colorCode: kveld }],
    ['Regn', { style: style.regn, colorCode: regn }],
    ['Skyfritt', { style: style.skyfritt, colorCode: skyfritt }],
    ['Sol', { style: style.sol, colorCode: sol }],
    ['Solnedgang', { style: style.solnedgang, colorCode: solnedgang }],
    ['Soloppgang', { style: style.soloppgang, colorCode: soloppgang }],
  ]);

const getEventHash = (eventId: string): number =>
  [...eventId].map((char) => char.charCodeAt(0)).reduce((a, x) => a + x, 0);

export const getEventColor = (
  eventId: string | undefined,
  style: any
): { style: string; colorCode: string } => {
  const defaultStyle = { style: style.none, colorCode: hvit };
  if (eventId === undefined) {
    return defaultStyle;
  }
  if (eventId === 'all-events') {
    return { style: style.soloppgang, colorCode: soloppgang };
  }
  return (
    colors(style).get(
      [...colors(style).keys()][getEventHash(eventId) % colors(style).size]
    ) ?? defaultStyle
  );
};

interface EventStateProps {
  event: IEvent;
  editToken?: string;
  waitingListSpot: number | 'ikke-påmeldt' | 'Laster';
  registrationState: 'Plass' | 'Plass på venteliste' | 'Laster' | 'Fullt';
}

const getEventState = ({
  event,
  editToken,
  waitingListSpot,
  registrationState,
}: EventStateProps): eventState => {
  if (editToken) return 'Rediger';

  if (event.isCancelled) return 'Avlyst';

  if (event.openForRegistrationTime >= new Date()) return 'Ikke åpnet';

  if (isInThePast(event.end)) return 'Avsluttet';

  if (isNumber(waitingListSpot)) {
    if (waitingListSpot > 0) return 'På venteliste';
    else return 'Påmeldt';
  }

  return registrationState;
};
