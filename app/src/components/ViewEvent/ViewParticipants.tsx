import React from 'react';
import style from './ViewParticipants.module.scss';
import { stringifyEmail } from 'src/types/email';
import { useParticipants } from 'src/hooks/cache';
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

  return (
    <div>
      {remoteParticipants.data.attendees.length > 0 ? (
        screenIsMobileSize ? (
          <ParticipantTableMobile
            participants={remoteParticipants.data.attendees}
          />
        ) : (
          <ParticipantTableDesktop
            participants={remoteParticipants.data.attendees}
          />
        )
      ) : (
        <div>Ingen påmeldte</div>
      )}
      {remoteParticipants.data.waitingList &&
        remoteParticipants.data.waitingList.length > 0 && (
          <>
            <h3 className={style.subSubHeader}>På venteliste</h3>
            {screenIsMobileSize ? (
              <ParticipantTableMobile
                participants={remoteParticipants.data.waitingList}
              />
            ) : (
              <ParticipantTableDesktop
                participants={remoteParticipants.data.waitingList}
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
      {props.participants.map((attendee) => {
        return (
          <>
            <tr>
              <td className={style.mobileNameCell}>{attendee.name}</td>
              <td className={style.mobileEmailCell}>
                {stringifyEmail(attendee.email)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className={style.mobileCommentCell}>
                {attendee.comment}
              </td>
            </tr>
          </>
        );
      })}
    </table>
  );
};

const ParticipantTableDesktop = (props: { participants: IParticipant[] }) => {
  return (
    <table className={style.table}>
      <tr>
        <th className={style.desktopHeaderCell}>Navn</th>
        <th className={style.desktopHeaderCell}>E-post</th>
        <th className={style.desktopHeaderCell}>Kommentar</th>
      </tr>
      {props.participants.map((attendee) => {
        return (
          <tr>
            <td className={style.desktopCell}>{attendee.name}</td>
            <td className={style.desktopCell}>
              {stringifyEmail(attendee.email)}
            </td>
            <td className={style.desktopCell}>{attendee.comment}</td>
          </tr>
        );
      })}
    </table>
  );
};
