import React from 'react';
import { IEvent } from 'src/types/event';
import style from './PreviewEvent.module.scss';
import { IDateTime } from 'src/types/date-time';

interface IProps {
  event: IEvent;
}

export const PreviewEvent = ({ event }: IProps) => {
  const dateElement = (date: IDateTime, label: string) => {
    const { day, month, year } = date.date;
    const { hour, minute } = date.time;
    return (
      <dl className={style.dataEntry}>
        <dt>{label}</dt>
        <dd>
          {day}.{month}.{year}
        </dd>
        <dd>
          {hour}:{minute}
        </dd>
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
      <h1>Forhåndsvisning av event</h1>
      <p>{event.title}</p>
      <p>
        {event.organizerName} - {event.organizerEmail}
      </p>
      <p>{event.location}</p>
      <p>{event.description}</p>
      <div>{dateElement(event.start, 'Starter')}</div>
      <div>{dateElement(event.end, 'Slutter')}</div>
      <div>{dateElement(event.openForRegistration, 'Påmeldingen åpner')}</div>
      <p>{dataEntry(event.maxParticipants, 'Maks antall')}</p>
    </>
  );
};
