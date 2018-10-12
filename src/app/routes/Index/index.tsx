import * as React from 'react';
import { Link } from 'react-router-dom';

import { inject, observer } from 'mobx-react';

import { COUNT_ROUTER } from '@constants/stores';
import { CountStore } from '@stores';

import styles from './App.css';
import logo from './logo.svg';

export interface IndexProp {
  [COUNT_ROUTER]: CountStore;
}

@inject(COUNT_ROUTER)
@observer
export default class Index extends React.Component<any> {
  public componentDidMount() {
    console.log(412412);
  }
  public render() {
    return (
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt="logo" />
          <h1 className={styles['App-title']}>Welcomes to React</h1>
        </header>
        <p className={styles['App-intro']}>
          To get startessd,  <code>src/App.tsx</code> and save to reload.
        </p>
        <Link to="/aaa">asdf4444</Link>
        <div>{ this.props[COUNT_ROUTER].count }</div>
        <button onClick={this.props[COUNT_ROUTER].addCount}>+</button>
        <button onClick={this.props[COUNT_ROUTER].reduceCount}>-</button>
      </div>
    );
  }
}
