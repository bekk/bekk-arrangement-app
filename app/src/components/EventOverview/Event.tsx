import React from 'react';
import { IEvent } from 'src/types/event';
import { stringifyDateTime } from 'src/types/date-time';

export const Event = ({
  title,
  description,
  location,
  start,
  end,
  openForRegistration,
}: IEvent) => {
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>{location}</p>
      <p>{stringifyDateTime(start)}</p>
      <p>{stringifyDateTime(end)}</p>
      <p>{stringifyDateTime(openForRegistration)}</p>
    </div>
  );
};
