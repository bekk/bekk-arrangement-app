import React, { useState } from 'react';
import { Menu } from '../Common/Menu/Menu';
import { IEvent } from 'src/types/event';
import { stringifyDateTime } from 'src/types/date-time';
import { TextInput } from '../Common/TextInput/TextInput';
import { IRegistration } from 'src/types/registration';

interface Props {
  events: Map<number, IEvent>;
  onChange: (eventId: number, registration: IRegistration) => Promise<void>;
}

export const RegisterForEvent = ({ events, onChange }: Props) => {
  const [participantEmail, setParticipantEmail] = useState('');
  return (
    <div>
      <Menu tab={'registration'} />
      <h1>Register for an event</h1>
      <div>
        {events.map((event, eventId) => (
          <div
            style={{
              display: 'flex',
              width: '800px',
              marginBottom: '30px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>Location: {event.location}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p>Start: {stringifyDateTime(event.start)}</p>
              <p>End: {stringifyDateTime(event.end)}</p>
              <p>Opening: {stringifyDateTime(event.openForRegistration)}</p>
            </div>
            <div>
              <TextInput
                label={'your email'}
                placeholder={'eksempel@bekk.no'}
                value={event.participants}
                onChange={participant => setParticipantEmail(participant)}
              />
              <button
                onClick={() => {
                  onChange(eventId, { participantEmail });
                }}
              >
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
