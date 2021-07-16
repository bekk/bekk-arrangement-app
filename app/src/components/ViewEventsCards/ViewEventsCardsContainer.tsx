import React from 'react';
import style from './ViewEventsCards.module.scss';
import { createRoute } from 'src/routing';
import { hasLoaded } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { useEvents, usePastEvents } from 'src/hooks/cache';
import { EventCardElement } from 'src/components/ViewEventsCards/EventCardElement';
import { Button } from 'src/components/Common/Button/Button';
import { useHistory } from 'react-router';
import { authenticateUser, isAuthenticated } from 'src/auth';
import { WavySubHeader } from 'src/components/Common/Header/WavySubHeader';

export const ViewEventsCardsContainer = () => {
  const events = useEvents();
  const pastEvents = usePastEvents();

  return (
    <>
      <WavySubHeader>
        <div className={style.header}>
          <h1 className={style.headerText}>Arrangementer</h1>
          <AddEventButton />
        </div>
      </WavySubHeader>
      <Page>
        <div className={style.grid}>
          {[...events].map(([id, event]) =>
            hasLoaded(event) ? (
              <EventCardElement key={id} eventId={id} event={event.data} />
            ) : null
          )}
        </div>
      </Page>
    </>
  );
};

const AddEventButton = () => {
  const history = useHistory();
  if (isAuthenticated()) {
    return (
      <Button color={'Secondary'} onClick={() => history.push(createRoute)}>
        Opprett et arrangement
      </Button>
    );
  }
  return <Button onClick={authenticateUser}>Logg inn</Button>;
};
