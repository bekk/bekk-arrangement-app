import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { IEvent } from './types/event';
import { WithId } from './types';

interface IState {
  events: WithId<IEvent>[];
}

export type Actions =
  | AddEventAction
  | EditEventAction
  | DeleteEventAction
  | SetEventsAction;

type AddEventAction = {
  type: 'ADD_EVENT';
  event: WithId<IEvent>;
};

type EditEventAction = {
  type: 'EDIT_EVENT';
  event: WithId<IEvent>;
};

type DeleteEventAction = {
  type: 'DELETE_EVENT';
  id: string;
};

type SetEventsAction = {
  type: 'SET_EVENTS';
  events: WithId<IEvent>[];
};

const initialState: IState = {
  events: [],
};

const reducer = (state: IState, action: Actions): IState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        events: [...state.events, action.event],
      };
    case 'SET_EVENTS':
      return {
        events: action.events,
      };
    case 'EDIT_EVENT':
      return {
        events: [...state.events, action.event],
      };
    case 'DELETE_EVENT':
      return {
        events: state.events.filter(x => x.id !== action.id),
      };
    default:
      throw new Error(`Unhandled action: ${action}`);
  }
};

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

interface IContextProps {
  state: IState;
  dispatch: (action: Actions) => void;
}

const StoreContext = createContext<IContextProps>({} as IContextProps);

export const StoreProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
