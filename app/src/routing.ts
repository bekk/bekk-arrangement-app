import queryString from 'query-string';

export const eventId = ':eventId';
export const email = ':email';

export const rootRoute = '/';
export const eventsRoute = '/events';
export const viewEventRoute = (eventId: string) => `/events/${eventId}`;
export const editEventRoute = (eventId: string) => `/events/${eventId}/edit`;
export const createRoute = '/events/create';
export const cancelParticipantRoute = ({
  eventId,
  email,
  cancellationToken,
}: {
  eventId: string;
  email: string;
  cancellationToken?: string | null;
}) =>
  `/${eventId}/cancel/${email}?${queryString.stringify({ cancellationToken })}`;
