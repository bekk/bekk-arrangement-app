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
  const TimeInfo = ({ date, label }: { date: IDateTime; label: string }) => (
    <div className={style.dataEntry}>
      <div>{label}</div>
      <div>{stringifyDate(date.date)}</div>
      <div>{stringifyTime(date.time)}</div>
    </div>
  );

  const Info = ({ text, label }: { text: string; label: string }) => (
    <div className={style.dataEntry}>
      <div>{label}</div>
      <div>{text}</div>
    </div>
  );

  return (
    <>
      <h1 className={style.header}>Forhåndsvisning av event</h1>
      <Info text={event.title} label={'Tittel'} />
      <Info
        text={`${event.organizerName} - ${event.organizerEmail}`}
        label={'Arrangør'}
      />
      <Info text={event.location} label={'Lokasjon'} />
      <Info text={event.description} label={'Beskrivelse'} />
      <TimeInfo date={event.start} label={'Starter'} />
      <TimeInfo date={event.end} label={'Slutter'} />
      <TimeInfo date={event.openForRegistration} label={'Påmeldingen åpner'} />
      <Info text={event.maxParticipants.toString()} label={'Maks antall'} />
    </>
  );
};
