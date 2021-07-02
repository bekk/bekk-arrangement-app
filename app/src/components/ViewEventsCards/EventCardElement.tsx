import React, { useState } from 'react';
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
import { EventState } from 'src/components/ViewEventsCards/EventState';
import { isInThePast } from 'src/types/date-time';
import { isNumber } from 'lodash';

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
      ? 'loading'
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

  const [svgColor, setSvgColor] = useState('White');

  const titleStyle = classNames({
    [style.title]: true,
    [style.longTitle]: event.title.length >= 25,
    [style.shortTitle]: event.title.length < 25,
  });

  const eventState = useGetState({
    eventId,
    event,
    waitingListSpot: hasLoaded(waitingListSpot)
      ? waitingListSpot.data
      : 'loading',
    registrationState,
    editToken,
  });

  console.log(event.title, ' ', eventState);
  return (
    <Link to={viewRoute} className={style.link}>
      <div
        className={style.card}
        onMouseEnter={() => setSvgColor('Black')}
        onMouseLeave={() => setSvgColor('White')}
      >
        <div className={style.date}>{dateTimeText}</div>
        <div className={titleStyle}>{event.title}</div>
        <div className={style.location}>
          {' '}
          <div className={style.locationIcon}>
            <span>
              <LocationIconComponent color={svgColor} />
            </span>
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

const LocationIconComponent = (props: { color: string }) => {
  return (
    <svg
      width="9"
      height="20"
      viewBox="0 0 9 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M3.92494 6.33334V15.3583H4.63328V6.33334C5.35244 6.25884 6.02371 5.93793 6.53328 5.425C6.97591 4.98042 7.27691 4.41467 7.39829 3.79916C7.51967 3.18365 7.45598 2.54598 7.21526 1.96664C6.97454 1.3873 6.56758 0.892257 6.04576 0.544001C5.52394 0.195746 4.91064 0.0098877 4.28328 0.0098877C3.65592 0.0098877 3.04262 0.195746 2.5208 0.544001C1.99897 0.892257 1.59202 1.3873 1.3513 1.96664C1.11058 2.54598 1.04689 3.18365 1.16827 3.79916C1.28964 4.41467 1.59064 4.98042 2.03328 5.425C2.54069 5.93621 3.20873 6.25698 3.92494 6.33334ZM2.49994 1.43334C2.84707 1.07754 3.29238 0.833304 3.77899 0.731824C4.2656 0.630344 4.77142 0.676229 5.23183 0.863618C5.69223 1.05101 6.08632 1.37139 6.36376 1.78384C6.64119 2.1963 6.78938 2.68209 6.78938 3.17917C6.78938 3.67625 6.64119 4.16205 6.36376 4.5745C6.08632 4.98695 5.69223 5.30734 5.23183 5.49473C4.77142 5.68211 4.2656 5.728 3.77899 5.62652C3.29238 5.52504 2.84707 5.2808 2.49994 4.925C2.04438 4.45806 1.78938 3.83154 1.78938 3.17917C1.78938 2.52681 2.04438 1.90028 2.49994 1.43334Z"
          fill={props.color}
        />
        <path d="M8.56667 19.2917H0V20H8.56667V19.2917Z" fill={props.color} />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="8.56667" height="20" fill={props.color} />
        </clipPath>
      </defs>
    </svg>
  );
};

interface EventStateProps {
  eventId: string;
  event: IEvent;
  editToken?: string;
  waitingListSpot: number | 'ikke-påmeldt' | 'loading';
  registrationState?: 'Plass' | 'Plass på venteliste' | 'loading' | 'Fullt';
}

const useGetState = ({
  eventId,
  event,
  editToken,
  waitingListSpot,
  registrationState,
}: EventStateProps) => {
  if (editToken) return 'Rediger';

  if (event.openForRegistrationTime >= new Date()) return 'Ikke åpnet';

  if (isInThePast(event.end)) return 'Avsluttet';

  if (isNumber(waitingListSpot)) {
    if (waitingListSpot > 0) return 'På venteliste';
    else return 'Påmeldt';
  }

  if (registrationState && registrationState !== 'Fullt') {
    return registrationState;
  }
  return undefined;
};
