import React, { useState } from 'react';
import style from './ViewEventContainer.module.scss';
import { IDateTime } from 'src/types/date-time';
import { postParticipant } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString } from 'src/utils/timeleft';
import { TextInput } from '../Common/TextInput/TextInput';
import { useEvent } from 'src/hooks/eventHooks';
import { useParams } from 'react-router';
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

export const ViewEventContainer = () => {
  const { id } = useParams();
  const [event] = useEvent(id);
  const timeLeft = useTimeLeft(event);
  const [participant, setParticipant] = useState<
    Result<IEditParticipant, IParticipant>
  >(parseParticipant(initalParticipant));

  const addParticipant = async () => {
    if (isOk(participant)) {
      const addedParticipant = await postParticipant(participant.validValue);
      alert(
        `You are attending. Check your email, ${addedParticipant.email}, for confirmation`
      );
    }
  };

  if (!event) {
    return <div>Loading</div>;
  }
  return (
    <Page>
      <h1>{event.title}</h1>
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
        <Button onClick={() => addParticipant()}>I am going</Button>
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
