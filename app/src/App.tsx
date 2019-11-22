import React from 'react';
import { CreateEvent } from './components/CreateEvent/CreateEvent';
import { EventOverview } from './components/EventOverview/EventOverview';
import { Switch, Route } from 'react-router';
import { rootRoute, overviewRoute } from './routing';

const App = () => {
  return (
    <Switch>
      <Route exact path={rootRoute} component={CreateEvent} />
      <Route path={overviewRoute} component={EventOverview} />
    </Switch>
  );
};

export default App;
