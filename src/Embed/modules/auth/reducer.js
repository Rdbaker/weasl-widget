import { merge } from 'ramda';

import { ActionTypes } from 'modules/auth/constants';


const defaultState = {
  sendToken: {
    at: undefined,
    status: undefined,
  },
  loggedInOnInitGuess: undefined,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.fetchSendSMSTokenSuccess:
    case ActionTypes.fetchSendSMSTokenFailed:
    case ActionTypes.fetchSendSMSToken:
    case ActionTypes.fetchSendSMSTokenPending:
      return merge(state, { sendToken: { status: action.type, at: new Date().valueOf() }});
    case ActionTypes.setLoggedInOnInitGuess:
      return merge(state, { loggedInOnInitGuess: action.guess });
    default:
      return state;
  }
};