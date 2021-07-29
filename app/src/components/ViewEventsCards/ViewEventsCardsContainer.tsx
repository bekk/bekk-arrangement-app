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
import { Dropdown } from 'src/components/Common/Dropdown/Dropdown';
import {
  useSavedEditableEvents,
  useSavedParticipations,
} from 'src/hooks/saved-tokens';
import { usePersistentHistoryState } from 'src/utils/browser-state';

export const ViewEventsCardsContainer = () => {
  const events = useUpcomingEvents();
  const pastEvents = usePastEvents();
  const allEvents = new Map([...events].concat([...pastEvents]));

  const [selectedOption, setSelectedOption] = usePersistentHistoryState(1);

  const options = [
    { name: 'Kommende arrangement', id: 1 },
    { name: 'Tidligere arrangement', id: 2 },
    { name: 'Mine arrangement', id: 3 },
    { name: 'Arrangementer jeg deltar på', id: 4 },
  ];

  const showEvents = (id: number) => {
    switch (id) {
      case 1:
        return <UpcomingEvents events={events} />;

      case 2:
        return <PastEvents events={pastEvents} />;

      case 3:
        return <MyEvents events={allEvents} />;

      case 4:
        return <MyParticipations events={events} />;
    }
  };

  return (
    <>
      <WavySubHeader eventId={'all-events'}>
        <div role="heading" className={style.header}>
          <h1 className={style.headerText}>Hva skjer i Bekk?</h1>
          <AddEventButton />
        </div>
      </WavySubHeader>
      <Page>
        <div className={style.headerContainer}>
          <Dropdown
            items={options}
            onChange={(option) => setSelectedOption(option)}
            selectedId={selectedOption}
          />
        </div>
        {showEvents(selectedOption)}
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

const UpcomingEvents = (props: { events: Map<string, RemoteData<IEvent>> }) => {
  return (
    <div>
      <div className={style.grid}>
        {sortEvents(props.events).map(([id, event]) => (
          <EventCardElement key={id} eventId={id} event={event} />
        ))}
      </div>
    </div>
  );
};

const PastEvents = (props: { events: Map<string, RemoteData<IEvent>> }) => {
  return (
    <div>
      <div className={style.grid}>
        {sortEvents(props.events)
          .reverse()
          .map(([id, event]) => (
            <EventCardElement key={id} eventId={id} event={event} />
          ))}
      </div>
    </div>
  );
};

const MyEvents = (props: { events: Map<string, RemoteData<IEvent>> }) => {
  const savedEvents = useSavedEditableEvents();
  const filteredEvents = [...sortEvents(props.events)].filter(([id, events]) =>
    savedEvents.savedEvents.map((x) => x.eventId).includes(id)
  );
  return (
    <div>
      <div className={style.grid}>
        {filteredEvents.reverse().map(([id, event]) => (
          <EventCardElement key={id} eventId={id} event={event} />
        ))}
      </div>
    </div>
  );
};

const MyParticipations = (props: {
  events: Map<string, RemoteData<IEvent>>;
}) => {
  const savedEvents = useSavedParticipations();
  const filteredEvents = [...sortEvents(props.events)].filter(([id, events]) =>
    savedEvents.savedParticipations.map((x) => x.eventId).includes(id)
  );
  return (
    <div>
      <div className={style.grid}>
        {filteredEvents.reverse().map(([id, event]) => (
          <EventCardElement key={id} eventId={id} event={event} />
        ))}
      </div>
    </div>
  );
};
