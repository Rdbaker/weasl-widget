import { merge } from 'ramda';

import * as SharedEventTypes from 'shared/eventTypes';
import { ActionTypes } from './constants';


const defaultState = {
  clientId: null,
  debug: false,
  allowedDomain: null,
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case SharedEventTypes.INIT_IFRAME:
      return merge(state, { clientId: action.payload.clientId });
    case SharedEventTypes.SET_DEBUG_MODE:
      return merge(state, { debug: action.payload });
    case ActionTypes.verifyDomainFailed:
      return merge(state, { allowedDomain: false });
    case ActionTypes.verifyDomainSuccess:
      return merge(state, { allowedDomain: true });
    default:
      return state;
  }
}