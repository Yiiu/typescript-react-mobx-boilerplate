import * as express from 'express';
import * as React from 'react';

// import { Provider } from 'mobx-react';

import { renderToString } from 'react-dom/server';

import Html from '@containers/Html';

import * as appConfig from '../config';

const app = express();

app.get('*', (req, res) => {
  res.status(200).send(
    renderToString(
      <Html>
        <div>sdfasdf</div>
      </Html>
    )
  );
});

app.listen(appConfig.port as any, appConfig.host, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${appConfig.host}:${appConfig.port}\n`);
  }
});
