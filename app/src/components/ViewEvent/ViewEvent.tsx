import React, { useState } from 'react';
import style from './ViewEvent.module.scss';
import {
  IEvent,
  isMaxParticipantsLimited,
  maxParticipantsLimit,
  toEditEvent,
  urlFromShortname,
} from 'src/types/event';
import { Button } from 'src/components/Common/Button/Button';
import { stringifyEmail } from 'src/types/email';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { IDateTime } from 'src/types/date-time';
import { createRoute, editEventRoute, viewEventRoute } from 'src/routing';
import { ClockIcon } from 'src/components/Common/Icons/ClockIcon';
import { GentlemanIcon } from 'src/components/Common/Icons/GentlemanIcon';
import { LocationIcon } from 'src/components/Common/Icons/LocationIcon';
import { ExternalIcon } from 'src/components/Common/Icons/ExternalIcon';
import { useHistory } from 'react-router';
import { userIsLoggedIn } from 'src/auth';
import { WavySubHeader } from 'src/components/Common/Header/WavySubHeader';
import { useGotoCreateDuplicate } from 'src/hooks/history';

interface IProps {
  eventId?: string;
  event: IEvent;
  participantsText: string;
  userCanEdit: boolean;
  isPreview?: true;
}

export const ViewEvent = ({
  eventId,
  event,
  userCanEdit,
  participantsText,
  isPreview,
}: IProps) => {
  const [wasCopied, setWasCopied] = useState(false);
  const hasOpenedForRegistration = event.openForRegistrationTime < new Date();

  const copyLink =
    eventId !== undefined &&
    (async () => {
      const url = event.shortname
        ? urlFromShortname(event.shortname)
        : document.location.origin + viewEventRoute(eventId);
      await navigator.clipboard.writeText(url);
      setWasCopied(true);
      setTimeout(() => setWasCopied(false), 3000);
    });

  const history = useHistory();
  const gotoDuplicate = useGotoCreateDuplicate(createRoute);

  return (
    <section className={style.container}>
      <WavySubHeader eventId={eventId}>
        <div className={style.headerContainer}>
          <h1 className={style.header}>{event.title}</h1>
          {userCanEdit && eventId !== undefined && (
            <>
              <Button
                onClick={() => history.push(editEventRoute(eventId))}
                color={'Secondary'}
              >
                Rediger
              </Button>
              <Button
                displayAsLink
                onLightBackground
                onClick={() => gotoDuplicate(toEditEvent(event))}
                color={'Secondary'}
              >
                Dupliser
              </Button>
            </>
          )}
        </div>
        <div className={style.generalInfoContainer}>
          <div className={style.organizer}>
            <div>Arrangør</div>
            <div className={style.organizerName}>{event.organizerName}</div>
            <div className={style.organizerEmail}>
              ({stringifyEmail(event.organizerEmail)})
            </div>
          </div>
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
                {!isMaxParticipantsLimited(event.maxParticipants)
                  ? ' ∞'
                  : maxParticipantsLimit(event.maxParticipants)}{' '}
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
          <div className={style.buttonGroup}>
            {!isPreview && copyLink !== false && (
              <Button color="Secondary" onClick={copyLink}>
                {wasCopied ? 'Lenke kopiert!' : 'Kopier lenke'}
              </Button>
            )}
          </div>
        </div>
      </WavySubHeader>
      <div className={style.contentContainer}>
        <p className={style.description}>
          <Description description={event.description} />
        </p>
        {isPreview && (
          <div className={style.preview}>
            {event.participantQuestions.length > 0 && (
              <div>
                <h3>Spørsmål til deltaker</h3>
                {event.participantQuestions.map((q) => (
                  <div>{q}</div>
                ))}
              </div>
            )}
            {event.shortname && (
              <div>
                <h3>Arrangementet kan nåes via:</h3>
                <div>{urlFromShortname(event.shortname)}</div>
              </div>
            )}
          </div>
        )}
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

const Description = ({ description }: { description: string }) => {
  const paragraphs = description.split('\n');
  return (
    <>
      {paragraphs.map((paragraph) => (
        <div className={style.paragraph}>
          {formatLinks(paragraph).map(formatHeadersAndStuff)}
        </div>
      ))}
    </>
  );
};

const formatLinks = (line: string) => {
  const linkRegex = /(https?:\/\/[^\s]+)/;
  return line.split(linkRegex).map((s) => {
    if (linkRegex.test(s)) {
      return (
        <a href={s} className={style.link}>
          {s}
        </a>
      );
    }
    return s;
  });
};

const formatHeadersAndStuff = (s: string | JSX.Element, i: number) => {
  if (i === 0 && typeof s === 'string') {
    if (s.charAt(0) === '-') {
      return <li>{s.slice(1).trim()}</li>;
    }
    if (s.charAt(0) === '#') {
      return <h3>{s.slice(1).trim()}</h3>;
    }
  }
  return s;
};
