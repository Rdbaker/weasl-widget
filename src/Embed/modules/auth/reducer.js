import { merge } from 'ramda';

import { ActionTypes, IframeViews } from './constants';
import { ActionTypes as UIActionTypes } from 'modules/ui/constants';
import { ActionTypes as ShimActionTypes } from 'modules/shim/constants';


const defaultState = {
  sendToken: {
    at: undefined,
    status: undefined,
  },
  ui: {
    view: IframeViews.NONE,
    type: undefined,
    hidden: false,
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case UIActionTypes.hideUI:
      return merge(
        state,
        merge(
          state.ui,
          { hidden: true }
        )
      )
    case UIActionTypes.showUI:
      return merge(
        state,
        merge(
          state.ui,
          { hidden: false }
        )
      )
    case ActionTypes.fetchSendSMSTokenSuccess:
    case ActionTypes.fetchSendSMSTokenFailed:
    case ActionTypes.fetchSendSMSToken:
    case ActionTypes.fetchSendSMSTokenPending:
      return merge(state, { sendToken: { status: action.type, at: new Date().valueOf() }});
    case ShimActionTypes.startLoginFlow:
      return merge(state, { ui: { view: IframeViews.AUTH_MODAL, type: action.payload }});
    case ActionTypes.fetchVerifySMSTokenSuccess:
    case ActionTypes.fetchVerifySMSTokenPending:
    case ActionTypes.fetchVerifySMSTokenFailed:
      return merge(state, {
        ui: {
          view: IframeViews.INFO_MSG,
          type: action.type,
        }
      })
    default:
      return state;
  }
};