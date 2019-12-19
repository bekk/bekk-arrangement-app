import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import { IEditEvent, IEvent } from 'src/types/event';
import commonStyle from 'src/global/Common.module.scss';
import { DateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import classNames from 'classnames';
import { Result } from 'src/types/validation';

interface IProps {
  eventResult: Result<IEditEvent, IEvent>;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult, updateEvent }: IProps) => {
  const event = eventResult.from;
  return (
    <section className={commonStyle.content}>
      <section className={commonStyle.subsection}>
        <TextInput
          label={'title'}
          placeholder="My event"
          value={event.title}
          onChange={title => updateEvent({ ...event, title })}
        />
      </section>
      <section
        className={classNames(commonStyle.subsection, commonStyle.column)}
      >
        <TextArea
          label={'description'}
          placeholder={'description of my event'}
          value={event.description}
          onChange={description => updateEvent({ ...event, description })}
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
      <SectionWithValidation validationResult={eventResult.errors}>
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'Start date'}
            value={event.start}
            onChange={start => updateEvent({ ...event, start })}
          />
        </section>
      </SectionWithValidation>
      <SectionWithValidation validationResult={eventResult.errors}>
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'End date'}
            value={event.end}
            onChange={end => updateEvent({ ...event, end })}
          />
        </section>
      </SectionWithValidation>
      <SectionWithValidation validationResult={eventResult.errors}>
        <section className={commonStyle.row}>
          <DateTimeInput
            label={'Open for registration date'}
            value={event.openForRegistration}
            onChange={openForRegistration =>
              updateEvent({ ...event, openForRegistration })
            }
          />
        </section>
      </SectionWithValidation>
    </section>
  );
};
