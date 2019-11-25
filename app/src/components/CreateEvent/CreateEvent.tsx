import { useState } from 'react';
import React from 'react';
import { TimeInput } from 'src/Common/TimeInput/TimeInput';
import { TextInput } from 'src/Common/TextInput/TextInput';
import { TextArea } from 'src/Common/TextArea/TextArea';
import { createDescription, createLocation } from 'src/types';
import { DateInput } from 'src/Common/DateInput/DateInput';
import { createDate } from 'src/types/date';
import { createInitalEvent, IEditEvent, IEvent } from 'src/types/event';
import style from './CreateEvent.module.scss';
import { Menu } from 'src/Common/Menu/Menu';
import { createTitle, createTime } from 'src/types/time';
import { SectionWithValidation } from 'src/Common/SectionWithValidation/SectionWithValidation';
import { fromEditModel, toEditModel } from 'src/types/validation';

interface Props {
  createOrUpdate: (write: IEvent) => void;
  event: IEvent;
}

export const CreateEvent = ({ createOrUpdate, event: editEvent }: Props) => {
  const [event, setEvent] = useState<IEditEvent>(toEditModel(editEvent));

  const createEvent = async () => {
    const eventModel = fromEditModel(event);
    if (eventModel) {
      await createOrUpdate(eventModel);
      setEvent(toEditModel(createInitalEvent()));
    }
  };

  return (
    <article className={style.container}>
      <Menu tab={'create'} />
      <h1>Create an event</h1>
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
            ...(event.startDate.validationResult || []),
            ...(event.startTime.validationResult || []),
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
              onChange={(v: [string, string]) =>
                setEvent({ ...event, startTime: createTime(v) })
              }
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
          onChange={(v: [string, string]) =>
            setEvent({ ...event, endTime: createTime(v) })
          }
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
          onChange={(v: [string, string]) =>
            setEvent({ ...event, openForRegistrationTime: createTime(v) })
          }
        />
        <button onClick={createEvent}>Create</button>
      </section>
    </article>
  );
};
