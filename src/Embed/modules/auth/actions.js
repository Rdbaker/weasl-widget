import { ActionTypes } from './constants';
import *  as SharedEventTypes from 'shared/eventTypes';

export const fetchSendSMSToken = (phone_number) => ({
  type: ActionTypes.fetchSendSMSToken,
  payload: { phone_number },
});

export const fetchSendSMSTokenPending = () => ({
  type: ActionTypes.fetchSendSMSTokenPending,
});

export const fetchSendSMSTokenFailed = () => ({
  type: ActionTypes.fetchSendSMSTokenFailed,
});

export const fetchSendSMSTokenSuccess = () => ({
  type: ActionTypes.fetchSendSMSTokenSuccess,
});

export const fetchVerifySMSToken = (token) => ({
  type: ActionTypes.fetchVerifySMSToken,
  token,
});

export const fetchVerifySMSTokenPending = () => ({
  type: ActionTypes.fetchVerifySMSTokenPending,
});

export const fetchVerifySMSTokenFailed = (err) => ({
  type: ActionTypes.fetchVerifySMSTokenFailed,
  err,
});

export const fetchVerifySMSTokenSuccess = () => ({
  type: ActionTypes.fetchVerifySMSTokenSuccess,
});

export const setLoggedInOnInitGuess = (guess) => ({
  type: ActionTypes.setLoggedInOnInitGuess,
  guess,
});

export const fetchCurrentUserSuccess = (data) => ({
  type: SharedEventTypes.FETCH_CURRENT_USER_SUCCESS,
  payload: data,
});

export const fetchCurrentUserFailed = (err) => ({
  type: SharedEventTypes.FETCH_CURRENT_USER_FAILED,
  payload: err,
});

export const fetchVerifyGoogle = (token) => ({
  type: ActionTypes.fetchVerifyGoogle,
  token,
});

