import { useAuth0Redirect } from 'src/auth';
import { Router, Switch, Route, Redirect } from 'react-router';
import React from 'react';
import { Header } from 'src/components/Common/Header/Header';
import {
  createRoute,
  viewEventRoute,
  eventsRoute,
  cancelParticipantRoute,
  emailKey,
  eventIdKey,
  editEventRoute,
  confirmParticipantRoute,
  previewEventRoute,
  rootRoute,
  previewNewEventRoute,
} from 'src/routing';
import { CreateEventContainer } from 'src/components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { ViewEventsContainer } from 'src/components/ViewEvents/ViewEventsContainer';
import { EditEventContainer } from 'src/components/EditEvent/EditEventContainer';
import { CancelParticipant } from 'src/components/CancelParticipant/CancelParticipant';
import { createBrowserHistory } from 'history';
import style from './App.module.scss';
import { ConfirmParticipant } from '../ConfirmParticipant/ConfirmParticipant';
import { PreviewEventContainer } from 'src/components/PreviewEvent/PreviewEventContainer';
import { PreviewNewEventContainer } from 'src/components/PreviewEvent/PreviewNewEventContainer';

const history = createBrowserHistory();

export const App = () => {
  useAuth0Redirect();
  return (
    <Router history={history}>
      <div className={style.container}>
        <Header />
        <Switch>
          <Route exact path={createRoute}>
            <CreateEventContainer />
          </Route>
          <Route exact path={viewEventRoute(eventIdKey)}>
            <ViewEventContainer />
          </Route>
          <Route exact path={eventsRoute}>
            <ViewEventsContainer />
          </Route>
          <Route exact path={editEventRoute(eventIdKey)}>
            <EditEventContainer />
          </Route>
          <Route exact path={previewNewEventRoute}>
            <PreviewNewEventContainer />
          </Route>
          <Route exact path={previewEventRoute(eventIdKey)}>
            <PreviewEventContainer />
          </Route>
          <Route
            exact
            path={cancelParticipantRoute({
              eventId: eventIdKey,
              email: emailKey,
            })}
          >
            <CancelParticipant />
          </Route>
          <Route
            exact
            path={confirmParticipantRoute({
              eventId: eventIdKey,
              email: emailKey,
            })}
          >
            <ConfirmParticipant />
          </Route>
          <Redirect exact from={rootRoute} to={eventsRoute} />
        </Switch>
      </div>
    </Router>
  );
};
