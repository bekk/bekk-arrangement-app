import { useAuth0Redirect } from 'src/auth';
import { Router, Switch, Route, Redirect } from 'react-router';
import React from 'react';
import { Header } from 'src/components/Common/Header/Header';
import {
  createRoute,
  viewEventRoute,
  eventsRoute,
  cancelParticipantRoute,
  email,
  eventId,
  editEventRoute,
  confirmParticipantRoute,
} from 'src/routing';
import { CreateEventContainer } from 'src/components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { ViewEventsContainer } from 'src/components/ViewEvents/ViewEventsContainer';
import { EditEventContainer } from 'src/components/EditEvent/EditEventContainer';
import { CancelParticipant } from 'src/components/CancelParticipant/CancelParticipant';
import { createBrowserHistory } from 'history';
import style from './App.module.scss';
import { ConfirmParticipant } from '../ConfirmParticipant/ConfirmParticipant';

const history = createBrowserHistory();

export const App = () => {
  useAuth0Redirect();
  return (
    <Router history={history}>
      <div className={style.container}>
        <Header />
        <Switch>
          <Route path={createRoute}>
            <CreateEventContainer />
          </Route>
          <Route path={viewEventRoute(eventId)} exact>
            <ViewEventContainer />
          </Route>
          <Route path={eventsRoute} exact>
            <ViewEventsContainer />
          </Route>
          <Route exact path={editEventRoute(eventId)}>
            <EditEventContainer />
          </Route>
          <Route
            exact
            path={cancelParticipantRoute({
              eventId,
              email,
            })}
          >
            <CancelParticipant />
          </Route>
          <Route exact path={confirmParticipantRoute({ eventId, email })}>
            <ConfirmParticipant />
          </Route>
          <Redirect exact from={'/'} to={eventsRoute} />
        </Switch>
      </div>
    </Router>
  );
};
