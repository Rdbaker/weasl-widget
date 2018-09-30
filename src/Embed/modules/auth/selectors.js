import { ActionTypes } from './constants';


const sendToken = state => state.loginFlow || {};

export const sendTokenStatus = state => sendToken(state).status;
export const sendTokenStatusPending = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenPending;
export const sendTokenStatusSuccess = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenSuccess;
export const getLoggedInOnInitGuess = state => state.loggedInOnInitGuess;