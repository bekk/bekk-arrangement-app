import React, { useState } from 'react';
import style from './ViewEvent.module.scss';
import { IEvent } from 'src/types/event';
import { Button } from 'src/components/Common/Button/Button';
import { stringifyEmail } from 'src/types/email';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { IDateTime } from 'src/types/date-time';
import { editEventRoute, viewEventRoute } from 'src/routing';
import { ClockIcon } from 'src/components/Common/Icons/ClockIcon';
import { GentlemanIcon } from 'src/components/Common/Icons/GentlemanIcon';
import { LocationIcon } from 'src/components/Common/Icons/LocationIcon';
import { ExternalIcon } from 'src/components/Common/Icons/ExternalIcon';
import { useHistory } from 'react-router';
import { userIsLoggedIn } from 'src/auth';
import { WavySubHeader } from 'src/components/Common/Header/WavySubHeader';

interface IProps {
  eventId: string;
  event: IEvent;
  participantsText: string;
  userCanEdit: boolean;
}

export const ViewEvent = ({
  eventId,
  event,
  userCanEdit,
  participantsText,
}: IProps) => {
  const [wasCopied, setWasCopied] = useState(false);

  const hasOpenedForRegistration = event.openForRegistrationTime < new Date();

  const copyLink = async () => {
    const url = document.location.origin + viewEventRoute(eventId);
    await navigator.clipboard.writeText(url);
    setWasCopied(true);
    setTimeout(() => setWasCopied(false), 3000);
  };

  const history = useHistory();

  return (
    <section className={style.container}>
      <WavySubHeader eventId={eventId}>
        <div className={style.headerContainer}>
          <h1 className={style.header}>{event.title}</h1>
          {userCanEdit && (
            <Button
              onClick={() => history.push(editEventRoute(eventId))}
              color={'Secondary'}
            >
              Rediger
            </Button>
          )}
        </div>
        <div className={style.generalInfoContainer}>
          <div className={style.iconTextContainer}>
            <ClockIcon color="black" className={style.clockIcon} />
            <DateSection startDate={event.start} endDate={event.end} />
          </div>
          <div className={style.iconTextContainer}>
            <LocationIcon color="black" className={style.icon} />
            <p>{event.location}</p>
          </div>
          <div className={style.iconTextContainer}>
            <GentlemanIcon color="black" className={style.icon} />
            {hasOpenedForRegistration ? (
              <p>{participantsText}</p>
            ) : (
              <p>
                {event.maxParticipants === 0 ? ' ∞' : event.maxParticipants}{' '}
                plasser
              </p>
            )}
          </div>
          {event.isExternal && userIsLoggedIn() && (
            <div className={style.iconTextContainer}>
              <ExternalIcon color="black" className={style.externalIcon} />
              <p>Eksternt arrangement</p>
            </div>
          )}
        </div>
      </WavySubHeader>
      <div className={style.contentContainer}>
        <p className={style.description}>{event.description}</p>
        <p className={style.organizer}>
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
        {dateAsText(startDate.date)}, {stringifyTime(startDate.time)} -{' '}
        {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p className={style.text}>
      {dateAsText(startDate.date)}, {stringifyTime(startDate.time)} -
      {dateAsText(endDate.date)}, {stringifyTime(endDate.time)}
    </p>
  );
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1);
