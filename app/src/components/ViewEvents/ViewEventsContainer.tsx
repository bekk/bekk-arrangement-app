import React from 'react';
import style from './ViewEventsContainer.module.scss';
import { EventListElement } from './EventListElement';
import { createRoute } from 'src/routing';
import { useEvents } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';
import { Link } from 'react-router-dom';
import { Page } from 'src/components/Page/Page';

export const ViewEventsContainer = () => {
  const events = useEvents();

  return (
    <Page>
      <div className={style.header}>
        <h1 className={style.headerText}>Arrangementer</h1>
        <AddEventButton />
      </div>
      <div>
        {[...events].map(([id, event]) => {
          return hasLoaded(event) ? (
            <EventListElement key={id} eventId={id} event={event.data} />
          ) : null;
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
