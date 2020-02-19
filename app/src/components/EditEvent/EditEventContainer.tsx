import { useState, useLayoutEffect, useEffect } from 'react';
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
import { Page } from '../Page/Page';
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { useEvent, useEditableEvents } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';
import { useQuery } from 'src/utils/query-string';

export const EditEventContainer = () => {
  const { eventId = 'URL-FEIL' } = useParams();

  const remoteEvent = useEvent(eventId);
  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const editToken = useQuery('editToken');
  const { catchAndNotify } = useNotification();

  const { setCreatedEvent } = useEditableEvents();

  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEvent(parseEvent(deserializeEvent(serializeEvent(remoteEvent.data))));
    }
  }, [remoteEvent]);

  useEffect(() => {
    if (editToken) {
      setCreatedEvent({ eventId, editToken });
    }
  }, [eventId, editToken, setCreatedEvent]);

  if (!event || !eventId) {
    return <div>Loading</div>;
  }

  const editEventFunction =
    isOk(event) &&
    catchAndNotify(async () => {
      const updatedEvent = await putEvent(eventId, event.validValue, editToken);
      setEvent(parseEvent(deserializeEvent(updatedEvent)));
      history.push(viewEventRoute(eventId));
    });

  const goToOverview = () => history.push(eventsRoute);

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const onDeleteEvent = catchAndNotify(async (eventId: string) => {
    await deleteEvent(eventId, editToken);
    goToOverview();
  });

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre arrangement</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.previewButton}>
        <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
          Forhåndsvis endringer
        </Button>
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={goToOverview}>Avbryt</Button>
        <Button onClick={() => onDeleteEvent(eventId)}>
          Avlys arrangement
        </Button>
      </div>
    </Page>
  );

  const renderPreviewEvent = () => {
    if (editEventFunction && isOk(event)) {
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
