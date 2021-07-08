import React from 'react';
import style from './ViewEventContainer.module.scss';
import { stringifyEmail } from 'src/types/email';
import { useParticipants } from 'src/hooks/cache';
import { hasLoaded, isBad } from 'src/remote-data';

interface IProps {
  eventId: string;
  editToken?: string;
}

export const ViewParticipants = ({ eventId, editToken }: IProps) => {
  const remoteParticipants = useParticipants(eventId, editToken);

  if (isBad(remoteParticipants)) {
    return <div>Det er noe galt med dataen</div>;
  }

  if (!hasLoaded(remoteParticipants)) {
    return <div>Laster...</div>;
  }

  return (
    <div>
      <h1 className={style.subHeader}>Påmeldte</h1>
      <div>
        {remoteParticipants.data.attendees.length > 0 ? (
          remoteParticipants.data.attendees.map((attendee) => {
            return (
              <div key={stringifyEmail(attendee.email)} className={style.text}>
                {attendee.name}, {stringifyEmail(attendee.email)}
                {attendee.comment && <>, Kommentar: {attendee.comment}</>}
              </div>
            );
          })
        ) : (
          <div className={style.text}>Ingen påmeldte</div>
        )}
        {remoteParticipants.data.waitingList &&
          remoteParticipants.data.waitingList.length > 0 && (
            <>
              <h3>På venteliste</h3>
              {remoteParticipants.data.waitingList.map((waitlisted) => (
                <div
                  key={stringifyEmail(waitlisted.email)}
                  className={style.text}
                >
                  {waitlisted.name}, {stringifyEmail(waitlisted.email)},
                  Kommentar: {waitlisted.comment}
                </div>
              ))}
            </>
          )}
      </div>
    </div>
  );
};
