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
  IEvent,
  initialEvent,
} from './types/event';
import { Menu } from './components/Common/Menu/Menu';
import 'src/extension-methods/array';
import './index.css';
import { compose } from './utils';
import { EditEvent } from './components/EditEvent/EditEvent';
import { Optional } from 'src/types';

export const history = createBrowserHistory();

const f = compose(parseEvent)(([id, e]) => {
  const ve = validateEvent(e);
  return [id, ve.data] as [number, Optional<IEvent>];
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
          <EventOverview events={events} delEvent={del} />
        </Route>
        <Route exact path={editRoute(':id')}>
          <Edit />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
