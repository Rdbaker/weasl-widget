import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import './index.css';
import App from './App';
import authReducer from 'modules/auth/reducer';
import uiEpic from 'modules/ui/epics';
import { DEBUG } from 'shared/resources';

document.domain = 'weasl.in';

library.add(faCheck);

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
  }),
  applyMiddleware(loggingMiddleware),
  applyMiddleware(epicMiddleware),
)

epicMiddleware.run(uiEpic)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
