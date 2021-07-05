import React from 'react';
import style from './ViewEventsCards.module.scss';
import { createRoute } from 'src/routing';
import { hasLoaded } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { useEvents } from 'src/hooks/cache';
import { EventCardElement } from 'src/components/ViewEventsCards/EventCardElement';
import { Button } from 'src/components/Common/Button/Button';
import { useHistory } from 'react-router';

export const ViewEventsCardsContainer = () => {
  const events = useEvents();

  return (
    <Page>
      <div className={style.header}>
        <h1 className={style.headerText}>Arrangementer</h1>
        <AddEventButton />
      </div>
      <div className={style.grid}>
        {[...events].map(([id, event]) =>
          hasLoaded(event) ? (
            <EventCardElement key={id} eventId={id} event={event.data} />
          ) : null
        )}
      </div>
    </Page>
  );
};

const AddEventButton = () => {
  const history = useHistory();
  return (
    <Button onClick={() => history.push(createRoute)}>
      Opprett et arrangement
    </Button>
  );
};
