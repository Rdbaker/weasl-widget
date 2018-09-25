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

export const startLoginFlow = (payload) => ({
  type: SharedEventTypes.START_LOGIN_FLOW,
  payload,
})

export const startRegisterFlow = (payload) => ({
  type: SharedEventTypes.START_SIGNUP_FLOW,
  payload,
})