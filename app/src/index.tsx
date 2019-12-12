import React, { createContext, useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  rootRoute,
  overviewRoute,
  editRoute,
  createRoute,
  eventsRoute,
  viewEventRoute,
} from './routing';
import { EventOverview } from './components/EventOverview/EventOverview';
import 'src/extension-methods/array';
import './index.css';
import { EditEvent } from './components/EditEvent/EditEvent';
import { StoreProvider } from './store';
import { CreateEvent } from './components/CreateEvent/CreateEvent';
import { ViewEvent } from './components/ViewEvent/ViewEvent';

export const history = createBrowserHistory();

const App = () => {
  return (
    <StoreProvider>
      <Router history={history}>
        <Switch>
          {/* <Route exact path={rootRoute}>
            <EditEvent />
          </Route> */}
          <Route path={createRoute}>
            <CreateEvent />
          </Route>
          <Route path={viewEventRoute} exact={true}>
            <ViewEvent />
          </Route>
          {/* <Route exact path={editRoute(':id')}>
            <Edit />
          </Route> */}
        </Switch>
      </Router>
    </StoreProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
