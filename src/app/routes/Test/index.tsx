import * as React from 'react';
import { Helmet } from 'react-helmet';

export default () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Title</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>4214124</div>
    </div>
  );
};
