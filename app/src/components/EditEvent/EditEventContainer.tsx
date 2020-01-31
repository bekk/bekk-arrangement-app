import { useState, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
} from 'src/types/event';
import { putEvent, getEvent, deleteEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { isOk, Result } from 'src/types/validation';
import { EditEvent } from './EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { useNotification } from '../NotificationHandler/NotificationHandler';

export const EditEventContainer = () => {
  useAuthentication();
  const { eventId } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const { catchAndNotify } = useNotification();

  useEffect(() => {
    if (eventId) {
      catchAndNotify(async () => {
        const retrievedEvent = await getEvent(eventId);
        setEvent(parseEvent(deserializeEvent(retrievedEvent)));
      })();
    }
  }, [eventId, catchAndNotify]);
  
  if (!event || !eventId) {
    return <div>Loading</div>;
  }

  const editEventFunction = () =>
    catchAndNotify(async () => {
      if (isOk(event)) {
        const updatedEvent = await putEvent(eventId, event.validValue);
        setEvent(parseEvent(deserializeEvent(updatedEvent)));
        history.push(viewEventRoute(eventId));
      }
    })();

  const goToOverview = () => history.push(eventsRoute);
  const goToEvent = () => history.push(viewEventRoute(eventId));
  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const onDeleteEvent = (eventId: string) =>
    catchAndNotify(async () => {
      await deleteEvent(eventId);
      goToOverview();
    })();

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre arrangement</h1>
      <EditEvent
        eventResult={event.editValue}
        updateEvent={updateEvent}
        showError={!isOk(event)}
      />
      <div className={style.buttonContainer}>
        <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
          Forhåndsvisning
        </Button>
        <Button onClick={goToEvent}>Til påmelding</Button>
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={goToOverview}>Avbryt</Button>
        <Button onClick={() => onDeleteEvent(eventId)}>Slett</Button>
      </div>
    </Page>
  );

  const renderPreviewEvent = () => {
    if (isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <div className={style.buttonContainer}>
            <Button onClick={editEventFunction}>Oppdater arrangement</Button>
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
          </div>
        </Page>
      );
    }
  };

  return !previewState ? renderEditView() : renderPreviewEvent() || null;
};
