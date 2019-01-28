import { ActionTypes } from './constants';
import * as SharedEventTypes from 'shared/eventTypes';

export const createShimEvent = (type, payload) => ({
  type,
  payload,
});

export const setCookie = (payload) => ({
  type: ActionTypes.setCookie,
  payload,
});

export const startAuthFlow = (payload) => ({
  type: SharedEventTypes.START_AUTH_FLOW,
  payload,
});

export const fetchCurrentUser = payload => ({
  type: SharedEventTypes.GET_CURRENT_USER_VIA_JWT,
  payload,
});

export const verifyDomain = payload => ({
  type: ActionTypes.verifyDomain,
  payload,
});

export const verifyDomainSuccess = () => ({
  type: ActionTypes.verifyDomainSuccess,
})

export const verifyDomainFailed = () => ({
  type: ActionTypes.verifyDomainFailed,
})