import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';

import './index.css';
import App from './App';
import authReducer from 'modules/auth/reducer';
import orgReducer from 'modules/org/reducer';
import uiReducer from 'modules/ui/reducer';
import uiEpic from 'modules/ui/epics';
import authEpic from 'modules/auth/epics';
import shimEpic from 'modules/shim/epics';
import { DEBUG } from 'shared/resources';

document.domain = 'weasl.in';

library.add(faCheck, faLock);

const mountSentry = () => {
  global.Sentry && global.Sentry.init && global.Sentry.init({ dsn: 'https://97578fdc26a2424083c16574e4d96091@sentry.io/1311809' });
};
setTimeout(mountSentry, 0);

const epicMiddleware = createEpicMiddleware();
const loggingMiddleware = store => next => action => {
  if (DEBUG) {
    console.info('applying action to store');
    console.info(action);
  }
  next(action);
}

const store = createStore(
  combineReducers({
    auth: authReducer,
    ui: uiReducer,
    org: orgReducer,
  }),
  applyMiddleware(epicMiddleware),
  applyMiddleware(loggingMiddleware),
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
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
