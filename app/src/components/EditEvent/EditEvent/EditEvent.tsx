import React, { useState } from 'react';
import { IEditEvent } from 'src/types/event';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
  parseQuestion,
  parseShortname,
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
import { TimeInput } from 'src/components/Common/TimeInput/TimeInput';
import { DateInput } from 'src/components/Common/DateInput/DateInput';
import { ValidationResult } from 'src/components/Common/ValidationResult/ValidationResult';
import { useIsCreateRoute } from 'src/routing';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
  const [isMultiDayEvent, setMultiDay] = useState(
    event.start.date !== event.end.date
  );

  const [hasShortname, _setHasShortname] = useState(false);
  const setHasShortname = (hasShortname: boolean) => {
    _setHasShortname(hasShortname);
    if (!hasShortname) {
      updateEvent({ ...event, shortname: undefined });
    }
  };

  const [hasLimitedSpots, setHasLimitedSpots] = useState(
    event.maxParticipants !== '0' && event.maxParticipants !== ''
  );

  const validatedStarTime = parseEditDateTime(event.start);
  const validateEndTime = parseEditDateTime(event.end);

  const isCreateView = useIsCreateRoute();

  return (
    <div className={style.container}>
      <div className={style.column}>
        <div className={style.title}>
          <ValidatedTextInput
            label={labels.title}
            placeholder={placeholders.title}
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
        <div className={style.location}>
          <ValidatedTextInput
            label={labels.location}
            placeholder={placeholders.location}
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
              label={labels.startDate}
              onChange={(date) =>
                updateEvent({
                  ...event,
                  ...setStartEndDates(event, [
                    'set-same-date',
                    { ...event.start, date },
                  ]),
                })
              }
            />
          </div>
          <div className={style.startTime}>
            <TimeInput
              value={event.start.time}
              label={
                isMultiDayEvent ? labels.timeWithEndDate : labels.startTime
              }
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
              label={
                isMultiDayEvent ? labels.timeWithEndDate : labels.startTime
              }
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
          {!isValid(validatedStarTime) && (
            <ValidationResult
              onLightBackground
              validationResult={validatedStarTime}
            />
          )}
          {!isValid(validateEndTime) && (
            <ValidationResult
              onLightBackground
              validationResult={validateEndTime}
            />
          )}
          {isMultiDayEvent && (
            <div className={style.endDate}>
              <DateInput
                value={event.end.date}
                label={labels.endDate}
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
                <ValidationResult
                  onLightBackground
                  validationResult={validateEndTime}
                />
              )}
            </div>
          )}
        </div>
        <div className={style.endDateCheckBox}>
          <Checkbox
            label={buttonText.addEndDate}
            isChecked={isMultiDayEvent}
            onChange={setMultiDay}
          />
        </div>
        <div className={style.description}>
          <ValidatedTextArea
            label={labels.description}
            placeholder={placeholders.description}
            value={event.description}
            validation={parseDescription}
            onLightBackground
            minRow={8}
            onChange={(description) =>
              updateEvent({
                ...event,
                description,
              })
            }
          />
        </div>
      </div>
      <div className={style.column}>
        <div className={style.organizerName}>
          <ValidatedTextInput
            label={labels.organizerName}
            placeholder={placeholders.organizerEmail}
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
            label={labels.organizerEmail}
            placeholder={placeholders.organizerEmail}
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
        <DateTimeInputWithTimezone
          labelDate={labels.registrationStartDate}
          labelTime={labels.registrationTime}
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
            label={labels.unlimitedSpots}
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
                label={labels.limitSpots}
                placeholder={placeholders.limitSpots}
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
                label={labels.waitingList}
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
            label={labels.externalEvent}
            onChange={(isExternal) => updateEvent({ ...event, isExternal })}
            isChecked={event.isExternal}
          />
          <p className={style.text}>{helpText.externalEvent}</p>
        </div>
        {isCreateView && (
          <div className={style.shortName}>
            <Checkbox
              label={labels.shortname}
              isChecked={hasShortname}
              onChange={setHasShortname}
            />
            {hasShortname && (
              <div className={style.flex}>
                <div className={style.origin}>{document.location.origin}/</div>
                <div>
                  <ValidatedTextInput
                    label={''}
                    value={event.shortname || ''}
                    onChange={(shortname) =>
                      updateEvent({ ...event, shortname })
                    }
                    validation={parseShortname}
                    onLightBackground
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {event.participantQuestion !== undefined ? (
          <div
            className={
              hasLimitedSpots ? style.questionOpen2 : style.questionOpen
            }
          >
            <ValidatedTextArea
              label={labels.participantQuestion}
              placeholder={placeholders.participantQuestion}
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
    </div>
  );
};

type Action =
  | ['set-same-date', EditDateTime]
  | ['set-start', EditDateTime]
  | ['set-end', EditDateTime];

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
    case 'set-same-date':
      return { start: date, end: date };
    case 'set-start':
      return { start: date, end };
    case 'set-end':
      return { start, end: date };
  }
};

const labels = {
  title: 'Tittel*',
  startDate: 'Arrangementet starter*',
  startTime: 'Fra*',
  endTime: 'Til*',
  endDate: 'Arrangementet slutter*',
  timeWithEndDate: 'Kl*',
  location: 'Lokasjon*',
  description: 'Beskrivelse*',
  organizerName: 'Navn på arrangør*',
  organizerEmail: 'Arrangørens e-post*',
  registrationStartDate: 'Påmelding åpner*',
  registrationTime: 'Kl*',
  unlimitedSpots: 'Ubegrenset antall deltakere',
  limitSpots: 'Maks antall*',
  waitingList: 'Venteliste',
  externalEvent: 'Eksternt arrangement',
  participantQuestion: 'Spørsmål til deltakerne*',
  shortname: 'Lag en penere URL for arrangementet',
};

const placeholders = {
  title: 'Navn på arrangementet ditt',
  location: 'Eventyrland',
  description: 'Hva står på agendaen?',
  organizerName: 'Kari Nordmann*',
  organizerEmail: 'kari.nordmann@bekk.no',
  participantQuestion: 'Allergier, preferanser eller noe annet på hjertet?',
  limitSpots: 'F.eks. 10',
};

const helpText = {
  externalEvent:
    'Eksterne arrangement er tilgjengelig for personer utenfor Bekk.',
};

const buttonText = {
  addEndDate: 'Legg til sluttdato',
  removeEndDate: 'Fjern sluttdato',
  addRegistrationEndDate: 'Legg til påmeldingsfrist',
  removeRegistrationEndDate: 'Fjern påmeldingsfrist',
  addParticipantQuestion: 'Legg til spørsmål til deltakere',
  removeParticipantQuestion: 'Fjern spørsmål til deltakere',
};
