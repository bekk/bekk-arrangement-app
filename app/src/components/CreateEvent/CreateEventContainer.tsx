import { useState } from 'react';
import React from 'react';
import { IEditEvent, parseEvent, IEvent, initialEvent } from 'src/types/event';
import { postEvent } from 'src/api/arrangementSvc';
import { isOk, Result } from 'src/types/validation';
import { useHistory } from 'react-router';
import { viewEventRoute, eventsRoute, editEventRoute } from 'src/routing';
import { useAuthentication } from 'src/auth';
import style from './CreateEventContainer.module.scss';
import { useSavedEditableEvents } from 'src/hooks/eventHooks';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { Page } from 'src/components/Page/Page';
import { PreviewEvent } from 'src/components/PreviewEvent/PreviewEvent';
import { Button } from 'src/components/Common/Button/Button';
import { EditEvent } from 'src/components/EditEvent/EditEvent/EditEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEvent)
  );
  const [previewState, setPreviewState] = useState(false);
  const isDisabled = !isOk(event);
  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const { saveEditableEvents } = useSavedEditableEvents();

  const addEvent = catchAndNotify(async () => {
    if (isOk(event)) {
      const editUrlTemplate =
        document.location.origin + editEventRoute('{eventId}', '{editToken}');
      const {
        event: { id },
        editToken,
      } = await postEvent(event.validValue, editUrlTemplate);
      saveEditableEvents({ eventId: id, editToken });
      history.push(viewEventRoute(id));
    }
  });

  const validatePreview = () => {
    if (isOk(event)) {
      setPreviewState(true);
    }
  };

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const renderPreviewEvent = () => {
    if (isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <div className={style.buttonContainer}>
            <Button onClick={addEvent}>Opprett arrangement</Button>
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
          </div>
        </Page>
      );
    }
  };

  const renderCreateView = () => (
    <Page>
      <h1 className={style.header}>Opprett arrangement</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.buttonContainer}>
        <Button onClick={validatePreview} disabled={isDisabled}>
          Forhåndsvisning
        </Button>
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
      </div>
    </Page>
  );

  return !previewState ? renderCreateView() : renderPreviewEvent() || null;
};
