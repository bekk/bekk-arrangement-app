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

export const CreateEventContainer = () => {
  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEditEvent)
  );
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

  return (
    <article className={commonStyle.container}>
      <h1>Opprett event</h1> 
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <Button label="iafhse" onClick={addEvent} />
    </article>
  );
};
