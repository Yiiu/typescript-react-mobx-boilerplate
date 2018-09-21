import * as React from 'react';

import { inject, observer } from 'mobx-react';

import { COUNT_ROUTER } from '@constants/stores';
import { CountStore } from '@stores';

import './App.css';
import logo from './logo.svg';

export interface IndexProp {
  [COUNT_ROUTER]: CountStore;
}

@inject(COUNT_ROUTER)
@observer
export default class App extends React.Component<IndexProp> {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>{ this.props[COUNT_ROUTER].count }</div>
        <button onClick={this.props[COUNT_ROUTER].addCount}>+</button>
        <button onClick={this.props[COUNT_ROUTER].reduceCount}>-</button>
      </div>
    );
  }
}
