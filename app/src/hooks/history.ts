import { useHistory } from 'react-router';
import { IEvent } from 'src/types/event';
import { Optional } from 'src/types';

export const useGotoEventPreview = (path: string) => {
  const history = useHistory();
  return (event: IEvent) => history.push(path, event);
};

export const usePreviewEvent = () => {
  const history = useHistory();
  return history.location.state as Optional<IEvent>;
};
