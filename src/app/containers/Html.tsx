import * as React from 'react';
import { Helmet } from 'react-helmet';

import '@styles/index.less';
export interface IHtmlProps {
  markup: string;
}

export default class Html extends React.PureComponent<IHtmlProps> {
  public render() {
    const { markup } = this.props;
    const helmet = Helmet.renderStatic();
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    return (
      <html {...htmlAttrs}>
        <head>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          <title>Isomorphic Redux Example</title>
          <link rel="stylesheet" type="text/css" href="/public/static/css/main.css" />
        </head>
        <body {...bodyAttrs}>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}} />
          <script src="/public/static/js/bundle.js" />
        </body>
      </html>
    );
  }
}
