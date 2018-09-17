import { combineEpics , ofType } from 'redux-observable';
import { delay, mapTo } from 'rxjs/operators';

import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';

import * as actions from './actions';
import { ActionTypes as UIActionTypes } from './constants';


const hideDuringTransitionEpic = action$ => action$.pipe(
  ofType(
    AuthActionTypes.fetchVerifySMSTokenSuccess,
    AuthActionTypes.fetchVerifySMSTokenPending,
    AuthActionTypes.fetchVerifySMSTokenFailed,
  ),
  mapTo(actions.hideUI())
)

const showAfterTransitionEpic = action$ => action$.pipe(
  ofType(
    UIActionTypes.hideUI
  ),
  delay(200),
  mapTo(actions.showUI())
)

export default combineEpics(
  hideDuringTransitionEpic,
  showAfterTransitionEpic,
)