import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import authReducer from 'modules/auth/reducer';
import { DEBUG } from 'shared/resources';

document.domain = 'weasl.in';

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
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
