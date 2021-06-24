import React from 'react';
import style from './ViewEventContainer.module.scss';
import { stringifyEmail } from 'src/types/email';
import { useParticipants } from 'src/hooks/cache';
import { hasLoaded } from 'src/remote-data';

interface IProps {
  eventId: string;
  editToken?: string;
}

export const ViewParticipants = ({ eventId, editToken }: IProps) => {
  const remoteParticipants = useParticipants(eventId, editToken);

  const attendees = hasLoaded(remoteParticipants)
    ? remoteParticipants.data.attendees
    : [];
  const waitingList = hasLoaded(remoteParticipants)
    ? remoteParticipants.data.waitingList
    : [];

  return (
    <div>
      <h1 className={style.subHeader}>Påmeldte</h1>
      <div>
        {attendees.length > 0 ? (
          attendees.map((attendee) => {
            return (
              <div key={stringifyEmail(attendee.email)} className={style.text}>
                {attendee.name}, {stringifyEmail(attendee.email)}, Kommentar:{' '}
                {attendee.comment}
              </div>
            );
          })
        ) : (
          <div className={style.text}>Ingen påmeldte</div>
        )}
        {waitingList && waitingList.length > 0 && (
          <>
            <h3>På venteliste</h3>
            {waitingList.map((waitlisted) => (
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
