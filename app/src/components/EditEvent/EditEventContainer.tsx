import { useState, useEffect, useLayoutEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
  serializeEvent,
} from 'src/types/event';
import { putEvent, deleteEvent } from 'src/api/arrangementSvc';
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
import { useEvent } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';

export const EditEventContainer = () => {
  useAuthentication();
  const { eventId = 'URL-FEIL' } = useParams();

  const remoteEvent = useEvent(eventId);
  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const { catchAndNotify } = useNotification();

  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEvent(parseEvent(deserializeEvent(serializeEvent(remoteEvent.data))));
    }
  }, [remoteEvent]);

  if (!event || !eventId) {
    return <div>Loading</div>;
  }

  const editEventFunction = catchAndNotify(async () => {
    if (isOk(event)) {
      const updatedEvent = await putEvent(eventId, event.validValue);
      setEvent(parseEvent(deserializeEvent(updatedEvent)));
      history.push(viewEventRoute(eventId));
    }
  });

  const goToOverview = () => history.push(eventsRoute);
  const goToEvent = () => history.push(viewEventRoute(eventId));

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const onDeleteEvent = catchAndNotify(async (eventId: string) => {
    await deleteEvent(eventId);
    goToOverview();
  });

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre arrangement</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.buttonContainer}>
        <Button onClick={goToEvent}>Avbryt - til påmelding</Button>
        <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
          Forhåndsvis endringer
        </Button>
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
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
            <Button onClick={editEventFunction}>Oppdater arrangement</Button>
          </div>
        </Page>
      );
    }
  };

  return !previewState ? renderEditView() : renderPreviewEvent() || null;
};
