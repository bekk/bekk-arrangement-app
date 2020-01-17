import React from 'react';
import { IEvent } from 'src/types/event';
import commonStyle from 'src/style/Common.module.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface IProps {
  event: IEvent;
  onClickRoute: string;
  delEvent: () => void;
}

export const EventListElement = ({ event, onClickRoute, delEvent }: IProps) => {
  return (
    <section className={classNames(commonStyle.row, commonStyle.subsection)}>
      <Link to={onClickRoute}>
        <span>{event.title}</span>
      </Link>
      <button onClick={delEvent}>SLETT MEG</button>
    </section>
  );
};
