import React from 'react';
import { IEditEvent } from 'src/types/event';
import { DateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  parseQuestion,
} from 'src/types';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { DateTimeInputWithTimezone } from 'src/components/Common/DateTimeInput/DateTimeInputWithTimezone';
import {
  EditDateTime,
  isInOrder,
  parseEditDateTime,
} from 'src/types/date-time';
import { parseEditEmail } from 'src/types/email';
import { isValid } from 'src/types/validation';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => (
  <>
    <ValidatedTextInput
      label={'Tittel'}
      placeholder="Fest på Skuret"
      value={event.title}
      validation={parseTitle}
      onChange={title =>
        updateEvent({
          ...event,
          title,
        })
      }
    />

    <div>
      <ValidatedTextInput
        label="Navn på arrangør"
        placeholder="Ola Nordmann"
        value={event.organizerName}
        validation={parseHost}
        onChange={organizerName =>
          updateEvent({
            ...event,
            organizerName,
          })
        }
      />
    </div>

    <div>
      <ValidatedTextInput
        label="E-post arrangør"
        placeholder="ola.nordmann@bekk.no"
        value={event.organizerEmail}
        validation={parseEditEmail}
        onChange={organizerEmail =>
          updateEvent({
            ...event,
            organizerEmail,
          })
        }
      />
    </div>

    <ValidatedTextInput
      label={'Lokasjon'}
      placeholder="Vippetangen"
      value={event.location}
      validation={parseLocation}
      onChange={location =>
        updateEvent({
          ...event,
          location,
        })
      }
    />

    <ValidatedTextInput
      label={'Beskrivelse'}
      placeholder={'Dette er en beskrivelse'}
      value={event.description}
      validation={parseDescription}
      onChange={description =>
        updateEvent({
          ...event,
          description,
        })
      }
    />

    <DateTimeInput
      label={'Starter'}
      value={event.start}
      onChange={start =>
        updateEvent({
          ...event,
          ...setStartEndDates(event, ['set-start', start]),
        })
      }
    />

    <DateTimeInput
      label={'Slutter'}
      value={event.end}
      onChange={end =>
        updateEvent({
          ...event,
          ...setStartEndDates(event, ['set-end', end]),
        })
      }
    />

    <DateTimeInputWithTimezone
      label={'Påmelding åpner'}
      value={event.openForRegistrationTime}
      onChange={openForRegistrationTime =>
        updateEvent({
          ...event,
          openForRegistrationTime,
        })
      }
    />

    <ValidatedTextInput
      label={'Maks antall'}
      placeholder="0 (ingen grense)"
      value={event.maxParticipants}
      validation={parseMaxAttendees}
      onChange={maxParticipants =>
        updateEvent({
          ...event,
          maxParticipants,
        })
      }
    />

    <ValidatedTextInput
      label={'Spørsmål til deltakere'}
      placeholder="Allergier, preferanser eller noe annet på hjertet? Valg mellom matrett A og B?"
      value={event.participantQuestion}
      validation={parseQuestion}
      onChange={participantQuestion =>
        updateEvent({
          ...event,
          participantQuestion,
        })
      }
    />
  </>
);

type Action = ['set-start', EditDateTime] | ['set-end', EditDateTime];

type State = {
  start: EditDateTime;
  end: EditDateTime;
};

const setStartEndDates = (
  { start, end }: State,
  [type, date]: Action
): State => {
  const parsedStart = parseEditDateTime(start);
  const parsedEnd = parseEditDateTime(end);
  const parsedDate = parseEditDateTime(date);
  if (isValid(parsedStart) && isValid(parsedEnd) && isValid(parsedDate)) {
    const first = type === 'set-start' ? parsedDate : parsedStart;
    const last = type === 'set-end' ? parsedDate : parsedEnd;

    if (!isInOrder({ first, last })) {
      return { start: date, end: date };
    }
  }

  switch (type) {
    case 'set-start':
      return { start: date, end };
    case 'set-end':
      return { start, end: date };
  }
};
