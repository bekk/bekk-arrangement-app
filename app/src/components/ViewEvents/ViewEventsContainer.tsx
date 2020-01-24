import React, { useEffect, useState } from 'react';
import style from './ViewEventsContainer.module.scss';
import { EventListElement } from './EventListElement';
import { createRoute, getEditEventRoute } from 'src/routing';
import { getEvents, deleteEvent } from 'src/api/arrangementSvc';
import { WithId } from 'src/types';
import {
  IEvent,
  IEventContract,
  deserializeEvent,
  parseEvent,
  IEditEvent,
} from 'src/types/event';
import { isOk, Result } from 'src/types/validation';
import { Link } from 'react-router-dom';
import { Page } from '../Page/Page';

const toParsedEventsMap = (
  events: WithId<IEventContract>[]
): Map<string, Result<IEditEvent, IEvent>> => {
  return new Map(
    events.map<[string, Result<IEditEvent, IEvent>]>(e => {
      const parsedEvent = parseEvent(deserializeEvent(e));
      return [e.id, parsedEvent];
    })
  );
};

const useEvents = () => {
  const [events, setEvents] = useState<
    Map<string, Result<IEditEvent, IEvent>>
  >();

  useEffect(() => {
    const get = async () => {
      const events = await getEvents();
      const eventsMap = toParsedEventsMap(events);
      setEvents(eventsMap);
    };
    get();
  }, []);

  return events;
};

export const ViewEventsContainer = () => {
  const events = useEvents();
  const onDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  if (!events) {
    return <div>Loading</div>;
  }
  const eventsKeys = Array.from(events.keys());

  return (
    <Page>
      <div className={style.header}>
        <h1 className={style.headerText}>Events</h1>
        <AddEventButton />
      </div>
      <div>
        {eventsKeys.map(x => {
          const eventFromMap = events.get(x);
          if (eventFromMap !== undefined && isOk(eventFromMap)) {
            return (
              <EventListElement
                key={x}
                event={eventFromMap.validValue}
                onClickRoute={getEditEventRoute(x)}
                delEvent={() => onDeleteEvent(x)}
              />
            );
          }
          return <div>Event with id {x} is no gooooood </div>;
        })}
      </div>
    </Page>
  );
};

const AddEventButton = () => {
  return (
    <div className={style.plus}>
      <Link to={createRoute}>
        <PlusIconComponent />
      </Link>
    </div>
  );
};

const PlusIconComponent = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 74">
      <rect width="100%" height="100%" />
      <title>Legg til</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <polygon
            points="36.3 50.99 37.58 50.99 37.58 36.73 51.84 36.73 51.84 35.45 37.58 35.45 37.58 21.18 36.3 21.18 36.3 35.45 22.04 35.45 22.04 36.73 36.3 36.73 36.3 50.99"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  );
};
