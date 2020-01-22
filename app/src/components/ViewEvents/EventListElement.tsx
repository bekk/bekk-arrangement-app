import React from 'react';
import { IEvent } from 'src/types/event';
import { Link } from 'react-router-dom';
import style from './EventListElement.module.scss';
import { Button } from '../Common/Button/Button';

interface IProps {
  event: IEvent;
  onClickRoute: string;
  delEvent: () => void;
}

export const EventListElement = ({ event, onClickRoute, delEvent }: IProps) => {
  return (
    <div className={style.container}>
      <Link to={onClickRoute} className={style.link}>
        {event.title}
      </Link>
      <Button onClick={delEvent}>Slett</Button>
    </div>
  );
};
