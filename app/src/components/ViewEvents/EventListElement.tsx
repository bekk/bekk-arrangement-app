import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
import { stringifyDate, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { useParticipants } from 'src/hooks/participantHooks';
import { viewEventRoute, editEventRoute } from 'src/routing';
import { useEditableEvents } from 'src/hooks/eventHooks';
import { hasPermission, adminPermission } from 'src/auth';

interface IProps {
  eventId: string;
  event: IEvent;
}

export const EventListElement = ({ eventId, event }: IProps) => {
  const [participants] = useParticipants(eventId);
  const participantsCount = participants?.length ?? 0;
  const participantLimitText =
    event.maxParticipants === 0 ? '' : ` av ${event.maxParticipants}`;
  const dateText = isSameDate(event.start.date, event.end.date)
    ? `${stringifyDate(event.start.date)}`
    : `${stringifyDate(event.start.date)} \n - ${stringifyDate(
        event.end.date
      )}`;
  const desktopTimeText = `${stringifyTime(event.start.time)} - ${stringifyTime(
    event.end.time
  )}`;

  const { createdEvents } = useEditableEvents();
  const createdThisEvent = createdEvents.find(x => x.eventId === eventId);

  const viewRoute = viewEventRoute(eventId);
  const editRoute =
    createdThisEvent || hasPermission(adminPermission)
      ? editEventRoute(eventId, createdThisEvent?.editToken)
      : undefined;

  return (
    <div className={style.row}>
      <Link to={viewRoute} className={style.link}>
        <div className={style.text}>{event.title}</div>
        <div className={style.date}>{dateText}</div>
        <div className={style.desktopDate}> {desktopTimeText}</div>
        <div className={style.desktopText}>
          {participantsCount}
          {participantLimitText} påmeldte
        </div>
        <div className={style.desktopText}>
          Arrangeres av {event.organizerName}
        </div>
      </Link>
      {editRoute && <Link to={editRoute}>✎</Link>}
    </div>
  );
};
