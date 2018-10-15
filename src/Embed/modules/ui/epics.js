import { combineEpics, ofType } from 'redux-observable';
import { switchMap, mapTo, delay, filter, map } from 'rxjs/operators';
import { path } from 'ramda';

import * as SharedActionTypes from 'shared/eventTypes';
import { INFO_MSG_CLASSNAME } from 'shared/iframeClasses';
import { IframeViews } from 'modules/ui/constants';
import { ActionTypes as AuthActionTypes } from 'modules/auth/constants';
import * as UIActions from 'modules/ui/actions';


const hideDuringTransitionEpic = (action$, store) => action$.pipe(
  ofType(SharedActionTypes.CHANGE_CONTAINER_CLASS),
  filter(action => path(['value', 'ui', 'lastSentContainerClass'], store) !== action.classnames),
  switchMap(({ classnames }) => {
    window.parent.postMessage({ type: SharedActionTypes.CHANGE_CONTAINER_CLASS, value: classnames}, '*');
    return [
      UIActions.hideUI(),
      UIActions.setLastSentContainerClass(classnames),
    ];
  }),
)

const showAfterTransitionEpic = action$ => action$.pipe(
  ofType(SharedActionTypes.CHANGE_CONTAINER_CLASS_DONE),
  delay(800),
  mapTo(UIActions.showUI())
)

const changeUIAfterVerify = action$ => action$.pipe(
  ofType(AuthActionTypes.fetchVerifySMSTokenSuccess),
  delay(500),
  switchMap(() => ([
    UIActions.changeContainerClass(INFO_MSG_CLASSNAME),
    UIActions.setViewAndType({ view: IframeViews.INFO_MSG, type: AuthActionTypes.fetchVerifySMSTokenSuccess }),
  ])),
)

export default combineEpics(
  hideDuringTransitionEpic,
  showAfterTransitionEpic,
  changeUIAfterVerify,
)