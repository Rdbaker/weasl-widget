import { IframeViews } from './constants';
import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';


const root = state => state.ui || {};

export const uiView = state => root(state).view;
export const uiHidden = state => root(state).hidden;
export const lastSentContainerClass = state => root(state).lastSentContainerClass;
export const showAuthModal = state => uiView(state) === IframeViews.AUTH_MODAL;
export const showInfoMsg = state => uiView(state) === IframeViews.INFO_MSG;
export const uiType = state => root(state).type;
export const infoMsgSuccess = state => [
  AuthActionTypes.fetchVerifySMSTokenSuccess,
  AuthActionTypes.fetchVerifyEmailTokenSuccess,
].includes(uiType(state));
export const infoMsgPending = state => uiType(state) === AuthActionTypes.fetchVerifySMSTokenPending;
export const infoMsgFailed = state => uiType(state) === AuthActionTypes.fetchVerifySMSTokenFailed;