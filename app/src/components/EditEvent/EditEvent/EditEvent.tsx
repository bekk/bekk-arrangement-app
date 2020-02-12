import React from 'react';
import { IEditEvent } from 'src/types/event';
import { DateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
} from 'src/types';
import { parseEmail } from 'src/types/email';
import { parseTimeInstance } from 'src/types/time-instance';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { IDateTime, EditDateTime, isInOrder } from 'src/types/date-time';
import { Result, isOk, isBad } from 'src/types/validation';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
  type Message =
    | ['set-start', Result<EditDateTime, IDateTime>]
    | ['set-end', Result<EditDateTime, IDateTime>];

  const updateDate = ([action, date]: Message): void => {
    if (isOk(date)) {
      switch (action) {
        case 'set-start': {
          const start = date;
          const end =
            isBad(event.end) ||
            (isOk(event.end) &&
              !isInOrder({
                first: start.validValue,
                last: event.end.validValue,
              }))
              ? start
              : event.end;
          return updateEvent({ ...event, start, end });
        }
        case 'set-end': {
          const end = date;
          const start =
            isBad(event.start) ||
            (isOk(event.start) &&
              !isInOrder({
                first: event.start.validValue,
                last: end.validValue,
              }))
              ? end
              : event.start;
          return updateEvent({ ...event, start, end });
        }
      }
    } else {
      switch (action) {
        case 'set-start':
          return updateEvent({ ...event, start: date });
        case 'set-end':
          return updateEvent({ ...event, end: date });
      }
    }
  };

  return (
    <>
      <ValidatedTextInput
        label={'Tittel'}
        placeholder="Fest på Skuret"
        value={event.title}
        onChange={title =>
          updateEvent({
            ...event,
            title: parseTitle(title),
          })
        }
      />
      <div>
        <ValidatedTextInput
          label="Navn på arrangør"
          placeholder="Ola Nordmann"
          value={event.organizerName}
          onChange={organizerName =>
            updateEvent({
              ...event,
              organizerName: parseHost(organizerName),
            })
          }
        />
      </div>
      <div>
        <ValidatedTextInput
          label="E-post arrangør"
          placeholder="ola.nordmann@bekk.no"
          value={event.organizerEmail}
          onChange={organizerEmail =>
            updateEvent({
              ...event,
              organizerEmail: parseEmail(organizerEmail),
            })
          }
        />
      </div>
      <ValidatedTextInput
        label={'Lokasjon'}
        placeholder="Vippetangen"
        value={event.location}
        onChange={location =>
          updateEvent({
            ...event,
            location: parseLocation(location),
          })
        }
      />
      <ValidatedTextInput
        label={'Beskrivelse'}
        placeholder={'Dette er en beskrivelse'}
        value={event.description}
        onChange={description =>
          updateEvent({
            ...event,
            description: parseDescription(description),
          })
        }
      />
      <DateTimeInput
        label={'Starter'}
        value={event.start}
        onChange={start => updateDate(['set-start', start])}
      />
      <DateTimeInput
        label={'Slutter'}
        value={event.end}
        onChange={end => updateDate(['set-end', end])}
      />
      <ValidatedTextInput
        label={'Påmelding åpner'}
        value={event.openForRegistration}
        onChange={openForRegistration =>
          updateEvent({
            ...event,
            openForRegistration: parseTimeInstance(openForRegistration),
          })
        }
      />
      <ValidatedTextInput
        label={'Maks antall'}
        placeholder="0 (ingen grense)"
        value={event.maxParticipants}
        onChange={maxParticipants =>
          updateEvent({
            ...event,
            maxParticipants: parseMaxAttendees(maxParticipants),
          })
        }
      />
    </>
  );
};
