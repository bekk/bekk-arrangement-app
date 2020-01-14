import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { createRoute, eventsRoute, viewEventRoute, editRoute } from './routing';
import { ViewEventsContainer } from './components/ViewEvents/ViewEventsContainer';
import 'src/extension-methods/array';
import './index.css';
import { EditEventContainer } from './components/EditEvent/EditEventContainer';
import { CreateEventContainer } from './components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from './components/ViewEvent/ViewEventContainer';
import { getConfig, setConfig } from './config';
import { useAuth0Redirect } from './auth';

export const history = createBrowserHistory();

const App = () => {
  useAuth0Redirect();
  return (
    <Router history={history}>
      <Switch>
        <Route path={createRoute}>
          <CreateEventContainer />
        </Route>
        <Route path={viewEventRoute} exact>
          <ViewEventContainer />
        </Route>
        <Route path={eventsRoute} exact>
          <ViewEventsContainer />
        </Route>
        <Route exact path={editRoute}>
          <EditEventContainer />
        </Route>
        <Redirect exact from={'/'} to={eventsRoute} />
      </Switch>
    </Router>
  );
};

const init = async () => {
  const config = await getConfig();
  setConfig(config);
  ReactDOM.render(<App />, document.getElementById('root'));
};

init();
