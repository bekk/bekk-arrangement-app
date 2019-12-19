import { useState, useEffect } from 'react';
import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import { parseEvent, IEditEvent, deserializeEvent } from 'src/types/event';
import style from './EditEventContainer.module.scss';
import { DateTimeInput } from '../Common/DateTimeInput/DateTimeInput';
import { validateDateTime } from 'src/types/date-time';
import { putEvent, getEvent } from 'src/api/arrangementSvc';
import commonStyle from 'src/global/Common.module.scss';
import { useParams } from 'react-router';
import { isOk } from 'src/types/validation';

export const EditEventContainer = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<IEditEvent>();

  useEffect(() => {
    if (id) {
      const get = async () => {
        const retrievedEvent = await getEvent(id);
        setEvent(deserializeEvent(retrievedEvent));
      };
      get();
    }
  }, [id]);

  if (!event || !id) {
    return <div>Loading</div>;
  }

  const editEventFunction = async () => {
    const parsedEvent = parseEvent(event);
    if (isOk(parsedEvent)) {
      const updatedEvent = await putEvent(id, parsedEvent.validated);
      setEvent(deserializeEvent(updatedEvent));
    } else {
      throw Error('feil');
    }
  };

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
        <section className={commonStyle.subsection} onClick={editEventFunction}>
          <button>Lagre</button>
        </section>
      </section>
    </article>
  );
};
