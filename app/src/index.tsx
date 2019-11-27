import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, useParams } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { rootRoute, overviewRoute, editRoute } from './routing';
import { EventOverview } from './components/EventOverview/EventOverview';
import { useCrud } from './api/crud-hook';
import {
  serializeEvent,
  parseEvent,
  validateEvent,
  IWriteModel,
  IViewModel,
  IEditEvent,
  IEvent,
  initialEvent,
} from './types/event';
import { Menu } from './components/Common/Menu/Menu';
import 'src/extension-methods/array';
import './index.css';
import { compose } from './utils';
import { EditEvent } from './components/EditEvent/EditEvent';

export const history = createBrowserHistory();

const f = compose(parseEvent)(([id, e]) => {
  const ve = validateEvent(e);
  return [id, ve.data] as [number, IEvent | undefined];
});

const App = () => {
  const { collection: events, create, update, del } = useCrud({
    endpoint: (id?: number) => `/events${id ? `/${id}` : ''}`,
    fromViewModel: f,
    toWriteModel: serializeEvent,
  });

  const Edit = () => {
    const { id } = useParams();
    const event = events.get(Number(id));
    return (
      <>
        <Menu tab={'edit'} />
        {event ? (
          <EditEvent onChange={update(Number(id))} event={event} />
        ) : null}
      </>
    );
  };

  return (
    <Router history={history}>
      <Switch>
        <Route exact path={rootRoute}>
          <Menu tab={'create'} />
          <EditEvent onChange={create} event={initialEvent} />
        </Route>
        <Route path={overviewRoute}>
          <EventOverview events={events} />
        </Route>
        <Route exact path={editRoute}>
          <Edit />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
