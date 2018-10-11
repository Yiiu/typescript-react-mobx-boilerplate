import { Request, Response } from 'express';
import * as React from 'react';
import { StaticRouter } from 'react-router';

import { Provider } from 'mobx-react';
import { renderToString } from 'react-dom/server';

import App from '@containers';
import Html from '@containers/Html';

import { createStore } from '@stores';

export default (req: Request, res: Response) => {
  const newStores = createStore();
  const Router = StaticRouter as any;
  const markup = renderToString(
    <Router location={req.url} content={{}}>
      <Provider { ...newStores }>
        <App/>
      </Provider>
    </Router>
  );
  res.status(200).send(
    renderToString(
      <Html markup={markup} />
    )
  );
};
