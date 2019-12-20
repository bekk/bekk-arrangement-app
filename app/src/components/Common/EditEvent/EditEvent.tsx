import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import { IEditEvent, IEvent } from 'src/types/event';
import commonStyle from 'src/global/Common.module.scss';
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
    <section className={commonStyle.content}>
      <SectionWithValidation validationResult={event.title.errors}>
        <section className={commonStyle.subsection}>
          <TextInput
            label={'title'}
            placeholder="My event"
            value={event.title.editValue}
            onChange={title =>
              updateEvent({
                ...event,
                title: validateTitle(title),
              })
            }
          />
        </section>
      </SectionWithValidation>
      <section
        className={classNames(commonStyle.subsection, commonStyle.column)}
      >
        <TextArea
          label={'description'}
          placeholder={'description of my event'}
          value={event.description.editValue}
          onChange={description =>
            updateEvent({
              ...event,
              description: validateDescription(description),
            })
          }
        />
      </section>
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
      </SectionWithValidation>
    </section>
  );
};
