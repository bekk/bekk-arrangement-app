export const rootRoute = '/';
export const eventsRoute = '/events';
export const getViewEventRoute = (id: string) => `events/${id}`;
export const viewEventRoute = '/events/:id';
export const getEditEventRoute = (id: string | number) => `events/${id}/edit`;
export const editRoute = '/events/:id/edit';
export const createRoute = '/create';
