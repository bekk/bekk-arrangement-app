import React from 'react';
import { capitalize } from 'src/components/ViewEvent/ViewEvent';
import { editEventRoute, viewEventRoute } from 'src/routing';
import { IEvent } from 'src/types/event';
import { dateToITime, stringifyTime } from 'src/types/time';
import { stringifyTimeInstanceWithDayName } from 'src/types/time-instance';
import style from './EventCardElement.module.scss';
import { SmileIcon } from 'src/components/Common/Icons/SmileIcon';
import { FrownyFaceIcon } from 'src/components/Common/Icons/FrownyFaceIcon';
import { LinkButton } from 'src/components/Common/LinkButton/LinkButton';

export type eventState =
  | 'Rediger'
  | 'Ikke åpnet'
  | 'Avsluttet'
  | 'Påmeldt'
  | 'På venteliste'
  | 'Plass'
  | 'Plass på venteliste'
  | 'Fullt'
  | 'Laster'
  | 'Avlyst'
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
      return (
        <div className={style.stateIconContainer}>
          <SmileIcon className={style.stateIcon} />
          Du er påmeldt!
        </div>
      );

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
          <div className={style.stateText}>Arrangementet er fullt.</div>
          <LinkButton to={viewEventRoute(eventId)}>
            Sett deg på venteliste
          </LinkButton>
        </div>
      );

    case 'Fullt':
      return <div className={style.stateText}>Arrangementet er fullt</div>;

    case 'Laster':
      return <div className={style.stateText}>Laster...</div>;

    case 'Avlyst':
      return (
        <div className={style.stateIconContainer}>
          <FrownyFaceIcon className={style.stateIcon}/>
          Avlyst
        </div>
      );

    case undefined:
      return null;
  }
};
