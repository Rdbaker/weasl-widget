import { combineEpics, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { switchMap, mapTo, delay, filter } from 'rxjs/operators';
import { path } from 'ramda';

import * as actions from './actions';
import * as SharedActionTypes from 'shared/eventTypes';


const hideDuringTransitionEpic = (action$, store) => action$.pipe(
  ofType(SharedActionTypes.CHANGE_CONTAINER_CLASS),
  filter(action => path(['value', 'ui', 'lastSentContainerClass'], store) !== action.classnames),
  switchMap(({ classnames }) => {
    window.parent.postMessage({ type: SharedActionTypes.CHANGE_CONTAINER_CLASS, value: classnames}, '*');
    return of([
      actions.hideUI(),
      actions.setLastSentContainerClass(action.classnames),
    ]);
  }),
)

const showAfterTransitionEpic = action$ => action$.pipe(
  ofType(SharedActionTypes.CHANGE_CONTAINER_CLASS_DONE),
  delay(800),
  mapTo(actions.showUI())
)

export default combineEpics(
  hideDuringTransitionEpic,
  showAfterTransitionEpic,
)