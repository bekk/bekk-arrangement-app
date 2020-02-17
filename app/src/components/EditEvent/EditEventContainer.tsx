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
import { Modal } from '../Common/Modal/Modal';

export const EditEventContainer = () => {
  useAuthentication();
  const { eventId } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const [showModal, setShowModal] = useState(false);

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
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.previewButton}>
        <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
          Forhåndsvis endringer
        </Button>
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={goToOverview}>Avbryt</Button>
        <Button onClick={() => setShowModal(true)}>Avlys arrangement</Button>
      </div>
      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          header="Avlys arrangement"
        >
          <div>
            Sikker på at du vil avlyse arrangementet? <br />
            Alle deltakere vil bli slettet. Dette kan ikke reverseres{' '}
            <span role="img" aria-label="grimacing-face">
              😬
            </span>
          </div>
          <div className={style.buttonContainer}>
            <Button onClick={() => setShowModal(false)} color="White">
              Avbryt
            </Button>
            <Button onClick={() => onDeleteEvent(eventId)} color="White">
              Avlys arrangement
            </Button>
          </div>
        </Modal>
      )}
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
