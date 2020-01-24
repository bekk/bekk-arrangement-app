import React, { useState } from 'react';
import style from './ViewEventContainer.module.scss';
import { IDateTime } from 'src/types/date-time';
import { postParticipant } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString } from 'src/utils/timeleft';
import { TextInput } from '../Common/TextInput/TextInput';
import { useEvent } from 'src/hooks/eventHooks';
import { useParams, useHistory } from 'react-router';
import { ValidationResult } from '../Common/ValidationResult/ValidationResult';
import {
  IParticipant,
  IEditParticipant,
  parseParticipant,
  initalParticipant,
} from 'src/types/participant';
import { Result, isOk } from 'src/types/validation';
import { useTimeLeft } from 'src/hooks/timeleftHooks';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';
import { getCancelParticipantRoute } from 'src/routing';

export const ViewEventContainer = () => {
  const { id } = useParams();
  const [event] = useEvent(id);
  const timeLeft = useTimeLeft(event);
  const eventId = id ? id : '0';
  const [participant, setParticipant] = useState<
    Result<IEditParticipant, IParticipant>
  >(parseParticipant({ ...initalParticipant, eventId }));
  const history = useHistory();

  const addParticipant = async () => {
    if (isOk(participant)) {
      await postParticipant(participant.validValue);
      history.push(getCancelParticipantRoute(participant.validValue));
    }
  };

  if (!event) {
    return <div>Loading</div>;
  }
  return (
    <Page>
      <h1 className={style.header}>{event.title}</h1>
      <DateSection startDate={event.start} endDate={event.end} />
      <div>Location: {event.location}</div>
      <div className={style.subsection}>{event.description}</div>
      <TextInput
        label={'Email'}
        value={participant.editValue.email}
        placeholder={'email'}
        onChange={(email: string) =>
          setParticipant(parseParticipant({ ...participant.editValue, email }))
        }
      />
      <ValidationResult validationResult={participant.errors} />
      {timeLeft.difference > 0 ? (
        <>
          <div>Closed</div>
          <p>Opens in {asString(timeLeft)}</p>
        </>
      ) : (
        <Button onClick={() => addParticipant()}>Meld meg på</Button>
      )}
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
