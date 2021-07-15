import { queryStringStringify } from 'src/utils/browser-state';

export const eventIdKey = 'eventId';
export const emailKey = 'email';
export const editTokenKey = 'editToken';
export const cancellationTokenKey = 'cancellationToken';

export const rootRoute = '/';
export const eventsRoute = '/events';
export const createRoute = '/events/create';
export const previewNewEventRoute = `/events/create/preview`;

export const viewEventRoute = (eventId: string) => `/events/${eventId}`;

export const editEventRoute = (eventId: string, editToken?: string) =>
  `/events/${eventId}/edit${queryStringStringify({
    [editTokenKey]: editToken,
  })}`;

export const previewEventRoute = (eventId: string) =>
  `/events/${eventId}/preview`;

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
  `/${eventId}/cancel/${email}${queryStringStringify({
    [cancellationTokenKey]: cancellationToken,
  })}`;

// This function needs to be refactord if the routes above changes
// location is a datastructure from react-router with PIA types
export const shouldHaveBlackHeaderBackground = (location: any) =>
  location.pathname === eventsRoute ||
  location.pathname.split('/')[3] === 'edit' ||
  location.pathname.split('/')[3] === 'preview';
