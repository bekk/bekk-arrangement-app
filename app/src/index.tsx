import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  createRoute,
  eventsRoute,
  viewEventRoute,
  editRoute,
  cancelParticipantRoute,
} from './routing';
import { ViewEventsContainer } from './components/ViewEvents/ViewEventsContainer';
import 'src/extension-methods/array';
import './index.css';
import { EditEventContainer } from './components/EditEvent/EditEventContainer';
import { CreateEventContainer } from './components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from './components/ViewEvent/ViewEventContainer';
import { CancelParticipantContainer } from './components/CancelParticipant/CancelParticipant';

export const history = createBrowserHistory();

const App = () => {
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
        <Route exact path={cancelParticipantRoute}>
          <CancelParticipantContainer />
        </Route>
        <Redirect exact from={'/'} to={eventsRoute} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
