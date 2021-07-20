import React, { useState } from 'react';
import { getEventIdByShortname } from 'src/api/arrangementSvc';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { useEffectOnce } from 'src/hooks/utils';
import { eventIdKey, shortnameKey } from 'src/routing';
import { useParam } from 'src/utils/browser-state';
import style from './ViewEventContainer.module.scss';

export const ViewEventContainerRegularRoute = () => {
  const eventId = useParam(eventIdKey);
  return <ViewEventContainer eventId={eventId} />;
};

export const ViewEventShortnameRoute = () => {
  const shortname = useParam(shortnameKey);

  const [eventId, setEventId] = useState<string | null>();
  useEffectOnce(async () => {
    try {
      const eventId = await getEventIdByShortname(shortname);
      setEventId(eventId);
    } catch {
      setEventId(null);
    }
  });

  if (eventId === undefined) {
    return null;
  }

  if (eventId === null) {
    return (
      <div className={style.fourOhFour}>
        <div>
          <span>404</span> Det finnes ingen arrangement med navn "{shortname}"
        </div>
      </div>
    );
  }

  return <ViewEventContainer eventId={eventId} />;
};
