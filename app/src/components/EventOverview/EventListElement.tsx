import React from 'react';
import { IEvent } from 'src/types/event';
import { stringifyDateTime } from 'src/types/date-time';

interface IProps {
  event: IEvent;
  editRoute: string;
  delEvent: () => void;
}

export const EventListElement = ({
  event: { title, description, location, start, end, openForRegistration },
  editRoute,
  delEvent,
}: IProps) => {
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
