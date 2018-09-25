import { merge } from 'ramda';

import { ActionTypes } from 'modules/auth/constants';


const defaultState = {
  sendToken: {
    at: undefined,
    status: undefined,
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.fetchSendSMSTokenSuccess:
    case ActionTypes.fetchSendSMSTokenFailed:
    case ActionTypes.fetchSendSMSToken:
    case ActionTypes.fetchSendSMSTokenPending:
      return merge(state, { sendToken: { status: action.type, at: new Date().valueOf() }});
    default:
      return state;
  }
};