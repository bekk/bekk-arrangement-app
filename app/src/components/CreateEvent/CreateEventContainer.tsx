import { useState } from 'react';
import React from 'react';
import {
  IEditEvent,
  initialEditEvent,
  parseEvent,
  IEvent,
} from 'src/types/event';
import { postEvent } from 'src/api/arrangementSvc';
import { isOk, Result } from 'src/types/validation';
import { useHistory } from 'react-router';
import { eventsRoute, viewEventRoute } from 'src/routing';
import { EditEvent } from '../EditEvent/EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './CreateEventContainer.module.scss';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { useRecentlyCreatedEvent } from 'src/hooks/eventHooks';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEditEvent)
  );
  const [previewState, setPreviewState] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const isDisabled = hasClicked ? !isOk(event) : false;
  const history = useHistory();
  const { catchAndNotify } = useNotification();
  const { setCreatedEvent } = useRecentlyCreatedEvent();

  const addEvent = catchAndNotify(async () => {
    if (isOk(event)) {
      const createdEvent = await postEvent(event.validValue);
      setCreatedEvent(createdEvent.id);
      history.push(viewEventRoute(createdEvent.id));
    }
  });

  const goToOverview = () => history.push(eventsRoute);

  const validatePreview = () => {
    setHasClicked(true);
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
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
            <Button onClick={addEvent}>Opprett arrangement</Button>
          </div>
        </Page>
      );
    }
  };

  const renderCreateView = () => (
    <Page>
      <h1 className={style.header}>Opprett arrangement</h1>
      <EditEvent
        eventResult={event.editValue}
        updateEvent={updateEvent}
        showError={!isOk(event) && hasClicked}
      />
      <div className={style.buttonContainer}>
        <Button onClick={goToOverview}>Avbryt</Button>
        <Button onClick={validatePreview} disabled={isDisabled}>
          Forhåndsvisning
        </Button>
      </div>
    </Page>
  );

  return !previewState ? renderCreateView() : renderPreviewEvent() || null;
};
