import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
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

interface IProps {
  eventId: string;
  event: IEvent;
}

export const EventListElement = ({ eventId, event }: IProps) => {
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

  console.log(event.title);
  console.log('time left', timeLeft);

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

  const editToken = useEditToken(eventId);

  const viewRoute = viewEventRoute(eventId);
  const editRoute =
    editToken || userIsAdmin() ? editEventRoute(eventId, editToken) : undefined;

  return (
    <div className={style.row}>
      <Link to={viewRoute} className={style.link}>
        <div className={style.text}>{event.title}</div>
        <div className={style.date}>{dateText}</div>
        <div className={style.desktopDate}> {desktopTimeText}</div>
        <div className={style.desktopText}>
          {timeLeft.difference > 0
            ? timeLeftText
            : participantText + ' påmeldte' ?? '- påmeldte'}
        </div>
        <div className={style.desktopText}>
          Arrangeres av {event.organizerName}
        </div>
      </Link>
      {editRoute && (
        <div className={style.pencil}>
          <Link to={editRoute}>
            <PencilIconComponent />
          </Link>{' '}
        </div>
      )}
    </div>
  );
};

const PencilIconComponent = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <rect width="100%" height="100%" />
      <title>Legg til</title>
      <g
        id="editButtonIcon"
        stroke="none"
        strokeWidth="1"
        fill="#fff"
        fillRule="evenodd"
      >
        <g id="EDIT---HOVER" transform="translate(-1276.000000, -5353.000000)">
          <g
            id="Group-3-Copy-15"
            transform="translate(1276.000000, 5353.000000)"
          >
            <path
              d="M10.8018919,29.1980541 L12.5418919,23.1683243 L24.9462162,10.764 L29.2359459,15.0542703 L16.8316216,27.4580541 L10.8018919,29.1980541 Z M30.3310811,15.0542703 L24.9462162,9.66886486 L11.8532432,22.7618378 L9.66891892,30.3315676 L17.2381081,28.1467027 L30.3310811,15.0542703 Z"
              id="Fill-1"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
