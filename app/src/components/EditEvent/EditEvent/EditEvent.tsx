import React from 'react';
import { TextInput } from 'src/components/Common/TextInput/TextInput';
import { TextArea } from 'src/components/Common/TextArea/TextArea';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import { IEditEvent } from 'src/types/event';
import style from './EditEvent.module.scss';
import { DateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import {
  validateTitle,
  validateDescription,
  validateHost,
  validateMaxAttendees,
} from 'src/types';
import { validateDateTime } from 'src/types/date-time';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult, updateEvent }: IProps) => {
  const event = eventResult;
  return (
    <>
      <TextInput
        label={'Tittel'}
        placeholder=""
        value={event.title.editValue}
        onChange={title =>
          updateEvent({
            ...event,
            title: validateTitle(title),
          })
        }
      />
      <ValidationResult validationResult={event.title.errors} />
      <div className={style.organizerContainer}>
        <div>
          <TextInput
            label="Navn på arrangør"
            placeholder=""
            value={event.organizerName.editValue}
            onChange={organizerName =>
              updateEvent({
                ...event,
                organizerName: validateHost(organizerName),
              })
            }
          />
          <ValidationResult validationResult={event.organizerName.errors} />
        </div>
        <div>
          <TextInput
            label="Epost arrangør"
            placeholder=""
            value={event.organizerEmail.editValue}
            onChange={organizerEmail =>
              updateEvent({
                ...event,
                organizerEmail: validateHost(organizerEmail),
              })
            }
          />
          <ValidationResult validationResult={event.organizerEmail.errors} />
        </div>
      </div>
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
      <DateTimeInput
        label={'Slutter'}
        value={event.end.editValue}
        onChange={end =>
          updateEvent({
            ...event,
            end: validateDateTime(end),
          })
        }
      />
      <DateTimeInput
        label={'Påmelding åpner'}
        value={event.openForRegistration.editValue}
        onChange={openForRegistration =>
          updateEvent({
            ...event,
            openForRegistration: validateDateTime(openForRegistration),
          })
        }
      />
      <TextInput
        label={'Maks antall'}
        placeholder=""
        value={event.maxParticipants.editValue}
        onChange={maxParticipants =>
          updateEvent({
            ...event,
            maxParticipants: validateMaxAttendees(maxParticipants),
          })
        }
      />
      <ValidationResult validationResult={event.maxParticipants.errors} />
    </>
  );
};
