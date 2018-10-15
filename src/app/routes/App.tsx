import * as React from 'react';
import * as Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';

const Indexs = Loadable({
  loader: () => import('./Index/index'),
  loading: () => <div>testsLoading</div>,
  modules: ['./Index/index'],
  webpack: () => [(require as any).resolveWeak('./Index/index')],
});

const Test = Loadable({
  loader: () => import('./Test/index'),
  loading: () => <div>testsLoading</div>,
  modules: ['./Test/index'],
  webpack: () => [(require as any).resolveWeak('./Test/index')],
});

const B = Loadable({
  loader: () => import('./b/index'),
  loading: () => <div>testsLoading</div>,
  modules: ['./b/index'],
  webpack: () => [(require as any).resolveWeak('./b/index')],
});

export default class App extends React.Component {
  public render () {
    return (
      <div>
        <Switch>
          <Route component={Indexs} path="/" exact/>
          <Route component={Test} path="/aaa" exact/>
          <Route component={B} path="/b" exact/>
        </Switch>
      </div>
    );
  }
}
