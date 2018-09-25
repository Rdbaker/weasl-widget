import { combineEpics, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { switchMap, mapTo, delay } from 'rxjs/operators';

import * as actions from './actions';
import * as SharedActionTypes from 'shared/eventTypes';


const hideDuringTransitionEpic = action$ => action$.pipe(
  ofType(SharedActionTypes.CHANGE_CONTAINER_CLASS),
  switchMap(({ classnames }) => {
    window.parent.postMessage({ type: SharedActionTypes.CHANGE_CONTAINER_CLASS, value: classnames}, '*');
    return of(actions.hideUI());
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