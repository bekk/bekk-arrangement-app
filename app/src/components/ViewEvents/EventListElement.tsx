import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
import { stringifyDate, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { useParticipants } from 'src/hooks/participantHooks';

interface IProps {
  eventId: string;
  event: IEvent;
  onClickRoute: string;
}

export const EventListElement = ({ eventId, event, onClickRoute }: IProps) => {
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

  return (
    <div className={style.row}>
      <Link to={onClickRoute} className={style.link}>
        <div className={style.text}>{event.title}</div>
        <div className={style.date}>{dateText}</div>
        <div className={style.desktopDate}> {desktopTimeText}</div>
        <div className={style.organizer}>
          {participantsCount}
          {participantLimitText} påmeldte
        </div>
        <div className={style.organizer}>
          Arrangeres av {event.organizerName}
        </div>
      </Link>
    </div>
  );
};
