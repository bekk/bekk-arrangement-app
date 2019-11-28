import React from 'react';
import { IEvent } from 'src/types/event';
import { stringifyDateTime } from 'src/types/date-time';

interface Props {
  event: IEvent;
  editRoute: string;
  delEvent: () => void;
}

export const Event = ({
  event: { title, description, location, start, end, openForRegistration },
  editRoute,
  delEvent,
}: Props) => {
  return (
    <>
      <a href={editRoute}>
        <p>{title}</p>
        <p>{description}</p>
        <p>{location}</p>
        <p>{stringifyDateTime(start)}</p>
        <p>{stringifyDateTime(end)}</p>
        <p>{stringifyDateTime(openForRegistration)}</p>
      </a>
      <div onClick={delEvent}>SLETT MEG</div>
    </>
  );
};
