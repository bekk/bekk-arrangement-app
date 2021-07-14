import React from 'react';
import style from './PreviewEventContainer.module.scss';
import { Page } from 'src/components/Page/Page';
import { useNotification } from 'src/components/NotificationHandler/NotificationHandler';
import { useHistory } from 'react-router';
import { viewEventRoute, editEventRoute } from 'src/routing';
import { postEvent } from 'src/api/arrangementSvc';
import { ViewEvent } from 'src/components/ViewEvent/ViewEvent';
import { Button } from 'src/components/Common/Button/Button';
import { useSavedEditableEvents } from 'src/hooks/saved-tokens';
import { usePreviewEvent } from 'src/hooks/history';

export const PreviewNewEventContainer = () => {
  const { catchAndNotify } = useNotification();
  const history = useHistory();

  const { saveEditableEvent } = useSavedEditableEvents();

  const event = usePreviewEvent();
  if (!event) {
    return <div>Det finnes ingen event å forhåndsvise</div>;
  }

  const returnToCreate = () => {
    history.goBack();
  };

  const participantsText = `0 av ${
    event.maxParticipants === 0 ? '∞' : event.maxParticipants
  }${
    event.hasWaitingList && event.maxParticipants !== 0
      ? ' og 0 på venteliste'
      : ''
  }`;

  const postNewEvent = catchAndNotify(async () => {
    const editUrlTemplate =
      document.location.origin + editEventRoute('{eventId}', '{editToken}');
    const {
      event: { id },
      editToken,
    } = await postEvent(event, editUrlTemplate);
    saveEditableEvent({ eventId: id, editToken });
    history.push(viewEventRoute(id));
  });

  return (
    <Page>
      <h1 className={style.header}>Forhåndsvisning</h1>
      <div className={style.previewContainer}>
        <ViewEvent
          event={event}
          participantsText={participantsText}
          userCanEdit={false}
        />
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={returnToCreate} color="Primary">
          Rediger
        </Button>
        <Button onClick={postNewEvent}>Opprett arrangement</Button>
      </div>
    </Page>
  );
};
