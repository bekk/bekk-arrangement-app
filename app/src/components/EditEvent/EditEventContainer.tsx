import { useState, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
} from 'src/types/event';
import { putEvent, getEvent } from 'src/api/arrangementSvc';
import { useParams } from 'react-router';
import { isOk, Result } from 'src/types/validation';
import { EditEvent } from './EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../Common/PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './EditEventContainer.module.scss';

export const EditEventContainer = () => {
  useAuthentication();
  const { id } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);

  useEffect(() => {
    if (id) {
      const get = async () => {
        const retrievedEvent = await getEvent(id);
        setEvent(parseEvent(deserializeEvent(retrievedEvent)));
      };
      get();
    }
  }, [id]);

  if (!event || !id) {
    return <div>Loading</div>;
  }

  const editEventFunction = async () => {
    if (isOk(event)) {
      const updatedEvent = await putEvent(id, event.validValue);
      setEvent(parseEvent(deserializeEvent(updatedEvent)));
    } else {
      throw Error('feil');
    }
  };

  const renderPreviewEvent = () => {
    if (isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <Button
            label="Oppdater event"
            onClick={editEventFunction}
            disabled={false}
          />
          <Button
            label="Tilbake"
            onClick={() => setPreviewState(false)}
            disabled={false}
          />
        </Page>
      );
    }
  };

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  return !previewState ? (
    <Page>
      <h1 className={style.header}>Endre event</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <Button
        label="Forhåndsvisning"
        onClick={() => setPreviewState(true)}
        disabled={!isOk(event)}
      />
    </Page>
  ) : (
    renderPreviewEvent() || null
  );
};
