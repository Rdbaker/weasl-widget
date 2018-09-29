import { ActionTypes } from './constants';
import * as SharedEventTypes from 'shared/eventTypes';

export const createShimEvent = (type, payload) => ({
  type,
  payload,
})

export const setCookie = (payload) => ({
  type: ActionTypes.setCookie,
  payload,
})

export const startAuthFlow = (payload) => ({
  type: SharedEventTypes.START_AUTH_FLOW,
  payload,
})
