import { ActionTypes } from './constants';


const defaultState = {
  sendToken: {
    at: undefined,
    status: undefined,
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.fetchSendSMSToken:
    case ActionTypes.fetchSendSMSTokenSuccess:
    case ActionTypes.fetchSendSMSTokenFailed:
    case ActionTypes.fetchSendSMSTokenPending:
      return Object.assign(state, { sendToken: { status: action.type, at: new Date().valueOf() }});
    default:
      return state;
  }
};