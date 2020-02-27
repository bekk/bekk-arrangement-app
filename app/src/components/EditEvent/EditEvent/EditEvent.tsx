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
import { parseEmail } from 'src/types/email';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { DateTimeInputWithTimezone } from 'src/components/Common/DateTimeInput/DateTimeInputWithTimezone';
import { IDateTime, EditDateTime, isInOrder } from 'src/types/date-time';
import { Result, isOk } from 'src/types/validation';
import { ValidatedTextArea } from 'src/components/Common/ValidatedTextArea/ValidatedTextArea';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
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

      <ValidatedTextArea
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
        value={event.openForRegistration}
        onChange={openForRegistration =>
          updateEvent({
            ...event,
            openForRegistration,
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

      <ValidatedTextInput
        label={'Spørsmål til deltakere'}
        placeholder="Allergier, preferanser eller noe annet på hjertet? Valg mellom matrett A og B?"
        value={event.participantQuestion}
        onChange={question =>
          updateEvent({
            ...event,
            participantQuestion: parseQuestion(question),
          })
        }
      />
    </>
  );
};

type Action =
  | ['set-start', Result<EditDateTime, IDateTime>]
  | ['set-end', Result<EditDateTime, IDateTime>];

type State = {
  start: Result<EditDateTime, IDateTime>;
  end: Result<EditDateTime, IDateTime>;
};

const setStartEndDates = (
  { start, end }: State,
  [type, date]: Action
): State => {
  if (isOk(start) && isOk(end) && isOk(date)) {
    const first = type === 'set-start' ? date : start;
    const last = type === 'set-end' ? date : end;

    if (!isInOrder({ first: first.validValue, last: last.validValue })) {
      return { start: date, end: date };
    }

    return { start: first, end: last };
  } else {
    switch (type) {
      case 'set-start':
        return { end, start: date };
      case 'set-end':
        return { start, end: date };
    }
  }
};
