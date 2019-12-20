import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import { IEditEvent } from 'src/types/event';
import commonStyle from 'src/style/Common.module.scss';
import style from './EditEvent.module.scss';
import { DateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import classNames from 'classnames';
import { validateTitle, validateDescription } from 'src/types';
import { validateDateTime } from 'src/types/date-time';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult, updateEvent }: IProps) => {
  const event = eventResult;
  return (
    <div className={commonStyle.content}>
      <section className={style.editSection}>
        <TextInput
          label={'Tittel'}
          value={event.title.editValue}
          onChange={title =>
            updateEvent({
              ...event,
              title: validateTitle(title),
            })
          }
        />
        <ValidationResult validationResult={event.title.errors} />
      </section>
      <section className={style.editSection}>
        <TextArea
          label={'Beskrivelse'}
          value={event.description.editValue}
          onChange={description =>
            updateEvent({
              ...event,
              description: validateDescription(description),
            })
          }
        />
        <ValidationResult validationResult={event.description.errors} />
      </section>
      <section className={style.editSection}>
        <TextInput
          label={'Lokasjon'}
          placeholder=""
          value={event.location}
          onChange={location =>
            updateEvent({
              ...event,
              location: location,
            })
          }
        />
      </section>
      <section className={style.editSection}>
        <DateTimeInput
          label={'Starter'}
          value={event.start.editValue}
          onChange={start =>
            updateEvent({
              ...event,
              start: validateDateTime(start),
            })
          }
        />
      </section>
      {/* 
      <section className={commonStyle.subsection}>
        <TextInput
          label={'location'}
          placeholder="Stavanger, Norway"
          value={event.location}
          onChange={location => updateEvent({ ...event, location })}
        />
      </section>
      <SectionWithValidation validationResult={eventResult.start.errors}>
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'Start date'}
            value={event.start.editValue}
            onChange={start =>
              updateEvent({
                ...event,
                start: validateDateTime(start),
              })
            }
          />
        </section>
      </SectionWithValidation>
      <SectionWithValidation validationResult={eventResult.end.errors}>
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'End date'}
            value={event.end.editValue}
            onChange={end =>
              updateEvent({ ...event, end: validateDateTime(end) })
            }
          />
        </section>
      </SectionWithValidation>
      <SectionWithValidation
        validationResult={eventResult.openForRegistration.errors}
      >
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'Open for registration date'}
            value={event.openForRegistration.editValue}
            onChange={openForRegistration =>
              updateEvent({
                ...event,
                openForRegistration: validateDateTime(openForRegistration),
              })
            }
          />
        </section>
      </SectionWithValidation>{' '}
      */}
    </div>
  );
};
