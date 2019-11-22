import React, { useState } from 'react';
import style from './App.module.scss';
import {
  createTitle,
  createDescription,
  createLocation,
  ITime,
  createTime
} from './types';
import { IEvent, createInitalEvent } from './types/event';
import { createDate, getYearMonthDay } from './types/date';
import { TextInput } from './Common/TextInput/TextInput';
import { TextArea } from './Common/TextArea/TextArea';
import { DateInput } from './Common/DateInput/DateInput';
import { TimeInput } from './Common/TimeInput/TimeInput';

const App = () => {
  const [event, setEvent] = useState<IEvent>(createInitalEvent());

  return (
    <div className={style.App}>
      <h1>Create an event</h1>
      <section className={style.createEvent}>
        <TextInput
          label={'title'}
          placeholder='My event'
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
          placeholder='Stavanger, Norway'
          value={event.location}
          onChange={(v: string) =>
            setEvent({ ...event, title: createLocation(v) })
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
          onChange={(v: string) =>
            setEvent({ ...event, startTime: createTime(v) })
          }
        />
        <label htmlFor='startTime'>Start time</label>
        <input type='time' id='startTime' required></input>
        <DateInput
          label={'End date'}
          value={event.endDate}
          onChange={(v: string) =>
            setEvent({ ...event, endDate: createDate(v) })
          }
        />
        <label htmlFor='endTime'>end time</label>
        <input type='time' id='endTime' required></input>
        <DateInput
          label={'Registration date'}
          value={event.openForRegistrationDate}
          onChange={(v: string) =>
            setEvent({ ...event, openForRegistrationDate: createDate(v) })
          }
        />
        <label htmlFor='endTime'>Open for registration time</label>
        <input type='time' id='endTime' required></input>
        <button>Create</button>
      </section>
    </div>
  );
};

export default App;
