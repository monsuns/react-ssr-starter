/* eslint-disable no-console, no-use-before-define */
import "babel-polyfill";
import path from 'path';
import fs from 'fs';
import Express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {match, RouterContext, createMemoryHistory} from "react-router";

import routes from "../src/routes";
import configureStore from "../src/store/configureStore";

import webpack from 'webpack';
import webpackConfig from '../config/webpack.config.babel';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = new Express();
const port = 8080;
const assetsPath = "";
if(process.env.NODE_ENV === "local"){
  // Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {noInfo: true,publicPath: webpackConfig.output.publicPath}));
  app.use(webpackHotMiddleware(compiler));
}
app.use(Express.static(path.join(__dirname, "../dist")));
app.use(Express.static(path.join(__dirname, "../statics")));

// This is fired every time the server side receives a request
app.use(handleRender);
function handleRender(req, res) {
  const history = createMemoryHistory();
  const store = configureStore(history);
  match({routes, location: req.url}, (error, redirectLocation, renderProps)=>{
    if(error){
      res.status(500).send(error.message);
    }else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }else if (renderProps) {
      let html = renderToString(
        <Provider store={store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );
      html = renderFullPage(html, store.getState());
      res.status(200).send(html);
    }else {
      res.status(200).send(renderPage(assetsPath+req.url.substring(1,req.url.length)+".html"));
    }
  });
}
function renderFullPage(html, initialState) {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="shortcut icon" href="/favicon.ico">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui, maximum-scale=1.0, minimum-scale=1.0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no"/>
        <link type="text/css" rel="stylesheet" href="${assetsPath}/css/lib.css?c=2016"></link>
        <link type="text/css" rel="stylesheet" href="${assetsPath}/css/styles.css?c=2016"></link>
        <title>react同构</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="${assetsPath}/lib.js?c=2016"></script>
        <script src="${assetsPath}/app.js?c=2016"></script>
        <script type="text/javascript">
        </script>
      </body>
    </html>
  `;
}
function renderPage(filename){
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename).toString('utf8')
  }else {
    return "Server render was Not Found"
  }
}
app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
