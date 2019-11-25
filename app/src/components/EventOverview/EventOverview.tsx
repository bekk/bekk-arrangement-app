import React from 'react';
import { Menu } from '../Common/Menu/Menu';
import style from './EventOverview.module.scss';
import { Event } from './Event';
import { IEvent } from 'src/types/event';
import { WithId } from 'src/types';

interface Props {
  events: WithId<IEvent>[];
}

export const EventOverview = ({ events }: Props) => {
  return (
    <div className={style.container}>
      <Menu tab={'overview'} />
      <div className={style.overview}>
        {events.map(event => (
          <Event key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};
