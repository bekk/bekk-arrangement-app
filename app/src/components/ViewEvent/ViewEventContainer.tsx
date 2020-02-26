import React, { useState } from 'react';
import style from './ViewEventContainer.module.scss';
import { IDateTime, isInThePast } from 'src/types/date-time';
import { postParticipant } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString } from 'src/utils/timeleft';
import { useEvent, useSavedEditableEvents } from 'src/hooks/eventHooks';
import { useParams, useHistory } from 'react-router';
import {
  IParticipant,
  IEditParticipant,
  parseParticipant,
  initalParticipant,
  parseName,
  parseComment,
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
import { userIsLoggedIn, userIsAdmin } from 'src/auth';
import { hasLoaded, isBad } from 'src/remote-data';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import {
  useParticipants,
  useSavedParticipations,
} from 'src/hooks/participantHooks';
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
  const remoteParticipants = useParticipants(eventId);
  const { savedEvents } = useSavedEditableEvents();
  const editTokenFound = savedEvents.find(event => event.eventId === eventId);

  const {
    savedParticipations: participationsInLocalStorage,
    saveParticipation: setParticipantInLocalStorage,
  } = useSavedParticipations();
  const participationsForThisEvent = participationsInLocalStorage.filter(
    p => p.eventId === eventId
  );

  if (isBad(remoteEvent)) {
    return <div>{remoteEvent.userMessage}</div>;
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Loading</div>;
  }

  const event = remoteEvent.data;
  const participants = hasLoaded(remoteParticipants)
    ? remoteParticipants.data
    : [];

  const participantsText = `${participants.length}${
    event?.maxParticipants === 0 ? ' av ∞' : ' av ' + event?.maxParticipants
  }`;
  const eventIsFull =
    event.maxParticipants !== 0 &&
    event.maxParticipants === participants.length;
  const participantQuestion =
    event.participantQuestion === ''
      ? 'Allergier, preferanser eller noe annet på hjertet?'
      : event.participantQuestion;

  const addParticipant = catchAndNotify(async () => {
    if (isOk(participant)) {
      const cancelUrlTemplate =
        document.location.origin +
        cancelParticipantRoute({
          eventId: '{eventId}',
          email: '{email}',
          cancellationToken: '{cancellationToken}',
        });
      const {
        participant: { eventId, email },
        cancellationToken,
      } = await postParticipant(participant.validValue, cancelUrlTemplate);
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
    setTimeout(() => setWasCopied(false), 3000);
  };

  const closedEventText = () => {
    if (isInThePast(event.end)) {
      return (
        <p>
          Stengt <br />
          Arrangementet har allerede funnet sted
        </p>
      );
    } else if (timeLeft.difference > 0) {
      return (
        <p>
          Stengt <br />
          Åpner om {asString(timeLeft)}
        </p>
      );
    } else if (eventIsFull) {
      return (
        <p>
          Stengt <br />
          Arrangementet er dessverre fullt
        </p>
      );
    } else {
      return undefined;
    }
  };

  return (
    <Page>
      {userIsLoggedIn() && (
        <BlockLink to={eventsRoute}>Til arrangementer</BlockLink>
      )}
      {(editTokenFound || userIsAdmin()) && (
        <BlockLink to={editEventRoute(eventId, editTokenFound?.editToken)}>
          Rediger arrangement
        </BlockLink>
      )}
      {participationsForThisEvent.map(p => (
        <BlockLink key={p.email} to={cancelParticipantRoute(p)}>
          Meld {p.email} av arrangementet
        </BlockLink>
      ))}

      <section className={style.container}>
        <h1 className={style.header}>{event.title}</h1>
        <div className={style.buttonContainer}>
          <Button color="White" onClick={copyLink}>
            {wasCopied ? 'Lenke kopiert!' : 'Kopier lenke'}
          </Button>
        </div>
        <div className={style.infoContainer}>
          <p className={style.infoHeader}>Når</p>
          <DateSection startDate={event.start} endDate={event.end} />
        </div>
        <div className={style.infoContainer}>
          <p className={style.infoHeader}>Påmeldte</p>
          <p>{participantsText}</p>
        </div>
        <div className={style.infoContainer}>
          <p className={style.infoHeader}>Lokasjon</p>
          <p>{event.location}</p>
        </div>

        <div className={style.organizerName}>
          <p className={style.infoHeader}>Arrangør</p>
          <p className={style.text}>{event.organizerName}</p>
        </div>
        <div className={style.contactInfo}>
          <p className={style.infoHeader}>Kontaktinfo</p>
          <a
            className={style.text}
            href={`mailto:${stringifyEmail(event.organizerEmail)}?subject=${
              event.title
            }`}
          >
            {stringifyEmail(event.organizerEmail)}
          </a>
        </div>

        <div className={style.descriptionContainer}>
          <p className={style.textBlock}>{event.description}</p>
        </div>
      </section>

      <section>
        <h1 className={style.subHeader}>Påmelding</h1>
        {closedEventText() ?? (
          <>
            <ValidatedTextInput
              label={'Navn'}
              value={participant.editValue.name}
              placeholder={'Ola Nordmann'}
              onChange={(name: string) =>
                setParticipant(
                  parseParticipant({
                    ...participant.editValue,
                    name: parseName(name),
                  })
                )
              }
            />
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
            <ValidatedTextInput
              label={participantQuestion}
              value={participant.editValue.comment}
              placeholder={'Kommentar til arrangør'}
              onChange={(comment: string) =>
                setParticipant(
                  parseParticipant({
                    ...participant.editValue,
                    comment: parseComment(comment),
                  })
                )
              }
            />
            <br />
            <Button onClick={() => addParticipant()}>Meld meg på</Button>
          </>
        )}
        <h1 className={style.subHeader}>Påmeldte</h1>
        {participants.length > 0 ? (
          participants.map(p => {
            return (
              <div key={serializeEmail(p.email)} className={style.text}>
                {p.name}, {stringifyEmail(p.email)}, Kommentar: {p.comment}
              </div>
            );
          })
        ) : (
          <div className={style.text}>Ingen påmeldte</div>
        )}
      </section>
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
      <p className={style.dateText}>
        {capitalize(dateAsText(startDate.date))} <br />
        fra {stringifyTime(startDate.time)} til {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p className={style.dateText}>
      Fra {dateAsText(startDate.date)} {stringifyTime(startDate.time)} <br />
      Til {dateAsText(endDate.date)} {stringifyTime(endDate.time)}
    </p>
  );
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1);
