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
import style from '../EditEventContainer.module.scss';
import dateTimeStyle from 'src/components/Common/DateTimeInput/DateTimeInput.module.scss';
import { TimeInput } from 'src/components/Common/TimeInput/TimeInput';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
  const [hasLimitedSpots, setHasLimitedSpots] = useState(false);
  const [isMultiDayEvent, setMultiDay] = useState(false);
  const validatedStarTime = parseEditDateTime(event.start);
  const validateEndTime = parseEditDateTime(event.end);
  return (
    <>
      <ValidatedTextInput
        label={'Tittel'}
        placeholder="Fest på Skuret"
        value={event.title}
        validation={parseTitle}
        onChange={(title) =>
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
          onChange={(organizerName) =>
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
          onChange={(organizerEmail) =>
            updateEvent({
              ...event,
              organizerEmail,
            })
          }
        />
      </div>
      <ValidatedTextInput
        label={'Hvor finner arrangementet sted?'}
        placeholder="Vippetangen"
        value={event.location}
        validation={parseLocation}
        onChange={(location) =>
          updateEvent({
            ...event,
            location,
          })
        }
      />
      <ValidatedTextArea
        label={'Beskrivelse'}
        placeholder={'Dette er en beskrivelse'}
        value={event.description}
        validation={parseDescription}
        onChange={(description) =>
          updateEvent({
            ...event,
            description,
          })
        }
      />
      <label className={dateTimeStyle.label}>
        Når finner arrangementet sted?
      </label>
      {!isMultiDayEvent ? (
        <>
          <div className={dateTimeStyle.flex}>
            <div>
              <DateInput
                value={event.start.date}
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
            <div className={dateTimeStyle.timeFlex}>
              <div className={dateTimeStyle.kl}>Fra kl.</div>
              <TimeInput
                value={event.start.time}
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
            <div className={dateTimeStyle.timeFlex}>
              <div className={dateTimeStyle.kl}>Til kl.</div>
              <TimeInput
                value={event.end.time}
                onChange={(time) =>
                  updateEvent({
                    ...event,
                    ...setStartEndDates(event, [
                      'set-end',
                      { ...event.end, time },
                    ]),
                  })
                }
              />
            </div>
          </div>
          {!isValid(validatedStarTime) && (
            <ValidationResult validationResult={validatedStarTime} />
          )}
          {!isValid(validateEndTime) && (
            <ValidationResult validationResult={validateEndTime} />
          )}
          <Checkbox
            onDarkBackground
            label="Arrangementet går over flere dager"
            isChecked={isMultiDayEvent}
            onChange={setMultiDay}
          />
        </>
      ) : (
        <>
          <div className={dateTimeStyle.flex}>
            <DateInput
              value={event.start.date}
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
            <div className={dateTimeStyle.timeFlex}>
              <div className={dateTimeStyle.kl}>Fra kl.</div>
              <TimeInput
                value={event.start.time}
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
          </div>
          {!isValid(validatedStarTime) && (
            <ValidationResult validationResult={validatedStarTime} />
          )}
          <Checkbox
            onDarkBackground
            label="Arrangementet går over flere dager"
            isChecked={isMultiDayEvent}
            onChange={(isMulti) => {
              if (!isMulti) {
                updateEvent({
                  ...event,
                  ...setStartEndDates(event, [
                    'set-end',
                    { ...event.end, date: event.start.date },
                  ]),
                });
              }
              setMultiDay(isMulti);
            }}
          />
          <label className={dateTimeStyle.label}>Arrangementet varer til</label>
          <div className={dateTimeStyle.flex}>
            <DateInput
              value={event.end.date}
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
            <div className={dateTimeStyle.timeFlex}>
              <div className={dateTimeStyle.kl}>Til kl.</div>
              <TimeInput
                value={event.end.time}
                onChange={(time) =>
                  updateEvent({
                    ...event,
                    ...setStartEndDates(event, [
                      'set-end',
                      { ...event.end, time },
                    ]),
                  })
                }
              />
            </div>
          </div>
          {!isValid(validateEndTime) && (
            <ValidationResult validationResult={validateEndTime} />
          )}
        </>
      )}
      <DateTimeInputWithTimezone
        label={'Påmelding åpner'}
        value={event.openForRegistrationTime}
        onChange={(openForRegistrationTime) =>
          updateEvent({
            ...event,
            openForRegistrationTime,
          })
        }
      />
      <Checkbox
        label="Begrens plasser"
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
        onDarkBackground={true}
      />
      {hasLimitedSpots && (
        <div className={style.flex}>
          <div>
            <ValidatedTextInput
              label={'Maks antall'}
              placeholder="∞"
              value={event.maxParticipants}
              isNumber={true}
              validation={parseMaxAttendees}
              onChange={(maxParticipants) =>
                updateEvent({
                  ...event,
                  maxParticipants,
                })
              }
            />
          </div>
          <div>
            <Checkbox
              label="Venteliste"
              onChange={(hasWaitingList) =>
                updateEvent({ ...event, hasWaitingList })
              }
              isChecked={event.hasWaitingList}
              onDarkBackground={true}
            />
          </div>
        </div>
      )}
      {event.participantQuestion !== undefined ? (
        <ValidatedTextInput
          label={'Spørsmål til deltakere'}
          placeholder="Allergier, preferanser eller noe annet på hjertet? Valg mellom matrett A og B?"
          value={event.participantQuestion}
          validation={parseQuestion}
          onChange={(participantQuestion) =>
            updateEvent({
              ...event,
              participantQuestion,
            })
          }
        />
      ) : (
        <Button
          onClick={() =>
            updateEvent({
              ...event,
              participantQuestion: '',
            })
          }
        >
          + Legg til spørsmål til deltaker
        </Button>
      )}
    </>
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
