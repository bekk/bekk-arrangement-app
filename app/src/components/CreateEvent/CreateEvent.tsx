import React, { useState } from 'react';
import style from './CreateEvent.module.scss';
import { TextInput } from '../../Common/TextInput/TextInput';
import {
  createTitle,
  createDescription,
  IEvent,
  createLocation,
} from '../../types';
import { TextArea } from '../../Common/TextArea/TextArea';
import { DateInput } from '../../Common/DateInput/DateInput';
import { createDate, getYearMonthDay } from '../../utils/date';
import { Menu } from '../../Common/Menu/Menu';

export const CreateEvent = () => {
  const [event, setEvent] = useState<IEvent>({
    title: createTitle(''),
    description: createDescription(''),
    location: createLocation(''),
    startDate: createDate(getYearMonthDay()),
    startTime: { hour: 12, minute: 20 },
    endDate: createDate(getYearMonthDay()),
    endTime: { hour: 12, minute: 20 },
    openForRegistrationDate: createDate(getYearMonthDay()),
    openForRegistrationTime: { hour: 12, minute: 20 },
  });

  return (
    <div className={style.container}>
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
        <label htmlFor="startTime">Start time</label>
        <input type="time" id="startTime" required></input>
        <DateInput
          label={'End date'}
          value={event.endDate}
          onChange={(v: string) =>
            setEvent({ ...event, endDate: createDate(v) })
          }
        />
        <label htmlFor="endTime">end time</label>
        <input type="time" id="endTime" required></input>
        <DateInput
          label={'Registration date'}
          value={event.openForRegistrationDate}
          onChange={(v: string) =>
            setEvent({ ...event, openForRegistrationDate: createDate(v) })
          }
        />
        <label htmlFor="endTime">Open for registration time</label>
        <input type="time" id="endTime" required></input>
        <button>Create</button>
      </section>
    </div>
  );
};
