import { queryStringStringify } from 'src/utils/query-string';

export const eventId = ':eventId';
export const email = ':email';

export const rootRoute = '/';
export const eventsRoute = '/events';
export const viewEventRoute = (eventId: string) => `/events/${eventId}`;
export const editEventRoute = (eventId: string, editToken?: string) =>
  `/events/${eventId}/edit${queryStringStringify({ editToken })}`;

export const createRoute = '/events/create';
export const confirmParticipantRoute = ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => `/${eventId}/confirm/${email}`;
export const cancelParticipantRoute = ({
  eventId,
  email,
  cancellationToken,
}: {
  eventId: string;
  email: string;
  cancellationToken?: string;
}) =>
  `/${eventId}/cancel/${email}${queryStringStringify({ cancellationToken })}`;
