import React from 'react';
import { IEvent } from 'src/types/event';
import style from './PreviewEvent.module.scss';
import { IDateTime } from 'src/types/date-time';
import { stringifyTime } from 'src/types/time';
import { stringifyDate } from 'src/types/date';
import { stringifyTimeInstance } from 'src/types/time-instance';

interface IProps {
  event: IEvent;
}

export const PreviewEvent = ({ event }: IProps) => {
  const TimeInfo = ({ date, label }: { date: IDateTime; label: string }) => (
    <div className={style.dataEntry}>
      <div className={style.labelText}>{label}</div>
      <div>{stringifyDate(date.date)}</div>
      <div>{stringifyTime(date.time)}</div>
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
      <Info
        text={`${event.organizerName} - ${event.organizerEmail}`}
        label={'Arrangør'}
      />
      <Info text={event.location} label={'Lokasjon'} />
      <Info text={event.description} label={'Beskrivelse'} />
      <TimeInfo date={event.start} label={'Starter'} />
      <TimeInfo date={event.end} label={'Slutter'} />
      <Info
        label={'Påmeldingen åpner'}
        text={stringifyTimeInstance(event.openForRegistrationTime)}
      />
      <Info text={event.maxParticipants.toString()} label={'Maks antall'} />
    </>
  );
};
