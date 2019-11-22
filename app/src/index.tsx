import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import './index.css';
import { createBrowserHistory } from 'history';
import { rootRoute, overviewRoute } from './routing';
import { CreateEvent } from './components/CreateEvent/CreateEvent';
import { EventOverview } from './components/EventOverview/EventOverview';
import { useCrud } from './api/crud-hook';
import { fromViewModel, toWriteModel } from './types/event';
import 'src/extension-methods/array';

export const history = createBrowserHistory();

const App = () => {
  const { collection: events, create, update, del } = useCrud({
    endpoint: (id?: number) => `/events${id ? `${id}` : ''}`,
    fromViewModel,
    toWriteModel,
  });
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={rootRoute}>
          <CreateEvent create={create} />
        </Route>
        <Route path={overviewRoute}>
          <EventOverview events={events} />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
