import { useState } from 'react';
import React from 'react';
import {
  IEditEvent,
  initialEditEvent,
  parseEvent,
  IEvent,
} from 'src/types/event';
import commonStyle from 'src/style/Common.module.scss';
import { postEvent } from 'src/api/arrangementSvc';
import { isOk, Result } from 'src/types/validation';
import { useHistory } from 'react-router';
import { getViewEventRoute } from 'src/routing';
import { EditEvent } from '../Common/EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../Common/PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';

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
        <>
          <PreviewEvent event={event.validValue} />
          <Button label="Opprett event" onClick={addEvent} disabled={false} />
          <Button
            label="Tilbake"
            onClick={() => setPreviewState(false)}
            disabled={false}
          />
        </>
      );
    }
  };

  return (
    <article>
      {!previewState ? (
        <div className={commonStyle.content}>
          <h1>Opprett event</h1>
          <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
          <Button
            label="Forhåndsvisning"
            onClick={() => setPreviewState(true)}
            disabled={!isOk(event)}
          />
        </div>
      ) : (
        renderPreviewEvent()
      )}
    </article>
  );
};
