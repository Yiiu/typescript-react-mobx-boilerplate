import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Index from './Index/index';

export default class App extends React.Component {
  public render () {
    return (
      <div>
        <Switch>
          <Route component={Index} path="/" exact/>
        </Switch>
      </div>
    );
  }
}