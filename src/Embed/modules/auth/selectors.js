import { ActionTypes } from './constants';


const sendToken = state => state.loginFlow || {};

export const sendTokenStatus = state => sendToken(state).status;
export const sendTokenStatusPending = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenPending;
export const sendTokenStatusSuccess = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenSuccess;

const ui = state => state.ui || {};

export const showAuthModal = state => ui(state).showModal
export const authModalType = state => ui(state).flowType