import { IParticipant } from './types/participant';
import { serializeEmail } from './types/email';

export const rootRoute = '/';
export const eventsRoute = '/events';
export const getViewEventRoute = (id: string) => `/events/${id}/edit`;
export const viewEventRoute = '/events/:id';
export const getEditEventRoute = (id: string | number) => `/events/${id}/edit`;
export const editRoute = '/events/:id/edit';
export const createRoute = '/events/create';
export const cancelParticipantRoute = '/:eventId/cancel/:participantEmail';
export const getCancelParticipantRoute = (participant: IParticipant) =>
  `/${participant.eventId}/cancel/${serializeEmail(participant.email)}`;
