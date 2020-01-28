import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
import { stringifyDate, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';

interface IProps {
  event: IEvent;
  onClickRoute: string;
}

export const EventListElement = ({ event, onClickRoute }: IProps) => {
  const dateText = isSameDate(event.start.date, event.end.date)
    ? `${stringifyDate(event.start.date)}`
    : `${stringifyDate(event.start.date)} \n - ${stringifyDate(
        event.end.date
      )}`;
  const desktopTimeText = `${stringifyTime(event.start.time)} - ${stringifyTime(
    event.end.time
  )}`;

  return (
    <div>
      <Link to={onClickRoute} className={style.link}>
        <div>{event.title}</div>
        <div className={style.date}>{dateText}</div>
        <div className={style.desktopDate}> {desktopTimeText}</div>
      </Link>
    </div>
  );
};
