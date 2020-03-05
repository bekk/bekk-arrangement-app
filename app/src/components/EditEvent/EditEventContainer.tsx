import { useState, useLayoutEffect, useEffect } from 'react';
import React from 'react';
import { IEditEvent, toEditEvent, parseEditEvent } from 'src/types/event';
import { putEvent, deleteEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { EditEvent } from './EditEvent/EditEvent';
import style from './EditEventContainer.module.scss';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { useEvent, useSavedEditableEvents } from 'src/hooks/eventHooks';
import { hasLoaded } from 'src/remote-data';
import { useQuery } from 'src/utils/query-string';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import { isValid } from 'src/types/validation';
import { PreviewEventContainer } from 'src/components/PreviewEvent/PreviewEventContainer';
import { ButtonWithConfirmModal } from 'src/components/Common/ButtonWithConfirmModal/ButtonWithConfirmModal';

const useEditEvent = () => {
  const { eventId = '' } = useParams();
  const remoteEvent = useEvent(eventId);

  const [editEvent, setEditEvent] = useState<IEditEvent>();
  useLayoutEffect(() => {
    if (hasLoaded(remoteEvent)) {
      setEditEvent(toEditEvent(remoteEvent.data));
    }
  }, [remoteEvent]);

  const validEvent = (() => {
    if (editEvent) {
      const validEvent = parseEditEvent(editEvent);
      if (isValid(validEvent)) {
        return validEvent;
      }
    }
  })();

  return { eventId, validEvent, editEvent, setEditEvent };
};

const useSaveThisEditToken = ({
  editToken,
  eventId,
}: {
  editToken?: string;
  eventId: string;
}) => {
  const { saveEditableEvents } = useSavedEditableEvents();
  useEffect(() => {
    if (editToken) {
      saveEditableEvents({ eventId, editToken });
    }
  }, [eventId, editToken, saveEditableEvents]);
};

export const EditEventContainer = () => {
  const { eventId, validEvent, editEvent, setEditEvent } = useEditEvent();

  const [previewState, setPreviewState] = useState(false);

  const { catchAndNotify } = useNotification();
  const history = useHistory();

  const editToken = useQuery('editToken');
  useSaveThisEditToken({ editToken, eventId });

  if (!editEvent) {
    return <div>Loading</div>;
  }

  const putEditedEvent =
    validEvent &&
    catchAndNotify(async () => {
      await putEvent(eventId, validEvent, editToken);
      history.push(viewEventRoute(eventId));
    });

  const onDeleteEvent = catchAndNotify(async () => {
    await deleteEvent(eventId, editToken);
    history.push(eventsRoute);
  });

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre arrangement</h1>
      <EditEvent eventResult={editEvent} updateEvent={setEditEvent} />
      <div className={style.previewButton}>
        <Button onClick={() => setPreviewState(true)} disabled={!validEvent}>
          Forhåndsvis endringer
        </Button>
      </div>
      <div className={style.buttonContainer}>
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
        <ButtonWithConfirmModal
          text={'Avlys arrangement'}
          onConfirm={onDeleteEvent}
        >
          <p>
            sikker på at du vil avlyse arrangementet? <br />
            alle deltakere vil bli slettet. dette kan ikke reverseres{' '}
            <span role="img" aria-label="grimacing-face">
              😬
            </span>
          </p>
        </ButtonWithConfirmModal>
      </div>
    </Page>
  );

  const renderPreviewEvent = () => {
    if (putEditedEvent && validEvent) {
      return (
        <Page>
          <PreviewEventContainer event={validEvent} />
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
