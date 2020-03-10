import React from 'react';
import {
  IEditEvent,
  initialEvent,
  toEditEvent,
  parseEditEvent,
} from 'src/types/event';
import { eventsRoute, previewNewEventRoute } from 'src/routing';
import { useAuthentication } from 'src/auth';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { EditEvent } from 'src/components/EditEvent/EditEvent/EditEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import style from './CreateEventContainer.module.scss';
import { isValid, IError } from 'src/types/validation';
import { usePersistentHistoryState } from 'src/utils/browser-state';
import { useGotoEventPreview } from 'src/hooks/history';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = usePersistentHistoryState<IEditEvent>(
    toEditEvent(initialEvent())
  );
  const validEvent = validateEvent(event);

  const gotoPreview = useGotoEventPreview(previewNewEventRoute);

  const redirectToPreview =
    validEvent &&
    (() => {
      gotoPreview(validEvent);
    });

  return (
    <Page>
      <h1 className={style.header}>Opprett arrangement</h1>
      <EditEvent eventResult={event} updateEvent={setEvent} />
      <div className={style.buttonContainer}>
        {redirectToPreview && (
          <Button onClick={redirectToPreview} disabled={false}>
            Forhåndsvisning
          </Button>
        )}
        <BlockLink to={eventsRoute}>Avbryt</BlockLink>
      </div>
    </Page>
  );
};

const validateEvent = (event: IEditEvent) => {
  if (event) {
    const validEvent = parseEditEvent(event);
    if (isValid(validEvent)) {
      return validEvent;
    }
  }
};
