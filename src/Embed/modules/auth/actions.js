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