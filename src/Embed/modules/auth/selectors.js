import { ActionTypes, IframeViews } from './constants';


const sendToken = state => state.loginFlow || {};

export const sendTokenStatus = state => sendToken(state).status;
export const sendTokenStatusPending = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenPending;
export const sendTokenStatusSuccess = state => sendToken(state).status === ActionTypes.fetchSendSMSTokenSuccess;

const root = state => state.auth || {};
const ui = state => root(state).ui || {};

export const uiView = state => ui(state).view;
export const uiHidden = state => ui(state).hidden;
export const showAuthModal = state => uiView(state) === IframeViews.AUTH_MODAL;
export const showInfoMsg = state => uiView(state) === IframeViews.INFO_MSG;
export const uiType = state => ui(state).type;
export const infoMsgSuccess = state => uiType(state) === ActionTypes.fetchVerifySMSTokenSuccess;
export const infoMsgPending = state => uiType(state) === ActionTypes.fetchVerifySMSTokenPending;
export const infoMsgFailed = state => uiType(state) === ActionTypes.fetchVerifySMSTokenFailed;