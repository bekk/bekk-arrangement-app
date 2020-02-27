import React from 'react';
import { IEvent } from 'src/types/event';
import style from './PreviewEventContainer.module.scss';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';

interface IProps {
  event: IEvent;
}

export const PreviewEventContainer = ({ event }: IProps) => {
  const participantsText = `0 av ${event.maxParticipants ?? '∞'}`;

  return (
    <>
      <h1 className={style.header}>Forhåndsvisning</h1>
      <div className={style.previewContainer}>
        <ViewEvent event={event} participantsText={participantsText} />
      </div>
    </>
  );
};
