import { useState } from 'react';
import React from 'react';
import { TimeInput } from 'src/components/Common/TimeInput/TimeInput';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { createDescription, createLocation } from 'src/types';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import { createDate } from 'src/types/date';
import { createInitalEvent, IEditEvent, IEvent } from 'src/types/event';
import style from './EditEvent.module.scss';
import { createTitle, createTime } from 'src/types/time';
import { SectionWithValidation } from 'src/components/Common/SectionWithValidation/SectionWithValidation';
import { fromEditModel, toEditModel, Edit } from 'src/types/validation';

interface Props {
  event: Edit<IEvent>;
  onChange: (write: IEvent) => Promise<void>;
}

export const EditEvent = ({ event: editEvent, onChange }: Props) => {
  const [event, setEvent] = useState<Edit<IEvent>>(editEvent);

  const saveEvent = async () => {
    const eventModel = fromEditModel(event);
    if (eventModel) {
      await onChange(eventModel);
      setEvent(createInitalEvent());
    }
  };

  return (
    <article className={style.container}>
      <section className={style.column}>
        <TextInput
          label={'title'}
          placeholder="My event"
          value={event.title}
          onChange={(v: string) =>
            setEvent({ ...event, title: createTitle(v) })
          }
        />
        <TextArea
          label={'description'}
          placeholder={'description of my event'}
          value={event.description}
          onChange={(v: string) =>
            setEvent({ ...event, description: createDescription(v) })
          }
        />
        <TextInput
          label={'location'}
          placeholder="Stavanger, Norway"
          value={event.location}
          onChange={(v: string) =>
            setEvent({ ...event, location: createLocation(v) })
          }
        />
        <SectionWithValidation
          validationResult={[
            ...(event.startDate.errors || []),
            ...(event.startTime.errors || []),
          ]}
        >
          <section className={style.row}>
            <DateInput
              label={'Start date'}
              value={event.startDate}
              onChange={(v: string) =>
                setEvent({ ...event, startDate: createDate(v) })
              }
            />
            <TimeInput
              label={'start time'}
              value={event.startTime}
              onChange={v => setEvent({ ...event, startTime: createTime(v) })}
            />
          </section>
        </SectionWithValidation>
        <DateInput
          label={'End date'}
          value={event.endDate}
          onChange={(v: string) =>
            setEvent({ ...event, endDate: createDate(v) })
          }
        />
        <TimeInput
          label={'end time'}
          value={event.endTime}
          onChange={v => setEvent({ ...event, endTime: createTime(v) })}
        />
        <DateInput
          label={'Registration date'}
          value={event.openForRegistrationDate}
          onChange={(v: string) =>
            setEvent({ ...event, openForRegistrationDate: createDate(v) })
          }
        />
        <TimeInput
          label={'Open for registration time'}
          value={event.endTime}
          onChange={v =>
            setEvent({ ...event, openForRegistrationTime: createTime(v) })
          }
        />
        <button onClick={saveEvent}>Create</button>
      </section>
    </article>
  );
};
