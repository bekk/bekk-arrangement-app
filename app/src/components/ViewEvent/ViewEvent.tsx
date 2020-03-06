import React, { useState } from 'react';
import style from './ViewEvent.module.scss';
import { IEvent } from 'src/types/event';
import { Button } from 'src/components/Common/Button/Button';
import { stringifyEmail } from 'src/types/email';
import { isSameDate, dateAsText } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { IDateTime } from 'src/types/date-time';
import { viewEventRoute, eventIdKey } from 'src/routing';
import { useQuery, useParam } from 'src/utils/browser-state';

interface IProps {
  event: IEvent;
  participantsText: string;
}
export const ViewEvent = ({ event, participantsText }: IProps) => {
  const [wasCopied, setWasCopied] = useState(false);
  const eventId = useParam(eventIdKey);

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
        <Button color="White" onClick={copyLink}>
          {wasCopied ? 'Lenke kopiert!' : 'Kopier lenke'}
        </Button>
      </div>
      <div className={style.timeContainer}>
        <p className={style.infoHeader}>Når</p>
        <DateSection startDate={event.start} endDate={event.end} />
      </div>
      <div className={style.participantsContainer}>
        <p className={style.infoHeader}>Påmeldte</p>
        <p className={style.text}>{participantsText}</p>
      </div>
      <div className={style.locationContainer}>
        <p className={style.infoHeader}>Lokasjon</p>
        <p className={style.text}>{event.location}</p>
      </div>
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
      <div className={style.descriptionContainer}>
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
