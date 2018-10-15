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
import uiReducer from 'modules/ui/reducer';
import uiEpic from 'modules/ui/epics';
import authEpic from 'modules/auth/epics';
import shimEpic from 'modules/shim/epics';
import { DEBUG } from 'shared/resources';

document.domain = 'weasl.in';

library.add(faCheck, faLock);

const epicMiddleware = createEpicMiddleware();
const loggingMiddleware = store => next => action => {
  if (DEBUG) {
    console.info('applying action to store')
    console.info(action)
  }
  next(action)
}

const store = createStore(
  combineReducers({
    auth: authReducer,
    ui: uiReducer,
  }),
  applyMiddleware(loggingMiddleware),
  applyMiddleware(epicMiddleware),
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
