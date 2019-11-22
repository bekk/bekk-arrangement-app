import React from 'react';
import { IEvent } from 'src/types/event';
import { WithId, stringifyTime } from 'src/types';
import { stringifyDate } from 'src/types/date';

export const Event = ({
  title,
  description,
  location,
  openForRegistrationTime,
  openForRegistrationDate,
  startDate,
  startTime,
  endDate,
  endTime,
}: WithId<IEvent>) => {
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>{location}</p>
      <p>
        {stringifyDate(startDate)} - {stringifyTime(startTime)}
      </p>
      <p>
        {stringifyDate(endDate)} - {stringifyTime(endTime)}
      </p>
    </div>
  );
};
