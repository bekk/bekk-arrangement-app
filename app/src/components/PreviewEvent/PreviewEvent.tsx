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
    formatedDate,
    formatedTime,
    label,
  }: {
    formatedDate: string;
    formatedTime: string;
    label: string;
  }) => (
    <div className={style.dataEntry}>
      <div className={style.labelText}>{label}</div>
      <div>{formatedDate}</div>
      <div>{formatedTime}</div>
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
        formatedDate={stringifyDate(event.start.date)}
        formatedTime={stringifyTime(event.start.time)}
        label={'Starter'}
      />
      <DateInfo
        formatedDate={stringifyDate(event.end.date)}
        formatedTime={stringifyTime(event.end.time)}
        label={'Starter'}
      />
      <DateInfo
        formatedDate={stringifyTimeInstanceDate(event.openForRegistrationTime)}
        formatedTime={stringifyTimeInstanceTime(event.openForRegistrationTime)}
        label={'Påmelding åpner'}
      />
      <Info text={event.maxParticipants.toString()} label={'Maks antall'} />
    </>
  );
};
