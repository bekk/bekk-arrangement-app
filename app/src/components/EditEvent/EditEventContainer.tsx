import { useState, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
} from 'src/types/event';
import { putEvent, getEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { isOk, Result } from 'src/types/validation';
import { EditEvent } from './EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './EditEventContainer.module.scss';
import { eventsRoute } from 'src/routing';

export const EditEventContainer = () => {
  useAuthentication();
  const { id } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();

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

  const goToOverview = () => history.push(eventsRoute);
  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const PreviewView = ({ validEvent }: { validEvent: IEvent }) => (
    <>
      <PreviewEvent event={validEvent} />
      <div className={style.buttonContainer}>
        <Button onClick={editEventFunction}>Oppdater event</Button>
        <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
      </div>
    </>
  );

  const EditView = ({ isInvalid }: { isInvalid: boolean }) => (
    <>
      <h1 className={style.header}>Endre event</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <div className={style.buttonContainer}>
        <Button onClick={() => setPreviewState(true)} disabled={isInvalid}>
          Forhåndsvisning
        </Button>
        <Button onClick={goToOverview}>Avbryt</Button>
      </div>
    </>
  );

  return (
    <Page>
      {previewState && isOk(event) ? (
        <PreviewView validEvent={event.validValue} />
      ) : (
        <EditView isInvalid={!isOk(event)} />
      )}
    </Page>
  );
};
