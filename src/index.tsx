import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'mobx-react';

import App from '@containers';
import registerServiceWorker from './registerServiceWorker';

import '@styles/index.less';

import rootStores from '@stores';

ReactDOM.render(
  <Router>
    <Provider { ...rootStores }>
      <App />
    </Provider>
  </Router>
  ,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
