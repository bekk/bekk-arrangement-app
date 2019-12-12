import { useState } from 'react';
import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import { IEditEvent, initialEditEvent, validateEvent } from 'src/types/event';
import commonStyle from 'src/global/Common.module.scss';
import style from './CreateEvent.module.scss';
import { DateTimeInput } from '../Common/DateTimeInput/DateTimeInput';
import { validateDateTime } from 'src/types/date-time';
import classNames from 'classnames';
import { useStore } from 'src/store';
import { postEvent } from 'src/api/arrangementSvc';

export const CreateEvent = () => {
  const [event, setEvent] = useState<IEditEvent>(initialEditEvent);
  const { state, dispatch } = useStore();

  const addEvent = async () => {
    const validatedEvent = validateEvent(event);
    if (validatedEvent.data) {
      const createdEvent = await postEvent(validatedEvent.data);
      console.log(createdEvent, 'created');
      dispatch({ event: createdEvent, type: 'ADD_EVENT' });
    } else {
      throw Error('feil');
    }
  };

  return (
    <article className={commonStyle.container}>
      <section className={commonStyle.content}>
        <section className={commonStyle.subsection}>
          <TextInput
            label={'title'}
            placeholder="My event"
            value={event.title}
            onChange={title => setEvent({ ...event, title })}
          />
        </section>
        <section
          className={classNames(commonStyle.subsection, commonStyle.column)}
        >
          <TextArea
            label={'description'}
            placeholder={'description of my event'}
            value={event.description}
            onChange={description => setEvent({ ...event, description })}
          />
        </section>
        <section className={style.subsection}>
          <TextInput
            label={'location'}
            placeholder="Stavanger, Norway"
            value={event.location}
            onChange={location => setEvent({ ...event, location })}
          />
        </section>
        <SectionWithValidation
          validationResult={validateDateTime(event.start).errors}
        >
          <section className={commonStyle.row}>
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
        <section className={commonStyle.subsection} onClick={addEvent}>
          <button>Create</button>
        </section>

        {/* {eventModel.data && (
          <button onClick={() => onChange(eventModel.data)}>Create</button>
        )} */}
      </section>
    </article>
  );
};
