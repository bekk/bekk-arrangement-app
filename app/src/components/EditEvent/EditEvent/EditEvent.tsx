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
  validateLocation,
} from 'src/types';
import { validateDateTime } from 'src/types/date-time';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
  showError: boolean;
}

export const EditEvent = ({
  eventResult: event,
  updateEvent,
  showError,
}: IProps) => {
  return (
    <>
      <TextInput
        label={'Tittel'}
        placeholder="Fest på Skuret"
        value={event.title.editValue}
        onChange={title =>
          updateEvent({
            ...event,
            title: validateTitle(title),
          })
        }
      />
      {showError && <ValidationResult validationResult={event.title.errors} />}
      <div className={style.organizerContainer}>
        <div>
          <TextInput
            label="Navn på arrangør"
            placeholder="Ola Nordmann"
            value={event.organizerName.editValue}
            onChange={organizerName =>
              updateEvent({
                ...event,
                organizerName: validateHost(organizerName),
              })
            }
          />
          {showError && (
            <ValidationResult validationResult={event.organizerName.errors} />
          )}
        </div>
        <div>
          <TextInput
            label="E-post arrangør"
            placeholder="ola.nordmann@bekk.no"
            value={event.organizerEmail.editValue}
            onChange={organizerEmail =>
              updateEvent({
                ...event,
                organizerEmail: validateHost(organizerEmail),
              })
            }
          />
          {showError && (
            <ValidationResult validationResult={event.organizerEmail.errors} />
          )}
        </div>
      </div>
      <TextInput
        label={'Lokasjon'}
        placeholder="Vippetangen"
        value={event.location.editValue}
        onChange={location =>
          updateEvent({
            ...event,
            location: validateLocation(location),
          })
        }
      />
      {showError && (
        <ValidationResult validationResult={event.location.errors} />
      )}
      <TextArea
        label={'Beskrivelse'}
        placeholder={'Dette er en beskrivelse'}
        value={event.description.editValue}
        onChange={description =>
          updateEvent({
            ...event,
            description: validateDescription(description),
          })
        }
      />
      {showError && (
        <ValidationResult validationResult={event.description.errors} />
      )}
      <DateTimeInput
        label={'Starter'}
        value={event.start.editValue}
        error={event.start.errors}
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
        error={event.end.errors}
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
        error={event.openForRegistration.errors}
        onChange={openForRegistration =>
          updateEvent({
            ...event,
            openForRegistration: validateDateTime(openForRegistration),
          })
        }
      />
      <TextInput
        label={'Maks antall'}
        placeholder="0 (ingen grense)"
        value={event.maxParticipants.editValue}
        onChange={maxParticipants =>
          updateEvent({
            ...event,
            maxParticipants: validateMaxAttendees(maxParticipants),
          })
        }
      />
      {showError && (
        <ValidationResult validationResult={event.maxParticipants.errors} />
      )}
    </>
  );
};
