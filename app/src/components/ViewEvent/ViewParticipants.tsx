import React from 'react';
import style from './ViewParticipants.module.scss';
import { stringifyEmail } from 'src/types/email';
import { useEvent, useParticipants } from 'src/hooks/cache';
import { hasLoaded, isBad } from 'src/remote-data';
import { useMediaQuery } from 'react-responsive';
import { IParticipant } from 'src/types/participant';

interface IProps {
  eventId: string;
  editToken?: string;
}

export const ViewParticipants = ({ eventId, editToken }: IProps) => {
  const remoteParticipants = useParticipants(eventId, editToken);
  const screenIsMobileSize = useMediaQuery({
    query: `(max-width: ${540}px)`,
  });

  if (isBad(remoteParticipants)) {
    return <div>Det er noe galt med dataen</div>;
  }

  if (!hasLoaded(remoteParticipants)) {
    return <div>Laster...</div>;
  }

  const { attendees, waitingList } = remoteParticipants.data;

  return (
    <div>
      {remoteParticipants.data.attendees.length > 0 ? (
        screenIsMobileSize ? (
          <ParticipantTableMobile participants={attendees} />
        ) : (
          <ParticipantTableDesktop eventId={eventId} participants={attendees} />
        )
      ) : (
        <div>Ingen påmeldte</div>
      )}
      {waitingList && waitingList.length > 0 && (
        <>
          <h3 className={style.subSubHeader}>På venteliste</h3>
          {screenIsMobileSize ? (
            <ParticipantTableMobile participants={waitingList} />
          ) : (
            <ParticipantTableDesktop
              eventId={eventId}
              participants={waitingList}
            />
          )}
        </>
      )}
    </div>
  );
};

const ParticipantTableMobile = (props: { participants: IParticipant[] }) => {
  return (
    <table className={style.table}>
      <tbody>
        {props.participants.map((attendee) => (
          <React.Fragment key={attendee.name + attendee.email.email}>
            <tr>
              <td className={style.mobileNameCell}>{attendee.name}</td>
              <td className={style.mobileEmailCell}>
                {stringifyEmail(attendee.email)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className={style.mobileCommentCell}>
                {
                  // TODO Denne må fikses:
                }
                {attendee.answers}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

const ParticipantTableDesktop = (props: {
  eventId: string;
  participants: IParticipant[];
}) => {
  const event = useEvent(props.eventId);
  const hasComments = hasLoaded(event)
    ? event.data.participantQuestions.length > 0
    : true;
  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th className={style.desktopHeaderCell}>Navn</th>
          <th className={style.desktopHeaderCell}>E-post</th>
          {hasComments && (
            <th className={style.desktopHeaderCell}>Kommentar</th>
          )}
        </tr>
      </thead>
      <tbody>
        {props.participants.map((attendee) => (
          <tr key={attendee.name + attendee.email.email}>
            <td className={style.desktopCell}>{attendee.name}</td>
            <td className={style.desktopCell}>
              {stringifyEmail(attendee.email)}
            </td>
            {
              // TODO Denne må fikses:
              // answers er en liste og kan ikkje blæstes i jsx-en
            }
            {hasComments && (
              <td className={style.desktopCell}>{attendee.answers}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
