import React, { useState } from 'react';
import style from './ViewEvent.module.scss';
import { IEvent } from 'src/types/event';
import { Button } from 'src/components/Common/Button/Button';
import { stringifyEmail } from 'src/types/email';
import { isSameDate, dateAsText } from 'src/types/date';
import { stringifyTime, dateToITime } from 'src/types/time';
import { IDateTime } from 'src/types/date-time';
import { useParam } from 'src/utils/browser-state';
import { eventIdKey, viewEventRoute } from 'src/routing';
import {
  TimeInstance,
  stringifyTimeInstanceWithDayName,
} from 'src/types/time-instance';

interface IProps {
  event: IEvent;
  participantsText: string;
}

export const ViewEvent = ({ event, participantsText }: IProps) => {
  const [wasCopied, setWasCopied] = useState(false);
  const eventId = useParam(eventIdKey);

  const hasOpenedForRegistration = event.openForRegistrationTime < new Date();

  const copyLink = async () => {
    const url = document.location.origin + viewEventRoute(eventId);
    await navigator.clipboard.writeText(url);
    setWasCopied(true);
    setTimeout(() => setWasCopied(false), 3000);
  };

  return (
    <section className={style.container}>
      <h1 className={style.header}>{event.title}</h1>
      <div className={style.buttonContainer}>
        <Button color="Primary" onClick={copyLink}>
          {wasCopied ? 'Lenke kopiert!' : 'Kopier lenke'}
        </Button>
      </div>
      <div className={style.timeContainer}>
        <p className={style.infoHeader}>Når</p>
        <DateSection startDate={event.start} endDate={event.end} />
      </div>
      {!hasOpenedForRegistration ? (
        <OpenForRegistrationTimeSection date={event.openForRegistrationTime} />
      ) : (
        <div className={style.participantsContainer}>
          <p className={style.infoHeader}>Påmeldte</p>
          <p className={style.text}>{participantsText}</p>
        </div>
      )}
      <div className={style.organizerContainer}>
        <p className={style.infoHeader}>Arrangør</p>
        <p className={style.text}>{event.organizerName}</p>
        <a
          className={style.emailLink}
          href={`mailto:${stringifyEmail(event.organizerEmail)}?subject=${
            event.title
          }`}
        >
          {stringifyEmail(event.organizerEmail)}
        </a>
      </div>
      {event.isExternal && ( //TODO: make this beautiful🥳
        <div className={style.externalContainer}>
          Dette arrangementet er eksternt
        </div>
      )}
      <div className={style.locationContainer}>
        <p className={style.infoHeader}>Hvor</p>
        <p className={style.text}>{event.location}</p>
      </div>
      <div className={style.descriptionContainer}>
        <p className={style.infoHeader}>Beskrivelse</p>
        <p className={style.textBlock}>{event.description}</p>
      </div>
    </section>
  );
};

interface IDateProps {
  startDate: IDateTime;
  endDate: IDateTime;
}

const DateSection = ({ startDate, endDate }: IDateProps) => {
  if (isSameDate(startDate.date, endDate.date)) {
    return (
      <p className={style.dateText}>
        {capitalize(dateAsText(startDate.date))} <br />
        Fra {stringifyTime(startDate.time)} til {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p className={style.dateText}>
      Fra {dateAsText(startDate.date)} {stringifyTime(startDate.time)} <br />
      Til {dateAsText(endDate.date)} {stringifyTime(endDate.time)}
    </p>
  );
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1);

interface OpenForRegistrationTimeSectionProps {
  date: TimeInstance;
}

const OpenForRegistrationTimeSection = ({
  date,
}: OpenForRegistrationTimeSectionProps) => (
  <div className={style.registrationTimeContainer}>
    <div className={style.text}>
      <p className={style.infoHeader}>Påmelding åpner</p>
      <p className={style.dateText}>
        {capitalize(stringifyTimeInstanceWithDayName(date))} <br />
        Klokken {stringifyTime(dateToITime(date))}
      </p>
    </div>
  </div>
);
