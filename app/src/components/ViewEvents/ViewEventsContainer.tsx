import React, { useEffect } from 'react';
import { Menu } from '../Common/Menu/Menu';
import commonStyle from 'src/global/Common.module.scss';
import { EventListElement } from './EventListElement';
import { getViewEventRoute } from 'src/routing';
import { useStore, Actions } from 'src/store';
import { getEvents, deleteEvent } from 'src/api/arrangementSvc';
import { WithId } from 'src/types';
import { IEvent } from 'src/types/event';

const useEvents = (): [WithId<IEvent>[], (action: Actions) => void] => {
  const { state, dispatch } = useStore();
  const eventsInState = state.events;

  useEffect(() => {
    const get = async () => {
      const events = await getEvents();
      dispatch({ type: 'SET_EVENTS', events });
    };
    get();
  }, []);

  return [eventsInState, dispatch];
};

export const ViewEventsContainer = () => {
  const [eventsInState, dispatch] = useEvents();
  const onDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    dispatch({ id: eventId, type: 'DELETE_EVENT' });
  };

  return (
    <div className={commonStyle.container}>
      <div className={commonStyle.content}>
        <Menu tab={'overview'} />
        <h1>Events</h1>
        <div>
          {eventsInState.map((event, id) => (
            <EventListElement
              key={event.id}
              event={event}
              onClickRoute={getViewEventRoute(event.id)}
              delEvent={() => onDeleteEvent(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
