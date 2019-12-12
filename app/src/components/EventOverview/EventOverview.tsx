import React from 'react';
import { Menu } from '../Common/Menu/Menu';
import style from './EventOverview.module.scss';
import commonStyle from 'src/global/Common.module.scss';
import { EventListElement } from './EventListElement';
import { editRoute } from 'src/routing';
import { useStore } from 'src/store';

export const EventOverview = () => {
  const { state, dispatch } = useStore();

  return (
    <div className={style.container}>
      <div className={commonStyle.content}>
        <Menu tab={'overview'} />
        <div className={style.overview}>
          {state.events.map((event, id) => (
            <EventListElement
              key={id}
              event={event}
              editRoute={editRoute(id)}
              delEvent={() => dispatch({ id: event.id, type: 'DELETE_EVENT' })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
