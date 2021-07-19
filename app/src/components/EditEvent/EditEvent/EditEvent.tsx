import React, { useState } from 'react';
import { IEditEvent } from 'src/types/event';
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
import { parseEditEmail } from 'src/types/email';
import {
  EditDateTime,
  parseEditDateTime,
  isInOrder,
} from 'src/types/date-time';
import { isValid } from 'src/types/validation';
import { ValidatedTextArea } from 'src/components/Common/ValidatedTextArea/ValidatedTextArea';
import { Checkbox } from '@bekk/storybook';
import { Button } from 'src/components/Common/Button/Button';
import style from './EditEvent.module.scss';
import dateTimeStyle from 'src/components/Common/DateTimeInput/DateTimeInput.module.scss';
import { TimeInput } from 'src/components/Common/TimeInput/TimeInput';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
  const [hasLimitedSpots, setHasLimitedSpots] = useState(
    event.maxParticipants !== '0' && event.maxParticipants !== ''
  );
  const [isMultiDayEvent, setMultiDay] = useState(false);
  const validatedStarTime = parseEditDateTime(event.start);
  const validateEndTime = parseEditDateTime(event.end);
  return (
    <div className={style.container}>
      <div className={style.title}>
        <ValidatedTextInput
          label={'Tittel'}
          placeholder="Navn på arrangementet ditt"
          value={event.title}
          validation={parseTitle}
          onLightBackground
          onChange={(title) =>
            updateEvent({
              ...event,
              title,
            })
          }
        />
      </div>
      <div className={style.organizerName}>
        <ValidatedTextInput
          label="Navn på arrangør"
          placeholder="Kari Nordmann"
          value={event.organizerName}
          validation={parseHost}
          onLightBackground
          onChange={(organizerName) =>
            updateEvent({
              ...event,
              organizerName,
            })
          }
        />
      </div>
      <div className={style.organizerEmail}>
        <ValidatedTextInput
          label="Arrangørens e-post"
          placeholder="kari.nordmann@bekk.no"
          value={event.organizerEmail}
          validation={parseEditEmail}
          onLightBackground
          onChange={(organizerEmail) =>
            updateEvent({
              ...event,
              organizerEmail,
            })
          }
        />
      </div>
      <div className={style.location}>
        <ValidatedTextInput
          label={'Lokasjon'}
          placeholder="Eventyrland"
          value={event.location}
          validation={parseLocation}
          onLightBackground
          onChange={(location) =>
            updateEvent({
              ...event,
              location,
            })
          }
        />
      </div>
      <div className={style.description}>
        <ValidatedTextArea
          label={'Beskrivelse'}
          placeholder={'Hva står på agendaen?'}
          value={event.description}
          validation={parseDescription}
          onLightBackground
          minRow={10}
          onChange={(description) =>
            updateEvent({
              ...event,
              description,
            })
          }
        />
      </div>
      <div
        className={
          isMultiDayEvent
            ? style.startEndDateContainer
            : style.startDateContainer
        }
      >
        <div className={style.startDate}>
          <DateInput
            value={event.start.date}
            label={isMultiDayEvent ? 'Startdato:' : 'Når:'}
            onChange={(date) =>
              updateEvent({
                ...event,
                ...setStartEndDates(event, [
                  'set-start',
                  { ...event.start, date },
                ]),
              })
            }
          />
        </div>
        <div className={style.startTime}>
          <TimeInput
            value={event.start.time}
            label={isMultiDayEvent ? 'Kl:' : 'Fra'}
            onChange={(time) =>
              updateEvent({
                ...event,
                ...setStartEndDates(event, [
                  'set-start',
                  { ...event.start, time },
                ]),
              })
            }
          />
        </div>
        <div className={style.endTime}>
          <TimeInput
            value={event.end.time}
            label={isMultiDayEvent ? 'Kl:' : 'Til'}
            onChange={(time) =>
              updateEvent({
                ...event,
                ...setStartEndDates(event, ['set-end', { ...event.end, time }]),
              })
            }
          />
        </div>
        {!isValid(validatedStarTime) && (
          <ValidationResult validationResult={validatedStarTime} />
        )}
        {!isValid(validateEndTime) && (
          <ValidationResult validationResult={validateEndTime} />
        )}
        {isMultiDayEvent && (
          <div className={style.endDate}>
            <DateInput
              value={event.end.date}
              label={'Sluttdato:'}
              onChange={(date) =>
                updateEvent({
                  ...event,
                  ...setStartEndDates(event, [
                    'set-end',
                    { ...event.end, date },
                  ]),
                })
              }
            />
            {!isValid(validateEndTime) && (
              <ValidationResult validationResult={validateEndTime} />
            )}
          </div>
        )}
      </div>
      <div className={style.endDateCheckBox}>
        <Checkbox
          label="Arrangementet går over flere dager"
          isChecked={isMultiDayEvent}
          onChange={setMultiDay}
        />
      </div>
      <DateTimeInputWithTimezone
        labelDate={'Påmelding åpner: '}
        labelTime={'Kl: '}
        className={style.openForRegistrationTime}
        value={event.openForRegistrationTime}
        onChange={(openForRegistrationTime) =>
          updateEvent({
            ...event,
            openForRegistrationTime,
          })
        }
      />
      <div className={style.limitSpotsContainer}>
        <Checkbox
          label="Begrens antall plasser"
          isChecked={hasLimitedSpots}
          onChange={(limited) => {
            if (limited) {
              updateEvent({
                ...event,
                maxParticipants: '',
                hasWaitingList: false,
              });
            }
            setHasLimitedSpots(limited);
          }}
        />
      </div>
      {hasLimitedSpots && (
        <div className={style.limitSpots}>
          <div>
            <ValidatedTextInput
              label={'Maks antall'}
              placeholder="10"
              value={event.maxParticipants}
              isNumber={true}
              validation={parseMaxAttendees}
              onLightBackground
              onChange={(maxParticipants) =>
                updateEvent({
                  ...event,
                  maxParticipants,
                })
              }
            />
          </div>
          <div className={style.waitListCB}>
            <Checkbox
              label="Venteliste"
              onChange={(hasWaitingList) =>
                updateEvent({ ...event, hasWaitingList })
              }
              isChecked={event.hasWaitingList}
            />
          </div>
        </div>
      )}
      <div className={style.externalEvent}>
        <Checkbox
          label="Eksternt arrangement"
          onChange={(isExternal) => updateEvent({ ...event, isExternal })}
          isChecked={event.isExternal}
        />
        <p className={style.text}>
          Eksterne arrangement er tilgjengelig for personer utenfor Bekk.
        </p>
      </div>
      {event.participantQuestion !== undefined ? (
        <div
          className={hasLimitedSpots ? style.questionOpen2 : style.questionOpen}
        >
          <ValidatedTextArea
            label={'Spørsmål til deltakere'}
            placeholder="Allergier, preferanser eller noe annet på hjertet? Valg mellom matrett A og B?"
            value={event.participantQuestion}
            validation={parseQuestion}
            onLightBackground
            minRow={4}
            onChange={(participantQuestion) =>
              updateEvent({
                ...event,
                participantQuestion,
              })
            }
          />
          <Button
            className={style.removeQButton}
            color="Secondary"
            onClick={() =>
              updateEvent({ ...event, participantQuestion: undefined })
            }
          >
            Fjern spørsmål til deltakere
          </Button>
        </div>
      ) : (
        <Button
          color="Secondary"
          className={
            hasLimitedSpots ? style.questionClosed2 : style.questionClosed
          }
          onClick={() =>
            updateEvent({
              ...event,
              participantQuestion: '',
            })
          }
        >
          Legg til spørsmål til deltaker
        </Button>
      )}
    </div>
  );
};

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
