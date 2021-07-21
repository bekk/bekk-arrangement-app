import React from 'react';
import style from './ViewEventsCards.module.scss';
import { createRoute } from 'src/routing';
import { hasLoaded, RemoteData } from 'src/remote-data';
import { Page } from 'src/components/Page/Page';
import { usePastEvents, useUpcomingEvents } from 'src/hooks/cache';
import { EventCardElement } from 'src/components/ViewEventsCards/EventCardElement';
import { Button } from 'src/components/Common/Button/Button';
import { useHistory } from 'react-router';
import { authenticateUser, isAuthenticated } from 'src/auth';
import { WavySubHeader } from 'src/components/Common/Header/WavySubHeader';
import { IEvent } from 'src/types/event';
import { isInOrder } from 'src/types/date-time';

export const ViewEventsCardsContainer = () => {
  const events = useUpcomingEvents();
  const pastEvents = usePastEvents();

  return (
    <>
      <WavySubHeader eventId={'all-events'}>
        <div role="heading" className={style.header}>
          <h1 className={style.headerText}>Hva skjer i Bekk?</h1>
          <AddEventButton />
        </div>
      </WavySubHeader>
      <Page>
        <h2 className={style.subHeaderText}>Kommende arrangementer</h2>
        <div className={style.grid}>
          {sortEvents(events).map(([id, event]) => (
            <EventCardElement key={id} eventId={id} event={event} />
          ))}
        </div>
        <div className={style.pastEventsContainer}>
          <h2 className={style.subHeaderText}>Fullførte arrangementer</h2>
          <div className={style.grid}>
            {sortEvents(pastEvents)
              .reverse()
              .map(([id, event]) => (
                <EventCardElement key={id} eventId={id} event={event} />
              ))}
          </div>
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

const sortEvents = (events: Map<string, RemoteData<IEvent>>) => {
  const eventList: [string, IEvent][] = [...events].flatMap(([id, event]) =>
    hasLoaded(event) ? [[id, event.data]] : []
  );
  return [...eventList].sort(([idA, a], [idB, b]) =>
    isInOrder({ first: a.start, last: b.start }) ? -1 : 1
  );
};
