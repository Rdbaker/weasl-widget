import { merge } from 'ramda';

import *  as SharedEventTypes from 'shared/eventTypes';


const defaultState = {
  clientId: null,
  debug: false,
}


export default (state = defaultState, action) => {
  switch (action.type) {
    case SharedEventTypes.INIT_IFRAME:
      return merge(state, { clientId: action.payload.clientId });
    case SharedEventTypes.SET_DEBUG_MODE:
      return merge(state, { debug: action.payload });
    default:
      return state;
  }
}