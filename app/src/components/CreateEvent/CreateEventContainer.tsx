import { useState } from 'react';
import React from 'react';
import { IEditEvent, parseEvent, IEvent, initialEvent } from 'src/types/event';
import { postEvent } from 'src/api/arrangementSvc';
import { isOk, Result } from 'src/types/validation';
import { useHistory } from 'react-router';
import { viewEventRoute, eventsRoute } from 'src/routing';
import { EditEvent } from '../EditEvent/EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './CreateEventContainer.module.scss';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { useRecentlyCreatedEvent } from 'src/hooks/eventHooks';
import { BlockLink } from '../Common/BlockLink/BlockLink';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEvent)
  );
  const [previewState, setPreviewState] = useState(false);
  const isDisabled = !isOk(event);
  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const { setCreatedEventId } = useRecentlyCreatedEvent();

  const addEvent = catchAndNotify(async () => {
    if (isOk(event)) {
      const createdEvent = await postEvent(event.validValue);
      setCreatedEventId(createdEvent.id);
      history.push(viewEventRoute(createdEvent.id));
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
