import React from 'react';
import { IEvent } from 'src/types/event';
import commonStyle from 'src/global/Common.module.scss';
import classNames from 'classnames';

interface IProps {
  event: IEvent;
  onClickRoute: string;
  delEvent: () => void;
}

export const EventListElement = ({
  event: { title },
  onClickRoute,
  delEvent,
}: IProps) => {
  return (
    <section className={classNames(commonStyle.row, commonStyle.subsection)}>
      <a href={onClickRoute}>
        <span>{title}</span>
      </a>
      <button onClick={delEvent}>SLETT MEG</button>
    </section>
  );
};
