import { useState } from 'react';
import React from 'react';
import {
  IEditEvent,
  initialEvent,
  toEditEvent,
  parseEditEvent,
} from 'src/types/event';
import { postEvent } from 'src/api/arrangementSvc';
import { useHistory } from 'react-router';
import { viewEventRoute, eventsRoute, editEventRoute } from 'src/routing';
import { useAuthentication } from 'src/auth';
import { useSavedEditableEvents } from 'src/hooks/eventHooks';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { PreviewEventContainer } from 'src/components/PreviewEvent/PreviewEventContainer';
import { Button } from 'src/components/Common/Button/Button';
import { EditEvent } from 'src/components/EditEvent/EditEvent/EditEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import style from './CreateEventContainer.module.scss';
import { isValid } from 'src/types/validation';

export const CreateEventContainer = () => {
  useAuthentication();
  const [previewState, setPreviewState] = useState(false);

  const [event, setEvent] = useState<IEditEvent>(toEditEvent(initialEvent()));
  const parsedEvent = parseEditEvent(event);

  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const { saveEditableEvents } = useSavedEditableEvents();

  const addEvent = catchAndNotify(async () => {
    if (isValid(parsedEvent)) {
      const editUrlTemplate =
        document.location.origin + editEventRoute('{eventId}', '{editToken}');
      const {
        event: { id },
        editToken,
      } = await postEvent(parsedEvent, editUrlTemplate);
      saveEditableEvents({ eventId: id, editToken });
      history.push(viewEventRoute(id));
    }
  });

  const validatePreview = () => {
    if (isValid(parsedEvent)) {
      setPreviewState(true);
    }
  };

  const renderPreviewEvent = () => {
    if (isValid(parsedEvent)) {
      return (
        <Page>
          <PreviewEventContainer event={parsedEvent} />
          <div className={style.buttonContainer}>
            <Button onClick={addEvent}>Opprett arrangement</Button>
            <Button displayAsLink onClick={() => setPreviewState(false)}>
              Tilbake
            </Button>
          </div>
        </Page>
      );
    }
  };

  const renderCreateView = () => (
    <Page>
      <h1 className={style.header}>Opprett arrangement</h1>
      <EditEvent eventResult={event} updateEvent={setEvent} />
      <div className={style.buttonContainer}>
        <Button onClick={validatePreview} disabled={!isValid(parsedEvent)}>
          Forhåndsvisning
        </Button>
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
      </div>
    </Page>
  );

  return !previewState ? renderCreateView() : renderPreviewEvent() || null;
};
