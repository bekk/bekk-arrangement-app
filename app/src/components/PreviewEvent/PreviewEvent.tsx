import React from 'react';
import { IEvent } from 'src/types/event';
import style from './PreviewEvent.module.scss';
import { stringifyTime } from 'src/types/time';
import { stringifyDate } from 'src/types/date';
import {
  stringifyTimeInstanceDate,
  stringifyTimeInstanceTime,
} from 'src/types/time-instance';
import { stringifyEmail } from 'src/types/email';

interface IProps {
  event: IEvent;
}

export const PreviewEvent = ({ event }: IProps) => {
  const DateInfo = ({
    formattedDate,
    formattedTime,
    label,
  }: {
    formattedDate: string;
    formattedTime: string;
    label: string;
  }) => (
    <div className={style.dataEntry}>
      <div className={style.labelText}>{label}</div>
      <div>{formattedDate}</div>
      <div>{formattedTime}</div>
    </div>
  );

  const Info = ({ text, label }: { text: string; label: string }) => (
    <div className={style.dataEntry}>
      <div className={style.labelText}>{label}</div>
      <div className={style.infoText}>{text}</div>
    </div>
  );

  return (
    <>
      <h1 className={style.header}>Forhåndsvisning</h1>
      <Info text={event.title} label={'Tittel'} />
      <Info text={event.organizerName} label={'Arrangør'} />
      <Info
        text={stringifyEmail(event.organizerEmail)}
        label={'Epost arrangør'}
      />
      <Info text={event.location} label={'Lokasjon'} />
      <Info text={event.description} label={'Beskrivelse'} />
      <DateInfo
        formattedDate={stringifyDate(event.start.date)}
        formattedTime={stringifyTime(event.start.time)}
        label={'Starter'}
      />
      <DateInfo
        formattedDate={stringifyDate(event.end.date)}
        formattedTime={stringifyTime(event.end.time)}
        label={'Slutter'}
      />
      <DateInfo
        formattedDate={stringifyTimeInstanceDate(event.openForRegistrationTime)}
        formattedTime={stringifyTimeInstanceTime(event.openForRegistrationTime)}
        label={'Påmelding åpner'}
      />
      <Info text={event.maxParticipants.toString()} label={'Maks antall'} />
    </>
  );
};
