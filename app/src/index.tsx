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
import { Header } from './components/Common/Header/Header';
import commonStyle from 'src/style/Common.module.scss';

export const history = createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
      <div className={commonStyle.container}>
        <Header />
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
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
