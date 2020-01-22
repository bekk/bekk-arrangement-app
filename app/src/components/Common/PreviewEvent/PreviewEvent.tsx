import React from 'react';
import { IEvent } from 'src/types/event';
import style from './PreviewEvent.module.scss';
import { IDateTime } from 'src/types/date-time';
import { stringifyTime } from 'src/types/time';
import { stringifyDate } from 'src/types/date';

interface IProps {
  event: IEvent;
}

export const PreviewEvent = ({ event }: IProps) => {
  const dateElement = (date: IDateTime, label: string) => {
    return (
      <dl className={style.dataEntry}>
        <dt>{label}</dt>
        <dd>{stringifyDate(date.date)}</dd>
        <dd>{stringifyTime(date.time)}</dd>
      </dl>
    );
  };

  const dataEntry = (data: any, label: string) => {
    return (
      <dl className={style.dataEntry}>
        <dt>{label}</dt>
        <dd>{data}</dd>
      </dl>
    );
  };

  return (
    <>
      <h1 className={style.header}>Forhåndsvisning av event</h1>
      <p>{event.title}</p>
      <p>
        {event.organizerName} - {event.organizerEmail}
      </p>
      <p>{event.location}</p>
      <p>{event.description}</p>
      <div>{dateElement(event.start, 'Starter')}</div>
      <div>{dateElement(event.end, 'Slutter')}</div>
      <div>{dateElement(event.openForRegistration, 'Påmeldingen åpner')}</div>
      <div>{dataEntry(event.maxParticipants, 'Maks antall')}</div>
    </>
  );
};
