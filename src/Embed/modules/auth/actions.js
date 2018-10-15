import { ActionTypes } from './constants';

export const fetchSendSMSToken = (phone_number) => ({
  type: ActionTypes.fetchSendSMSToken,
  payload: { phone_number },
})

export const fetchSendSMSTokenPending = () => ({
  type: ActionTypes.fetchSendSMSTokenPending,
})

export const fetchSendSMSTokenFailed = () => ({
  type: ActionTypes.fetchSendSMSTokenFailed,
})

export const fetchSendSMSTokenSuccess = () => ({
  type: ActionTypes.fetchSendSMSTokenSuccess,
})

export const fetchVerifySMSToken = (token) => ({
  type: ActionTypes.fetchVerifySMSToken,
  token,
})

export const fetchVerifySMSTokenPending = () => ({
  type: ActionTypes.fetchVerifySMSTokenPending,
})

export const fetchVerifySMSTokenFailed = (err) => ({
  type: ActionTypes.fetchVerifySMSTokenFailed,
  err,
})

export const fetchVerifySMSTokenSuccess = () => ({
  type: ActionTypes.fetchVerifySMSTokenSuccess,
})

export const setLoggedInOnInitGuess = (guess) => ({
  type: ActionTypes.setLoggedInOnInitGuess,
  guess,
})