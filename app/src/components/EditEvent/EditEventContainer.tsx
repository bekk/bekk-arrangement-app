import { useState, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
} from 'src/types/event';
import { putEvent, getEvent } from 'src/api/arrangementSvc';
import commonStyle from 'src/style/Common.module.scss';
import { useParams } from 'react-router';
import { isOk, Result } from 'src/types/validation';
import { EditEvent } from '../Common/EditEvent/EditEvent';

export const EditEventContainer = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();

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

  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  return (
    <article className={commonStyle.container}>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <section className={commonStyle.subsection} onClick={editEventFunction}>
        <button>Lagre</button>
      </section>
    </article>
  );
};
