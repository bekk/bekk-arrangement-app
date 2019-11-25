import { useState } from 'react';
import React from 'react';
import { TimeInput } from 'src/Common/TimeInput/TimeInput';
import { TextInput } from 'src/Common/TextInput/TextInput';
import { TextArea } from 'src/Common/TextArea/TextArea';
import { createDescription, createLocation } from 'src/types';
import { DateInput } from 'src/Common/DateInput/DateInput';
import { createDate } from 'src/types/date';
import {
  createInitalEvent,
  IEditEvent,
  IWriteModel,
  toWriteModel,
} from 'src/types/event';
import style from './CreateEvent.module.scss';
import commonStyle from 'src/global/Common.module.scss';

import { Menu } from 'src/Common/Menu/Menu';
import { createTitle, createTime } from 'src/types/time';
import { SectionWithValidation } from 'src/Common/SectionWithValidation/SectionWithValidation';
import { fromEditModel } from 'src/types/validation';

interface Props {
  create: (write: IWriteModel) => void;
}

export const CreateEvent = ({ create }: Props) => {
  const [event, setEvent] = useState<IEditEvent>(createInitalEvent());

  const createEvent = async () => {
    const eventModel = fromEditModel(event);
    if (eventModel) {
      await create(toWriteModel(eventModel));
      setEvent(createInitalEvent());
    }
  };

  return (
    <article className={commonStyle.container}>
      <div className={commonStyle.content}>
        <Menu tab={'create'} />
        <section className={style.form}>
          <h1>Create an event</h1>
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
            <section className={style.dateTime}>
              <DateInput
                label={'Start date'}
                value={event.startDate}
                onChange={(v: string) =>
                  setEvent({ ...event, startDate: createDate(v) })
                }
              />
              <TimeInput
                label={'Start time'}
                value={event.startTime}
                onChange={(v: [string, string]) =>
                  setEvent({ ...event, startTime: createTime(v) })
                }
              />
            </section>
          </SectionWithValidation>
          <SectionWithValidation
            validationResult={[
              ...(event.endTime.validationResult || []),
              ...(event.endTime.validationResult || []),
            ]}
          >
            <section className={style.dateTime}>
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
            </section>
          </SectionWithValidation>
          <SectionWithValidation
            validationResult={[
              ...(event.openForRegistrationDate.validationResult || []),
              ...(event.openForRegistrationTime.validationResult || []),
            ]}
          >
            <section className={style.dateTime}>
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
            </section>
          </SectionWithValidation>
          <button onClick={createEvent}>Create</button>
        </section>
      </div>
    </article>
  );
};
