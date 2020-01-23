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
import { getViewEventRoute } from 'src/routing';
import { EditEvent } from '../EditEvent/EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEditEvent)
  );
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();

  const addEvent = async () => {
    if (isOk(event)) {
      const createdEvent = await postEvent(event.validValue);
      history.push(getViewEventRoute(createdEvent.id));
    } else {
      throw Error('her kommer feil');
    }
  };

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const renderPreviewEvent = () => {
    if (isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <Button onClick={addEvent} disabled={false}>
            Opprett event
          </Button>
          <Button onClick={() => setPreviewState(false)} disabled={false}>
            Tilbake
          </Button>
        </Page>
      );
    }
  };

  return !previewState ? (
    <Page>
      <h1>Opprett event</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
        Forhåndsvisning
      </Button>
    </Page>
  ) : (
    renderPreviewEvent() || null
  );
};
