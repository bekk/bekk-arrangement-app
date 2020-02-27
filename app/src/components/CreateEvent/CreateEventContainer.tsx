import { useState } from 'react';
import React from 'react';
import {
  IEditEvent,
  initialEvent,
  toEditEvent,
  parseEditEvent,
} from 'src/types/event';
import { postEvent } from 'src/api/arrangementSvc';
import { isIErrorList } from 'src/types/validation';
import { useHistory } from 'react-router';
import { viewEventRoute, eventsRoute, editEventRoute } from 'src/routing';
import { useAuthentication } from 'src/auth';
import { useSavedEditableEvents } from 'src/hooks/eventHooks';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { PreviewEvent } from 'src/components/PreviewEvent/PreviewEvent';
import { Button } from 'src/components/Common/Button/Button';
import { EditEvent } from 'src/components/EditEvent/EditEvent/EditEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import style from './CreateEventContainer.module.scss';

export const CreateEventContainer = () => {
  useAuthentication();
  const [previewState, setPreviewState] = useState(false);

  const [event, setEvent] = useState<IEditEvent>(toEditEvent(initialEvent()));
  const parsedEvent = parseEditEvent(event);
  const isInvalid = isIErrorList(parsedEvent);

  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const { saveEditableEvents } = useSavedEditableEvents();

  const addEvent = catchAndNotify(async () => {
    if (!isIErrorList(parsedEvent)) {
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
    if (!isInvalid) {
      setPreviewState(true);
    }
  };

  const renderPreviewEvent = () => {
    if (!isIErrorList(parsedEvent)) {
      return (
        <Page>
          <PreviewEvent event={parsedEvent} />
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
        <Button onClick={validatePreview} disabled={isInvalid}>
          Forhåndsvisning
        </Button>
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
      </div>
    </Page>
  );

  return !previewState ? renderCreateView() : renderPreviewEvent() || null;
};
