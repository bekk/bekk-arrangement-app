import React from 'react';
import { Link } from 'react-router-dom';
import { capitalize } from 'src/components/ViewEvent/ViewEvent';
import { editEventRoute, viewEventRoute } from 'src/routing';
import { IEvent } from 'src/types/event';
import { dateToITime, stringifyTime } from 'src/types/time';
import { stringifyTimeInstanceWithDayName } from 'src/types/time-instance';
import style from './EventCardElement.module.scss';
import { ReactChild } from 'src/types';

export type eventState =
  | 'Rediger'
  | 'Ikke åpnet'
  | 'Avsluttet'
  | 'Påmeldt'
  | 'På venteliste'
  | 'Plass'
  | 'Plass på venteliste'
  | 'loading'
  | undefined;
interface IProps {
  eventId: string;
  eventState: eventState;
  event: IEvent;
  numberOfAvailableSpots?: number;
  waitingListSpot?: number;
}

export const EventState = ({
  eventId,
  eventState,
  event,
  numberOfAvailableSpots,
  waitingListSpot,
}: IProps) => {
  switch (eventState) {
    case 'Rediger':
      return <LinkButton to={editEventRoute(eventId)}>Rediger</LinkButton>;

    case 'Ikke åpnet':
      const openForRegistrationTime = event.openForRegistrationTime;
      const dateTimeText = `${capitalize(
        stringifyTimeInstanceWithDayName(openForRegistrationTime)
      )}, ${stringifyTime(dateToITime(openForRegistrationTime))}`;
      return (
        <div className={style.stateText}>
          Påmelding åpner <br /> {dateTimeText}
        </div>
      );

    case 'Avsluttet':
      return <div className={style.stateText}>Arrangementet er avsluttet</div>;

    case 'Påmeldt':
      return <div className={style.test}>Du er påmeldt!</div>;

    case 'På venteliste':
      return (
        <div className={style.stateText}>
          Du er nr. {waitingListSpot} på venteliste
        </div>
      );

    case 'Plass':
      if (numberOfAvailableSpots !== undefined && numberOfAvailableSpots <= 5) {
        return (
          <div>
            <div className={style.stateText}>
              {numberOfAvailableSpots} plasser igjen!
            </div>
            <LinkButton to={viewEventRoute(eventId)}>Meld deg på</LinkButton>
          </div>
        );
      }
      return <LinkButton to={viewEventRoute(eventId)}>Meld deg på</LinkButton>;

    case 'Plass på venteliste':
      return (
        <div>
          <div className={style.stateText}>Arrangementet er fult.</div>
          <LinkButton to={viewEventRoute(eventId)}>
            Sett deg på venteliste
          </LinkButton>
        </div>
      );

    case 'loading':
      return <div>Laster</div>;

    case undefined:
      return null;
  }
};

const LinkButton = (props: { to: string; children: ReactChild }) => {
  return (
    <Link to={props.to} className={style.linkButton}>
      {props.children}
    </Link>
  );
};

const SmileIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0ZM12 22.8C6 22.8 1.2 18 1.2 12C1.2 6 6 1.2 12 1.2C18 1.2 22.9 6 22.9 12C22.9 18 18 22.8 12 22.8Z"
          fill="white"
        />
        <path
          d="M12.0001 17.3C10.2001 17.3 8.8001 15.8 8.8001 14.1H7.6001C7.6001 16.6 9.6001 18.5 12.0001 18.5C14.4001 18.5 16.4001 16.5 16.4001 14.1H15.2001C15.2001 15.9 13.8001 17.3 12.0001 17.3Z"
          fill="white"
        />
        <path
          d="M8.5 8C8.5 7.4 8 7 7.5 7C6.9 7 6.5 7.5 6.5 8C6.5 8.6 7 9 7.5 9C8.1 9.1 8.5 8.6 8.5 8Z"
          fill="white"
        />
        <path
          d="M16.5 9C17.0523 9 17.5 8.55228 17.5 8C17.5 7.44772 17.0523 7 16.5 7C15.9477 7 15.5 7.44772 15.5 8C15.5 8.55228 15.9477 9 16.5 9Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
