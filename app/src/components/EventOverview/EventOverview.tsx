import React from 'react';
import { Menu } from '../Common/Menu/Menu';
import style from './EventOverview.module.scss';
import { Event } from './Event';
import { IEvent } from 'src/types/event';
import { Edit, fromEditModel } from 'src/types/validation';
import { Optional } from 'src/types';

interface Props {
  events: Map<number, Edit<IEvent>>;
}

export const EventOverview = ({ events }: Props) => {
  return (
    <div className={style.container}>
      <Menu tab={'overview'} />
      <div className={style.overview}>
        {Array.from(events)
          .mapIf(
            ([key, value]): Optional<[number, IEvent]> => {
              const edit = fromEditModel(value);
              return edit && [key, edit];
            }
          )
          .map(([id, event]) => (
            <Event key={id} {...event} />
          ))}
      </div>
    </div>
  );
};
