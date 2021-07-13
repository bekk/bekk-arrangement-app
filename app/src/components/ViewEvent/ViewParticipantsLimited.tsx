import React from 'react';
import style from './ViewParticipants.module.scss';
import { useParticipants } from 'src/hooks/cache';
import { hasLoaded, isBad } from 'src/remote-data';
import { IParticipant } from 'src/types/participant';

interface IProps {
  eventId: string;
  editToken?: string;
}

export const ViewParticipantsLimited = ({ eventId, editToken }: IProps) => {
  const remoteParticipants = useParticipants(eventId, editToken);

  if (isBad(remoteParticipants)) {
    return <div>Det er noe galt med dataen</div>;
  }

  if (!hasLoaded(remoteParticipants)) {
    return <div>Laster...</div>;
  }

  return (
    <div>
      {remoteParticipants.data.attendees.length > 0 ? (
        <div>
          <ParticipantTableLimited
            participants={remoteParticipants.data.attendees}
          />
        </div>
      ) : (
        <div>Ingen påmeldte</div>
      )}
      {remoteParticipants.data.waitingList &&
        remoteParticipants.data.waitingList.length > 0 && (
          <>
            <h3 className={style.subSubHeader}>På venteliste</h3>
            <ParticipantTableLimited
              participants={remoteParticipants.data.waitingList}
            />
          </>
        )}
    </div>
  );
};

const ParticipantTableLimited = (props: { participants: IParticipant[] }) => {
  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th className={style.desktopHeaderCell}>Navn</th>
        </tr>
      </thead>
      <tbody>
        {props.participants.map((attendee) => {
          return (
            <tr>
              <td className={style.desktopCell}>{attendee.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
