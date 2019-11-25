import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, useParams } from 'react-router-dom';
import './index.css';
import { createBrowserHistory } from 'history';
import { rootRoute, overviewRoute, editRoute } from './routing';
import { CreateEvent } from './components/CreateEvent/CreateEvent';
import { EventOverview } from './components/EventOverview/EventOverview';
import { useCrud } from './api/crud-hook';
import {
  fromViewModel,
  toWriteModel,
  IEvent,
  createInitalEvent,
} from './types/event';
import 'src/extension-methods/array';
import { WithId } from './types';

export const history = createBrowserHistory();

const EditEvent = ({ events, update }: any) => {
  const { id } = useParams();
  const event = events.find((x: WithId<IEvent>) => x.id === Number(id));
  return event ? (
    <CreateEvent createOrUpdate={update(id)} event={event} />
  ) : null;
};

const App = () => {
  const { collection: events, create, update, del } = useCrud({
    endpoint: (id?: number) => `/events${id ? `/${id}` : ''}`,
    fromViewModel,
    toWriteModel,
  });
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={rootRoute}>
          <CreateEvent createOrUpdate={create} event={createInitalEvent()} />
        </Route>
        <Route path={overviewRoute}>
          <EventOverview events={events} />
        </Route>
        <Route exact path={editRoute}>
          <EditEvent events={events} update={update} />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
