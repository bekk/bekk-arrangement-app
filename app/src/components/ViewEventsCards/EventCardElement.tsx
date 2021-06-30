import React, { useState } from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventCardElement.module.scss';
import { stringifyDate, isSameDate } from 'src/types/date';
import { dateToITime, stringifyTime } from 'src/types/time';
import { viewEventRoute, editEventRoute } from 'src/routing';
import { userIsAdmin } from 'src/auth';
import { hasLoaded } from 'src/remote-data';
import { useNumberOfParticipants } from 'src/hooks/cache';
import { useEditToken } from 'src/hooks/saved-tokens';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { capitalize } from 'src/components/ViewEvent/ViewEvent';
import { stringifyTimeInstanceWithDayName } from 'src/types/time-instance';
import { Button } from 'src/components/Common/Button/Button';

interface IProps {
  eventId: string;
  event: IEvent;
}

export const EventCardElement = ({ eventId, event }: IProps) => {
  const remoteNumberOfParticipants = useNumberOfParticipants(eventId);

  const numberOfParticipants = hasLoaded(remoteNumberOfParticipants)
    ? remoteNumberOfParticipants.data
    : undefined;

  const timeLeft = useTimeLeft(event.openForRegistrationTime);

  const timeLeftText =
    'Påmelding åpner ' +
    (timeLeft.days === 0
      ? 'klokken ' + stringifyTime(dateToITime(event.openForRegistrationTime))
      : capitalize(
          stringifyTimeInstanceWithDayName(event.openForRegistrationTime)
        ));

  const participantText =
    numberOfParticipants !== undefined &&
    (event.maxParticipants === 0
      ? numberOfParticipants
      : `${Math.min(numberOfParticipants, event.maxParticipants)} av ${
          event.maxParticipants
        }`);

  const dateText = isSameDate(event.start.date, event.end.date)
    ? `${stringifyDate(event.start.date)}`
    : `${stringifyDate(event.start.date)} \n - ${stringifyDate(
        event.end.date
      )}`;

  const desktopTimeText = `${stringifyTime(event.start.time)} - ${stringifyTime(
    event.end.time
  )}`;

  const dateTimeText = isSameDate(event.start.date, event.end.date)
    ? `${stringifyDate(event.start.date)}, ${stringifyTime(
        event.start.time
      )} - ${stringifyTime(event.end.time)}`
    : `${stringifyDate(event.start.date)} \n - ${stringifyDate(
        event.end.date
      )}`;

  const editToken = useEditToken(eventId);

  const viewRoute = viewEventRoute(eventId);
  const editRoute =
    editToken || userIsAdmin() ? editEventRoute(eventId, editToken) : undefined;

  const [svgColor, setSvgColor] = useState('White');

  return (
    <Link to={viewRoute} className={style.link}>
      <div
        className={style.card}
        onMouseEnter={() => setSvgColor('Black')}
        onMouseLeave={() => setSvgColor('White')}
      >
        <div className={style.date}>{dateTimeText}</div>
        <div className={style.title}>{event.title}</div>
        <div className={style.location}>
          {' '}
          <div className={style.locationIcon}>
            <span>
              <LocationIconComponent color={svgColor} />
            </span>
          </div>
          <div className={style.locationText}>{event.location}</div>
        </div>
        {editRoute && (
          <div className={style.button}>
            <Link to={editRoute}>
              <Button color="White" onClick={() => console.log('klikk!')}>
                Meld deg på
              </Button>
            </Link>
          </div>
        )}
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
