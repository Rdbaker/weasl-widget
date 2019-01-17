import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';

import './index.css';
import WeaslEmbed from './WeaslEmbed';
import authReducer from 'modules/auth/reducer';
import orgReducer from 'modules/org/reducer';
import uiReducer from 'modules/ui/reducer';
import shimReducer from 'modules/shim/reducer';
import uiEpic from 'modules/ui/epics';
import authEpic from 'modules/auth/epics';
import shimEpic from 'modules/shim/epics';
import orgEpic from 'modules/org/epics';
import { DEBUG } from 'shared/resources';

document.domain = 'weasl.in';

library.add(faCheck, faLock);

const mountSentry = () => {
  global.Sentry && global.Sentry.init && global.Sentry.init({ dsn: 'https://97578fdc26a2424083c16574e4d96091@sentry.io/1311809' });
};
setTimeout(mountSentry, 0);

const epicMiddleware = createEpicMiddleware();
const loggingMiddleware = store => next => action => {
  if (DEBUG || store.shim.debug) {
    console.info('[Weasl] applying action', action);
  }
  next(action);
}

const store = createStore(
  combineReducers({
    auth: authReducer,
    ui: uiReducer,
    org: orgReducer,
    shim: shimReducer,
  }),
  applyMiddleware(loggingMiddleware),
  applyMiddleware(epicMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
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
