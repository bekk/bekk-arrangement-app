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
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { useEvent, useSavedEditableEvents } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';
import { useQuery } from 'src/utils/query-string';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { PreviewEvent } from 'src/components/PreviewEvent/PreviewEvent';

export const EditEventContainer = () => {
  const { eventId = 'URL-FEIL' } = useParams();

  const remoteEvent = useEvent(eventId);
  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const editToken = useQuery('editToken');
  const { catchAndNotify } = useNotification();

  const { saveEditableEvents } = useSavedEditableEvents();

  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEvent(parseEvent(deserializeEvent(serializeEvent(remoteEvent.data))));
    }
  }, [remoteEvent]);

  useEffect(() => {
    if (editToken) {
      saveEditableEvents({ eventId, editToken });
    }
  }, [eventId, editToken, saveEditableEvents]);

  if (!event || !eventId) {
    return <div>Loading</div>;
  }

  const putEditedEvent =
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
    if (putEditedEvent && isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <div className={style.buttonContainer}>
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
            <Button onClick={putEditedEvent}>Oppdater arrangement</Button>
          </div>
        </Page>
      );
    }
  };

  return !previewState ? renderEditView() : renderPreviewEvent() || null;
};
