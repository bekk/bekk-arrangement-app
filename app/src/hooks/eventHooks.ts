import { useStore } from 'src/store';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { getEvent } from 'src/api/arrangementSvc';

export const useEvent = () => {
  const { state, dispatch } = useStore();
  const { id } = useParams();
  const eventInState = state.events.find(e => e.id === id);

  useEffect(() => {
    if (!eventInState && id) {
      const get = async () => {
        const event = await getEvent(id);
        dispatch({ type: 'ADD_EVENT', event });
      };
      get();
    }
  }, [id, eventInState]);

  return eventInState;
};
