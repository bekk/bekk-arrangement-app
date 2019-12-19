import { useState } from 'react';
import React from 'react';
import {
  IEditEvent,
  initialEditEvent,
  parseEvent,
  IEvent,
} from 'src/types/event';
import commonStyle from 'src/global/Common.module.scss';
import { postEvent } from 'src/api/arrangementSvc';
import { isOk, Result } from 'src/types/validation';
import { useHistory } from 'react-router';
import { getViewEventRoute } from 'src/routing';
import { EditEvent } from '../Common/EditEvent/EditEvent';

export const CreateEvent = () => {
  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>(
    parseEvent(initialEditEvent)
  );
  const history = useHistory();

  const addEvent = async () => {
    if (isOk(event)) {
      const createdEvent = await postEvent(event.validated);
      history.push(getViewEventRoute(createdEvent.id));
    } else {
      throw Error('her kommer feil');
    }
  };

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  return (
    <article className={commonStyle.container}>
      <EditEvent eventResult={event} updateEvent={updateEvent} />
      <section className={commonStyle.subsection} onClick={addEvent}>
        <button>Create</button>
      </section>
    </article>
  );
};
