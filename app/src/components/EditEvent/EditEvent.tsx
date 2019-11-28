import { useState } from 'react';
import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import {
  IEvent,
  IEditEvent,
  validateEvent,
  serializeEvent,
  parseEvent,
} from 'src/types/event';
import style from './EditEvent.module.scss';
import { DateTimeInput } from '../Common/DateTimeInput/DateTimeInput';
import { validateDateTime } from 'src/types/date-time';

interface Props {
  event: IEvent;
  onChange: (write: IEvent) => Promise<void>;
}

export const EditEvent = ({ event: editEvent, onChange }: Props) => {
  const [event, setEvent] = useState<IEditEvent>(
    parseEvent({ id: 0, ...serializeEvent(editEvent) })[1]
  );

  const eventModel = validateEvent(event);

  return (
    <article className={style.container}>
      <section className={style.column}>
        <TextInput
          label={'title'}
          placeholder="My event"
          value={event.title}
          onChange={title => setEvent({ ...event, title })}
        />
        <TextArea
          label={'description'}
          placeholder={'description of my event'}
          value={event.description}
          onChange={description => setEvent({ ...event, description })}
        />
        <TextInput
          label={'location'}
          placeholder="Stavanger, Norway"
          value={event.location}
          onChange={location => setEvent({ ...event, location })}
        />
        <SectionWithValidation
          validationResult={validateDateTime(event.start).errors}
        >
          <section className={style.row}>
            <DateTimeInput
              label={'Start date'}
              value={event.start}
              onChange={start => setEvent({ ...event, start })}
            />
          </section>
        </SectionWithValidation>
        <SectionWithValidation
          validationResult={validateDateTime(event.end).errors}
        >
          <section className={style.row}>
            <DateTimeInput
              label={'End date'}
              value={event.end}
              onChange={end => setEvent({ ...event, end })}
            />
          </section>
        </SectionWithValidation>
        <SectionWithValidation
          validationResult={validateDateTime(event.openForRegistration).errors}
        >
          <section className={style.row}>
            <DateTimeInput
              label={'Open for registration date'}
              value={event.openForRegistration}
              onChange={openForRegistration =>
                setEvent({ ...event, openForRegistration })
              }
            />
          </section>
        </SectionWithValidation>
        {eventModel.data && (
          <button onClick={() => onChange(eventModel.data)}>Create</button>
        )}
      </section>
    </article>
  );
};
