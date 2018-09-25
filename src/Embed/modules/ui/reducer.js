import { merge } from 'ramda';

import { ActionTypes as UIActionTypes, IframeViews } from 'modules/ui/constants';


const defaultState = {
  hidden: false,
  view: IframeViews.NONE,
  type: undefined,
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case UIActionTypes.hideUI:
      return merge(state, { hidden: true });
    case UIActionTypes.showUI:
      return merge(state, { hidden: false });
    case UIActionTypes.setView:
      return merge(state, { view: action.view });
    case UIActionTypes.setType:
      return merge(state, { type: action.viewType });
    case UIActionTypes.setViewAndType:
      return merge(state, { type: action.viewType, view: action.view });
    default:
      return state;
  }
}