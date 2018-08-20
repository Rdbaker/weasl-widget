import { ActionTypes } from './constants';
import { ActionTypes as ShimActionTypes } from 'modules/shim/constants';
import { AuthType, AuthStep } from 'components/AuthModal/component';


const defaultState = {
  sendToken: {
    at: undefined,
    status: undefined,
  },
  ui: {
    showModal: false,
    flowType: undefined,
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.fetchSendSMSToken:
    case ActionTypes.fetchSendSMSTokenSuccess:
    case ActionTypes.fetchSendSMSTokenFailed:
    case ActionTypes.fetchSendSMSTokenPending:
      return Object.assign(state, { sendToken: { status: action.type, at: new Date().valueOf() }});
    case ShimActionTypes.startLoginFlow:
      return Object.assign(state, { ui: { showModal: true, flowType: AuthType.LOGIN }});
    default:
      return state;
  }
};