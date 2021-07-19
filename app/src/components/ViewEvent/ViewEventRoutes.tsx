import React, { useState } from 'react';
import { getEventIdByShortname } from 'src/api/arrangementSvc';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { useEffectOnce } from 'src/hooks/utils';
import { eventIdKey, shortnameKey } from 'src/routing';
import { useParam } from 'src/utils/browser-state';

export const ViewEventContainerRegularRoute = () => {
  const eventId = useParam(eventIdKey);
  return <ViewEventContainer eventId={eventId} />;
};

export const ViewEventShortnameRoute = () => {
  const shortname = useParam(shortnameKey);

  const [eventId, setEventId] = useState<string>();
  useEffectOnce(async () => {
    const eventId = await getEventIdByShortname(shortname);
    setEventId(eventId);
  });

  if (eventId === undefined) {
    return null;
  }

  return <ViewEventContainer eventId={eventId} />;
};
