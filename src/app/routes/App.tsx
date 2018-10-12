import * as React from 'react';
import * as Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

const Index = Loadable({
  loader: () => import(/* webpackChunkName: "router_index" */'./Index/index'),
  loading: () => <div>loading</div>,
  modules: ['./Index/index'],
  // webpack: () => [(require as any).resolveWeak('./Index/index')],
});
const Test = Loadable({
  loader: () => import(/* webpackChunkName: "router_test" */'./Test/index'),
  loading: () => <div>loading</div>,
  modules: ['./Index/index']
});

export default class App extends React.Component {
  public render () {
    return (
      <div>
        <Switch>
          <Route component={Index} path="/" exact/>
          <Route component={Test} path="/aaa" exact/>
        </Switch>
      </div>
    );
  }
}
