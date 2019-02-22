import { merge } from 'ramda';

import *  as SharedEventTypes from 'shared/eventTypes';


const defaultState = {
  currentUser: {
    data: null,
    status: null,
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SharedEventTypes.GET_CURRENT_USER_VIA_JWT:
    case SharedEventTypes.FETCH_CURRENT_USER_FAILED:
      return merge(
        state,
        { currentUser: merge(state.currentUser, { status: action.type })}
      );
    case SharedEventTypes.FETCH_CURRENT_USER_SUCCESS:
      return merge(
        state,
        { currentUser: merge(state.currentUser, { status: action.type, data: action.payload })},
      );
    default:
      return state;
  }
};