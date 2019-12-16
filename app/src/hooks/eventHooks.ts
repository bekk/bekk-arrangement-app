import { useStore, Actions } from 'src/store';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { getEvent } from 'src/api/arrangementSvc';
import { IEvent } from 'src/types/event';
import { WithId } from 'src/types';

export const useEvent = (): [
  WithId<IEvent> | undefined,
  (action: Actions) => void
] => {
  const { state, dispatch } = useStore();
  const { id } = useParams();
  const event = state.events.find(e => e.id === id);

  useEffect(() => {
    if (!event && id) {
      const get = async () => {
        const retrievedEvent = await getEvent(id);
        dispatch({ type: 'ADD_EVENT', event: retrievedEvent });
      };
      get();
    }
  }, [id, event]);

  return [event, dispatch];
};
