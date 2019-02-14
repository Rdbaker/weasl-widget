import { merge } from 'ramda';

import * as SharedEventTypes from 'shared/eventTypes';
import { ActionTypes } from './constants';


const defaultState = {
  clientId: null,
  debug: false,
  allowedDomain: null,
  hostDomain: null,
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case SharedEventTypes.INIT_IFRAME:
      const hostParts = action.payload.topHost.split(':')[0].split('.')
      const topLevelHost = hostParts.length > 1 ? hostParts.slice(1).join('.') : hostParts[0]
      return merge(state, { clientId: action.payload.clientId, hostDomain: topLevelHost });
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