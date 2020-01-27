import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
import { stringifyDate } from 'src/types/date';

interface IProps {
  event: IEvent;
  onClickRoute: string;
}

export const EventListElement = ({ event, onClickRoute }: IProps) => {
  return (
    <div className={style.container}>
      <Link to={onClickRoute} className={style.link}>
        <div>{event.title}</div>
        <div className={style.date}>{stringifyDate(event.start.date)}</div>
      </Link>
    </div>
  );
};
