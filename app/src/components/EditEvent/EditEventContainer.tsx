import { useState, useLayoutEffect, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  parseEventViewModel,
  IEvent,
  serializeEvent,
} from 'src/types/event';
import { putEvent, deleteEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { isValid, Editable } from 'src/types/validation';
import { EditEvent } from './EditEvent/EditEvent';
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { Modal } from 'src/components/Common/Modal/Modal';
import { useEvent, useSavedEditableEvents } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';
import { useQuery } from 'src/utils/query-string';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { PreviewEvent } from 'src/components/PreviewEvent/PreviewEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';

export const EditEventContainer = () => {
  const { eventId = 'URL-FEIL' } = useParams();

  const remoteEvent = useEvent(eventId);
  const [event, setEvent] = useState<Editable<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const editToken = useQuery('editToken');
  const { catchAndNotify } = useNotification();
  const [showModal, setShowModal] = useState(false);

  const { saveEditableEvents } = useSavedEditableEvents();

  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEvent(
        parseEvent(parseEventViewModel(serializeEvent(remoteEvent.data)))
      );
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
    isValid(event) &&
    catchAndNotify(async () => {
      const updatedEvent = await putEvent(eventId, event.validValue, editToken);
      setEvent(parseEvent(parseEventViewModel(updatedEvent)));
      history.push(viewEventRoute(eventId));
    });

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

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
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.previewButton}>
        <Button
          onClick={() => setPreviewState(true)}
          disabled={!isValid(event)}
        >
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
    if (putEditedEvent && isValid(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
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
