import React, { useState } from 'react';
import style from './ViewEventContainer.module.scss';
import { IDateTime } from 'src/types/date-time';
import { postParticipant } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString } from 'src/utils/timeleft';
import { useEvent, useCreatedEvents } from 'src/hooks/eventHooks';
import { useParams, useHistory } from 'react-router';
import {
  IParticipant,
  IEditParticipant,
  parseParticipant,
  initalParticipant,
} from 'src/types/participant';
import { Result, isOk } from 'src/types/validation';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';
import {
  cancelParticipantRoute,
  viewEventRoute,
  eventsRoute,
  editEventRoute,
  confirmParticipantRoute,
} from 'src/routing';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { stringifyEmail, parseEmail } from 'src/types/email';
import { hasPermission, readPermission } from 'src/auth';
import { BlockLink } from '../Common/BlockLink/BlockLink';
import { ValidatedTextInput } from '../Common/ValidatedTextInput/ValidatedTextInput';

export const ViewEventContainer = () => {
  const { eventId = '0' } = useParams();
  const [participant, setParticipant] = useState<
    Result<IEditParticipant, IParticipant>
  >(parseParticipant({ ...initalParticipant, eventId }));
  const [wasCopied, setWasCopied] = useState(false);
  const history = useHistory();
  const { catchAndNotify } = useNotification();

  const [event] = useEvent(eventId);
  const timeLeft = useTimeLeft(event && event.openForRegistrationTime);
  const { createdEventIds } = useCreatedEvents();
  const hasRecentlyCreatedThisEvent = createdEventIds.includes(eventId);

  if (!event) {
    return <div>Loading</div>;
  }

  const addParticipant = catchAndNotify(async () => {
    if (isOk(participant)) {
      const redirectUrlTemplate =
        document.location.origin +
        cancelParticipantRoute({
          eventId: '{eventId}',
          email: '{email}',
          cancellationToken: '{cancellationToken}',
        });
      const {
        participant: { eventId, email },
      } = await postParticipant(participant.validValue, redirectUrlTemplate);
      history.push(
        confirmParticipantRoute({
          eventId,
          email,
        })
      );
    }
  });

  const copyLink = async () => {
    const url = document.location.origin + viewEventRoute(eventId);
    await navigator.clipboard.writeText(url);
    setWasCopied(true);
  };

  return (
    <Page>
      {hasPermission(readPermission) && (
        <BlockLink to={eventsRoute}>↩︎ Til arrangementer</BlockLink>
      )}
      {hasRecentlyCreatedThisEvent && (
        <BlockLink to={editEventRoute(eventId)}>
          ✎ Rediger arrangement
        </BlockLink>
      )}
      <h1 className={style.header}>{event.title}</h1>
      <div className={style.text}>
        <DateSection startDate={event.start} endDate={event.end} />
        <div>Lokasjon: {event.location}</div>
        <div className={style.subsection}>{event.description}</div>
        <div className={style.subsection}>
          Arrangør: {event.organizerName} -{' '}
          <a
            className={style.text}
            href={`mailto:${stringifyEmail(event.organizerEmail)}?subject=${
              event.title
            }`}
          >
            {stringifyEmail(event.organizerEmail)}
          </a>
        </div>
        <div className={style.copy}>
          <Button onClick={copyLink}>Kopier lenke</Button>
          <p className={style.textCopy}>{wasCopied && 'URL kopiert!'}</p>
        </div>
        <h1 className={style.header}>Påmelding</h1>
        {timeLeft.difference > 0 ? (
          <>
            <div>Stengt</div>
            <p>Åpner om {asString(timeLeft)}</p>
          </>
        ) : (
          <>
            <ValidatedTextInput
              label={'E-post'}
              value={participant.editValue.email}
              placeholder={'ola.nordmann@bekk.no'}
              onChange={(email: string) =>
                setParticipant(
                  parseParticipant({
                    ...participant.editValue,
                    email: parseEmail(email),
                  })
                )
              }
            />
            <br />
            <Button onClick={() => addParticipant()}>Meld meg på</Button>
          </>
        )}
      </div>
    </Page>
  );
};

interface IDateProps {
  startDate: IDateTime;
  endDate: IDateTime;
}

const DateSection = ({ startDate, endDate }: IDateProps) => {
  if (isSameDate(startDate.date, endDate.date)) {
    return (
      <p>
        {capitalize(dateAsText(startDate.date))} <br />
        fra {stringifyTime(startDate.time)} til {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p>
      Fra {dateAsText(startDate.date)} {stringifyTime(startDate.time)} <br />
      Til {dateAsText(endDate.date)} {stringifyTime(endDate.time)}
    </p>
  );
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1);
