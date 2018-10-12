import { Request } from 'express';
import * as React from 'react';
import { StaticRouter } from 'react-router';

import { Provider } from 'mobx-react';
import { renderToString } from 'react-dom/server';

import App from '@containers';
import Html from '@containers/Html';

import { createStore } from '@stores';

export default (req: Request) => {
  const newStores = createStore();
  const Router = StaticRouter as any;
  const markup = renderToString(
    <Router location={req.url} content={{}}>
      <Provider { ...newStores }>
        <App />
      </Provider>
    </Router>
  );
  return renderToString(
    <Html markup={markup} />
  );
};
