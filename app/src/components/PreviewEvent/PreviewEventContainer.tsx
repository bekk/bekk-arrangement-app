import React from 'react';
import style from './PreviewEventContainer.module.scss';
import { Page } from 'src/components/Page/Page';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { useHistory } from 'react-router';
import { useParam, useQuery } from 'src/utils/browser-state';
import { eventIdKey, editTokenKey, viewEventRoute } from 'src/routing';
import { putEvent } from 'src/api/arrangementSvc';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';
import { Button } from 'src/components/Common/Button/Button';
import { usePreviewEvent } from 'src/hooks/history';

export const PreviewEventContainer = () => {
  const { catchAndNotify } = useNotification();
  const history = useHistory();

  const eventId = useParam(eventIdKey);
  const editToken = useQuery(editTokenKey);
  const event = usePreviewEvent();
  if (!event) {
    return <div>Det finnes ingen event å forhåndsvise</div>;
  }

  const participantsText = `0 av ${event.maxParticipants === 0 ? '∞' : event.maxParticipants}${
    event.hasWaitingList && event.maxParticipants !== 0 ? ' og 0 på venteliste' : ''
  }`;

  const putEditedEvent = catchAndNotify(async () => {
    await putEvent(eventId, event, editToken);
    history.push(viewEventRoute(eventId));
  });

  return (
    <Page>
      <h1 className={style.header}>Forhåndsvisning</h1>
      <div className={style.previewContainer}>
        <ViewEvent event={event} participantsText={participantsText} />
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={putEditedEvent}>Oppdater arrangement</Button>
      </div>
    </Page>
  );
};
