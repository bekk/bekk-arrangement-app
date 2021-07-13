import React, { useState } from 'react';
import style from './ViewEvent.module.scss';
import { IEvent } from 'src/types/event';
import { Button } from 'src/components/Common/Button/Button';
import { stringifyEmail } from 'src/types/email';
import { isSameDate, stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { IDateTime } from 'src/types/date-time';
import { useParam } from 'src/utils/browser-state';
import { editEventRoute, eventIdKey, viewEventRoute } from 'src/routing';
import { ClockIcon } from 'src/components/Common/Icons/ClockIcon';
import { GentlemanIcon } from 'src/components/Common/Icons/GentlemanIcon';
import { LocationIcon } from 'src/components/Common/Icons/LocationIcon';
import { ExternalIcon } from 'src/components/Common/Icons/ExternalIcon';
import { useHistory } from 'react-router';

interface IProps {
  event: IEvent;
  participantsText: string;
  userCanEdit: boolean;
}

export const ViewEvent = ({ event, userCanEdit }: IProps) => {
  const [wasCopied, setWasCopied] = useState(false);
  const eventId = useParam(eventIdKey);

  const copyLink = async () => {
    const url = document.location.origin + viewEventRoute(eventId);
    await navigator.clipboard.writeText(url);
    setWasCopied(true);
    setTimeout(() => setWasCopied(false), 3000);
  };

  const history = useHistory();

  return (
    <section className={style.container}>
      <div className={style.headerContainer}>
        <h1 className={style.header}>{event.title}</h1>
        {userCanEdit && (
          <Button onClick={() => history.push(editEventRoute(eventId))}>
            Rediger
          </Button>
        )}
      </div>
      <div className={style.generalInfoContainer}>
        <div className={style.iconTextContainer}>
          <ClockIcon color="white" className={style.clockIcon} />
          <DateSection startDate={event.start} endDate={event.end} />
        </div>
        <div className={style.iconTextContainer}>
          <LocationIcon color="white" className={style.icon} />
          <p className={style.regularText}>{event.location}</p>
        </div>
        <div className={style.iconTextContainer}>
          <GentlemanIcon color="white" className={style.icon} />
          <p className={style.regularText}>{event.maxParticipants} plasser</p>
        </div>
        {event.isExternal && (
          <div className={style.iconTextContainer}>
            <ExternalIcon color="white" className={style.externalIcon} />
            <p className={style.regularText}>Eksternt arrangement</p>
          </div>
        )}
      </div>
      <p className={style.description}>{event.description}</p>
      <p className={style.orgainzier}>
        Arrangementet holdes av {event.organizerName}. Har du spørsmål ta
        kontakt på {stringifyEmail(event.organizerEmail)}
      </p>
      <div className={style.buttonGroup}>
        <Button color="Primary" onClick={copyLink}>
          {wasCopied ? 'Lenke kopiert!' : 'Kopier lenke'}
        </Button>
        {/* <Button color="Primary" onClick={() => console.log('Dupliser')}>
          Dupliser arrangement
        </Button> */}
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
      <p className={style.text}>
        {stringifyDate(startDate.date)}, {stringifyTime(startDate.time)} -{' '}
        {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p className={style.text}>
      {stringifyDate(startDate.date)}, {stringifyTime(startDate.time)} -
      {stringifyDate(endDate.date)}, {stringifyTime(endDate.time)}
    </p>
  );
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1);
