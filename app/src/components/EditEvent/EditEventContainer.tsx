import { useState, useLayoutEffect, useEffect } from 'react';
import React from 'react';
import {
  IEditEvent,
  parseEventViewModel,
  toEditEvent,
  parseEditEvent,
} from 'src/types/event';
import { putEvent, deleteEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { EditEvent } from './EditEvent/EditEvent';
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { Modal } from 'src/components/Common/Modal/Modal';
import { useEvent, useSavedEditableEvents } from 'src/hooks/eventHooks';
import { hasLoaded, isLoading } from 'src/remote-data';
import { useQuery } from 'src/utils/query-string';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { PreviewEvent } from 'src/components/PreviewEvent/PreviewEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import { isValid } from 'src/types/validation';

export const EditEventContainer = () => {
  const { eventId = 'URL-FEIL' } = useParams();

  const remoteEvent = useEvent(eventId);
  const [event, setEvent] = useState<IEditEvent>();

  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const editToken = useQuery('editToken');
  const { catchAndNotify } = useNotification();
  const [showModal, setShowModal] = useState(false);

  const { saveEditableEvents } = useSavedEditableEvents();

  const validEvent = (() => {
    if (event) {
      const vEvent = parseEditEvent(event);
      if (isValid(vEvent)) {
        return vEvent;
      }
    }
  })();

  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEvent(toEditEvent(remoteEvent.data));
    }
  }, [remoteEvent]);

  useEffect(() => {
    if (editToken) {
      saveEditableEvents({ eventId, editToken });
    }
  }, [eventId, editToken, saveEditableEvents]);

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading</div>;
  }

  if (!event || !eventId) {
    return <div>Kan ikke finne event med id {eventId}</div>;
  }

  const putEditedEvent =
    validEvent &&
    catchAndNotify(async () => {
      const updatedEvent = await putEvent(eventId, validEvent, editToken);
      setEvent(toEditEvent(parseEventViewModel(updatedEvent)));
      history.push(viewEventRoute(eventId));
    });

  const onDeleteEvent = catchAndNotify(async (eventId: string) => {
    await deleteEvent(eventId, editToken);
    history.push(eventsRoute);
  });

  const CancelModal = () => (
    <Modal closeModal={() => setShowModal(false)} header="Avlys arrangement">
      <p>
        Sikker på at du vil avlyse arrangementet? <br />
        Alle deltakere vil bli slettet. Dette kan ikke reverseres{' '}
        <span role="img" aria-label="grimacing-face">
          😬
        </span>
      </p>
      <div className={style.buttonContainer}>
        <Button onClick={() => setShowModal(false)}>Avbryt</Button>
        <Button onClick={() => onDeleteEvent(eventId)} color="White">
          Avlys arrangement
        </Button>
      </div>
    </Modal>
  );

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre arrangement</h1>
      <EditEvent eventResult={event} updateEvent={setEvent} />
      <div className={style.previewButton}>
        <Button onClick={() => setPreviewState(true)} disabled={!validEvent}>
          Forhåndsvis endringer
        </Button>
      </div>
      <div className={style.buttonContainer}>
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
        <Button onClick={() => setShowModal(true)}>Avlys arrangement</Button>
      </div>
      {showModal && <CancelModal />}
    </Page>
  );

  const renderPreviewEvent = () => {
    if (putEditedEvent && validEvent) {
      return (
        <Page>
          <PreviewEvent event={validEvent} />
          <div className={style.buttonContainer}>
            <Button displayAsLink onClick={() => setPreviewState(false)}>
              Tilbake
            </Button>
            <Button onClick={putEditedEvent}>Oppdater arrangement</Button>
          </div>
        </Page>
      );
    }
  };

  return !previewState ? renderEditView() : renderPreviewEvent() || null;
};
