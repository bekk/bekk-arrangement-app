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
import {
  cancelParticipantRoute,
  viewEventRoute,
  eventsRoute,
  editEventRoute,
  confirmParticipantRoute,
} from 'src/routing';
import { stringifyEmail, parseEmail, serializeEmail } from 'src/types/email';
import { hasPermission, readPermission, adminPermission } from 'src/auth';
import { hasLoaded, isBad } from 'src/remote-data';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { useParticipants, useParticipations } from 'src/hooks/participantHooks';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';

export const ViewEventContainer = () => {
  const { eventId = '0' } = useParams();
  const [participant, setParticipant] = useState<
    Result<IEditParticipant, IParticipant>
  >(parseParticipant({ ...initalParticipant, eventId }));
  const [wasCopied, setWasCopied] = useState(false);
  const history = useHistory();
  const { catchAndNotify } = useNotification();

  const remoteEvent = useEvent(eventId);
  const timeLeft = useTimeLeft(
    hasLoaded(remoteEvent) && remoteEvent.data.openForRegistrationTime
  );
  const [participants] = useParticipants(eventId);
  const { createdEvents } = useCreatedEvents();
  const {
    participations: participationsInLocalStorage,
    setParticipant: setParticipantInLocalStorage,
  } = useParticipations();
  const recentlyCreatedThisEvent = createdEvents.find(
    event => event.eventId === eventId
  );

  if (isBad(remoteEvent)) {
    return <div>{remoteEvent.userMessage}</div>;
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading</div>;
  }

  const event = remoteEvent.data;
  const participantsText = `${participants?.length ?? 0}${
    event?.maxParticipants === 0 ? '' : ' av ' + event?.maxParticipants
  }`;

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
        cancellationToken,
      } = await postParticipant(participant.validValue, redirectUrlTemplate);
      setParticipantInLocalStorage({ eventId, email, cancellationToken });
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
      {(recentlyCreatedThisEvent || hasPermission(adminPermission)) && (
        <BlockLink
          to={editEventRoute(eventId, recentlyCreatedThisEvent?.editToken)}
        >
          ✎ Rediger arrangement
        </BlockLink>
      )}
      <h1 className={style.header}>{event.title}</h1>
      <div className={style.subsection}>{event.description}</div>
      <div className={style.subsection}>
        <DateSection startDate={event.start} endDate={event.end} />
        <div className={style.subsection}>Lokasjon: {event.location}</div>
        <div className={style.subsection}>{participantsText} påmeldte</div>
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
        <h1 className={style.header}>Påmeldte</h1>
        {participants && participants.length > 0 ? (
          participants.map(p => (
            <div key={serializeEmail(p.email)} className={style.text}>
              {stringifyEmail(p.email)}
            </div>
          ))
        ) : (
          <div className={style.text}>Ingen påmeldte</div>
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
