import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Sentry from '@sentry/browser';

import './index.css';
import WeaslEmbed from './WeaslEmbed';
import postMessageMiddleware from 'modules/shim/middleware';
import authReducer from 'modules/auth/reducer';
import orgReducer from 'modules/org/reducer';
import uiReducer from 'modules/ui/reducer';
import shimReducer from 'modules/shim/reducer';
import userReducer from 'modules/user/reducer';
import uiEpic from 'modules/ui/epics';
import authEpic from 'modules/auth/epics';
import shimEpic from 'modules/shim/epics';
import orgEpic from 'modules/org/epics';
import { DEBUG, SENTRY_DSN } from 'shared/resources';

document.domain = 'weasl.in';

library.add(faCheck, faLock);

const mountSentry = () => {
  Sentry.init({ dsn: SENTRY_DSN });
};
setTimeout(mountSentry, 0);

const epicMiddleware = createEpicMiddleware();
const loggingMiddleware = store => next => action => {
  if (DEBUG || store.getState().shim.debug) {
    console.info('[Weasl] applying action', action);
  }
  next(action);
}
const compose = composeWithDevTools({ trace: true, traceLimit: 25 });

const store = createStore(
  combineReducers({
    auth: authReducer,
    ui: uiReducer,
    org: orgReducer,
    shim: shimReducer,
    user: userReducer,
  }),
  compose(
    applyMiddleware(loggingMiddleware),
    applyMiddleware(epicMiddleware),
    applyMiddleware(postMessageMiddleware),
  ),
);

if (DEBUG) {
  window.store = store;
}

epicMiddleware.run(
  combineEpics(
    uiEpic,
    shimEpic,
    authEpic,
    orgEpic,
  )
)

ReactDOM.render(
  <Provider store={store}>
    <WeaslEmbed />
  </Provider>,
  document.getElementById('app')
);
