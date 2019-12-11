import React from 'react';
import { Menu } from '../Common/Menu/Menu';
import { IEvent } from 'src/types/event';
import { IRegistration } from 'src/types/registration';
import { RegisterEvent } from './RegisterEvent';

interface Props {
  events: Map<number, IEvent>;
  onChange: (eventId: number, registration: IRegistration) => Promise<void>;
}

export const RegisterForEvent = ({ events, onChange }: Props) => {
  
  return (
    <div>
      <Menu tab={'registration'} />
      <h1>Register for an event</h1>
      <div>
        {events.map((event, eventId) => (
          <RegisterEvent event={event} eventId={eventId} onChange={onChange}/>
        ))}
      </div>
    </div>
  );
};
