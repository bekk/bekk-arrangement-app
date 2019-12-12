import React, { useEffect, useState } from 'react';
import { useStore } from 'src/store';
import { useParams } from 'react-router';
import commonStyle from 'src/global/Common.module.scss';
import { IDateTime } from 'src/types/date-time';
import { getEvent } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString, calculateTimeLeft, ITimeLeft } from 'src/ùtils/timeleft';
import { IEvent } from 'src/types/event';
import { TextInput } from '../Common/TextInput/TextInput';

const useEvent = () => {
  const { state, dispatch } = useStore();
  const { id } = useParams();
  const eventInState = state.events.find(e => e.id === id);

  useEffect(() => {
    if (!eventInState && id) {
      const get = async () => {
        const event = await getEvent(id);
        dispatch({ type: 'ADD_EVENT', event });
      };
      get();
    }
  }, [id, eventInState]);

  return eventInState;
};

const useTimeLeft = (event: IEvent | undefined) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 365,
    hours: 0,
    minutes: 0,
    seconds: 0,
    difference: 1,
  });

  useEffect(() => {
    setTimeout(() => {
      if (event) {
        setTimeLeft(calculateTimeLeft(event.openForRegistration));
      }
    }, 1000);
  });
  return timeLeft;
};

export const ViewEvent = () => {
  const event = useEvent();
  const timeLeft = useTimeLeft(event);

  if (!event) {
    return <div>Loading</div>;
  }
  return (
    <article className={commonStyle.container}>
      <section className={commonStyle.content}>
        <h1>{event.title}</h1>
        <section>
          <ReadableDate startDate={event.start} endDate={event.end} />
        </section>
        <section>Location: {event.location}</section>
        <section className={commonStyle.subsection}>
          {event.description}
        </section>
      </section>
      <Registration timeleft={timeLeft} />
    </article>
  );
};

interface IRegistrationProps {
  timeleft: ITimeLeft;
}

const Registration = ({ timeleft }: IRegistrationProps) => {
  const [email, setEmail] = useState('');
  return (
    <section className={commonStyle.column}>
      <section className={commonStyle.column}>
        <TextInput
          label={'Email'}
          value={email}
          placeholder={'email'}
          onChange={setEmail}
        />
      </section>
      {timeleft.difference > 0 ? (
        <section className={commonStyle.row}>
          <button>Closed</button>
          <p>Opens in {asString(timeleft)}</p>
        </section>
      ) : (
        <button>Attend</button>
      )}
    </section>
  );
};

interface IReadableDateProps {
  startDate: IDateTime;
  endDate: IDateTime;
}

const ReadableDate = ({ startDate, endDate }: IReadableDateProps) => {
  if (isSameDate(startDate.date, endDate.date)) {
    return (
      <p>
        {dateAsText(startDate.date)} <br />
        from {stringifyTime(startDate.time)} to {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p>
      From {dateAsText(startDate.date)} {stringifyTime(startDate.time)} <br />
      To {dateAsText(endDate.date)} {stringifyTime(endDate.time)}
    </p>
  );
};
