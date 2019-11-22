import { useState } from 'react';
import React from 'react';
import { TimeInput } from 'src/Common/TimeInput/TimeInput';
import { TextInput } from 'src/Common/TextInput/TextInput';
import { TextArea } from 'src/Common/TextArea/TextArea';
import {
  createDescription,
  createTitle,
  createLocation,
  createTime,
} from 'src/types';
import { DateInput } from 'src/Common/DateInput/DateInput';
import { createDate } from 'src/types/date';
import { IEvent, createInitalEvent, IEditEvent } from 'src/types/event';
import style from './CreateEvent.module.scss';
import { Menu } from 'src/Common/Menu/Menu';

export const CreateEvent = () => {
  const [event, setEvent] = useState<IEditEvent>(createInitalEvent());

  return (
    <article className={style.container}>
      <Menu tab={'create'} />
      <h1>Create an event</h1>
      <section className={style.createEvent}>
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
        <button>Create</button>
      </section>
    </article>
  );
};
